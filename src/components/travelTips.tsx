"use client";

import type React from "react";
import {
  Camera,
  Lightbulb,
  Navigation,
  Wifi,
  CreditCard,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Types
interface TravelTip {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

// TravelTips Component
const TravelTips: React.FC = () => {
  const tips: TravelTip[] = [
    {
      id: "1",
      icon: <Navigation className="h-6 w-6 text-blue-600" />,
      title: "Download Offline Maps",
      description:
        "Save data and stay connected even without internet by downloading maps of your destination beforehand.",
    },
    {
      id: "2",
      icon: <CreditCard className="h-6 w-6 text-green-600" />,
      title: "Notify Your Bank",
      description:
        "Inform your bank about your travel plans to avoid card blocks and ensure smooth transactions abroad.",
    },
    {
      id: "3",
      icon: <Shield className="h-6 w-6 text-purple-600" />,
      title: "Travel Insurance",
      description:
        "Protect yourself with comprehensive travel insurance covering medical emergencies and trip cancellations.",
    },
    {
      id: "4",
      icon: <Wifi className="h-6 w-6 text-orange-600" />,
      title: "Research Local SIM Cards",
      description:
        "Look into local SIM cards or international roaming plans to stay connected affordably.",
    },
    {
      id: "5",
      icon: <Camera className="h-6 w-6 text-pink-600" />,
      title: "Backup Your Photos",
      description:
        "Set up automatic cloud backup for your photos to preserve memories even if your device is lost.",
    },
    {
      id: "6",
      icon: <Lightbulb className="h-6 w-6 text-yellow-600" />,
      title: "Learn Basic Phrases",
      description:
        "Learn essential phrases in the local language - it shows respect and can be incredibly helpful.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Travel Tips</h2>
        <p className="text-gray-600 mt-2">
          Essential advice for a smooth journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.map((tip) => (
          <Card key={tip.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">{tip.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{tip.title}</h3>
                  <p className="text-gray-600 text-sm">{tip.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TravelTips;
