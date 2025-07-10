import "@/styles/globals.css";
import 'swiper/css';

import Layout from "@/components/Layout";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }) {
  return (
    <CartProvider> {/* Wrap CartProvider outermost */}
      <WishlistProvider>
        <Layout>
          <Toaster position="top-center" />
          <Component {...pageProps} />
        </Layout>
      </WishlistProvider>
    </CartProvider>
  );
}
