import { useState, useEffect, useRef } from "react";
import { axiosInstance } from "../lib/axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        await sendMessage(transcript);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const formatText = (text) => {
    return text
      .replace(/\*\*\*(.*?)\*\*\*/g, "<b><i>$1</i></b>")
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/\*(.*?)\*/g, "<i>$1</i>")
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-800 text-white p-2 rounded-lg">$1</pre>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-200 p-1 rounded">$1</code>');
  };

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(), // Ensuring unique ID
      sender: "User",
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/chat", { message });
     console.log(response)
      const botReply =
        response.data.reply

      const botMessage = {
        id: Date.now() + 1, // Ensuring unique ID
        sender: "SpeakFlow AI",
        text: botReply,
        time: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Speak AI response
      if (synth.speaking) {
        synth.cancel(); // Stop any ongoing speech before speaking new response
      }
      const utterance = new SpeechSynthesisUtterance(botReply);
      synth.speak(utterance);
    } catch (error) {
      console.error("Error fetching AI response", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: "Error",
          text: "⚠️ Failed to get a response. Please try again.",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-600 text-white text-center p-4 font-semibold shadow-md text-2xl lg:text-5xl">
        GemBat AI Chat
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-3 container mx-auto">
        {messages.map((msg,ind) => (
          <div key={ind} className={`flex ${msg.sender === "User" ? "justify-end" : "justify-start"}`}>
            <div className={`p-3 max-w-md shadow-md rounded-lg ${msg.sender === "User" ? "bg-blue-500 text-white" : "bg-white text-gray-800"}`}>
              <p dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}></p>
            </div>
          </div>
        ))}
        {loading && <p className="text-gray-500 text-sm text-center">GemBat AI is analyzing your query...</p>}
        <div ref={chatEndRef} />
      </main>

      <div className="relative bottom-16">
        <footer className="bg-white border-t-2 p-4 flex container mx-auto rounded-2xl">
          <button
            onClick={() => recognitionRef.current?.start()}
            className="p-2 bg-green-600 text-white rounded-full mr-2 hover:bg-green-700 transition"
          >
            🎤
          </button>
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          />
          <button
            onClick={() => sendMessage(input)}
            className="p-2 bg-blue-600 text-white rounded-full ml-2 hover:bg-blue-700 transition"
          >
            Send
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Chat;
