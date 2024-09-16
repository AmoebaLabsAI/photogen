"use client";

import React from "react";
import Link from "next/link";

const SubscribePage: React.FC = () => {
  const handleSubscribe = (tier: string) => {
    if (tier === "pro") {
      window.location.href = "https://buy.stripe.com/aEUeWz1JkfRxfss144";
    } else if (tier === "basic") {
      window.location.href = "https://buy.stripe.com/4gwg0DfAaeNta889AB";
    } else {
      console.log("Invalid tier selected");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <h1 className="text-4xl font-bold text-white mb-8">Choose Your Plan</h1>
      <div className="flex flex-col sm:flex-row gap-6">
        <button
          onClick={() => handleSubscribe("basic")}
          className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold text-lg shadow-lg hover:bg-opacity-90 transition-all duration-300"
        >
          Basic
        </button>
        <button
          onClick={() => handleSubscribe("pro")}
          className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold text-lg shadow-lg hover:bg-opacity-90 transition-all duration-300"
        >
          Pro
        </button>
      </div>
      <Link href="/flux_pro" className="mt-8 text-white underline">
        Back to Flux Pro
      </Link>
    </div>
  );
};

export default SubscribePage;