// pages/checkout.js
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import AuthModal from "@/components/AuthModal";
import { useRouter } from "next/router";

export default function CheckoutPage() {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setShowLoginModal(true);

        // Optional: redirect after short delay
        setTimeout(() => {
          router.replace("/cart");
        }, 1000);
      }
      setIsAuthChecked(true);
    });

    return () => unsubscribe();
  }, [router]);

  if (!isAuthChecked) return <div className="p-10 text-center text-xl">Checking authentication...</div>;

  if (!isLoggedIn) {
    return (
      <>
        <div className="p-10 text-center text-xl text-[#1B263B]">
          Redirecting to cart. Please login to proceed to checkout.
        </div>
        <AuthModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-[#F4F6F8]">
      <h1 className="text-3xl font-bold text-[#1B263B] mb-6">Checkout Page</h1>
      <p className="text-lg text-gray-700">You're logged in and ready to place your order!</p>

      {/* 🔒 Add your checkout form or Stripe payment flow here */}
    </div>
  );
}
