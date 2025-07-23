import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";

export default function SuccessPage() {
  const { clearCart } = useCart();
  const ranEffect = useRef(false); // prevent re-running
  const router = useRouter();

  useEffect(() => {
    if (!ranEffect.current) {
      clearCart();
      toast.success("Order completed successfully!");
      ranEffect.current = true; // set the flag
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F9FAFB] px-4">
      <h1 className="text-3xl font-bold text-[#1B263B] mb-4">Payment Successful 🎉</h1>
      <p className="text-gray-700 text-lg mb-8">
        Your order has been placed and is being processed.
      </p>
      <button
        className="bg-[#F76C6C] text-white px-6 py-2 rounded hover:bg-red-600 transition"
        onClick={() => router.push("/")}
      >
        Back to Home
      </button>
    </div>
  );
}
