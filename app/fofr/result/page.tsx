import { Suspense } from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Replicate from 'replicate'
import { Button } from '@/components/ui/button'

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
})

async function getGeneratedImage(id: string) {
    try {
        const prediction = await replicate.predictions.get(id)
        if (prediction.status === 'succeeded') {
            return prediction.output[0] as string
        } else if (prediction.status === 'failed') {
            throw new Error('Image generation failed')
        } else {
            return null // Still processing
        }
    } catch (error) {
        console.error('Error fetching prediction:', error)
        return null
    }
}

export default async function ResultPage({
    searchParams,
}: {
    searchParams: { id: string }
}) {
    const { id } = searchParams
    if (!id) notFound()

    const imageUrl = await getGeneratedImage(id)

    if (!imageUrl) {
        return (
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">Processing Image</h1>
                <p>Please wait while we generate your image...</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Generated Image</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <Image src={imageUrl} alt="Generated Image" width={512} height={512} />
            </Suspense>
        </div>
    )
}