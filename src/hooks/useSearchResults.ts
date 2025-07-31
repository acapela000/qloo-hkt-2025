"use client";

import { useState, useEffect } from "react";

export interface Recommendation {
  id: string;
  name: string;
  type: string;
  image?: string;
  rating?: number;
  address?: string;
  description?: string;
  tags?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  qlooScore?: number;
  qlooExplanation?: string;
}

interface SearchState {
  destination: string;
  preferences: string;
  selectedCategories: string[];
  recommendations: Recommendation[];
  lastSearchTime: number;
}

export const useSearchResults = () => {
  const [searchState, setSearchState] = useState<SearchState>({
    destination: "",
    preferences: "",
    selectedCategories: [],
    recommendations: [],
    lastSearchTime: 0,
  });

  // Load search state from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("searchResults");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Only restore if search was recent (within 1 hour)
          if (Date.now() - parsed.lastSearchTime < 3600000) {
            setSearchState(parsed);
          }
        } catch (error) {
          console.error("Failed to parse saved search results:", error);
        }
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      searchState.recommendations.length > 0
    ) {
      localStorage.setItem("searchResults", JSON.stringify(searchState));
    }
  }, [searchState]);

  const updateSearchResults = (
    destination: string,
    preferences: string,
    selectedCategories: string[],
    recommendations: Recommendation[]
  ) => {
    setSearchState({
      destination,
      preferences,
      selectedCategories,
      recommendations,
      lastSearchTime: Date.now(),
    });
  };

  const clearSearchResults = () => {
    setSearchState({
      destination: "",
      preferences: "",
      selectedCategories: [],
      recommendations: [],
      lastSearchTime: 0,
    });
    if (typeof window !== "undefined") {
      localStorage.removeItem("searchResults");
    }
  };

  return {
    searchState,
    updateSearchResults,
    clearSearchResults,
    hasResults: searchState.recommendations.length > 0,
  };
};

// Add debugging in this hook to see if it's overriding your data
export const useDebugSearchResults = () => {
  const { searchState } = useSearchResults();

  useEffect(() => {
    console.log("Current search state:", JSON.stringify(searchState, null, 2));
  }, [searchState]);

  return searchState;
};
