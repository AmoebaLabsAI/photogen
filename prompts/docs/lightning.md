Sample output:
{
  "completed_at": "2024-03-19T19:26:19.870755Z",
  "created_at": "2024-03-19T19:26:17.286887Z",
  "data_removed": false,
  "error": null,
  "id": "o22jrhbbmu5iuikbyayzbae7ve",
  "input": {
    "width": 1024,
    "height": 1024,
    "prompt": "self-portrait of a woman, lightning in the background",
    "scheduler": "K_EULER",
    "num_outputs": 1,
    "guidance_scale": 0,
    "negative_prompt": "worst quality, low quality",
    "num_inference_steps": 4
  },
  "logs": "Using seed: 2239907472\nPrompt: self-portrait of a woman, lightning in the background\n  0%|          | 0/4 [00:00<?, ?it/s]\n 50%|█████     | 2/4 [00:00<00:00,  9.84it/s]\n100%|██████████| 4/4 [00:00<00:00,  9.79it/s]\n100%|██████████| 4/4 [00:00<00:00,  9.79it/s]",
  "metrics": {
    "predict_time": 1.633633,
    "total_time": 2.583868
  },
  "output": [
    "https://replicate.delivery/pbxt/dYdYGKKt04pHJ1kle3eStm3q4mfPiUFlQ5xGeM3mfboYbMPUC/out-0.png"
  ],
  "started_at": "2024-03-19T19:26:18.237122Z",
  "status": "succeeded",
  "urls": {
    "get": "https://api.replicate.com/v1/predictions/o22jrhbbmu5iuikbyayzbae7ve",
    "cancel": "https://api.replicate.com/v1/predictions/o22jrhbbmu5iuikbyayzbae7ve/cancel"
  },
  "version": "727e49a643e999d602a896c774a0658ffefea21465756a6ce24b7ea4165eba6a"
}

Node.js

Python

HTTP
Set the REPLICATE_API_TOKEN environment variable

export REPLICATE_API_TOKEN=r8_QMg**********************************

Visibility

Copy
Learn more about authentication

Install Replicate’s Node.js client library

npm install replicate

Copy
Learn more about setup
Run bytedance/sdxl-lightning-4step using Replicate’s API. Check out the model's schema for an overview of inputs and outputs.

import Replicate from "replicate";
const replicate = new Replicate();

const input = {
    prompt: "self-portrait of a woman, lightning in the background"
};

const output = await replicate.run("bytedance/sdxl-lightning-4step:5f24084160c9089501c1b3545d9be3c27883ae2239b6f412990e82d4a6210f8f", { input });
console.log(output)
//=> ["https://replicate.delivery/pbxt/dYdYGKKt04pHJ1kle3eStm3...