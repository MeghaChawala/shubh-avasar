import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import HeroCarousel from "@/components/HeroCarousel";
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 4;
  const [bestSellers, setBestSellers] = useState([]);

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

  useEffect(() => {
  const fetchBestSellers = async () => {
    try {
      const q = query(
        collection(db, "products"),
        orderBy("sold", "desc"),
        limit(10)
      );
      const snapshot = await getDocs(q);
      const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBestSellers(products);
    } catch (err) {
      console.error("Failed to fetch best sellers", err);
    }
  };

  fetchBestSellers();
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
  <div className="relative max-w-7xl mx-auto rounded-lg overflow-hidden shadow-lg aspect-[2/1] sm:aspect-[3/1] lg:aspect-[3.5/1]">
    <Image
      src="/images/discount-banner.png"
      alt="Discount Offer"
      fill
      // className="object-cover"
      priority
    />
  </div>
</section>


      {/* Shop By Category */}
      <section className="py-12 px-6 bg-white">
<div className="w-full mb-12">
  <div className="w-full bg-gradient-to-r from-[#D72638] via-[#EF476F] to-[#FF6B6B] py-4 px-6 rounded-md shadow-md">
    <h2 className="text-3xl md:text-4xl font-bold text-white text-center tracking-wide drop-shadow-sm font-serif">
      Shop by Category
    </h2>
  </div>
</div>





        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {categories.map((cat) => {
            // console.log('CATEGORY:', cat.images);
            return (
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
                {/* <div className="w-full h-64 overflow-hidden">
                <Image
                  src={cat.images[0]}
                  alt={cat.category}
                  className="w-full h-full object-cover" />
              </div> */}
                <div className="w-full h-96 relative overflow-hidden bg-white">
                  <Image
                    src={cat.images[0]}
                    alt={cat.category}
                    fill
                  // className="object-contain"
                  />
                </div>

                <div className="p-4 text-center bg-[#F76C6C] text-white font-semibold text-xl">
                  {cat.category}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* New Arrivals */}
      {/* New Arrivals */}
      <section className="py-12 px-6 bg-[#F9FAFB]">
  <div className="w-full mb-12">
  <div className="w-full bg-gradient-to-r from-[#D72638] via-[#EF476F] to-[#FF6B6B] py-4 px-6 rounded-md shadow-md">
    <h2 className="text-3xl md:text-4xl font-bold text-white text-center tracking-wide drop-shadow-sm font-serif">
      New Arrivals
    </h2>
  </div>
</div>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-[1600px] mx-auto px-4">
    {newArrivals.map((prod) => (
      <div
        key={prod.id}
        className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition"
        onClick={() => router.push(`/product/${prod.id}`)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            router.push(`/product/${prod.id}`);
          }
        }}
      >
        <div className="w-full h-96 bg-white flex items-center justify-center rounded-md overflow-hidden mb-4">
          <Image
            src={prod.images[0]}
            alt={prod.name}
            width={300}
            height={300}
            className="w-full !h-96"
          />
        </div>

        <h3 className="font-semibold text-lg">{prod.name}</h3>
        <div className="flex items-center gap-3 mt-1">
          {prod.originalPrice && prod.originalPrice > prod.price ? (
            <>
              <span className="text-lg text-gray-500 line-through">
                ${prod.originalPrice.toFixed(2)}
              </span>
              <span className="text-xl text-[#F76C6C] font-bold mt-1">
                ${prod.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-xl text-[#F76C6C] font-bold mt-1">
              ${prod.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    ))}
  </div>
</section>

<section className="py-12 px-6 bg-white">
  <div className="w-full mb-12">
  <div className="w-full bg-gradient-to-r from-[#D72638] via-[#EF476F] to-[#FF6B6B] py-4 px-6 rounded-md shadow-md">
    <h2 className="text-3xl md:text-4xl font-bold text-white text-center tracking-wide drop-shadow-sm font-serif">
      Best Sellers
    </h2>
  </div>
</div>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-[1600px] mx-auto px-4">
    {bestSellers.map((prod) => (
      <div
        key={prod.id}
        className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition"
        onClick={() => router.push(`/product/${prod.id}`)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            router.push(`/product/${prod.id}`);
          }
        }}
      >
        <div className="w-full h-96 bg-white flex items-center justify-center rounded-md overflow-hidden mb-4">
          <Image
            src={prod.images[0]}
            alt={prod.name}
            width={300}
            height={300}
            className="w-full !h-96"
          />
        </div>

        <h3 className="font-semibold text-lg">{prod.name}</h3>
        <div className="flex items-center gap-3 mt-1">
          {prod.originalPrice && prod.originalPrice > prod.price ? (
            <>
              <span className="text-lg text-gray-500 line-through">
                ${prod.originalPrice.toFixed(2)}
              </span>
              <span className="text-xl text-[#F76C6C] font-bold mt-1">
                ${prod.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-xl text-[#F76C6C] font-bold mt-1">
              ${prod.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    ))}
  </div>
</section>


      {/* Brand Story Video Section */}
      <section className="py-12 px-6 bg-black text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="mb-8 text-lg max-w-2xl mx-auto">
            Discover the passion, craftsmanship, and creativity that drive every design. Here&apos;s a glimpse behind the scenes.
          </p>

          <div className="rounded-lg overflow-hidden shadow-lg">
            <video
              src="/images/brand-story.mp4"
              controls
              muted
              poster="/images/brand-poster.jpg"
              className="w-full max-h-[500px] mx-auto rounded-lg shadow"
            >
              Your browser does not support the video tag.
            </video>


          </div>
        </div>
      </section>


{/* Home Visit Section */}
<div className="h-6 bg-gradient-to-b from-black to-[#FFF5F5]" />
<section className="py-16 bg-[#FFF5F5]">
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    {/* Image or Illustration */}
    <div className="relative h-80 md:h-full">
      <Image
        src="/images/home-visit.jpg" // Replace with your actual image path
        alt="Home Visit"
        fill
        className="rounded-xl object-cover shadow-md"
      />
    </div>

    {/* Text Content */}
    <div className="text-center md:text-left">
      <h2 className="text-4xl font-bold text-[#1B263B] mb-4 leading-tight">
        Book a Personalized Home Visit
      </h2>
      <p className="text-lg text-gray-700 mb-6 max-w-xl">
        Skip the travel—our stylist brings the boutique experience to your doorstep.
        Explore outfits tailored to your taste, try them at home, and enjoy the ultimate comfort.
      </p>

      <button
        onClick={() => router.push('/home-visit')}
        className="bg-[#F76C6C] hover:bg-[#d85757] text-white text-lg font-semibold py-3 px-8 rounded-full transition shadow-lg"
      >
        Book Now
      </button>
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
