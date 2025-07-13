import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { auth } from "@/lib/firebase";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();

  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Canada",
    province: "",
    postalCode: "",
  });

  const [errors, setErrors] = useState({});
  const FIRST_ORDER_DISCOUNT_RATE = 0.1;
  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        setDeliveryInfo((prev) => ({ ...prev, email: user.email }));
      }
    });
    return () => unsubscribe();
  }, []);

  // Province/state options based on country
  const provincesByCountry = {
    Canada: [
      { code: "ON", name: "Ontario" },
      { code: "QC", name: "Quebec" },
      { code: "BC", name: "British Columbia" },
      { code: "AB", name: "Alberta" },
      { code: "MB", name: "Manitoba" },
      // Add more provinces if needed
    ],
    USA: [
      { code: "CA", name: "California" },
      { code: "NY", name: "New York" },
      { code: "TX", name: "Texas" },
      { code: "FL", name: "Florida" },
      { code: "IL", name: "Illinois" },
      // Add more states as needed
    ],
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = subtotal * FIRST_ORDER_DISCOUNT_RATE;
  const discountedSubtotal = subtotal - discount;
  const tax = discountedSubtotal * 0.13;
  const grandTotal = discountedSubtotal + tax + shippingFee;

  const isGTA = (postal) => postal.trim().toUpperCase().startsWith("M");

  useEffect(() => {
    if (deliveryInfo.postalCode) {
      setShippingFee(isGTA(deliveryInfo.postalCode) ? 0 : 5);
    }
  }, [deliveryInfo.postalCode]);

  const handleChange = (e) => {
    setDeliveryInfo({ ...deliveryInfo, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    // Simple email regex validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    // Remove non-digit chars, then check length is 10
    const digits = phone.replace(/\D/g, "");
    return digits.length === 10;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!deliveryInfo.fullName.trim()) newErrors.fullName = "Full Name is required";

    if (!deliveryInfo.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(deliveryInfo.email.trim())) newErrors.email = "Email is invalid";

    if (!deliveryInfo.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!validatePhone(deliveryInfo.phone.trim())) newErrors.phone = "Phone number must be 10 digits";

    if (!deliveryInfo.address.trim()) newErrors.address = "Address is required";
    if (!deliveryInfo.city.trim()) newErrors.city = "City is required";

    if (!deliveryInfo.country) newErrors.country = "Country is required";
    if (!deliveryInfo.province) newErrors.province = "Province/State is required";

    if (!deliveryInfo.postalCode.trim()) newErrors.postalCode = "Postal Code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }
    toast.success("Order placed successfully!");
    clearCart();
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-[#1B263B] mb-8">Checkout</h1>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Cart Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#1B263B]">Your Order</h2>
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex gap-4 items-center border rounded-md p-3"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-[#1B263B]">{item.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {item.selectedColor}, {item.selectedSize}
                  </p>
                  <p className="text-sm mt-1">
                    Qty: {item.qty} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="font-semibold text-right text-[#1B263B]">
                  ${(item.price * item.qty).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 space-y-2 text-[#1B263B]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>First Order Discount:</span>
              <span className="text-green-600">– ${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (13% HST):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span>{shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`}</span>
            </div>
            <hr className="border-t my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Grand Total:</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#1B263B]">Delivery Information</h2>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={deliveryInfo.fullName}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={deliveryInfo.email}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
              <input
                type="text"
                name="phone"
                placeholder="Phone Number (10 digits)"
                value={deliveryInfo.phone}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            <div>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={deliveryInfo.address}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>

            <div>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={deliveryInfo.city}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
              {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
            </div>

            {/* Row of 3: Country, Province/State, Postal Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <select
                  name="country"
                  value={deliveryInfo.country}
                  onChange={(e) => {
                    setDeliveryInfo({
                      ...deliveryInfo,
                      country: e.target.value,
                      province: "", // reset province on country change
                    });
                  }}
                  className="w-full border px-4 py-2 rounded"
                >
                  <option value="">Select Country</option>
                  <option value="Canada">Canada</option>
                  <option value="USA">USA</option>
                </select>
                {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
              </div>

              <div>
                <select
                  name="province"
                  value={deliveryInfo.province}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded"
                  disabled={!deliveryInfo.country}
                >
                  <option value="">{deliveryInfo.country === "USA" ? "State" : "Province"}</option>
                  {(provincesByCountry[deliveryInfo.country] || []).map((prov) => (
                    <option key={prov.code} value={prov.code}>
                      {prov.name}
                    </option>
                  ))}
                </select>
                {errors.province && <p className="text-red-500 text-sm">{errors.province}</p>}
              </div>

              <div>
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={deliveryInfo.postalCode}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded"
                />
                {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode}</p>}
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full bg-[#F76C6C] text-white py-3 rounded hover:bg-red-600 transition"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
