export function removeEmojisAndPattern(text: string) {
  // Replace '~' with a space
  const textNoTilde = text.replace("~", " ");

  // Replace '_' with a space
  const textNoUnderscore = textNoTilde.replace("_", " ");

  // Remove words enclosed by '*' (like *bold* or *italic* text)
  const textNoStarWords = textNoUnderscore.replace(/\*[^*]+?\*/g, "");

  // Replace other unwanted characters
  let textCleaned = textNoStarWords.replace("*", " ").replace("=", " ");
  textCleaned = textCleaned.replace("#", " ");

  // Remove any <em>HTML tags and content inside them
  textCleaned = textCleaned.replace(/<em>([^<]+)<\/em>/g, "");

  return textCleaned;
}

export async function* readStream(
  reader: ReadableStreamDefaultReader<Uint8Array>
) {
  const decoder = new TextDecoder("utf-8");
  let done = false;

  while (!done) {
    const { value, done: streamDone } = await reader.read();
    done = streamDone;

    if (value) {
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((line) => line.trim() !== "");

      for (const line of lines) {
        if (line === "data: [DONE]") {
          return; // End the stream when [DONE] is encountered
        }

        if (line.startsWith("data: ")) {
          const json = JSON.parse(line.substring(6)); // Parse the JSON after "data: "
          yield json; // Yield the parsed object
        }
      }
    }
  }
}
