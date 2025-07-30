"use client";

import React, { useState } from "react";
import LandingPage from "@/components/LandingPage";
import TravelItineraryApp from "@/components/TravelItineraryApp";
import ProfilePage from "@/components/ProfilePage";
import DashboardPage from "@/components/DiscoveryDashboard";
import Navigation from "@/components/Navigation";

export default function Home() {
  const [currentView, setCurrentView] = useState<
    "landing" | "app" | "profile" | "dashboard"
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

  if (currentView === "landing") {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen">
      <Navigation
        activeTab={currentView === "app" ? "discover" : currentView}
        onTabChange={handleTabChange}
      />

      {currentView === "app" && <TravelItineraryApp />}
      {currentView === "profile" && <ProfilePage />}
      {currentView === "dashboard" && <DashboardPage />}
    </div>
  );
}
