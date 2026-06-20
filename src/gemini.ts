/// <reference types="vite/client" />

const MODEL = "gemini-2.5-flash-lite";

export async function askGemini(message: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Gemini is not configured. Add VITE_GEMINI_API_KEY to your .env file and restart the app.",
    );
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: "You are a cautious health information assistant. Give concise, practical general information, do not diagnose, and advise urgent medical help for emergency warning signs.",
            },
          ],
        },
        contents: [
          {
            parts: [
              {
                text: message,
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(
        "Gemini is temporarily rate-limited. Please wait a moment and try again.",
      );
    }

    const apiMessage = data?.error?.message;
    throw new Error(
      apiMessage
        ? `Gemini API error: ${apiMessage}`
        : `Gemini API request failed (${response.status}).`,
    );
  }

  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text ?? "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("Gemini returned no answer. Please rephrase your question.");
  }

  return text;
}
