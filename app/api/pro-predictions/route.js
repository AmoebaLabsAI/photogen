import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req) {
    try {
        // ********
        console.log("*** Received POST request to /api/pro-predictions");

        const { prompt, steps, guidance, aspect_ratio } = await req.json();

        // ********
        console.log("*** Request parameters:", { prompt, steps, guidance, aspect_ratio });

        // ********
        console.log("*** Calling Replicate API");
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

        // ********
        console.log("*** Replicate output type:", typeof output);
        console.log("*** Replicate output structure:", JSON.stringify(output, null, 2));

        if (Array.isArray(output)) {
            console.log("*** Output is an array with length:", output.length);
            output.forEach((item, index) => {
                console.log(`*** Item ${index} type:`, typeof item);
                console.log(`*** Item ${index} value:`, item);
            });
        }

        // ********
        console.log("*** Sending successful response");
        return new Response(JSON.stringify({ image: output }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        // ********
        console.error("*** Error in pro-predictions:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}