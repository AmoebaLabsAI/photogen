import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import Stripe from "stripe";

// Initialize Stripe with the secret key from environment variables
// The '!' is a non-null assertion operator, telling TypeScript that we're sure STRIPE_SECRET_KEY is defined
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20", // Specify the Stripe API version we're using
});

// This is the main function that handles POST requests to this route
export async function POST(req: Request) {
  console.log("Incoming Stripe webhook request");

  // Get the raw body as a string. This is important for webhook signature verification
  const rawBody = await req.text();
  console.log("Raw body received");

  // Get the Stripe signature from the request headers
  // This signature is used to verify that the webhook came from Stripe
  const sig = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    // Verify the webhook signature and construct the event
    // This ensures that the webhook is legitimate and came from Stripe
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("Constructed Stripe event:", event.type);
  } catch (err: any) {
    // If verification fails, log the error and return a 400 response
    console.error("Error constructing Stripe event:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the 'checkout.session.completed' event
  // ASSUMPTION: This event was triggered by the user clicking a Stripe Payment
  // link from inside the web app, so we have forwarded the userId in the URL params of the Payment link
  // This event is triggered when a customer successfully completes the checkout process
  if (event.type === "checkout.session.completed") {
    const sessionId = (event.data.object as Stripe.Checkout.Session).id;

    // Retrieve the full session data with line items
    // This gives us more details about the purchase
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    console.log("Full session data:", session);

    // Get the user ID from the client_reference_id
    // This ID was set when creating the checkout session and helps us identify the user
    const userId = session.client_reference_id;

    if (!userId) {
      console.error("No user ID found in session metadata");
      return NextResponse.json({ error: "No user ID found" }, { status: 400 });
    }

    // Determine the subscription tier based on the product name
    // This logic assumes that the product name contains either "pro" or "basic"
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
      // Find the user in the database
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

      // Update or insert the subscription information in the database
      // This uses an "upsert" operation - insert if not exists, update if exists
      await sql`
        INSERT INTO subscriptions (user_id, email, subscription_status, stripe_customer_id, stripe_subscription_id, subscription_tier)
        VALUES (${user.id}, ${user.email}, 'active', ${
        session.customer as string
      }, ${session.subscription as string}, ${subscriptionTier})
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          email = EXCLUDED.email,
          subscription_status = 'active',
          stripe_customer_id = ${session.customer as string},
          stripe_subscription_id = ${session.subscription as string},
          subscription_tier = ${subscriptionTier},
          updated_at = CURRENT_TIMESTAMP
      `;

      // Update the user's subscription tier in the users table
      await sql`
        UPDATE users
        SET subscription_tier = ${subscriptionTier}
        WHERE id = ${user.id};
      `;

      console.log(
        `Subscription updated for user with ID: ${user.id}, Email: ${user.email}, Tier: ${subscriptionTier}`
      );
    } catch (error) {
      // If there's an error updating the database, log it and return a 500 response
      console.error("Error updating subscription:", error);
      return NextResponse.json(
        { error: "Error updating subscription" },
        { status: 500 }
      );
    }
  }

  // If everything went well, log success and return a 200 response
  console.log("Webhook processed successfully");
  return NextResponse.json({ received: true });
}
