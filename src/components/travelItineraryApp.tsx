"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Palette,
} from "lucide-react";
import SpotCard from "./SpotCard";
import QlooApiService, { type Recommendation } from "@/services/QlooApiService";
import { useSearchHistory } from "@/hooks/useSearchHistory";

interface TravelItineraryAppProps {
  onAddToItinerary?: (item: any, itineraryId?: string) => void;
}

const TravelItineraryApp: React.FC<TravelItineraryAppProps> = ({
  onAddToItinerary,
}) => {
  const [destination, setDestination] = useState("");
  const [preferences, setPreferences] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [apiStatus, setApiStatus] = useState<
    "checking" | "connected" | "error"
  >("checking");
  const itemsPerPage = 9;

  const { addSearchToHistory } = useSearchHistory();

  // Test API connection on component mount
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        const response = await fetch("/api/qloo");
        if (response.ok) {
          const data = await response.json();
          console.log("API Status:", data);
          setApiStatus("connected");
        } else {
          setApiStatus("error");
        }
      } catch (error) {
        console.error("API connection test failed:", error);
        setApiStatus("error");
      }
    };

    testApiConnection();
  }, []);

  const handleSearch = async () => {
    if (!destination.trim()) {
      setError("Please enter a destination");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔍 Starting REAL Qloo API search for:", destination);

      const qlooService = new QlooApiService();
      const results = await qlooService.getRecommendations(
        destination,
        preferences,
        {
          limit: 0, // Setting limit to 0 to indicate no limit
          page: 1,
        }
      );

      console.log(
        "✅ Real Qloo API returned",
        results.length,
        "recommendations"
      );

      if (results.length === 0) {
        setError(
          `No recommendations found for "${destination}" from Qloo API. Try a different destination.`
        );
        return;
      }

      setRecommendations(results);
      setCurrentPage(1);

      addSearchToHistory(
        `${destination} ${preferences}`.trim(),
        results.length,
        { destination, preferences },
        destination,
        "travel"
      );

      console.log(
        `🎉 Successfully processed ${results.length} real recommendations from Qloo`
      );
    } catch (err) {
      console.error("❌ Real Qloo API Error:", err);
      setError(
        `Qloo API Error: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(recommendations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRecommendations = recommendations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStatusIcon = () => {
    switch (apiStatus) {
      case "checking":
        return <Loader2 className="h-4 w-4 animate-spin text-accent-400" />;
      case "connected":
        return <CheckCircle className="h-4 w-4 text-primary-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case "checking":
        return "Checking API...";
      case "connected":
        return "API Ready";
      case "error":
        return "API Error";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 py-8">
      <div className="container mx-auto px-6 space-y-8">
        {/* API Status Indicator */}
        <div className="flex justify-end">
          <Badge
            variant="outline"
            className="flex items-center space-x-2 border-primary-200 bg-white/80 backdrop-blur-sm"
          >
            {getStatusIcon()}
            <span className="text-earth-700">{getStatusText()}</span>
          </Badge>
        </div>

        {/* Search Section */}
        <Card className="van-gogh-card border-2 border-primary-200/50 shadow-xl">
          <CardHeader className="bg-van-gogh-gradient text-white rounded-t-xl">
            <div className="flex items-center justify-center mb-4">
              <Palette className="h-8 w-8 mr-3 animate-float" />
              <CardTitle className="text-3xl font-display font-bold text-center">
                Paint Your Perfect Journey
              </CardTitle>
            </div>
            <p className="text-white/90 text-center text-lg">
              Discover destinations with the artistic eye of Van Gogh's cultural
              intelligence
            </p>
          </CardHeader>
          <CardContent className="space-y-6 p-8 bg-gradient-to-br from-white/95 to-primary-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-3 text-secondary-700 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary-400" />
                  Destination
                </label>
                <Input
                  placeholder="e.g., Paris, Tokyo, New York"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="input w-full text-lg py-3 border-2 border-primary-200 focus:border-primary-400 focus:ring-primary-400 bg-white/90"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3 text-secondary-700 flex items-center">
                  <Palette className="h-4 w-4 mr-2 text-accent-400" />
                  Artistic Preferences (Optional)
                </label>
                <Input
                  placeholder="e.g., art galleries, historic cafes, scenic spots"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="input w-full text-lg py-3 border-2 border-primary-200 focus:border-primary-400 focus:ring-primary-400 bg-white/90"
                />
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={handleSearch}
                disabled={
                  isLoading || !destination.trim() || apiStatus === "error"
                }
                className="btn-primary px-10 py-4 text-lg font-semibold group"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    Creating Your Masterpiece...
                  </>
                ) : (
                  <>
                    <Search className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                    Discover Artistic Places
                  </>
                )}
              </Button>
            </div>

            {error && (
              <div className="text-red-700 text-center p-6 bg-red-50 rounded-xl border-2 border-red-200 flex items-center justify-center space-x-3 shadow-lg">
                <AlertCircle className="h-6 w-6 flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {apiStatus === "error" && (
              <div className="text-accent-700 text-center p-6 bg-accent-50 rounded-xl border-2 border-accent-200 shadow-lg">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <AlertCircle className="h-6 w-6" />
                  <span className="font-semibold">API Connection Issue</span>
                </div>
                <p className="text-sm">
                  Please refresh the page or contact support if the problem
                  persists.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {recommendations.length > 0 && (
          <div className="space-y-8">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="van-gogh-card p-6 flex-1">
                <h2 className="text-3xl font-display font-bold text-secondary-700 mb-2">
                  Artistic Discoveries in{" "}
                  <span className="van-gogh-text">{destination}</span>
                </h2>
                <p className="text-earth-600 text-lg">
                  Showing {startIndex + 1}-
                  {Math.min(startIndex + itemsPerPage, recommendations.length)}{" "}
                  of {recommendations.length} curated places
                </p>
              </div>
              <Badge
                variant="secondary"
                className="bg-primary-100 text-primary-700 px-4 py-2 text-lg font-medium border border-primary-200"
              >
                Canvas {currentPage} of {totalPages}
              </Badge>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentRecommendations.map((recommendation) => (
                <SpotCard
                  key={`${recommendation.id}-${currentPage}`}
                  spot={recommendation}
                  onAddToItinerary={onAddToItinerary}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-3 py-8">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="van-gogh-button-outline"
                >
                  Previous Canvas
                </Button>

                <div className="flex space-x-2">
                  {Array.from(
                    { length: Math.min(5, totalPages) },
                    (_, index) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = index + 1;
                      } else if (currentPage <= 3) {
                        pageNum = index + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + index;
                      } else {
                        pageNum = currentPage - 2 + index;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          onClick={() => handlePageChange(pageNum)}
                          className={
                            currentPage === pageNum
                              ? "van-gogh-button"
                              : "van-gogh-button-outline"
                          }
                          size="sm"
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="van-gogh-button-outline"
                >
                  Next Canvas
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Getting Started State */}
        {!isLoading &&
          recommendations.length === 0 &&
          !destination &&
          !error && (
            <div className="text-center py-20">
              <div className="van-gogh-card max-w-2xl mx-auto p-12">
                <div className="w-32 h-32 bg-van-gogh-gradient rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
                  <Palette className="h-16 w-16 text-white" />
                </div>
                <h3 className="text-4xl font-display font-bold text-secondary-700 mb-6">
                  Ready to Create Your{" "}
                  <span className="van-gogh-text">Masterpiece</span>?
                </h3>
                <p className="text-earth-600 text-xl mb-10 leading-relaxed">
                  Enter a destination above to discover amazing places that
                  would inspire even the greatest artists.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { city: "Paris", emoji: "🎨" },
                    { city: "Tokyo", emoji: "🏮" },
                    { city: "New York", emoji: "🗽" },
                    { city: "London", emoji: "🎭" },
                  ].map(({ city, emoji }) => (
                    <Button
                      key={city}
                      variant="outline"
                      onClick={() => setDestination(city)}
                      className="van-gogh-button-outline p-4 text-lg group hover:scale-105 transition-all duration-300"
                    >
                      <span className="text-2xl mr-2 group-hover:animate-bounce">
                        {emoji}
                      </span>
                      {city}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default TravelItineraryApp;
