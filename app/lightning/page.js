'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function FluxLightning() {
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const promptInputRef = useRef(null);

    useEffect(() => {
        promptInputRef.current.focus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setImage(null);

        try {
            const response = await fetch("/api/lightning-predictions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: e.target.prompt.value,
                    num_inference_steps: parseInt(e.target.steps.value) || 4,
                    guidance_scale: parseFloat(e.target.guidance.value) || 7.5,
                }),
            });

            const result = await response.json();
            if (response.status !== 201) {
                throw new Error(result.detail);
            }

            setImage(result.image);
        } catch (error) {
            console.error("Error:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container max-w-2xl mx-auto p-5">
            <h1 className="py-6 text-center font-bold text-2xl">
                Dream something with Flux Lightning
            </h1>

            <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="flex-grow"
                    name="prompt"
                    placeholder="Enter a prompt to display an image"
                    ref={promptInputRef}
                />
                <div className="flex gap-4">
                    <input
                        type="number"
                        className="w-1/2"
                        name="steps"
                        placeholder="Steps (default: 4)"
                        min="1"
                        max="50"
                    />
                    <input
                        type="number"
                        className="w-1/2"
                        name="guidance"
                        placeholder="Guidance (default: 7.5)"
                        min="1"
                        max="20"
                        step="0.1"
                    />
                </div>
                <button className="button" type="submit" disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Generate Lightning Image'}
                </button>
            </form>

            {error && <div className="text-red-500 mt-4">{error}</div>}

            {isLoading && <div className="mt-4">Generating image...</div>}

            {image && (
                <div className="image-wrapper mt-5">
                    <Image
                        src={image}
                        alt="Generated image"
                        width={1024}
                        height={1024}
                        layout="responsive"
                    />
                </div>
            )}
        </div>
    );
}