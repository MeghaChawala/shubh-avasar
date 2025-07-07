import { useState } from "react";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";
import Link from "next/link";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [firebaseError, setFirebaseError] = useState("");
  const router = useRouter();

  useEffect(() => {
    console.log("ForgotPassword component mounted");
  }, []);
  const onSubmit = async (data) => {
    setFirebaseError("");
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push("/"); // redirect after login success
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setFirebaseError("Email not found. Please sign up.");
      } else if (error.code === "auth/wrong-password") {
        setFirebaseError("Wrong password. Try again.");
      } else {
        setFirebaseError(error.message);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Login to Shubh Avasar</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
            {...register("password", { required: "Password required" })}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.password && <p className="text-red-600">{errors.password.message}</p>}
        </div>

        {firebaseError && <p className="text-red-600">{firebaseError}</p>}

        <button
          type="submit"
          className="w-full bg-[#B91C1C] text-white py-2 rounded hover:bg-red-700 transition"
        >
          Login
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" legacyBehavior>
          <a className="text-red-600 hover:underline">Sign Up</a>
        </Link>
      </p>

      <p className="mt-2 text-center text-sm">
        <Link href="/forgot-password" >Forgot Password?
        </Link>
      </p>
    </div>
  );
}
