"use client";

import React, { useState } from "react";
import LandingPage from "@/components/LandingPage";
import TravelItineraryApp from "@/components/TravelItineraryApp";
import ProfilePage from "@/components/ProfilePage";
import DashboardPage from "@/components/DiscoveryDashboard";
import TripFolders from "@/components/TripFolders";
import Navigation from "@/components/Navigation";
import { FavoritesContent } from "@/components/TabContents";

export default function Home() {
  const [currentView, setCurrentView] = useState<
    "landing" | "app" | "profile" | "dashboard" | "trips" | "favorites"
  >("landing");

  const handleGetStarted = () => {
    setCurrentView("app");
  };

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case "home":
        setCurrentView("landing");
        break;
      case "discover":
        setCurrentView("app");
        break;
      case "trips":
        setCurrentView("trips");
        break;
      case "favorites":
        setCurrentView("favorites");
        break;
      case "profile":
        setCurrentView("profile");
        break;
      case "dashboard":
        setCurrentView("dashboard");
        break;
      default:
        setCurrentView("app");
    }
  };

  // Function to map currentView to activeTab for Navigation component
  const getActiveTab = () => {
    switch (currentView) {
      case "landing":
        return "home";
      case "app":
        return "discover";
      case "trips":
        return "trips";
      case "favorites":
        return "favorites";
      case "profile":
        return "profile";
      case "dashboard":
        return "dashboard";
      default:
        return "home";
    }
  };

  if (currentView === "landing") {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen">
      <Navigation activeTab={getActiveTab()} onTabChange={handleTabChange} />

      {currentView === "app" && <TravelItineraryApp />}
      {currentView === "profile" && <ProfilePage />}
      {currentView === "dashboard" && <DashboardPage />}
      {currentView === "trips" && <TripFolders />}
      {currentView === "favorites" && <FavoritesContent />}
    </div>
  );
}
