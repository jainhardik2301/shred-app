import { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import { generateCoachResponse } from "./coachEngine";
import { askAICoach } from "../../services/aiCoach";

const quickPrompts = [
  "Analyze my day",
  "What should I eat next?",
  "Should I workout today?",
  "How is my progress?",
];

export default function CoachChat() {
  const { appData } = useApp();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "coach",
      text: "I'm your SHRED AI Coach. I can analyze your nutrition, habits, workouts and progress using the data you've logged in the app.",
    },
  ]);

  async function sendMessage(text) {
    const message = text.trim();

    if (!message || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: message,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await askAICoach(
        message,
        appData
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "coach",
          text: response,
        },
      ]);
    } catch (error) {
      console.error(
        "AI Coach Error:",
        error
      );

      const fallbackResponse =
        generateCoachResponse(
          message,
          appData
        );

      setMessages((prev) => [
        ...prev,
        {
          role: "coach",
          text: fallbackResponse,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
      <div>
        <h2 className="text-xl font-bold text-white sm:text-2xl">
          Ask AI Coach
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Get AI-powered guidance based on your SHRED data.
        </p>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={loading}
            onClick={() =>
              sendMessage(prompt)
            }
            className="shrink-0 whitespace-nowrap rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200 transition hover:border-emerald-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="mt-4 max-h-[55vh] min-h-64 space-y-4 overflow-y-auto overflow-x-hidden rounded-xl bg-slate-950 p-3 sm:mt-6 sm:max-h-96 sm:p-4">
        {messages.map(
          (message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[90%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[80%] sm:text-base ${
                  message.role === "user"
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-800 text-slate-200"
                }`}
              >
                {message.text}
              </div>
            </div>
          )
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-slate-800 px-4 py-3 text-sm text-slate-400 sm:text-base">
              SHRED AI Coach is thinking...
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-4 flex flex-col gap-3 sm:flex-row"
      >
        <input
          value={input}
          disabled={loading}
          onChange={(e) =>
            setInput(e.target.value)
          }
          placeholder={
            loading
              ? "AI Coach is thinking..."
              : "Ask your coach anything..."
          }
          className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={
            loading ||
            !input.trim()
          }
          className="w-full rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {loading
            ? "Thinking..."
            : "Send"}
        </button>
      </form>
    </div>
  );
}