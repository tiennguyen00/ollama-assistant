import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useChat } from "../../providers";
import { MicrophoneIcon } from "@heroicons/react/20/solid";
import { getChatExpression, getChatResponse } from "../../api/getChatResponse";
import { aiPreferences } from "../../constant";
import { useRealtimeSession } from "./useRealtimeSession";
import CharacterSelection from "../home/CharacterSelection";
import { useTTS } from "./useTTS";
import Loading from "../Loading";
import videoURL from "../../server/uploads/output.mp3";
import { MotionPriority } from "pixi-live2d-display";

const ChatBox = () => {
  const {
    messages,
    setMessages,
    input,
    setInput,
    handleLipsync,
    model,
    setModel,
  } = useChat();
  const { dc, initRealtimeSession, ms } = useRealtimeSession();
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const { fetchTTS } = useTTS();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!dc) return;
    const handleEvent = async (e) => {
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

  useEffect(() => {
    if (!model) return;

    const id = setTimeout(() => {
      model.internalModel.motionManager.startMotion("default", 9);
    }, 500);

    model.internalModel.motionManager.on(
      "motionStart",
      (group, index, audio) => {
        console.log("motionStart", group, index, audio);
        if (audio) {
          // e.g. show subtitle for this audio
          console.log("audio", group, index);

          audio.addEventListener("ended", () => {
            console.log("ended");
          });
        }
      }
    );
    return () => {
      clearTimeout(id);
    };
  }, [model]);

  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setCurrentMessage("");
    setIsLoading(true);
    setMessages((v) => [...v, { role: "user", content: input }]);

    setInput("");

    const response = await getChatResponse(
      aiPreferences[aiPreferences.length - 1].id,
      [...messages, { role: "user", content: input }],
      setCurrentMessage
    );

    const expression = getChatExpression(response.split(" ").pop());
    console.log("expression", expression, response.split(" ").pop());
    model.internalModel.motionManager.startMotion(
      "default",
      expression,
      MotionPriority.FORCE
    );

    const blob = await fetchTTS(response);
    const formData = new FormData();
    formData.append("file", blob, "output.mp3");

    await fetch(`${import.meta.env.VITE_PUBLIC_CLIENT_API}/upload`, {
      method: "POST",
      body: formData,
    });

    handleLipsync(videoURL);

    setMessages((v) => [...v, { role: "assistant", content: response }]);
    setIsLoading(false);
  };

  const handleVoiceMedia = () => {
    initRealtimeSession();
    setIsRecording(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    // model.internalModel.motionManager.startMotion("default", 20);
  };

  return (
    <div
      className="flex flex-col flex-1 py-2 overflow-hidden"
      style={{
        background: "linear-gradient(to right, #DFF2EB, #B9E5E8)",
      }}
    >
      <form
        onSubmit={handleSend}
        className="z-10 flex items-center w-full px-2 space-x-2"
      >
        {/* <div className="relative flex items-center justify-center w-10 h-10">
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
        </div> */}
        <input
          type="text"
          placeholder={`${
            false
              ? "I was trying to answer your chat..."
              : " Type your message for pixiepal..."
          }`}
          className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7AB2D3]"
          value={input}
          disabled={false}
          onChange={handleInputChange}
        />
        <button
          className="px-4 py-2 bg-[#7AB2D3] text-white rounded-lg hover:bg-[#4A628A] transition duration-300"
          disabled={false}
          type="submit"
        >
          Send
        </button>
      </form>
      <div className="relative flex-1">
        <div className="md:absolute px-4 my-auto w-full max-h-full md:-translate-x-[calc(50%-215px)]">
          <CharacterSelection model={model} setModel={setModel} />
        </div>

        <div className="absolute md:max-w-[60%] right-0 flex flex-col px-4 max-h-full py-4  items-end pt-2 space-y-2 overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className={`flex justify-end`}>
              <div
                className={`p-3 rounded-xl text-md ${
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
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
