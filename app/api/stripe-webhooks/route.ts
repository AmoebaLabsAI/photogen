import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import { sql } from "@vercel/postgres";
import Stripe from "stripe";

export async function POST(req: NextApiRequest) {
  // Configure Stripe
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-06-20", // Use the latest API version
  });

  const buffer = (req: NextApiRequest) => {
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];

      req.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      req.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      req.on("error", reject);
    });
  };

  console.log("Incoming Stripe webhook request");

  // Get the raw body as a buffer
  const body = await buffer(req);

  console.log("Raw body received");

  const sig = req.headers["stripe-signature"];
  if (typeof sig !== "string") {
    throw new Error("Invalid stripe signature");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
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
