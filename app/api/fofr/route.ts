import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(request: NextRequest) {
    try {
        console.log('Received request')
        const formData = await request.formData()
        const image = formData.get('image') as File
        const prompt = formData.get('prompt') as string

        console.log('Image:', image ? 'received' : 'missing')
        console.log('Prompt:', prompt)

        if (!image || !prompt) {
            return NextResponse.json({ error: 'Image and prompt are required' }, { status: 400 })
        }

        console.log('Processing image')
        const imageBuffer = await image.arrayBuffer()
        const base64Image = Buffer.from(imageBuffer).toString('base64')
        const dataURI = `data:${image.type};base64,${base64Image}`

        console.log('Creating prediction')
        const input = {
            prompt: prompt,
            subject: dataURI,
            number_of_outputs: 1,
            output_format: "webp",
            output_quality: 80,
            randomise_poses: true,
            number_of_images_per_pose: 1
        }

        const prediction = await replicate.predictions.create({
            version: "9c77a3c2f884193fcee4d89645f02a0b9def9434f9e03cb98460456b831c8772",
            input: input,
        })

        console.log('Prediction created:', prediction.id)
        return NextResponse.json({ id: prediction.id })
    } catch (error) {
        console.error('API route error:', error)
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
    }
}