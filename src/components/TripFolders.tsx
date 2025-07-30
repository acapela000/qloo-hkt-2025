"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Folder, MapPin, Calendar, Trash2, Eye } from "lucide-react";
import { useTripFolders } from "@/hooks/useTripFolders";
import { useItinerary } from "@/hooks/useItinerary";

interface TripFoldersProps {
  onSelectFolder?: (folderId: string) => void;
}

export const TripFolders: React.FC<TripFoldersProps> = ({ onSelectFolder }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [destination, setDestination] = useState("");
  const [description, setDescription] = useState("");

  const { folders, createFolder, deleteFolder, updateFolderItemCount } =
    useTripFolders();
  const { getItineraryByFolder } = useItinerary();

  // Update item counts
  useEffect(() => {
    folders.forEach((folder) => {
      const items = getItineraryByFolder(folder.id);
      if (items.length !== folder.itemCount) {
        updateFolderItemCount(folder.id, items.length);
      }
    });
  }, [folders]);

  const handleCreateFolder = () => {
    if (folderName.trim() && destination.trim()) {
      createFolder(folderName, destination, description);
      setFolderName("");
      setDestination("");
      setDescription("");
      setShowCreateForm(false);
    }
  };

  const popularDestinations = [
    "Paris, France",
    "Tokyo, Japan",
    "New York, USA",
    "London, UK",
    "Rome, Italy",
    "Barcelona, Spain",
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Trip Folders</h2>
          <p className="text-gray-600">
            Organize your travel plans by destination
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Folder</span>
        </Button>
      </div>

      {/* Create Folder Form */}
      {showCreateForm && (
        <Card className="border-dashed border-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Folder className="h-5 w-5" />
              <span>Create New Trip Folder</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Folder Name
              </label>
              <input
                type="text"
                placeholder="e.g., Summer Europe Trip"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Destination
              </label>
              <input
                type="text"
                placeholder="e.g., Paris, France"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {popularDestinations.map((dest) => (
                  <Badge
                    key={dest}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => setDestination(dest)}
                  >
                    {dest}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description (Optional)
              </label>
              <textarea
                placeholder="Tell us about this trip..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleCreateFolder} className="flex-1">
                Create Folder
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Folders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {folders.map((folder) => (
          <Card
            key={folder.id}
            className="hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div
                  className={`w-12 h-12 ${folder.color} rounded-lg flex items-center justify-center`}
                >
                  <Folder className="h-6 w-6 text-white" />
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onSelectFolder?.(folder.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteFolder(folder.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg">{folder.name}</h3>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {folder.destination}
                </p>
              </div>

              {folder.description && (
                <p className="text-sm text-gray-700 line-clamp-2">
                  {folder.description}
                </p>
              )}

              <div className="flex justify-between items-center pt-2 border-t">
                <div className="text-sm text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(folder.createdAt).toLocaleDateString()}
                </div>
                <Badge variant="secondary">{folder.itemCount} items</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {folders.length === 0 && !showCreateForm && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No trip folders yet
          </h3>
          <p className="text-gray-500 mb-4">
            Create your first folder to organize your travel plans
          </p>
          <Button onClick={() => setShowCreateForm(true)}>
            Create Your First Folder
          </Button>
        </div>
      )}
    </div>
  );
};
