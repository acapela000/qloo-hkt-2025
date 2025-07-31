"use client";

import React, { useState, useEffect } from "react";
import { useSearchResults } from "@/hooks/useSearchResults";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Search,
  MapPin,
  X,
  Menu,
  Home,
  Heart,
  BarChart3,
  User,
} from "lucide-react";
import SpotCard from "./SpotCard";
import qlooService, {
  QlooApiService,
  type Recommendation,
} from "@/services/QlooApiService";

interface TravelItineraryAppProps {
  onAddToItinerary?: (item: any, itineraryId?: string) => void;
  onTabChange?: (tab: string) => void;
  hideMobileNav?: boolean; // Add this prop
}

const TravelItineraryApp: React.FC<TravelItineraryAppProps> = ({
  onAddToItinerary,
  onTabChange,
  hideMobileNav = false, // Default to false
}) => {
  const { searchState, updateSearchResults, clearSearchResults, hasResults } =
    useSearchResults();

  const [destination, setDestination] = useState(searchState.destination);
  const [preferences, setPreferences] = useState(searchState.preferences);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchState.selectedCategories
  );
  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    searchState.recommendations
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const itemsPerPage = 9;

  useEffect(() => {
    if (hasResults) {
      setDestination(searchState.destination);
      setPreferences(searchState.preferences);
      setSelectedCategories(searchState.selectedCategories);
      setRecommendations(searchState.recommendations);
    }
  }, [searchState, hasResults]);

  const categories = [
    "restaurants",
    "hotels",
    "attractions",
    "museums",
    "parks",
    "entertainment",
    "shopping",
    "cafes",
    "food",
    "history",
    "culture",
  ];

  const handleSearch = async () => {
    if (!destination.trim()) {
      setError("Please enter a destination");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userPreferences = {
        destination: destination.trim(),
        preferences: preferences.trim(),
        selectedCategories: selectedCategories,
        numberOfDays: 3,
        budget: "medium" as const,
        travelStyle: "solo" as const,
        interests:
          selectedCategories.length > 0 ? selectedCategories : ["general"],
        departureDate: undefined,
      };

      const results = await qlooService.getEnhancedRecommendations(
        userPreferences
      );

      setRecommendations(results);
      updateSearchResults(
        destination,
        preferences,
        selectedCategories,
        results
      );
      setCurrentPage(1);

      if (results.length === 0) {
        setError(
          "No recommendations found. Try different preferences or destination."
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to get recommendations"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearResults = () => {
    clearSearchResults();
    setDestination("");
    setPreferences("");
    setSelectedCategories([]);
    setRecommendations([]);
    setCurrentPage(1);
    setError(null);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const paginatedRecommendations = recommendations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(recommendations.length / itemsPerPage);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNavigationClick = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
    closeMobileMenu();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-green-100 to-blue-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
        <div className="hidden md:flex justify-end">
          {hasResults && (
            <Button
              onClick={handleClearResults}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <X className="w-4 h-4" />
              Clear Results
            </Button>
          )}
        </div>

        {hasResults && (
          <div className="md:hidden">
            <Button
              onClick={handleClearResults}
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear Results
            </Button>
          </div>
        )}

        <Card className="border-2 border-primary-200 shadow-lg">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg lg:text-xl flex items-center gap-2">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
              Plan Your Journey
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700">
                Where do you want to go? *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="e.g., Paris, Tokyo, New York..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  ith
                  burgur
                  menu
                  butto
                  className="pl-10 h-10 sm:h-12 text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700">
                What are you looking for?
              </label>
              <textarea
                placeholder="e.g., romantic restaurants, family-friendly activities, cultural experiences..."
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                className="w-full min-h-[60px] sm:min-h-[80px] p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs sm:text-sm font-medium text-gray-700">
                Categories (optional)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {[
                  {
                    id: "restaurants",
                    label: "Restaurant",
                    icon: "🍽️",
                    color: "bg-purple-50 border-purple-200",
                  },
                  {
                    id: "hotels",
                    label: "Hotel",
                    icon: "🏨",
                    color: "bg-red-50 border-red-200",
                  },
                  {
                    id: "attractions",
                    label: "Attraction",
                    icon: "🎯",
                    color: "bg-blue-50 border-blue-200",
                  },
                  {
                    id: "museums",
                    label: "Museum",
                    icon: "🏛️",
                    color: "bg-gray-50 border-gray-200",
                  },
                  {
                    id: "parks",
                    label: "Park",
                    icon: "🌲",
                    color: "bg-green-50 border-green-200",
                  },
                  {
                    id: "entertainment",
                    label: "Entertainment",
                    icon: "🎭",
                    color: "bg-orange-50 border-orange-200",
                  },
                  {
                    id: "shopping",
                    label: "Shopping",
                    icon: "🛍️",
                    color: "bg-blue-50 border-blue-200",
                  },
                  {
                    id: "cafes",
                    label: "Cafe",
                    icon: "☕",
                    color: "bg-brown-50 border-brown-200",
                  },
                  {
                    id: "food",
                    label: "Food",
                    icon: "🍕",
                    color: "bg-orange-50 border-orange-200",
                  },
                  {
                    id: "history",
                    label: "History",
                    icon: "📚",
                    color: "bg-indigo-50 border-indigo-200",
                  },
                  {
                    id: "culture",
                    label: "Culture",
                    icon: "🎨",
                    color: "bg-pink-50 border-pink-200",
                  },
                ].map((category) => (
                  <label
                    key={category.id}
                    className={`
                      relative flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-200 border-2
                      ${
                        selectedCategories.includes(category.id)
                          ? "bg-blue-50 border-blue-400 shadow-md transform scale-[1.02]"
                          : `${category.color} hover:shadow-sm hover:transform hover:scale-[1.01]`
                      }
                    `}
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                        className="sr-only"
                      />
                      <div
                        className={`
                        w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-all duration-200
                        ${
                          selectedCategories.includes(category.id)
                            ? "bg-blue-500 border-blue-500"
                            : "bg-white border-gray-300"
                        }
                      `}
                      >
                        {selectedCategories.includes(category.id) && (
                          <svg
                            className="w-2 h-2 sm:w-3 sm:h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>

                    <span className="text-base sm:text-lg lg:text-xl">
                      {category.icon}
                    </span>

                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        selectedCategories.includes(category.id)
                          ? "text-blue-800"
                          : "text-gray-700"
                      }`}
                    >
                      {category.label}
                    </span>
                  </label>
                ))}
              </div>

              {selectedCategories.length > 0 && (
                <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {selectedCategories.map((categoryId) => {
                      const category = [
                        { id: "restaurants", label: "Restaurant", icon: "🍽️" },
                        { id: "hotels", label: "Hotel", icon: "🏨" },
                        { id: "attractions", label: "Attraction", icon: "🎯" },
                        { id: "museums", label: "Museum", icon: "🏛️" },
                        { id: "parks", label: "Park", icon: "🌲" },
                        {
                          id: "entertainment",
                          label: "Entertainment",
                          icon: "🎭",
                        },
                        { id: "shopping", label: "Shopping", icon: "🛍️" },
                        { id: "cafes", label: "Cafe", icon: "☕" },
                        { id: "food", label: "Food", icon: "🍕" },
                        { id: "history", label: "History", icon: "📚" },
                        { id: "culture", label: "Culture", icon: "🎨" },
                      ].find((cat) => cat.id === categoryId);

                      return category ? (
                        <span
                          key={categoryId}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-md text-xs sm:text-sm font-medium text-blue-800 border border-blue-300"
                        >
                          <span className="text-xs sm:text-sm">
                            {category.icon}
                          </span>
                          <span>{category.label}</span>
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleSearch}
              disabled={isLoading || !destination.trim()}
              className="w-full h-10 sm:h-12 text-sm sm:text-base font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Find Recommendations
                </>
              )}
            </Button>

            {error && (
              <div className="p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs sm:text-sm text-red-700">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {recommendations.length > 0 && (
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                Recommendations for {destination}
              </h2>
              <div className="text-xs sm:text-sm text-gray-600">
                {recommendations.length} places found
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {paginatedRecommendations.map((recommendation) => (
                <SpotCard
                  key={recommendation.id}
                  spot={recommendation}
                  onAddToItinerary={onAddToItinerary}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  className="text-xs sm:text-sm"
                >
                  Previous
                </Button>
                <span className="text-xs sm:text-sm text-gray-600 px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  className="text-xs sm:text-sm"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelItineraryApp;
