"use client";

import React, { useState } from "react";
import LandingPage from "@/components/LandingPage";
import TravelItineraryApp from "@/components/TravelItineraryApp";
import ProfilePage from "@/components/ProfilePage";
import DashboardPage from "@/components/DiscoveryDashboard";
import TripFolders from "@/components/TripFolders";
import Navigation from "@/components/Navigation";
import { FavoritesContent } from "@/components/TabContents";
import {
  Menu,
  X,
  Home as HomeIcon, // Rename the icon import to avoid conflict
  Search,
  MapPin,
  Heart,
  BarChart3,
  User,
} from "lucide-react";

export default function HomePage() {
  // Renamed from Home to HomePage
  const [currentView, setCurrentView] = useState<
    "landing" | "app" | "profile" | "dashboard" | "trips" | "favorites"
  >("landing");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // SEPARATE LANDING PAGE - No navigation
  if (currentView === "landing") {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  // APP PAGES - With navigation
  return (
    <div className="min-h-screen">
      {/* DESKTOP NAVIGATION - Show on desktop only */}
      <div className="hidden md:block">
        <Navigation activeTab={getActiveTab()} onTabChange={handleTabChange} />
      </div>

      {/* MOBILE STICKY NAVBAR - Show on mobile only */}
      <div className="md:hidden">
        {/* Mobile Top Navbar - Sticky */}
        <div className="sticky top-0 z-40 bg-gradient-to-r from-yellow-100 via-green-100 to-blue-200 border-b border-gray-200 shadow-sm">
          <div className="flex justify-between items-center px-4 py-3">
            {/* Logo/Title */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 via-orange-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <div className="absolute w-8 h-8 bg-gradient-to-tr from-yellow-300/40 via-orange-400/30 to-blue-500/40 rounded-full"></div>
                <span className="relative text-white font-bold text-sm drop-shadow-md">
                  Q
                </span>
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 bg-clip-text text-transparent">
                Trip Planner
              </h1>
            </div>

            {/* SINGLE Burger Menu Button */}
            <div
              onClick={toggleMobileMenu}
              className="relative w-12 h-10 rounded-xl bg-gradient-to-br from-yellow-400 via-orange-500 to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-yellow-300/30 via-orange-400/20 to-blue-500/30"></div>
              <div className="relative flex items-center justify-center h-full">
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay - Fixed content */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={closeMobileMenu}
            />

            {/* Menu Panel - FIXED NAVIGATION CONTENT */}
            <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50">
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-blue-50">
                <h2 className="text-lg font-semibold text-gray-800">
                  Navigation
                </h2>
                <div
                  onClick={closeMobileMenu}
                  className="p-2 hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </div>
              </div>

              {/* NAVIGATION ITEMS - Not landing page content */}
              <div className="flex flex-col p-4 space-y-2">
                {/* Home - Using HomeIcon instead of Home */}
                <div
                  onClick={() => handleTabChange("home")}
                  className={`
                    flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer
                    ${
                      getActiveTab() === "home"
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50"
                    }
                  `}
                >
                  <HomeIcon
                    className={`w-5 h-5 ${
                      getActiveTab() === "home"
                        ? "text-blue-600"
                        : "text-gray-600"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      getActiveTab() === "home"
                        ? "text-blue-800"
                        : "text-gray-800"
                    }`}
                  >
                    Home
                  </span>
                </div>

                {/* Discover */}
                <div
                  onClick={() => handleTabChange("discover")}
                  className={`
                    flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer
                    ${
                      getActiveTab() === "discover"
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50"
                    }
                  `}
                >
                  <Search
                    className={`w-5 h-5 ${
                      getActiveTab() === "discover"
                        ? "text-blue-600"
                        : "text-gray-600"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      getActiveTab() === "discover"
                        ? "text-blue-800"
                        : "text-gray-800"
                    }`}
                  >
                    Discover
                  </span>
                </div>

                {/* My Trips */}
                <div
                  onClick={() => handleTabChange("trips")}
                  className={`
                    flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer
                    ${
                      getActiveTab() === "trips"
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50"
                    }
                  `}
                >
                  <MapPin
                    className={`w-5 h-5 ${
                      getActiveTab() === "trips"
                        ? "text-blue-600"
                        : "text-gray-600"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      getActiveTab() === "trips"
                        ? "text-blue-800"
                        : "text-gray-800"
                    }`}
                  >
                    My Trips
                  </span>
                </div>

                {/* Favorites */}
                <div
                  onClick={() => handleTabChange("favorites")}
                  className={`
                    flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer
                    ${
                      getActiveTab() === "favorites"
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50"
                    }
                  `}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      getActiveTab() === "favorites"
                        ? "text-blue-600"
                        : "text-gray-600"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      getActiveTab() === "favorites"
                        ? "text-blue-800"
                        : "text-gray-800"
                    }`}
                  >
                    Favorites
                  </span>
                </div>

                {/* Dashboard */}
                <div
                  onClick={() => handleTabChange("dashboard")}
                  className={`
                    flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer
                    ${
                      getActiveTab() === "dashboard"
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50"
                    }
                  `}
                >
                  <BarChart3
                    className={`w-5 h-5 ${
                      getActiveTab() === "dashboard"
                        ? "text-blue-600"
                        : "text-gray-600"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      getActiveTab() === "dashboard"
                        ? "text-blue-800"
                        : "text-gray-800"
                    }`}
                  >
                    Dashboard
                  </span>
                </div>

                {/* Profile */}
                <div
                  onClick={() => handleTabChange("profile")}
                  className={`
                    flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer
                    ${
                      getActiveTab() === "profile"
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50"
                    }
                  `}
                >
                  <User
                    className={`w-5 h-5 ${
                      getActiveTab() === "profile"
                        ? "text-blue-600"
                        : "text-gray-600"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      getActiveTab() === "profile"
                        ? "text-blue-800"
                        : "text-gray-800"
                    }`}
                  >
                    Profile
                  </span>
                </div>
              </div>

              {/* Menu Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
                <div className="text-center text-sm text-gray-500">
                  Trip Planner v1.0
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* MAIN CONTENT - Pass mobile menu state to prevent duplicate menus */}
      <div>
        {currentView === "app" && (
          <TravelItineraryApp
            onTabChange={handleTabChange}
            hideMobileNav={true} // Pass prop to hide duplicate nav
          />
        )}
        {currentView === "profile" && <ProfilePage />}
        {currentView === "dashboard" && <DashboardPage />}
        {currentView === "trips" && <TripFolders />}
        {currentView === "favorites" && <FavoritesContent />}
      </div>
    </div>
  );
}
