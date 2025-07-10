import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductCard({ product }) {
  const router = useRouter();
  const [currentImg, setCurrentImg] = useState(0);
  const intervalRef = useRef(null);

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const { wishlist, toggleWishlist } = useWishlist();
  const isWished = wishlist.some((item) => item.id === product.id);

  const handleMouseEnter = () => {
    if (images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 1500);
  };

  const handleMouseLeave = () => {
    clearInterval(intervalRef.current);
    setCurrentImg(0);
  };

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleWishlist(product);
  };

  return (
    <div
      className="cursor-pointer rounded overflow-hidden shadow hover:shadow-lg transition max-w-xs mx-auto bg-white"
      style={{ width: 280 }}
      onClick={handleCardClick}
    >
      <div
        className="w-full overflow-hidden relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ height: 400 }}
      >
        <img
          src={images[currentImg]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500"
          loading="lazy"
        />

        {/* Wishlist Icon */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 z-20 p-2 rounded-full bg-white/50 hover:bg-white/70 transition backdrop-blur-sm"
          aria-label="Add to wishlist"
        >
          {isWished ? (
            <FaHeart className="text-[#F76C6C]" />
          ) : (
            <FaRegHeart className="text-[#1B263B]" />
          )}
        </button>
      </div>

      <div className="px-3 py-2">
        <h3 className="text-base font-medium text-[#1B263B] truncate">{product.name}</h3>
        <p className="text-gray-700 font-semibold mt-1">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
}
