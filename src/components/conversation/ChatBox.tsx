import { FormEvent, useEffect, useState } from "react";
import { useChat } from "../../providers";
import { MicrophoneIcon } from "@heroicons/react/20/solid";
import getChatResponse from "../../api/getChatResponse";
import { aiPreferences } from "../../constant";
import { useRealtimeSession } from "./useRealtimeSession";

const ChatBox = () => {
  const { messages, setMessages, input, setInput } = useChat();
  const { dc, initRealtimeSession } = useRealtimeSession();
  const [currentMessage, setCurrentMessage] = useState<string>("");

  useEffect(() => {
    if (!dc) return;
    const handleEvent = (e) => {
      const rlEvents = JSON.parse(e.data);
      // Start a new content part during

      if (rlEvents.type === "response.text.done") {
        setMessages((v) => [
          ...v,
          { sender: "assistant", text: rlEvents.text },
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
    setMessages((v) => [...v, { role: "user", content: input }]);
    setInput("");

    const response = await getChatResponse(
      aiPreferences[0].id,
      [...messages, { role: "user", content: input }],
      setCurrentMessage
    );
    setMessages((v) => [...v, { role: "assistant", content: response }]);
    setCurrentMessage("");

    // if (dc?.readyState !== "open") {
    //   console.error("Cannnot send message, session is not open");
    //   return;
    // }
    // const responseCreate = {
    //   type: "response.create",
    //   response: {
    //     modalities: ["text"],
    //     instructions: input,
    //   },
    // };

    // dc.send(JSON.stringify(responseCreate));
  };

  const handleVoiceMedia = () => {
    initRealtimeSession();
  };

  return (
    <div
      className="flex flex-col flex-1 w-full h-full p-4 "
      style={{
        background: "linear-gradient(to right, #DFF2EB, #B9E5E8)",
      }}
    >
      {/* Chat Messages */}
      <div className="flex-grow space-y-4 overflow-y-auto">
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
        {currentMessage && (
          <div className={"flex justify-start"}>
            <div
              className={`max-w-[60%] p-3 rounded-xl text-lg bg-gray-300 text-[#4A628A]`}
              dangerouslySetInnerHTML={{
                __html: currentMessage,
              }}
            ></div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex items-center mt-4 space-x-2">
        <MicrophoneIcon
          className="cursor-pointer size-6"
          onClick={handleVoiceMedia}
        />
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
