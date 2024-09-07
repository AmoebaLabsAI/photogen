"use client";

import React, { useState } from "react";
import { generateFluxProImage } from "../../actions/replicate-actions";
import Image from "next/image";
import { Loader2, ImageIcon, Sparkles, Save } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const FluxProPage: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    try {
      console.log("Calling generateFluxProImage with prompt:", prompt);
      const result = await generateFluxProImage(prompt);
      console.log("Result from generateFluxProImage:", result);

      if (result === undefined || result === null) {
        throw new Error("No result returned from generateFluxProImage");
      }

      setImageUrls(Array.isArray(result) ? result : [result]);
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

      if (response.ok) {
        alert("Image saved successfully!");
      } else {
        throw new Error("Failed to save image");
      }
    } catch (error) {
      console.error("Error saving image:", error);
      alert("Failed to save image");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar (top on mobile) */}
      <div className="w-full md:w-1/4 p-4 md:p-6 flex flex-col bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="mb-4">
            <textarea
              placeholder="Describe your vision"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-32 md:h-40 p-2 border-2 border-white rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="w-full bg-white bg-opacity-30 hover:bg-opacity-40 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 border-2 border-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <>Conjuring Image...</> : "Generate Magic"}
          </button>
          <Link href="/saved-images">Saved Images</Link>
        </form>
      </div>

      {/* Main content (bottom on mobile) */}
      <div className="w-full md:w-3/4 p-4 md:p-6 flex-grow bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64 w-full bg-white bg-opacity-20 rounded-xl">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
            <p className="ml-2 text-lg text-white">Generating image...</p>
          </div>
        ) : imageUrls.length > 0 ? (
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
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => handleDownload(url)}
                    className="inline-flex items-center px-6 py-2 bg-white bg-opacity-30 hover:bg-opacity-40 text-white rounded-lg transition-colors border-2 border-white"
                  >
                    <ImageIcon className="mr-2" /> Download Image
                  </button>
                  {user && (
                    <button
                      onClick={() => handleSaveImage(url)}
                      className="inline-flex items-center px-6 py-2 bg-white bg-opacity-30 hover:bg-opacity-40 text-white rounded-lg transition-colors border-2 border-white"
                    >
                      <Save className="mr-2" /> Save Image
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
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
