import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+1',
    phone: '',
    message: '',
  });

  const [status, setStatus] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'phone') setPhoneError('');
    if (name === 'email') setEmailError(false);
  };

  const validatePhone = () => {
    if (formData.phone.trim() === '') return true; // Optional field
    const isValid = /^\d{10}$/.test(formData.phone.trim());
    if (!isValid) {
      setPhoneError('Phone number must be exactly 10 digits');
    }
    return isValid;
  };

  const validateEmail = () => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = pattern.test(formData.email.trim());
    if (!isValid) {
      setEmailError(true);
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');

    const isPhoneValid = validatePhone();
    const isEmailValid = validateEmail();
    if (!isPhoneValid || !isEmailValid) return;

    setStatus('Sending...');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone ? `${formData.countryCode}${formData.phone}` : '',
          message: formData.message,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', countryCode: '+1', phone: '', message: '' });
        setPhoneError('');
        setEmailError(false);
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
      {/* Left Side */}
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
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-md shadow-md border border-gray-100" noValidate>
        {/* Name */}
        <label className="block">
          <span className="text-gray-700 font-semibold">
            Name <span className="text-[#F76C6C]">*</span>
          </span>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 border-gray-300"
          />
        </label>

        {/* Email (changed type to text, removed native validation) */}
        <label className="block">
          <span className="text-gray-700 font-semibold">
            Email <span className="text-[#F76C6C]">*</span>
          </span>
          <input
            type="text" // changed from "email" to "text" to disable native validation
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full border rounded-md p-2 border-gray-300 ${
              emailError ? 'border-[#F76C6C]' : ''
            }`}
            placeholder="johndoe@domain.com"
          />
          {emailError && (
            <p className="text-[#F76C6C] text-sm mt-1">
              Please enter a valid email address (Ex: johndoe@domain.com).
            </p>
          )}
        </label>

        {/* Phone */}
        <label className="block">
          <span className="text-gray-700 font-semibold">
            Phone <span className="text-sm text-gray-500">(optional)</span>
          </span>
          <div className="flex gap-2 mt-1">
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              className="w-1/3 border border-gray-300 rounded-md p-2"
            >
              <option value="+1">🇺🇸 +1</option>
              <option value="+91">🇮🇳 +91</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+61">🇦🇺 +61</option>
            </select>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-2/3 border rounded-md p-2 ${
                phoneError ? 'border-[#F76C6C]' : 'border-gray-300'
              }`}
              placeholder="10-digit number"
              inputMode="numeric"
            />
          </div>
          {phoneError && <p className="text-[#F76C6C] text-sm mt-1">{phoneError}</p>}
        </label>

        {/* Message */}
        <label className="block">
          <span className="text-gray-700 font-semibold">
            Message <span className="text-[#F76C6C]">*</span>
          </span>
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
