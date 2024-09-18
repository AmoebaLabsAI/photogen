import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import Stripe from "stripe";

// Configure Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  console.log("Incoming Stripe webhook request");

  // Get the raw body as a buffer
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

  if (event.type === "customer.subscription.created") {
    const subscription = event.data.object as Stripe.Subscription;
    const customer = (await stripe.customers.retrieve(
      subscription.customer as string
    )) as Stripe.Customer;
    console.log("Customer data:", customer);
    const email = customer.email;

    if (email) {
      try {
        // Update the subscriptions table
        await sql`
          INSERT INTO subscriptions (email, subscription_status, stripe_customer_id, stripe_subscription_id)
          VALUES (${email}, ${subscription.status}, ${
          subscription.customer as string
        }, ${subscription.id})
          ON CONFLICT (email) 
          DO UPDATE SET 
            subscription_status = ${subscription.status},
            stripe_customer_id = ${subscription.customer as string},
            stripe_subscription_id = ${subscription.id},
            updated_at = CURRENT_TIMESTAMP
        `;

        // Update the users table
        await sql`
          UPDATE users
          SET subscription_tier = 'pro'
          WHERE email = ${email};
        `;

        console.log(`Subscription updated for user with email: ${email}`);
      } catch (error) {
        console.error("Error updating subscription:", error);
        return NextResponse.json(
          { error: "Error updating subscription" },
          { status: 500 }
        );
      }
    } else {
      console.error("No email found for the customer");
      return NextResponse.json(
        { error: "No email found for the customer" },
        { status: 400 }
      );
    }
  }

  console.log("Webhook processed successfully");
  return NextResponse.json({ received: true });
}
