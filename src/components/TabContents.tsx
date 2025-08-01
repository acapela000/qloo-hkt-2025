import React from "react";
import { useFavorites } from "@/lib/favouriteSys";
import SpotCard from "./SpotCard";
import { Button } from "@/components/ui/button";

export const HomeContent: React.FC = () => (
  <div className="text-center py-12">
    <h1 className="text-3xl font-bold text-gray-800 mb-4">
      Welcome to Trip Planner
    </h1>
    <p className="text-gray-600">Plan your next adventure with us!</p>
  </div>
);

export const DiscoverContent: React.FC = () => (
  <div className="text-center py-12">
    <h1 className="text-3xl font-bold text-gray-800 mb-4">
      Discover Amazing Places
    </h1>
    <p className="text-gray-600">Explore new destinations and experiences.</p>
  </div>
);

export const FavoritesContent: React.FC = () => {
  const { favorites, clearAllFavorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Your Favorites
          </h1>
          <p className="text-gray-600 mb-6">
            No favorites yet. Start exploring and save places you love!
          </p>
          <div className="text-6xl mb-4">💝</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Your Favorites</h1>
          <Button
            onClick={clearAllFavorites}
            variant="outline"
            className="text-sm"
          >
            Clear All ({favorites.length})
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((favorite) => (
            <SpotCard key={favorite.id} spot={favorite} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const DashboardContent: React.FC = () => (
  <div className="text-center py-12">
    <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
    <p className="text-gray-600">View your trip statistics and insights.</p>
  </div>
);

export const ProfileContent: React.FC = () => (
  <div className="text-center py-12">
    <h1 className="text-3xl font-bold text-gray-800 mb-4">Profile</h1>
    <p className="text-gray-600">Manage your account settings.</p>
  </div>
);
