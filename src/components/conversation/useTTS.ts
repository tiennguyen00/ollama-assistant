const useTTS = () => {
  const fetchTTS = async (text: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_OPEN_API_HOST}/audio/speech`,
      {
        method: "POST",
        body: JSON.stringify({
          model: "tts-1",
          input: text,
          voice: "sage",
          speed: 0.75,
        }),
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const blob = await response.blob();

    return blob;
  };
  return { fetchTTS };
};

export { useTTS };
