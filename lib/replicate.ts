import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default replicate;

export async function getVersionId(trainingId: string): Promise<string> {
  try {
    const training = await replicate.trainings.get(trainingId);
    return training.output.version;
  } catch (error) {
    console.error("Error fetching version ID:", error);
    throw new Error("Failed to fetch version ID");
  }
}
