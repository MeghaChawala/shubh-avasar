import { createContext, useState, useContext, useEffect } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  function toggleWishlist(product) {
    setWishlist((prev) => {
      if (prev.find((item) => item.id === product.id)) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  }

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
