import React from "react";
import { discoveryData } from "@/data/mockdata";

interface DestinationCardProps {
  name: string;
  country: string;
  image: string;
  rating: number;
  price: string;
  highlights: string[];
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  name,
  country,
  image,
  rating,
  price,
  highlights,
}) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <img src={image} alt={name} className="w-full h-48 object-cover" />
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-gray-600 text-sm">{country}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center mb-1">
            <span className="text-yellow-400">★</span>
            <span className="text-sm ml-1">{rating}</span>
          </div>
          <p className="text-blue-600 font-semibold text-sm">{price}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {highlights.map((highlight, index) => (
          <span
            key={index}
            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
          >
            {highlight}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default function Discovery() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover</h1>
        <p className="text-gray-600">Find your next perfect destination</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {discoveryData.map((destination, index) => (
          <DestinationCard key={index} {...destination} />
        ))}
      </div>
    </div>
  );
}
