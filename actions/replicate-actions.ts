"use server";

import replicate from "../lib/replicate";

export async function generateFluxImage(prompt: string) {
    const input = {
        prompt: prompt,
        num_outputs: 1,
        aspect_ratio: "1:1",
        output_format: "webp",
        output_quality: 80
    };

    const output = await replicate.run("black-forest-labs/flux-schnell", { input });
    return output;
}

export async function generateFluxProImage(prompt: string) {
    const input = {
        prompt: prompt,
        num_outputs: 1,
        aspect_ratio: "1:1",
        output_format: "webp",
        output_quality: 80
    };

    const output = await replicate.run("black-forest-labs/flux-pro", { input });
    return output;
}

export async function generateLightningImage(prompt: string) {
    const input = {
        prompt: prompt,
        width: 1024,
        height: 1024,
        scheduler: "K_EULER",
        num_outputs: 1,
        guidance_scale: 7.5,
        negative_prompt: "worst quality, low quality",
        num_inference_steps: 4
    };

    const output = await replicate.run("bytedance/sdxl-lightning-4step:5f24084160c9089501c1b3545d9be3c27883ae2239b6f412990e82d4a6210f8f", { input });
    return output;
}

export async function generateAfricaImage(prompt: string) {
    const input = {
        prompt: prompt,
        num_outputs: 1,
        prompt_strength: 0.91
    };

    const output = await replicate.run("svngoku/sdxl-africans:052925cac816ec9dc40a3adee633dacd90a32a8fc7db629ea0d056da9ab2b374", { input });
    return output;
}