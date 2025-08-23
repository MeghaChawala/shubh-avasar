import "@/styles/globals.css";
import 'swiper/css';
import { useEffect } from "react";
import { useRouter } from "next/router";

import Layout from "@/components/Layout";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }) {
    const router = useRouter();

  useEffect(() => {
    // Load FB Pixel
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    fbq("init", "1222563596287572"); // your Pixel ID
    fbq("track", "PageView");

    // Track page changes in SPA
    const handleRouteChange = () => {
      fbq("track", "PageView");
    };
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  
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
