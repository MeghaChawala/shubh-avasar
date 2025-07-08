import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import FiltersSidebar from "@/components/FiltersSidebar";
import FilterDrawer from "@/components/FilterDrawer";
import ProductCard from "@/components/ProductCard";
import Breadcrumb from "@/components/Breadcrumb";

const PAGE_SIZE = 6;

export default function ShopPage() {
  const router = useRouter();
  const initialCategory = router.query.category || "";

  // Filters for the UI
  const filters = {
    price: ["Under $50", "$50 - $100", "Above $100"],
    color: ["Red", "Blue", "Green", "Yellow", "Pink"],
    size: ["S", "M", "L", "XL"],
    category: ["Kurtas", "Party Wear", "Navratri Collection", "T-Shirts"],
    tailoring: ["Yes", "No"],
  };

  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    price: [],
    color: [],
    size: [],
    category: [],
    tailoring: [],
  });

  const [page, setPage] = useState(1);

  // Load initial category into filters
  useEffect(() => {
    if (!initialCategory) return;

    setSelectedFilters((prev) => {
      if (prev.category.length === 0) {
        return {
          ...prev,
          category: [initialCategory],
        };
      }
      return prev;
    });
  }, [initialCategory]);

  // Fetch all products (category filtering is done client-side now)
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
      } catch (err) {
        setError("Failed to load products.");
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // Handle filter changes
  function handleFilterChange(filterKey, option, checked) {
    setSelectedFilters((prev) => {
      const options = prev[filterKey] || [];
      let updatedOptions;

      if (checked) {
        updatedOptions = [...options, option];

        // Remove initial category from URL if manually selecting something else
        if (
          filterKey === "category" &&
          options.includes(initialCategory) &&
          option !== initialCategory
        ) {
          updatedOptions = updatedOptions.filter((cat) => cat !== initialCategory);
        }

      } else {
        updatedOptions = options.filter((o) => o !== option);
      }

      return {
        ...prev,
        [filterKey]: updatedOptions,
      };
    });

    setPage(1); // Reset to first page
  }

  // Client-side filtering logic
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
    ) return false;

    if (
      color.length > 0 &&
      (!product.colors || !product.colors.some((c) => color.includes(c)))
    ) return false;

    if (
      size.length > 0 &&
      (!product.sizes || !product.sizes.some((s) => size.includes(s)))
    ) return false;

    if (
      category.length > 0 &&
      !category.includes(product.category)
    ) return false;

    if (
      tailoring.length > 0 &&
      !tailoring.includes(product.tailoring)
    ) return false;

    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <p className="p-6">Loading products...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div
      className="min-h-screen bg-[#F4F6F8] px-6 py-10"
      style={{
        backgroundImage:
          "repeating-radial-gradient(circle at center, rgba(247,108,108,0.1) 0, rgba(247,108,108,0.1) 1px, transparent 1px, transparent 40px)",
      }}
    >
      <Breadcrumb category={initialCategory} />

      <h1 className="text-3xl font-semibold text-[#1A2A6C] mb-8">
        {selectedFilters.category.length > 0
          ? `Shop: ${selectedFilters.category.join(", ")}`
          : initialCategory
            ? `Shop: ${initialCategory}`
            : "All Products"}
      </h1>

      <div className="flex gap-10">
        {/* Desktop Filters */}
        <div className="hidden md:block w-64">
          <FiltersSidebar
            filters={filters}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Mobile Filter Drawer */}
        <FilterDrawer
          filters={filters}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
        />

        {/* Product Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedProducts.length === 0 ? (
            <p>No products found.</p>
          ) : (
            paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-10 space-x-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 bg-[#1A2A6C] text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-[#1A2A6C] font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-4 py-2 bg-[#1A2A6C] text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
