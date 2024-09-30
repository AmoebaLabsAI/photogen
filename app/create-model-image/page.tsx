"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Loader2, ImageIcon, Sparkles } from "lucide-react";

interface Model {
  id: string;
  model_name: string;
  trigger_word: string;
  trainingid: string;
}

export default function CreateImage() {
  const { user, isLoaded } = useUser();
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      fetchModels();
    }
  }, [isLoaded, user]);

  const fetchModels = async () => {
    try {
      const response = await fetch("/api/models");
      if (!response.ok) throw new Error("Failed to fetch models");
      const data = await response.json();
      setModels(data);
    } catch (error) {
      console.error("Error fetching models:", error);
      toast.error("Failed to fetch models. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModel || !prompt) {
      toast.error("Please select a model and enter a prompt.");
      return;
    }

    const model = models.find((m) => m.model_name === selectedModel);
    if (!model) {
      toast.error("Selected model not found.");
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const response = await fetch("/api/generate-model-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, modelId: model.trainingid }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(Boolean);

        for (const line of lines) {
          const data = JSON.parse(line);
          if (data.status === "processing") {
            toast.loading("Image generation in progress...");
          } else if (data.imageUrl) {
            setGeneratedImage(data.imageUrl);
            toast.success("Image generated successfully!");
          } else if (data.error) {
            throw new Error(data.error);
          }
        }
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error(
        error.message || "Failed to generate image. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = "generated-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!isLoaded || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar (top on mobile) */}
      <div className="w-full md:w-1/4 p-4 md:p-6 flex flex-col bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="mb-4">
            <select
              id="model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-2 border-2 border-white rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white bg-opacity-20 text-white"
            >
              <option value="">Select a model</option>
              {models.map((model) => (
                <option key={model.id} value={model.model_name}>
                  {model.model_name} (Trigger: {model.trigger_word})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt"
              className="w-full h-32 md:h-40 p-2 border-2 border-white rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-white bg-opacity-30 hover:bg-opacity-40 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 border-2 border-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Image"}
          </button>
        </form>
      </div>

      {/* Main content (bottom on mobile) */}
      <div className="w-full md:w-3/4 p-4 md:p-6 flex-grow bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64 w-full bg-white bg-opacity-20 rounded-xl">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
            <p className="ml-2 text-lg text-white">Generating image...</p>
          </div>
        ) : generatedImage ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-full h-3/4">
              <Image
                src={generatedImage}
                alt="Generated"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className="mt-4">
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-6 py-2 bg-white bg-opacity-30 hover:bg-opacity-40 text-white rounded-lg transition-colors border-2 border-white"
              >
                <ImageIcon className="mr-2" /> Download Image
              </button>
            </div>
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
}
