import { useState } from "react";
import { askGemini } from "../gemini";

export default function AIChat() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;

    setLoading(true);

    try {
      const result = await askGemini(input);
      setResponse(result);
    } catch {
      setResponse("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#020617,#0f172a,#111827)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
        fontFamily: "Arial,sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          background: "rgba(17,24,39,.9)",
          borderRadius: 24,
          padding: 30,
          border: "1px solid #334155",
          boxShadow: "0 0 40px rgba(0,255,180,.15)",
        }}
      >
        <h1
          style={{
            color: "#34d399",
            fontSize: 36,
            marginBottom: 5,
          }}
        >
          🩺 AI Healthcare Advisor
        </h1>

        <p style={{ color: "#94a3b8", marginBottom: 25 }}>
          Ask about symptoms, medicines, diet and fitness.
        </p>

        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <button style={chip}>❤️ Symptoms</button>
          <button style={chip}>💊 Medicine</button>
          <button style={chip}>🥗 Diet</button>
          <button style={chip}>😴 Sleep</button>
        </div>

        <textarea
          rows={6}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Ask your health question..."
          style={{
            width: "100%",
            background: "#0f172a",
            border: "1px solid #334155",
            borderRadius: 16,
            padding: 18,
            color: "white",
            fontSize: 16,
            resize: "none",
            outline: "none",
          }}
        />

        <button
          onClick={send}
          disabled={loading}
          style={{
            marginTop: 20,
            background: "linear-gradient(90deg,#10b981,#06b6d4)",
            border: "none",
            borderRadius: 14,
            padding: "14px 30px",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          {loading ? "Thinking..." : "➜ Ask AI"}
        </button>

        <div
          style={{
            marginTop: 30,
            background: "#0b1220",
            borderRadius: 18,
            padding: 20,
            border: "1px solid #334155",
            minHeight: 220,
          }}
        >
          <h3 style={{ color: "#34d399" }}>🤖 AI Response</h3>

          <div
            style={{
              marginTop: 15,
              color: "#e2e8f0",
              whiteSpace: "pre-wrap",
              lineHeight: 1.7,
            }}
          >
            {response || "Your AI response will appear here..."}
          </div>
        </div>
      </div>
    </div>
  );
}

const chip: React.CSSProperties = {
  background: "#1e293b",
  color: "#34d399",
  border: "1px solid #334155",
  borderRadius: 12,
  padding: "10px 16px",
  cursor: "pointer",
};