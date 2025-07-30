export const getEnhancedThumbnail = (item: any): string => {
  // If image exists and is not a placeholder, use it
  if (
    item.image &&
    item.image !== "/placeholder.svg" &&
    item.image !== "placeholder.svg"
  ) {
    return item.image;
  }

  // Use Unsplash with specific search terms based on item type and name
  const getUnsplashImage = (query: string) => {
    const encodedQuery = encodeURIComponent(query);
    return `https://source.unsplash.com/400x250/?${encodedQuery}`;
  };

  // Create search query based on item properties
  let searchQuery = "";

  if (item.type) {
    searchQuery = `${item.type}`;

    // Add location context if available
    if (item.address) {
      const location = item.address.split(",")[0]; // Get first part of address
      searchQuery += ` ${location}`;
    }

    // Add name for more specific results
    if (item.name) {
      searchQuery += ` ${item.name}`;
    }
  } else if (item.name) {
    searchQuery = item.name;
  } else {
    searchQuery = "travel destination";
  }

  return getUnsplashImage(searchQuery);
};

// Alternative: Use Lorem Picsum with seed for consistent images
export const getConsistentThumbnail = (item: any): string => {
  if (
    item.image &&
    item.image !== "/placeholder.svg" &&
    item.image !== "placeholder.svg"
  ) {
    return item.image;
  }

  // Generate a seed from the item name for consistent images
  const seed = item.name
    ? item.name.toLowerCase().replace(/\s+/g, "")
    : "default";
  return `https://picsum.photos/seed/${seed}/400/250`;
};

// Fallback thumbnail with category-specific placeholders
export const getFallbackThumbnail = (item: any): string => {
  if (
    item.image &&
    item.image !== "/placeholder.svg" &&
    item.image !== "placeholder.svg"
  ) {
    return item.image;
  }

  // Category-specific Unsplash images
  const categoryImages = {
    restaurant: "https://source.unsplash.com/400x250/?restaurant,food",
    hotel: "https://source.unsplash.com/400x250/?hotel,accommodation",
    attraction: "https://source.unsplash.com/400x250/?tourist,attraction",
    museum: "https://source.unsplash.com/400x250/?museum,art",
    park: "https://source.unsplash.com/400x250/?park,nature",
    shopping: "https://source.unsplash.com/400x250/?shopping,mall",
    entertainment: "https://source.unsplash.com/400x250/?entertainment,fun",
    activity: "https://source.unsplash.com/400x250/?activity,adventure",
    default: "https://source.unsplash.com/400x250/?travel,destination",
  };

  const category = item.type?.toLowerCase() || "default";
  return (
    categoryImages[category as keyof typeof categoryImages] ||
    categoryImages.default
  );
};

// Alternative implementation using Pexels (free API)
export const getPexelsThumbnail = async (query: string): Promise<string> => {
  // You would need to sign up for a free Pexels API key
  const PEXELS_API_KEY = "YOUR_FREE_PEXELS_API_KEY";

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&per_page=1`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    const data = await response.json();
    if (data.photos && data.photos.length > 0) {
      return data.photos[0].src.medium;
    }
  } catch (error) {
    console.error("Pexels API error:", error);
  }

  // Fallback to Unsplash
  return `https://source.unsplash.com/400x250/?${encodeURIComponent(query)}`;
};

// Main function to get thumbnail with multiple fallbacks
export const getThumbnail = (item: any): string => {
  // First try: Use existing image
  if (
    item.image &&
    item.image !== "/placeholder.svg" &&
    item.image !== "placeholder.svg"
  ) {
    return item.image;
  }

  // Second try: Use enhanced search
  try {
    return getEnhancedThumbnail(item);
  } catch (error) {
    // Third try: Use category fallback
    return getFallbackThumbnail(item);
  }
};
