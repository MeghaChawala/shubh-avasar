// pages/api/contact.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Setup transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,   // yourbusiness@gmail.com
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email to business
  const businessMail = {
    from: `"Shubh Avasar Website" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: `Enquiry from ${name}`,
    text: `📩 New enquiry submitted:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  // Email to sender (confirmation)
  const confirmationMail = {
    from: `"Shubh Avasar" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Thank you for contacting Shubh Avasar`,
    text: `Hi ${name},\n\nThank you for reaching out to us. We've received your message and will get back to you shortly.\n\nHere's what you sent:\n\n"${message}"\n\nWith love,\nShubh Avasar Team ❤️`,
  };

  try {
    // Send both emails
    await Promise.all([
      transporter.sendMail(businessMail),
      transporter.sendMail(confirmationMail),
    ]);

    res.status(200).json({ success: true, message: 'Enquiry sent!' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
}
