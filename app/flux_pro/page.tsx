"use client";

import React, { useState } from 'react';
import { generateFluxProImage } from '../../actions/replicate-actions';
import Image from 'next/image';

const FluxProPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await generateFluxProImage(prompt);
            setImageUrls(Array.isArray(result) ? result : [result]); // Ensure result is an array
        } catch (error) {
            console.error('Error generating image:', error);
        }
        setIsLoading(false);
    };

    const handleDownload = (url: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = 'flux-pro-image.webp';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Flux Pro Image Generator</h1>
            <form onSubmit={handleSubmit} className="mb-8">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your image prompt"
                    className="w-full p-2 border rounded mb-4"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    disabled={isLoading}
                >
                    {isLoading ? 'Generating...' : 'Generate Image'}
                </button>
            </form>

            <div className="image-container">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64 bg-gray-100 rounded">
                        <p>Generating image...</p>
                    </div>
                ) : imageUrls.length > 0 ? (
                    <div>
                        {imageUrls.map((url, index) => (
                            <div key={index} className="mb-4">
                                <Image src={url} alt={`Generated image ${index + 1}`} width={512} height={512} className="rounded" />
                                <button
                                    onClick={() => handleDownload(url)}
                                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                                >
                                    Download Image
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64 bg-gray-100 rounded">
                        <p>Your generated image will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FluxProPage;