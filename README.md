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

## App Setup and Information Flow

1. User Authentication: Clerk handles user authentication and management.
2. Image Generation: Users can generate images using various AI models through Replicate's API.
3. Model Fine-tuning: Users can create custom AI models based on their own images.
4. Subscription Management: Stripe handles subscriptions and payments.
5. Image Storage: Generated images are stored in Amazon S3.
6. Database: User data, subscriptions, and image metadata are stored in Postgres.

## API Routes

### `/api/clerk-webhook`

- Method: POST
- Description: Handles Clerk webhooks for user creation events.
- Parameters: None (Webhook payload is processed)

### `/api/stripe-webhooks`

- Method: POST
- Description: Handles Stripe webhooks for subscription events.
- Parameters: None (Webhook payload is processed)

### `/api/create-fine-tune`

- Method: POST
- Description: Initiates the creation of a fine-tuned AI model.
- Parameters:
  - `images`: Array of image files
  - `triggerWord`: String
  - `modelName`: String

### `/api/generate-model-image`

- Method: POST
- Description: Generates an image using a fine-tuned model.
- Parameters:
  - `prompt`: String
  - `trainingId`: String

### `/api/user-image-count`

- Method: GET
- Description: Retrieves the user's image generation count and limit.
- Parameters: None

### `/api/user-model-count`

- Method: GET
- Description: Retrieves the user's model creation count and limit.
- Parameters: None

### `/api/models`

- Method: GET
- Description: Retrieves the user's created models.
- Parameters: None

### `/api/delete-model`

- Method: DELETE
- Description: Deletes a user's created model.
- Parameters:
  - `model_name`: String

## Environment Variables Setup

In order to clone this repo, you will need to setup several environment variables. These can be obtained by signing up for the relevant services.

- REPLICATE_API_TOKEN
- AWS_REGION
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
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
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_PRO_PRICE_ID
- STRIPE_BASIC_PRICE_ID
- STRIPE_WEBHOOK_SECRET
- WEBHOOK_SECRET (from stripe)
- PRO_PLAN_IMAGE_GENERATION_LIMIT
- BASIC_PLAN_IMAGE_GENERATION_LIMIT
- FREE_PLAN_IMAGE_GENERATION_LIMIT

## SQL Setup

Create the following tables in your database:
sql
-- Users table
CREATE TABLE users (
id SERIAL PRIMARY KEY,
clerk_id TEXT UNIQUE NOT NULL,
email TEXT UNIQUE NOT NULL,
subscription_tier TEXT NOT NULL DEFAULT 'free',
image_count INTEGER NOT NULL DEFAULT 0,
model_count INTEGER NOT NULL DEFAULT 0,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Models table
CREATE TABLE models (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id),
model_name TEXT NOT NULL,
trigger_word TEXT NOT NULL,
training_id TEXT UNIQUE NOT NULL,
status TEXT NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Images table
CREATE TABLE images (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id),
model_id INTEGER REFERENCES models(id),
prompt TEXT NOT NULL,
image_url TEXT NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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
