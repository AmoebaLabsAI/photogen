import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="container max-w-4xl mx-auto p-5">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to Flux AI</h1>
      <p className="text-xl mb-6">
        Flux AI is your gateway to creating stunning photos using artificial intelligence.
        Whether you're an artist, designer, or just someone with a vivid imagination,
        Flux AI turns your ideas into visual reality.
      </p>
      <div className="flex justify-center gap-4">
        <Link href="/flux" className="button">
          Try Flux Schnell
        </Link>
        <Link href="/pro" className="button">
          Try Flux Pro
        </Link>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Why Choose Flux AI?</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Instant photo generation from text descriptions</li>
          <li>Two powerful models: Flux Schnell for quick results and Flux Pro for detailed creations</li>
          <li>User-friendly interface for both beginners and professionals</li>
          <li>Endless possibilities for creative expression</li>
        </ul>
      </div>
    </div>
  );
}
