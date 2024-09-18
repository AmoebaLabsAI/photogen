import { NextResponse } from "next/server";
import { stripe } from "../../../lib/stripe";
import { sql } from "@vercel/postgres";

export async function POST(req: Request) {
  try {
    const { email, userId } = await req.json();

    if (!email || !userId) {
      return NextResponse.json(
        { error: "Missing email or userId" },
        { status: 400 }
      );
    }

    // Create or retrieve a Stripe customer
    let customer = await stripe.customers.list({ email: email, limit: 1 });
    let customerId;
    if (customer.data.length === 0) {
      const newCustomer = await stripe.customers.create({ email: email });
      customerId = newCustomer.id;
    } else {
      customerId = customer.data[0].id;
    }

    // Store the Stripe Customer ID in your database
    await sql`
      UPDATE users
      SET stripe_customer_id = ${customerId}
      WHERE id = ${userId};
    `;

    return NextResponse.json({ customerId: customerId });
  } catch (err: any) {
    console.error("Error creating/retrieving Stripe customer:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
