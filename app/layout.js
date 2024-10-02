"use client";

import "../styles/globals.css";
import Link from "next/link";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}) {
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
          <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              <Link href="/" className="text-xl font-bold">
                PhotoGen
              </Link>
              <div>
                <SignedOut>
                  <Link href="/sign-in" className="hover:text-gray-300">
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
                  </UserButton>{" "}
                </SignedIn>
              </div>
            </div>
          </nav>
          {children}
        </body>
      </ClerkProvider>
    </html>
  );
}
