"use client";

import React, { useState, useEffect } from "react";
import { generateFluxProImage } from "../../actions/replicate-actions";
import Image from "next/image";
import { Loader2, ImageIcon, Sparkles, Save } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export const maxDuration = 300; // Applies to the actions

const FluxProPage: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const [limitReached, setLimitReached] = useState(false);
  const [imageCount, setImageCount] = useState(0);
  const [showSubscribePrompt, setShowSubscribePrompt] = useState(false);

  useEffect(() => {
    // Fetch the user's current image count when the component mounts
    const fetchImageCount = async () => {
      if (user) {
        try {
          const response = await fetch("/api/get-image-count");
          if (response.ok) {
            const data = await response.json();
            setImageCount(data.imageCount);
            if (data.imageCount >= 5) {
              setShowSubscribePrompt(true);
            }
          }
        } catch (error) {
          console.error("Error fetching image count:", error);
        }
      }
    };

    fetchImageCount();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading || imageCount >= 5) return;
    setIsLoading(true);
    try {
      console.log("Calling generateFluxProImage with prompt:", prompt);
      const result = await generateFluxProImage(prompt);
      console.log("Result from generateFluxProImage:", result);

      if (result === undefined || result === null) {
        throw new Error("No result returned from generateFluxProImage");
      }

      setImageUrls(Array.isArray(result) ? result : [result]);
      const newImageCount = imageCount + 1;
      setImageCount(newImageCount);
      if (newImageCount >= 5) {
        setShowSubscribePrompt(true);
      }
    } catch (error) {
      console.error("Error generating image:", error);
      alert(`Failed to generate image: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleDownload = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "flux-pro-image.webp";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveImage = async (url: string) => {
    if (!user) return;

    try {
      const response = await fetch("/api/save-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url }),
      });

      if (response.status === 403) {
        setLimitReached(true);
        throw new Error("Image generation limit reached");
      }

      if (response.ok) {
        const data = await response.json();
        setImageCount(data.imageCount);
        alert("Image saved successfully!");
      } else {
        throw new Error("Failed to save image");
      }
    } catch (error) {
      console.error("Error saving image:", error);
      alert("Failed to save image");
    }
  };

  const SubscriptionPlan = ({ title, price, features, link }) => (
    <div className="bg-white p-3 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-xl font-bold mb-2">${price}<span className="text-xs font-normal">/mo</span></p>
      <Link href={link} className="block w-full bg-purple-600 text-white text-center py-1 rounded-md text-sm mb-2">Subscribe →</Link>
      <ul className="text-xs space-y-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-green-500 mr-1">✓</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col md:flex-row flex-grow">
        {/* Sidebar (top on mobile) */}
        <div className="w-full md:w-1/4 p-4 md:p-6 flex flex-col bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="mb-4">
              <textarea
                placeholder="Describe your vision"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full h-40 md:h-60 p-2 border-2 border-white rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !prompt.trim() || imageCount >= 5}
              className="w-full bg-white bg-opacity-30 hover:bg-opacity-40 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 border-2 border-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <>Conjuring Image...</> : "Generate Magic"}
            </button>
            <p className="mt-4 text-white text-center">
              {imageCount < 5
                ? `${5 - imageCount} free generations remaining`
                : "Free generations limit reached"}
            </p>
            {imageCount >= 5 && (
              <div className="mt-6 p-4 bg-white bg-opacity-20 rounded-xl">
                <p className="text-white text-center">
                  You've reached the limit of 5 free images.
                </p>
                <p className="text-white mt-2 text-center">
                  Please subscribe to our paid plan for unlimited generations!
                </p>
                <Link
                  href="/subscribe"
                  className="mt-4 block w-full text-center px-4 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
                >
                  Subscribe Now
                </Link>
              </div>
            )}
            <Link href="/saved-images" className="mt-6 text-white underline text-center">
              View Saved Images
            </Link>
          </form>
        </div>

        {/* Main content (bottom on mobile) */}
        <div className="w-full md:w-3/4 p-4 md:p-6 flex-grow bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-96 w-full bg-white bg-opacity-20 rounded-xl">
              <Loader2 className="w-16 h-16 animate-spin text-white mb-4" />
              <p className="text-2xl text-white">Generating your masterpiece...</p>
              <p className="mt-2 text-lg text-white opacity-80">This may take a moment. Please wait.</p>
            </div>
          ) : imageUrls.length > 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              {imageUrls.map((url, index) => (
                <div
                  key={index}
                  className="w-full max-w-3xl flex flex-col items-center justify-center mb-8"
                >
                  <div className="relative w-full h-96 mb-4">
                    <Image
                      src={url}
                      alt={`Generated image ${index + 1}`}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleDownload(url)}
                      className="flex items-center px-6 py-3 bg-white bg-opacity-30 hover:bg-opacity-40 text-white rounded-lg transition-colors border-2 border-white"
                    >
                      <ImageIcon className="mr-2" /> Download Image
                    </button>
                    {user && (
                      <button
                        onClick={() => handleSaveImage(url)}
                        className="flex items-center px-6 py-3 bg-white bg-opacity-30 hover:bg-opacity-40 text-white rounded-lg transition-colors border-2 border-white"
                      >
                        <Save className="mr-2" /> Save Image
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 w-full bg-white bg-opacity-20 rounded-xl">
              <Sparkles className="w-16 h-16 text-white mb-4" />
              <p className="text-2xl text-white">Your AI-generated image will appear here</p>
              <p className="mt-2 text-lg text-white opacity-80">Describe your vision in the prompt box and click "Generate Magic"</p>
            </div>
          )}
        </div>
      </div>

      {/* Subscription prompt */}
      {showSubscribePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Subscribe to Keep Using PhotoGen</h2>
            <p className="mb-4">You've reached the limit of free images. Subscribe to continue creating amazing AI-generated photos!</p>
            <Link href="/subscribe" className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Subscribe Now
            </Link>
          </div>
        </div>
      )}

      {/* Subscription plans */}
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-center mb-4">Choose Your Plan</h2>
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
            <SubscriptionPlan
              title="Basic Plan"
              price={99}
              features={[
                "100 AI Photos/mo",
                "1 AI Model",
                "Basic editing"
              ]}
              link="https://buy.stripe.com/4gwg0DfAaeNta889AB"
            />
            <SubscriptionPlan
              title="Pro Plan"
              price={199}
              features={[
                "1,000 AI Photos/mo",
                "3 AI Models",
                "Advanced editing"
              ]}
              link="https://buy.stripe.com/aEUeWz1JkfRxfss144"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FluxProPage;
