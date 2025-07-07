import { useState } from "react";
import { useForm } from "react-hook-form";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth ,db} from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function ForgotPasswordForm({ switchTo, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const [firebaseError, setFirebaseError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const onSubmit = async ({ email }) => {
    setFirebaseError("");
    setSuccessMsg("");
     try {
          const q = query(collection(db, "users"), where("email", "==", email.toLowerCase()));
          const querySnapshot = await getDocs(q);
          console.log("Querying for email:", email.toLowerCase());
          console.log("Docs found:", querySnapshot.docs.map(doc => doc.data()));
    
          if (querySnapshot.empty) {
            setFirebaseError("Email is not registered.");

            return;
          }
    
          await sendPasswordResetEmail(auth, email);
          setSuccessMsg("Password reset email sent! Check your inbox.");
        } catch (err) {
          setFirebaseError("Failed to send reset email. Please try again later.");
          console.error(err);
        }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-6 text-[#1A2A6C]">Reset Password</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-[#1A2A6C]">
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

        {firebaseError && <p className="text-[#F76C6C] text-sm text-center">{firebaseError}</p>}
        {successMsg && <p className="text-green-600 text-sm text-center">{successMsg}</p>}

        <button
          type="submit"
          className="w-full bg-[#1A2A6C] text-white font-semibold py-3 rounded-md hover:bg-[#F76C6C] transition"
        >
          Send Reset Link
        </button>
      </form>

      <p className="text-sm text-center mt-6 text-[#1A2A6C]">
        Back to{" "}
        <button onClick={() => switchTo("login")} className="text-[#F76C6C] underline font-medium">
          Login
        </button>
      </p>
    </>
  );
}
