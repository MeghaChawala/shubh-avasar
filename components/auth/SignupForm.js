import { useForm } from "react-hook-form";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function SignupForm({ switchTo, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [firebaseError, setFirebaseError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const onSubmit = async (data) => {
    setFirebaseError("");
    setSuccessMsg("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: data.name,
        email: data.email,
        createdAt: new Date(),
      });

      setSuccessMsg("Signup successful!");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setFirebaseError("Email already registered.");
      } else {
        setFirebaseError("Signup failed. Please try again.");
      }
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-6 text-[#1B263B]">Sign Up</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-[#1B263B]">
        <input
          {...register("name", { required: "Name is required" })}
          placeholder="Full Name"
          className="w-full border border-gray-300 rounded-md px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F76C6C]"
        />
        {errors.name && <p className="text-[#F76C6C] text-sm">{errors.name.message}</p>}

        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email",
            },
          })}
          placeholder="Email"
          type="email"
          className="w-full border border-gray-300 rounded-md px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F76C6C]"
        />
        {errors.email && <p className="text-[#F76C6C] text-sm">{errors.email.message}</p>}

        <input
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Minimum 6 characters" },
          })}
          placeholder="Password"
          type="password"
          className="w-full border border-gray-300 rounded-md px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F76C6C]"
        />
        {errors.password && <p className="text-[#F76C6C] text-sm">{errors.password.message}</p>}

        {firebaseError && <p className="text-[#F76C6C] text-sm text-center">{firebaseError}</p>}
        {successMsg && <p className="text-green-600 text-sm text-center">{successMsg}</p>}

        <button
          type="submit"
          className="w-full bg-[#1B263B] text-white font-semibold py-3 rounded-md hover:bg-[#F76C6C] transition"
          disabled={!!successMsg}
        >
          Sign Up
        </button>
      </form>

      <p className="text-sm text-center mt-6 text-[#1B263B]">
        Already have an account?{" "}
        <button
          onClick={() => switchTo("login")}
          className="text-[#F76C6C] underline font-medium"
        >
          Login
        </button>
      </p>
    </>
  );
}
