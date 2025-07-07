import { useState } from "react";
import Link from "next/link";
import AuthModal from "./AuthModal";
import { FaHeart, FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import MobileDrawer from "./MobileDrawer";
import { useWishlist } from "@/context/WishlistContext";

export default function Navbar() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { wishlist } = useWishlist();

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

          {/* Login */}
          <button
            onClick={() => setLoginOpen(true)}
            className="flex items-center gap-2 text-lg px-3 py-2 rounded-md hover:bg-[#F76C6C] hover:text-white transition cursor-pointer bg-transparent border border-transparent"
          >
            <FaUser /> Login
          </button>

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
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-[64px] left-0 right-0 bg-[#1A2A6C] text-white p-6 space-y-6 shadow-xl transform transition-transform duration-300 z-40 ${
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
                  <a className="block hover:text-[#F76C6C] transition">{`Navratri Kurta`}</a>
                </Link>
              </li>
            </ul>
            <h4 className="text-[#F76C6C] font-bold mt-4">Women</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop?category=Lehenga" legacyBehavior>
                  <a className="block hover:text-[#F76C6C] transition">Lehenga</a>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Navratri%20Collection" legacyBehavior>
                  <a className="block hover:text-[#F76C6C] transition">Navratri Collection</a>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Dresses" legacyBehavior>
                  <a className="block hover:text-[#F76C6C] transition">Dresses</a>
                </Link>
              </li>
            </ul>
          </div>
        </details>

        {/* Wishlist with count */}
        <Link href="/wishlist" legacyBehavior>
          <a className="relative flex items-center gap-2 text-lg hover:text-[#F76C6C] transition">
            <FaHeart />
            Wishlist
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#F76C6C] text-white text-xs px-1.5 py-0.5 rounded-full">
                {wishlist.length}
              </span>
            )}
          </a>
        </Link>

        <Link href="/cart" legacyBehavior>
          <a className="flex items-center gap-2 text-lg hover:text-[#F76C6C] transition">
            <FaShoppingCart /> Cart
          </a>
        </Link>

        <button
          onClick={() => {
            setLoginOpen(true);
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2 text-lg hover:text-[#F76C6C] transition bg-transparent border-none outline-none"
        >
          <FaUser /> Login
        </button>

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
