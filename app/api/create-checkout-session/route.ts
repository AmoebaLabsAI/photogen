import { NextResponse } from "next/server";
import { stripe } from "../../../lib/stripe";

export async function POST(req: Request) {
  try {
    const { email, priceId } = await req.json();

    if (!email || !priceId) {
      return NextResponse.json(
        { error: "Missing email or priceId" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe`,
      customer_email: email,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.error("Error in create-checkout-session:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
