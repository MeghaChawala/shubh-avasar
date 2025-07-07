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
  const category = router.query.category || "";

  // Filters available for UI
  const filters = {
    price: ["Under $50", "$50 - $100", "Above $100"],
    color: ["Red", "Blue", "Green", "Yellow", "Pink"],
    size: ["S", "M", "L", "XL"],
    shippingTime: ["1-3 days", "4-7 days", "More than a week"],
    tailoring: ["Yes", "No"],
  };

  // State to hold products, loading, errors
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for selected filters
  const [selectedFilters, setSelectedFilters] = useState({
    price: [],
    color: [],
    size: [],
    shippingTime: [],
    tailoring: [],
  });

  // Pagination state
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const q = category
          ? query(collection(db, "products"), where("category", "==", category))
          : collection(db, "products");

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
  }, [category]);

  // Filter products client side based on selected filters
  const filteredProducts = productsData.filter((product) => {
    // Price filter
    if (selectedFilters.price.length > 0) {
      const price = product.price;
      const priceMatch = selectedFilters.price.some((priceFilter) => {
        if (priceFilter === "Under $50") return price < 50;
        if (priceFilter === "$50 - $100") return price >= 50 && price <= 100;
        if (priceFilter === "Above $100") return price > 100;
        return false;
      });
      if (!priceMatch) return false;
    }

    // Color filter (assuming product.colors is array)
    if (
      selectedFilters.color.length > 0 &&
      (!product.colors || !product.colors.some((c) => selectedFilters.color.includes(c)))
    ) {
      return false;
    }

    // Size filter (assuming product.sizes is array)
    if (
      selectedFilters.size.length > 0 &&
      (!product.sizes || !product.sizes.some((s) => selectedFilters.size.includes(s)))
    ) {
      return false;
    }

    // Shipping time filter
    if (
      selectedFilters.shippingTime.length > 0 &&
      !selectedFilters.shippingTime.includes(product.shippingTime)
    ) {
      return false;
    }

    // Tailoring filter
    if (
      selectedFilters.tailoring.length > 0 &&
      !selectedFilters.tailoring.includes(product.tailoring)
    ) {
      return false;
    }

    return true;
  });

  // Pagination slicing
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Handle filter change from sidebar/drawer
  function handleFilterChange(filterKey, option, checked) {
    setSelectedFilters((prev) => {
      const options = prev[filterKey] || [];
      if (checked) {
        return { ...prev, [filterKey]: [...options, option] };
      } else {
        return { ...prev, [filterKey]: options.filter((o) => o !== option) };
      }
    });
    setPage(1); // reset page on filter change
  }

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
      <Breadcrumb category={category} />

      <h1 className="text-3xl font-semibold text-[#1A2A6C] mb-8">
        {category ? `Shop: ${category}` : "All Products"}
      </h1>

      <div className="flex gap-10">
        {/* Sidebar filters on desktop */}
        <div className="hidden md:block w-64">
          <FiltersSidebar
            filters={filters}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Mobile filter drawer */}
        <FilterDrawer
          filters={filters}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
        />

        {/* Products grid */}
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
