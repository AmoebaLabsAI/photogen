Authentication
Whenever you make an API request, you need to authenticate using a token. A token is like a password that uniquely identifies your account and grants you access.

The following examples all expect your Replicate access token to be available from the command line. Because tokens are secrets, they should not be in your code. They should instead be stored in environment variables. Replicate clients look for the REPLICATE_API_TOKEN environment variable and use it if available.

To set this up you can use:

export REPLICATE_API_TOKEN=r8_QMg**********************************

Visibility

Copy
Some application frameworks and tools also support a text file named .env which you can edit to include the same token:

REPLICATE_API_TOKEN=r8_QMg**********************************

Visibility

Copy
The Replicate API uses the Authorization HTTP header to authenticate requests. If you’re using a client library this is handled for you.

You can test that your access token is setup correctly by using our account.get endpoint:

What is cURL?
curl https://api.replicate.com/v1/account -H "Authorization: Bearer $REPLICATE_API_TOKEN"
# {"type":"user","username":"aron","name":"Aron Carroll","github_url":"https://github.com/aron"}

Copy
If it is working correctly you will see a JSON object returned containing some information about your account, otherwise ensure that your token is available:

echo "$REPLICATE_API_TOKEN"
# "r8_xyz"

Copy
Setup
NodeJS supports two module formats ESM and CommonJS. Below details the setup for each environment. After setup, the code is identical regardless of module format.

ESM
First you’ll need to ensure you have a NodeJS project:

npm create esm -y

Copy
Then install the replicate JavaScript library using npm:

npm install replicate

Copy
To use the library, first import and create an instance of it:

import Replicate from "replicate";

const replicate = new Replicate();

Copy
This will use the REPLICATE_API_TOKEN API token you’ve setup in your environment for authorization.

CommonJS
First you’ll need to ensure you have a NodeJS project:

npm create -y

Copy
Then install the replicate JavaScript library using npm:

npm install replicate

Copy
To use the library, first import and create an instance of it:

const Replicate = require("replicate");

const replicate = new Replicate();

Copy
This will use the REPLICATE_API_TOKEN API token you’ve setup in your environment for authorization.

Run the model
Use the replicate.run() method to run the model:

const input = {
    prompt: "A closeup headshot photo of a young woman in a grey sweater",
    subject: "https://replicate.delivery/pbxt/L0gy7uyLE5UP0uz12cndDdSOIgw5R3rV5N6G2pbt7kEK9dCr/0_3.webp",
    number_of_outputs: 5
};

const output = await replicate.run("fofr/consistent-character:9c77a3c2f884193fcee4d89645f02a0b9def9434f9e03cb98460456b831c8772", { input });
console.log(output.join("
"));
//=> "https://replicate.delivery/pbxt/tm3Hm7oJsQIWLleQ46JHKDA2...

Copy
You can learn about pricing for this model on the model page.

The run() function returns the output directly, which you can then use or pass as the input to another model. If you want to access the full prediction object (not just the output), use the replicate.predictions.create() method instead. This will include the prediction id, status, logs, etc.

File inputs
This model accepts files as input. You can provide a file as input using a URL, a local file on your computer, or a base64 encoded object:

Option 1: Hosted file
Use a URL as in the earlier example:

const subject = "https://replicate.delivery/pbxt/L0gy7uyLE5UP0uz12cndDdSOIgw5R3rV5N6G2pbt7kEK9dCr/0_3.webp";

Copy
This is useful if you already have an image hosted somewhere on the internet.

Option 2: Local file
You can provide Replicate with a Blob, File or Buffer object and the library will handle the upload for you:

import { readFile } from "node:fs/promises";
const subject = await readFile("./path/to/my/subject.webp");

Copy
Option 3: Data URI
You can create a data URI consisting of the base64 encoded data for your file, but this is only recommended if the file is < 1mb

import { readFile } from "node:fs/promises";
const data = (await readFile("./subject.webp")).toString("base64");
const subject = `data:application/octet-stream;base64,${data}`;

Copy
Then, pass subject as part of the input:

const input = {
    prompt: "A closeup headshot photo of a young woman in a grey sweater",
    subject: subject,
    number_of_outputs: 5
};

const output = await replicate.run("fofr/consistent-character:9c77a3c2f884193fcee4d89645f02a0b9def9434f9e03cb98460456b831c8772", { input });
console.log(output.join("
"));
//=> "https://replicate.delivery/pbxt/tm3Hm7oJsQIWLleQ46JHKDA2...

Copy
Streaming
This model supports streaming. This allows you to receive output as the model is running:

const Replicate = require("replicate")
const replicate = new Replicate()

const input = {
    prompt: "A closeup headshot photo of a young woman in a grey sweater",
    subject: "https://replicate.delivery/pbxt/L0gy7uyLE5UP0uz12cndDdSOIgw5R3rV5N6G2pbt7kEK9dCr/0_3.webp",
    number_of_outputs: 5
};

for await (const event of replicate.stream("fofr/consistent-character:9c77a3c2f884193fcee4d89645f02a0b9def9434f9e03cb98460456b831c8772", { input })) {
  // event: { event: string; data: string; id: string }
  process.stdout.write(`${event}
`)
  //=> "https://replicate.delivery/pbxt/tm3Hm7oJsQIWLleQ46JHKDA2XoNzjiJaaFifmK9GQb8jI45SA/ComfyUI_00001_.webp"
};
process.stdout.write("\n");

Copy
The replicate.stream() method returns a ReadableStream which can be iterated to transform the events into any data structure needed.

For example, to stream just the output content back:

function handler(request) {
  const stream = new ReadableStream({
    async start(controller) {
      for await (const event of replicate.stream( "fofr/consistent-character:9c77a3c2f884193fcee4d89645f02a0b9def9434f9e03cb98460456b831c8772", { input })) {
        controller.enqueue(new TextEncoder().encode(`${event}`));
        //=> "https://replicate.delivery/pbxt/tm3Hm7oJsQIWLleQ46JHKDA2XoNzjiJaaFifmK9GQb8jI45SA/ComfyUI_00001_.webp"
      }
      controller.close();
    },
  });
  return new Response(stream);
}

Copy
Or, stream a list of JSON objects back to the client instead of server sent events:

function handler(request) {
  const iterator = replicate.stream( "fofr/consistent-character:9c77a3c2f884193fcee4d89645f02a0b9def9434f9e03cb98460456b831c8772", { input });
  const stream = new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      const encoder = new TextEncoder();

      if (done) {
        controller.close();
      } else if (value.event === "output" && value.data.length > 0) {
        controller.enqueue(encoder.encode(JSON.stringify({ data: value.data }) + "\n"));
      } else {
        controller.enqueue(encoder.encode(""));
      }
    },
  });
  return new Response(stream);
}

Copy
Streaming in the browser
The JavaScript library is intended to be run on the server. Once the prediction has been created it's output can be streamed directly from the browser.

The streaming URL uses a standard format called Server Sent Events (or text/event-stream) built into all web browsers.

A common implementation is to use a web server to create the prediction using replicate.predictions.create, passing the stream property set to true. Then the urls.stream property of the response contains a URL that can be returned to your frontend application:

// POST /run_prediction
handler(req, res) {
  const input = {
    prompt: "A closeup headshot photo of a young woman in a grey sweater",
    subject: "https://replicate.delivery/pbxt/L0gy7uyLE5UP0uz12cndDdSOIgw5R3rV5N6G2pbt7kEK9dCr/0_3.webp",
    number_of_outputs: 5
};
  const prediction = await replicate.predictions.create({
    version: "9c77a3c2f884193fcee4d89645f02a0b9def9434f9e03cb98460456b831c8772",
    input,
    stream: true,
  });
  return Response.json({ url: prediction.urls.stream });
  // Returns {"url": "https://replicate-stream..."}
}

Copy
Make a request to the server to create the prediction and use the built-in EventSource object to read the returned url.

const response = await fetch("/run_prediction", { method: "POST" });
const { url } = await response.json();

const source = new EventSource(url);
source.addEventListener("output", (evt) => {
  console.log(evt.data) //=> "https://replicate.delivery/pbxt/tm3Hm7oJsQIWLleQ46JHKDA2XoNzjiJaaFifmK9GQb8jI45SA/ComfyUI_00001_.webp"
});
source.addEventListener("done", (evt) => {
  console.log("stream is complete");
});

Copy
Prediction lifecycle
Running predictions and trainings can often take significant time to complete, beyond what is reasonable for an HTTP request/response.

When you run a model on Replicate, the prediction is created with a “starting” state, then instantly returned. This will then move to "processing" and eventual one of “successful”, "failed" or "canceled".

Starting
Running
Succeeded
Failed
Canceled
You can explore the prediction lifecycle by using the predictions.get() method to retrieve the latest version of the prediction until completed.

Show example
const input = {
    prompt: "A closeup headshot photo of a young woman in a grey sweater",
    subject: "https://replicate.delivery/pbxt/L0gy7uyLE5UP0uz12cndDdSOIgw5R3rV5N6G2pbt7kEK9dCr/0_3.webp",
    number_of_outputs: 5
};
const prediction = await replicate.predictions.create({
  version: "9c77a3c2f884193fcee4d89645f02a0b9def9434f9e03cb98460456b831c8772",
  input
});
// { "id": "xyz...", "status": "starting", ... }

const latest = await replicate.predictions.get(prediction.id);
// { "id": "xyz...", "status": "processing", ... }

let completed;
for (let i = 0; i < 5; i++) {
  const latest = await replicate.predictions.get(prediction.id);
  if (latest.status !== "starting" && latest.status !== "processing") {
    completed = latest;
    break;
  }
  // Wait for 2 seconds and then try again.
  await new Promise((resolve) => setTimeout(resolve, 2000));
}

console.log(completed.output);
//=> "https://replicate.delivery/pbxt/tm3Hm7oJsQIWLleQ46JHKDA2...

Copy
Webhooks
Webhooks provide real-time updates about your prediction. Specify an endpoint when you create a prediction, and Replicate will send HTTP POST requests to that URL when the prediction is created, updated, and finished.

It is possible to provide a URL to the predictions.create() function that will be requested by Replicate when the prediction status changes. This is an alternative to polling.

To receive webhooks you’ll need a web server. The following example uses Hono, a web standards based server, but this pattern applies to most frameworks.

Show example
import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono();
app.get('/webhooks/replicate', async (c) => {
  // Get the prediction from the request.
  const prediction = await c.req.json();
	console.log(prediction);
  //=> {"id": "xyz", "status": "successful", ... }

  // Acknowledge the webhook.
  c.status(200);
  c.json({ok: true});
}));

serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`)
  //=> Listening on http://localhost:3000
});

Copy
Then create the prediction passing in the webhook URL and specify which events you want to receive out of "start", "output", ”logs” and "completed".

const input = {
    prompt: "A closeup headshot photo of a young woman in a grey sweater",
    subject: "https://replicate.delivery/pbxt/L0gy7uyLE5UP0uz12cndDdSOIgw5R3rV5N6G2pbt7kEK9dCr/0_3.webp",
    number_of_outputs: 5
};

const callbackURL = `https://my.app/webhooks/replicate`;
await replicate.predictions.create({
  version: "9c77a3c2f884193fcee4d89645f02a0b9def9434f9e03cb98460456b831c8772",
  input: input,
  webhook: callbackURL,
  webhook_events_filter: ["completed"],
});

// The server will now handle the event and log:
// => {"id": "xyz", "status": "successful", ... }

Copy
ℹ️ The replicate.run() method is not used here. Because we're using webhooks, and we don’t need to poll for updates.

Co-ordinating between a prediction request and a webhook response will require some glue. A simple implementation for a single JavaScript server could use an event emitter to manage this.

Show example
import { EventEmitter } from "node:events";
const webhooks = new EventEmitter();

// In server code, emit the prediction on the event emitter.
app.get('/webhooks/replicate', async (c) => {
  const prediction = await c.req.json();

  // Emit the prediction on the EventEmitter.
  webhooks.emit(prediction.id, prediction)

  // ...
}));

// In request code
await replicate.predictions.create({
  model: "yorickvp/llava-13b",
  version: "a0fdc44e4f2e1f20f2bb4e27846899953ac8e66c5886c5878fa1d6b73ce009e5",
  input: input,
  webhook: callbackURL,
  webhook_events_filter: ["completed"],
});

// Wait for prediction to be emitted on the EventEmitter.
const prediction = await new Promise(resolve => webhooks.addEventListener(prediction.id, resolve));
// {"id": "xyz", "status": "successful", ... }

Copy
From a security perspective it is also possible to verify that the webhook came from Replicate. Check out our documentation on verifying webhooks for more information.

Access a prediction
You may wish to access the prediction object. In these cases it’s easier to use the replicate.predictions.create() or replicate.deployments.predictions.create() functions which will return the prediction object.

Though note that these functions will only return the created prediction, and it will not wait for that prediction to be completed before returning. Use replicate.predictions.get() to fetch the latest prediction.

const input = {
    prompt: "A closeup headshot photo of a young woman in a grey sweater",
    subject: "https://replicate.delivery/pbxt/L0gy7uyLE5UP0uz12cndDdSOIgw5R3rV5N6G2pbt7kEK9dCr/0_3.webp",
    number_of_outputs: 5
};
const prediction = replicate.predictions.create({
  version: "9c77a3c2f884193fcee4d89645f02a0b9def9434f9e03cb98460456b831c8772",
  input
});
// { "id": "xyz123", "status": "starting", ... }

Copy
Cancel a prediction
You may need to cancel a prediction. Perhaps the user has navigated away from the browser or canceled your application. To prevent unnecessary work and reduce runtime costs you can use the replicate.predictions.cancel function and pass it a prediction id.

await replicate.predictions.cancel(prediction.id);