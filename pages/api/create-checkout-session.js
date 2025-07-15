import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { cartItems, deliveryInfo } = req.body;

  const FIRST_ORDER_DISCOUNT_RATE = 0.1;
  const CUSTOM_SIZE_CHARGE = 15;

  try {
    // 1. Calculate base product subtotal
    const baseSubtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    // 2. Calculate customization fee (per qty)
    const customizationFee = cartItems.reduce((sum, item) => {
      return (
        sum +
        (item.selectedSize?.toLowerCase() === "custom size"
          ? CUSTOM_SIZE_CHARGE * item.qty
          : 0)
      );
    }, 0);

    // 3. Calculate shipping fee
    const shippingFee = deliveryInfo.postalCode?.toUpperCase().startsWith("M")
      ? 0
      : 5;

    // 4. Find or create Stripe customer by email
    let customers = await stripe.customers.list({
      email: deliveryInfo.email,
      limit: 1,
    });

    let customer = customers.data[0];
    if (!customer) {
      customer = await stripe.customers.create({
        email: deliveryInfo.email,
        name: deliveryInfo.fullName,
        phone: deliveryInfo.phone,
        address: {
          line1: deliveryInfo.address,
          city: deliveryInfo.city,
          state: deliveryInfo.province,
          country: deliveryInfo.country === "USA" ? "US" : "CA",
          postal_code: deliveryInfo.postalCode,
        },
      });
    }

    // 5. Check for previous payments to determine if first order
    const charges = await stripe.charges.list({
      customer: customer.id,
      limit: 1,
    });
    const isFirstOrder = charges.data.length === 0;

    // 6. Calculate discount only if first order (on product subtotal only)
    const discountAmount = isFirstOrder
      ? baseSubtotal * FIRST_ORDER_DISCOUNT_RATE
      : 0;

    // 7. Discount ratio (to apply per product)
    const discountRatio = discountAmount > 0 ? discountAmount / baseSubtotal : 0;

    // 8. Build Stripe line items array with discounted prices, original price in name
    const line_items = cartItems.map((item) => {
      const discountedPrice = item.price * (1 - discountRatio);

      return {
        price_data: {
          currency: "cad",
          product_data: {
            name: `${item.name} (was $${item.price.toFixed(2)})`,
            images: [item.image || ""],
            metadata: {
              color: item.selectedColor,
              size: item.selectedSize,
            },
          },
          unit_amount: Math.round(discountedPrice * 100),
        },
        quantity: item.qty,
      };
    });

    // 9. Add customization fee (if any)
    if (customizationFee > 0) {
      line_items.push({
        price_data: {
          currency: "cad",
          product_data: { name: "Customization Fee" },
          unit_amount: Math.round(customizationFee * 100),
        },
        quantity: 1,
      });
    }

    // 10. Add shipping fee (if any)
    if (shippingFee > 0) {
      line_items.push({
        price_data: {
          currency: "cad",
          product_data: { name: "Shipping Fee" },
          unit_amount: Math.round(shippingFee * 100),
        },
        quantity: 1,
      });
    }

    // 11. Calculate tax on discounted subtotal + fees (not discount)
    const subtotalBeforeTax =
      baseSubtotal * (1 - discountRatio) + customizationFee + shippingFee;
    const tax = subtotalBeforeTax * 0.13;

    // 12. Add tax line item (if > 0)
    if (tax > 0) {
      line_items.push({
        price_data: {
          currency: "cad",
          product_data: { name: "HST (13%)" },
          unit_amount: Math.round(tax * 100),
        },
        quantity: 1,
      });
    }

    // 13. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cart`,
      customer: customer.id,
      line_items,
      metadata: {
        fullName: deliveryInfo.fullName,
        phone: deliveryInfo.phone,
        address: deliveryInfo.address,
        city: deliveryInfo.city,
        province: deliveryInfo.province,
        country: deliveryInfo.country,
        postalCode: deliveryInfo.postalCode,
      },
    });

    return res.status(200).json({ id: session.id });
  } catch (err) {
    console.error("Stripe session creation failed:", err);
    return res.status(500).json({ error: err.message });
  }
}
