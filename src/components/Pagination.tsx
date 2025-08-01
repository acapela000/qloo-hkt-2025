"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import SpotCard from "./SpotCard";
import { type Recommendation } from "@/services/QlooApiService";

interface PaginatedRecommendationsProps {
  allRecommendations: Recommendation[];
  itemsPerPage?: number;
  onAddToItinerary?: (spot: Recommendation) => void;
}

export const PaginatedRecommendations: React.FC<
  PaginatedRecommendationsProps
> = ({ allRecommendations, itemsPerPage = 9, onAddToItinerary }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const totalPages = Math.ceil(allRecommendations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRecommendations = allRecommendations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = async (page: number) => {
    setIsLoading(true);
    // Simulate API call delay for smooth UX
    await new Promise((resolve) => setTimeout(resolve, 300));
    setCurrentPage(page);
    setIsLoading(false);
    // Scroll to top of recommendations
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Results Info */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1}-
          {Math.min(startIndex + itemsPerPage, allRecommendations.length)} of{" "}
          {allRecommendations.length} recommendations
        </p>
        <p className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 aspect-video rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentRecommendations.map((recommendation) => (
            <SpotCard
              key={`${recommendation.id}-${currentPage}`}
              spot={recommendation}
              onAddToItinerary={onAddToItinerary}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-2">
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          size="sm"
        >
          Previous
        </Button>

        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-3 py-2 text-gray-500">...</span>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => handlePageChange(page as number)}
                disabled={isLoading}
                size="sm"
                className="min-w-[40px]"
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}

        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          size="sm"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
