"use client";

import React from "react";
import MainLayout from "@/components/Mainlayout";
import TravelItineraryApp from "@/components/TravelItineraryApp";
import { useItinerary } from "@/hooks/useItinerary";

export default function DiscoverPage() {
  const { addToItinerary } = useItinerary();

  return (
    <MainLayout currentPage="discover" onPageChange={() => {}}>
      <TravelItineraryApp onAddToItinerary={addToItinerary} />
    </MainLayout>
  );
}
