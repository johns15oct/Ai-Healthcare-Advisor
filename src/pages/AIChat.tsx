import { useState } from "react";
import { askGemini } from "../gemini";

export default function AIChat() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setLoading(true);

    try {
      const result = await askGemini(input);
      setResponse(result);
    } catch (error) {
      setResponse("Error getting AI response.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Health Advisor</h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask a health question..."
        rows={5}
        style={{ width: "100%" }}
      />

      <br />
      <br />

      <button onClick={handleSend}>
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      <div style={{ marginTop: "20px" }}>
        <h3>Response:</h3>
        <p>{response}</p>
      </div>
    </div>
  );
}