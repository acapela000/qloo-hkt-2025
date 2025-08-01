"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  Share2,
  Download,
  Copy,
  ChevronDown,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Recommendation,
  UserPreferences,
  type Activity,
} from "@/services/QlooApiService";

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

// ItineraryDisplay Component
interface ItineraryDisplayProps {
  itinerary: Itinerary;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary }) => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // State to manage export status
  // "idle" | "loading" | "success" | "error"
  // "idle" means no export in progress
  // "loading" means export is in progress
  // "success" means export completed successfully
  // "error" means export failed
  const [exportStatus, setExportStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [shareEmail, setShareEmail] = useState("");

  const handleShare = () => {
    // Simulate sharing
    console.log("Sharing with:", shareEmail);
    setShareModalOpen(false);
    setShareEmail("");
  };

  const handleExport = async () => {
    setExportStatus("loading");
    // Simulate export
    setTimeout(() => {
      setExportStatus("success");
      setTimeout(() => {
        setExportStatus("idle");
        setExportModalOpen(false);
      }, 2000);
    }, 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // Could add toast notification here
    console.log("Link copied to clipboard:", window.location.href);
    setShareModalOpen(false);
    setShareEmail("");
    setExportModalOpen(false);
    setExportStatus("idle");
  };

  // call clientGetItinerary function to fetch itinerary data POST request
  // body of the post is: { preferences, selectedSpots }
  const fetchItinerary = async (
    preferences: UserPreferences,
    selectedSpots: Recommendation[]
  ) => {
    try {
      const response = await fetch("/api/itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preferences, selectedSpots }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch itinerary");
      }

      const data = await response.json();
      return data.itinerary;
    } catch (error) {
      console.error("Error fetching itinerary:", error);
      throw error;
    }
  };

  useEffect(() => {
    // Fetch itinerary with fetchItinerary function
    const getItinerary = async () => {
      try {
        const preferences: UserPreferences = {
          destination: "Sample Destination",
          numberOfDays: 5,
          budget: "medium",
          travelStyle: "solo",
          interests: ["Nature", "Culture"],
        }; // Define preferences object or fetch it from props/state
        const selectedSpots: Recommendation[] = []; // Define selectedSpots array or fetch it from props/state
        const itineraryData = await fetchItinerary(preferences, selectedSpots);
        // Update state with fetched itinerary data
        console.log("Fetched Itinerary:", itineraryData);
      } catch (error) {
        console.error("Error fetching itinerary:", error);
      }
    };

    getItinerary();
  }, [itinerary.id]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{itinerary.destination}</h2>
          <p className="text-gray-600">{itinerary.totalDays} days itinerary</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Itinerary</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="friend@example.com"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleShare} className="flex-1">
                    Send
                  </Button>
                  <Button variant="outline" onClick={copyLink}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export to Notion</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {exportStatus === "idle" && (
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      Export your itinerary to Notion for easy access and
                      editing.
                    </p>
                    <Button onClick={handleExport} className="w-full">
                      Export to Notion
                    </Button>
                  </div>
                )}
                {exportStatus === "loading" && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p>Exporting...</p>
                  </div>
                )}
                {exportStatus === "success" && (
                  <div className="text-center py-4 text-green-600">
                    <Check className="h-8 w-8 mx-auto mb-2" />
                    <p>Successfully exported to Notion!</p>
                  </div>
                )}
                {exportStatus === "error" && (
                  <div className="text-center py-4 text-red-600">
                    <X className="h-8 w-8 mx-auto mb-2" />
                    <p>Export failed. Please try again.</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" onClick={copyLink}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {itinerary.days.map((day) => (
          <Collapsible key={day.day} defaultOpen={day.day === 1}>
            <CollapsibleTrigger asChild>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Day {day.day}</CardTitle>
                      <p className="text-sm text-gray-600">{day.date}</p>
                    </div>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </CardHeader>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 space-y-3">
                {day.activities.map((activity, index) => (
                  <Card key={activity.id} className="ml-4">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={activity.image || "/placeholder.svg"}
                          alt={activity.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-sm">
                                {activity.name}
                              </h4>
                              <p className="text-xs text-gray-600 flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {activity.time}
                              </p>
                              <p className="text-xs text-gray-600 flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {activity.address}
                              </p>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {activity.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-700 mt-2">
                            {activity.description}
                          </p>
                          {activity.tips && (
                            <p className="text-xs text-blue-600 mt-1 italic">
                              💡 {activity.tips}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default ItineraryDisplay;
function clientGetItinerary(id: string) {
  throw new Error("Function not implemented.");
}
