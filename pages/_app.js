import "@/styles/globals.css";
import 'swiper/css';

import Layout from "@/components/Layout";
import { WishlistProvider } from "@/context/WishlistContext";

export default function App({ Component, pageProps }) {
  return (
    <WishlistProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </WishlistProvider>
  );
}
