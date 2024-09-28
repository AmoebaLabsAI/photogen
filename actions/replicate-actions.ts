"use server";

import replicate from "../lib/replicate";

export async function generateFluxImage(prompt: string) {
  const input = {
    prompt: prompt,
    num_outputs: 1,
    aspect_ratio: "1:1",
    output_format: "webp",
    output_quality: 80,
  };

  const output = await replicate.run("black-forest-labs/flux-schnell", {
    input,
  });
  return output;
}

export async function generateAIModelImage(
  prompt: string,
  modelName: string,
  trainingId: string
) {
  const output = await replicate.run(
    `amoebalabsai/${modelName}:${trainingId}`,
    {
      input: {
        model: "schnell",
        prompt: prompt,
        lora_scale: 1,
        num_outputs: 1,
        aspect_ratio: "1:1",
        output_format: "webp",
        guidance_scale: 3.5,
        output_quality: 90,
        prompt_strength: 0.8,
        extra_lora_scale: 1,
        num_inference_steps: 28,
      },
    }
  );

  return output;
}

export async function generateFluxProImage(prompt: string) {
  const input = {
    prompt: prompt,
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
    num_inference_steps: 4,
  };

  const output = await replicate.run(
    "bytedance/sdxl-lightning-4step:5f24084160c9089501c1b3545d9be3c27883ae2239b6f412990e82d4a6210f8f",
    { input }
  );
  return output;
}

export async function generateAfricaImage(prompt: string) {
  const input = {
    prompt: prompt,
    num_outputs: 1,
    prompt_strength: 0.91,
  };

  const output = await replicate.run(
    "svngoku/sdxl-africans:052925cac816ec9dc40a3adee633dacd90a32a8fc7db629ea0d056da9ab2b374",
    { input }
  );
  return output;
}

export async function generateVideo(prompt: string) {
  const input = {
    prompt: prompt,
    seed: 255224557,
    n_prompt:
      "badhandv4, easynegative, ng_deepnegative_v1_75t, verybadimagenegative_v1.3, bad-artist, bad_prompt_version2-neg, teeth",
  };

  const output = await replicate.run(
    "lucataco/animate-diff:beecf59c4aee8d81bf04f0381033dfa10dc16e845b4ae00d281e2fa377e48a9f",
    { input }
  );
  return output;
}
