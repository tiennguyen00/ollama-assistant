const ChatBot = () => {
  return (
    <div
      className="flex flex-col h-full p-4 overflow-y-scroll bg-gray-100 rounded-lg shadow-lg max-h-svh scrollbar-thin"
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
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-xl text-lg ${
                message.sender === "user"
                  ? "bg-[#7AB2D3] text-white"
                  : "bg-gray-300 text-[#4A628A]"
              }`}
              dangerouslySetInnerHTML={{
                __html: md.render(message.text),
              }}
            ></div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-xs p-3 rounded-lg bg-gray-300 text-[#4A628A]">
              ...
            </div>
          </div>
        )}
      </div>

      {/* Input Field */}
      <div className="flex items-center mt-4 space-x-2">
        <input
          type="text"
          placeholder={`${
            isTalking || isTyping
              ? "Pixiepal was trying to answer your chat..."
              : " Type your message for pixiepal..."
          }`}
          className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7AB2D3]"
          value={input}
          disabled={isTalking || isTyping ? true : false}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-[#7AB2D3] text-white rounded-lg hover:bg-[#4A628A] transition duration-300"
          disabled={isTalking || isTyping ? true : false}
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
