'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import JSZip from 'jszip'

export default function FineTunePage() {
    const [images, setImages] = useState<File[]>([])
    const [triggerWord, setTriggerWord] = useState('')
    const [steps, setSteps] = useState(1000)
    const [isTraining, setIsTraining] = useState(false)
    const [trainedModelId, setTrainedModelId] = useState('')
    const [prompt, setPrompt] = useState('')
    const [generatedImage, setGeneratedImage] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files))
        }
    }

    const handleFineTune = async () => {
        setIsTraining(true)
        setError('')
        const formData = new FormData()

        // Create a zip file from the images
        const zip = new JSZip()
        images.forEach((image, index) => {
            zip.file(`image_${index}.jpg`, image)
        })
        const zipBlob = await zip.generateAsync({ type: 'blob' })

        formData.append('images', zipBlob, 'training_images.zip')
        formData.append('triggerWord', triggerWord)
        formData.append('steps', steps.toString())

        try {
            console.log('Sending fine-tune request...')
            const response = await fetch('/api/fine-tune', {
                method: 'POST',
                body: formData,
            })
            console.log('Received response:', response.status, response.statusText)
            const data = await response.json()
            console.log('Response data:', data)
            if (response.ok) {
                setTrainedModelId(data.modelId)
                console.log('Fine-tuning successful. Model ID:', data.modelId)
            } else {
                const errorMessage = `Fine-tuning failed: ${data.error}. Details: ${JSON.stringify(data.details)}`;
                console.error(errorMessage)
                setError(errorMessage)
            }
        } catch (error) {
            const errorMessage = `Fine-tuning failed: ${error.message}`
            console.error(errorMessage)
            console.error('Error stack:', error.stack)
            setError(errorMessage)
        }
        setIsTraining(false)
    }

    const handleGenerate = async () => {
        try {
            const response = await fetch('/api/generate-fine-tuned', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ modelId: trainedModelId, prompt }),
            })
            const data = await response.json()
            setGeneratedImage(data.imageUrl)
        } catch (error) {
            console.error('Image generation failed:', error)
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Fine-tune FLUX.1</h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="mb-4">
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="mb-2"
                />
                <p>Selected images: {images.length}</p>
            </div>

            <input
                type="text"
                placeholder="Trigger word"
                value={triggerWord}
                onChange={(e) => setTriggerWord(e.target.value)}
                className="w-full p-2 mb-2 border rounded"
            />

            <input
                type="number"
                placeholder="Steps"
                value={steps}
                onChange={(e) => setSteps(parseInt(e.target.value))}
                className="w-full p-2 mb-2 border rounded"
            />

            <button
                onClick={handleFineTune}
                disabled={isTraining}
                className="w-full p-2 mb-4 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
                {isTraining ? 'Training...' : 'Fine-tune Model'}
            </button>

            {trainedModelId && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-2">Generate with Fine-tuned Model</h2>
                    <textarea
                        placeholder="Enter your prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full p-2 mb-2 border rounded"
                    />
                    <button
                        onClick={handleGenerate}
                        className="w-full p-2 mb-4 bg-green-500 text-white rounded"
                    >
                        Generate Image
                    </button>
                    {generatedImage && (
                        <img src={generatedImage} alt="Generated" className="w-full" />
                    )}
                </div>
            )}
        </div>
    )
}