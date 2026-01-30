import { useState, useEffect } from 'react';
import type { Product } from '../types/product';
import type { WishlistItem } from '../types/account';

interface UseWishlistReturn {
  wishlist: WishlistItem[];
  wishlistCount: number;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  toggleWishlist: (product: Product) => void;
}

export const useWishlist = (): UseWishlistReturn => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem('nouras-wishlist');
      if (storedWishlist) {
        const parsedWishlist = JSON.parse(storedWishlist);
        setWishlist(parsedWishlist);
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('nouras-wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [wishlist]);

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      // Check if product is already in wishlist
      if (prev.some((item) => item.product.id === product.id)) {
        return prev;
      }

      const newItem: WishlistItem = {
        id: `wishlist-${Date.now()}-${product.id}`,
        product,
        addedDate: new Date().toISOString(),
      };

      return [...prev, newItem];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some((item) => item.product.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return {
    wishlist,
    wishlistCount: wishlist.length,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    toggleWishlist,
  };
};
