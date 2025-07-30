"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export const ApiStatus: React.FC = () => {
  return (
    <Badge variant="outline" className="flex items-center space-x-1">
      <CheckCircle className="h-3 w-3 text-green-500" />
      <span>Qloo API Ready</span>
    </Badge>
  );
};
