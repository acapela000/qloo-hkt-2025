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
  description?: string;
  image?: string;
  rating?: number;
  address?: string;
  tags?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  qlooScore?: number;
  culturalRelevance?: number;
  tasteProfile?: string[];
  qlooExplanation?: string;
}

export interface QlooInsight {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  score?: number;
  explanation?: string;
  metadata?: {
    type?: string;
    category?: string;
    location?: {
      address?: string;
      city?: string;
      country?: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
    rating?: number;
    tags?: string[];
    images?: string[];
  };
}

export class QlooApiService {
  private apiRoute = "/api/qloo";

  async getRecommendations(
    destination: string,
    preferences?: string,
    options?: {
      limit?: number;
      page?: number;
      type?: string;
    }
  ): Promise<Recommendation[]> {
    try {
      console.log("Making request to Qloo API via server route...");

      const response = await fetch(this.apiRoute, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination,
          preferences,
          options,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `API request failed: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Raw Qloo API response:", data);

      return this.transformQlooInsights(data);
    } catch (error) {
      console.error("QlooApiService Error:", error);
      throw error;
    }
  }

  private transformQlooInsights(data: any): Recommendation[] {
    // Handle different possible response structures from Qloo
    let insights: QlooInsight[] = [];

    if (data.insights) {
      insights = data.insights;
    } else if (data.results) {
      insights = data.results;
    } else if (data.recommendations) {
      insights = data.recommendations;
    } else if (Array.isArray(data)) {
      insights = data;
    } else {
      console.warn("Unexpected Qloo API response structure:", data);
      return [];
    }

    console.log("Processing", insights.length, "insights from Qloo");

    return insights.map((insight: QlooInsight, index: number) => {
      const recommendation: Recommendation = {
        id: insight.id || `qloo-insight-${index}`,
        name: insight.name || insight.title || `Recommendation ${index + 1}`,
        type: this.mapQlooType(
          insight.metadata?.type || insight.metadata?.category
        ),
        description:
          insight.description ||
          insight.explanation ||
          "Recommended by Qloo AI",
        image: this.extractBestImage(insight),
        rating: insight.metadata?.rating || insight.score || undefined,
        address: this.formatLocationInfo(insight.metadata?.location),
        tags: this.extractTags(insight), // This method needs to be fixed too
        coordinates: insight.metadata?.location?.coordinates || {
          lat: 0,
          lng: 0,
        },
        qlooScore: insight.score,
        qlooExplanation: insight.explanation,
        tasteProfile: insight.metadata?.tags || [],
      };

      console.log("Transformed recommendation:", recommendation);
      return recommendation;
    });
  }

  private mapQlooType(type?: string): string {
    if (!type) return "attraction";

    const typeMap: Record<string, string> = {
      restaurant: "restaurant",
      dining: "restaurant",
      food: "restaurant",
      hotel: "hotel",
      lodging: "hotel",
      accommodation: "hotel",
      attraction: "attraction",
      landmark: "attraction",
      museum: "museum",
      gallery: "museum",
      art: "museum",
      entertainment: "entertainment",
      nightlife: "entertainment",
      music: "entertainment",
      shopping: "shopping",
      retail: "shopping",
      park: "park",
      nature: "park",
      outdoor: "park",
      activity: "activity",
      experience: "activity",
      tour: "activity",
    };

    const lowerType = type.toLowerCase();
    return typeMap[lowerType] || "attraction";
  }

  private extractBestImage(insight: QlooInsight): string {
    // Try to get image from metadata
    if (insight.metadata?.images && insight.metadata.images.length > 0) {
      return insight.metadata.images[0];
    }

    // Fallback to generated image based on name and type
    const name = insight.name || insight.title || "place";
    const type =
      insight.metadata?.type || insight.metadata?.category || "travel";
    return `https://source.unsplash.com/400x250/?${encodeURIComponent(
      name
    )},${encodeURIComponent(type)}`;
  }

  private formatLocationInfo(location?: any): string {
    if (!location) return "Location not specified";

    if (location.address) return location.address;

    const parts = [
      location.city,
      location.state || location.region,
      location.country,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(", ") : "Location not specified";
  }

  private extractTags(insight: QlooInsight): string[] {
    const tags = new Set<string>();

    // Add tags from metadata - ensure they are strings
    if (insight.metadata?.tags && Array.isArray(insight.metadata.tags)) {
      insight.metadata.tags.forEach((tag) => {
        if (typeof tag === "string") {
          tags.add(tag);
        } else if (tag && typeof tag === "object" && tag.name) {
          tags.add(tag.name);
        } else if (tag && typeof tag === "object" && tag.value) {
          tags.add(tag.value);
        }
      });
    }

    // Add type/category as tags - ensure they are strings
    if (insight.metadata?.type && typeof insight.metadata.type === "string") {
      tags.add(insight.metadata.type);
    }
    if (
      insight.metadata?.category &&
      typeof insight.metadata.category === "string"
    ) {
      tags.add(insight.metadata.category);
    }

    // Return only valid string tags
    return Array.from(tags)
      .filter((tag) => typeof tag === "string" && tag.trim().length > 0)
      .slice(0, 6);
  }

  // Cultural recommendations using Qloo's taste analysis
  async getCulturalRecommendations(
    destination: string,
    culturalContext: string,
    userTasteProfile?: string[]
  ): Promise<Recommendation[]> {
    try {
      const response = await fetch("/api/qloo/cultural", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination,
          culturalContext,
          userTasteProfile,
        }),
      });

      if (!response.ok) {
        throw new Error("Cultural recommendations failed");
      }

      const data = await response.json();
      return this.transformQlooInsights(data);
    } catch (error) {
      console.error("Cultural recommendations error:", error);
      // Fallback to regular recommendations
      return this.getRecommendations(destination, culturalContext);
    }
  }
}

export default QlooApiService;

// API Configuration
const QLOO_API_BASE = "https://hackathon.api.qloo.com";
const QLOO_API_KEY = process.env.QLOO_API_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

// Debug logging
console.log("=== API Keys Debug ===");
console.log("QLOO_API_KEY present:", !!QLOO_API_KEY);
console.log("QLOO_API_KEY length:", QLOO_API_KEY.length);
console.log("OPENAI_API_KEY present:", !!OPENAI_API_KEY);
console.log("OPENAI_API_KEY length:", OPENAI_API_KEY.length);

// Update the headers to use only X-API-Key
const getQlooHeaders = () => {
  console.log(
    "Using Qloo API Key:",
    QLOO_API_KEY ? `${QLOO_API_KEY.substring(0, 10)}...` : "MISSING"
  );

  return {
    "X-API-Key": QLOO_API_KEY, // Only use X-API-Key as per documentation
    "Content-Type": "application/json",
    Accept: "application/json",
  };
};

// OpenAI API Headers - IMPLEMENT THIS FUNCTION
const getOpenAIHeaders = () => {
  return {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  };
};

// Update the category mapping based on Qloo documentation
const mapInterestsToQlooCategories = (interests: string[]): string[] => {
  const categoryMap: { [key: string]: string[] } = {
    food: ["restaurant", "cafe", "bar"],
    nightlife: ["bar", "nightclub", "entertainment"],
    adventure: ["attraction", "outdoor", "sports"],
    photography: ["landmark", "museum", "attraction"],
    relaxation: ["spa", "park", "wellness"],
    shopping: ["shopping", "retail"],
  };

  const categories = new Set<string>();
  interests.forEach((interest) => {
    if (categoryMap[interest]) {
      categoryMap[interest].forEach((cat) => categories.add(cat));
    }
  });

  return Array.from(categories);
};

// Add this function after mapInterestsToQlooCategories (around line 85)
const mapInterestsToQlooEntityTypes = (interests: string[]): string[] => {
  const entityTypeMap: { [key: string]: string[] } = {
    food: ["restaurant", "bar", "cafe"],
    nightlife: ["bar", "nightclub"],
    adventure: ["attraction", "outdoor"],
    photography: ["attraction", "landmark"],
    relaxation: ["hotel", "spa"],
    shopping: ["shopping", "retail"],
  };

  const entityTypes = new Set<string>();
  interests.forEach((interest) => {
    if (entityTypeMap[interest]) {
      entityTypeMap[interest].forEach((type) => entityTypes.add(type));
    }
  });

  return Array.from(entityTypes);
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

// Update the test function to show more detailed errors
export const testQlooInsightsAPI = async () => {
  try {
    console.log("=== Testing Qloo Search API ===");

    if (!QLOO_API_KEY) {
      console.log("❌ No Qloo API key found");
      return false;
    }

    const testUrl = `${QLOO_API_BASE}/search?query=${encodeURIComponent(
      "restaurants in New York"
    )}&limit=5`;
    console.log("Test URL:", testUrl);

    const response = await fetch(testUrl, {
      method: "GET",
      headers: {
        "X-API-Key": QLOO_API_KEY,
        Accept: "application/json",
      },
    });

    console.log("Response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ API Test Success!");
      console.log("Result count:", data.results?.length || 0);
      console.log("First result:", data.results?.[0]?.name);
      return true;
    } else {
      const errorText = await response.text();
      console.log("❌ API Test Failed:", response.status);
      console.log("Error details:", errorText);
      return false;
    }
  } catch (error) {
    console.error("❌ API Test Error:", error);
    return false;
  }
};

// Enhanced getRecommendations function with multiple fallback strategies
export const getRecommendations = async (
  preferences: UserPreferences
): Promise<Recommendation[]> => {
  console.log("=== Getting Recommendations ===");
  console.log("Preferences:", preferences);

  if (!preferences.destination || preferences.destination.trim() === "") {
    console.error("Empty destination provided");
    return generateFallbackRecommendations(preferences);
  }

  try {
    if (!QLOO_API_KEY) {
      console.warn("No Qloo API key found, falling back to AI recommendations");
      return getAIRecommendations(preferences);
    }

    const destination = preferences.destination.trim();

    // Strategy 1: Try with interests and destination
    console.log("🎯 Strategy 1: Interest-based search");
    const interestTerms = preferences.interests.join(" ");
    const searchQuery = `${interestTerms} places to visit in ${destination}`;

    let result = await tryQlooSearch(searchQuery, preferences);
    if (result.length > 0) {
      console.log("✅ Success with interest-based search");
      return result;
    }

    // Strategy 2: Try with just destination
    console.log("🎯 Strategy 2: Basic destination search");
    const basicQuery = `places to visit in ${destination}`;
    result = await tryQlooSearch(basicQuery, preferences);
    if (result.length > 0) {
      console.log("✅ Success with basic destination search");
      return result;
    }

    // Strategy 3: Try with popular attractions
    console.log("🎯 Strategy 3: Popular attractions search");
    const attractionsQuery = `popular attractions ${destination}`;
    result = await tryQlooSearch(attractionsQuery, preferences);
    if (result.length > 0) {
      console.log("✅ Success with attractions search");
      return result;
    }

    // Strategy 4: Try with restaurants (usually has better coverage)
    console.log("🎯 Strategy 4: Restaurant search");
    const restaurantQuery = `restaurants in ${destination}`;
    result = await tryQlooSearch(restaurantQuery, preferences);
    if (result.length > 0) {
      console.log("✅ Success with restaurant search");
      return result;
    }

    // Strategy 5: Try broader geographic terms
    console.log("🎯 Strategy 5: Broader geographic search");
    const broadQuery = `${destination} travel guide`;
    result = await tryQlooSearch(broadQuery, preferences);
    if (result.length > 0) {
      console.log("✅ Success with broad search");
      return result;
    }

    // Strategy 6: Fall back to AI recommendations
    console.log("🎯 Strategy 6: AI fallback");
    const aiResult = await getAIRecommendations(preferences);
    if (aiResult.length > 0) {
      console.log("✅ Success with AI recommendations");
      return aiResult;
    }

    // Final fallback
    console.warn(
      "All strategies failed, using static fallback recommendations"
    );
    return generateFallbackRecommendations(preferences);
  } catch (error) {
    console.error("Error in getRecommendations:", error);
    // Try AI as backup
    try {
      const aiResult = await getAIRecommendations(preferences);
      if (aiResult.length > 0) return aiResult;
    } catch (aiError) {
      console.error("AI fallback also failed:", aiError);
    }
    return generateFallbackRecommendations(preferences);
  }
};

// Helper function to try Qloo search with different queries
const tryQlooSearch = async (
  query: string,
  preferences: UserPreferences
): Promise<Recommendation[]> => {
  try {
    const searchUrl = `${QLOO_API_BASE}/search?query=${encodeURIComponent(
      query
    )}&limit=10`;
    console.log("Trying Qloo search:", searchUrl);

    const response = await fetch(searchUrl, {
      method: "GET",
      headers: {
        "X-API-Key": QLOO_API_KEY,
        Accept: "application/json",
      },
    });

    console.log(`Qloo Response Status for "${query}":`, response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("Qloo Response Data:", data);

      if (data.results && data.results.length > 0) {
        return transformQlooSearchData(data, preferences);
      } else {
        console.log("No results found for query:", query);
      }
    } else {
      const errorText = await response.text();
      console.error("Qloo API Error for query:", query, errorText);
    }
  } catch (error) {
    console.error("Error in tryQlooSearch:", error);
  }

  return [];
};

// Enhanced AI recommendations function
const getAIRecommendations = async (
  preferences: UserPreferences
): Promise<Recommendation[]> => {
  if (!OPENAI_API_KEY) {
    console.log("No OpenAI key, using static fallback");
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
  console.log("AI failed, using static fallback recommendations");
  return generateFallbackRecommendations(preferences);
};

// Enhanced fallback recommendations with location-specific data
const generateFallbackRecommendations = (
  preferences: UserPreferences
): Recommendation[] => {
  console.log(
    "Generating fallback recommendations for:",
    preferences.destination
  );

  const destination = preferences.destination;

  // More diverse fallback recommendations
  const fallbacks: Recommendation[] = [
    {
      id: `fallback-${Date.now()}-1`,
      name: `${destination} Historic District`,
      type: "Historical Site",
      image:
        "https://via.placeholder.com/300x200/e2e8f0/64748b?text=Historic+District",
      rating: 4.2,
      address: `Historic Area, ${destination}`,
      description: `Explore the rich history and cultural heritage of ${destination}'s historic district.`,
      tags: ["Historic", "Walking", "Cultural", "Architecture"],
    },
    {
      id: `fallback-${Date.now()}-2`,
      name: `Local Cuisine Tour`,
      type: "Food Experience",
      image:
        "https://via.placeholder.com/300x200/e2e8f0/64748b?text=Local+Food",
      rating: 4.5,
      address: `Food District, ${destination}`,
      description: `Taste authentic local flavors and traditional dishes unique to ${destination}.`,
      tags: ["Food", "Local", "Authentic", "Cultural"],
    },
    {
      id: `fallback-${Date.now()}-3`,
      name: `${destination} Art & Culture Center`,
      type: "Museum",
      image:
        "https://via.placeholder.com/300x200/e2e8f0/64748b?text=Art+Museum",
      rating: 4.3,
      address: `Cultural District, ${destination}`,
      description: `Discover local art, culture, and exhibitions showcasing ${destination}'s creative spirit.`,
      tags: ["Culture", "Art", "Educational", "Indoor"],
    },
    {
      id: `fallback-${Date.now()}-4`,
      name: `${destination} City Park`,
      type: "Park",
      image: "https://via.placeholder.com/300x200/e2e8f0/64748b?text=City+Park",
      rating: 4.1,
      address: `Central Park Area, ${destination}`,
      description: `Relax and enjoy nature in this beautiful green space in the heart of ${destination}.`,
      tags: ["Nature", "Relaxation", "Outdoor", "Walking"],
    },
    {
      id: `fallback-${Date.now()}-5`,
      name: `${destination} Shopping District`,
      type: "Shopping",
      image: "https://via.placeholder.com/300x200/e2e8f0/64748b?text=Shopping",
      rating: 4.0,
      address: `Shopping Area, ${destination}`,
      description: `Browse local shops, markets, and boutiques for unique finds and souvenirs.`,
      tags: ["Shopping", "Local", "Souvenirs", "Markets"],
    },
  ];

  return fallbacks.slice(0, Math.max(3, preferences.numberOfDays * 2));
};

// Update the transformQlooSearchData function to handle empty/failed responses better
const transformQlooSearchData = (
  qlooData: any,
  preferences: UserPreferences
): Recommendation[] => {
  if (!qlooData || !qlooData.results || !Array.isArray(qlooData.results)) {
    console.log("No valid results from Qloo search, using fallback");
    return generateFallbackRecommendations(preferences);
  }

  // Safe tag extraction function
  const extractTags = (item: any): string[] => {
    const tags: string[] = [];

    // Handle different tag formats from Qloo API
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach((tag: any) => {
        if (typeof tag === "string") {
          tags.push(tag);
        } else if (tag && typeof tag === "object" && tag.name) {
          tags.push(tag.name);
        } else if (tag && typeof tag === "object" && tag.value) {
          tags.push(tag.value);
        }
      });
    }

    // Add type as a tag if available
    if (item.types && Array.isArray(item.types)) {
      item.types.forEach((type: any) => {
        const cleanType =
          typeof type === "string" ? type.replace("urn:tag:", "") : "";
        if (cleanType) tags.push(cleanType);
      });
    }

    // Remove duplicates and ensure all are strings
    return [
      ...new Set(
        tags.filter((tag) => typeof tag === "string" && tag.trim().length > 0)
      ),
    ];
  };

  const recommendations: Recommendation[] = qlooData.results.map(
    (item: any, index: number) => ({
      id: item.entity_id || `qloo-search-${Date.now()}-${index}`,
      name: item.name || "Unknown Location",
      type: item.types?.[0]?.replace("urn:tag:", "") || "General",
      image:
        item.image_url ||
        "https://via.placeholder.com/300x200/e2e8f0/64748b?text=Travel+Spot",
      rating: item.popularity
        ? parseFloat((item.popularity * 5).toFixed(1))
        : 4.0,
      address: item.location?.address || `${preferences.destination}`,
      description:
        item.summary ||
        `Discover this popular spot in ${preferences.destination}`,
      tags: extractTags(item),
      coordinates: item.location
        ? {
            lat: item.location.lat || 0,
            lng: item.location.lng || 0,
          }
        : undefined,
      qlooScore: item.popularity,
      qlooExplanation: item.explanation,
    })
  );

  console.log(
    `Transformed ${recommendations.length} Qloo search recommendations`
  );

  // Ensure we have at least some recommendations
  if (recommendations.length < 3) {
    const fallback = generateFallbackRecommendations(preferences);
    return [
      ...recommendations,
      ...fallback.slice(0, 3 - recommendations.length),
    ];
  }

  return recommendations.slice(0, 9);
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
