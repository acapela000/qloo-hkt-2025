import React from "react";
import {
  Search,
  Star,
  Heart,
  MapPin,
  Compass,
  Plane,
  Globe,
  Trash2,
} from "lucide-react";

const DashboardPage: React.FC = () => {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #fef7cd 0%, #dbeafe 100%)",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div
          className="rounded-xl p-8 mb-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(254, 247, 205, 0.9) 100%)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(234, 179, 8, 0.2)",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1
                className="text-4xl font-bold mb-2"
                style={{
                  fontFamily: "Playfair Display, ui-serif, Georgia, serif",
                  color: "#1e40af",
                }}
              >
                Discovery Dashboard
              </h1>
              <p className="text-lg" style={{ color: "#57534e" }}>
                Track your travel exploration journey with artistic flair
              </p>
            </div>
            <button
              className="px-4 py-2 rounded-lg border-2 transition-all duration-300"
              style={{
                borderColor: "#fde047",
                color: "#a16207",
                background: "transparent",
              }}
            >
              Clear History
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: Search,
              label: "Total Searches",
              value: "17",
              sublabel: "Discovery journey",
            },
            {
              icon: Heart,
              label: "Favorites",
              value: "3",
              sublabel: "Loved places",
            },
            {
              icon: MapPin,
              label: "Itinerary Items",
              value: "0",
              sublabel: "Planned adventures",
            },
            {
              icon: Globe,
              label: "Trip Folders",
              value: "3",
              sublabel: "Organized dreams",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(254, 247, 205, 0.9) 100%)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(234, 179, 8, 0.2)",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{
                  background:
                    "linear-gradient(135deg, #fde047 0%, #3b82f6 100%)",
                }}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div
                className="text-2xl font-bold mb-1"
                style={{ color: "#1e40af" }}
              >
                {stat.value}
              </div>
              <div
                className="text-sm font-semibold mb-1"
                style={{ color: "#a16207" }}
              >
                {stat.label}
              </div>
              <div className="text-xs" style={{ color: "#57534e" }}>
                {stat.sublabel}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {[
            {
              icon: Plane,
              label: "Trips Planned",
              value: "0",
              sublabel: "Ready to fly",
            },
            {
              icon: Globe,
              label: "Countries Explored",
              value: "3",
              sublabel: "Global wanderer",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="rounded-xl p-6 text-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(254, 247, 205, 0.9) 100%)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(234, 179, 8, 0.2)",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, #fde047 0%, #3b82f6 100%)",
                }}
              >
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: "#1e40af" }}
              >
                {stat.value}
              </div>
              <div
                className="text-lg font-semibold mb-1"
                style={{ color: "#a16207" }}
              >
                {stat.label}
              </div>
              <div style={{ color: "#57534e" }}>{stat.sublabel}</div>
            </div>
          ))}
        </div>

        {/* Recent Searches Section */}
        <div
          className="rounded-xl p-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(254, 247, 205, 0.9) 100%)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(234, 179, 8, 0.2)",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            className="text-2xl font-bold mb-6"
            style={{
              fontFamily: "Playfair Display, ui-serif, Georgia, serif",
              color: "#1e40af",
            }}
          >
            Recent Searches
          </h2>

          <div className="text-center py-12">
            <Search
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: "#a8a29e" }}
            />
            <p className="text-lg" style={{ color: "#57534e" }}>
              Your search history will appear here
            </p>
            <p className="text-sm mt-2" style={{ color: "#a8a29e" }}>
              Start exploring to see your artistic journey unfold
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
