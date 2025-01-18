import { createContext, useState, useContext } from "react";

const ChatContext = createContext({});

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hey there! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isTalking, setIsTalking] = useState(false); // State to track if the character is talking
  const [audioUrl, setAudioUrl] = useState(""); // State for audio URL
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        input,
        setInput,
        isTyping,
        setIsTyping,
        isTalking,
        setIsTalking,
        audioUrl,
        setAudioUrl,
        selectedCharacter,
        setSelectedCharacter,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
