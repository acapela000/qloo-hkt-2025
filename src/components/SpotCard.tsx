"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { useFavorites } from "@/lib/favouriteSys";

interface SpotCardProps {
  id: string;
  name: string;
  image?: string;
  description?: string;
  category?: string;
  type?: string;
  address?: string;
  tags?: string[];
  qlooScore?: number;
  onAddToItinerary?: (spot: any) => void;
}

const SpotCard: React.FC<SpotCardProps> = ({
  id,
  name,
  image,
  description,
  category,
  type,
  rating,
  address,
  tags,
  qlooScore,
  onAddToItinerary,
}) => {
  console.log("=== SPOTCARD RECEIVED DATA ===");
  console.log("Spot name:", name);
  console.log("Spot type:", type);
  console.log("Spot description:", description);
  console.log("Spot address:", address);
  console.log("Spot image:", image);
  console.log(
    "Full spot object:",
    JSON.stringify(
      {
        id,
        name,
        image,
        description,
        category,
        type,
        rating,
        address,
        tags,
        qlooScore,
      },
      null,
      2
    )
  );
  console.log("=== END SPOTCARD DATA ===");

  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const isFavorite = favorites.some((fav) => fav.id === id);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFromFavorites(id);
    } else {
      addToFavorites({
        id,
        name,
        image,
        description,
        category,
        type,
        rating,
        address,
        tags,
        qlooScore,
      });
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const getImageUrl = () => {
    if (image && !imageError) {
      return image;
    }

    const fallbackImages = [
      `https://picsum.photos/400/300?random=${id}`,
      `https://source.unsplash.com/400x300/?${encodeURIComponent(
        type || ""
      )},destination`,
      `https://via.placeholder.com/400x300/f3f4f6/6b7280?text=${encodeURIComponent(
        name
      )}`,
    ];

    return fallbackImages[0];
  };

  const getTypeColor = (type: string) => {
    const colors = {
      restaurant: "from-orange-400 to-red-500",
      hotel: "from-blue-400 to-indigo-500",
      attraction: "from-orange-400 to-yellow-500",
      museum: "from-indigo-400 to-blue-500",
      park: "from-green-400 to-emerald-500",
      entertainment: "from-orange-400 to-amber-500",
      shopping: "from-yellow-400 to-orange-500",
      cafe: "from-amber-400 to-yellow-500",
    };
    return colors[type as keyof typeof colors] || "from-gray-400 to-gray-500";
  };

  const getBorderColor = (type: string) => {
    const colors = {
      restaurant: "border-orange-300",
      hotel: "border-blue-300",
      attraction: "border-orange-300",
      museum: "border-indigo-300",
      park: "border-green-300",
      entertainment: "border-orange-300",
      shopping: "border-yellow-300",
      cafe: "border-amber-300",
    };
    return colors[type as keyof typeof colors] || "border-gray-300";
  };

  const getBackgroundGradient = (type: string) => {
    const gradients = {
      restaurant: "from-orange-50 via-red-50 to-orange-100",
      hotel: "from-blue-50 via-indigo-50 to-blue-100",
      attraction: "from-orange-50 via-yellow-50 to-orange-100",
      museum: "from-indigo-50 via-blue-50 to-indigo-100",
      park: "from-green-50 via-emerald-50 to-green-100",
      entertainment: "from-orange-50 via-amber-50 to-orange-100",
      shopping: "from-yellow-50 via-orange-50 to-yellow-100",
      cafe: "from-amber-50 via-yellow-50 to-amber-100",
      food: "from-orange-50 via-red-50 to-orange-100",
      history: "from-indigo-50 via-blue-50 to-indigo-100",
      culture: "from-indigo-50 via-blue-50 to-indigo-100",
    };
    return (
      gradients[type as keyof typeof gradients] || "from-gray-50 to-gray-100"
    );
  };

  return (
    <Card
      className={`${getBorderColor(
        type || ""
      )} border-2 sm:border-3 shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br ${getBackgroundGradient(
        type || ""
      )} overflow-hidden w-full max-w-sm mx-auto sm:max-w-none`}
    >
      <div className="relative h-32 sm:h-40 lg:h-48 overflow-hidden bg-gray-200">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-pulse flex space-x-1">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        )}

        <img
          src={getImageUrl()}
          alt={name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoading ? "opacity-0" : "opacity-100"
          }`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <button
          onClick={handleFavoriteToggle}
          className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
        >
          <span
            className={`text-lg sm:text-xl ${
              isFavorite ? "text-red-500" : "text-gray-400"
            }`}
          >
            {isFavorite ? "♥" : "♡"}
          </span>
        </button>

        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
          <Badge
            className={`bg-gradient-to-r ${getTypeColor(
              type || ""
            )} text-white shadow-lg border-0 text-xs sm:text-sm px-2 py-1`}
          >
            {type}
          </Badge>
        </div>

        {rating && (
          <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-white/95 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 shadow-lg">
            <div className="flex items-center space-x-1">
              <span className="text-yellow-500 text-sm sm:text-base">★</span>
              <span className="font-semibold text-gray-800 text-xs sm:text-sm">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        {category && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
            {category}
          </span>
        )}
        <h3 className="font-semibold text-lg mb-2">{name}</h3>
        {description && <p className="text-gray-600 text-sm">{description}</p>}
      </div>

      <div className="p-3 sm:p-4 lg:p-6">
        <div className="space-y-2 sm:space-y-3">
          <h3 className="font-bold text-sm sm:text-base lg:text-lg text-gray-800 line-clamp-2 leading-tight">
            {name}
          </h3>

          {description && (
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {address && (
            <div className="flex items-start space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2 leading-tight">{address}</span>
            </div>
          )}

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3">
              {tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 border-primary-300 text-primary-600 bg-primary-50"
                >
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 border-gray-300 text-gray-500"
                >
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {qlooScore && (
            <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-200">
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                Qloo Score
              </span>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-1.5 sm:h-2">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-accent-500 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(qlooScore / 100) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs sm:text-sm font-bold text-primary-600">
                  {qlooScore}/100
                </span>
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={() =>
            onAddToItinerary?.({
              id,
              name,
              image,
              description,
              category,
              type,
              rating,
              address,
              tags,
              qlooScore,
            })
          }
          className="w-full mt-3 sm:mt-4 bg-gradient-to-r from-secondary-500 to-accent-500 hover:from-secondary-600 hover:to-accent-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm py-2 sm:py-2.5"
        >
          <span className="mr-1 sm:mr-2">📝</span>
          Add to Itinerary
        </Button>
      </div>
    </Card>
  );
};

export default SpotCard;
