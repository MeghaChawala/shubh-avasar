// components/MobileDrawer.js
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import { GiClothes, GiDress } from "react-icons/gi";
import Link from "next/link";

export default function MobileDrawer({ isOpen, setIsOpen, onLoginClick }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 md:hidden" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-y-0 left-0 w-72 bg-white p-6 shadow-xl overflow-y-auto">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 text-gray-600 hover:text-black"
          >
            ✕
          </button>

          <nav className="flex flex-col gap-4 mt-8 text-gray-800 text-base font-medium">
            <Link href="/" className="text-2xl font-bold text-[#B91C1C] mb-4">
              Shubh Avasar
            </Link>

            <div className="border-t pt-4">
              <span className="text-[#B91C1C] font-semibold">Shop</span>
              <div className="ml-3 mt-2 flex flex-col gap-2 text-sm">
                <Link href="/shop/men/navratri-kurta" className="flex items-center gap-2">
                  <GiClothes className="text-[#F76C6C]" /> Men - Navratri Kurta
                </Link>
                <Link href="/shop/women/lehenga" className="flex items-center gap-2">
                  <GiDress className="text-[#F76C6C]" /> Women - Lehenga
                </Link>
                <Link href="/shop/navratri" className="flex items-center gap-2">
                  <GiClothes className="text-[#F76C6C]" /> Navratri Collection
                </Link>
                <Link href="/shop/dresses" className="flex items-center gap-2">
                  <GiDress className="text-[#F76C6C]" /> Dresses
                </Link>
                <Link href="/shop" className="flex items-center gap-2">
                  <FaShoppingCart className="text-[#F76C6C]" /> View All
                </Link>
              </div>
            </div>

            <Link href="/wishlist" className="flex items-center gap-2 mt-4">
              <FaHeart /> Wishlist
            </Link>

            <Link href="/cart" className="flex items-center gap-2">
              <FaShoppingCart /> Cart
            </Link>

            <button
              onClick={() => {
                setIsOpen(false);
                onLoginClick();
              }}
              className="flex items-center gap-2 text-left mt-2"
            >
              <FaUser /> Login
            </button>
          </nav>
        </div>
      </Dialog>
    </Transition>
  );
}
