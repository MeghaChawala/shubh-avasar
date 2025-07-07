import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
          setCurrentImgIndex(0);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="p-6">Loading product...</p>;
  if (!product) return <p className="p-6">Product not found</p>;

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  // Handlers for carousel
  const prevImage = () => {
    setCurrentImgIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };
  const nextImage = () => {
    setCurrentImgIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-[#F4F6F8]">
      {/* Breadcrumb */}
      <Breadcrumb category={product.category} productName={product.name} />

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row gap-6">
        {/* Image Carousel */}
        <div className="relative w-full md:w-1/2 rounded overflow-hidden">
          <img
            src={images[currentImgIndex]}
            alt={`${product.name} image ${currentImgIndex + 1}`}
            className="w-full h-80 object-cover rounded"
          />
          {images.length > 1 && (
            <>
              {/* Prev Button */}
              <button
                onClick={prevImage}
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-[#F76C6C] bg-opacity-70 hover:bg-opacity-90 text-white rounded-full p-2"
                aria-label="Previous image"
              >
                &#10094;
              </button>

              {/* Next Button */}
              <button
                onClick={nextImage}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-[#F76C6C] bg-opacity-70 hover:bg-opacity-90 text-white rounded-full p-2"
                aria-label="Next image"
              >
                &#10095;
              </button>

              {/* Dots */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImgIndex(idx)}
                    className={`w-3 h-3 rounded-full ${
                      idx === currentImgIndex ? "bg-[#F76C6C]" : "bg-gray-300"
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[#1A2A6C] mb-4">{product.name}</h1>
            <p className="text-2xl text-[#F76C6C] font-semibold mb-6">${product.price.toFixed(2)}</p>
            <p className="text-gray-700 mb-6 whitespace-pre-line">{product.description}</p>

            {/* Optional product details */}
            <div className="mb-6">
              {product.colors && (
                <p>
                  <span className="font-semibold">Colors: </span>
                  {product.colors.join(", ")}
                </p>
              )}
              {product.sizes && (
                <p>
                  <span className="font-semibold">Sizes: </span>
                  {product.sizes.join(", ")}
                </p>
              )}
              {product.shippingTime && (
                <p>
                  <span className="font-semibold">Shipping Time: </span> {product.shippingTime}
                </p>
              )}
              {product.tailoring && (
                <p>
                  <span className="font-semibold">Tailoring: </span> {product.tailoring}
                </p>
              )}
            </div>
          </div>

          <button className="bg-[#F76C6C] text-white px-6 py-3 rounded hover:bg-red-600 transition w-full md:w-auto">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
