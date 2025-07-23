import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import Image from "next/image";

export default function OrderDetails() {
  const router = useRouter();
  const { orderId } = router.query;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.replace("/");
      } else {
        setUser(firebaseUser);
      }
    });

    return () => unsubscribe();
  }, [orderId]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || !user) return;

      try {
        const docRef = doc(db, "orders", orderId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const orderData = { id: docSnap.id, ...docSnap.data() };

          if (orderData.userUid !== user.uid) {
            setUnauthorized(true);
            setOrder(null);
          } else {
            setOrder(orderData);
          }
        } else {
          setOrder(null);
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (unauthorized) return <p className="p-6 text-red-500">Unauthorized access</p>;
  if (!order) return <p className="p-6 text-gray-500">Order not found</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-[#1B263B]">
      <h1 className="text-3xl font-bold mb-6">Order Summary</h1>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Metadata */}
        <div className="mb-6">
          <div className="flex justify-between flex-wrap gap-2">
            <p className="text-sm text-gray-600">Order ID: {order.id}</p>
            <p className="text-sm text-gray-600">
              Date: {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mt-3 ${
              order.status === "paid"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {order.status}
          </span>
        </div>

        {/* Shipping */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Shipping Information</h2>
          <div className="text-sm text-gray-700 space-y-1">
            <p>{order.fullName}</p>
            <p>{order.address}</p>
            <p>
              {order.city}, {order.province} {order.postalCode}
            </p>
            <p>{order.country}</p>
            <p>Email: {order.email}</p>
            <p>Phone: {order.phone}</p>
          </div>
        </div>

        {/* Items */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Items</h2>
          <ul className="space-y-4">
            {order.items?.map((item, idx) => (
              <li
                key={idx}
                className="flex flex-col sm:flex-row gap-4 border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
              >
                <div className="flex-shrink-0">
  <Image
    src={item.image || "/placeholder.png"}
    alt={item.name}
    width={96}
    height={96}
    className="object-cover rounded border"
  />
</div>


                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <p className="font-semibold text-base">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.qty} · ₹{item.price.toFixed(2)}{" "}
                      {item.size && `· Size: ${item.size}`}
                    </p>
                    {item.color && (
                      <p className="text-sm text-gray-500">Color: {item.color}</p>
                    )}
                  </div>

                  {item.productId && (
                    <button
                      onClick={() => router.push(`/product/${item.productId}`)}
                      className="text-sm text-blue-600 mt-2 hover:underline self-start cursor-pointer"
                    >
                      Buy Again
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Total */}
        <div className="border-t pt-4 mt-4">
          <p className="text-sm text-gray-700">
            Currency: <span className="font-medium">{order.currency?.toUpperCase()}</span>
          </p>
          <p className="text-lg font-bold mt-1">
            Total Paid: ₹{order.amountTotal?.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
