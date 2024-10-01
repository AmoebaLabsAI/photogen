"use client";

import React, { useState, useEffect } from "react";
import { generateFluxProImage } from "../../actions/replicate-actions";
import Image from "next/image";
import { Loader2, ImageIcon, Sparkles } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export const maxDuration = 300; // Applies to the actions

const FluxProPage: React.FC = () => {
  // State variables
  const [prompt, setPrompt] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const [remainingGenerations, setRemainingGenerations] = useState<
    number | null
  >(null);
  const router = useRouter();
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);

  // Fetch the user's current image count when the component mounts
  useEffect(() => {
    const fetchImageCount = async () => {
      if (user) {
        try {
          const response = await fetch("/api/user-image-count");
          if (response.ok) {
            const data = await response.json();
            setRemainingGenerations(data.remainingGenerations);
            setSubscriptionTier(data.subscription_tier);
          }
        } catch (error) {
          console.error("Error fetching image count:", error);
        }
      }
    };
    fetchImageCount();
  }, [user]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading || remainingGenerations === 0) return;
    setIsLoading(true);
    try {
      // Check remaining generations on the server
      const checkResponse = await fetch("/api/user-image-count");
      if (!checkResponse.ok) {
        throw new Error("Failed to check remaining generations");
      }
      const checkData = await checkResponse.json();
      if (checkData.remainingGenerations <= 0) {
        setRemainingGenerations(0);
        throw new Error("No generations remaining");
      }

      // Generate image
      const result = await generateFluxProImage(prompt);

      if (result === undefined || result === null) {
        throw new Error("No result returned from generateFluxProImage");
      }

      setImageUrls(Array.isArray(result) ? result : [result]);

      // Update image count and remaining generations after successful image generation
      const countResponse = await fetch("/api/user-image-count", {
        method: "POST",
      });

      if (!countResponse.ok) {
        if (countResponse.status === 403) {
          setRemainingGenerations(0);
          throw new Error("Image generation limit reached");
        }
        throw new Error("Failed to update image count");
      }
      const countData = await countResponse.json();
      setRemainingGenerations(countData.remainingGenerations);
      setSubscriptionTier(countData.subscription_tier);
    } catch (error) {
      console.error("Error generating image:", error);
      alert(`Failed to generate image: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Handle image download
  const handleDownload = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "flux-pro-image.webp";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSubscriptionLimit = (tier: string | null) => {
    switch (tier) {
      case "pro":
        return Number(process.env.NEXT_PUBLIC_PRO_PLAN_IMAGE_GENERATION_LIMIT);
      case "basic":
        return Number(
          process.env.NEXT_PUBLIC_BASIC_PLAN_IMAGE_GENERATION_LIMIT
        );
      default:
        return Number(process.env.NEXT_PUBLIC_FREE_PLAN_IMAGE_GENERATION_LIMIT);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar (top on mobile) */}
      <div className="w-full md:w-1/4 p-4 md:p-6 flex flex-col bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Prompt input textarea */}
          <div className="mb-4">
            <textarea
              placeholder="Describe your vision"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-32 md:h-40 p-2 border-2 border-white rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70"
            />
          </div>
          {/* Generate button */}
          <button
            type="submit"
            disabled={isLoading || !prompt.trim() || remainingGenerations === 0}
            className="w-full bg-white bg-opacity-30 hover:bg-opacity-40 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 border-2 border-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <>Conjuring Image...</> : "Generate Magic"}
          </button>
          {/* Remaining generations count */}
          <p className="mt-2 text-white">
            {remainingGenerations !== null
              ? `${remainingGenerations} generations remaining`
              : "Loading..."}
          </p>
          <p className="mt-2 text-white">
            Subscription: {subscriptionTier || "Loading..."}
          </p>
          {/* Subscription prompt when limit is reached */}
          {remainingGenerations === 0 && (
            <div className="mt-4 p-4 bg-white bg-opacity-20 rounded-xl">
              <p className="text-white">
                You've reached the limit of{" "}
                {getSubscriptionLimit(subscriptionTier)} images.
              </p>
              <p className="text-white mt-2">
                {subscriptionTier === "pro"
                  ? "You've used all your pro plan generations."
                  : subscriptionTier === "basic"
                  ? "Upgrade to Pro for more generations!"
                  : "Upgrade to Basic or Pro for more generations!"}
              </p>
              {subscriptionTier !== "pro" && (
                <button
                  onClick={() => router.push("/index#subscribe")}
                  className="mt-4 inline-block px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold"
                >
                  {subscriptionTier === "basic"
                    ? "Upgrade To Pro"
                    : "Upgrade Plan"}
                </button>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Main content (bottom on mobile) */}
      <div className="w-full md:w-3/4 p-4 md:p-6 flex-grow bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
        {isLoading ? (
          // Loading indicator
          <div className="flex items-center justify-center h-64 w-full bg-white bg-opacity-20 rounded-xl">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
            <p className="ml-2 text-lg text-white">Generating image...</p>
          </div>
        ) : imageUrls.length > 0 ? (
          // Display generated images
          <div className="w-full h-full  items-center justify-center">
            {imageUrls.map((url, index) => (
              <div
                key={index}
                className="w-full h-full flex flex-col items-center justify-center"
              >
                <div className="relative w-full h-3/4">
                  <Image
                    src={url}
                    alt={`Generated image ${index + 1}`}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="mt-4">
                  {/* Download button */}
                  <button
                    onClick={() => handleDownload(url)}
                    className="inline-flex items-center px-6 py-2 bg-white bg-opacity-30 hover:bg-opacity-40 text-white rounded-lg transition-colors border-2 border-white"
                  >
                    <ImageIcon className="mr-2" /> Download Image
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Placeholder when no image is generated
          <div className="flex items-center justify-center h-64 w-full bg-white bg-opacity-20 rounded-xl">
            <Sparkles className="w-8 h-8 text-white mr-2" />
            <p className="text-lg text-white">
              Your generated image will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FluxProPage;
