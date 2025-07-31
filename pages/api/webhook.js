import { buffer } from 'micro';
import Stripe from 'stripe';
import admin from 'firebase-admin';
import { sendOrderConfirmationEmail } from "@/lib/sendOrderEmail";


export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
});

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  let event;

  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buf = Buffer.concat(chunks);

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET.trim();

    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    //console.log('✅ Event verified:', event.type);
  } catch (err) {
    console.error('❌ Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userUid = session.metadata?.userUid;

    if (!userUid) {
      console.error('❗ Missing userUid in metadata');
      return res.status(200).end();
    }

    try {
      // Generate custom readable order number
      const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14); // e.g. 20250722165300
      const orderNumber = `ORD-${timestamp}`;

      // Use Firestore auto-ID and add orderNumber + stripeSessionId
      const orderRef = admin.firestore().collection('orders').doc();
      await orderRef.set({
        orderId: orderRef.id,
        stripeSessionId: session.id,
        orderNumber,
        userUid,
        email: session.customer_email || null,
        fullName: session.metadata?.fullName || null,
        phone: session.metadata?.phone || null,
        address: session.metadata?.address || null,
        city: session.metadata?.city || null,
        province: session.metadata?.province || null,
        country: session.metadata?.country || null,
        postalCode: session.metadata?.postalCode || null,
        currency: session.currency || session.metadata?.currency || null,
        exchangeRate: parseFloat(session.metadata?.exchangeRate || '1'),
        amountTotal: (session.amount_total ?? 0) / 100,
        itemCount: parseInt(session.metadata?.itemCount || '0', 10),
        createdAt: admin.firestore.Timestamp.now(),
        status: 'paid',
        items: session.metadata?.cartItems
          ? JSON.parse(session.metadata.cartItems)
          : [],
      });

      await admin.firestore().collection('users').doc(userUid).set(
        {
          hasMadeOrder: true,
          lastOrderAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      //console.log(`✅ Order stored for user ${userUid} with Order #${orderNumber}`);
      await sendOrderConfirmationEmail({
  to: session.customer_email,
  name: session.metadata?.fullName || "Customer",
  orderId: orderRef.id,
  items: JSON.parse(session.metadata?.cartItems || "[]"),
  amount: (session.amount_total || 0) / 100,
  currency: session.currency || "cad",
});

    } catch (err) {
      console.error('❌ Error saving order to Firestore:', err);
    }
  }

  res.status(200).end();
}
