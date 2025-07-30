"use client";

import React, { useState } from "react";
import {
  Music,
  Utensils,
  Palette,
  Coffee,
  Camera,
  BookOpen,
} from "lucide-react";

interface CultureCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const CultureCategories: CultureCategory[] = [
  {
    id: "food-tour",
    name: "Food & Culinary",
    icon: <Utensils style={{ width: "1.5rem", height: "1.5rem" }} />,
    description:
      "Discover local cuisine, hidden gems, and authentic dining experiences",
    color: "#f97316", // orange-500
  },
  {
    id: "music-scene",
    name: "Music & Nightlife",
    icon: <Music style={{ width: "1.5rem", height: "1.5rem" }} />,
    description:
      "Explore live music venues, cultural performances, and vibrant nightlife",
    color: "#a855f7", // purple-500
  },
  {
    id: "art-culture",
    name: "Art & Museums",
    icon: <Palette style={{ width: "1.5rem", height: "1.5rem" }} />,
    description: "Immerse in galleries, museums, and artistic neighborhoods",
    color: "#ec4899", // pink-500
  },
  {
    id: "coffee-culture",
    name: "Coffee & Cafés",
    icon: <Coffee style={{ width: "1.5rem", height: "1.5rem" }} />,
    description: "Find the best coffee shops, roasters, and café culture",
    color: "#f59e0b", // amber-500
  },
  {
    id: "photography",
    name: "Photography Spots",
    icon: <Camera style={{ width: "1.5rem", height: "1.5rem" }} />,
    description:
      "Capture Instagram-worthy moments and hidden photo opportunities",
    color: "#3b82f6", // blue-500
  },
  {
    id: "literary",
    name: "Literary & Bookish",
    icon: <BookOpen style={{ width: "1.5rem", height: "1.5rem" }} />,
    description: "Discover bookstores, literary cafés, and writer haunts",
    color: "#10b981", // green-500
  },
];

interface CultureBasedRecommendationsProps {
  onCategorySelect: (category: string) => void;
  selectedCategory?: string;
}

export const CultureBasedRecommendations: React.FC<
  CultureBasedRecommendationsProps
> = ({ onCategorySelect, selectedCategory }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fef7cd 0%, #dbeafe 100%)",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        padding: "2rem 1.5rem",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              fontFamily: "Playfair Display, ui-serif, Georgia, serif",
              color: "#1e40af",
            }}
          >
            Discover Through Your Cultural Taste
          </h2>
          <p
            style={{
              color: "#57534e",
              maxWidth: "32rem",
              margin: "0 auto",
              fontSize: "1rem",
            }}
          >
            Powered by Qloo's cultural intelligence, we recommend experiences
            based on your unique interests and taste profile
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {CultureCategories.map((category) => (
            <div
              key={category.id}
              style={{
                cursor: "pointer",
                transition: "all 0.3s ease",
                border:
                  selectedCategory === category.id
                    ? "2px solid #3b82f6"
                    : "2px solid rgba(234, 179, 8, 0.2)",
                background:
                  selectedCategory === category.id
                    ? "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(254, 247, 205, 0.9) 100%)"
                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(254, 247, 205, 0.9) 100%)",
                backdropFilter: "blur(8px)",
                borderRadius: "0.75rem",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                padding: "1.5rem",
              }}
              onClick={() => onCategorySelect(category.id)}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    backgroundColor: category.color,
                    width: "4rem",
                    height: "4rem",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                    color: "white",
                  }}
                >
                  {category.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "#1e40af",
                    marginBottom: "0.5rem",
                  }}
                >
                  {category.name}
                </h3>
              </div>
              <div>
                <p
                  style={{
                    color: "#57534e",
                    textAlign: "center",
                    fontSize: "0.875rem",
                  }}
                >
                  {category.description}
                </p>
                {selectedCategory === category.id && (
                  <div style={{ marginTop: "1rem", textAlign: "center" }}>
                    <span
                      style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                      }}
                    >
                      Selected
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedCategory && (
          <div style={{ textAlign: "center" }}>
            <button
              style={{
                background: "linear-gradient(135deg, #fde047 0%, #3b82f6 100%)",
                color: "white",
                padding: "0.75rem 2rem",
                borderRadius: "0.5rem",
                fontWeight: "600",
                fontSize: "1.125rem",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => onCategorySelect(selectedCategory)}
            >
              Get{" "}
              {CultureCategories.find((c) => c.id === selectedCategory)?.name}{" "}
              Recommendations
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
