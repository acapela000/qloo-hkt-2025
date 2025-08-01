"use client";

import React, { useState, useEffect } from "react";
import { Recommendation, useSearchResults } from "@/hooks/useSearchResults";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
//import SpotCard from "./SpotCard";
import qlooService from "@/services/QlooApiService";
import TravelTips from "@/components/TravelTips";
import MyTrips from "@/components/TripCard";
import PlannerSidebar from "@/components/PlannerSidebar";

interface TravelItineraryAppProps {
  onAddToItinerary?: (item: any, itineraryId?: string) => void;
  onTabChange?: (tab: string) => void;
  hideMobileNav?: boolean;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const usePagination = (items: any[], itemsPerPage: number = 9) => {
  const [currentPage, setCurrentPage] = useState(1);

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
  hideMobileNav = false,
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
  const [activeTab, setActiveTab] = useState("discovery");

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

  const categoryConfig = {
    restaurants: { icon: "🍽️", label: "Restaurant" },
    hotels: { icon: "🏨", label: "Hotel" },
    attractions: { icon: "🎯", label: "Attraction" },
    museums: { icon: "🏛️", label: "Museum" },
    parks: { icon: "🌳", label: "Park" },
    entertainment: { icon: "🎭", label: "Entertainment" },
    shopping: { icon: "🛍️", label: "Shopping" },
    cafes: { icon: "☕", label: "Cafe" },
    food: { icon: "🍕", label: "Food" },
    history: { icon: "📜", label: "History" },
    culture: { icon: "🎨", label: "Culture" },
  };

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
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
    closeMobileMenu();
  };

  const renderDiscoveryContent = () => (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
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
            Paint your dream journey
            <br />
            Discover your next adventure with the artistic eyes of Van Gogh's
            imagination
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700">
              Destination *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where do you want to go?"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700">
              What are you looking for?
            </label>
            <textarea
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="Tell us about your travel preferences..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              Artistic Preferrences (Optional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(categoryConfig).map(([category, config]) => {
                const isSelected = selectedCategories.includes(category);

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`
                      relative p-4 border-2 transition-all duration-300 rounded-xl
                      flex items-center space-x-3 min-h-[70px]
                      ${
                        isSelected
                          ? "bg-gradient-to-r from-yellow-400 via-orange-400 to-blue-500 text-white border-transparent shadow-md transform scale-105"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }
                    `}
                  >
                    <span className="text-2xl flex-shrink-0">
                      {config.icon}
                    </span>
                    <span
                      className={`
                      font-medium text-left
                      ${isSelected ? "text-white" : "text-gray-700"}
                    `}
                    >
                      {config.label}
                    </span>
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                        <span className="text-blue-600 text-sm font-bold">
                          ✓
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedCategories.length > 0 && (
              <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-blue-50 border border-yellow-200 rounded-xl">
                <p className="text-sm text-gray-600 mb-2">
                  Selected: {selectedCategories.length} categor
                  {selectedCategories.length === 1 ? "y" : "ies"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((category) => {
                    const config =
                      categoryConfig[category as keyof typeof categoryConfig];
                    return (
                      <span
                        key={category}
                        className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-blue-500 text-white text-sm font-medium rounded-full shadow-sm"
                      >
                        <span className="mr-1">{config.icon}</span>
                        {config.label}
                      </span>
                    );
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
                Ready to create your masterpiece?
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
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Recommendations for {destination}
            </h2>
            <span className="text-sm text-gray-600">
              {recommendations.length} places found
            </span>
          </div>

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
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-white bg-opacity-90 rounded-full text-xs font-medium text-gray-700 capitalize">
                          {recommendation.type}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
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

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {recommendation.description}
                      </p>

                      <p className="text-gray-500 text-xs mb-3 flex items-center">
                        <span className="mr-1">📍</span>
                        {recommendation.address}
                      </p>

                      {recommendation.tags &&
                        recommendation.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {recommendation.tags
                              .slice(0, 3)
                              .map(
                                (
                                  tag:
                                    | string
                                    | number
                                    | bigint
                                    | boolean
                                    | React.ReactElement<
                                        unknown,
                                        | string
                                        | React.JSXElementConstructor<any>
                                      >
                                    | Iterable<React.ReactNode>
                                    | React.ReactPortal
                                    | Promise<
                                        | string
                                        | number
                                        | bigint
                                        | boolean
                                        | React.ReactPortal
                                        | React.ReactElement<
                                            unknown,
                                            | string
                                            | React.JSXElementConstructor<any>
                                          >
                                        | Iterable<React.ReactNode>
                                        | null
                                        | undefined
                                      >
                                    | null
                                    | undefined,
                                  idx: React.Key | null | undefined
                                ) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                  >
                                    {tag}
                                  </span>
                                )
                              )}
                          </div>
                        )}

                      <button
                        onClick={() => onAddToItinerary?.(recommendation)}
                        className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-blue-500 hover:from-yellow-500 hover:via-orange-500 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <span>✈️</span>
                          <span>Add to Itinerary</span>
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

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
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-green-100 to-blue-200 flex">
      <div className="flex-1 flex flex-col">
        <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Logo and Home Button */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleNavigationClick("home")}
                  className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-semibold"
                >
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">Q</span>
                  </div>
                  <span className="text-lg">loo</span>
                </button>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-8">
                <button
                  onClick={() => handleNavigationClick("home")}
                  className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "home"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Home className="w-4 h-4 inline mr-1" />
                  Home
                </button>
                <button
                  onClick={() => handleNavigationClick("discovery")}
                  className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "discovery"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Discover
                </button>
                <button
                  onClick={() => handleNavigationClick("travel-tips")}
                  className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "travel-tips"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Travel Tips
                </button>
                <button
                  onClick={() => handleNavigationClick("my-trips")}
                  className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "my-trips"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  My Trips
                </button>
              </div>

              {/* Mobile Menu Button */}
              {!hideMobileNav && (
                <button
                  onClick={toggleMobileMenu}
                  className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden border-t border-gray-200 py-2">
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => handleNavigationClick("home")}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === "home"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </button>
                  <button
                    onClick={() => handleNavigationClick("discovery")}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === "discovery"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Discover
                  </button>
                  <button
                    onClick={() => handleNavigationClick("travel-tips")}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === "travel-tips"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Travel Tips
                  </button>
                  <button
                    onClick={() => handleNavigationClick("my-trips")}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === "my-trips"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    My Trips
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-6 lg:py-8">
            {activeTab === "home" && (
              <div className="text-center py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Welcome to Qloo Travel
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Discover amazing places with AI-powered recommendations
                </p>
                <Button
                  onClick={() => handleNavigationClick("discovery")}
                  className="bg-gradient-to-r from-yellow-400 via-orange-400 to-blue-500 hover:from-yellow-500 hover:via-orange-500 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  Start Exploring
                </Button>
              </div>
            )}
            {activeTab === "discovery" && renderDiscoveryContent()}
            {activeTab === "travel-tips" && <TravelTips />}
            {activeTab === "my-trips" && <MyTrips />}
          </div>
        </div>
      </div>

      <PlannerSidebar />
    </div>
  );
};

export default TravelItineraryApp;
