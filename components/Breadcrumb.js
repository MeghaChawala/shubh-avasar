import Link from "next/link";

export default function Breadcrumb({ category, productName }) {
  return (
    <nav className="text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
      <ol className="list-reset flex space-x-2">
        <li>
          <Link href="/">Home
          </Link>
        </li>
        {category && (
          <>
            <li>/</li>
            <li>
              <Link href={`/shop?category=${encodeURIComponent(category)}`}>{category}
              </Link>
            </li>
          </>
        )}
        {productName && (
          <>
            <li>/</li>
            <li className="font-semibold">{productName}</li>
          </>
        )}
      </ol>
    </nav>
  );
}
