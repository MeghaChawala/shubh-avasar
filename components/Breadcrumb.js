import Link from "next/link";
import { useRouter } from "next/router";

export default function Breadcrumb({ category, productName }) {
  const router = useRouter();
  const currentPage = router.query.page || 1;
  const isRealCategory = category && !["All", "Filtered"].includes(category);

  return (
    <nav className="text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
      <ol className="list-reset flex space-x-2 items-center">
        <li>
          <Link href="/" className="hover:underline text-[#1B263B] font-medium">Home</Link>
        </li>

        {category && (
          <>
            <li>/</li>
            <li>
              {isRealCategory ? (
                <Link
                  href={{
                    pathname: "/shop",
                    query: {
                      category: encodeURIComponent(category),
                      page: currentPage,
                    },
                  }}
                  className="hover:underline text-[#1B263B]"
                >
                  {category}
                </Link>
              ) : (
                <span className="text-gray-500">{category}</span>
              )}
            </li>
          </>
        )}

        {productName && (
          <>
            <li>/</li>
            <li className="font-semibold text-gray-500">{productName}</li>
          </>
        )}
      </ol>
    </nav>
  );
}
