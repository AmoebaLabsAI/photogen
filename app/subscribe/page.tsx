"use client";

import React from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

function SubscribeButton({
  paymentLink,
  userId,
}: {
  paymentLink: string;
  userId: string;
}) {
  const handleClick = async () => {
    // Create a pre-session
    const response = await fetch("/api/create-pre-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    const { sessionId } = await response.json();

    // Redirect to Stripe Payment Link with session ID
    window.location.href = `${paymentLink}?client_reference_id=${sessionId}`;
  };

  return (
    <button
      onClick={handleClick}
      className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold text-lg shadow-lg hover:bg-opacity-90 transition-all duration-300"
    >
      Subscribe
    </button>
  );
}

const SubscribePage: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <h1 className="text-4xl font-bold text-white mb-8">Choose Your Plan</h1>
      <div className="flex flex-col sm:flex-row gap-6">
        {user && (
          <SubscribeButton
            paymentLink="https://buy.stripe.com/your_payment_link_here"
            userId={user.id}
          />
        )}
      </div>
      <Link href="/flux_pro" className="mt-8 text-white underline">
        Back to Flux Pro
      </Link>
    </div>
  );
};

export default SubscribePage;
