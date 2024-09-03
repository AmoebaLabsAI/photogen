import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
})

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ error: 'Prediction ID is required' }, { status: 400 })
    }

    try {
        const prediction = await replicate.predictions.get(id)
        return NextResponse.json(prediction)
    } catch (error) {
        console.error('Error fetching prediction:', error)
        return NextResponse.json({ error: 'Failed to fetch prediction status' }, { status: 500 })
    }
}