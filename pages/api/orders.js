import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default async function handler(req, res) {
  const { userUid } = req.query;

  if (!userUid) {
    return res.status(400).json({ error: 'Missing userUid' });
  }

  try {
    const ordersSnapshot = await admin
      .firestore()
      .collection('orders')
      .where('userUid', '==', userUid)
      .orderBy('createdAt', 'desc')
      .get();

    const orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({ orders });
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
}
