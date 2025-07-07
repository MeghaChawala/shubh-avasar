import { useState } from "react";

export default function FilterDrawer({ filters, selectedFilters, onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Filter Toggle Button - visible only on mobile */}
      <button
        className="md:hidden fixed bottom-4 right-4 z-50 bg-[#F76C6C] text-white px-4 py-2 rounded shadow-lg"
        onClick={() => setIsOpen(true)}
        aria-label="Open Filters"
      >
        Filters
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:hidden overflow-y-auto`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#1A2A6C]">Filters</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[#F76C6C] font-bold text-xl"
            aria-label="Close Filters"
          >
            &times;
          </button>
        </div>

        <div className="p-4 space-y-6">
          {Object.entries(filters).map(([filterKey, options]) => (
            <div key={filterKey}>
              <h3 className="text-[#1A2A6C] font-semibold mb-2 capitalize">
                {filterKey === "shippingTime" ? "Time to Dispatch" : filterKey}
              </h3>
              <div className="flex flex-col space-y-2">
                {options.map((option) => (
                  <label
                    key={option}
                    className="inline-flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFilters[filterKey]?.includes(option) || false}
                      onChange={(e) =>
                        onFilterChange(filterKey, option, e.target.checked)
                      }
                      className="cursor-pointer"
                    />
                    <span className="text-[#1A2A6C]">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
