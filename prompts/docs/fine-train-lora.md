Fine-tune FLUX.1 with your own images
Posted August 15, 2024 by @deepfates

FLUX.1 is a family of text-to-image models released by Black Forest Labs this summer. The FLUX.1 models set a new standard for open-source image models: they can generate realistic hands, legible text, and even the strangely hard task of funny memes.

You can now fine-tune FLUX.1 [dev] with Ostris’s AI Toolkit on Replicate. Teach the model to recognize and generate new concepts by showing it a small set of example images, allowing you to customize the model’s output for specific styles, characters, or objects. Ostris’s toolkit uses the LoRA technique for fast, lightweight trainings.

People have already made some amazing fine-tunes:

How to fine-tune FLUX.1
You can fine-tune FLUX.1 on Replicate by just uploading some images, either on the web or via an API.

If you’re not familiar with Replicate, we make it easy to run AI as an API. You don’t have to go looking for a beefy GPU, you don’t have to deal with environments and containers, you don’t have to worry about scaling. You write normal code, with normal APIs, and pay only for what you use.

Prepare your training data
To start fine-tuning, you’ll need a collection of images that represent the concept you want to teach the model. These images should be diverse enough to cover different aspects of the concept. For example, if you’re fine-tuning on a specific character, include images in various settings, poses, and lighting.

Here are some guidelines:

Use 12-20 images for best results
Use large images if possible
Use JPEG or PNG formats
Optionally, create a corresponding .txt file for each image with the same name, containing the caption
Once you have your images (and optional captions), zip them up into a single file.

Create a training on the web
To start the training process on the web, navigate to Ostris’s FLUX.1 [dev] trainer on Replicate.

First, select a model as your destination or create a new one by typing the name in the model selector field.

Next, upload the zip file containing your training data as the input_images, then set up the training parameters.

The trigger_word refers to the object, style or concept you are training on. Pick a string that isn’t a real word, like TOK or something related to what’s being trained, like CYBRPNK. The trigger word you specify will be associated with all images during training. Then when you run your fine-tuned model, you can include the trigger word in prompts to activate your concept.

For steps, a good starting point is 1000.

Leave the learning_rate, batch_size, and resolution at their default values. Leave autocaptioning enabled unless you want to provide your own captions.

If you want to save your model on Hugging Face, enter your Hugging Face token and set the repository ID.

Once you’ve filled out the form, click “Create training” to begin the process of fine-tuning.

Create a training via an API
Alternatively, you can create a training from your own code with an API.

Make sure you have your REPLICATE_API_TOKEN set in your environment. Find it in your account settings.

export REPLICATE_API_TOKEN=r8_***************************

Copy
Create a new model that will serve as the destination for your fine-tuned weights. This is where your trained model will live once the process is complete.

import replicate

model = replicate.models.create(
    owner="yourusername",
    name="flux-your-model-name",
    visibility="public",  # or "private" if you prefer
    hardware="gpu-t4",  # Replicate will override this for fine-tuned models
    description="A fine-tuned FLUX.1 model"
)

print(f"Model created: {model.name}")
print(f"Model URL: https://replicate.com/{model.owner}/{model.name}")

Copy
Now that you have your model, start the training process by creating a new training run. You’ll need to provide the input images, the number of steps, and any other desired parameters.

# Now use this model as the destination for your training
training = replicate.trainings.create(
    version="ostris/flux-dev-lora-trainer:4ffd32160efd92e956d39c5338a9b8fbafca58e03f791f6d8011f3e20e8ea6fa",
    input={
        "input_images": open("/path/to/your/local/training-images.zip", "rb"),
        "steps": 1000,
        "hf_token": "YOUR_HUGGING_FACE_TOKEN",  # optional
        "hf_repo_id": "YOUR_HUGGING_FACE_REPO_ID",  # optional
    },
    destination=f"{model.owner}/{model.name}"
)

print(f"Training started: {training.status}")
print(f"Training URL: https://replicate.com/p/{training.id}")

Copy
Note that it doesn’t matter which hardware you pick for your model at this time, because we route to H100s for all our FLUX.1 fine-tunes. Training for this many steps typically takes 20-30 minutes and costs under $2.

Use your trained model
Once the training is complete, you can use your trained model directly on Replicate, just like any other model.

You can run it on the web:

Go to your model page on Replicate (e.g., https://replicate.com/yourusername/flux-your-model-name).
For the prompt input, include your trigger word (such as “bad 70s food”) to activate your fine-tuned concept.
Adjust any other inputs as needed.
Click “Run” to generate your image.
Or, with an API. For example, using the Python client:

import replicate

output = replicate.run(
    "yourusername/flux-your-model-name:version_id",
    input={
        "prompt": "A portrait photo of a space station, bad 70s food",
        "num_inference_steps": 28,
        "guidance_scale": 7.5,
        "model": "dev",
    }
)

print(f"Generated image URL: {output}")

Copy
Replace yourusername/flux-your-model-name:version_id with your actual model details.

You can find more information about running it with an API on the “API” tab of your model page.

Share your model
If you want others to be able to discover and use your new fine tuned-model, you’ll need to make it public.

If you created your new model using using the web-based training form, it will be private by default.

To make your model public, go to the model settings page and set the visibility to “Public”.

Once your model is public, you can share it with others by sending them the URL of the model page, and it will appear in the Explore section of the site and in the collection of Flux fine-tunes.