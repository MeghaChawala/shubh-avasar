import { useState } from "react";
import { FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function FilterDrawer({ filters, selectedFilters, onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        className="md:hidden fixed bottom-4 right-4 bg-[#F76C6C] text-white px-4 py-2 rounded-full shadow-lg z-50"
        onClick={() => setIsOpen(true)}
      >
        Filters
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-[#1B263B]">Filters</h2>
          <button onClick={() => setIsOpen(false)} aria-label="Close filters">
            <FaTimes size={24} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {Object.entries(filters).map(([key, options]) => (
            <div key={key} className="border-b pb-3">
              <button
                type="button"
                onClick={() => toggleSection(key)}
                className="flex justify-between w-full font-semibold text-[#1B263B] text-lg"
              >
                <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                {openSections[key] ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {openSections[key] && (
                <div className="mt-2 space-y-2">
                  {options.map((option) => (
                    <label
                      key={option}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFilters[key]?.includes(option) || false}
                        onChange={(e) =>
                          onFilterChange(key, option, e.target.checked)
                        }
                        className="h-5 w-5 text-[#F76C6C] rounded"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <button
            className="w-full py-2 text-center bg-[#F76C6C] text-white font-semibold rounded hover:bg-red-600 transition"
            onClick={() => {
              Object.keys(filters).forEach((key) => {
                selectedFilters[key]?.forEach((option) =>
                  onFilterChange(key, option, false)
                );
              });
              setIsOpen(false);
            }}
          >
            Clear All
          </button>
        </div>
      </aside>
    </>
  );
}
