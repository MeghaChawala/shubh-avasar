import { useForm } from "react-hook-form";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

export default function SignupForm({ switchTo, onClose }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [firebaseError, setFirebaseError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("password");

  const onSubmit = async (data) => {
    setFirebaseError("");
    setSuccessMsg("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: data.name,
        email: data.email,
        phone: `${data.countryCode}${data.phone}`,
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
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">
            Full Name<span className="text-[#F76C6C]">*</span>
          </label>
          <input
            {...register("name", { required: "Name is required" })}
            placeholder="John Doe"
            className="w-full border border-gray-300 rounded-md px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F76C6C]"
          />
          {errors.name && <p className="text-[#F76C6C] text-sm">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">
            Email Address<span className="text-[#F76C6C]">*</span>
          </label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address (Ex: johndoe@domain.com).",
              },
            })}
            placeholder="johndoe@example.com"
            type="email"
            className="w-full border border-gray-300 rounded-md px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F76C6C]"
          />
          {errors.email && <p className="text-[#F76C6C] text-sm">{errors.email.message}</p>}
        </div>

        {/* Phone with Country Code */}
        <div>
          <label className="block mb-1 font-medium">
            Phone Number<span className="text-[#F76C6C]">*</span>
          </label>
          <div className="flex gap-2">
            <select
              {...register("countryCode", { required: true })}
              className="w-1/3 border border-gray-300 rounded-md px-2 py-3 focus:outline-none focus:ring-2 focus:ring-[#F76C6C]"
            >
              <option value="+1">🇺🇸 +1</option>
<option value="+1">🇨🇦 +1</option>

            </select>
            <input
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Phone number must be exactly 10 digits",
                },
              })}
              placeholder="9876543210"
              type="tel"
              className="w-2/3 border border-gray-300 rounded-md px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F76C6C]"
            />
          </div>
          {errors.phone && <p className="text-[#F76C6C] text-sm">{errors.phone.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-medium">
            Password<span className="text-[#F76C6C]">*</span>
          </label>
          <div className="relative">
            <input
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              className="w-full border border-gray-300 rounded-md px-4 py-3 pr-12 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F76C6C]"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 cursor-pointer text-lg"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </span>
          </div>
          {errors.password && <p className="text-[#F76C6C] text-sm">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block mb-1 font-medium">
            Confirm Password<span className="text-[#F76C6C]">*</span>
          </label>
          <div className="relative">
            <input
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) => value === password || "Passwords do not match",
              })}
              placeholder="Re-enter your password"
              type={showConfirmPassword ? "text" : "password"}
              className="w-full border border-gray-300 rounded-md px-4 py-3 pr-12 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F76C6C]"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-3.5 cursor-pointer text-lg"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="text-[#F76C6C] text-sm">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Firebase error & success */}
        {firebaseError && <p className="text-[#F76C6C] text-sm text-center">{firebaseError}</p>}
        {successMsg && <p className="text-green-600 text-sm text-center">{successMsg}</p>}

        {/* Submit */}
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
