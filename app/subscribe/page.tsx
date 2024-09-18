"use client";

import React from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function SubscribeButton({
  priceId,
  email,
}: {
  priceId: string;
  email: string;
}) {
  const handleSubscribe = async () => {
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, priceId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { sessionId } = await response.json();

      if (!sessionId) {
        throw new Error("No session ID returned");
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe has not been initialized");
      }

      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error("Error in handleSubscribe:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold text-lg shadow-lg hover:bg-opacity-90 transition-all duration-300"
    >
      Subscribe
    </button>
  );
}

const SubscribePage: React.FC = () => {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress || "";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <h1 className="text-4xl font-bold text-white mb-8">Choose Your Plan</h1>
      <div className="flex flex-col sm:flex-row gap-6">
        {user && (
          <>
            <SubscribeButton
              email={email}
              priceId="price_1PzYdqB1PoOPhnz87ZsgFJIb" // Basic plan price ID
            />
          </>
        )}
      </div>
      <Link href="/flux_pro" className="mt-8 text-white underline">
        Back to Flux Pro
      </Link>
    </div>
  );
};

export default SubscribePage;
