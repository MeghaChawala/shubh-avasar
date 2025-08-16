import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AuthModal from "./AuthModal";
import { useRouter } from "next/router";
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
import { useCart } from "@/context/CartContext"; // ✅ Added CartContext import
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
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryPages, setCategoryPages] = useState({});
  const { wishlist } = useWishlist();
  const { cartItems } = useCart(); // ✅ Access cart items
  const router = useRouter();
  const isCheckoutPage = router.pathname === "/checkout";

  useEffect(() => {
  const categories = ["Kurtas", "Party Wear", "Navratri Chaniya Choli", "Sharara Suit", "Designer Lehenga", "Kediya", "Salwar Suit"];
  const pages = {};
  categories.forEach(cat => {
    pages[cat] = sessionStorage.getItem(`shopPage-${cat}`) || 1;
  });
  setCategoryPages(pages);
}, []);

  useEffect(() => {
    //console.log("✅ useEffect for auth state change is running");
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        //console.log(currentUser)
        setUser(currentUser);
        //console.log(currentUser)
        await fetchOrders(currentUser.uid);
      } else {
        setUser(null);
        setOrders([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchOrders = async (userUid) => {
    try {
      //console.log("uid", userUid);
      const q = query(collection(db, "orders"), where("userUid", "==", userUid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
      //console.log("data", data);
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

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      router.push(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(""); // optional: clear input
      setMobileMenuOpen(false); // close menu if on mobile
    }
  };

  return (
    <>
      <nav className="bg-[#1B263B] text-white shadow-lg px-8 py-3 flex justify-between items-center sticky top-0 z-50 font-sans">
        {/* Brand */}
        <Link href="/" legacyBehavior>
          <a className="flex items-center">
            <Image
              src="/01.png"
              alt="Shubh Avasar Logo"
              width={2226}
              height={1698}
              priority
              className="object-contain max-h-24 w-auto"
            />
          </a>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8 items-center relative font-semibold">
          {/* Shop Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <span className="cursor-pointer select-none text-xl px-4 py-2 rounded-md hover:bg-[#F76C6C] transition">
              Shop
            </span>
            <div
              className={`absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl text-black p-6 w-96 grid grid-cols-2 gap-6 transition-transform duration-300 origin-top ${shopOpen
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0 pointer-events-none"
                }`}
            >
              <div>
                <h3 className="font-bold text-[#1B263B] mb-3 border-b border-[#F76C6C] pb-1">
                  Men
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link href={`/shop?category=Kurtas&page=${categoryPages["Kurtas"]}`} legacyBehavior>
                      <a className="hover:text-[#1B263B] whitespace-nowrap text-sm">Kurtas</a>
                    </Link>
                  </li>

                </ul>
              </div>

              <div>
                <h3 className="font-bold text-[#1B263B] mb-3 border-b border-[#F76C6C] pb-1">
                  Women
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/shop?category=Party%20Wear" legacyBehavior>
                      <a className="hover:text-[#1B263B] whitespace-nowrap text-sm">Party Wear</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop?category=Navratri%20Chaniya%20Choli" legacyBehavior>
                      <a className="hover:text-[#1B263B] whitespace-nowrap text-sm">Navratri Chaniya Choli</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop?category=Sharara%20Suit" legacyBehavior>
                      <a className="hover:text-[#1B263B] whitespace-nowrap text-sm">Sharara Suit</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop?category=Designer%20Lehenga" legacyBehavior>
                      <a className="hover:text-[#1B263B] whitespace-nowrap text-sm">Designer Lehenga</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop?category=Kediya" legacyBehavior>
                      <a className="hover:text-[#1B263B] whitespace-nowrap text-sm">Kediya</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop?category=Salwar%20Suit" legacyBehavior>
                      <a className="hover:text-[#1B263B] whitespace-nowrap text-sm">Salwar Suit</a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Wishlist */}
          <Link href="/wishlist" legacyBehavior>
            <a className="relative flex items-center gap-2 text-xl px-4 py-2 rounded-md hover:bg-[#F76C6C] transition">
              <FaHeart className="w-5 h-5 self-center" />
              <span className="leading-none">Wishlist</span>
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#F76C6C] text-white text-xs px-1.5 py-0.5 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </a>
          </Link>

          {/* Cart with count badge */}
          <Link href="/cart" legacyBehavior>
            <a className="relative flex items-center gap-2 text-xl px-4 py-2 rounded-md hover:bg-[#F76C6C] transition">
              <FaShoppingCart className="w-5 h-5 self-center" />
              <span className="leading-none">Cart</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#F76C6C] text-white text-xs px-2 py-0.5 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </a>
          </Link>

          {/* User Login/Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-xl px-4 py-2 rounded-md hover:bg-[#F76C6C] transition"
              >
                {user.displayName || user.email.split("@")[0]}
                {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-md shadow-lg z-50 p-4">
                  <h4 className="text-[#1B263B] font-bold mb-2">Order History</h4>
                  {orders.length === 0 ? (
                    <p className="text-sm text-gray-500">No orders found.</p>
                  ) : (
                    <ul className="space-y-4 max-h-80 overflow-y-auto text-sm text-[#1B263B]">
                      {orders.map((order) => (
                        <li
                          key={order.id}
                          className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm"
                        >
                          {/* Order ID and Status */}
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <p className="font-semibold text-sm break-all">
                              Order #{order.id.slice(0, 8)}
                            </p>
                            <span
                              className={`text-xs font-semibold mt-1 sm:mt-0 w-fit px-2 py-1 rounded-full ${order.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-800"
                                }`}
                            >
                              {order.status}
                            </span>
                          </div>

                          {/* Order Date */}
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(order.createdAt.seconds * 1000).toLocaleDateString("en-CA", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>

                          {/* Customer Info */}
                          <p className="text-xs text-gray-700 truncate">
                            {order.fullName}, {order.city}, {order.province}
                          </p>

                          {/* Items */}
                          {order.items && order.items.length > 0 && (
                            <ul className="text-xs text-gray-600 list-disc pl-4 mt-2 space-y-1">
                              {order.items.map((item, idx) => (
                                <li key={idx}>
                                  {item.name} × {item.qty}
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* Total + View Details Link */}
                          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-3 gap-2">
                            <p className="text-sm font-medium">
                              Total: {order.currency.toUpperCase()} ₹{order.amountTotal.toFixed(2)}
                            </p>
                            <Link
                              href={`/orders/${order.id}`}
                              className="text-blue-600 text-xs font-semibold hover:underline"
                            >
                              View details
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>





                  )}
                  {!isCheckoutPage && (
                    <button
                      onClick={handleLogout}
                      className="mt-4 w-full bg-[#F76C6C] text-white py-2 rounded hover:bg-[#d85757] transition"
                    >
                      Logout
                    </button>
                  )}

                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setLoginOpen(true)}
              className="flex items-center gap-2 text-xl px-4 py-2 rounded hover:bg-[#F76C6C] transition"
            >
              <FaUser /> Login
            </button>
          )}

          {/* Search */}
          <div className="flex items-center bg-[#E7EEF9] rounded-full px-4 py-1 text-[#1B263B] w-48 focus-within:ring-2 focus-within:ring-[#F76C6C]">
            <FaSearch />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="ml-2 bg-transparent outline-none w-full text-sm font-medium placeholder-[#1B263B]"
            />

          </div>
        </div>

        {/* Hamburger for mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white text-3xl focus:outline-none"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-[72px] left-0 right-0 bg-[#1B263B] text-white p-6 pt-[60px] space-y-6 shadow-xl transform transition-transform duration-300 z-40 max-h-[calc(100vh-72px)] overflow-auto ${mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        {/* Shop Section */}
        <details className="group border-b border-[#F76C6C] pb-2" open>
          <summary className="cursor-pointer font-semibold text-xl select-none">Shop</summary>
          <div className="pl-4 mt-3 space-y-3">
            <h4 className="text-[#F76C6C] font-bold">Men</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop?category=Kurtas" legacyBehavior>
                  <a onClick={handleMobileLinkClick} className="block hover:text-[#F76C6C]">
                    Kurtas
                  </a>
                </Link>
              </li>

            </ul>
            <h4 className="text-[#F76C6C] font-bold mt-4">Women</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop?category=Party%20Wear" legacyBehavior>
                  <a onClick={handleMobileLinkClick} className="block hover:text-[#F76C6C]">
                    Party Wear
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Navratri%20Chaniya%20Choli" legacyBehavior>
                  <a onClick={handleMobileLinkClick} className="block hover:text-[#F76C6C]">
                    Navratri Chaniya Choli
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Sharara%20Suit" legacyBehavior>
                  <a onClick={handleMobileLinkClick} className="block hover:text-[#F76C6C]">
                    Sharara Suit

                  </a>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Designer%20Lehenga" legacyBehavior>
                  <a onClick={handleMobileLinkClick} className="block hover:text-[#F76C6C]">
                    Designer Lehenga
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Kediya" legacyBehavior>
                  <a onClick={handleMobileLinkClick} className="block hover:text-[#F76C6C]">
                    Kediya
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Salwar%20Suit" legacyBehavior>
                  <a className="hover:text-[#1B263B] whitespace-nowrap text-sm">Salwar Suit</a>
                </Link>
              </li>
            </ul>
          </div>
        </details>

        {/* Wishlist */}
        <Link href="/wishlist" legacyBehavior>
          <a
            onClick={handleMobileLinkClick}
            className="flex items-center gap-2 text-lg hover:text-[#F76C6C] relative"
          >
            <FaHeart className="text-xl" />
            <span>Wishlist</span>
            {wishlist.length > 0 && (
              <span className="ml-2 bg-[#F76C6C] text-white text-xs px-2 py-0.5 rounded-full">
                {wishlist.length}
              </span>
            )}
          </a>
        </Link>

        {/* Cart with count badge */}
        <Link href="/cart" legacyBehavior>
          <a onClick={handleMobileLinkClick} className="relative flex items-center gap-2 text-lg hover:text-[#F76C6C]">
            <FaShoppingCart className="text-xl" />
            <span>Cart</span>
            {cartItems.length > 0 && (
              <span className="ml-2 bg-[#F76C6C] text-white text-xs px-2 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </a>
        </Link>

        {/* Login/Logout */}
        {user ? (
          <div className="border-t border-[#F76C6C] pt-4">
            <p className="font-semibold text-lg mb-2">
              Hello, <span className="text-[#F76C6C]">{user.displayName || user.email.split("@")[0]}</span>
            </p>
            <h4 className="text-[#F76C6C] font-bold mb-2">Order History</h4>
            {orders.length === 0 ? (
              <p className="text-sm text-gray-300 mb-3">No orders found.</p>
            ) : (
              <ul className="text-sm max-h-64 overflow-y-auto mb-3 space-y-4 px-2">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="border border-gray-600 rounded-md p-3 bg-white text-black"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="font-semibold text-sm break-words">
                        Order ID: {order.id}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full mt-1 sm:mt-0 w-fit ${order.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-700 break-words mb-2">
                      {order.fullName}, {order.city}, {order.province}
                    </p>

                    {order.items?.length > 0 && (
                      <ul className="text-xs text-gray-600 list-disc pl-5 mb-2 space-y-1">
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            {item.name} × {item.qty}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex flex-col sm:flex-row sm:justify-between mt-2">
                      <p className="text-sm font-medium">
                        Total: {order.currency.toUpperCase()} ₹{order.amountTotal.toFixed(2)}
                      </p>
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-blue-600 text-xs font-semibold hover:underline mt-1 sm:mt-0"
                      >
                        View details
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {!isCheckoutPage && (
              <button
                onClick={handleLogout}
                className="w-full bg-[#F76C6C] text-white py-2 rounded hover:bg-[#d85757]"
              >
                Logout
              </button>
            )}

          </div>
        ) : (
          <button
            onClick={() => {
              setLoginOpen(true);
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 text-lg rounded hover:text-[#F76C6C]"
          >
            <FaUser /> Login
          </button>
        )}

        {/* Search */}
        <div className="flex items-center bg-[#E7EEF9] rounded-full px-4 py-2 text-[#1B263B] mt-4">
          <FaSearch />
          <input
            type="text"
            placeholder="Search products..."
            className="ml-2 bg-transparent outline-none w-full text-sm placeholder-[#1B263B]"
          />
        </div>
      </div>

      {/* Login Modal */}
      <AuthModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}



