import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot, Send, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const suggestions = [
  "I'm a first-year on APK, what's on this week?",
  "Anything for students into data science?",
  "Help me find career or bursary events",
];

function messageText(message: { parts: Array<{ type: string; text?: string }> }) {
  return message.parts
    .map((part) => (part.type === "text" ? (part.text ?? "") : ""))
    .join("");
}

export function CampusAssistant() {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, error } = useChat({ transport });
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || isLoading) return;
    void sendMessage({ text: value });
    setInput("");
  };

  return (
    <div className="panel-sheen overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border bg-surface-2 px-5 py-3">
        <span className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
          <Sparkles className="size-4 text-primary" />
          Unify Assistant
        </span>
        <span className="font-mono text-[11px] font-medium text-muted-foreground">
          AI · indexed events only
        </span>
      </div>

      <div ref={scrollRef} className="h-72 space-y-4 overflow-y-auto px-5 py-5">
        {messages.length === 0 ? (
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Bot className="size-4" />
            </span>
            <div className="text-sm leading-relaxed text-muted-foreground">
              Not sure which events are for you? Tell me your campus, year of study or
              interests and I&apos;ll pick events from the live index.
            </div>
          </div>
        ) : null}

        {messages.map((message) => (
          <div
            key={message.id}
            className={message.role === "user" ? "flex justify-end" : "flex items-start gap-3"}
          >
            {message.role === "assistant" ? (
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Bot className="size-4" />
              </span>
            ) : null}
            <div
              className={
                message.role === "user"
                  ? "max-w-[80%] rounded-lg rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                  : "max-w-[85%] whitespace-pre-wrap text-sm leading-relaxed text-foreground"
              }
            >
              {messageText(message)}
            </div>
          </div>
        ))}

        {status === "submitted" ? (
          <p className="font-mono text-xs font-medium text-muted-foreground">thinking…</p>
        ) : null}
        {error ? (
          <p className="font-mono text-xs text-destructive">
            The assistant is unavailable right now. Please try again.
          </p>
        ) : null}
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-wrap gap-2 border-t border-border px-5 py-3">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => send(suggestion)}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          send(input);
        }}
        className="flex items-center gap-3 border-t border-border px-5 py-4"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask which events suit you…"
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground outline-none placeholder:text-foreground/60 focus:border-primary/60"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-40"
        >
          <Send className="size-4" />
          Ask
        </button>
      </form>
    </div>
  );
}
