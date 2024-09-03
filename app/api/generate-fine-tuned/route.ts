import { NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(req: Request) {
    const { modelId, prompt } = await req.json()

    try {
        const output = await replicate.run(
            `${modelId}:latest`,
            {
                input: {
                    prompt: prompt,
                    num_inference_steps: 28,
                    guidance_scale: 7.5,
                    model: "dev",
                }
            }
        )

        return NextResponse.json({ imageUrl: output })
    } catch (error) {
        console.error('Error generating image:', JSON.stringify(error, null, 2))
        return NextResponse.json({ error: 'Image generation failed', details: JSON.stringify(error, null, 2) }, { status: 500 })
    }
}