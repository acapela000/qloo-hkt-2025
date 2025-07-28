"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  type UserPreferences,
  type Recommendation,
  type Activity,
} from "../services/QlooApiService";
import MainLayout from "./mainlayout";
import UserPreferencesForm from "./userPreferencesForm";
import SpotCard from "./spotCard";
import ItineraryDisplay from "./itineraryDisplay";
import TravelTips from "./travelTips";
import { clientGetTravelTips } from "@/services/ClientApiService";

// Types
interface ItineraryDay {
  day: number;
  date: string;
  activities: Activity[];
}

interface Itinerary {
  id: string;
  destination: string;
  days: ItineraryDay[];
  totalDays: number;
}

// Main App Component
export default function TravelItineraryApp() {
  const [currentView, setCurrentView] = useState<"form" | "itinerary" | "tips">(
    "form"
  );

  // Sample itinerary data
  const sampleItinerary: Itinerary = {
    id: "1",
    destination: "Tokyo, Japan",
    totalDays: 3,
    days: [
      {
        day: 1,
        date: "2024-03-15",
        activities: [
          {
            id: "1",
            name: "Senso-ji Temple",
            time: "9:00 AM",
            type: "Cultural",
            image: "/placeholder.svg?height=64&width=64",
            address: "Asakusa, Tokyo",
            description:
              "Ancient Buddhist temple with traditional architecture and bustling market streets.",
            tips: "Visit early morning to avoid crowds and enjoy peaceful atmosphere.",
          },
          {
            id: "2",
            name: "Tokyo Skytree",
            time: "2:00 PM",
            type: "Sightseeing",
            image: "/placeholder.svg?height=64&width=64",
            address: "Sumida, Tokyo",
            description:
              "Iconic broadcasting tower offering panoramic views of Tokyo.",
            tips: "Book tickets online in advance for better prices and skip the lines.",
          },
        ],
      },
      {
        day: 2,
        date: "2024-03-16",
        activities: [
          {
            id: "3",
            name: "Tsukiji Outer Market",
            time: "8:00 AM",
            type: "Food",
            image: "/placeholder.svg?height=64&width=64",
            address: "Chuo, Tokyo",
            description: "Famous fish market with fresh sushi and street food.",
            tips: "Try the tuna sashimi and tamagoyaki from local vendors.",
          },
        ],
      },
      {
        day: 3,
        date: "2024-03-17",
        activities: [
          {
            id: "4",
            name: "Meiji Shrine",
            time: "10:00 AM",
            type: "Cultural",
            image: "/placeholder.svg?height=64&width=64",
            address: "Shibuya, Tokyo",
            description:
              "Peaceful Shinto shrine surrounded by forest in the heart of Tokyo.",
            tips: "Write wishes on wooden ema plaques and hang them at the shrine.",
          },
        ],
      },
    ],
  };

  // Sample recommendations
  const sampleRecommendations: Recommendation[] = [
    {
      id: "1",
      name: "Golden Pavilion",
      type: "Temple",
      address: "Kyoto, Japan",
      rating: 4.8,
      description:
        "Stunning golden temple reflected in surrounding pond, one of Japan's most iconic landmarks.",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Historic", "Photography", "Cultural"],
    },
    {
      id: "2",
      name: "Robot Restaurant",
      type: "Entertainment",
      address: "Shinjuku, Tokyo",
      rating: 4.2,
      description:
        "Unique dining experience with robot shows, neon lights, and energetic performances.",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Unique", "Nightlife", "Entertainment"],
    },
    {
      id: "3",
      name: "Bamboo Grove",
      type: "Nature",
      address: "Arashiyama, Kyoto",
      rating: 4.6,
      description:
        "Enchanting bamboo forest creating natural tunnels of green light.",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Nature", "Photography", "Peaceful"],
    },
  ];

  //call clientGetTravelTips
  const getTravelTips = async () => {
    try {
      const tips = await clientGetTravelTips(sampleItinerary.destination);
      console.log("Travel Tips:", tips);
      return tips;
    } catch (error) {
      console.error("Error fetching travel tips:", error);
      return [];
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant={currentView === "form" ? "default" : "outline"}
            onClick={() => setCurrentView("form")}
          >
            Plan Trip
          </Button>
          <Button
            variant={currentView === "itinerary" ? "default" : "outline"}
            onClick={() => setCurrentView("itinerary")}
          >
            View Itinerary
          </Button>
          <Button
            variant={currentView === "tips" ? "default" : "outline"}
            onClick={() => setCurrentView("tips")}
          >
            Travel Tips
          </Button>
        </div>

        {/* Content based on current view */}
        {currentView === "form" && (
          <div className="space-y-8">
            <UserPreferencesForm />

            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Recommended Spots
                </h2>
                <p className="text-gray-600 mt-2">
                  Popular destinations you might love
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleRecommendations.map((spot) => (
                  <SpotCard
                    key={spot.id}
                    spot={spot}
                    onAddToItinerary={(spot) =>
                      console.log("Added to itinerary:", spot)
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {currentView === "itinerary" && (
          <ItineraryDisplay itinerary={sampleItinerary} />
        )}

        {currentView === "tips" && <TravelTips />}
      </div>
    </MainLayout>
  );
}
