'use client'

import { useState, useEffect } from 'react'
import ImageUpload from './image-upload'
import Image from 'next/image'

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export default function FofrForm() {
    const [image, setImage] = useState<File | null>(null)
    const [prompt, setPrompt] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [generatedImageUrls, setGeneratedImageUrls] = useState<string[]>([])
    const [predictionId, setPredictionId] = useState<string | null>(null)
    const [progress, setProgress] = useState(0)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!image || !prompt) return

        setLoading(true)
        setError(null)
        setGeneratedImageUrls([])
        setProgress(0)

        const formData = new FormData()
        formData.append('image', image)
        formData.append('prompt', prompt)

        try {
            const response = await fetch('/api/fofr', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (response.ok && data.id) {
                setPredictionId(data.id)
                setProgress(10) // Start progress at 10%
            } else {
                setError(data.error || 'Failed to generate image')
                console.error('API response:', data)
            }
        } catch (error) {
            console.error('Error:', error)
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const checkPrediction = async (retries = 0) => {
            if (!predictionId) return

            try {
                const response = await fetch(`/api/fofr/status?id=${predictionId}`)
                const data = await response.json()

                if (data.status === 'succeeded' && data.output) {
                    setGeneratedImageUrls(data.output)
                    setPredictionId(null)
                    setProgress(100) // Complete progress
                } else if (data.status === 'failed') {
                    setError('Image generation failed')
                    setPredictionId(null)
                    setProgress(0) // Reset progress
                } else {
                    // Still processing, update progress
                    setProgress((prevProgress) => Math.min(prevProgress + 10, 90))
                    setTimeout(() => checkPrediction(0), 2000)
                }
            } catch (error) {
                console.error('Error checking prediction status:', error)
                if (retries < MAX_RETRIES) {
                    console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`)
                    setTimeout(() => checkPrediction(retries + 1), RETRY_DELAY)
                } else {
                    setError('Failed to check image generation status')
                    setPredictionId(null)
                    setProgress(0) // Reset progress
                }
            }
        }

        if (predictionId) {
            checkPrediction()
        }
    }, [predictionId])

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Upload Image</label>
                    <ImageUpload onImageSelect={setImage} />
                </div>
                <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">Prompt</label>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter your prompt here..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {loading ? 'Generating...' : 'Generate Image'}
                </button>
            </form>
            {error && (
                <div className="text-red-600 font-medium">{error}</div>
            )}
            {loading && (
                <div>
                    <div>Generating images, please wait...</div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{progress}% complete</div>
                </div>
            )}
            {generatedImageUrls.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold mt-6 mb-2">Generated Images</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {generatedImageUrls.map((url, index) => (
                            <Image key={index} src={url} alt={`Generated Image ${index + 1}`} width={256} height={256} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}