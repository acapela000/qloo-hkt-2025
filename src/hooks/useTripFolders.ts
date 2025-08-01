import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export interface TripFolder {
  id: string;
  name: string;
  description?: string;
  destination: string;
  color: string;
  createdAt: string;
  lastModified: string;
  itemCount: number;
}

export const useTripFolders = () => {
  const [folders, setFolders] = useState<TripFolder[]>([]);

  useEffect(() => {
    const savedFolders = localStorage.getItem("trip-folders");
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    }
  }, []);

  const createFolder = (
    name: string,
    destination: string,
    description?: string
  ) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newFolder: TripFolder = {
      id: Date.now().toString(),
      name,
      destination,
      description,
      color: randomColor,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      itemCount: 0,
    };

    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    localStorage.setItem("trip-folders", JSON.stringify(updatedFolders));

    toast.success(`${name} folder created!`);
    return newFolder;
  };

  const deleteFolder = (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId);
    const updatedFolders = folders.filter((folder) => folder.id !== folderId);
    setFolders(updatedFolders);
    localStorage.setItem("trip-folders", JSON.stringify(updatedFolders));

    // Also remove associated itinerary items
    const savedItems = localStorage.getItem("travel-itinerary-items");
    if (savedItems) {
      const items = JSON.parse(savedItems);
      const filteredItems = items.filter(
        (item: any) => item.itineraryId !== folderId
      );
      localStorage.setItem(
        "travel-itinerary-items",
        JSON.stringify(filteredItems)
      );
    }

    toast.success(`${folder?.name || "Folder"} deleted`);
  };

  const updateFolderItemCount = (folderId: string, count: number) => {
    const updatedFolders = folders.map((folder) =>
      folder.id === folderId
        ? {
            ...folder,
            itemCount: count,
            lastModified: new Date().toISOString(),
          }
        : folder
    );
    setFolders(updatedFolders);
    localStorage.setItem("trip-folders", JSON.stringify(updatedFolders));
  };

  return {
    folders,
    createFolder,
    deleteFolder,
    updateFolderItemCount,
  };
};
