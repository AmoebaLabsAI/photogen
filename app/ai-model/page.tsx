"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, ImageIcon, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function AIModelPage() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [triggerWord, setTriggerWord] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        const file = dataURLtoFile(image, `image_${index + 1}.png`);
        formData.append("images", file);
      });
      formData.append("triggerWord", triggerWord);

      const response = await fetch("/api/create-model", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create model");
      }

      const data = await response.json();
      console.log("Model created:", data);
      toast.success("Model created successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating model:", error);
      toast.error("Failed to create model. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)![1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Create AI Model</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="triggerWord" className="block mb-2">Trigger Word</label>
          <input
            id="triggerWord"
            type="text"
            placeholder="Enter trigger word"
            value={triggerWord}
            onChange={(e) => setTriggerWord(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Upload Images (Max 20)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setImages(current => [...current, reader.result as string]);
                };
                reader.readAsDataURL(file);
              });
            }}
            disabled={images.length >= 20}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading || images.length === 0 || !triggerWord}
          className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Model"}
        </button>
      </form>
    </div>
  );
}