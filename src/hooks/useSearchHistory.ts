import { useState, useEffect } from "react";

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  resultsCount: number;
  filters?: Record<string, any>;
  location?: string;
  category?: string;
}

export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("search-history");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const addSearchToHistory = (
    query: string,
    resultsCount: number,
    filters?: Record<string, any>,
    location?: string,
    category?: string
  ) => {
    const newSearch: SearchHistoryItem = {
      id: Date.now().toString(),
      query,
      timestamp: new Date().toISOString(),
      resultsCount,
      filters,
      location,
      category,
    };

    const updatedHistory = [newSearch, ...searchHistory].slice(0, 100);
    setSearchHistory(updatedHistory);
    localStorage.setItem("search-history", JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("search-history");
  };

  const getSearchStats = () => {
    const totalSearches = searchHistory.length;
    const uniqueQueries = new Set(
      searchHistory.map((s) => s.query.toLowerCase())
    ).size;
    const avgResults =
      searchHistory.length > 0
        ? Math.round(
            searchHistory.reduce((sum, s) => sum + s.resultsCount, 0) /
              searchHistory.length
          )
        : 0;

    const categoryStats = searchHistory.reduce((acc, search) => {
      const category = search.category || "general";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSearches,
      uniqueQueries,
      avgResults,
      categoryStats,
    };
  };

  return {
    searchHistory,
    addSearchToHistory,
    clearHistory,
    getSearchStats,
  };
};
