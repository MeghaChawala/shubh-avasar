import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import FiltersSidebar from "@/components/FiltersSidebar";
import FilterDrawer from "@/components/FilterDrawer";
import ProductCard from "@/components/ProductCard";
import Breadcrumb from "@/components/Breadcrumb";

const PAGE_SIZE = 9;

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;

  const [filters, setFilters] = useState({
    price: ["Under $50", "$50 - $100", "Above $100"],
    color: [],
    size: [],
    category: [],
    tailoring: [],
  });

  const [sortOption, setSortOption] = useState("newest");
  const [productsData, setProductsData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    price: [],
    color: [],
    size: [],
    category: [],
    tailoring: [],
  });

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set selected category from URL
  useEffect(() => {
    if (!category) return;
    setSelectedFilters((prev) => ({
      ...prev,
      category: [category],
    }));
    setPage(1);
  }, [category]);

  // Fetch products and populate filters
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const q = collection(db, "products");
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProductsData(items);

        const uniqueColors = new Set();
        const uniqueSizes = new Set();
        const uniqueCategories = new Set();
        const uniqueTailoring = new Set();

        items.forEach((product) => {
          Object.entries(product.colorVariants || {}).forEach(([clr, variant]) => {
            uniqueColors.add(clr);
            variant.sizes?.forEach((sz) => uniqueSizes.add(sz));
          });
          if (product.category) uniqueCategories.add(product.category);
          if (product.tailoring) uniqueTailoring.add(product.tailoring);
        });

        setFilters({
          price: ["Under $50", "$50 - $100", "Above $100"],
          color: Array.from(uniqueColors).sort(),
          size: Array.from(uniqueSizes).sort(),
          category: Array.from(uniqueCategories).sort(),
          tailoring: Array.from(uniqueTailoring).sort(),
        });
      } catch (err) {
        setError("Failed to load products.");
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  // Filter logic
  const filteredProducts = productsData.filter((product) => {
    const { price, color, size, category, tailoring } = selectedFilters;

    if (
      price.length > 0 &&
      !price.some((range) => {
        if (range === "Under $50") return product.price < 50;
        if (range === "$50 - $100") return product.price >= 50 && product.price <= 100;
        if (range === "Above $100") return product.price > 100;
        return false;
      })
    )
      return false;

    if (category.length > 0 && !category.includes(product.category)) return false;
    if (tailoring.length > 0 && !tailoring.includes(product.tailoring)) return false;

    if (color.length > 0 || size.length > 0) {
      const matched = Object.entries(product.colorVariants || {}).some(([clr, variant]) => {
        const colorMatch = color.length === 0 || color.includes(clr);
        const sizeMatch = size.length === 0 || (variant.sizes || []).some((s) =>
          size.includes(s)
        );
        return colorMatch && sizeMatch;
      });
      if (!matched) return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "priceLowHigh") return a.price - b.price;
    if (sortOption === "priceHighLow") return b.price - a.price;
    if (sortOption === "nameAZ") return a.name.localeCompare(b.name);
    if (sortOption === "nameZA") return b.name.localeCompare(a.name);
    return new Date(b.createdAt?.seconds * 1000 || 0) - new Date(a.createdAt?.seconds * 1000 || 0);
  });

  const paginatedProducts = sortedProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleFilterChange = (filterKey, option, checked) => {
    setSelectedFilters((prev) => {
      const options = prev[filterKey] || [];
      const updatedOptions = checked
        ? [...options, option]
        : options.filter((o) => o !== option);

      return {
        ...prev,
        [filterKey]: updatedOptions,
      };
    });
    setPage(1);
  };

  if (loading) return <p className="p-6">Loading products...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  const isFiltered =
    selectedFilters.price.length > 0 ||
    selectedFilters.color.length > 0 ||
    selectedFilters.size.length > 0 ||
    selectedFilters.tailoring.length > 0;

  return (
    <div
      className="min-h-screen bg-[#F4F6F8] px-6 py-10"
      style={{
        backgroundImage:
          "repeating-radial-gradient(circle at center, rgba(247,108,108,0.1) 0, rgba(247,108,108,0.1) 1px, transparent 1px, transparent 40px)",
      }}
    >
      <Breadcrumb
        category={
          selectedFilters.category.length > 0
            ? selectedFilters.category[0]
            : isFiltered
            ? "Filtered"
            : "All"
        }
      />

      <h1 className="text-3xl font-semibold text-[#1B263B] mb-8 capitalize">
        {selectedFilters.category.length > 0
          ? `Shop: ${selectedFilters.category.join(", ")}`
          : isFiltered
          ? "Filtered Products"
          : "All Products"}
      </h1>

      <div className="flex gap-10">
        {/* Sidebar Filters */}
        <div className="hidden md:block w-64">
          <FiltersSidebar
            filters={filters}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Main Content: Sort + Products */}
        <div className="flex-1 flex flex-col">
          <FilterDrawer
            filters={filters}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />

          {/* Sort Dropdown */}
          <div className="flex justify-end mb-6">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-[#1B263B] rounded px-3 py-2 text-sm text-[#1B263B] font-medium"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="nameAZ">Name: A-Z</option>
              <option value="nameZA">Name: Z-A</option>
            </select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedProducts.length === 0 ? (
              <p>No products found.</p>
            ) : (
              paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-10 space-x-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 bg-[#1B263B] text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-[#1B263B] font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-4 py-2 bg-[#1B263B] text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
