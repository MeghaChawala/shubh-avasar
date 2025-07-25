import { useState } from 'react';

export default function HomeVisitPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    preferredDate: '',
    requirements: '',
  });

  const [status, setStatus] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'phone') setPhoneError('');
    if (name === 'email') setEmailError(false);
  };

  const validateEmail = () => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = pattern.test(formData.email.trim());
    if (!valid) setEmailError(true);
    return valid;
  };

  const validatePhone = () => {
    const valid = /^\d{10}$/.test(formData.phone.trim());
    if (!valid) setPhoneError('Phone number must be 10 digits');
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');

    if (!validateEmail() || !validatePhone()) return;
    // Validate preferred date
    const selectedDate = new Date(formData.preferredDate);
    selectedDate.setHours(0, 0, 0, 0);
    console.log(selectedDate)
    const today = new Date();
    console.log(today)
    today.setHours(0, 0, 0, 0); // Set time to 00:00:00 for comparison

    if (selectedDate < today) {
      setStatus('Please select a future date for the appointment.');
      return;
    }

    try {
      setStatus('Sending...');
      const res = await fetch('/api/home-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        setStatus('Your request was submitted successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          preferredDate: '',
          requirements: '',
        });
      } else {
        setStatus(result.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      setStatus('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 grid md:grid-cols-2 gap-10 items-start">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-[#B91C1C]">Book a Home Visit</h2>
        <p className="mb-3">We’ll come to your place with personalized service.</p>
        <p className="mb-2">📞 +1 (437) 264-6555</p>
        <p className="mb-2">📧 Shubhavsarboutique@gmail.com</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-md shadow-md border border-gray-100">
        <label className="block">
          <span className="text-gray-700 font-semibold">Name *</span>
          <input type="text" name="name" required value={formData.name} onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 border-gray-300" />
        </label>

        <label className="block">
          <span className="text-gray-700 font-semibold">Email *</span>
          <input type="text" name="email" required value={formData.email} onChange={handleChange}
            className={`mt-1 block w-full border rounded-md p-2 ${emailError ? 'border-[#F76C6C]' : 'border-gray-300'}`} />
          {emailError && <p className="text-[#F76C6C] text-sm mt-1">Enter a valid email address.</p>}
        </label>

        <label className="block">
          <span className="text-gray-700 font-semibold">Phone *</span>
          <input type="tel" name="phone" required value={formData.phone} onChange={handleChange}
            className={`mt-1 block w-full border rounded-md p-2 ${phoneError ? 'border-[#F76C6C]' : 'border-gray-300'}`} />
          {phoneError && <p className="text-[#F76C6C] text-sm mt-1">{phoneError}</p>}
        </label>

        <label className="block">
          <span className="text-gray-700 font-semibold">Address *</span>
          <textarea name="address" required rows="2" value={formData.address} onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 border-gray-300" />
        </label>

        <label className="block">
          <span className="text-gray-700 font-semibold">Preferred Date *</span>
          <input type="date" name="preferredDate" required value={formData.preferredDate} onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 border-gray-300" min={new Date().toISOString().split('T')[0]} />
        </label>

        <label className="block">
          <span className="text-gray-700 font-semibold">Any Specific Requirements</span>
          <textarea name="requirements" rows="3" value={formData.requirements} onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 border-gray-300" />
        </label>

        <button type="submit" className="bg-[#F76C6C] hover:bg-[#d85757] text-white px-6 py-2 rounded-md">
          Book Now
        </button>

        {status && <p className="text-sm mt-2 text-gray-600">{status}</p>}
      </form>
    </div>
  );
}
