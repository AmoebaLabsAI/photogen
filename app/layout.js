"use client";

import "../styles/globals.css";
import Link from "next/link";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function RootLayout({ children }) {
  const DotIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        fill="currentColor"
      >
        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
      </svg>
    );
  };
  return (
    <html lang="en">
      <ClerkProvider>
        <body>
          <nav className="bg-white text-black p-4 fixed top-0 w-full z-50 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
              <Link href="/" className="text-xl font-bold">
                PhotoGen
              </Link>
              <div className="flex items-center space-x-6">
                <Link href="/#features" className="hover:text-gray-500">
                  Features
                </Link>
                <Link href="/#how-it-works" className="hover:text-gray-500">
                  How It Works
                </Link>
                <Link href="/#pricing" className="hover:text-gray-500">
                  Pricing
                </Link>
                <Link href="/#testimonials" className="hover:text-gray-500">
                  Testimonials
                </Link>
                <Link href="/#faq" className="hover:text-gray-500">
                  FAQ
                </Link>
                <Link href="/#contact" className="hover:text-gray-500">
                  Contact
                </Link>
                {/* CTA Button */}
                <Link
                  href="/create-fine-tune"
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-200"
                >
                  Create Your First AI Model
                </Link>
                <SignedOut>
                  <Link href="/sign-in" className="hover:text-gray-500">
                    Sign in
                  </Link>
                </SignedOut>
                <SignedIn>
                  <UserButton>
                    <UserButton.MenuItems>
                      <UserButton.Link
                        label="Manage Subscription"
                        labelIcon={<DotIcon />}
                        href="https://billing.stripe.com/p/login/00geVi5UGcow5Ak5kk"
                      />
                      <UserButton.Link
                        label="Manage AI Models"
                        labelIcon={<DotIcon />}
                        href="/my-models"
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                </SignedIn>
              </div>
            </div>
          </nav>
          <div className="pt-20">{/* Offset for fixed navbar */}</div>
          {children}
        </body>
      </ClerkProvider>
    </html>
  );
}