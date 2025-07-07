import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import Link from "next/link";

export default function Orders() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const userOrders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(userOrders);
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
        <p>Please <Link href="/"><a className="text-red-600 underline">login</a></Link> to view your orders.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
        <p>You have no orders yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Order ID</th>
            <th className="border border-gray-300 p-2 text-left">Date</th>
            <th className="border border-gray-300 p-2 text-left">Status</th>
            <th className="border border-gray-300 p-2 text-left">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{order.id}</td>
              <td className="border border-gray-300 p-2">
                {order.date
                  ? new Date(order.date.seconds * 1000).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="border border-gray-300 p-2">{order.status || "N/A"}</td>
              <td className="border border-gray-300 p-2">
                {order.total ? `$${order.total.toFixed(2)}` : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
