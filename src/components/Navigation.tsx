import React from "react";
import { Home, Search, MapPin, Heart, BarChart3, User } from "lucide-react";

interface NavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({
  activeTab = "home",
  onTabChange,
}) => {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "discover", label: "Discover", icon: Search },
    { id: "trips", label: "My Trips", icon: MapPin },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <nav
      className="bg-white border-b-2 border-primary-200 sticky top-0 z-50"
      style={{
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 247, 205, 0.95) 100%)",
        backdropFilter: "blur(8px)",
        borderBottom: "2px solid #fde047",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #fde047 0%, #3b82f6 100%)",
              }}
            >
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <span
              className="text-xl font-bold"
              style={{
                fontFamily: "Playfair Display, ui-serif, Georgia, serif",
                color: "#1e40af",
              }}
            >
              Trip Planner
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-primary-200 text-primary-800 font-semibold"
                    : "text-earth-600 hover:bg-primary-100 hover:text-primary-700"
                }`}
                style={
                  activeTab === tab.id
                    ? {
                        background:
                          "linear-gradient(135deg, #fde047 0%, #fef08a 100%)",
                        color: "#a16207",
                      }
                    : {}
                }
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="p-2 rounded-lg"
              style={{
                background: "linear-gradient(135deg, #fde047 0%, #3b82f6 100%)",
                color: "white",
              }}
            >
              Menu
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden bg-white border-t border-primary-200 py-2">
          <div className="grid grid-cols-3 gap-2">
            {tabs.slice(0, 6).map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg text-xs ${
                  activeTab === tab.id
                    ? "bg-primary-200 text-primary-800"
                    : "text-earth-600"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
