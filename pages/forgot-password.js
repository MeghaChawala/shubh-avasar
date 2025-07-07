import { useState, useEffect } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("ForgotPassword component loaded");
    setMessage("");
    setError("");
    setEmail("");
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    console.log("Submit triggered");
    setMessage("");
    setError("");

    try {
      const q = query(collection(db, "users"), where("email", "==", email.toLowerCase()));
      const querySnapshot = await getDocs(q);
      console.log("Querying for email:", email.toLowerCase());
      console.log("Docs found:", querySnapshot.docs.map(doc => doc.data()));

      if (querySnapshot.empty) {
        setError("Email is not registered.");
        return;
      }

      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (err) {
      setError("Failed to send reset email. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Reset Password</h2>
      <form onSubmit={handleReset} className="space-y-4" noValidate>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full bg-[#B91C1C] text-white py-2 rounded hover:bg-red-700 transition"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
