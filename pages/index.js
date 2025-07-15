import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import HeroCarousel from "@/components/HeroCarousel";

export default function Home() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 4;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const products = snapshot.docs.map((doc) => doc.data());

        const categoryMap = new Map();
        products.forEach((product) => {
          const existing = categoryMap.get(product.category);
          if (
            !existing ||
            (product.createdAt?.toMillis && product.createdAt.toMillis() > existing.createdAt?.toMillis())
          ) {
            categoryMap.set(product.category, product);
          }
        });

        setCategories(Array.from(categoryMap.values()));
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    const fetchNewArrivals = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(10));
        const snapshot = await getDocs(q);
        const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setNewArrivals(products);
      } catch (err) {
        console.error("Failed to fetch new arrivals", err);
      }
    };

    fetchCategories();
    fetchNewArrivals();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, newArrivals.length - visibleCount));
  };

  return (
    <div>
      <HeroCarousel />

      {/* Discount Banner */}
      <section className="py-8 px-6 bg-[#FFF5F5]">
        <div className="max-w-7xl mx-auto rounded-lg overflow-hidden shadow-lg">
          <img
            src="/images/discount-banner.jpg" // Update with your actual image path or URL
            alt="Discount Offer"
            className="w-full h-72 object-cover"
          />
        </div>
      </section>

      {/* Shop By Category */}
      <section className="py-12 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {categories.map((cat) => (
            <div
              key={cat.category}
              className="cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              onClick={() => router.push(`/shop?category=${encodeURIComponent(cat.category)}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  router.push(`/shop?category=${encodeURIComponent(cat.category)}`);
                }
              }}
            >
              <div className="w-full h-64 overflow-hidden">
                <img
                  src={cat.images}
                  alt={cat.category}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 text-center bg-[#F76C6C] text-white font-semibold text-xl">
                {cat.category}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      {/* New Arrivals */}
      <section className="py-12 px-6 bg-[#F9FAFB]">
        <h2 className="text-3xl font-bold text-center mb-8">New Arrivals</h2>
        <div className="relative flex items-center justify-center max-w-7xl mx-auto">
          {/* Prev Arrow */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-300 shadow hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous"
          >
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Product Items */}
          <div className="flex gap-6 overflow-hidden w-full mx-2">
            {newArrivals
              .slice(currentIndex, currentIndex + visibleCount)
              .map((prod) => (
                <div
                  key={prod.id}
                  className="w-72 bg-white rounded-lg shadow-md p-4 flex-shrink-0 cursor-pointer hover:shadow-lg transition"
                  onClick={() => router.push(`/product/${prod.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      router.push(`/product/${prod.id}`);
                    }
                  }}
                >
                  <div className="w-full h-64 rounded-md overflow-hidden mb-4">
                    <img src={prod.images} alt={prod.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-semibold text-lg">{prod.name}</h3>
                  <p className="text-primary font-bold mt-1">₹{prod.price || "-"}</p>
                </div>
              ))}
          </div>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            disabled={currentIndex >= newArrivals.length - visibleCount}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-300 shadow hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next"
          >
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Brand Story Video Section */}
      <section className="py-12 px-6 bg-black text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="mb-8 text-lg max-w-2xl mx-auto">
            Discover the passion, craftsmanship, and creativity that drive every design. Here's a glimpse behind the scenes.
          </p>

          <div className="rounded-lg overflow-hidden shadow-lg">
            <video
              src="/images/brand-story.mp4"
              controls
              muted
              poster="/images/brand-poster.jpg"
              className="w-full h-auto rounded-lg shadow"
            >
              Your browser does not support the video tag.
            </video>


          </div>
        </div>
      </section>


      {/* Why Choose Us Section */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3 text-[#F76C6C]">Premium Quality</h3>
            <p>We offer the finest quality fabrics and craftsmanship, ensuring you look your best.</p>
          </div>
          <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3 text-[#F76C6C]">Exclusive Designs</h3>
            <p>Our collections feature unique, trendsetting styles curated just for you.</p>
          </div>
          <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3 text-[#F76C6C]">Customer Satisfaction</h3>
            <p>We prioritize your happiness with hassle-free returns and excellent support.</p>
          </div>
        </div>
      </section>


    </div>
  );
}
