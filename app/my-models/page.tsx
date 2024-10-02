"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface Model {
  id: string;
  model_name: string;
  trigger_word: string;
  training_id: string;
  created_at: string;
}

export default function MyModels() {
  const { user, isLoaded } = useUser();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetchModels();
    }
  }, [isLoaded, user]);

  const fetchModels = async () => {
    try {
      const response = await fetch("/api/models");
      if (response.ok) {
        const data = await response.json();
        setModels(data);
      } else {
        throw new Error("Failed to fetch models");
      }
    } catch (error) {
      console.error("Error fetching models:", error);
      toast.error("Failed to fetch models. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteModel = async (model_name: string) => {
    if (confirm("Are you sure you want to delete this model?")) {
      try {
        const response = await fetch("/api/delete-model", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ model_name }),
        });

        if (response.ok) {
          setModels(models.filter((model) => model.model_name !== model_name));
          toast.success("Model deleted successfully");
        } else {
          throw new Error("Failed to delete model");
        }
      } catch (error) {
        console.error("Error deleting model:", error);
        toast.error("Failed to delete model. Please try again.");
      }
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Models</h1>
      {models.length === 0 ? (
        <p>You haven't created any models yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <div key={model.id} className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">{model.model_name}</h2>
              <p className="text-gray-600 mb-1">
                Trigger word: {model.trigger_word}
              </p>
              <p className="text-gray-600 mb-4">
                Created: {new Date(model.created_at).toLocaleDateString()}
              </p>
              <button
                onClick={() => deleteModel(model.model_name)}
                className="flex items-center justify-center w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Model
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
