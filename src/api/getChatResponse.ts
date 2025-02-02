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

// 1 nodding
// 2 nodding, 34 nodding angry, 5 nodding happy
// 6, 7 gesture. 89 welcome, 10 embrassing, 11,12 reject,
// 13, 14.  15 smile, 16 nervous, 17 embrassing,
// 18, 19 smile-embarrassed. 20 minding, 21 enjoying,
// 22, 23, 25 smiling. 24 sulk. 26 surprised
const getChatExpression = (ex: string | undefined) => {
  const random = Math.random();
  switch (ex) {
    case "*nodding*":
      return random < 0.25 ? 1 : random < 0.5 ? 2 : random < 0.75 ? 3 : 4;
    case "*blushing*":
      return random < 0.25 ? 18 : random < 0.5 ? 19 : random < 0.75 ? 10 : 7;
    case "*nervous*":
      return random < 0.25 ? 16 : random < 0.5 ? 17 : random < 0.75 ? 15 : 13;
    case "*sulk*":
      return random < 0.25 ? 24 : random < 0.5 ? 25 : random < 0.75 ? 26 : 20;
    case "*surprised*":
      return random < 0.25 ? 26 : random < 0.5 ? 23 : random < 0.75 ? 22 : 21;
    default:
      return random < 0.25 ? 1 : random < 0.5 ? 2 : random < 0.75 ? 3 : 4;
  }
};

export { getChatResponse, getChatExpression };
