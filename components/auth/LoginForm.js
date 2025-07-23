import { useState } from "react";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

export default function LoginForm({ switchTo, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [firebaseError, setFirebaseError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const redirectAfterLogin = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const redirectTo = searchParams.get("redirectTo") || "/";
    setTimeout(() => {
      onClose?.(); // Only call if available (optional modal support)
      window.location.href = redirectTo;
    }, 1000);
  };

  const onSubmit = async (data) => {
    setFirebaseError("");
    setSuccessMsg("");
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      setSuccessMsg("Logged in successfully!");
      redirectAfterLogin();
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setFirebaseError("Email not registered.");
      } else if (err.code === "auth/wrong-password") {
        setFirebaseError("Incorrect password.");
      } else {
        setFirebaseError("Login failed. Please try again.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    setFirebaseError("");
    setSuccessMsg("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || "",
          email: user.email,
          createdAt: new Date(),
        });
      }

      setSuccessMsg("Logged in with Google!");
      redirectAfterLogin();
    } catch (err) {
      setFirebaseError("Google login failed. Please try again.");
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-6 text-[#1B263B]">Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-[#1B263B]">
        {/* Email */}
        <div>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            placeholder="Email"
            type="email"
            className="w-full border border-gray-300 rounded-md px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F76C6C] focus:border-transparent"
          />
          {errors.email && (
            <p className="text-[#F76C6C] text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            placeholder="Password"
            className="w-full border border-gray-300 rounded-md px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F76C6C] focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-[#1B263B]"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
          {errors.password && (
            <p className="text-[#F76C6C] text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {firebaseError && (
          <p className="text-[#F76C6C] text-center text-sm font-semibold">{firebaseError}</p>
        )}

        {successMsg && (
          <p className="text-green-600 text-center text-sm font-semibold">{successMsg}</p>
        )}

        <button
          type="submit"
          className="w-full bg-[#1B263B] text-white font-semibold py-3 rounded-md hover:bg-[#F76C6C] transition"
          disabled={!!successMsg}
        >
          Login
        </button>
      </form>

      <div className="my-4 text-center text-sm text-gray-500">or</div>

      <button
        onClick={handleGoogleLogin}
        type="button"
        className="flex items-center justify-center gap-2 w-full border border-gray-300 py-3 rounded-md hover:bg-[#f0f4fa] transition"
      >
        <FaGoogle className="text-[#EA4335]" />
        <span className="text-[#1B263B] font-medium">Continue with Google</span>
      </button>

      <p className="text-sm text-center mt-6 text-[#1B263B]">
        Don&apos;t have an account?{" "}
        <button
          onClick={() => switchTo("signup")}
          className="text-[#F76C6C] underline font-medium"
          disabled={!!successMsg}
        >
          Sign Up
        </button>
      </p>

      <p className="text-sm text-center mt-2 text-[#1B263B]">
        <button
          onClick={() => switchTo("forgot")}
          className="text-[#F76C6C] underline font-medium"
          disabled={!!successMsg}
        >
          Forgot Password?
        </button>
      </p>
    </>
  );
}
