import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export interface ItineraryItem {
  id: string;
  name: string;
  type: string;
  description: string;
  image?: string;
  rating?: number;
  address?: string;
  tags?: string[];
  addedAt: string;
  itineraryId?: string;
}

export const useItinerary = () => {
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([]);

  useEffect(() => {
    const savedItems = localStorage.getItem("travel-itinerary-items");
    if (savedItems) {
      setItineraryItems(JSON.parse(savedItems));
    }
  }, []);

  const addToItinerary = (
    item: Omit<ItineraryItem, "addedAt">,
    itineraryId?: string
  ) => {
    // Check if item already exists
    const existingItem = itineraryItems.find(
      (existing) => existing.id === item.id
    );
    if (existingItem) {
      toast.error(`${item.name} is already in your itinerary!`, {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    const newItem: ItineraryItem = {
      ...item,
      addedAt: new Date().toISOString(),
      itineraryId: itineraryId || "default",
    };

    const updatedItems = [...itineraryItems, newItem];
    setItineraryItems(updatedItems);
    localStorage.setItem(
      "travel-itinerary-items",
      JSON.stringify(updatedItems)
    );

    toast.success(
      React.createElement(
        "div",
        { className: "flex items-center space-x-2" },
        React.createElement("span", null, "✅"),
        React.createElement(
          "div",
          null,
          React.createElement("div", { className: "font-medium" }, item.name),
          React.createElement(
            "div",
            { className: "text-sm text-gray-600" },
            "Added to your itinerary!"
          )
        )
      ),
      {
        duration: 4000,
        position: "top-right",
      }
    );
  };

  const removeFromItinerary = (id: string) => {
    const item = itineraryItems.find((item) => item.id === id);
    const updatedItems = itineraryItems.filter((item) => item.id !== id);
    setItineraryItems(updatedItems);
    localStorage.setItem(
      "travel-itinerary-items",
      JSON.stringify(updatedItems)
    );

    toast.success(`${item?.name || "Item"} removed from itinerary`, {
      duration: 2000,
    });
  };

  const getItineraryByFolder = (folderId: string) => {
    return itineraryItems.filter((item) => item.itineraryId === folderId);
  };

  return {
    itineraryItems,
    addToItinerary,
    removeFromItinerary,
    getItineraryByFolder,
  };
};
