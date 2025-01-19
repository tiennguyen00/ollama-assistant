import { client } from ".";
import { aiPreferences } from "../constant";

const MAX_MESSAGE_LENGTH = 1000;

const getChatResponse = async (selectedModel: string, userMessage: string) => {
  const isProduction = import.meta.env.MODE === "production";

  if (isProduction && userMessage.length > MAX_MESSAGE_LENGTH) {
    return `I'm sorry, your message is too long, the maximal message send is ${MAX_MESSAGE_LENGTH} char.`;
  }

  const character = aiPreferences.find((char) => char.id === selectedModel);
  const modelDesc = character ? character.modelDescriptionBehaviour : "";

  try {
    const prompt = `
      You are the character called ${character?.name}. 
      Your behavior is as follows:
      ${modelDesc}
    `;

    const stream = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: userMessage },
      ],
      stream: true,
    });
    for await (const chunk of stream) {
      console.log(chunk.choices[0]?.delta?.content || "");
    }
  } catch (error) {
    console.error("Error in API request:", error);
    return "Sorry, I couldn't fetch a response.";
  }
};

// Creater RealtimeAPI using WebRTC
// 1. Genn EPHEMERAL_KEY

export default getChatResponse;
