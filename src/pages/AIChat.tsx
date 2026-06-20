import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { askGemini } from "../gemini";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  "What foods are good for high blood pressure?",
  "How much exercise should I do weekly?",
  "What is a normal blood sugar level?",
  "How can I improve my sleep quality?",
];

export default function AIChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      text: "Hi! I'm your AI Health Advisor. I can answer general health questions about nutrition, exercise, symptoms, and lifestyle. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || typing) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const response = await askGemini(text.trim());
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, reply]);
    } catch (error) {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text:
          error instanceof Error
            ? error.message
            : "Gemini could not answer right now. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, reply]);
    } finally {
      setTyping(false);
    }
  };

  const handleSend = () => sendMessage(input);
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const fmt = (d: Date) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-4 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <Bot size={20} className="text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm">AI Health Advisor</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Online · General health Q&A
          </p>
        </div>
        <div className="ml-auto bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
          <p className="text-xs text-amber-700 font-medium">Not a substitute for medical advice</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === "assistant" ? "bg-primary" : "bg-primary/10"
              }`}
            >
              {msg.role === "assistant" ? (
                <Bot size={15} className="text-white" />
              ) : (
                <span className="text-primary text-xs font-bold">{user?.name[0]}</span>
              )}
            </div>
            <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "assistant"
                    ? "bg-white border border-border text-foreground shadow-sm rounded-tl-sm"
                    : "bg-primary text-white rounded-tr-sm"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-xs text-muted-foreground px-1">{fmt(msg.timestamp)}</span>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Bot size={15} className="text-white" />
            </div>
            <div className="bg-white border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center h-5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              className="text-left px-4 py-3 bg-white border border-border rounded-xl text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-secondary transition-all"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="mt-4 flex gap-3 bg-white border border-border rounded-2xl p-2 shadow-sm focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
          placeholder="Ask a health question… (Enter to send)"
          className="flex-1 resize-none px-2 py-2 text-sm bg-transparent focus:outline-none text-foreground placeholder:text-muted-foreground"
          style={{ maxHeight: "100px" }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || typing}
          className="bg-primary hover:bg-green-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all self-end"
        >
          {typing ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
        </button>
      </div>
    </div>
  );
}
