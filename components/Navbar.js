import { useState, useEffect } from "react";
import Link from "next/link";
import AuthModal from "./AuthModal";
import {
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useWishlist } from "@/context/WishlistContext";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Navbar() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  const { wishlist } = useWishlist();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchOrders(currentUser.uid);
      } else {
        setUser(null);
        setOrders([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchOrders = async (uid) => {
    try {
      const q = query(collection(db, "orders"), where("userId", "==", uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setDropdownOpen(false);
      setMobileMenuOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Close mobile menu on link click helper
  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-[#1A2A6C] text-white shadow-lg px-8 py-4 flex justify-between items-center sticky top-0 z-50 font-sans">
        {/* Brand */}
        <Link href="/" legacyBehavior>
          <a className="text-4xl font-extrabold text-[#D0E1F9] tracking-wide hover:text-[#F76C6C] transition-transform duration-300 hover:scale-110">
            Shubh <span className="text-[#F76C6C] italic">Avasar</span>
          </a>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-10 items-center relative font-semibold">
          {/* Shop Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <span className="cursor-pointer select-none text-lg px-3 py-2 rounded-md hover:bg-[#F76C6C] hover:text-white transition">
              Shop
            </span>

            <div
              className={`absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl text-black p-6 w-96 grid grid-cols-2 gap-6 transition-transform duration-300 origin-top ${
                shopOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
              }`}
            >
              {/* Men */}
              <div>
                <h3 className="font-bold text-[#1A2A6C] mb-3 border-b border-[#F76C6C] pb-1">Men</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/shop?category=Navratri%20Kurta" legacyBehavior>
                      <a className="hover:text-[#1A2A6C] transition-colors duration-200">
                        Navratri Kurta
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Women */}
              <div>
                <h3 className="font-bold text-[#1A2A6C] mb-3 border-b border-[#F76C6C] pb-1">Women</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/shop?category=Lehenga" legacyBehavior>
                      <a className="hover:text-[#1A2A6C] transition-colors duration-200">Lehenga</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop?category=Navratri%20Collection" legacyBehavior>
                      <a className="whitespace-nowrap hover:text-[#1A2A6C] transition-colors duration-200">
                        Navratri Collection
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop?category=Dresses" legacyBehavior>
                      <a className="hover:text-[#1A2A6C] transition-colors duration-200">Dresses</a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Wishlist */}
          <Link href="/wishlist" legacyBehavior>
            <a className="relative flex items-center gap-2 text-lg px-3 py-2 rounded-md hover:bg-[#F76C6C] hover:text-white transition">
              <FaHeart />
              Wishlist
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#F76C6C] text-white text-xs px-1.5 py-0.5 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </a>
          </Link>

          {/* Cart */}
          <Link href="/cart" legacyBehavior>
            <a className="flex items-center gap-2 text-lg px-3 py-2 rounded-md hover:bg-[#F76C6C] hover:text-white transition">
              <FaShoppingCart /> Cart
            </a>
          </Link>

          {/* User / Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-lg px-3 py-2 rounded-md hover:bg-[#F76C6C] hover:text-white transition"
              >
                {user.displayName || user.email.split("@")[0]}
                {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-md shadow-lg z-50 p-4">
                  <h4 className="text-[#1A2A6C] font-bold mb-2">Order History</h4>
                  {orders.length === 0 ? (
                    <p className="text-sm text-gray-500">No orders found.</p>
                  ) : (
                    <ul className="text-sm max-h-40 overflow-y-auto">
                      {orders.map((order) => (
                        <li key={order.id} className="border-b py-2">
                          #{order.id.slice(0, 6)} - {order.status || "Pending"}
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    onClick={handleLogout}
                    className="mt-4 w-full bg-[#F76C6C] text-white py-2 rounded hover:bg-[#d85757] transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setLoginOpen(true)}
              className="flex items-center gap-2 text-lg px-3 py-2 rounded-md hover:bg-[#F76C6C] hover:text-white transition cursor-pointer bg-transparent border border-transparent"
            >
              <FaUser /> Login
            </button>
          )}

          {/* Search */}
          <div className="flex items-center bg-[#E7EEF9] rounded-full px-4 py-1 text-[#1A2A6C] w-48 focus-within:ring-2 focus-within:ring-[#F76C6C]">
            <FaSearch />
            <input
              type="text"
              placeholder="Search products..."
              className="ml-2 bg-transparent outline-none w-full text-sm font-medium placeholder-[#1A2A6C]"
            />
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white text-3xl focus:outline-none"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden fixed top-[64px] left-0 right-0 bg-[#1A2A6C] text-white p-6 space-y-6 shadow-xl transform transition-transform duration-300 z-40 overflow-auto max-h-[calc(100vh-64px)] ${
          mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Shop Accordion */}
        <details className="group border-b border-[#F76C6C] pb-2" open>
          <summary className="cursor-pointer font-semibold text-xl select-none">Shop</summary>
          <div className="pl-4 mt-3 space-y-3">
            <h4 className="text-[#F76C6C] font-bold">Men</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop?category=Navratri%20Kurta" legacyBehavior>
                  <a onClick={handleMobileLinkClick} className="block hover:text-[#F76C6C] transition">
                    Navratri Kurta
                  </a>
                </Link>
              </li>
            </ul>
            <h4 className="text-[#F76C6C] font-bold mt-4">Women</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop?category=Lehenga" legacyBehavior>
                  <a onClick={handleMobileLinkClick} className="block hover:text-[#F76C6C] transition">
                    Lehenga
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Navratri%20Collection" legacyBehavior>
                  <a onClick={handleMobileLinkClick} className="block hover:text-[#F76C6C] transition">
                    Navratri Collection
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Dresses" legacyBehavior>
                  <a onClick={handleMobileLinkClick} className="block hover:text-[#F76C6C] transition">
                    Dresses
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </details>

        {/* Wishlist */}
        <Link href="/wishlist" legacyBehavior>
          <a onClick={handleMobileLinkClick} className="relative flex items-center gap-2 text-lg hover:text-[#F76C6C] transition">
            <FaHeart />
            Wishlist
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#F76C6C] text-white text-xs px-1.5 py-0.5 rounded-full">
                {wishlist.length}
              </span>
            )}
          </a>
        </Link>

        {/* Cart */}
        <Link href="/cart" legacyBehavior>
          <a onClick={handleMobileLinkClick} className="flex items-center gap-2 text-lg hover:text-[#F76C6C] transition">
            <FaShoppingCart /> Cart
          </a>
        </Link>

        {/* User Section in Mobile Menu */}
        {user ? (
          <div className="border-t border-[#F76C6C] pt-4">
            <p className="font-semibold text-lg mb-2">
              Hello, <span className="text-[#F76C6C]">{user.displayName || user.email.split("@")[0]}</span>
            </p>
            <h4 className="text-[#F76C6C] font-bold mb-2">Order History</h4>
            {orders.length === 0 ? (
              <p className="text-sm text-gray-300 mb-3">No orders found.</p>
            ) : (
              <ul className="text-sm max-h-40 overflow-y-auto mb-3">
                {orders.map((order) => (
                  <li key={order.id} className="border-b border-gray-600 py-1">
                    #{order.id.slice(0, 6)} - {order.status || "Pending"}
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={handleLogout}
              className="w-full bg-[#F76C6C] text-white py-2 rounded hover:bg-[#d85757] transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setLoginOpen(true);
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 text-lg hover:text-[#F76C6C] transition bg-transparent border-none outline-none"
          >
            <FaUser /> Login
          </button>
        )}

        {/* Search */}
        <div className="flex items-center bg-[#E7EEF9] rounded-full px-4 py-2 text-[#1A2A6C] mt-4">
          <FaSearch />
          <input
            type="text"
            placeholder="Search products..."
            className="ml-2 bg-transparent outline-none w-full text-sm font-medium placeholder-[#1A2A6C]"
          />
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
