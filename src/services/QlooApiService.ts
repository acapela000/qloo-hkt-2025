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
  address?: string; // Changed from 'location' to 'address' to match usage
  description?: string;
  tags: string[]; // Made required since it's used in filtering
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
const QLOO_API_BASE = "https://api.qloo.com/v2";
const QLOO_API_KEY = process.env.QLOO_API_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

// Qloo API Headers
const getQlooHeaders = () => ({
  Authorization: `Bearer ${QLOO_API_KEY}`,
  "Content-Type": "application/json",
});

// OpenAI API Headers
const getOpenAIHeaders = () => ({
  Authorization: `Bearer ${OPENAI_API_KEY}`,
  "Content-Type": "application/json",
});

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

Please provide detailed recommendations including:
1. Must-visit attractions
2. Local cuisine recommendations
3. Hidden gems
4. Activity timing suggestions
5. Budget-specific tips
6. Cultural insights

Format your response as practical travel advice.`;
};

// Get recommendations from Qloo API
export const getRecommendations = async (
  preferences: UserPreferences
): Promise<Recommendation[]> => {
  try {
    // Map user interests to Qloo categories
    const categories = mapInterestsToQlooCategories(preferences.interests);

    // Prepare Qloo API request
    const qlooRequestBody = {
      input: {
        geo_location: preferences.destination,
        category:
          categories.length > 0
            ? categories
            : ["restaurants", "attractions", "entertainment"],
        limit: preferences.numberOfDays * 3, // 3 recommendations per day
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

    // Call Qloo API for recommendations
    const qlooResponse = await fetch(`${QLOO_API_BASE}/recommend`, {
      method: "POST",
      headers: getQlooHeaders(),
      body: JSON.stringify(qlooRequestBody),
    });

    if (!qlooResponse.ok) {
      throw new Error(`Qloo API error: ${qlooResponse.statusText}`);
    }

    const qlooData = await qlooResponse.json();

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

    // Fallback to AI-generated recommendations
    return await getAIEnhancedRecommendations(preferences, []);
  }
};

// Get AI-enhanced recommendations using OpenAI
const getAIEnhancedRecommendations = async (
  preferences: UserPreferences,
  existingRecs: Recommendation[]
): Promise<Recommendation[]> => {
  try {
    const prompt = `${generateRecommendationPrompt(preferences)}

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

Avoid duplicating these existing recommendations: ${existingRecs
      .map((r) => r.name)
      .join(", ")}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: getOpenAIHeaders(),
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a knowledgeable travel expert. Provide accurate, helpful travel recommendations in the requested JSON format.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiContent = data.choices[0]?.message?.content;

    if (aiContent) {
      try {
        // Extract JSON from the response
        const jsonMatch = aiContent.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const aiRecommendations = JSON.parse(jsonMatch[0]);

          return aiRecommendations.map((rec: any, index: number) => ({
            id: `ai-${Date.now()}-${index}`,
            name: rec.name,
            type: rec.type,
            image: "/placeholder.svg",
            rating: rec.estimatedRating || 4.0,
            address: rec.address,
            description: rec.description,
            tags: rec.tags || [rec.type],
            price:
              preferences.budget === "low"
                ? "$"
                : preferences.budget === "high"
                ? "$$$"
                : "$$",
          }));
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
      }
    }

    // Fallback recommendations
    return generateFallbackRecommendations(preferences);
  } catch (error) {
    console.error("Error getting AI recommendations:", error);
    return generateFallbackRecommendations(preferences);
  }
};

// Fallback recommendations in case of API failures
const generateFallbackRecommendations = (
  preferences: UserPreferences
): Recommendation[] => {
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
  ];

  return fallbacks.slice(0, preferences.numberOfDays);
};

// Create itinerary with AI assistance
export const createItinerary = async (
  preferences: UserPreferences,
  selectedSpots: Recommendation[]
): Promise<Itinerary> => {
  try {
    // Use AI to optimize itinerary timing and order
    const optimizedSpots = await optimizeItineraryWithAI(
      preferences,
      selectedSpots
    );

    return {
      id: Date.now().toString(),
      destination: preferences.destination,
      totalDays: preferences.numberOfDays,
      preferences,
      spots: optimizedSpots,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error creating itinerary:", error);

    // Return basic itinerary without AI optimization
    return {
      id: Date.now().toString(),
      destination: preferences.destination,
      totalDays: preferences.numberOfDays,
      preferences,
      spots: selectedSpots,
      createdAt: new Date().toISOString(),
    };
  }
};

// AI-powered itinerary optimization
const optimizeItineraryWithAI = async (
  preferences: UserPreferences,
  spots: Recommendation[]
): Promise<Recommendation[]> => {
  try {
    const prompt = `Optimize this travel itinerary for ${
      preferences.destination
    }:
    
Trip Details:
- Duration: ${preferences.numberOfDays} days
- Budget: ${preferences.budget}
- Travel Style: ${preferences.travelStyle}
- Interests: ${preferences.interests.join(", ")}

Selected Spots:
${spots
  .map((spot, i) => `${i + 1}. ${spot.name} (${spot.type}) - ${spot.address}`)
  .join("\n")}

Please provide:
1. Optimal daily groupings based on location proximity
2. Suggested timing for each activity
3. Travel tips between locations
4. Best order to visit for efficiency

Return the spots in optimized order with any additional insights.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: getOpenAIHeaders(),
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a travel optimization expert. Provide practical itinerary improvements.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 1000,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const optimization = data.choices[0]?.message?.content;

      // For now, return original spots with AI insights added to descriptions
      return spots.map((spot) => ({
        ...spot,
        description: `${spot.description} [AI Optimized]`,
      }));
    }
  } catch (error) {
    console.error("Error optimizing itinerary:", error);
  }

  return spots;
};

// Save itinerary (you might want to implement actual backend storage)
export const saveItinerary = async (itinerary: Itinerary): Promise<boolean> => {
  try {
    // Implement actual save logic here (database, cloud storage, etc.)
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

// Share itinerary functionality
export const shareItinerary = async (
  itineraryId: string,
  email: string
): Promise<boolean> => {
  try {
    // Implement actual sharing logic (email service, etc.)
    console.log(`Sharing itinerary ${itineraryId} with ${email}`);

    // You could integrate with email services like SendGrid, Resend, etc.
    const shareData = {
      itineraryId,
      email,
      sharedAt: new Date().toISOString(),
    };

    // For now, just log the sharing attempt
    localStorage.setItem(`share-${Date.now()}`, JSON.stringify(shareData));

    return true;
  } catch (error) {
    console.error("Error sharing itinerary:", error);
    return false;
  }
};

// Get travel tips using AI
export const getTravelTips = async (destination: string): Promise<string[]> => {
  try {
    const prompt = `Provide 6 essential travel tips for visiting ${destination}. Include practical advice about:
    1. Transportation
    2. Local customs
    3. Safety
    4. Money/payments
    5. Communication
    6. Hidden gems

    Format as a simple list of tips.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: getOpenAIHeaders(),
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a knowledgeable travel expert. Provide practical, actionable travel advice.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (content) {
        // Split response into individual tips
        return content
          .split("\n")
          .filter((tip: string) => tip.trim().length > 0);
      }
    }
  } catch (error) {
    console.error("Error getting travel tips:", error);
  }

  // Fallback tips
  return [
    "Research local customs and etiquette before your trip",
    "Download offline maps and translation apps",
    "Notify your bank about travel plans to avoid card issues",
    "Pack light and bring versatile clothing",
    "Keep copies of important documents in separate places",
    "Learn basic phrases in the local language",
  ];
};
