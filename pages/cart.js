import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useEffect, useState, useRef } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, query, limit } from "firebase/firestore";
import ProductCard from "@/components/ProductCard";
import { onAuthStateChanged } from "firebase/auth";
import AuthModal from "@/components/AuthModal";

export default function CartPage() {
  const { cartItems = [], updateQuantity, removeFromCart, clearCart } = useCart();
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const q = query(collection(db, "products"), limit(20));
        const snapshot = await getDocs(q);
        let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const cartIds = new Set(cartItems.map(item => item.id));
        products = products.filter(product => !cartIds.has(product.id));
        setRecommendedProducts(products.slice(0, 12));
      } catch (error) {
        console.error("Failed to fetch recommended products:", error);
      }
    };
    fetchRecommendedProducts();
  }, [cartItems]);

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
  }, [recommendedProducts]);

  const scroll = (direction) => {
  const container = scrollRef.current;
  if (container) {
    const scrollAmount = container.offsetWidth;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }
};

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    // Save redirect path (optional, for after login)
    window.history.pushState(null, "", "/cart?redirectTo=/checkout");

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        toast.success("Proceeding to checkout...");
        window.location.href = "/checkout";
      } else {
        toast.error("Please log in to proceed to checkout");
        setShowLoginModal(true);
      }
      unsubscribe();
    });
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-[#F4F6F8]">
      <h1 className="text-4xl font-bold text-[#1B263B] mb-4">Your Shopping Cart</h1>
      <p className="mb-10 text-lg text-gray-700">
        {cartItems.length === 0
          ? "Your cart is empty."
          : `You have ${cartItems.length} item${cartItems.length > 1 ? "s" : ""} in your cart.`}
      </p>

      {cartItems.length === 0 ? (
        <div className="text-center">
          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-[#F76C6C] text-white rounded-md hover:bg-red-600 transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12 justify-center">
          <div className="w-full lg:w-[650px]">
            {cartItems.map((item, index) => (
              <div
                key={`${item.id}-${item.selectedColor}-${item.selectedSize}-${index}`}
                className="bg-white rounded-lg shadow-md p-3 mb-5 flex items-center gap-3"
              >
                <Image
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                  width={90}
                  height={90}
                  className="object-cover rounded"
                />
                <div className="flex-1 flex flex-col justify-between h-full">
                  <div>
                    <h2 className="text-lg font-semibold text-[#1B263B]">{item.name}</h2>
                    <p className="text-sm text-gray-600">
                      Color: <span className="capitalize">{item.selectedColor}</span>, Size:{" "}
                      {item.selectedSize}
                    </p>
                    <p className="text-base font-semibold text-[#1B263B] mt-1 md:hidden">
                      ${(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          if (item.qty > 1) {
                            updateQuantity(item.id, item.selectedColor, item.selectedSize, item.qty - 1);
                          }
                        }}
                        className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                      >
                        –
                      </button>
                      <span className="w-6 text-center">{item.qty}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.selectedColor, item.selectedSize, item.qty + 1)
                        }
                        className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-semibold text-lg hidden md:block">
                      ${(item.price * item.qty).toFixed(2)}
                    </p>
                    <button
                      onClick={() => {
                        removeFromCart(item.id, item.selectedColor, item.selectedSize);
                        toast.success("Removed from cart");
                      }}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Remove item"
                    >
                      <FaTrash size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:w-96 bg-white rounded-lg shadow-md p-6 flex flex-col gap-6 h-fit">
            <h3 className="text-2xl font-semibold text-[#1B263B]">Order Summary</h3>

            <div className="text-lg text-[#1B263B] flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold">${totalPrice.toFixed(2)}</span>
            </div>

            <div className="text-lg text-[#1B263B] flex justify-between">
              <span>Tax (13% HST):</span>
              <span className="font-semibold">${(totalPrice * 0.13).toFixed(2)}</span>
            </div>

            <div className="text-lg text-[#1B263B] flex justify-between">
              <span>Shipping:</span>
              <span className="text-gray-500 italic">To be calculated</span>
            </div>

            <hr className="border-t border-gray-300 my-2" />

            <div className="text-xl font-bold text-[#1B263B] flex justify-between">
              <span>Grand Total:</span>
              <span>${(totalPrice * 1.13).toFixed(2)}</span>
            </div>

            <p className="text-sm text-gray-600 mt-2">
              <strong>Note:</strong> Shipping charges may apply at checkout. Free delivery in the{" "}
              <strong>GTA</strong>. Standard shipping fees apply outside the GTA.
            </p>

            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-[#F76C6C] text-white rounded-md hover:bg-red-600 transition"
            >
              Checkout
            </button>

            <button
              onClick={() => {
                clearCart();
                toast.success("Cart cleared");
              }}
              className="w-full py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
            >
              Clear Cart
            </button>

            <Link
              href="/shop"
              className="block text-center py-3 border border-[#F76C6C] rounded-md text-[#F76C6C] hover:bg-[#F76C6C] hover:text-white transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}

      {recommendedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto mt-12 px-4">
          <div className="mb-6 px-2 flex justify-between items-center">
            <h3 className="text-2xl font-bold text-[#1B263B]">You Might Also Like</h3>
          </div>

          <div className="relative">
            {showLeftArrow && (
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow z-10 hover:bg-gray-100"
                aria-label="Scroll left"
              >
                <FaChevronLeft />
              </button>
            )}

            <div
              ref={scrollRef}
              className="flex overflow-x-auto gap-4 sm:gap-6 scroll-smooth hide-scrollbar pb-2"
              style={{ scrollBehavior: "smooth" }}
            >
              {recommendedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-[80vw] sm:w-[45vw] md:w-[280px] lg:w-[300px]"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {showRightArrow && (
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow z-10 hover:bg-gray-100"
                aria-label="Scroll right"
              >
                <FaChevronRight />
              </button>
            )}
          </div>
        </section>
      )}

      {/* ✅ Login modal */}
      <AuthModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}
