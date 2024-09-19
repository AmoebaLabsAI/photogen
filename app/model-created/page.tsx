'use client';

import { useSearchParams } from 'next/navigation';

export default function ModelCreated() {
  const searchParams = useSearchParams();
  const modelName = searchParams.get('modelName');
  const triggerWord = searchParams.get('triggerWord');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Model Created Successfully!</h1>
      <p className="mb-2">Your model <strong>{modelName}</strong> has been created.</p>
      <p className="mb-2">Trigger word: <strong>{triggerWord}</strong></p>
      <p className="mb-4">You'll receive an email once the training is complete (approximately 30 minutes).</p>
      <p>You can now close this page or return to the <a href="/" className="text-blue-500 hover:underline">homepage</a>.</p>
    </div>
  );
}