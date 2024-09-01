'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Pro() {
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
            const response = await fetch("/api/pro-predictions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: e.target.prompt.value,
                    steps: parseInt(e.target.steps.value),
                    guidance: parseFloat(e.target.guidance.value),
                    aspect_ratio: e.target.aspect_ratio.value,
                }),
            });

            const result = await response.json();
            if (response.status !== 201) {
                throw new Error(result.detail);
            }

            if (result.image && typeof result.image === 'string' && result.image.startsWith('http')) {
                setImage(result.image);
                console.log("Image URL set:", result.image);
            } else {
                console.error("Invalid image URL received:", result.image);
                throw new Error("Invalid image URL received from the server");
            }

            console.log("***************")
            console.log(result.image)
            console.log("***************")
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
                Dream something with Flux Pro
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
                        className="w-1/3"
                        name="steps"
                        placeholder="Steps (default: 25)"
                        min="1"
                        max="50"
                    />
                    <input
                        type="number"
                        className="w-1/3"
                        name="guidance"
                        placeholder="Guidance (default: 3)"
                        min="1"
                        max="20"
                        step="0.1"
                    />
                    <select name="aspect_ratio" className="w-1/3">
                        <option value="1:1">1:1</option>
                        <option value="4:3">4:3</option>
                        <option value="3:4">3:4</option>
                        <option value="16:9">16:9</option>
                        <option value="9:16">9:16</option>
                    </select>
                </div>
                <button className="button" type="submit" disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Generate Pro Image'}
                </button>
            </form>

            {error && <div className="text-red-500 mt-4">{error}</div>}

            {isLoading && <div className="mt-4">Generating image...</div>}

            {image && (
                <div className="image-wrapper mt-5">
                    <p>Debug: Image URL is {image}</p>
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