import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, selectedColor, selectedSize) => {
    const existingItemIndex = cartItems.findIndex(
      (item) =>
        item.id === product.id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );

    if (existingItemIndex !== -1) {
      // If item exists, increase quantity
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].qty += 1;
      setCartItems(updatedCart);
    } else {
      // New item
      setCartItems((prev) => [
        ...prev,
        {
          id: product.id,
          name: product.name,
          image: product.image || product.images?.[0] || "/placeholder.png",
          price: product.price,
          selectedColor,
          selectedSize,
          qty: 1,
        },
      ]);
    }
  };

  const updateQuantity = (id, selectedColor, selectedSize, qty) => {
    if (qty < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
          ? { ...item, qty }
          : item
      )
    );
  };

  const removeFromCart = (id, selectedColor, selectedSize) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === id &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          )
      )
    );
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
