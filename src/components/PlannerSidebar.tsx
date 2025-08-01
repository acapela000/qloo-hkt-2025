import React, { useState } from "react";

export default function PlannerSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    days: "",
    budget: "",
    travelStyle: "",
    departureDate: "",
  });

  const travelStyles = [
    "Budget Backpacker",
    "Mid-range Explorer",
    "Luxury Traveler",
    "Adventure Seeker",
    "Cultural Enthusiast",
    "Relaxation Focused",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      className={`bg-white shadow-lg transition-all duration-300 ${
        isExpanded ? "w-80" : "w-16"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left border-b hover:bg-gray-50"
      >
        <div className="flex items-center justify-between">
          <span className={`font-medium ${isExpanded ? "block" : "hidden"}`}>
            Trip Planner
          </span>
          <span className="text-blue-600">{isExpanded ? "←" : "→"}</span>
        </div>
      </button>

      {/* Sidebar Content */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Number of Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Days
            </label>
            <input
              type="number"
              value={formData.days}
              onChange={(e) => handleInputChange("days", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 7"
            />
            <div className="mt-2 h-20 bg-gray-100 rounded-md flex items-center justify-center">
              <span className="text-gray-500 text-sm">📅 Days Preview</span>
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget
            </label>
            <input
              type="text"
              value={formData.budget}
              onChange={(e) => handleInputChange("budget", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., $2000"
            />
          </div>

          {/* Travel Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Travel Style
            </label>
            <select
              value={formData.travelStyle}
              onChange={(e) => handleInputChange("travelStyle", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select travel style</option>
              {travelStyles.map((style, index) => (
                <option key={index} value={style}>
                  {style}
                </option>
              ))}
            </select>
            <div className="mt-2 h-20 bg-gray-100 rounded-md flex items-center justify-center">
              <span className="text-gray-500 text-sm">🎒 Style Preview</span>
            </div>
          </div>

          {/* Departure Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departure Date
            </label>
            <input
              type="date"
              value={formData.departureDate}
              onChange={(e) =>
                handleInputChange("departureDate", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="mt-2 h-20 bg-gray-100 rounded-md flex items-center justify-center">
              <span className="text-gray-500 text-sm">🛫 Date Preview</span>
            </div>
          </div>

          {/* Review Preferences */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Review Your Preferences
            </h3>
            <div className="bg-gray-50 p-3 rounded-md space-y-2">
              <div className="text-xs">
                <span className="font-medium">Days:</span>{" "}
                {formData.days || "Not set"}
              </div>
              <div className="text-xs">
                <span className="font-medium">Budget:</span>{" "}
                {formData.budget || "Not set"}
              </div>
              <div className="text-xs">
                <span className="font-medium">Style:</span>{" "}
                {formData.travelStyle || "Not selected"}
              </div>
              <div className="text-xs">
                <span className="font-medium">Departure:</span>{" "}
                {formData.departureDate || "Not set"}
              </div>
            </div>
            <div className="mt-2 h-16 bg-gray-100 rounded-md flex items-center justify-center">
              <span className="text-gray-500 text-sm">
                📋 Preferences Preview
              </span>
            </div>
          </div>

          {/* Plan Trip Button */}
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            Plan My Trip
          </button>
        </div>
      )}
    </div>
  );
}
