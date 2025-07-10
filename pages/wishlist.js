import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const [recommended, setRecommended] = useState([]);
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const q = query(collection(db, "products"), limit(20)); // Fetch more to filter later
        const snapshot = await getDocs(q);
        const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Filter out items already in the wishlist
        const filtered = products.filter(
          (p) => !wishlist.some((w) => w.id === p.id)
        );

        // Show up to 12 recommendations
        setRecommended(filtered.slice(0, 12));
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      }
    };

    fetchRecommendedProducts();
  }, [wishlist]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(container.scrollLeft + container.offsetWidth < container.scrollWidth);
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [recommended]);

  const scroll = (dir) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = container.offsetWidth;
      container.scrollBy({ left: dir === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-[#F4F6F8]">
      <h1 className="text-3xl font-semibold text-[#1B263B] mb-8">Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <p>
          You have no items in your wishlist.{" "}
          <Link href="/shop" className="text-[#F76C6C] underline">
            Shop now
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* You Might Also Like Section */}
      {recommended.length > 0 && (
        <section className="max-w-7xl mx-auto mt-16 px-4">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-2xl font-bold text-[#1B263B]">You Might Also Like</h3>
          </div>

          <div className="relative">
            {showLeftArrow && (
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow z-10 hover:bg-gray-100"
              >
                <FaChevronLeft />
              </button>
            )}

            <div
              ref={scrollRef}
              className="flex overflow-x-auto gap-4 sm:gap-6 scroll-smooth hide-scrollbar pb-2"
            >
              {recommended.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-[80vw] sm:w-[45vw] md:w-[280px] lg:w-[300px]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {showRightArrow && (
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow z-10 hover:bg-gray-100"
              >
                <FaChevronRight />
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
