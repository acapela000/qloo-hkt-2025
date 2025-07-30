import { useState, useEffect } from "react";

export interface FavoriteItem {
  id: string;
  name: string;
  type: string;
  description: string;
  image?: string;
  addedAt: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("travel-favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const addToFavorites = (item: Omit<FavoriteItem, "addedAt">) => {
    const newFavorite: FavoriteItem = {
      ...item,
      addedAt: new Date().toISOString(),
    };

    const updatedFavorites = [...favorites, newFavorite];
    setFavorites(updatedFavorites);
    localStorage.setItem("travel-favorites", JSON.stringify(updatedFavorites));
  };

  const removeFromFavorites = (id: string) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem("travel-favorites", JSON.stringify(updatedFavorites));
  };

  const isFavorited = (id: string) => {
    return favorites.some((fav) => fav.id === id);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorited,
  };
};
