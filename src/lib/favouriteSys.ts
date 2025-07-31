import { useState, useEffect } from "react";

export interface FavoriteItem {
  id: string;
  name: string;
  type: string;
  description?: string;
  image?: string;
  rating?: number;
  address?: string;
  tags?: string[];
  addedAt: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse favorites:", error);
        setFavorites([]);
      }
    }
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (item: any) => {
    const favoriteItem: FavoriteItem = {
      id: item.id,
      name: item.name,
      type: item.type,
      description: item.description,
      image: item.image,
      rating: item.rating,
      address: item.address,
      tags: item.tags,
      addedAt: new Date().toISOString(),
    };

    setFavorites((prev) => {
      // Avoid duplicates
      if (prev.some((fav) => fav.id === item.id)) {
        return prev;
      }
      return [...prev, favoriteItem];
    });
  };

  const removeFromFavorites = (id: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id));
  };

  const isFavorited = (id: string) => {
    return favorites.some((fav) => fav.id === id);
  };

  const clearAllFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorited,
    clearAllFavorites,
  };
};
