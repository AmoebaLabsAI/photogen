import { NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
})

// Remove this line
// const MODEL_NAME = "flux-test-model"

export async function POST(req: Request) {
    try {
        console.log('Starting fine-tune process')
        const formData = await req.formData()
        const zipFile = formData.get('images') as File
        const triggerWord = formData.get('triggerWord') as string
        const steps = parseInt(formData.get('steps') as string)

        console.log('Received data:', { zipFileName: zipFile.name, triggerWord, steps })

        console.log('Creating model...')
        const model_owner = "thierrydamiba";
        const model_name = "flux-test-model";
        const options = {
            visibility: "public",
            hardware: "gpu-t4",
            description: "A fine-tuned FLUX.1 model"
        };
        const model = await replicate.models.create(model_owner, model_name, options);

        console.log('Model created:', JSON.stringify(model, null, 2))

        // Read the zip file
        const arrayBuffer = await zipFile.arrayBuffer()
        const zipBuffer = Buffer.from(arrayBuffer)

        console.log('Starting training...')
        const training_version = "ostris/flux-dev-lora-trainer";
        const training_id = "4ffd32160efd92e956d39c5338a9b8fbafca58e03f791f6d8011f3e20e8ea6fa";
        const training_input = {
            input_images: zipBuffer,
            steps: steps,
            trigger_word: triggerWord,
        };
        const training_destination = `${model.owner}/flux-test-model`;

        const training = await replicate.trainings.create(
            training_version,
            training_id,
            training_input,
            training_destination
        );

        console.log('Training created:', JSON.stringify(training, null, 2))

        return NextResponse.json({ trainingId: training.id, modelId: `${model.owner}/flux-test-model` }) // Changed to string
    } catch (error) {
        console.error('Error during fine-tuning:', error)
        console.error('Error name:', error.name)
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
        if (error.response) {
            console.error('Response data:', JSON.stringify(error.response.data, null, 2))
            console.error('Response status:', error.response.status)
            console.error('Response headers:', JSON.stringify(error.response.headers, null, 2))
        }
        return NextResponse.json({
            error: 'Fine-tuning failed',
            details: error.message,
            name: error.name,
            stack: error.stack,
            responseData: error.response ? error.response.data : null,
            responseStatus: error.response ? error.response.status : null,
        }, { status: 500 })
    }
}