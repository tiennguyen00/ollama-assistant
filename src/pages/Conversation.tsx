import ChatBox from "../components/conversation/ChatBox";
import { ChatProvider } from "../providers";

const Conversation = () => {
  return (
    <ChatProvider>
      <ChatBox />
    </ChatProvider>
  );
};

export { Conversation };
