"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const AiModelPage: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files).slice(0, 10);
      setImages(fileArray);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }
    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));

    try {
      const response = await fetch("/api/create-model", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMessage("Model created successfully!");
        router.push("/models");
      } else {
        setError(data.message || "Failed to create model.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create a New AI Model</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label className="mb-2 font-semibold">Upload Images (Max 10)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="mb-4 p-2 border rounded"
        />
        {images.length > 0 && (
          <div className="mb-4">
            <p className="font-semibold">Selected Images:</p>
            <ul className="list-disc list-inside">
              {images.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        <button
          type="submit"
          disabled={isUploading}
          className={`px-4 py-2 bg-purple-600 text-white rounded ${
            isUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700"
          }`}
        >
          {isUploading ? "Uploading..." : "Create Model"}
        </button>
      </form>
    </div>
  );
};

export default AiModelPage;