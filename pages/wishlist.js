import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="min-h-screen px-6 py-10 bg-[#F4F6F8]">
      <h1 className="text-3xl font-semibold text-[#1B263B] mb-8">Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <p>You have no items in your wishlist. <Link href="/shop" className="text-[#F76C6C] underline">Shop now</Link></p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
