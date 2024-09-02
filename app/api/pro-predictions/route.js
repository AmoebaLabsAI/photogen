import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req) {
    try {
        const { prompt, steps, guidance, aspect_ratio } = await req.json();

        const output = await replicate.run("black-forest-labs/flux-pro", {
            input: {
                prompt,
                steps: steps || 25,
                guidance: guidance || 3,
                aspect_ratio: aspect_ratio || "1:1",
                interval: 2,
                output_format: "webp",
                output_quality: 80,
                safety_tolerance: 2
            },
        });

        console.log("Replicate output:", output);

        return new Response(JSON.stringify({ image: output }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error in pro-predictions:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}