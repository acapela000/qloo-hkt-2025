import React from "react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/lib/favouriteSys";

interface RecommendationCardProps {
  recommendation: {
    id: string;
    name: string;
    type: string;
    description: string;
    image?: string;
  };
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
}) => {
  const { addToFavorites, removeFromFavorites, isFavorited } = useFavorites();

  const handleToggleFavorite = () => {
    if (isFavorited(recommendation.id)) {
      removeFromFavorites(recommendation.id);
    } else {
      addToFavorites(recommendation);
    }
  };

  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
      <img
        src={recommendation.image || "/placeholder.svg"}
        alt={recommendation.name}
        className="w-full h-32 object-cover rounded mb-3"
      />
      <h3 className="font-semibold">{recommendation.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{recommendation.type}</p>
      <p className="text-sm text-gray-700 mb-3">{recommendation.description}</p>

      <div className="flex space-x-2">
        <Button
          variant={isFavorited(recommendation.id) ? "default" : "outline"}
          size="sm"
          onClick={handleToggleFavorite}
          className="flex items-center space-x-1"
        >
          <span
            className={
              isFavorited(recommendation.id) ? "text-red-500" : "text-gray-400"
            }
          >
            {isFavorited(recommendation.id) ? "♥" : "♡"}
          </span>
          <span>
            {isFavorited(recommendation.id) ? "Favorited" : "Favorite"}
          </span>
        </Button>

        <Button size="sm" className="flex items-center space-x-1">
          <span>📝</span>
          <span>Add to Itinerary</span>
        </Button>
      </div>
    </div>
  );
};
