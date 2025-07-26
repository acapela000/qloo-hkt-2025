"use client";

import type React from "react";
import { MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Recommendation } from "./services/QlooApiService";

// SpotCard Component
interface SpotCardProps {
  spot: Recommendation;
  onAddToItinerary?: (spot: Recommendation) => void;
}

const SpotCard: React.FC<SpotCardProps> = ({ spot, onAddToItinerary }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative">
        <img
          src={spot.image || "/placeholder.svg"}
          alt={spot.name}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-2 left-2" variant="secondary">
          {spot.type}
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg leading-tight">{spot.name}</h3>
            <div className="flex items-center text-sm text-gray-600 ml-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              {spot.rating}
            </div>
          </div>

          <p className="text-sm text-gray-600 flex items-center">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            {spot.address}
          </p>

          <p className="text-sm text-gray-700 line-clamp-2">
            {spot.description}
          </p>

          <div className="flex flex-wrap gap-1">
            {spot.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <Button
            className="w-full mt-3"
            size="sm"
            onClick={() => onAddToItinerary?.(spot)}
          >
            Add to Itinerary
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpotCard;
