import nodemailer from 'nodemailer';

export async function sendOrderConfirmationEmail({ to, name, orderId, items, amount, currency }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const itemList = items
    .map((item) => `• ${item.name} x ${item.qty} (${item.size || 'Standard'}) - ₹${item.price}`)
    .join('\n');

  const mailOptions = {
    from: `"Shubh Avasar" <${process.env.EMAIL_USER}>`,
    to,
    bcc: process.env.NOTIFY_EMAIL,
    subject: `🧾 Your Order Confirmation - #${orderId}`,
    text: `
Hi ${name},

Thank you for your purchase! 🎉

🧾 Order ID: ${orderId}
💰 Total: ₹${amount.toFixed(2)} ${currency.toUpperCase()}

🛍️ Items:
${itemList}

We'll notify you when your order ships.

Warm regards,  
Shubh Avasar Team ❤️
    `,
  };

  await transporter.sendMail(mailOptions);
}
