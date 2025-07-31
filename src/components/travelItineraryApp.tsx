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
import { QlooApiService } from "@/services/QlooApiService";
import qlooService from "@/services/QlooApiService";

interface TravelItineraryAppProps {
  onAddToItinerary?: (item: any, itineraryId?: string) => void;
  onTabChange?: (tab: string) => void;
  hideMobileNav?: boolean; // Add this prop
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const usePagination = (items: any[], itemsPerPage: number = 9) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));

  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    currentPage: validCurrentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
    startIndex,
    endIndex,
  };
};

const TravelItineraryApp: React.FC<TravelItineraryAppProps> = ({
  onAddToItinerary,
  onTabChange,
  hideMobileNav = false, // Default to false
  currentPage,
  onPageChange,
}) => {
  const { searchState, updateSearchResults, clearSearchResults, hasResults } =
    useSearchResults();

  const [destination, setDestination] = useState(searchState.destination);
  const [preferences, setPreferences] = useState(searchState.preferences);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchState.selectedCategories
  );
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    currentPage: safeCurrentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedRecommendations,
  } = usePagination(recommendations, 9);

  useEffect(() => {
    console.log("=== SEARCH STATE SYNC ===");
    console.log("hasResults:", hasResults);
    console.log("searchState:", searchState);
    if (hasResults) {
      console.log("Syncing with cached search state...");
      console.log("Cached recommendations:", searchState.recommendations);
      setDestination(searchState.destination);
      setPreferences(searchState.preferences);
      setSelectedCategories(searchState.selectedCategories);
      setRecommendations(searchState.recommendations);
    }
    console.log("=== END SEARCH STATE SYNC ===");
  }, [searchState, hasResults]);

  useEffect(() => {
    console.log("=== RECOMMENDATIONS STATE CHANGED ===");
    console.log("Count:", recommendations?.length || 0);
    console.log("First item:", recommendations?.[0]);
    console.log("All names:", recommendations?.map((r) => r?.name) || []);
    console.log("=== END STATE CHANGE ===");
  }, [recommendations]);

  useEffect(() => {
    console.log("=== COMPONENT RE-RENDER ===");
    console.log("Current recommendations count:", recommendations.length);
    console.log("Is loading:", isLoading);
    console.log("Current destination:", destination);
    console.log("=== END RE-RENDER ===");
  });

  useEffect(() => {
    console.log("=== PAGINATION DEBUG ===");
    console.log("Total recommendations:", recommendations.length);
    console.log("Items per page:", 9);
    console.log("Current page:", safeCurrentPage);
    console.log("Total pages:", totalPages);
    console.log("Paginated items:", paginatedRecommendations.length);
    console.log("Paginated recommendations:", paginatedRecommendations);
    console.log("=== END PAGINATION DEBUG ===");
  }, [recommendations, safeCurrentPage, paginatedRecommendations]);

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
    console.log("=== HANDLE SEARCH START ===");
    console.log("Destination:", destination);
    console.log("Selected Categories:", selectedCategories);

    setIsLoading(true);
    setRecommendations([]);

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

      console.log("🔍 Calling service with preferences:", userPreferences);

      // Use the QlooApiService instance directly
      const results = await qlooService.getEnhancedRecommendations(
        userPreferences
      );

      console.log("=== SERVICE RETURNED ===");
      console.log("Results count:", results.length);
      console.log("First result:", results[0]);
      console.log(
        "All names:",
        results.map((r) => r.name)
      );
      console.log("=== END SERVICE RESULTS ===");

      setRecommendations(results);
    } catch (error) {
      console.error("❌ Error in handleSearch:", error);
      setRecommendations([]);
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
    setError(null);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

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
                {[...categories].map((category) => (
                  <label
                    key={category}
                    className={`relative flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                      selectedCategories.includes(category)
                        ? "bg-blue-50 border-blue-400 shadow-md transform scale-[1.02]"
                        : "bg-gray-50 border-gray-200 hover:shadow-sm hover:transform hover:scale-[1.01]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="sr-only"
                    />
                    <span className="text-sm sm:text-base">{category}</span>
                  </label>
                ))}
              </div>
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
          <div className="space-y-6">
            {/* Add debugging info */}
            {/* <div className="bg-yellow-100 border border-yellow-400 p-4 rounded">
              <h3 className="font-bold">Debug Info:</h3>
              <p>Total recommendations: {recommendations.length}</p>
              <p>Current page: {safeCurrentPage}</p>
              <p>Items per page: 9</p>
              <p>
                Paginated recommendations: {paginatedRecommendations.length}
              </p>
              <p>First recommendation: {recommendations[0]?.name || "None"}</p>
            </div> */}

            {/* Your existing pagination header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Recommendations for {destination}
              </h2>
              <span className="text-sm text-gray-600">
                {recommendations.length} places found
              </span>
            </div>

            {/* Add debugging for paginated results */}
            {paginatedRecommendations.length === 0 ? (
              <div className="bg-red-100 border border-red-400 p-4 rounded">
                <p>No paginated recommendations to display</p>
                <p>Total recommendations: {recommendations.length}</p>
                <p>Current page: {safeCurrentPage}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedRecommendations.map((recommendation, index) => {
                  console.log(
                    `Rendering recommendation ${index}:`,
                    recommendation
                  );
                  return (
                    <div
                      key={recommendation.id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200"
                    >
                      {/* Image */}
                      <div className="h-48 bg-gray-200 relative overflow-hidden">
                        <img
                          src={
                            recommendation.image ||
                            "https://via.placeholder.com/300x200/e2e8f0/64748b?text=Travel+Spot"
                          }
                          alt={recommendation.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/300x200/e2e8f0/64748b?text=Travel+Spot";
                          }}
                        />

                        {/* Type Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 bg-white bg-opacity-90 rounded-full text-xs font-medium text-gray-700 capitalize">
                            {recommendation.type}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* Title and Rating */}
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                            {recommendation.name}
                          </h3>
                          <div className="flex items-center ml-2">
                            <span className="text-yellow-400">⭐</span>
                            <span className="text-sm font-medium text-gray-700 ml-1">
                              {recommendation.rating?.toFixed(1) || "4.0"}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {recommendation.description}
                        </p>

                        {/* Address */}
                        <p className="text-gray-500 text-xs mb-3 flex items-center">
                          <span className="mr-1">📍</span>
                          {recommendation.address}
                        </p>

                        {/* Tags */}
                        {recommendation.tags &&
                          recommendation.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {recommendation.tags
                                .slice(0, 3)
                                .map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                            </div>
                          )}

                        {/* Add to Itinerary Button */}
                        <button
                          onClick={() => onAddToItinerary?.(recommendation)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                          Add to Itinerary
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Your existing pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-6">
                <button
                  onClick={() => {
                    console.log("Previous clicked, current page:", currentPage);
                    setCurrentPage((prev) => {
                      const newPage = Math.max(prev - 1, 1);
                      console.log("Setting page to:", newPage);
                      return newPage;
                    });
                  }}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <span className="px-4 py-2 text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => {
                    console.log("Next clicked, current page:", currentPage);
                    setCurrentPage((prev) => {
                      const newPage = Math.min(prev + 1, totalPages);
                      console.log("Setting page to:", newPage);
                      return newPage;
                    });
                  }}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelItineraryApp;
