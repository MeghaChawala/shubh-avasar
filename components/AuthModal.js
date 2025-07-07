import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import LoginForm from "./auth/LoginForm";
import SignupForm from "./auth/SignupForm";
import ForgotPasswordForm from "./auth/ForgotPasswordForm";

export default function AuthModal({ isOpen, onClose }) {
  const [view, setView] = useState("login"); // 'login' | 'signup' | 'forgot'

  const renderForm = () => {
    if (view === "signup") return <SignupForm switchTo={setView} onClose={onClose} />;
    if (view === "forgot") return <ForgotPasswordForm switchTo={setView} onClose={onClose} />;
    return <LoginForm switchTo={setView} onClose={onClose} />;
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Dialog.Panel className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
        {/* ❌ Close Button */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-black">
          <XMarkIcon className="h-5 w-5" />
        </button>

        {renderForm()}
      </Dialog.Panel>
    </Dialog>
  );
}
