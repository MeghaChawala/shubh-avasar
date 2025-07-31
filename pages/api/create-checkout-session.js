// /api/create-checkout-session.js

import Stripe from "stripe";
import { getAuth } from "firebase-admin/auth";
import { getApps, initializeApp, cert,applicationDefault } from "firebase-admin/app";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});
const EXCHANGE_API = "https://open.er-api.com/v6/latest/CAD";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  let { cartItems, deliveryInfo } = req.body;
  const CUSTOM_SIZE_CHARGE = 15;

  try {
    const authHeader = req.headers.authorization || "";
    const idToken = authHeader.startsWith("Bearer ") ? authHeader.split("Bearer ")[1] : null;
    let userId = null;

    if (idToken) {
      try {
        const decoded = await getAuth().verifyIdToken(idToken);
        deliveryInfo.email = decoded.email;
        userId = decoded.uid;
      } catch (err) {
        console.warn("Failed to verify Firebase token:", err.message);
      }
    }

    let currency = "cad";
    let exchangeRate = 1;

    if (deliveryInfo.country === "USA" || deliveryInfo.country === "US") {
      const resp = await fetch(EXCHANGE_API);
      const json = await resp.json();
      exchangeRate = json.rates?.USD || 1;
      currency = "usd";
    }

    const baseSubtotalCAD = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const baseSubtotal = baseSubtotalCAD * exchangeRate;

    const customizationFeeCAD = cartItems.reduce((sum, item) => {
      return sum + (item.selectedSize?.toLowerCase() === "custom size" ? CUSTOM_SIZE_CHARGE * item.qty : 0);
    }, 0);
    const customizationFee = customizationFeeCAD * exchangeRate;

    const shippingFeeCAD = deliveryInfo.postalCode?.toUpperCase().startsWith("M") ? 0 : 5;
    const shippingFee = shippingFeeCAD * exchangeRate;

    const line_items = cartItems.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
          images: [item.image || ""],
          metadata: {
            color: item.selectedColor,
            size: item.selectedSize,
          },
        },
        unit_amount: Math.round(item.price * exchangeRate * 100),
      },
      quantity: item.qty,
    }));

    if (customizationFee > 0) {
      line_items.push({
        price_data: {
          currency,
          product_data: { name: "Customization Fee" },
          unit_amount: Math.round(customizationFee * 100),
        },
        quantity: 1,
      });
    }

    if (shippingFee > 0) {
      line_items.push({
        price_data: {
          currency,
          product_data: { name: "Shipping Fee" },
          unit_amount: Math.round(shippingFee * 100),
        },
        quantity: 1,
      });
    }

    const tax = (baseSubtotal + customizationFee + shippingFee) * 0.13;
    if (tax > 0) {
      line_items.push({
        price_data: {
          currency,
          product_data: { name: "HST (13%)" },
          unit_amount: Math.round(tax * 100),
        },
        quantity: 1,
      });
    }

    const metadata = {
      userUid: userId || "",
      fullName: deliveryInfo.fullName || "",
      phone: deliveryInfo.phone || "",
      address: deliveryInfo.address || "",
      city: deliveryInfo.city || "",
      province: deliveryInfo.province || "",
      country: deliveryInfo.country || "",
      postalCode: deliveryInfo.postalCode || "",
      currency,
      exchangeRate: exchangeRate.toString(),
      itemCount: cartItems.length.toString(),
      // Optional: comment out if your cart is large
      cartItems: JSON.stringify(cartItems.map(i => ({
  id: i.id,                  // Product ID
  name: i.name,
  qty: i.qty,
  price: i.price,
  image: i.image || "",      // ✅ Add image URL
  productId: i.id || "",     // ✅ Explicit product ID (if different)
  color: i.selectedColor,
  size: i.selectedSize
}))),

    };
//console.log("Metadata being sent to Stripe:", metadata);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cart`,
      customer_email: deliveryInfo.email,
      line_items,
      metadata,
    });

    return res.status(200).json({ id: session.id });
  } catch (err) {
    console.error("Stripe session creation failed:", err);
    return res.status(500).json({ error: err.message });
  }
}
