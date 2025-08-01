import React from "react";
import {
  Edit,
  Camera,
  Mail,
  MapPin,
  Calendar,
  Palette,
  Settings,
  Bell,
  Lock,
  Globe,
} from "lucide-react";

const ProfilePage: React.FC = () => {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #fef7cd 0%, #dbeafe 100%)",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div className="container mx-auto px-6 py-8 max-w-4xl">
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
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold"
                style={{
                  background:
                    "linear-gradient(135deg, #fde047 0%, #3b82f6 100%)",
                  color: "white",
                }}
              >
                TE
              </div>
              <button
                className="absolute -bottom-2 -right-2 p-2 rounded-full bg-white shadow-lg"
                style={{ color: "#eab308" }}
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1
                  className="text-3xl font-bold"
                  style={{
                    fontFamily: "Playfair Display, ui-serif, Georgia, serif",
                    color: "#1e40af",
                  }}
                >
                  My Profile
                </h1>
                <button
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-300"
                  style={{
                    borderColor: "#fde047",
                    color: "#a16207",
                    background: "transparent",
                  }}
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
              <p className="text-lg mb-4" style={{ color: "#57534e" }}>
                Your artistic travel journey
              </p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Info */}
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
                className="text-2xl font-bold mb-4"
                style={{
                  fontFamily: "Playfair Display, ui-serif, Georgia, serif",
                  color: "#1e40af",
                }}
              >
                Travel Explorer
              </h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5" style={{ color: "#eab308" }} />
                  <span style={{ color: "#57534e" }}>explorer@travel.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5" style={{ color: "#eab308" }} />
                  <span style={{ color: "#57534e" }}>San Francisco, CA</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5" style={{ color: "#eab308" }} />
                  <span style={{ color: "#57534e" }}>
                    Member since January 2024
                  </span>
                </div>
              </div>

              <p className="mt-4 leading-relaxed" style={{ color: "#57534e" }}>
                Adventure seeker & culture enthusiast passionate about
                discovering hidden gems around the world through Van Gogh's
                artistic lens.
              </p>
            </div>

            {/* Travel Style */}
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
              <div className="flex items-center space-x-3 mb-4">
                <Palette className="w-6 h-6" style={{ color: "#eab308" }} />
                <h3
                  className="text-xl font-semibold"
                  style={{ color: "#1e40af" }}
                >
                  Travel Style
                </h3>
              </div>
              <div
                className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  background:
                    "linear-gradient(135deg, #fde047 0%, #fef08a 100%)",
                  color: "#a16207",
                }}
              >
                Cultural Explorer
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Settings Sections */}
            {[
              {
                icon: Bell,
                title: "Email Notifications",
                description:
                  "Receive travel updates and artistic recommendations",
                action: "Configure",
              },
              {
                icon: Lock,
                title: "Privacy Settings",
                description: "Manage your data and privacy preferences",
                action: "Manage",
              },
              {
                icon: Palette,
                title: "Travel Preferences",
                description: "Update your artistic travel style and interests",
                action: "Update",
              },
            ].map((setting, index) => (
              <div
                key={index}
                className="rounded-xl p-6"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(254, 247, 205, 0.9) 100%)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(234, 179, 8, 0.2)",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <setting.icon
                      className="w-6 h-6 mt-1"
                      style={{ color: "#eab308" }}
                    />
                    <div>
                      <h3
                        className="text-lg font-semibold mb-2"
                        style={{ color: "#1e40af" }}
                      >
                        {setting.title}
                      </h3>
                      <p style={{ color: "#57534e" }}>{setting.description}</p>
                    </div>
                  </div>
                  <button
                    className="px-4 py-2 rounded-lg border-2 transition-all duration-300 text-sm font-medium"
                    style={{
                      borderColor: "#fde047",
                      color: "#a16207",
                      background: "transparent",
                    }}
                  >
                    {setting.action}
                  </button>
                </div>
              </div>
            ))}

            {/* Quick Stats */}
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
              <h3
                className="text-xl font-semibold mb-4"
                style={{ color: "#1e40af" }}
              >
                Your Artistic Journey
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Favorite Destinations",
                    value: "Paris, Tokyo, Amsterdam, Provence",
                  },
                  { label: "Languages", value: "English, Spanish, French" },
                  {
                    label: "Travel Interests",
                    value:
                      "Art Museums, Local Cuisine, Photography, Music, Street Art",
                  },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div
                      className="text-sm font-medium mb-1"
                      style={{ color: "#a16207" }}
                    >
                      {stat.label}
                    </div>
                    <div className="text-xs" style={{ color: "#57534e" }}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
