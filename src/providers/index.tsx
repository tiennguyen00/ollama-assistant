import { Live2DModel } from "pixi-live2d-display-lipsyncpatch";
import { createContext, useState, useContext } from "react";

const ChatContext = createContext({});

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState<Live2DModel | null>(null);

  const handleLipsync = (url: string) => {
    if (!model) return;
    model.speak(url, {
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
