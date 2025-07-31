import React from "react";
import { myTripsData } from "@/data/mockdata";

interface TripCardProps {
  destination: string;
  dates: string;
  image: string;
  status: "upcoming" | "completed" | "planning";
  duration: string;
}

const TripCard: React.FC<TripCardProps> = ({
  destination,
  dates,
  image,
  status,
  duration,
}) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <img src={image} alt={destination} className="w-full h-48 object-cover" />
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{destination}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            status === "upcoming"
              ? "bg-green-100 text-green-800"
              : status === "completed"
              ? "bg-gray-100 text-gray-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-1">{dates}</p>
      <p className="text-gray-500 text-xs">{duration}</p>
    </div>
  </div>
);

export default function MyTrips() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Trips</h1>
        <p className="text-gray-600">
          Manage and view all your travel adventures
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myTripsData.map((trip, index) => (
          <TripCard key={index} {...trip} />
        ))}
      </div>
    </div>
  );
}
