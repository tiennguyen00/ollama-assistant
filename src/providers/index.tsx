import { Live2DModel } from "pixi-live2d-display-lipsyncpatch";
import { createContext, useState, useContext } from "react";

type MessageType = {
  role: string;
  content: string;
};

interface ChatContextProps {
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  input: string;
  setInput: (input: string) => void;
  model: Live2DModel | null;
  setModel: (model: Live2DModel | null) => void;
  handleLipsync: (url: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextProps | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState<Live2DModel | null>(null);

  const handleLipsync = async (url: string) => {
    if (!model) return;
    await model.speak(url, {
      volume: 1,
      expression: 1,
      resetExpression: true,
      crossOrigin: "anonymous",
    });
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        input,
        setInput,
        model,
        setModel,
        handleLipsync,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
