import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export default function Account() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Account Info</h1>
        <p>Please <Link href="/"><a className="text-red-600 underline">login</a></Link> to see your account details.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Account Information</h1>

      <div className="bg-white p-6 rounded shadow space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Name</h2>
          <p>{user.displayName || "Not set"}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Email</h2>
          <p>{user.email}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">User ID</h2>
          <p>{user.uid}</p>
        </div>
      </div>
    </div>
  );
}
