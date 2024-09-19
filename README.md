# Photogen

Photogen is an open-source AI image generation website. It allows users to create images using the latest text-to-image models. The site is built using the following technologies:

- Next.js as the React web application framework
- Postgres as the database
- Clerk as the authentication provider
- Stripe as the billing provider
- Tailwind CSS for styling
- Amazon S3 for image storage
- Replicate for image model APIs
- Vercel for deployment

## Environment Variables Setup

In order to clone this repo, you will need to setup several environment variables. These can be obtained by signing up for the relevant services.

- REPLICATE_API_TOKEN
- AWS_REGION
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- CLERK_ENCRYPTION_KEY="89a0d42c0213662e98c113771eb2ab71d0b01943a99ab7352c27dbcce5edc55e"
- NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
- NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
- NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
- NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
- NEXT_PUBLIC_BASE_URL="http://localhost:3000"
- POSTGRES_URL
- POSTGRES_PRISMA_URL
- POSTGRES_URL_NON_POOLING
- POSTGRES_USER
- POSTGRES_HOST
- POSTGRES_PASSWORD
- POSTGRES_DATABASE
- STRIPE_SECRET_KEY
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_hix4y0kxYKyS8nKKfFUtu7DJ00HRoWMDZN"
- STRIPE_PRO_PRICE_ID="price_1PzYdqB1PoOPhnz87ZsgFJIb"
- STRIPE_BASIC_PRICE_ID="price_1PzYdqB1PoOPhnz87ZsgFJIb"
- STRIPE_WEBHOOK_SECRET="whsec_HDUBD08d124onIKmavskAxRXIpqxN1zS"
- WEBHOOK_SECRET (from stripe)
- PRO_PLAN_IMAGE_GENERATION_LIMIT
- BASIC_PLAN_IMAGE_GENERATION_LIMIT
- FREE_PLAN_IMAGE_GENERATION_LIMIT

## SQL Setup

Create the following tables in your database

```sql
-- Create users table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    subscription_tier TEXT DEFAULT 'free'
);

-- Create subscriptions table
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id TEXT UNIQUE REFERENCES users(id),
    email TEXT NOT NULL,
    subscription_status TEXT NOT NULL,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    subscription_tier TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_image_counts table
CREATE TABLE user_image_counts (
    user_id TEXT PRIMARY KEY REFERENCES users(id),
    image_count INTEGER DEFAULT 0
);

-- Create images table
CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    image_url TEXT NOT NULL,
    s3_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Noteworthy files

- [app/page.js](app/page.js) - React frontend that renders the home page in the browser
- [app/api/clerk-webhook/route.js](app/api/clerk-webhook/route.js) - API endpoint that responds to incoming webhooks from Clerk when users sign up for the service
- [app/api/stripe-webhooks/route.js](app/api/stripe-webhooks/route.js) - API endpoint that responds to incoming webhooks from Stripe when users purchase subscriptions
- [app/api/webhooks/route.js](app/api/webhooks/route.js) - API endpoint that receives and validates webhooks from Replicate

## Webhook Handling

### Clerk Webhooks

- Handled in `app/api/clerk-webhook/route.ts`
- Processes user creation events
- Updates user information in the database
- Sets initial subscription tier to 'free' in Clerk's private metadata

### Stripe Webhooks

- Handled in `app/api/stripe-webhooks/route.ts`
- Processes successful checkout events
- Updates user subscription information in the database
- Determines and updates subscription tier based on the purchased product

## Running the app

Install dependencies:

```console
npm install
```

Create a git-ignored text file for storing secrets like your API token:

```
cp .env.example .env.local
```

Run the development server:

```console
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.
