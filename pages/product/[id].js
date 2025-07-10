import { useRouter } from "next/router";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState, useRef } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import { FaHeart, FaRegHeart, FaWhatsapp, FaFacebookF, FaInstagram, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useWishlist } from "@/context/WishlistContext";
import Image from "next/image";
import Link from "next/link";

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [error, setError] = useState("");

  const [colorVariants, setColorVariants] = useState({});
  const [availableSizes, setAvailableSizes] = useState([]);
  const [colorImage, setColorImage] = useState("");

  const { wishlist, toggleWishlist } = useWishlist();
  const isWished = wishlist.some((item) => item.id === product?.id);

  const zoomContainerRef = useRef(null);
  const zoomImageRef = useRef(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        setProduct(data);

        if (data.colorVariants) {
          setColorVariants(data.colorVariants);
          const firstColor = Object.keys(data.colorVariants)[0];
          setSelectedColor(firstColor);
          setAvailableSizes(data.colorVariants[firstColor].sizes || []);
          setColorImage(data.colorVariants[firstColor].image || "");
          setCurrentImg(0);
        } else {
          setColorImage(data.images?.[0] || data.image);
        }

        setSelectedSize("");
        fetchSimilarProducts(data.category);
      }
      setLoading(false);
    };

    const fetchSimilarProducts = async (category) => {
      const q = query(collection(db, "products"), where("category", "==", category));
      const snapshot = await getDocs(q);
      const filtered = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((item) => item.id !== id);
      setSimilarProducts(filtered.slice(0, 6));
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft + container.offsetWidth < container.scrollWidth
      );
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [similarProducts]);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = container.offsetWidth;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!zoomContainerRef.current || !zoomImageRef.current) return;
    const rect = zoomContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    zoomImageRef.current.style.transformOrigin = `${x}% ${y}%`;
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!product) return <p className="p-6">Product not found.</p>;

  const images = colorImage
    ? [colorImage]
    : product.images?.length
    ? product.images
    : [product.image];

  return (
    <div className="min-h-screen px-4 md:px-8 py-10 bg-[#F4F6F8]">
      <Breadcrumb category={product.category} productName={product.name} />

      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg grid md:grid-cols-2 gap-10">
        {/* LEFT: Images */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px]">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setCurrentImg(i)}
                className={`w-16 h-16 object-contain rounded border cursor-pointer ${
                  i === currentImg ? "border-[#F76C6C]" : "border-gray-300"
                }`}
              />
            ))}
          </div>

          <div
            ref={zoomContainerRef}
            className="relative w-full max-h-[600px] rounded overflow-hidden cursor-zoom-in"
            onMouseMove={isZoomed ? handleMouseMove : undefined}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <img
              ref={zoomImageRef}
              src={images[currentImg]}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-300 select-none"
              style={{ transform: isZoomed ? "scale(3)" : "scale(1)" }}
              draggable={false}
            />
            <button
              onClick={() => toggleWishlist(product)}
              className="absolute top-4 right-4 bg-white shadow p-2 rounded-full z-10 hover:bg-gray-100"
              aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
            >
              {isWished ? (
                <FaHeart className="text-[#F76C6C]" />
              ) : (
                <FaRegHeart className="text-[#1B263B]" />
              )}
            </button>
          </div>
        </div>

        {/* RIGHT: Info */}
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl font-bold text-[#1B263B]">{product.name}</h1>
          <p className="text-2xl text-[#F76C6C] font-semibold">${product.price.toFixed(2)}</p>

          {Object.keys(colorVariants).length > 0 && (
            <div>
              <h4 className="font-semibold mb-1">Select Color:</h4>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(colorVariants).map(([color, info]) => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color);
                      setAvailableSizes(info.sizes || []);
                      setColorImage(info.image || "");
                      setCurrentImg(0);
                    }}
                    className={`px-3 py-1 rounded-full border ${
                      color === selectedColor
                        ? "bg-[#F76C6C] text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {availableSizes.length > 0 && (
            <div>
              <h4 className="font-semibold mb-1">Select Size:</h4>
              <div className="flex gap-2 flex-wrap">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 rounded-full border ${
                      size === selectedSize
                        ? "bg-[#F76C6C] text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Out of Stock & Error */}
          {product.quantity === 0 && (
            <p className="text-red-600 font-semibold">Out of Stock</p>
          )}
          {error && <p className="text-red-600 font-medium">{error}</p>}

          {/* Add to Cart Button */}
          <button
            disabled={product.quantity === 0}
            onClick={() => {
              if (product.quantity === 0) return;
              if (!selectedColor || !selectedSize) {
                setError("Please select both color and size.");
              } else {
                setError("");
                console.log("Add to cart:", {
                  productId: product.id,
                  selectedColor,
                  selectedSize,
                });
              }
            }}
            className="mt-6 bg-[#F76C6C] text-white px-6 py-3 rounded hover:bg-red-600 transition disabled:opacity-50"
          >
            {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
          </button>

          {/* Share + Shipping */}
          <div className="bg-[#F9FAFB] rounded-lg p-4 mt-6 border border-gray-200 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-[#1B263B] text-base">Share this product:</span>
                <a href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer">
                  <FaWhatsapp size={26} className="text-green-600" />
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer">
                  <FaFacebookF size={26} className="text-blue-600" />
                </a>
                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
                  <FaInstagram size={26} className="text-pink-500" />
                </a>
              </div>

              <div className="flex gap-10 pt-2 text-[#1B263B] text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Image src="/images/worldwideshipping.png" alt="Shipping" width={24} height={24} />
                  <span>Worldwide Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/images/securePayment.png" alt="Payment" width={22} height={22} />
                  <span>Secure Payment</span>
                </div>
              </div>
            </div>
          </div>

          {product.description && (
            <div className="bg-[#F9FAFB] p-4 rounded mt-4">
              <h3 className="text-lg font-semibold text-[#1B263B] mb-2">Description:</h3>
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <section className="max-w-7xl mx-auto mt-12 px-4">
          <div className="mb-6 px-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-center sm:text-left gap-2">
              <h3 className="text-2xl font-bold text-[#1B263B] w-full sm:w-auto">You May Also Like</h3>
              <Link href={`/category/${product.category}`} passHref>
                <button className="text-[#F76C6C] font-semibold hover:underline text-lg sm:ml-auto cursor-pointer">
                  View All
                </button>
              </Link>
            </div>
          </div>

          <div className="relative">
            {showLeftArrow && (
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow z-10 hover:bg-gray-100"
              >
                <FaChevronLeft />
              </button>
            )}

            <div
              ref={scrollRef}
              className="flex overflow-x-auto gap-4 sm:gap-6 scroll-smooth hide-scrollbar pb-2"
            >
              {similarProducts.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-[80vw] sm:w-[45vw] md:w-[280px] lg:w-[300px]"
                >
                  <ProductCard product={item} />
                </div>
              ))}
            </div>

            {showRightArrow && (
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow z-10 hover:bg-gray-100"
              >
                <FaChevronRight />
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
