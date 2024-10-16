"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { TwitterTweetEmbed } from 'react-twitter-embed';
import ImageCarousel from "./components/ImageCarousel";

// Component for rendering a subscription plan card
const SubscriptionPlan = ({
  title,
  price,
  features,
  link,
  userId,
  userEmail,
  yearly,
  className,
}) => {
  const paymentLinkWithMetadata = `${link}?client_reference_id=${userId}&prefilled_email=${encodeURIComponent(
    userEmail
  )}`;

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      <h3 className="text-xl font-bold mb-2 text-center">{title}</h3>
      <p className="text-2xl font-bold mb-4 text-center">
        ${price}
        <span className="text-sm font-normal">{yearly ? "/year" : "/month"}</span>
      </p>
      <Link
        href={paymentLinkWithMetadata}
        className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-full transition-colors duration-200 inline-block mb-4 w-full text-center"
      >
        Get Started →
      </Link>
      <ul className="text-left space-y-2 text-sm">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-green-500 mr-2 text-lg">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function LandingPage() {
  const { user, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);
  const [pricingPeriod, setPricingPeriod] = useState('monthly');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) return null;

  const userEmail = user?.primaryEmailAddress?.emailAddress || "";

  const plans = [
    {
      title: "Starter Plan",
      monthlyPrice: "19",
      yearlyPrice: "114",
      features: [
        "Take 100 AI Photos (credits)",
        "Create 1 AI Model per month",
        "Stable Diffusion: worse legacy model",
        "Take 1 photo at a time",
        "Use any photo pack",
        "For personal use only",
        "Watermarked photos"
      ],
      link: "https://buy.stripe.com/starter_plan_link"
    },
    {
      title: "Pro Plan",
      monthlyPrice: "39",
      yearlyPrice: "234",
      features: [
        "Take 1,000 AI Photos (credits)",
        "Create 3 AI Models per month",
        "Flux™: new photorealistic model",
        "For each model you get:",
        "8x free profile pics",
        "8x free professional headshots",
        "8x free dating app photos",
        "8x free outfit ideas",
        "8x free social media posts",
        "All Starter features, plus:",
        "Take up to 4 photos in parallel",
        "Write your own prompts",
        "Copy any photo",
        "Commercial use license"
      ],
      link: "https://buy.stripe.com/pro_plan_link"
    },
    {
      title: "Premium Plan",
      monthlyPrice: "99",
      yearlyPrice: "594",
      features: [
        "Take 3,000 AI Photos (credits)",
        "Create 10 AI Models per month",
        "Flux™: new photorealistic model",
        "For each model you get:",
        "8x free profile pics",
        "8x free professional headshots",
        "8x free dating app photos",
        "8x free outfit ideas",
        "8x free social media posts",
        "All Pro features, plus:",
        "Take up to 8 photos in parallel",
        "Use the magic photo editor",
        "Try on clothes",
        "Make videos from photos",
        "Access to the community chat",
        "Early access to new features"
      ],
      link: "https://buy.stripe.com/premium_plan_link"
    },
    {
      title: "Business Plan",
      monthlyPrice: "299",
      yearlyPrice: "1794",
      features: [
        "Take 10,000 AI Photos (credits)",
        "Create 50 AI Models per month",
        "Flux™: new photorealistic model",
        "For each model you get:",
        "8x free profile pics",
        "8x free professional headshots",
        "8x free dating app photos",
        "8x free outfit ideas",
        "8x free social media posts",
        "All Premium features, plus:",
        "Take up to 16 photos in parallel",
        "Unlimited photo storage",
        "Priority: faster response times"
      ],
      link: "https://buy.stripe.com/business_plan_link"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6 fixed w-full z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-black">
            Photogen
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="#how-it-works" className="text-black hover:text-gray-600">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-black hover:text-gray-600">
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/create-fine-tune"
                  className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200"
                >
                  Create Your First AI Model
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow pt-16"> {/* Add padding-top to account for fixed header */}
        {/* Hero Section with Carousel */}
        <section className="relative flex flex-col items-center justify-center px-6 h-screen bg-transparent">
          <div className="absolute inset-0">
            <ImageCarousel />
          </div>
          <div className="w-full md:w-3/4 max-w-4xl text-center relative z-20 bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black">
              Throw away your Camera – Let AI Capture Your World!
            </h1>
            <p className="text-lg md:text-xl mb-6 text-black">
              Revolutionize your memories with Photogen, powered by state-of-the-art models and crafted by two AI enthusiasts. Say goodbye to tedious photo shoots and hello to breathtaking images and videos, all generated by AI right from your device.
            </p>
            <Link
              href="/create-fine-tune"
              className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 inline-block"
            >
              Create Your First AI Model
            </Link>
          </div>
        </section>

        {/* Content Sections */}
        <div className="bg-gray-100">
          {/* Video Placeholder Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold mb-8 text-black text-center">
                See Photogen in Action
              </h2>
              <div className="w-full max-w-3xl mx-auto">
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Demo Video Placeholder</span>
                </div>
              </div>
            </div>
          </section>

          {/* Social Proof Section */}
          <section className="py-16 bg-gray-100">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold mb-8 text-black text-center">
                Loved by Creators, Influencers, and Businesses Worldwide
              </h2>
              <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-6">
                {/* Twitter Testimonials */}
                <div className="w-full max-w-sm bg-white p-4 rounded shadow">
                  <TwitterTweetEmbed tweetId="1840085947624632624" />
                </div>
                <div className="w-full max-w-sm bg-white p-4 rounded shadow">
                  <TwitterTweetEmbed tweetId="1840085947624632624" />
                </div>
                <div className="w-full max-w-sm bg-white p-4 rounded shadow">
                  <TwitterTweetEmbed tweetId="1840085947624632624" />
                </div>
              </div>
            </div>
          </section>

          {/* Old Way vs New Way Comparison Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold mb-8 text-black">Content Creation is Changing...don't get left behind!</h2>
              <div className="flex flex-col md:flex-row items-stretch space-y-8 md:space-y-0 md:space-x-8">
                {/* Old Way */}
                <div className="md:w-1/2 bg-gray-100 p-6 rounded-lg flex flex-col items-center border-2 border-gray-300">
                  <div className="w-full h-48 mb-4 flex items-center justify-center">
                    <Image
                      src="/images/old.jpg"
                      alt="Traditional Photography"
                      width={300}
                      height={200}
                      objectFit="cover"
                      className="grayscale" // Add this line
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-black">The Old Way</h3>
                  <h4 className="text-xl mb-2 text-black">Traditional Photography</h4>
                  <p className="text-md mb-4 text-black">
                    Time-consuming, expensive, and resource-intensive
                  </p>
                  <ul className="list-disc list-inside marker:text-3xl text-center text-black space-y-4 text-xl flex-grow">
                    <li>Specific location needed</li>
                    <li>Large crew required</li>
                    <li>Expensive equipment</li>
                    <li>Time-consuming setup and editing</li>
                  </ul>
                </div>
                {/* New Way */}
                <div className="md:w-1/2 bg-gray-100 p-6 rounded-lg flex flex-col items-center border-2 border-blue-500">
                  <div className="w-full h-48 mb-4 flex items-center justify-center">
                    <Image src="/images/new.jpg" alt="AI-Powered Photography" width={300} height={200} objectFit="cover" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-black">
                    The New Way with Photogen
                  </h3>
                  <h4 className="text-xl mb-2 text-black">AI-Powered Creativity</h4>
                  <p className="text-md mb-4 text-black">
                    Fast, affordable, and high-quality visuals
                  </p>
                  <ul className="list-disc list-inside marker:text-3xl text-center text-black space-y-4 text-xl flex-grow">
                    <li>Create images anywhere</li>
                    <li>One person, one laptop</li>
                    <li>No expensive equipment needed</li>
                    <li>World-class results in minutes</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose Photogen Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold mb-8 text-black text-center">Why Choose Photogen?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Benefit 1 */}
                <div className="flex flex-col items-center">
                  <div className="text-4xl mb-4">🌟</div>
                  <h3 className="text-xl font-bold mb-2">High Quality Images Every Time</h3>
                  <p className="text-base text-black text-center">
                    Create professional-grade visuals every time.
                  </p>
                </div>
                {/* Benefit 2 */}
                <div className="flex flex-col items-center">
                  <div className="text-4xl mb-4">⏱️</div>
                  <h3 className="text-xl font-bold mb-2">Save Time</h3>
                  <p className="text-base text-black text-center">
                    Generate photos in minutes, eliminating manual editing.
                  </p>
                </div>
                {/* Benefit 3 */}
                <div className="flex flex-col items-center">
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="text-xl font-bold mb-2">Creative Freedom</h3>
                  <p className="text-base text-black text-center">
                    Customize AI models easily.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="py-16 bg-gray-100">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold mb-8 text-black text-center">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">📸</div>
                  <h3 className="text-xl font-bold mb-2 text-black">Upload Your Photos</h3>
                  <p className="text-black">Upload a few photos of yourself to train the AI model.</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🤖</div>
                  <h3 className="text-xl font-bold mb-2 text-black">AI Magic Happens</h3>
                  <p className="text-black">Our AI processes your photos and creates a custom model.</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="text-xl font-bold mb-2 text-black">Create Amazing Images</h3>
                  <p className="text-black">Use your custom AI model to generate incredible images of yourself.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-16 bg-white">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold mb-8 text-black text-center">Select Your Ideal Package</h2>

              {/* Pricing period toggle */}
              <div className="flex justify-center mb-8">
                <button
                  className={`px-4 py-2 rounded-l-lg ${pricingPeriod === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => setPricingPeriod('monthly')}
                >
                  Pay Monthly
                </button>
                <button
                  className={`px-4 py-2 rounded-r-lg ${pricingPeriod === 'yearly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => setPricingPeriod('yearly')}
                >
                  Annual Plan (Get 6+ months on us)
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {plans.map((plan, index) => (
                  <SubscriptionPlan
                    key={index}
                    title={plan.title}
                    price={pricingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                    features={plan.features}
                    link={plan.link}
                    userId={user?.id}
                    userEmail={userEmail}
                    yearly={pricingPeriod === 'yearly'}
                    className={index === 1 ? "transform scale-105 shadow-xl border-2 border-blue-500" : ""}
                  />
                ))}
              </div>

              <p className="text-center mt-8 text-gray-600">
                {pricingPeriod === 'monthly' ? (
                  <button onClick={() => setPricingPeriod('yearly')} className="text-blue-500 hover:underline">
                    Unlock savings with our annual plan (6+ months complimentary) ↗
                  </button>
                ) : (
                  <button onClick={() => setPricingPeriod('monthly')} className="text-blue-500 hover:underline">
                    Explore our flexible monthly options ↗
                  </button>
                )}
              </p>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="py-16 bg-gray-100">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold mb-8 text-black text-center">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {/* FAQ Item 1 */}
                <details className="group bg-white">
                  <summary className="flex justify-between items-center cursor-pointer p-4">
                    <span className="font-semibold">What is Photogen?</span>
                    <svg
                      className="w-6 h-6 transition-transform duration-200 group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-4 bg-gray-50">
                    <p className="text-gray-700">
                      Photogen is an AI-powered platform that revolutionizes content creation. It allows users to generate high-quality, customized images and videos using advanced AI models, without the need for traditional photography equipment or extensive editing skills.
                    </p>
                  </div>
                </details>

                {/* FAQ Item 2 */}
                <details className="group bg-white">
                  <summary className="flex justify-between items-center cursor-pointer p-4">
                    <span className="font-semibold">How does Photogen work?</span>
                    <svg
                      className="w-6 h-6 transition-transform duration-200 group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-4 bg-gray-50">
                    <p className="text-gray-700">
                      Photogen works in three simple steps: 1) You upload a few photos to train your custom AI model. 2) Our advanced AI processes these photos and creates a personalized model. 3) You can then use this model to generate a wide variety of high-quality images based on your prompts or ideas.
                    </p>
                  </div>
                </details>

                {/* FAQ Item 3 */}
                <details className="group bg-white">
                  <summary className="flex justify-between items-center cursor-pointer p-4">
                    <span className="font-semibold">What kind of images can I create with Photogen?</span>
                    <svg
                      className="w-6 h-6 transition-transform duration-200 group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-4 bg-gray-50">
                    <p className="text-gray-700">
                      With Photogen, you can create a wide range of images, including professional headshots, profile pictures, outfit ideas, and social media content. The AI can place you in various settings, styles, and scenarios, limited only by your imagination and the prompts you provide.
                    </p>
                  </div>
                </details>

                {/* FAQ Item 4 */}
                <details className="group bg-white">
                  <summary className="flex justify-between items-center cursor-pointer p-4">
                    <span className="font-semibold">Is my data safe with Photogen?</span>
                    <svg
                      className="w-6 h-6 transition-transform duration-200 group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-4 bg-gray-50">
                    <p className="text-gray-700">
                      Yes, we take data privacy and security very seriously. Your uploaded photos and generated images are stored securely and are never shared without your permission. We use industry-standard encryption and follow best practices for data protection. For more details, please refer to our Privacy Policy.
                    </p>
                  </div>
                </details>

                {/* FAQ Item 5 */}
                <details className="group bg-white">
                  <summary className="flex justify-between items-center cursor-pointer p-4">
                    <span className="font-semibold">Can I use Photogen for commercial purposes?</span>
                    <svg
                      className="w-6 h-6 transition-transform duration-200 group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-4 bg-gray-50">
                    <p className="text-gray-700">
                      Yes, our Pro, Premium, and Business plans include a commercial use license. This means you can use the images generated with Photogen for your business, marketing materials, or any other commercial purposes. The Starter plan is for personal use only.
                    </p>
                  </div>
                </details>

                {/* FAQ Item 6 */}
                <details className="group bg-white">
                  <summary className="flex justify-between items-center cursor-pointer p-4">
                    <span className="font-semibold">What's the difference between Stable Diffusion and Flux™?</span>
                    <svg
                      className="w-6 h-6 transition-transform duration-200 group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-4 bg-gray-50">
                    <p className="text-gray-700">
                      Stable Diffusion is our legacy model available in the Starter plan. It produces good results but may have some limitations. Flux™ is our new, advanced photorealistic model available in Pro plans and above. It offers superior image quality, more accurate representations, and a wider range of creative possibilities.
                    </p>
                  </div>
                </details>

                {/* FAQ Item 7 */}
                <details className="group bg-white">
                  <summary className="flex justify-between items-center cursor-pointer p-4">
                    <span className="font-semibold">Can I cancel or change my subscription?</span>
                    <svg
                      className="w-6 h-6 transition-transform duration-200 group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-4 bg-gray-50">
                    <p className="text-gray-700">
                      Yes, you can cancel or change your subscription at any time. If you cancel, you'll continue to have access to Photogen until the end of your current billing period. For plan changes, the new rate will be applied at the start of your next billing cycle. There are no long-term commitments or cancellation fees.
                    </p>
                  </div>
                </details>
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold mb-4 text-black">
                Ready to Create Stunning AI Visuals?
              </h2>
              <p className="text-lg mb-6 text-black">
                Click below to create your first AI model and bring your ideas to life!
              </p>
              <Link
                href="/create-fine-tune"
                className="bg-black text-white hover:bg-gray-800 font-bold py-3 px-6 rounded-full transition-colors duration-200 inline-block"
              >
                Create Your First AI Model
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Photogen</h3>
              <p className="text-sm">&copy; {new Date().getFullYear()} Photogen. All rights reserved.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/#features" className="hover:text-gray-300">Features</Link></li>
                <li><Link href="/#how-it-works" className="hover:text-gray-300">How It Works</Link></li>
                <li><Link href="/#pricing" className="hover:text-gray-300">Pricing</Link></li>
                <li><Link href="/#faq" className="hover:text-gray-300">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/blog" className="hover:text-gray-300">Blog</Link></li>
                <li><Link href="/tutorials" className="hover:text-gray-300">Tutorials</Link></li>
                <li><Link href="/support" className="hover:text-gray-300">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-gray-300">Terms of Service</Link></li>
                <li><Link href="/contact" className="hover:text-gray-300">Contact Us</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}