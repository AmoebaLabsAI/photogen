'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function FluxSchnell() {
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
            const response = await fetch("/api/predictions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: e.target.prompt.value,
                }),
            });

            const result = await response.json();
            if (response.status !== 201) {
                throw new Error(result.detail);
            }

            console.log("API result:", result);
            console.log("Setting image URL:", result.image);
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
                Dream something with Flux Schnell
            </h1>

            <form className="w-full flex" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="flex-grow"
                    name="prompt"
                    placeholder="Enter a prompt to display an image"
                    ref={promptInputRef}
                />
                <button className="button" type="submit" disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Go!'}
                </button>
            </form>

            {error && <div className="text-red-500 mt-4">{error}</div>}

            {isLoading && <div className="mt-4">Generating image...</div>}

            {image && (
                <div className="image-wrapper mt-5">
                    <Image
                        src={image}
                        alt="Generated image"
                        width={512}
                        height={512}
                        layout="responsive"
                    />
                </div>
            )}
        </div>
    );
}