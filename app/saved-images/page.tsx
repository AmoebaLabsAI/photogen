"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Image from "next/image";

const SavedImagesPage = () => {
  const { user } = useUser();
  const [savedImages, setSavedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedImages = async () => {
      if (!user) return;

      try {
        const response = await fetch("/api/get-saved-images");
        if (response.ok) {
          const { data } = await response.json();
          setSavedImages(data);
        } else {
          throw new Error("Failed to fetch images");
        }
      } catch (error) {
        console.error("Error fetching saved images:", error);
        alert("Failed to load saved images");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedImages();
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Saved Images</h1>
      {savedImages.length === 0 ? (
        <p>You haven't saved any images yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {savedImages.map((image) => (
            <div
              key={image.id}
              className="relative h-64 rounded-lg overflow-hidden"
            >
              <Image
                src={image.image_url}
                alt="Saved image"
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedImagesPage;
