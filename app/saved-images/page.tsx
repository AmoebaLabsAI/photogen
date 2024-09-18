"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Image from "next/image";

// Define the type for a saved image
interface SavedImage {
  id: string;
  image_url: string;
  s3_url: string;
}

const SavedImagesPage = () => {
  // Get the current user using Clerk's useUser hook
  const { user } = useUser();
  // State to store the list of saved images
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  // State to track loading status
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to fetch saved images from the API
    const fetchSavedImages = async () => {
      // Only fetch images if there's a logged-in user
      if (!user) return;

      try {
        // Make a GET request to the API endpoint
        const response = await fetch("/api/get-saved-images");
        if (response.ok) {
          // If successful, update the savedImages state with the fetched data
          const { data } = await response.json();
          setSavedImages(data);
        } else {
          throw new Error("Failed to fetch images");
        }
      } catch (error) {
        // Log any errors and show an alert to the user
        console.error("Error fetching saved images:", error);
        alert("Failed to load saved images");
      } finally {
        // Set loading to false, regardless of success or failure
        setIsLoading(false);
      }
    };

    // Call the fetchSavedImages function when the component mounts or user changes
    fetchSavedImages();
  }, [user]);

  // Show a loading message while fetching images
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Saved Images</h1>
      {savedImages.length === 0 ? (
        // Display a message if there are no saved images
        <p>You haven't saved any images yet.</p>
      ) : (
        // Display a grid of saved images
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {savedImages.map((image) => (
            <div
              key={image.id}
              className="relative h-64 rounded-lg overflow-hidden"
            >
              {/* Display each image using Next.js Image component */}
              <Image
                src={image.s3_url}
                alt="Saved image"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedImagesPage;
