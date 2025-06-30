import React, { useState } from "react";

interface ChatInterfaceProps {
  template: {
    id: string;
    sections: { [key: string]: string };
    exampleData?: string;
    title: string; // Add title property
  };
  apiKey: string;
  systemPrompt: string;
  thoughtProcessPrompt: string;
  onUpdate: (updatedTemplate: ChatInterfaceProps["template"]) => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  template,
  apiKey,
  systemPrompt,
  thoughtProcessPrompt,
  onUpdate,
}) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || !apiKey) return;
    setIsLoading(true);
    const userMessage: Message = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: thoughtProcessPrompt },
              {
                role: "user",
                content: `Current template:\n${JSON.stringify(
                  template.sections,
                  null,
                  2
                )}\n\nUser request: ${input}`,
              },
            ],
          }),
        }
      );
      const data = await response.json();
      const assistantMessage: Message = data.choices[0].message;
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);

      const content = assistantMessage.content;
      const sectionMatch = content.match(/```json\n([\s\S]*?)\n```/);
      if (sectionMatch) {
        const updatedSections = JSON.parse(sectionMatch[1]);
        onUpdate({ ...template, sections: updatedSections });
      }
    } catch (error: unknown) {
      let errorMessage = "An unknown error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setMessages((prevMessages) => [
        ...prevMessages,
        userMessage,
        { role: "assistant", content: "Error: " + errorMessage },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4">Chat with AI</h2>
      <div className="flex-1 overflow-y-auto mb-4 p-2 bg-white rounded border">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block p-2 rounded ${
                msg.role === "user" ? "bg-blue-200" : "bg-gray-200"
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
        {isLoading && <p className="text-center">Loading...</p>}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 p-2 border rounded-l"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
        />
        <button
          className="p-2 bg-blue-500 text-white rounded-r"
          onClick={handleSend}
          disabled={isLoading || !apiKey}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
