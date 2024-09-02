"use client";

import React, { useState } from 'react';
import { generateLightningImage } from '../../actions/replicate-actions';
import Image from 'next/image';

const LightningPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await generateLightningImage(prompt);
            setImageUrl(result[0]); // Use the first element of the result as the image URL
        } catch (error) {
            console.error('Error generating image:', error);
        }
        setIsLoading(false);
    };

    const handleDownload = () => {
        if (imageUrl) {
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = 'lightning-image.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Lightning Image Generator</h1>
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
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
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
                ) : imageUrl ? (
                    <div>
                        <Image src={imageUrl} alt="Generated image" width={512} height={512} className="rounded" />
                        <button
                            onClick={handleDownload}
                            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                        >
                            Download Image
                        </button>
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

export default LightningPage;