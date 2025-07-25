import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { name, email, phone, address, preferredDate, requirements } = req.body;

  if (!name || !email || !phone || !address || !preferredDate) {
    return res.status(400).json({ message: 'All required fields must be filled.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'Shubhavsarboutique@gmail.com',
      subject: `New Home Visit Booking - ${name}`,
      html: `
        <h2>Home Visit Booking Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Preferred Date:</strong> ${preferredDate}</p>
        <p><strong>Requirements:</strong><br>${requirements || 'N/A'}</p>
      `,
    });

    // Confirmation to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Home Visit Request Confirmation',
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for booking a home visit with Shubh Avsar Boutique.</p>
        <p>We’ve received your request and will get back to you soon.</p>
        <p><strong>Date:</strong> ${preferredDate}<br><strong>Address:</strong> ${address}</p>
        <p>Best regards,<br>Shubh Avsar Boutique Team</p>
      `,
    });

    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Email sending failed' });
  }
}
