"use client";

import React, { useState } from "react";
import { generateVideo } from "../../actions/replicate-actions";
import Image from "next/image";
import { Loader2, ImageIcon, Sparkles } from "lucide-react";

const AfricaPage: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const result = await generateVideo(prompt);
      setImageUrls(Array.isArray(result) ? result : [result]);
    } catch (error) {
      console.error("Error generating image:", error);
    }
    setIsLoading(false);
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
    link.download = "ai-video.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar (top on mobile) */}
      <div className="w-full md:w-1/4 p-4 md:p-6 flex flex-col bg-gradient-to-br from-green-400 via-yellow-500 to-red-500">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="mb-4">
            <textarea
              placeholder="Describe your vision"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-32 md:h-40 p-2 border-2 border-white rounded-xl focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="w-full bg-white bg-opacity-30 hover:bg-opacity-40 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 border-2 border-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <>Conjuring Video...</> : "Generate African Magic"}
          </button>
        </form>
      </div>

      {/* Main content (bottom on mobile) */}
      <div className="w-full md:w-3/4 p-4 md:p-6 flex-grow bg-gradient-to-br from-green-400 via-yellow-500 to-red-500 flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-lg max-h-full flex items-center justify-center">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 bg-white bg-opacity-20 rounded-xl">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
              <p className="ml-2 text-lg text-white">Generating video...</p>
            </div>
          ) : imageUrls.length > 0 ? (
            <div>
              {imageUrls.map((url, index) => (
                <div key={index} className="mb-8 flex flex-col items-center">
                  <div className="w-full aspect-square relative">
                    <video
                      src={url}
                      className="rounded-xl shadow-lg drop-shadow-md"
                      autoPlay
                      loop
                      muted
                    />
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => handleDownload(url)}
                      className="inline-flex items-center px-6 py-2 bg-white bg-opacity-30 hover:bg-opacity-40 text-white rounded-lg transition-colors border-2 border-white"
                    >
                      <ImageIcon className="mr-2" /> Download Video
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-white bg-opacity-20 rounded-xl">
              <Sparkles className="w-8 h-8 text-white mr-2" />
              <p className="text-lg text-white">
                Your generated video will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AfricaPage;
