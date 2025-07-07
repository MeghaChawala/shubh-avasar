import Navbar from '@/components/Navbar';
import HeroCarousel from '@/components/HeroCarousel';
import Footer from '@/components/Footer';


export default function Home() {
  return (
    <div>
      {/* <Navbar /> */}
      <HeroCarousel />

      <section className="p-8 text-center">
        <h3 className="text-2xl font-semibold mb-6">Featured Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-lg shadow-lg border border-primary/30 hover:scale-105 transition-transform"
            >
              <img
                src={`https://placehold.co/300x300/fff5f5/000000?text=Product+${i}`}
                alt="Product"
                className="mb-4 rounded shadow-sm"
              />
              <h4 className="font-bold text-lg text-primary">Product {i}</h4>
              <p className="text-gray-600">$49.99</p>
              <button className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-red-800 transition-all">
                Add to Cart
              </button>
            </div>

          ))}
        </div>
      </section>

      <a
        href="https://wa.me/15551234567"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp Chat"
          className="w-12 h-12 rounded-full shadow-lg hover:scale-110 transition-transform"
        />
      </a>
      {/* <Footer /> */}
    </div>
  );
}
