import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req) {
    const { prompt, num_inference_steps, guidance_scale } = await req.json();

    try {
        const output = await replicate.run(
            "bytedance/sdxl-lightning-4step:e9e9eb122b7a3b125ee77e15e9fa1c2adcb6e8f3f45c3a7bfb45274c0c5b6fad",
            {
                input: {
                    prompt,
                    num_inference_steps: num_inference_steps || 4,
                    guidance_scale: guidance_scale || 7.5,
                }
            }
        );

        return new Response(JSON.stringify({ image: output[0] }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error:", error);
        return new Response(JSON.stringify({ detail: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}