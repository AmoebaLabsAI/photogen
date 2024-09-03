import "../styles/globals.css";
import Link from "next/link";

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              PhotoGen | An Amoeba Labs Experiment
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
