import Link from "next/link";

export default function LegalPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-4xl font-bold text-center text-[#B91C1C] mb-12">
        Privacy Policy & Terms of Service
      </h1>

      {/* PRIVACY POLICY */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4 text-[#1B263B]">Privacy Policy</h2>
        <p className="mb-4">
          At <strong>Shubh Avasar</strong>, your privacy is important to us. We collect only the necessary
          information to process your orders and provide you with the best shopping experience.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">What We Collect</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Your name, email address, and shipping address</li>
          <li>Payment and order information</li>
          <li>Optional contact details such as phone number</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-2">How We Use Your Data</h3>
        <p>
          We use your information to fulfill your orders, respond to inquiries, and occasionally send promotional emails
          (if you&aposve opted in). Your data is never sold or shared with third parties without your consent.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">Cookies</h3>
        <p>
          We use cookies to improve site performance and personalize your experience. You may disable cookies in your browser settings.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">Data Protection</h3>
        <p>
          We implement industry-standard security practices to protect your data. However, no method of transmission over the internet is 100% secure.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">Contact</h3>
        <p>
          If you have questions about our privacy practices, please <Link href="/contact" className="text-[#F76C6C] underline">contact us</Link>.
        </p>
      </section>

      {/* TERMS & CONDITIONS */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-[#1B263B]">Terms & Conditions</h2>
        <p className="mb-4">
          By using this website, you agree to the following terms and conditions. Please read them carefully.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">1. Use of Site</h3>
        <p>
          This site is intended for personal shopping use. Any misuse or unauthorized commercial use is prohibited.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">2. Product Availability</h3>
        <p>
          While we strive to keep stock updated, product availability is not guaranteed. In case of out-of-stock items after purchase,
          we’ll notify you and issue a refund.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">3. Pricing</h3>
        <p>
          All prices are in your selected currency and may be subject to change without notice.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">4. Returns & Exchanges</h3>
        <p>
          Please review our return policy before making a purchase. Customized or final-sale items may not be eligible for return.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">5. Intellectual Property</h3>
        <p>
          All content on this site including text, graphics, and images are property of <strong>Shubh Avasar</strong> and may not be reused without permission.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">6. Contact</h3>
        <p>
          For questions or concerns, please <Link href="/contact" className="text-[#F76C6C] underline">contact our support team</Link>.
        </p>
      </section>
    </div>
  );
}
