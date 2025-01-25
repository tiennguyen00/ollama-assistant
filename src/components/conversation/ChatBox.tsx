import { FormEvent, useEffect, useState } from "react";
import { useChat } from "../../providers";
import { MicrophoneIcon } from "@heroicons/react/20/solid";
import getChatResponse from "../../api/getChatResponse";
import { aiPreferences } from "../../constant";
import { useRealtimeSession } from "./useRealtimeSession";
import CharacterSelection from "../home/CharacterSelection";
import { useTTS } from "./useTTS";
import Loading from "../Loading";

const ChatBox = () => {
  const { messages, setMessages, input, setInput } = useChat();
  const { dc, initRealtimeSession, ms } = useRealtimeSession();
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const { fetchTTS } = useTTS();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!dc) return;
    const handleEvent = (e) => {
      const rlEvents = JSON.parse(e.data);

      if (rlEvents.type === "response.audio_transcript.done") {
        setMessages((v) => [
          ...v,
          { role: "assistant", content: rlEvents.transcript },
        ]);
      }
      console.log("rtEvent: ", rlEvents);
    };
    dc.addEventListener("message", handleEvent);
    return () => {
      dc.removeEventListener("message", handleEvent);
    };
  }, [dc]);

  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessages((v) => [...v, { role: "user", content: input }]);

    setInput("");

    const response = await getChatResponse(
      aiPreferences[4].id,
      [...messages, { role: "user", content: input }],
      setCurrentMessage
    );

    await fetchTTS(response);
    setMessages((v) => [...v, { role: "assistant", content: response }]);
    setCurrentMessage("");
    setIsLoading(false);
  };

  const handleVoiceMedia = () => {
    initRealtimeSession();
    setIsRecording(true);
  };

  return (
    <div
      className="relative flex flex-col w-full min-h-[calc(100dvh-80px)] px-4 pb-20"
      style={{
        background: "linear-gradient(to right, #DFF2EB, #B9E5E8)",
      }}
    >
      <div className="absolute inset-0 z-0 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <CharacterSelection />
      </div>
      {/* Chat Messages */}

      <div className="inset-0 z-10 p-4 space-y-4 ">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-xl text-lg ${
                message.role === "user"
                  ? "bg-[#7AB2D3] text-white"
                  : "bg-gray-300 text-[#4A628A]"
              }`}
              dangerouslySetInnerHTML={{
                __html: message.content,
              }}
            ></div>
          </div>
        ))}
        {isLoading && (
          <div className="bg-gray-300 p-3 rounded-xl w-fit text-lg text-[#4A628A]">
            <Loading />
          </div>
        )}
        {/* {currentMessage && (
          <div className={"flex justify-start"}>
            <div
              className={`max-w-[60%] p-3 rounded-xl text-lg bg-gray-300 text-[#4A628A]`}
              dangerouslySetInnerHTML={{
                __html: currentMessage,
              }}
            ></div>
          </div>
        )} */}
      </div>

      <form
        onSubmit={handleSend}
        className="flex items-center w-full space-x-2"
      >
        <div className="relative flex items-center justify-center w-10 h-10">
          {isRecording ? (
            <MicrophoneIcon
              className="cursor-pointer size-6"
              onClick={() => {
                ms?.getTracks().forEach((track) => track.stop());
                setIsRecording(false);
              }}
            />
          ) : (
            <>
              <div className="absolute w-4/5 h-1 rotate-45 bg-black rounded-full" />
              <MicrophoneIcon
                className="cursor-pointer size-6"
                onClick={handleVoiceMedia}
              />
            </>
          )}
        </div>
        <input
          type="text"
          placeholder={`${
            false
              ? "Pixiepal was trying to answer your chat..."
              : " Type your message for pixiepal..."
          }`}
          className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7AB2D3]"
          value={input}
          disabled={false}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-[#7AB2D3] text-white rounded-lg hover:bg-[#4A628A] transition duration-300"
          disabled={false}
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
