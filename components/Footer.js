import { FaFacebookF, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#F8F9FA] text-gray-800 pt-8 pb-4 text-center text-sm mt-12 border-t"> {/* bg-[#1F2937] text-white */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          {/* Link Section */}
          <div className="space-x-4 mb-4 md:mb-0 text-base">
            <a href="#" className="hover:text-red-600 transition">About</a>
            <a href="#" className="hover:text-red-600 transition">Contact</a>
            <a href="#" className="hover:text-red-600 transition">Privacy</a>
            <a href="#" className="hover:text-red-600 transition">Terms</a>
          </div>

          {/* Social Icons with Tooltip */}
          <div className="flex space-x-6 relative">
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
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Instagram
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs mt-3 text-gray-500">© 2025 Shubh Avasar. All rights reserved.</div>
      </div>
    </footer>
  );
}
