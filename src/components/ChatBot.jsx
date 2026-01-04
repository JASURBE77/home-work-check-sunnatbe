import React, { useState, useRef, useEffect } from "react";
import { generateSmartReply } from "../helpers/chat.helper";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Salom! Qanday yordam bera olaman? 😊" },
  ]);
  const [typing, setTyping] = useState(false);

  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  async function sendMessage() {
    if (!input.trim()) return;

    const text = input.trim();
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setTyping(true);

    const reply = await generateSmartReply(text);

    setTyping(false);
    setMessages((prev) => [...prev, { from: "bot", text: reply }]);
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 btn btn-primary btn-circle shadow-lg text-2xl"
      >
        {open ? "×" : "💬"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-80 bg-base-100 shadow-2xl rounded-2xl border">
          <div className="bg-primary text-primary-content p-3 font-semibold text-lg rounded-t-2xl">
            HelperBot 🤖
          </div>

          <div ref={scrollRef} className="h-80 overflow-y-auto p-3 space-y-3 bg-base-200">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`chat ${m.from === "user" ? "chat-end" : "chat-start"}`}
              >
                <div
                  className={`chat-bubble ${
                    m.from === "user" ? "bg-primary text-white" : "bg-white text-gray-800"
                  }`}
                  dangerouslySetInnerHTML={{ __html: m.text }}
                />
              </div>
            ))}

            {typing && (
              <div className="chat chat-start">
                <div className="chat-bubble bg-white text-gray-700 animate-pulse">
                  Bot yozmoqda...
                </div>
              </div>
            )}
          </div>

          <div className="flex border-t p-2 gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="input input-bordered input-sm flex-1"
              placeholder="Xabar yozing..."
            />
            <button onClick={sendMessage} className="btn btn-primary btn-sm">
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
