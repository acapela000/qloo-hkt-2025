"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Star, Plus, Palette } from "lucide-react";
import { useFavorites } from "@/lib/favouriteSys";

interface SpotCardProps {
  spot: {
    id: string;
    name: string;
    type: string;
    description?: string;
    image?: string;
    rating?: number;
    address?: string;
    tags?: string[];
    qlooScore?: number;
  };
  onAddToItinerary?: (spot: any) => void;
}

const SpotCard: React.FC<SpotCardProps> = ({ spot, onAddToItinerary }) => {
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const isFavorite = favorites.some((fav) => fav.id === spot.id);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFromFavorites(spot.id);
    } else {
      addToFavorites({
        id: spot.id,
        name: spot.name,
        type: spot.type,
        rating: spot.rating,
        image: spot.image,
        addedAt: new Date().toISOString(),
      });
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      restaurant: "from-orange-400 to-red-500",
      hotel: "from-blue-400 to-indigo-500",
      attraction: "from-purple-400 to-pink-500",
      museum: "from-indigo-400 to-purple-500",
      park: "from-green-400 to-emerald-500",
      entertainment: "from-pink-400 to-rose-500",
      shopping: "from-yellow-400 to-orange-500",
      cafe: "from-amber-400 to-yellow-500",
    };
    return colors[type as keyof typeof colors] || "from-gray-400 to-gray-500";
  };

  const getBorderColor = (type: string) => {
    const colors = {
      restaurant: "border-orange-300",
      hotel: "border-blue-300",
      attraction: "border-purple-300",
      museum: "border-indigo-300",
      park: "border-green-300",
      entertainment: "border-pink-300",
      shopping: "border-yellow-300",
      cafe: "border-amber-300",
    };
    return colors[type as keyof typeof colors] || "border-gray-300";
  };

  const getBackgroundGradient = (type: string) => {
    const gradients = {
      restaurant: "from-orange-50 via-red-50 to-orange-100",
      hotel: "from-blue-50 via-indigo-50 to-blue-100",
      attraction: "from-purple-50 via-pink-50 to-purple-100",
      museum: "from-indigo-50 via-purple-50 to-indigo-100",
      park: "from-green-50 via-emerald-50 to-green-100",
      entertainment: "from-pink-50 via-rose-50 to-pink-100",
      shopping: "from-yellow-50 via-orange-50 to-yellow-100",
      cafe: "from-amber-50 via-yellow-50 to-amber-100",
    };
    return (
      gradients[type as keyof typeof gradients] || "from-gray-50 to-gray-100"
    );
  };

  return (
    <Card
      className={`${getBorderColor(
        spot.type
      )} border-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br ${getBackgroundGradient(
        spot.type
      )} overflow-hidden`}
    >
      {/* Van Gogh style header with swirl pattern */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            spot.image ||
            `https://source.unsplash.com/400x250/?${spot.type},travel`
          }
          alt={spot.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Van Gogh swirl overlay */}
        <div className="absolute top-0 right-0 opacity-20">
          <svg className="w-16 h-16" viewBox="0 0 100 100">
            <path
              d="M20,10 Q40,0 60,10 T100,10 L100,30 Q80,40 60,30 T20,30 Z"
              fill="white"
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Favorite button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFavoriteToggle}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg"
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </Button>

        {/* Type badge with Van Gogh colors */}
        <div className="absolute bottom-3 left-3">
          <Badge
            className={`bg-gradient-to-r ${getTypeColor(
              spot.type
            )} text-white border-none shadow-lg font-bold`}
          >
            {spot.type}
          </Badge>
        </div>

        {/* Qloo score if available */}
        {spot.qlooScore && (
          <div className="absolute bottom-3 right-3">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-blue-900 border-none shadow-lg font-bold">
              <Palette className="h-3 w-3 mr-1" />
              {Math.round(spot.qlooScore * 100)}%
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Title and rating */}
        <div className="space-y-2">
          <h3 className="font-bold text-xl text-blue-900 line-clamp-2 leading-tight">
            {spot.name}
          </h3>

          {spot.rating && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.floor(spot.rating!)
                        ? "text-yellow-500 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-blue-800">
                {spot.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {spot.description && (
          <p className="text-blue-800 text-sm line-clamp-3 leading-relaxed">
            {spot.description}
          </p>
        )}

        {/* Address */}
        {spot.address && (
          <div className="flex items-start space-x-2 text-blue-700">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="text-sm line-clamp-2">{spot.address}</span>
          </div>
        )}

        {/* Tags */}
        {spot.tags && spot.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {spot.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs bg-white/70 text-blue-800 border-blue-200 hover:bg-blue-50"
              >
                {tag}
              </Badge>
            ))}
            {spot.tags.length > 3 && (
              <Badge
                variant="outline"
                className="text-xs bg-blue-50 text-blue-600 border-blue-200"
              >
                +{spot.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Add to itinerary button */}
        {onAddToItinerary && (
          <Button
            onClick={() => onAddToItinerary(spot)}
            className={`w-full bg-gradient-to-r ${getTypeColor(
              spot.type
            )} text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold`}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Itinerary
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SpotCard;
