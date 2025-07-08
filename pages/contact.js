import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus(result.message || 'Failed to send message');
      }
    } catch (err) {
      console.error(err);
      setStatus('Error occurred. Try again later.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 grid md:grid-cols-2 gap-10 items-start">
      {/* Left Side: Contact Details */}
      <div className="mb-6 md:mb-0">
  <h2 className="text-2xl font-bold mb-4 text-[#B91C1C]">Our Contact Details</h2>
  <p className="mb-2">📍 <strong>Location:</strong> Toronto, Canada</p>
  <p className="mb-2">📞 <strong>Phone:</strong> +1 234-567-890</p>
  <p className="mb-2">📧 <strong>Email:</strong> contact@shubhavasar.com</p>
  <div className="mt-4">
    <h3 className="text-lg font-semibold mb-1">🕒 Working Hours</h3>
    <p>Monday – Friday: 10:00 AM – 7:00 PM</p>
    <p>Saturday: 11:00 AM – 5:00 PM</p>
    <p>Sunday: Closed</p>
  </div>
</div>


      {/* Right Side: Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-md shadow-md border border-gray-100">
        <label className="block">
          <span className="text-gray-700 font-semibold">Name *</span>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 border-gray-300"
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-semibold">Email *</span>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 border-gray-300"
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-semibold">Message *</span>
          <textarea
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 border-gray-300"
            rows="5"
          ></textarea>
        </label>

        <button
          type="submit"
          className="bg-[#F76C6C] hover:bg-[#d85757] text-white px-6 py-2 rounded-md"
        >
          Submit
        </button>

        {status && <p className="text-sm mt-2 text-gray-600">{status}</p>}
      </form>
    </div>
  );
}
