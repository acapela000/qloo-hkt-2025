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
  testQlooInsightsAPI(): boolean | PromiseLike<boolean> {
    throw new Error("Method not implemented.");
  }
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
        numberOfDays: 0,
        budget: "low",
        travelStyle: "solo",
        interests: [],
      });
    }
  }

  private generateFallbackRecommendations(
    preferences: UserPreferences
  ): Recommendation[] {
    console.log("=== Generating Fallback Recommendations ===");

    const destination = preferences.destination || "your destination";
    const categories = preferences.selectedCategories || ["attractions"];

    return categories
      .flatMap((category, categoryIndex) => {
        const categoryConfig = this.getCategoryFallbackData(
          category,
          destination
        );

        return categoryConfig.map((item, index) => ({
          id: `fallback-${categoryIndex}-${index}`,
          name: item.name,
          type: category as any,
          image:
            "https://via.placeholder.com/300x200/e2e8f0/64748b?text=Discover+More",
          rating: 4.2 + Math.random() * 0.6,
          address: `${destination}`,
          description: item.description,
          tags: [destination.toLowerCase(), category, "discover"],
          coordinates: undefined,
          qlooScore: 0.8 + Math.random() * 0.2,
        }));
      })
      .slice(0, 8);
  }

  private getCategoryFallbackData(category: string, destination: string) {
    const fallbackMap: Record<
      string,
      Array<{ name: string; description: string }>
    > = {
      museums: [
        {
          name: `${destination} National Museum`,
          description: `Explore the rich history and culture of ${destination} through fascinating exhibits and artifacts.`,
        },
        {
          name: `${destination} Art Gallery`,
          description: `Discover contemporary and classical artworks from local and international artists.`,
        },
        {
          name: `${destination} Archaeological Museum`,
          description: `Journey through ancient civilizations and archaeological discoveries in ${destination}.`,
        },
      ],
      // Add more categories as needed...
    };

    return (
      fallbackMap[category] || [
        {
          name: `Popular ${category} in ${destination}`,
          description: `Discover amazing ${category} experiences in ${destination}.`,
        },
      ]
    );
  }

  private transformQlooSearchData(
    qlooData: any,
    preferences: UserPreferences
  ): Recommendation[] {
    console.log("=== Transform Qloo Data START ===");

    if (!qlooData?.results || !Array.isArray(qlooData.results)) {
      console.error("❌ Invalid results structure");
      return [];
    }

    console.log("✅ Processing", qlooData.results.length, "results");

    const recommendations: Recommendation[] = [];

    for (let i = 0; i < qlooData.results.length; i++) {
      const item = qlooData.results[i];

      // **FILTER OUT GENERIC CATEGORY RESULTS**
      if (this.isGenericCategoryResult(item)) {
        console.log(`⚠️ Skipping generic category: ${item.name}`);
        continue;
      }

      try {
        const recommendation: Recommendation = {
          id: item.entity_id || `qloo-${Date.now()}-${i}`,
          name: item.name || `Location ${i + 1}`,
          type: this.mapQlooType(item.types?.[0] || "attraction"),
          image:
            item.properties?.image?.url ||
            "https://via.placeholder.com/300x200/e2e8f0/64748b?text=Travel+Spot",
          rating:
            item.properties?.business_rating ||
            (item.popularity ? Number((item.popularity * 5).toFixed(1)) : 4.0),
          address:
            item.properties?.address ||
            item.properties?.geocode?.city ||
            preferences.destination,
          description:
            item.properties?.description ||
            `Visit ${item.name} in ${preferences.destination}`,
          tags: [preferences.destination.toLowerCase(), "qloo"],
          coordinates: item.location
            ? {
                lat: item.location.lat || 0,
                lng: item.location.lon || item.location.lng || 0,
              }
            : undefined,
          qlooScore: item.popularity,
        };

        recommendations.push(recommendation);
        console.log(`✅ Added real place: ${recommendation.name}`);
      } catch (itemError) {
        console.error(`❌ Error processing item ${i}:`, itemError);
      }
    }

    console.log(
      `✅ Transform Complete: ${recommendations.length} real places (filtered out generic categories)`
    );
    return recommendations;
  }

  private isGenericCategoryResult(item: any): boolean {
    // Check if it's a Wikipedia category tag
    if (item.types?.includes("urn:tag:wikipedia_category:wikidata")) {
      return true;
    }

    // Check if it's just a tag without real place properties
    if (
      item.types?.includes("urn:tag") &&
      !item.properties?.address &&
      !item.properties?.geocode
    ) {
      return true;
    }

    // Check for generic category names
    const genericPatterns = [
      /museums? in /i,
      /restaurants? in /i,
      /hotels? in /i,
      /attractions? in /i,
      /galleries? in /i,
      /art museums? and galleries? in /i,
      /history museums? in /i,
      /biographical museums? in /i,
      /religious museums? in /i,
      /museums? of .+ in /i,
    ];

    const name = item.name || "";
    if (genericPatterns.some((pattern) => pattern.test(name))) {
      return true;
    }

    // Check if properties object is empty or missing key location data
    if (!item.properties || Object.keys(item.properties).length === 0) {
      return true;
    }

    return false;
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

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ API Route Error:", errorData);
        return []; // Return empty array, not fallback
      }

      const data = await response.json();

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

        // ✅ CRITICAL: Return the transformed data here
        return transformed;
      } else {
        console.log("❌ No valid results in response");
        return []; // Return empty array, not fallback
      }
    } catch (error) {
      console.error("❌ Network/Fetch Error:", error);
      return []; // Return empty array, not fallback
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
    console.log("🎯 Selected Categories:", preferences.selectedCategories);

    // **IMPROVED CATEGORY-SPECIFIC SEARCH STRATEGIES**
    const searchStrategies: string[] = [];

    // Strategy 1: Build very specific queries for each selected category
    if (
      preferences.selectedCategories &&
      preferences.selectedCategories.length > 0
    ) {
      preferences.selectedCategories.forEach((category) => {
        const categoryQueries = this.getCategorySpecificQueries(
          category,
          destination
        );
        searchStrategies.push(...categoryQueries);
      });
    }

    // Strategy 2: Fallback general searches
    searchStrategies.push(
      `attractions in ${destination}`,
      `places to visit ${destination}`,
      `tourist spots ${destination}`,
      destination
    );

    console.log("🎯 Total search strategies:", searchStrategies.length);
    console.log("🎯 Search strategies:", searchStrategies);

    // Try each search strategy
    for (const [index, query] of searchStrategies.entries()) {
      if (!query || query.trim() === "") continue;

      console.log(`🎯 Strategy ${index + 1}: "${query}"`);
      const results = await this.tryQlooSearch(query, preferences);

      console.log(
        `📊 Strategy ${index + 1} returned ${results.length} results`
      );

      if (results.length > 0) {
        // **FILTER RESULTS BY SELECTED CATEGORIES**
        const filteredResults = this.filterResultsByCategories(
          results,
          preferences.selectedCategories
        );

        if (filteredResults.length > 0) {
          console.log(
            `✅ SUCCESS: Returning ${
              filteredResults.length
            } filtered results from strategy ${index + 1}`
          );
          return filteredResults.slice(0, 12);
        } else {
          console.log(
            `⚠️ Strategy ${
              index + 1
            } returned results but none matched selected categories`
          );
        }
      }
    }

    console.warn("❌ All Qloo API strategies failed, using fallback");
    return this.generateFallbackRecommendations(preferences);
  }

  private getCategorySpecificQueries(
    category: string,
    destination: string
  ): string[] {
    const queryMap: Record<string, string[]> = {
      museums: [
        // Try to get specific museum names, not categories
        `famous museums ${destination}`,
        `top museums ${destination}`,
        `best museums to visit ${destination}`,
        `museum attractions ${destination}`,
        `national museum ${destination}`,
        `archaeological museum ${destination}`,
        `art museum ${destination}`,
      ],
      restaurants: [
        `best restaurants ${destination}`,
        `top restaurants ${destination}`,
        `fine dining ${destination}`,
        `local restaurants ${destination}`,
        `popular restaurants ${destination}`,
      ],
      hotels: [
        `luxury hotels ${destination}`,
        `best hotels ${destination}`,
        `top hotels ${destination}`,
        `boutique hotels ${destination}`,
        `accommodation ${destination}`,
      ],
      attractions: [
        `top attractions ${destination}`,
        `must see ${destination}`,
        `famous landmarks ${destination}`,
        `tourist attractions ${destination}`,
        `best places to visit ${destination}`,
      ],
      parks: [
        `national parks ${destination}`,
        `public parks ${destination}`,
        `botanical gardens ${destination}`,
        `green spaces ${destination}`,
        `outdoor attractions ${destination}`,
      ],
      entertainment: [
        `entertainment venues ${destination}`,
        `theaters ${destination}`,
        `nightlife ${destination}`,
        `live music ${destination}`,
        `entertainment attractions ${destination}`,
      ],
      shopping: [
        `shopping centers ${destination}`,
        `markets ${destination}`,
        `shopping districts ${destination}`,
        `boutique shopping ${destination}`,
        `local markets ${destination}`,
      ],
      cafes: [
        `best cafes ${destination}`,
        `coffee shops ${destination}`,
        `local cafes ${destination}`,
        `specialty coffee ${destination}`,
        `cafe culture ${destination}`,
      ],
      food: [
        `local cuisine ${destination}`,
        `food markets ${destination}`,
        `street food ${destination}`,
        `culinary experiences ${destination}`,
        `traditional food ${destination}`,
      ],
      history: [
        `historical sites ${destination}`,
        `ancient sites ${destination}`,
        `historical landmarks ${destination}`,
        `heritage sites ${destination}`,
        `archaeological sites ${destination}`,
      ],
      culture: [
        `cultural attractions ${destination}`,
        `cultural sites ${destination}`,
        `cultural experiences ${destination}`,
        `traditional culture ${destination}`,
        `local culture ${destination}`,
      ],
    };

    return queryMap[category] || [`${category} attractions ${destination}`];
  }

  private filterResultsByCategories(
    results: Recommendation[],
    selectedCategories: string[]
  ): Recommendation[] {
    if (!selectedCategories || selectedCategories.length === 0) {
      return results; // Return all results if no categories selected
    }

    return results.filter((result) => {
      // Check if the result type matches any selected category
      const resultType = result.type.toLowerCase();
      const resultName = result.name.toLowerCase();
      const resultDescription = result.description.toLowerCase();
      const resultTags = result.tags?.map((tag) => tag.toLowerCase()) || [];

      return selectedCategories.some((category) => {
        const categoryLower = category.toLowerCase();

        // Direct type matching
        if (this.isMatchingCategory(resultType, categoryLower)) {
          return true;
        }

        // Check name for category keywords
        if (resultName.includes(categoryLower)) {
          return true;
        }

        // Check description for category keywords
        if (resultDescription.includes(categoryLower)) {
          return true;
        }

        // Check tags for category match
        if (resultTags.some((tag) => tag.includes(categoryLower))) {
          return true;
        }

        // Check for category-specific keywords
        return this.containsCategoryKeywords(result, categoryLower);
      });
    });
  }

  private isMatchingCategory(resultType: string, category: string): boolean {
    const categoryMapping: Record<string, string[]> = {
      restaurants: ["restaurant", "dining", "food", "cafe", "bar"],
      hotels: ["hotel", "accommodation", "lodging"],
      attractions: ["attraction", "landmark", "sightseeing"],
      museums: ["museum", "gallery", "cultural"],
      parks: ["park", "garden", "outdoor"],
      entertainment: ["entertainment", "theater", "show", "nightlife"],
      shopping: ["shopping", "market", "retail", "store"],
      cafes: ["cafe", "coffee"],
      food: ["restaurant", "food", "dining", "cafe"],
      history: ["museum", "historical", "heritage", "monument"],
      culture: ["museum", "cultural", "art", "gallery"],
    };

    const validTypes = categoryMapping[category] || [category];
    return validTypes.some((type) => resultType.includes(type));
  }

  private containsCategoryKeywords(
    result: Recommendation,
    category: string
  ): boolean {
    const keywordMap: Record<string, string[]> = {
      museums: [
        "museum",
        "gallery",
        "exhibition",
        "art",
        "collection",
        "cultural center",
      ],
      parks: ["park", "garden", "green", "nature", "outdoor", "botanical"],
      hotels: ["hotel", "inn", "resort", "lodge", "accommodation"],
      attractions: [
        "attraction",
        "landmark",
        "monument",
        "tower",
        "palace",
        "castle",
      ],
      entertainment: ["theater", "cinema", "club", "bar", "nightlife", "show"],
      shopping: ["shop", "market", "mall", "store", "boutique", "retail"],
      history: [
        "historical",
        "heritage",
        "ancient",
        "old",
        "traditional",
        "historic",
      ],
    };

    const keywords = keywordMap[category] || [category];
    const searchText = `${result.name} ${
      result.description
    } ${result.tags?.join(" ")}`.toLowerCase();

    return keywords.some((keyword) => searchText.includes(keyword));
  }

  private mapQlooType(type?: string): string {
    if (!type) return "attraction";

    const typeString = type.toLowerCase();

    if (
      typeString.includes("museum") ||
      typeString.includes("gallery") ||
      typeString.includes("exhibition")
    ) {
      return "museum";
    }
    if (
      typeString.includes("park") ||
      typeString.includes("garden") ||
      typeString.includes("green")
    ) {
      return "park";
    }
    if (
      typeString.includes("hotel") ||
      typeString.includes("accommodation") ||
      typeString.includes("lodging")
    ) {
      return "hotel";
    }
    if (
      typeString.includes("restaurant") ||
      typeString.includes("dining") ||
      typeString.includes("food")
    ) {
      return "restaurant";
    }
    if (
      typeString.includes("shop") ||
      typeString.includes("market") ||
      typeString.includes("retail")
    ) {
      return "shopping";
    }
    if (
      typeString.includes("entertainment") ||
      typeString.includes("theater") ||
      typeString.includes("show")
    ) {
      return "entertainment";
    }
    if (typeString.includes("cafe") || typeString.includes("coffee")) {
      return "cafe";
    }

    const typeMap: Record<string, string> = {
      place: "restaurant",
      destination: "attraction",
      venue: "entertainment",
    };

    return typeMap[typeString] || "attraction";
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
  console.log("=== getRecommendations EXPORT FUNCTION START ===");
  console.log("Input preferences:", preferences);

  const result = await qlooService.getEnhancedRecommendations(preferences);

  console.log("=== getRecommendations EXPORT FUNCTION RESULT ===");
  console.log("Result count:", result.length);
  console.log("First result:", result[0]);
  console.log(
    "All result names:",
    result.map((r) => r.name)
  );
  console.log("=== END EXPORT FUNCTION RESULT ===");

  return result;
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
