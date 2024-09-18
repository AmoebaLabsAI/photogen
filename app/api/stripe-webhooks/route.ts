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
    const session = event.data.object as Stripe.Checkout.Session;
    const preSessionId = session.client_reference_id;

    if (!preSessionId) {
      console.error("No pre-session ID found in session");
      return NextResponse.json(
        { error: "No pre-session ID found" },
        { status: 400 }
      );
    }

    try {
      // Find the user by pre-session ID
      const result = await sql`
        SELECT users.id, users.email 
        FROM users 
        JOIN pre_sessions ON users.id = pre_sessions.user_id 
        WHERE pre_sessions.id = ${preSessionId}
      `;

      if (result.rows.length === 0) {
        console.error("No user found for pre-session ID:", preSessionId);
        return NextResponse.json(
          { error: "No matching user found" },
          { status: 400 }
        );
      }

      const user = result.rows[0];

      // Update the subscriptions table
      await sql`
        INSERT INTO subscriptions (user_id, subscription_status, stripe_customer_id, stripe_subscription_id)
        VALUES (${user.id}, 'active', ${session.customer as string}, ${
        session.subscription as string
      })
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          subscription_status = 'active',
          stripe_subscription_id = ${session.subscription as string},
          updated_at = CURRENT_TIMESTAMP
      `;

      // Update the users table
      await sql`
        UPDATE users
        SET subscription_tier = 'pro'
        WHERE id = ${user.id};
      `;

      // Delete the pre-session
      await sql`
        DELETE FROM pre_sessions WHERE id = ${preSessionId}
      `;

      console.log(`Subscription updated for user with ID: ${user.id}`);
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
