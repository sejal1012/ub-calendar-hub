import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * ChatLauncher.tsx
 *
 * Drop-in floating chat widget for React + TypeScript.
 * - Floating Action Button (FAB) bottom-right
 * - Click to open a compact chat window
 * - Uses a built-in dummy API by default; swap in your real API easily
 * - No external dependencies or CSS frameworks required
 *
 * Usage:
 *   import ChatLauncher from "./ChatLauncher";
 *   export default function App() {
 *     return (
 *       <>
 *         <YourApp />
 *         <ChatLauncher />
 *       </>
 *     );
 *   }
 */

// Types
export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

export type ChatLauncherProps = {
  /** Optional: provide your own async send function to hit a real API */
  onSend?: (history: ChatMessage[], userText: string) => Promise<string>;
  /** Optional: widget title */
  title?: string;
  /** Optional: start open */
  defaultOpen?: boolean;
  /** Optional: placeholder text */
  placeholder?: string;
  iconSrc?: string;
};

// --- Dummy API ------------------------------------------------------------
// Simulates a network call. Replace by passing `onSend` prop.
async function dummyApi(history: ChatMessage[], userText: string): Promise<string> {
  // Simulate latency
  await new Promise((r) => setTimeout(r, 600));

  // A couple of playful canned responses with a tiny bit of state awareness
  const lower = userText.trim().toLowerCase();
  if (!lower) return "I didn’t catch that—try typing something.";
  if (/(hello|hi|hey)\b/.test(lower)) return "Hey! How can I help you today?";
  if (/help|how|what can you do/.test(lower)) {
    return "I’m a demo chatbot. Ask me anything—this uses a dummy API. You can wire me to your backend by passing an `onSend` prop.";
  }
  // Echo last two user lines for demo flavor
  const lastUser = history.filter((m) => m.role === "user").slice(-1)[0]?.content ?? "";
  const prevUser = history.filter((m) => m.role === "user").slice(-2)[0]?.content ?? "";
  const bits = [lastUser, prevUser].filter(Boolean).map((s) => `“${s}”`).join(" and ");
  return bits
    ? `Got it. You said ${bits}. (This is a mock reply—swap in your real API when ready!)`
    : "Message received. (Mock reply from the built-in dummy API.)";
}

// Utility
const uid = () => Math.random().toString(36).slice(2, 10);

export default function ChatLauncher({
  onSend,
  title = "Chatbot",
  defaultOpen = false,
  placeholder = "Type a message…",
  iconSrc
}: ChatLauncherProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: uid(), role: "assistant", content: "Hi! I’m your helper. Ask me anything." },
  ]);
  const [loading, setLoading] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const sendFn = useMemo(() => onSend ?? dummyApi, [onSend]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const el = viewportRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  async function handleSend(raw?: string) {
    const text = (raw ?? input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { id: uid(), role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendFn(messages.concat(userMsg), text);
      const botMsg: ChatMessage = { id: uid(), role: "assistant", content: reply };
      setMessages((m) => [...m, botMsg]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { id: uid(), role: "assistant", content: `Oops—API error: ${e?.message ?? e}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      {!open && (
        <button
          aria-label="Open chat"
          onClick={() => setOpen(true)}
          style={fabStyle}
        >
          {iconSrc ? (
            <img src={iconSrc} alt="chat" style={{ width: 50, height: 50, objectFit: "contain" }} />
              ) : (
          <ChatIcon />
            )}
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div style={sheetStyle} role="dialog" aria-modal="false" aria-label={`${title} window`}>
          <div style={sheetHeaderStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <BotAvatar />
              <div style={{ fontWeight: 700 }}>{title}</div>
            </div>
            <button aria-label="Close chat" onClick={() => setOpen(false)} style={iconBtnStyle}>
              <CloseIcon />
            </button>
          </div>

          <div ref={viewportRef} style={viewportStyle}>
            {messages.map((m) => (
              <MessageBubble key={m.id} role={m.role} text={m.content} />
            ))}
            {loading && <TypingBubble />}
          </div>

          <div style={composerStyle}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              style={textareaStyle}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || input.trim().length === 0}
              style={{ ...sendBtnStyle, opacity: loading || input.trim().length === 0 ? 0.6 : 1 }}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// --- Presentational pieces -------------------------------------------------
function MessageBubble({ role, text }: { role: ChatMessage["role"]; text: string }) {
  const isUser = role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
      <div
        style={{
          maxWidth: "80%",
          padding: "10px 12px",
          borderRadius: 12,
          margin: "6px 0",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          background: isUser ? "#2563eb" : "#f1f5f9",
          color: isUser ? "#fff" : "#0f172a",
          boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
        }}
      >
        {text}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "6px 0" }}>
      <BotAvatar />
      <div style={{
        background: "#f1f5f9",
        borderRadius: 12,
        padding: "8px 12px",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}>
        <Dot />
        <Dot style={{ animationDelay: "0.15s" }} />
        <Dot style={{ animationDelay: "0.3s" }} />
      </div>
    </div>
  );
}

function Dot({ style }: { style?: React.CSSProperties }) {
  return (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: 999,
        display: "inline-block",
        background: "#64748b",
        opacity: 0.7,
        animation: "chat-dot 1s infinite ease-in-out",
        ...style,
      }}
    />
  );
}

function BotAvatar() {
  return (
    <div style={{
      width: 28,
      height: 28,
      borderRadius: 999,
      background: "#e2e8f0",
      display: "grid",
      placeItems: "center",
      boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
    }}>
      <BotIcon />
    </div>
  );
}

// --- Icons (inline SVG) ----------------------------------------------------
function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

function BotIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="10" rx="2" ry="2"></rect>
      <path d="M8 7V5a4 4 0 1 1 8 0v2"></path>
      <line x1="8" y1="11" x2="8" y2="11"></line>
      <line x1="16" y1="11" x2="16" y2="11"></line>
    </svg>
  );
}

// --- Inline Styles ---------------------------------------------------------
const fabStyle: React.CSSProperties = {
  position: "fixed",
  right: 34,
  bottom: 34,
  width: 60,
  height: 60,
  borderRadius: 999,
  border: "none",
  background: "#a6bbe9ff",
  color: "#fff",
  boxShadow: "0 8px 18px rgba(37,99,235,0.35), 0 2px 6px rgba(0,0,0,0.15)",
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
};

const sheetStyle: React.CSSProperties = {
  position: "fixed",
  right: 20,
  bottom: 20,
  width: 360,
  maxWidth: "calc(100vw - 40px)",
  height: 480,
  maxHeight: "calc(100vh - 40px)",
  background: "#ffffff",
  borderRadius: 16,
  boxShadow: "0 24px 48px rgba(0,0,0,0.18), 0 6px 16px rgba(0,0,0,0.16)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  border: "1px solid #e2e8f0",
};

const sheetHeaderStyle: React.CSSProperties = {
  height: 52,
  padding: "0 12px 0 10px",
  borderBottom: "1px solid #e2e8f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "#f8fafc",
};

const iconBtnStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 8,
  border: "none",
  background: "transparent",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
  color: "#0f172a",
};

const viewportStyle: React.CSSProperties = {
  flex: 1,
  padding: "10px 12px",
  overflowY: "auto",
  background: "#fff",
};

const composerStyle: React.CSSProperties = {
  padding: 10,
  borderTop: "1px solid #e2e8f0",
  display: "flex",
  gap: 8,
  alignItems: "flex-end",
  background: "#f8fafc",
};

const textareaStyle: React.CSSProperties = {
  flex: 1,
  minHeight: 38,
  maxHeight: 120,
  resize: "none",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  outline: "none",
  font: "inherit",
  lineHeight: 1.35,
  background: "#fff",
};

const sendBtnStyle: React.CSSProperties = {
  height: 38,
  minWidth: 38,
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
  boxShadow: "0 4px 10px rgba(37,99,235,0.35)",
};

// --- Tiny keyframe for typing dots (injected once) ------------------------
// We inject a keyframe style tag once in the document head for the dot animation.
(function ensureDotKeyframes() {
  if (typeof document === "undefined") return;
  const id = "chat-dot-anim-css";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `@keyframes chat-dot { 0%, 80%, 100% { transform: translateY(0); opacity: .7 } 40% { transform: translateY(-3px); opacity: 1 } }`;
  document.head.appendChild(style);
})();
