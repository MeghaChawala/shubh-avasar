import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-4xl font-bold mb-12 text-[#B91C1C] text-center">About Shubh Avasar</h1>

      {/* Our Story */}
      <section className="mb-16 flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold mb-3">Our Story</h2>
          <p>
            Founded in 2025, Shubh Avasar was created with a fresh vision — to celebrate India’s rich cultural heritage through elegant and contemporary clothing. We blend time-honored craftsmanship with modern aesthetics to offer festive and everyday wear that feels both timeless and trend-forward.
Whether you're dressing for tradition or today, we're here to bring beauty, comfort, and meaning to every outfit.
          </p>
        </div>
        <div className="w-full md:w-1/2">
          <Image
            src="/images/story.webp"
            alt="Our story"
            width={600}
            height={400}
            className="rounded-lg w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Mission */}
      <section className="mb-16 flex flex-col-reverse md:flex-row items-center gap-8">
        <div className="w-full md:w-1/2">
          <Image
            src="/images/mission.webp"
            alt="Our mission"
            width={600}
            height={400}
            className="rounded-lg w-full h-auto object-cover"
          />
        </div>
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
          <p>
            We strive to connect people with their roots by offering high-quality, handcrafted apparel that honors Indian culture
            while embracing contemporary fashion trends.
          </p>
        </div>
      </section>

      {/* What We Offer */}
      <section className="mb-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
        <p className="mb-6">
          From elegant kurtas and lehengas to festive collections and casual dresses, our curated range caters to all occasions.
          Every piece is designed with care and attention to detail.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          <Image src="/images/lehenga.webp" alt="Lehenga" width={300} height={300} className="rounded-lg w-full h-auto object-cover" />
          <Image src="/images/kurta.webp" alt="Kurta" width={300} height={300} className="rounded-lg w-full h-auto object-cover" />
          <Image src="/images/dress.webp" alt="Dress" width={300} height={300} className="rounded-lg w-full h-auto object-cover" />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-3">Why Choose Us?</h2>
        <ul className="list-disc list-inside space-y-2 pl-2">
          <li>Premium quality fabrics and stitching</li>
          <li>Authentic Indian designs with a modern twist</li>
          <li>Dedicated customer support and satisfaction</li>
          <li>Sustainable and ethical sourcing</li>
        </ul>
      </section>

      {/* Call to Action */}
      <section className="text-center mt-16">
        <h2 className="text-2xl font-semibold mb-3">Get in Touch</h2>
        <p className="mb-2">
          Interested in learning more?{" "}
          <Link href="/contact" className="text-[#B91C1C] underline hover:text-[#7f0a0a]">Contact us</Link> or browse our{" "}
          <Link href="/shop" className="text-[#B91C1C] underline hover:text-[#7f0a0a]">shop</Link>.
        </p>
      </section>
    </div>
  );
}
