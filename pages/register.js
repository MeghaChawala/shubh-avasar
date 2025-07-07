import { useState } from "react";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/router";
import { setDoc, doc } from "firebase/firestore";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [firebaseError, setFirebaseError] = useState("");
  const router = useRouter();

  const onSubmit = async (data) => {
    setFirebaseError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await updateProfile(userCredential.user, { displayName: data.name });

      // Save user info in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: data.name,
        email: data.email.toLowerCase(),
      });

      router.push("/");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setFirebaseError("Email already in use.");
      } else {
        setFirebaseError(error.message);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Create an Account</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            {...register("name", { required: "Name required" })}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.name && <p className="text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email required" })}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.email && <p className="text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password required", minLength: 6 })}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.password && <p className="text-red-600">{errors.password.message}</p>}
        </div>

        {firebaseError && <p className="text-red-600">{firebaseError}</p>}

        <button
          type="submit"
          className="w-full bg-[#B91C1C] text-white py-2 rounded hover:bg-red-700 transition"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-red-600 hover:underline">
          Login
        </a>
      </p>
    </div>
  );
}
