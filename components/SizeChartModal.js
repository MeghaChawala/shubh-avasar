import React from "react";
import Image from "next/image";
import imageKitLoader from "@/loaders/imageKitLoader";

export default function SizeChartModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-11/12 p-4 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl font-bold"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold text-center mb-3 text-[#1B263B]">
          Kids Kurta Size Chart
        </h2>
        <Image
          src="kids-kurta-sizechart.jpeg"  
          alt="Kids Kurta Size Chart"
          width={400}
          height={400}
          className="rounded-lg object-contain w-full"
          loader={imageKitLoader}
        />
      </div>
    </div>
  );
}
