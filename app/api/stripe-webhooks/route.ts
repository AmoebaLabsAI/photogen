import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import Stripe from "stripe";

// Configure Stripe outside the handler function
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20", // Updated to the latest API version
});

export async function POST(req: Request) {
  console.log("Incoming Stripe webhook request");

  // Get the raw body as a string
  const rawBody = await req.text();

  console.log("Raw body received");

  const sig = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("Constructed Stripe event:", event.type);
  } catch (err: any) {
    console.error("Error constructing Stripe event:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const sessionId = (event.data.object as Stripe.Checkout.Session).id;

    // Retrieve the session with line_items expanded
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    console.log("Full session data:", session);

    const userId = session.client_reference_id;

    if (!userId) {
      console.error("No user ID found in session metadata");
      return NextResponse.json({ error: "No user ID found" }, { status: 400 });
    }

    // Determine the subscription tier
    let subscriptionTier = "free";
    if (session.line_items && session.line_items.data.length > 0) {
      const productName = session.line_items.data[0].description?.toLowerCase();
      if (productName?.includes("pro")) {
        subscriptionTier = "pro";
      } else if (productName?.includes("basic")) {
        subscriptionTier = "basic";
      }
    }

    try {
      // Find the user by ID
      const result = await sql`
        SELECT id, email FROM users WHERE id = ${userId}
      `;

      if (result.rows.length === 0) {
        console.error("No user found with ID:", userId);
        return NextResponse.json(
          { error: "No matching user found" },
          { status: 400 }
        );
      }

      const user = result.rows[0];

      // Update the subscriptions table
      await sql`
        INSERT INTO subscriptions (user_id, subscription_status, stripe_customer_id, stripe_subscription_id, subscription_tier)
        VALUES (${user.id}, 'active', ${session.customer as string}, ${
        session.subscription as string
      }, ${subscriptionTier})
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          subscription_status = 'active',
          stripe_customer_id = ${session.customer as string},
          stripe_subscription_id = ${session.subscription as string},
          subscription_tier = ${subscriptionTier},
          updated_at = CURRENT_TIMESTAMP
      `;

      // Update the users table
      await sql`
        UPDATE users
        SET subscription_tier = ${subscriptionTier}
        WHERE id = ${user.id};
      `;

      console.log(
        `Subscription updated for user with ID: ${user.id}, Tier: ${subscriptionTier}`
      );
    } catch (error) {
      console.error("Error updating subscription:", error);
      return NextResponse.json(
        { error: "Error updating subscription" },
        { status: 500 }
      );
    }
  }

  console.log("Webhook processed successfully");
  return NextResponse.json({ received: true });
}
