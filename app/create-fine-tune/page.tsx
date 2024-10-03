"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

export default function CreateAIModel() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [images, setImages] = useState<string[]>([]);
  const [triggerWord, setTriggerWord] = useState("");
  const [modelName, setModelName] = useState("");
  const [loading, setLoading] = useState(false);
  const [remainingModels, setRemainingModels] = useState<number | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);

  useEffect(() => {
    const fetchModelCount = async () => {
      if (user) {
        try {
          const response = await fetch("/api/user-model-count");
          if (response.ok) {
            const data = await response.json();
            setRemainingModels(data.remainingModels);
            setSubscriptionTier(data.subscription_tier);
          }
        } catch (error) {
          console.error("Error fetching model count:", error);
        }
      }
    };
    if (isLoaded && user) {
      fetchModelCount();
    }
  }, [isLoaded, user]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading || images.length === 0 || !triggerWord || remainingModels === 0)
      return;
    setLoading(true);

    try {
      // Check remaining models on the server
      const checkResponse = await fetch("/api/user-model-count");
      if (!checkResponse.ok) {
        throw new Error("Failed to check remaining models");
      }
      const checkData = await checkResponse.json();
      if (checkData.remainingModels <= 0) {
        setRemainingModels(0);
        throw new Error("No model creations remaining");
      }

      const formData = new FormData();
      images.forEach((image, index) => {
        const file = dataURLtoFile(image, `image_${index + 1}.png`);
        formData.append("images", file);
      });
      formData.append("triggerWord", triggerWord);
      formData.append("modelName", modelName);

      const response = await fetch("/api/create-fine-tune", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Update model count after successful creation
        const countResponse = await fetch("/api/user-model-count", {
          method: "POST",
        });

        if (!countResponse.ok) {
          if (countResponse.status === 403) {
            setRemainingModels(0);
            throw new Error("Model creation limit reached");
          }
          throw new Error("Failed to update model count");
        }
        const countData = await countResponse.json();
        setRemainingModels(countData.remainingModels);
        setSubscriptionTier(countData.subscription_tier);

        router.push(
          `/model-created?modelName=${data.modelName}&triggerWord=${data.triggerWord}&trainingID=${data.trainingId}`
        );
      } else {
        throw new Error(data.error || "Failed to create model");
      }
    } catch (error) {
      console.error("Error creating model:", error);
      toast.error(error.message || "Failed to create model. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)![1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const getSubscriptionLimit = (tier: string | null) => {
    switch (tier) {
      case "premium":
        return Number(process.env.NEXT_PUBLIC_PRO_PLAN_MODEL_CREATION_LIMIT);
      case "basic":
        return Number(process.env.NEXT_PUBLIC_BASIC_PLAN_MODEL_CREATION_LIMIT);
      default:
        return Number(process.env.NEXT_PUBLIC_FREE_PLAN_MODEL_CREATION_LIMIT);
    }
  };

  if (!isLoaded || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar (top on mobile) */}
      <div className="w-full md:w-1/4 p-4 md:p-6 flex flex-col bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
        <form onSubmit={onSubmit} className="flex flex-col h-full">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter trigger word"
              value={triggerWord}
              onChange={(e) => setTriggerWord(e.target.value)}
              className="w-full p-2 border-2 border-white rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter a name for your model"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="w-full p-2 border-2 border-white rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70"
            />
          </div>
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                files.forEach((file) => {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImages((current) => [
                      ...current,
                      reader.result as string,
                    ]);
                  };
                  reader.readAsDataURL(file);
                });
              }}
              disabled={images.length >= 20}
              className="w-full p-2 border-2 border-white rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white bg-opacity-20 text-white file:bg-transparent file:border-0 file:text-white file:font-semibold"
            />
          </div>
          <button
            type="submit"
            disabled={
              loading ||
              images.length === 0 ||
              !triggerWord ||
              remainingModels === 0
            }
            className="w-full bg-white bg-opacity-30 hover:bg-opacity-40 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 border-2 border-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Model"}
          </button>

          {/* Remaining models count */}
          <p className="mt-2 text-white">
            {remainingModels !== null
              ? `${remainingModels} model creations remaining`
              : "Loading..."}
          </p>
          <p className="mt-2 text-white">
            Subscription: {subscriptionTier || "Loading..."}
          </p>

          {/* Subscription prompt when limit is reached */}
          {remainingModels === 0 && (
            <div className="mt-4 p-4 bg-white bg-opacity-20 rounded-xl">
              <p className="text-white">
                You've reached the limit of{" "}
                {getSubscriptionLimit(subscriptionTier)} models.
              </p>
              <p className="text-white mt-2">
                {subscriptionTier === "premium"
                  ? "You've used all your premium plan model creations."
                  : subscriptionTier === "basic"
                  ? "Upgrade to Premium for more model creations!"
                  : "Upgrade to Basic or Premium for more model creations!"}
              </p>
              {subscriptionTier !== "premium" && (
                <button
                  onClick={() => router.push("/index#subscribe")}
                  className="mt-4 inline-block px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold"
                >
                  {subscriptionTier === "basic"
                    ? "Upgrade To Premium"
                    : "Upgrade Plan"}
                </button>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Main content (bottom on mobile) */}
      <div className="w-full md:w-3/4 p-4 md:p-6 flex-grow bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64 w-full bg-white bg-opacity-20 rounded-xl">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
            <p className="ml-2 text-lg text-white">Creating model...</p>
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative w-full h-40">
                <Image
                  src={image}
                  alt={`Uploaded image ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 w-full bg-white bg-opacity-20 rounded-xl">
            <Sparkles className="w-8 h-8 text-white mr-2" />
            <p className="text-lg text-white">
              Upload images to create your AI model
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
