export default function FiltersSidebar({ filters = {}, onFilterChange }) {
  return (
    <aside className="w-full lg:w-64 space-y-6">
      {Object.entries(filters).map(([filterKey, options]) => (
        <div key={filterKey} className="pb-4 border-b border-gray-300">
          <h3 className="text-lg font-semibold text-[#1A2A6C] capitalize mb-3">
            {filterKey === "tailoring"
              ? "Tailoring Options"
              : filterKey}
          </h3>

          <div className="space-y-2">
            {options.map((option) => (
              <label key={option} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-[#F76C6C] w-4 h-4"
                  value={option}
                  onChange={(e) =>
                    onFilterChange(filterKey, option, e.target.checked)
                  }
                />
                <span className="ml-2 text-[#1A2A6C] hover:text-[#F76C6C] transition text-sm">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
