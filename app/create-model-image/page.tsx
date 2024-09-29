"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { generateAIModelImage } from "../../actions/replicate-actions";
import Replicate from "replicate";

interface Model {
  id: string;
  model_name: string;
  trigger_word: string;
  trainingid: string; // Updated to include training_id
}

export default function CreateImage() {
  const { user, isLoaded } = useUser();
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null); // New state to hold the generated image
  const [isLoading, setIsLoading] = useState(false); // New state to handle loading state

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

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
      console.log(data);
      setModels(data);
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  const getVersionId = async (trainingId: string) => {
    try {
      const response = await fetch(`/api/trainings?trainingID=${trainingId}`);
      if (!response.ok) throw new Error("Failed to fetch version ID");
      const data = await response.json();
      return data.versionId;
    } catch (error) {
      console.error("Error fetching version ID:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModel || !prompt) {
      alert("Please select a model and enter a prompt.");
      return;
    }

    const model = models.find((m) => m.model_name === selectedModel);
    if (!model) {
      alert("Selected model not found.");
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const url = await getVersionId(model.trainingid);

      const output = await generateAIModelImage(prompt, url);
      setGeneratedImage(output[0]);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        Create Image with Your AI Model
      </h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="model" className="block mb-2">
            Select Model:
          </label>
          <select
            id="model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-2 border rounded"
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
          <label htmlFor="prompt" className="block mb-2">
            Prompt:
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Image"}
        </button>
      </form>

      {generatedImage && (
        <div>
          <h2 className="text-xl font-bold mb-2">Generated Image:</h2>
          <Image
            src={generatedImage}
            alt="Generated"
            width={512}
            height={512}
          />
        </div>
      )}
    </div>
  );
}
