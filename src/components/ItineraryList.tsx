"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Trash2,
  Eye,
  Share,
  Plus,
  Palette,
  Sparkles,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Itinerary } from "@/services/QlooApiService";

interface ItineraryListProps {
  onViewItinerary?: (itinerary: Itinerary) => void;
  onCreateNew?: () => void;
}

const ItineraryList: React.FC<ItineraryListProps> = ({
  onViewItinerary,
  onCreateNew,
}) => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadItineraries();
  }, []);

  const loadItineraries = () => {
    try {
      setIsLoading(true);
      const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith("itinerary-")
      );
      const loadedItineraries = keys
        .map((key) => {
          try {
            return JSON.parse(localStorage.getItem(key) || "");
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      // Sort by creation date (newest first)
      loadedItineraries.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setItineraries(loadedItineraries);
    } catch (error) {
      console.error("Error loading itineraries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItinerary = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm("Are you sure you want to delete this itinerary?")) {
      localStorage.removeItem(`itinerary-${id}`);
      loadItineraries();
    }
  };

  const shareItinerary = async (
    itinerary: Itinerary,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();

    if (navigator.share) {
      try {
        await navigator.share({
          title: `My ${itinerary.destination} Trip`,
          text: `Check out my ${itinerary.totalDays}-day trip to ${itinerary.destination}!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      const text = `My ${itinerary.totalDays}-day trip to ${itinerary.destination} - ${itinerary.spots.length} amazing spots!`;
      navigator.clipboard.writeText(text);
      alert("Trip details copied to clipboard!");
    }
  };

  const getStatusColor = (preferences: any) => {
    const travelStyle = preferences?.travelStyle || "solo";
    const colors = {
      solo: "from-blue-500 to-blue-700",
      couple: "from-orange-400 to-orange-600",
      family: "from-yellow-400 to-yellow-600",
      group: "from-blue-600 to-yellow-500",
    };
    return (
      colors[travelStyle as keyof typeof colors] || "from-blue-500 to-blue-700"
    );
  };

  const getBorderColor = (preferences: any) => {
    const travelStyle = preferences?.travelStyle || "solo";
    const colors = {
      solo: "border-blue-400",
      couple: "border-orange-400",
      family: "border-yellow-400",
      group: "border-blue-500",
    };
    return colors[travelStyle as keyof typeof colors] || "border-blue-400";
  };

  const getBackgroundGradient = (preferences: any) => {
    const travelStyle = preferences?.travelStyle || "solo";
    const gradients = {
      solo: "from-blue-50 via-blue-100 to-yellow-50",
      couple: "from-orange-50 via-yellow-50 to-orange-100",
      family: "from-yellow-50 via-orange-50 to-yellow-100",
      group: "from-blue-50 via-yellow-50 to-orange-50",
    };
    return (
      gradients[travelStyle as keyof typeof gradients] ||
      "from-blue-50 to-yellow-50"
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Van Gogh Loading Header */}
        <div className="relative bg-gradient-to-br from-yellow-400 via-orange-400 to-blue-600 text-white p-8 rounded-2xl overflow-hidden shadow-xl">
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
            </svg>
          </div>
          <div className="relative text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold">
              Loading Your Artistic Journeys...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (itineraries.length === 0) {
    return (
      <div className="space-y-8">
        {/* Van Gogh Style Header */}
        <div className="relative bg-gradient-to-br from-purple-400 via-indigo-400 to-blue-600 text-white p-8 rounded-2xl overflow-hidden shadow-xl">
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

          <div className="relative flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Palette className="h-10 w-10 text-yellow-200" />
                <h1 className="text-4xl font-bold">My Artistic Journeys</h1>
                <Sparkles className="h-8 w-8 text-yellow-200" />
              </div>
              <p className="text-purple-100 text-lg">
                Create your first masterpiece journey
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <Card className="border-3 border-purple-300 shadow-xl bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
          <CardContent className="text-center py-16">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-400 to-indigo-500 p-6 rounded-full w-fit mx-auto">
                <Calendar className="h-16 w-16 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-900 mb-2">
                  No artistic journeys yet
                </h3>
                <p className="text-blue-700 mb-6">
                  Start planning your first adventure with Van Gogh's
                  inspiration!
                </p>
                <Button
                  onClick={onCreateNew}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-blue-900 hover:from-yellow-500 hover:to-orange-600 font-bold px-8 py-4 text-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Plan Your First Masterpiece
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Van Gogh Style Header */}
      <div className="relative bg-gradient-to-br from-yellow-400 via-orange-400 to-blue-600 text-white p-8 rounded-2xl overflow-hidden shadow-xl">
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
              <MapPin className="h-10 w-10 text-yellow-200" />
            </div>
            <div>
              <h1 className="text-4xl font-bold flex items-center space-x-3">
                <span>My Artistic Journeys</span>
                <Sparkles className="h-8 w-8 text-yellow-200" />
              </h1>
              <p className="text-purple-100 text-lg">
                {itineraries.length} masterpiece journeys created
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-white/20 text-white border-white/30 font-bold text-lg px-4 py-2">
              {itineraries.length} trips
            </Badge>
            <Button
              onClick={onCreateNew}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-blue-900 hover:from-yellow-500 hover:to-orange-600 font-bold"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Masterpiece
            </Button>
          </div>
        </div>
      </div>

      {/* Itineraries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {itineraries.map((itinerary) => (
          <Card
            key={itinerary.id}
            className={`${getBorderColor(
              itinerary.preferences
            )} border-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br ${getBackgroundGradient(
              itinerary.preferences
            )} overflow-hidden cursor-pointer group`}
            onClick={() => onViewItinerary?.(itinerary)}
          >
            {/* Van Gogh Header */}
            <div className="relative p-6 bg-gradient-to-r from-white/80 to-white/60 border-b-2 border-current">
              <div className="absolute top-0 right-0 opacity-10">
                <svg className="w-20 h-20" viewBox="0 0 100 100">
                  <path
                    d="M20,10 Q40,0 60,10 T100,10 L100,30 Q80,40 60,30 T20,30 Z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              <div className="relative">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-xl text-blue-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {itinerary.destination}
                  </h3>
                  <Badge
                    className={`bg-gradient-to-r ${getStatusColor(
                      itinerary.preferences
                    )} text-white border-none font-bold`}
                  >
                    {itinerary.totalDays} days
                  </Badge>
                </div>

                <p className="text-sm text-blue-700">
                  Created {new Date(itinerary.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <CardContent className="p-6 space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-blue-800">
                  <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                  <span className="font-medium">
                    {itinerary.totalDays} day artistic journey
                  </span>
                </div>
                <div className="flex items-center text-blue-800">
                  <MapPin className="h-4 w-4 mr-2 text-purple-600" />
                  <span className="font-medium">
                    {itinerary.spots.length} creative destinations
                  </span>
                </div>
                <div className="flex items-center text-blue-800">
                  <Users className="h-4 w-4 mr-2 text-purple-600" />
                  <span className="font-medium">
                    {itinerary.preferences.travelStyle} adventure
                  </span>
                </div>
                <div className="flex items-center text-blue-800">
                  <DollarSign className="h-4 w-4 mr-2 text-purple-600" />
                  <span className="font-medium">
                    {itinerary.preferences.budget} budget
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {itinerary.preferences.interests.slice(0, 3).map((interest) => (
                  <Badge
                    key={interest}
                    className="bg-white/70 text-blue-800 border-blue-200 font-medium text-xs"
                  >
                    {interest}
                  </Badge>
                ))}
                {itinerary.preferences.interests.length > 3 && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300 font-medium text-xs">
                    +{itinerary.preferences.interests.length - 3} more
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewItinerary?.(itinerary);
                  }}
                  className={`bg-gradient-to-r ${getStatusColor(
                    itinerary.preferences
                  )} text-white hover:shadow-lg font-semibold`}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => shareItinerary(itinerary, e)}
                  className="border-blue-300 text-blue-800 hover:bg-blue-50 font-medium"
                >
                  <Share className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => deleteItinerary(itinerary.id, e)}
                  className="border-red-300 text-red-800 hover:bg-red-50 font-medium"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Solo Journeys",
            count: itineraries.filter(
              (i) => i.preferences.travelStyle === "solo"
            ).length,
            color: "from-purple-400 to-indigo-500",
          },
          {
            label: "Couple Adventures",
            count: itineraries.filter(
              (i) => i.preferences.travelStyle === "couple"
            ).length,
            color: "from-pink-400 to-rose-500",
          },
          {
            label: "Family Trips",
            count: itineraries.filter(
              (i) => i.preferences.travelStyle === "family"
            ).length,
            color: "from-green-400 to-emerald-500",
          },
          {
            label: "Total Destinations",
            count: itineraries.reduce(
              (acc, i) => acc + (i.spots?.length || 0),
              0
            ),
            color: "from-yellow-400 to-orange-500",
          },
        ].map((stat, index) => (
          <Card
            key={index}
            className="border-2 border-white shadow-lg bg-gradient-to-br from-white to-gray-50"
          >
            <CardContent className="p-4 text-center">
              <div
                className={`bg-gradient-to-r ${stat.color} text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2 font-bold text-lg shadow-lg`}
              >
                {stat.count}
              </div>
              <p className="text-sm font-semibold text-blue-900">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ItineraryList;
