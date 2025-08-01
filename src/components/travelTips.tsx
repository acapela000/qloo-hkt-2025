"use client";

import React from "react";
import { travelTipsData } from "@/data/mockdata";

interface TipCardProps {
  title: string;
  description: string;
  image: string;
  category: string;
}

const TipCard: React.FC<TipCardProps> = ({
  title,
  description,
  image,
  category,
}) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <img src={image} alt={title} className="w-full h-48 object-cover" />
    <div className="p-4">
      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
        {category}
      </span>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

export default function TravelTips() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Travel Tips</h1>
        <p className="text-gray-600">
          Discover expert advice and insider tips for your next adventure
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {travelTipsData.map((tip, index) => (
          <TipCard key={index} {...tip} />
        ))}
      </div>
    </div>
  );
}
