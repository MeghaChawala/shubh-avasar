export default function FiltersSidebar({ filters, selectedFilters, onFilterChange }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-[#1B263B]">Filters</h2>

      {Object.entries(filters).map(([filterKey, options]) => {
        if (!options.length) return null; // skip empty filters

        return (
          <div key={filterKey} className="mb-6">
            <h3 className="font-semibold mb-2 capitalize text-[#1B263B]">{filterKey}</h3>
            <div className="flex flex-wrap gap-2">
              {options.map((option) => {
                const isChecked = selectedFilters[filterKey]?.includes(option);

                return (
                  <label
                    key={option}
                    className={`cursor-pointer px-3 py-1 border rounded-full select-none
                      ${isChecked ? "bg-[#F76C6C] text-white border-[#F76C6C]" : "bg-white text-gray-800 border-gray-300"}
                    `}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={isChecked}
                      onChange={(e) => onFilterChange(filterKey, option, e.target.checked)}
                    />
                    {option}
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
