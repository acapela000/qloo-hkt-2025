// Types
export interface UserPreferences {
  destination: string;
  numberOfDays: number;
  budget: "low" | "medium" | "high";
  travelStyle: "solo" | "couple" | "family" | "group";
  interests: string[];
  departureDate?: string;
}

export interface Recommendation {
  id: string;
  name: string;
  type: string;
  image?: string;
  rating?: number;
  address?: string;
  description?: string;
  tags: string[];
  price?: string;
  latitude?: number;
  longitude?: number;
}

export interface Activity {
  id: string;
  name: string;
  time: string;
  type: string;
  image: string;
  address: string;
  description: string;
  tips?: string;
}

export interface Itinerary {
  id: string;
  destination: string;
  totalDays: number;
  preferences: UserPreferences;
  spots: Recommendation[];
  createdAt: string;
}

// API Configuration
const QLOO_API_BASE = "https://hackathon.api.qloo.com/v2";
const QLOO_API_KEY = process.env.QLOO_API_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

// Debug logging
console.log("=== API Keys Debug ===");
console.log("QLOO_API_KEY present:", !!QLOO_API_KEY);
console.log("QLOO_API_KEY length:", QLOO_API_KEY.length);
console.log("OPENAI_API_KEY present:", !!OPENAI_API_KEY);
console.log("OPENAI_API_KEY length:", OPENAI_API_KEY.length);

// Qloo API Headers - Try different auth methods
const getQlooHeaders = () => {
  console.log(
    "Using Qloo API Key:",
    QLOO_API_KEY ? `${QLOO_API_KEY.substring(0, 10)}...` : "MISSING"
  );

  // Try X-API-Key header instead of Bearer (Qloo might use this format)
  return {
    "x-api-key": QLOO_API_KEY,
    "Content-Type": "application/json",
  };

  // Alternative: Bearer token
  // return {
  //   'Authorization': `Bearer ${QLOO_API_KEY}`,
  //   'Content-Type': 'application/json',
  // };
};

// OpenAI API Headers - IMPLEMENT THIS FUNCTION
const getOpenAIHeaders = () => {
  return {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  };
};

// Map user interests to Qloo categories
const mapInterestsToQlooCategories = (interests: string[]): string[] => {
  const categoryMap: { [key: string]: string[] } = {
    food: ["restaurants", "bars", "cafes"],
    nightlife: ["bars", "nightlife", "entertainment"],
    adventure: ["outdoor", "sports", "adventure"],
    photography: ["landmarks", "scenic", "museums"],
    relaxation: ["spas", "parks", "wellness"],
    shopping: ["shopping", "markets", "retail"],
  };

  const categories = new Set<string>();
  interests.forEach((interest) => {
    if (categoryMap[interest]) {
      categoryMap[interest].forEach((cat) => categories.add(cat));
    }
  });

  return Array.from(categories);
};

// Enhanced recommendation prompt for LLM
const generateRecommendationPrompt = (preferences: UserPreferences) => {
  return `You are a travel expert. Generate personalized travel recommendations for:
  
Destination: ${preferences.destination}
Duration: ${preferences.numberOfDays} days
Budget: ${preferences.budget}
Travel Style: ${preferences.travelStyle}
Interests: ${preferences.interests.join(", ")}
Departure Date: ${preferences.departureDate || "Not specified"}

Please provide ${
    preferences.numberOfDays * 2
  } specific recommendations in this JSON format:
[
  {
    "name": "Location Name",
    "type": "Category (e.g., Restaurant, Attraction, Activity)",
    "description": "Detailed description",
    "address": "Specific address in ${preferences.destination}",
    "tags": ["tag1", "tag2", "tag3"],
    "estimatedRating": 4.5
  }
]

Only return valid JSON, no extra text.`;
};

// Test Qloo API function
export const testQlooAPI = async () => {
  try {
    console.log("Testing Qloo API...");
    console.log(
      "API Key:",
      QLOO_API_KEY ? `${QLOO_API_KEY.substring(0, 10)}...` : "MISSING"
    );

    if (!QLOO_API_KEY) {
      console.log("No Qloo API key found");
      return false;
    }

    // Simple test request with a valid location
    const response = await fetch(`${QLOO_API_BASE}/recommend`, {
      method: "POST",
      headers: getQlooHeaders(),
      body: JSON.stringify({
        input: {
          geo_location: "New York", // Make sure this is not empty
          category: ["restaurants"],
          limit: 5,
        },
      }),
    });

    console.log("Response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("API Test Success:", data);
      return true;
    } else {
      const errorText = await response.text();
      console.log("API Test Failed:", errorText);
      return false;
    }
  } catch (error) {
    console.error("API Test Error:", error);
    return false;
  }
};

// AI Enhanced Recommendations
const getAIEnhancedRecommendations = async (
  preferences: UserPreferences,
  existingRecs: Recommendation[]
): Promise<Recommendation[]> => {
  console.log("=== AI Enhanced Recommendations ===");
  console.log("OpenAI Key available:", !!OPENAI_API_KEY);

  if (!OPENAI_API_KEY) {
    console.log("No OpenAI key, using fallback");
    return generateFallbackRecommendations(preferences);
  }

  const prompt = generateRecommendationPrompt(preferences);

  try {
    console.log("Trying OpenAI API...");
    const result = await callOpenAIAPI(prompt);
    if (result && result.length > 0) {
      console.log("✅ Success with OpenAI");
      return result;
    }
  } catch (error) {
    console.log("❌ OpenAI failed:", error);
  }

  // Final fallback
  console.log("All AI providers failed, using fallback recommendations");
  return generateFallbackRecommendations(preferences);
};

// OpenAI API call with proper error handling
const callOpenAIAPI = async (prompt: string): Promise<Recommendation[]> => {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not found");
  }

  console.log("Making OpenAI API call...");

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: getOpenAIHeaders(),
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a travel expert. Respond with valid JSON only.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    console.log("OpenAI Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("OpenAI Error Details:", errorText);
      throw new Error(
        `OpenAI API error: ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    console.log("OpenAI Response Content:", content?.substring(0, 200) + "...");

    return parseAIResponse(content);
  } catch (error) {
    console.error("OpenAI API call failed:", error);
    throw error;
  }
};

// Helper function to parse AI responses
const parseAIResponse = (content: string): Recommendation[] => {
  try {
    if (!content) return [];

    console.log("Parsing AI response...");

    // Try to extract JSON from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const recommendations = JSON.parse(jsonMatch[0]);
      return recommendations.map((rec: any, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        name: rec.name || "Unknown Location",
        type: rec.type || "General",
        image: "/placeholder.svg",
        rating: rec.estimatedRating || rec.rating || 4.0,
        address: rec.address || "Address not specified",
        description: rec.description || "No description available",
        tags: rec.tags || [rec.type || "General"],
        price: "$$",
      }));
    }
  } catch (error) {
    console.error("Error parsing AI response:", error);
  }
  return [];
};

// Fallback recommendations
const generateFallbackRecommendations = (
  preferences: UserPreferences
): Recommendation[] => {
  console.log(
    "Generating fallback recommendations for:",
    preferences.destination
  );

  const fallbacks: Recommendation[] = [
    {
      id: "fallback-1",
      name: `${preferences.destination} City Center`,
      type: "Attraction",
      image: "/placeholder.svg",
      rating: 4.2,
      address: `Downtown ${preferences.destination}`,
      description:
        "Historic city center with local attractions and dining options.",
      tags: ["Historic", "Walking", "Cultural"],
      price:
        preferences.budget === "low"
          ? "$"
          : preferences.budget === "high"
          ? "$$$"
          : "$$",
    },
    {
      id: "fallback-2",
      name: `Local Food Market`,
      type: "Food & Dining",
      image: "/placeholder.svg",
      rating: 4.5,
      address: `Central Market, ${preferences.destination}`,
      description:
        "Traditional local market with authentic cuisine and fresh ingredients.",
      tags: ["Food", "Local", "Authentic"],
      price:
        preferences.budget === "low"
          ? "$"
          : preferences.budget === "high"
          ? "$$$"
          : "$$",
    },
    {
      id: "fallback-3",
      name: `${preferences.destination} Museum`,
      type: "Cultural",
      image: "/placeholder.svg",
      rating: 4.3,
      address: `Museum District, ${preferences.destination}`,
      description:
        "Learn about local history and culture at this popular museum.",
      tags: ["Culture", "Educational", "Indoor"],
      price:
        preferences.budget === "low"
          ? "$"
          : preferences.budget === "high"
          ? "$$$"
          : "$$",
    },
  ];

  return fallbacks.slice(0, Math.max(2, preferences.numberOfDays));
};

// Main getRecommendations function
export const getRecommendations = async (
  preferences: UserPreferences
): Promise<Recommendation[]> => {
  console.log("=== Getting Recommendations ===");
  console.log("Preferences:", preferences);

  // Validate destination
  if (!preferences.destination || preferences.destination.trim() === "") {
    console.error("Empty destination provided");
    return generateFallbackRecommendations(preferences);
  }

  try {
    // Check if we have a valid Qloo API key
    if (!QLOO_API_KEY) {
      console.warn("No Qloo API key found, falling back to AI recommendations");
      return await getAIEnhancedRecommendations(preferences, []);
    }

    // Map user interests to Qloo categories
    const categories = mapInterestsToQlooCategories(preferences.interests);

    // Prepare Qloo API request - ENSURE DESTINATION IS NOT EMPTY
    const qlooRequestBody = {
      input: {
        geo_location: preferences.destination.trim(), // Make sure this is not empty
        category:
          categories.length > 0
            ? categories
            : ["restaurants", "attractions", "entertainment"],
        limit: preferences.numberOfDays * 3,
      },
      filters: {
        budget_range:
          preferences.budget === "low"
            ? "1-2"
            : preferences.budget === "high"
            ? "4-5"
            : "2-4",
      },
    };

    console.log("Qloo Request:", JSON.stringify(qlooRequestBody, null, 2));

    // Call Qloo API for recommendations
    const qlooResponse = await fetch(`${QLOO_API_BASE}/recommend`, {
      method: "POST",
      headers: getQlooHeaders(),
      body: JSON.stringify(qlooRequestBody),
    });

    console.log("Qloo Response Status:", qlooResponse.status);

    if (!qlooResponse.ok) {
      const errorText = await qlooResponse.text();
      console.error("Qloo API Error Details:", errorText);
      console.warn("Qloo API failed, falling back to AI recommendations");
      return await getAIEnhancedRecommendations(preferences, []);
    }

    const qlooData = await qlooResponse.json();
    console.log("Qloo Response Data:", qlooData);

    // Transform Qloo data to our format
    const recommendations: Recommendation[] =
      qlooData.results?.map((item: any, index: number) => ({
        id: item.id || index.toString(),
        name: item.name || "Unknown Location",
        type: item.category || "General",
        image: item.image_url || item.photos?.[0]?.url || "/placeholder.svg",
        rating: item.rating || item.score || 4.0,
        address: item.location?.address || `${preferences.destination}`,
        description:
          item.description || item.summary || "Great local spot to visit",
        tags: item.tags || item.categories || [item.category || "General"],
        price:
          item.price_range ||
          (preferences.budget === "low"
            ? "$"
            : preferences.budget === "high"
            ? "$$$"
            : "$$"),
        latitude: item.location?.latitude,
        longitude: item.location?.longitude,
      })) || [];

    // If Qloo returns insufficient data, enhance with AI recommendations
    if (recommendations.length < preferences.numberOfDays * 2) {
      const aiRecommendations = await getAIEnhancedRecommendations(
        preferences,
        recommendations
      );
      return [...recommendations, ...aiRecommendations];
    }

    return recommendations;
  } catch (error) {
    console.error("Error fetching from Qloo API:", error);
    return await getAIEnhancedRecommendations(preferences, []);
  }
};

// Additional functions
export const createItinerary = async (
  preferences: UserPreferences,
  selectedSpots: Recommendation[]
): Promise<Itinerary> => {
  return {
    id: Date.now().toString(),
    destination: preferences.destination,
    totalDays: preferences.numberOfDays,
    preferences,
    spots: selectedSpots,
    createdAt: new Date().toISOString(),
  };
};

export const saveItinerary = async (itinerary: Itinerary): Promise<boolean> => {
  try {
    localStorage.setItem(
      `itinerary-${itinerary.id}`,
      JSON.stringify(itinerary)
    );
    return true;
  } catch (error) {
    console.error("Error saving itinerary:", error);
    return false;
  }
};

export const shareItinerary = async (
  itineraryId: string,
  email: string
): Promise<boolean> => {
  try {
    console.log(`Sharing itinerary ${itineraryId} with ${email}`);
    return true;
  } catch (error) {
    console.error("Error sharing itinerary:", error);
    return false;
  }
};

export const getTravelTips = async (destination: string): Promise<string[]> => {
  return [
    "Research local customs and etiquette before your trip",
    "Download offline maps and translation apps",
    "Notify your bank about travel plans to avoid card issues",
    "Pack light and bring versatile clothing",
    "Keep copies of important documents in separate places",
    "Learn basic phrases in the local language",
  ];
};
