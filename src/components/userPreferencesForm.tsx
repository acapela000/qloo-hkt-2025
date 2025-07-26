"use client";

import type React from "react";
import { useState } from "react";
import {
  Check,
  Camera,
  Utensils,
  Music,
  Mountain,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  getRecommendations,
  type UserPreferences,
} from "../services/QlooApiService";

// UserPreferencesForm Component
const UserPreferencesForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [preferences, setPreferences] = useState<UserPreferences>({
    destination: "",
    numberOfDays: 1,
    budget: "medium",
    travelStyle: "solo",
    interests: [],
    departureDate: "",
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const interestOptions = [
    {
      id: "food",
      label: "Food & Dining",
      icon: <Utensils className="h-4 w-4" />,
    },
    {
      id: "nightlife",
      label: "Nightlife",
      icon: <Music className="h-4 w-4" />,
    },
    {
      id: "adventure",
      label: "Adventure",
      icon: <Mountain className="h-4 w-4" />,
    },
    {
      id: "photography",
      label: "Photography",
      icon: <Camera className="h-4 w-4" />,
    },
    {
      id: "relaxation",
      label: "Relaxation",
      icon: <Heart className="h-4 w-4" />,
    },
    {
      id: "shopping",
      label: "Shopping",
      icon: <ShoppingBag className="h-4 w-4" />,
    },
  ];

  const handleInterestToggle = (interestId: string) => {
    setPreferences((prev) => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter((id) => id !== interestId)
        : [...prev.interests, interestId],
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const recommendations = await getRecommendations(preferences);
      console.log("Recommendations:", recommendations);
      // Handle successful submission
    } catch (error) {
      console.error("Error getting recommendations:", error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder="Where would you like to go?"
                value={preferences.destination}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    destination: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="days">Number of Days</Label>
              <Input
                id="days"
                type="number"
                min="1"
                max="30"
                value={preferences.numberOfDays}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    numberOfDays: Number.parseInt(e.target.value) || 1,
                  }))
                }
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label>Budget</Label>
              <Select
                value={preferences.budget}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setPreferences((prev) => ({ ...prev, budget: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low ($0-50/day)</SelectItem>
                  <SelectItem value="medium">Medium ($50-150/day)</SelectItem>
                  <SelectItem value="high">High ($150+/day)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Travel Style</Label>
              <Select
                value={preferences.travelStyle}
                onValueChange={(
                  value: "solo" | "couple" | "family" | "group"
                ) =>
                  setPreferences((prev) => ({ ...prev, travelStyle: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo">Solo Travel</SelectItem>
                  <SelectItem value="couple">Couple</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <Label>Interests (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {interestOptions.map((interest) => (
                <Button
                  key={interest.id}
                  variant={
                    preferences.interests.includes(interest.id)
                      ? "default"
                      : "outline"
                  }
                  className="justify-start h-auto p-3"
                  onClick={() => handleInterestToggle(interest.id)}
                >
                  {interest.icon}
                  <span className="ml-2">{interest.label}</span>
                  {preferences.interests.includes(interest.id) && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="departure">Departure Date (Optional)</Label>
              <Input
                id="departure"
                type="date"
                value={preferences.departureDate}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    departureDate: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Review Your Preferences</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Destination:</strong> {preferences.destination}
              </p>
              <p>
                <strong>Duration:</strong> {preferences.numberOfDays} days
              </p>
              <p>
                <strong>Budget:</strong> {preferences.budget}
              </p>
              <p>
                <strong>Travel Style:</strong> {preferences.travelStyle}
              </p>
              <p>
                <strong>Interests:</strong> {preferences.interests.join(", ")}
              </p>
              {preferences.departureDate && (
                <p>
                  <strong>Departure:</strong> {preferences.departureDate}
                </p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Plan Your Perfect Trip</CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderStep()}

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          {currentStep === totalSteps ? (
            <Button onClick={handleSubmit}>Create Itinerary</Button>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserPreferencesForm;
