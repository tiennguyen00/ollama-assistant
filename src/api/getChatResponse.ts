import { aiPreferences } from "../constant";
import { readStream } from "../utils";

const getChatResponse = async (
  selectedModel: string,
  messages: { role: string; content: string }[],
  setCurrentMessage: (message: string) => void
) => {
  const character = aiPreferences.find((char) => char.id === selectedModel);
  const modelDesc = character ? character.modelDescriptionBehaviour : "";

  try {
    const prompt = `
      You are the character called ${character?.name}. 
      Your behavior is as follows:
      ${modelDesc}
    `;

    // Create chat completion
    const response = await fetch(
      `${import.meta.env.VITE_OPEN_API_HOST}/chat/completions`,
      {
        method: "POST",
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "developer",
              content: prompt,
            },
            ...messages,
          ],
          temperature: 0.7,
          max_completion_tokens: 300,
          stream: true,
        }),
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let responseText = "";

    const reader = response.body?.getReader();
    if (reader) {
      for await (const chunk of readStream(reader)) {
        const delta = chunk.choices?.[0]?.delta?.content || "";
        responseText += delta || "";
        setCurrentMessage(responseText);
      }
    } else {
      throw new Error("No reader found");
    }
    return responseText;
  } catch (error) {
    setCurrentMessage("Sorry, I couldn't fetch a response.");
    return "Sorry, I couldn't fetch a response." + error;
  }
};

export default getChatResponse;
