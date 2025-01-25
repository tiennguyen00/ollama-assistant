const Loading = () => {
  return (
    <div className="flex items-center gap-4">
      <div
        className="w-2 h-2 rounded-full bg-ghost-dark animate-ping"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="w-2 h-2 rounded-full bg-ghost-dark animate-ping"
        style={{ animationDelay: "0.2s" }}
      />
      <div
        className="w-2 h-2 rounded-full bg-ghost-dark animate-ping"
        style={{ animationDelay: "0.4s" }}
      />
    </div>
  );
};

export default Loading;
