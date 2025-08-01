"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Heart,
  Search,
  Filter,
  Star,
  MapPin,
  Calendar,
  Trash2,
  Eye,
  Palette,
  Sparkles,
} from "lucide-react";
import { useFavorites } from "@/lib/favouriteSys";

const FavoritesPage: React.FC = () => {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredFavorites = favorites.filter((fav) => {
    const matchesSearch = fav.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || fav.type === filterType;
    return matchesSearch && matchesType;
  });

  const favoriteTypes = [
    "all",
    ...Array.from(new Set(favorites.map((fav) => fav.type))),
  ];

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

  return (
    <div className="space-y-8">
      {/* Van Gogh Style Header */}
      <div className="relative bg-gradient-to-br from-blue-600 via-yellow-400 to-orange-500 text-white p-8 rounded-2xl overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-20">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0,20 Q25,0 50,20 T100,20 L100,40 Q75,60 50,40 T0,40 Z"
              fill="currentColor"
              opacity="0.3"
            />
            <path
              d="M0,60 Q25,40 50,60 T100,60 L100,80 Q75,100 50,80 T0,80 Z"
              fill="currentColor"
              opacity="0.2"
            />
          </svg>
        </div>

        <div className="relative flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-full">
              <Heart className="h-10 w-10 text-yellow-200" />
            </div>
            <div>
              <h1 className="text-4xl font-bold flex items-center space-x-3">
                <span>My Favorites</span>
                <Sparkles className="h-8 w-8 text-yellow-200" />
              </h1>
              <p className="text-pink-100 text-lg">
                {favorites.length} beloved places in your artistic collection
              </p>
            </div>
          </div>
          {favorites.length > 0 && (
            <Button
              variant="outline"
              onClick={clearFavorites}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      {favorites.length > 0 && (
        <Card className="border-3 border-yellow-300 shadow-xl bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-600" />
                  <Input
                    placeholder="Search your favorites..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-2 border-yellow-200 focus:border-yellow-400 bg-white"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Filter className="h-5 w-5 text-blue-700" />
                <div className="flex flex-wrap gap-2">
                  {favoriteTypes.map((type) => (
                    <Button
                      key={type}
                      variant={filterType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterType(type)}
                      className={
                        filterType === type
                          ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-blue-900 border-none font-bold"
                          : "border-yellow-300 text-blue-800 hover:bg-yellow-100"
                      }
                    >
                      {type === "all" ? "All Types" : type}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Favorites Grid */}
      {filteredFavorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((favorite) => (
            <Card
              key={favorite.id}
              className={`${getBorderColor(
                favorite.type
              )} border-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-yellow-50 to-orange-50 overflow-hidden`}
            >
              {/* Image Header */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={
                    favorite.image ||
                    `https://source.unsplash.com/400x250/?${favorite.type},travel`
                  }
                  alt={favorite.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Van Gogh swirl */}
                <div className="absolute top-0 right-0 opacity-20">
                  <svg className="w-16 h-16" viewBox="0 0 100 100">
                    <path
                      d="M20,10 Q40,0 60,10 T100,10 L100,30 Q80,40 60,30 T20,30 Z"
                      fill="white"
                      opacity="0.4"
                    />
                  </svg>
                </div>

                {/* Remove button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromFavorites(favorite.id)}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-red-50 backdrop-blur-sm shadow-lg"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>

                {/* Type badge */}
                <div className="absolute bottom-3 left-3">
                  <Badge
                    className={`bg-gradient-to-r ${getTypeColor(
                      favorite.type
                    )} text-white border-none shadow-lg font-bold`}
                  >
                    {favorite.type}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-xl text-blue-900 mb-2">
                    {favorite.name}
                  </h3>

                  {favorite.rating && (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= Math.floor(favorite.rating!)
                                ? "text-yellow-500 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-blue-800">
                        {favorite.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-blue-700">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Added {new Date(favorite.addedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4 text-red-500 fill-current" />
                    <span>Favorite</span>
                  </div>
                </div>

                <Button
                  className={`w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold`}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-3 border-gray-300 shadow-xl bg-gradient-to-br from-gray-50 via-white to-gray-100">
          <CardContent className="text-center py-16">
            {favorites.length === 0 ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-pink-400 to-rose-500 p-6 rounded-full w-fit mx-auto">
                  <Heart className="h-16 w-16 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">
                    No favorites yet
                  </h3>
                  <p className="text-blue-700 mb-6">
                    Start exploring and add places you love to see them here
                  </p>
                  <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-blue-900 hover:from-yellow-500 hover:to-orange-600 font-bold px-6 py-3">
                    <Search className="h-5 w-5 mr-2" />
                    Start Exploring
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-6 rounded-full w-fit mx-auto">
                  <Search className="h-16 w-16 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">
                    No matches found
                  </h3>
                  <p className="text-blue-700">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FavoritesPage;
