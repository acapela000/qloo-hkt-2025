import type {
  UserPreferences,
  Recommendation,
  Itinerary,
} from "./QlooApiService";

export const clientGetRecommendations = async (
  preferences: UserPreferences
): Promise<Recommendation[]> => {
  try {
    console.log("=== Client API Service ===");
    console.log("Calling recommendations API with:", preferences);

    // Validate input
    if (!preferences.destination?.trim()) {
      throw new Error("Destination is required");
    }

    const response = await fetch("/api/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferences),
    });

    console.log("API Response status:", response.status);
    console.log("API Response ok:", response.ok);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error Response:", errorData);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API Response data:", data);

    return data.recommendations || [];
  } catch (error) {
    console.error("Error in clientGetRecommendations:", error);

    // If it's a network error, provide helpful message
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        "Network error: Unable to connect to the server. Please check your connection."
      );
    }

    throw error;
  }
};

export const clientCreateItinerary = async (
  preferences: UserPreferences,
  selectedSpots: Recommendation[]
): Promise<Itinerary> => {
  try {
    const response = await fetch("/api/itinerary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ preferences, selectedSpots }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.itinerary;
  } catch (error) {
    console.error("Error creating itinerary:", error);
    throw error;
  }
};

export const clientSaveItinerary = async (
  itinerary: Itinerary
): Promise<boolean> => {
  try {
    const response = await fetch("/api/itinerary/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itinerary }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error saving itinerary:", error);
    return false;
  }
};

export const clientShareItinerary = async (
  itineraryId: string,
  email: string
): Promise<boolean> => {
  try {
    const response = await fetch("/api/itinerary/share", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itineraryId, email }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error sharing itinerary:", error);
    return false;
  }
};

export const clientGetTravelTips = async (
  destination: string
): Promise<string[]> => {
  try {
    const response = await fetch("/api/travel-tips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ destination }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.tips;
  } catch (error) {
    console.error("Error getting travel tips:", error);
    throw error;
  }
};
