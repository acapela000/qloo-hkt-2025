// API Configuration
const QLOO_API_BASE = "https://hackathon.api.qloo.com";

// Types
export interface UserPreferences {
  destination: string;
  preferences: string;
  selectedCategories: string[];
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
    preferences: string = "",
    options: { limit?: number; page?: number; categories?: string[] } = {}
  ): Promise<Recommendation[]> {
    try {
      console.log("🔍 Getting recommendations from Qloo API...");
      console.log("Input params:", { destination, preferences, options });

      // Build a comprehensive search query
      let searchQuery = destination;

      // Add preferences to the query
      if (preferences.trim()) {
        searchQuery += ` ${preferences}`;
      }

      // Add categories to the query for better results
      if (options.categories && options.categories.length > 0) {
        const categoryTerms = options.categories
          .map((cat) => {
            // Map categories to better search terms
            const categoryMap: Record<string, string> = {
              restaurants: "restaurants dining food",
              attractions: "attractions sightseeing landmarks",
              hotels: "hotels accommodation lodging",
              entertainment: "entertainment shows events",
              shopping: "shopping retail markets",
              museums: "museums galleries cultural",
              parks: "parks nature outdoor",
              nightlife: "nightlife bars clubs",
              cafes: "cafes coffee shops",
              activities: "activities experiences tours",
            };
            return categoryMap[cat] || cat;
          })
          .join(" ");

        searchQuery += ` ${categoryTerms}`;
      }

      console.log("Final search query for Qloo:", searchQuery);

      const limit = options.limit || 20;
      const encodedQuery = encodeURIComponent(searchQuery);
      const url = `${QLOO_API_BASE}/search?query=${encodedQuery}&limit=${limit}`;

      console.log("Qloo API URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-API-Key": QLOO_API_KEY!,
          Accept: "application/json",
        },
      });

      console.log("Qloo API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Qloo API error response:", errorText);
        throw new Error(`Qloo API error: ${response.status} - ${errorText}`);
      }

      const qlooData = await response.json();
      console.log("Raw Qloo response:", qlooData);

      // Transform the data
      const recommendations = this.transformQlooSearchData(qlooData, {
        destination,
        preferences,
        selectedCategories: options.categories || [],
      });

      console.log(`✅ Transformed ${recommendations.length} recommendations`);
      return recommendations;
    } catch (error) {
      console.error("❌ Error in getRecommendations:", error);

      // Return fallback recommendations
      console.log("🔄 Generating fallback recommendations...");
      return this.generateFallbackRecommendations({
        destination,
        preferences,
        selectedCategories: options.categories || [],
      });
    }
  }

  private generateFallbackRecommendations(
    preferences: UserPreferences
  ): Recommendation[] {
    console.log("Generating fallback recommendations for:", preferences);

    const { destination, selectedCategories } = preferences;

    // Enhanced fallback data with better coverage
    const fallbackData: Array<{
      name: string;
      type: string;
      description: string;
      category: string;
    }> = [
      // Restaurants & Food
      {
        name: `Traditional ${destination} Restaurant`,
        type: "restaurant",
        description: "Authentic local cuisine and specialties",
        category: "restaurants",
      },
      {
        name: `${destination} Food Market`,
        type: "restaurant",
        description: "Traditional food market with local vendors",
        category: "food",
      },
      {
        name: `${destination} Street Food District`,
        type: "restaurant",
        description: "Popular street food area",
        category: "food",
      },

      // History & Culture
      {
        name: `${destination} Historical Museum`,
        type: "museum",
        description: "Local history and cultural artifacts",
        category: "history",
      },
      {
        name: `${destination} Cultural Center`,
        type: "museum",
        description: "Traditional arts and cultural exhibitions",
        category: "culture",
      },
      {
        name: `Historic Quarter of ${destination}`,
        type: "attraction",
        description: "Well-preserved historical district",
        category: "history",
      },
      {
        name: `${destination} Art Gallery`,
        type: "museum",
        description: "Local and contemporary art collections",
        category: "culture",
      },

      // Attractions
      {
        name: `${destination} Historic Center`,
        type: "attraction",
        description: "Historic city center with landmarks",
        category: "attractions",
      },
      {
        name: `${destination} Landmark`,
        type: "attraction",
        description: "Iconic city landmark",
        category: "attractions",
      },

      // Hotels
      {
        name: `Heritage Hotel ${destination}`,
        type: "hotel",
        description: "Historic luxury accommodation",
        category: "hotels",
      },

      // Entertainment
      {
        name: `${destination} Cultural Theater`,
        type: "entertainment",
        description: "Traditional performances and shows",
        category: "entertainment",
      },

      // Shopping
      {
        name: `${destination} Artisan Market`,
        type: "shopping",
        description: "Local crafts and artisan products",
        category: "shopping",
      },

      // Museums
      {
        name: `${destination} National Museum`,
        type: "museum",
        description: "National history and culture museum",
        category: "museums",
      },

      // Parks
      {
        name: `${destination} Heritage Park`,
        type: "park",
        description: "Historic park with cultural significance",
        category: "parks",
      },

      // Nightlife
      {
        name: `${destination} Cultural District`,
        type: "entertainment",
        description: "Evening cultural activities and venues",
        category: "nightlife",
      },

      // Cafes
      {
        name: `Traditional ${destination} Cafe`,
        type: "cafe",
        description: "Historic coffee house with local atmosphere",
        category: "cafes",
      },

      // Activities
      {
        name: `${destination} Cultural Tour`,
        type: "activity",
        description: "Guided historical and cultural tour",
        category: "activities",
      },
    ];

    // Filter based on selected categories, or show all if none selected
    const filteredData =
      selectedCategories.length > 0
        ? fallbackData.filter((item) =>
            selectedCategories.includes(item.category)
          )
        : fallbackData;

    return filteredData.slice(0, 12).map((item, index) => ({
      id: `fallback-${Date.now()}-${index}`,
      name: item.name,
      type: item.type,
      image:
        "https://via.placeholder.com/300x200/e2e8f0/64748b?text=Travel+Spot",
      rating: 4.0 + Math.random(),
      address: `${destination}`,
      description: item.description,
      tags: [item.category, destination.toLowerCase(), "local"],
    }));
  }

  private transformQlooSearchData(
    qlooData: any,
    preferences: UserPreferences
  ): Recommendation[] {
    console.log("=== Transform Qloo Data Debug ===");
    console.log("Input data structure:", {
      hasResults: !!qlooData?.results,
      resultsIsArray: Array.isArray(qlooData?.results),
      resultCount: qlooData?.results?.length || 0,
    });

    if (!qlooData?.results || !Array.isArray(qlooData.results)) {
      console.error("❌ Invalid results structure");
      return [];
    }

    if (qlooData.results.length === 0) {
      console.log("❌ Empty results array");
      return [];
    }

    console.log("✅ Processing", qlooData.results.length, "results");

    const recommendations: Recommendation[] = [];

    for (let i = 0; i < qlooData.results.length; i++) {
      const item = qlooData.results[i];
      console.log(
        `\n=== Processing item ${i + 1}/${qlooData.results.length} ===`
      );
      console.log("Item:", JSON.stringify(item, null, 2));

      try {
        // Extract basic data with extensive logging
        const name = item.name || `Location ${i + 1}`;
        console.log("✅ Name:", name);

        const description =
          item.properties?.description ||
          `Visit ${name} in ${preferences.destination}`;
        console.log("✅ Description:", description);

        const image =
          item.properties?.image?.url ||
          "https://via.placeholder.com/300x200/e2e8f0/64748b?text=Travel+Spot";
        console.log("✅ Image:", image);

        const rating =
          item.properties?.business_rating ||
          (item.popularity ? Number((item.popularity * 5).toFixed(1)) : 4.0);
        console.log("✅ Rating:", rating);

        const address =
          item.properties?.address ||
          item.properties?.geocode?.city ||
          preferences.destination;
        console.log("✅ Address:", address);

        const coordinates = item.location
          ? {
              lat: item.location.lat || 0,
              lng: item.location.lon || item.location.lng || 0,
            }
          : undefined;
        console.log("✅ Coordinates:", coordinates);

        // Simple type mapping
        const primaryType = item.types?.[0] || "attraction";
        const type = primaryType.includes("place")
          ? "restaurant"
          : "attraction";
        console.log("✅ Type:", type, "from", primaryType);

        // Simple tags
        const tags = [preferences.destination.toLowerCase(), type, "qloo"];
        console.log("✅ Tags:", tags);

        const recommendation: Recommendation = {
          id: item.entity_id || `qloo-${Date.now()}-${i}`,
          name,
          type,
          image,
          rating,
          address,
          description,
          tags,
          coordinates,
          qlooScore: item.popularity,
        };

        console.log("✅ Created recommendation:", recommendation);
        recommendations.push(recommendation);
      } catch (itemError) {
        console.error(`❌ Error processing item ${i}:`, itemError);
        console.log("Problematic item:", item);
      }
    }

    console.log(`\n=== Transform Complete ===`);
    console.log("Successfully transformed:", recommendations.length, "items");
    console.log("Sample result:", recommendations[0]);

    return recommendations;
  }

  async tryQlooSearch(
    query: string,
    preferences: UserPreferences
  ): Promise<Recommendation[]> {
    console.log("=== Try Qloo Search via API Route ===");
    console.log("Query:", query);

    try {
      const response = await fetch(this.apiRoute, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          limit: 0,
        }),
      });

      console.log("📥 API Route Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ API Route Error:", errorData);
        return [];
      }

      const data = await response.json();
      console.log("📊 API Route Response data:", JSON.stringify(data, null, 2));

      if (
        data &&
        data.results &&
        Array.isArray(data.results) &&
        data.results.length > 0
      ) {
        console.log("✅ Found real API data:", data.results.length, "results");
        console.log("🔍 First result sample:", data.results[0]);

        const transformed = this.transformQlooSearchData(data, preferences);
        console.log(
          "✅ Transformed data:",
          transformed.length,
          "recommendations"
        );
        console.log("🔍 First transformed result:", transformed[0]);

        // **KEY FIX**: Return transformed data even if empty, don't fall back here
        return transformed;
      } else {
        console.log("❌ No valid results in response");
        console.log("Response structure:", Object.keys(data || {}));
        return [];
      }
    } catch (error) {
      console.error("❌ Network/Fetch Error:", error);
      return [];
    }
  }

  async getEnhancedRecommendations(
    preferences: UserPreferences
  ): Promise<Recommendation[]> {
    console.log("=== Getting Enhanced Recommendations ===");
    console.log("Preferences:", preferences);

    if (!preferences.destination?.trim()) {
      console.error("Empty destination provided");
      return this.generateFallbackRecommendations(preferences);
    }

    const destination = preferences.destination.trim();
    console.log("🎯 Destination:", destination);

    // **SIMPLIFIED STRATEGY**: Try fewer, more targeted searches first
    const searchStrategies = [
      // Strategy 1: Simple category-based searches
      `restaurants ${destination}`,
      `hotels ${destination}`,
      `attractions ${destination}`,
      `museums ${destination}`,

      // Strategy 2: Try with selected categories
      ...preferences.selectedCategories.map(
        (category) => `${category} ${destination}`
      ),

      // Strategy 3: Simple destination search as fallback
      destination,
    ];

    console.log("🎯 Total search strategies:", searchStrategies.length);

    // Try each search strategy
    for (const [index, query] of searchStrategies.entries()) {
      if (!query || query.trim() === "") continue;

      console.log(`🎯 Strategy ${index + 1}: "${query}"`);
      const results = await this.tryQlooSearch(query, preferences);

      console.log(
        `📊 Strategy ${index + 1} returned ${results.length} results`
      );

      if (results.length > 0) {
        // **REMOVE FILTERING FOR NOW** - Let's see all results first
        console.log(
          `✅ Returning ${results.length} results from strategy ${index + 1}`
        );
        return results.slice(0, 12);
      }
    }

    console.warn("❌ All Qloo API strategies returned empty, using fallback");
    return this.generateFallbackRecommendations(preferences);
  }
}

// Create a singleton instance
const qlooService = new QlooApiService();

// Export the singleton instance as default
export default qlooService;

// Also export the class for direct instantiation if needed

// Update the mapInterestsToQlooCategories function
const mapInterestsToQlooCategories = (interests: string[]): string[] => {
  const categoryMap: { [key: string]: string[] } = {
    restaurants: ["restaurant", "dining", "food"],
    food: ["restaurant", "dining", "cuisine", "culinary", "food"],
    hotels: ["hotel", "accommodation", "lodging"],
    attractions: ["attraction", "landmark", "sightseeing"],
    museums: ["museum", "gallery", "cultural"],
    parks: ["park", "nature", "outdoor"],
    entertainment: ["entertainment", "shows", "nightlife"],
    shopping: ["shopping", "retail", "market"],
    cafes: ["cafe", "coffee"],
    history: [
      "museum",
      "cultural",
      "heritage",
      "historical",
      "historic",
      "monument",
    ],
    culture: [
      "cultural",
      "museum",
      "art",
      "heritage",
      "gallery",
      "traditional",
    ],
    nightlife: ["bar", "nightclub", "entertainment"],
    adventure: ["outdoor", "activity", "adventure"],
    photography: ["scenic", "landmark", "attraction"],
    relaxation: ["spa", "wellness", "peaceful"],
  };

  const categories = new Set<string>();
  interests.forEach((interest) => {
    const mapped = categoryMap[interest.toLowerCase()];
    if (mapped) {
      mapped.forEach((cat) => categories.add(cat));
    } else {
      categories.add(interest.toLowerCase());
    }
  });

  return Array.from(categories);
};

// Update the mapInterestsToQlooEntityTypes function
const mapInterestsToQlooEntityTypes = (interests: string[]): string[] => {
  const entityTypeMap: { [key: string]: string[] } = {
    restaurants: ["restaurant", "bar", "cafe"],
    food: ["restaurant", "bar", "cafe"],
    hotels: ["hotel", "resort"],
    attractions: ["attraction", "landmark"],
    museums: ["museum", "gallery"],
    parks: ["park", "recreation"],
    entertainment: ["entertainment", "venue"],
    shopping: ["shopping", "retail"],
    cafes: ["cafe", "coffee_shop"],
    history: ["museum", "monument", "historic_site"],
    culture: ["museum", "cultural_center", "gallery"],
    nightlife: ["bar", "nightclub"],
    adventure: ["attraction", "outdoor"],
    photography: ["attraction", "landmark"],
    relaxation: ["hotel", "spa"],
  };

  const entityTypes = new Set<string>();
  interests.forEach((interest) => {
    const mapped = entityTypeMap[interest.toLowerCase()];
    if (mapped) {
      mapped.forEach((type) => entityTypes.add(type));
    } else {
      entityTypes.add(interest.toLowerCase());
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

// Update standalone functions to use the singleton instance
export const testQlooInsightsAPI = async (): Promise<boolean> => {
  return qlooService.testQlooInsightsAPI();
};

export const getRecommendations = async (
  preferences: UserPreferences
): Promise<Recommendation[]> => {
  return qlooService.getEnhancedRecommendations(preferences);
};

// Keep the other utility functions as they are
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
