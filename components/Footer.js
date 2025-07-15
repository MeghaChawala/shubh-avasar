import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#F8F9FA] text-gray-800 pt-8 pb-4 text-center text-sm mt-auto border-t">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          {/* Link Section */}
          <div className="flex flex-wrap justify-center md:justify-start space-x-6 text-base">
            <Link href="/about" legacyBehavior>
              <a className="hover:text-red-600 transition">About</a>
            </Link>
            <Link href="/contact" legacyBehavior>
              <a className="hover:text-red-600 transition">Contact</a>
            </Link>
            <Link href="/legal" legacyBehavior>
              <a className="hover:text-red-600 transition">Privacy & Terms</a>
            </Link>
            {/* <a href="#" className="hover:text-red-600 transition">Privacy</a>
            <a href="#" className="hover:text-red-600 transition">Terms</a> */}
          </div>

          {/* Social Icons */}
          <div className="flex justify-center space-x-6">
            {/* Facebook */}
            <div className="relative group">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1877F2] text-3xl hover:scale-110 transition-transform"
              >
                <FaFacebookF />
              </a>
              <div className="hidden md:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Facebook
              </div>
            </div>

            {/* Instagram */}
            <div className="relative group">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E1306C] text-3xl hover:scale-110 transition-transform"
              >
                <FaInstagram />
              </a>
              <div className="hidden md:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Instagram
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs mt-3 text-gray-500">© 2025 Shubh Avasar. All rights reserved.</div>
      </div>
               <a
        href="https://wa.me/15551234567"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp Chat"
          className="w-12 h-12 rounded-full shadow-lg hover:scale-110 transition-transform"
        />
      </a>
    </footer>
  );
}
