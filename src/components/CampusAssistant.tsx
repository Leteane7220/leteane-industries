import {
  campusEvents,
  entryClass,
  eventNumber,
  formatCount,
  formatEventWhen,
  mapsUrl,
  type CampusEvent,
} from "@/lib/campus-events";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowUpRight, Bot, MapPin, Send, Sparkles, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

const suggestions = [
  "I'm a first year on APK, what's on this week?",
  "Anything for students into data science?",
  "Help me find career or bursary events",
];

function messageText(message: { parts: Array<{ type: string; text?: string }> }) {
  return message.parts
    .map((part) => (part.type === "text" ? (part.text ?? "") : ""))
    .join("");
}

/** A catalogue link the assistant emitted, resolved back to a real indexed event. */
function eventFromLine(line: string): CampusEvent | null | undefined {
  const trimmed = line.trim();
  if (!/^EVENT:/i.test(trimmed)) return null;
  const url = /https?:\/\/\S+/.exec(trimmed)?.[0]?.replace(/[).,]+$/, "");
  if (!url) return undefined; // still streaming, nothing to show yet
  const clean = url.replace(/\/+$/, "");
  return campusEvents.find((event) => event.url.replace(/\/+$/, "") === clean) ?? undefined;
}

/** One event, one line, in the same columns as the live index. */
function EventRow({ event }: { event: CampusEvent }) {
  return (
    <div
      data-event-row={event.url}
      className="flex flex-nowrap items-center gap-2 overflow-x-auto whitespace-nowrap border border-border bg-surface-2/70 px-3 py-2 font-mono text-[11px] font-medium text-foreground"
    >
      <span className="shrink-0 text-muted-foreground">{eventNumber(event)}</span>
      <a
        href={event.url}
        target="_blank"
        rel="noopener noreferrer"
        title={event.title}
        className="group inline-flex min-w-0 items-center gap-1.5 font-sans text-xs font-semibold text-foreground transition-colors hover:text-primary"
      >
        <span className="truncate">{event.title}</span>
        <ArrowUpRight className="size-3 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      </a>
      <span className="shrink-0 text-muted-foreground">{event.source}</span>
      <a
        href={mapsUrl(event)}
        target="_blank"
        rel="noopener noreferrer"
        title={event.location}
        className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
      >
        <MapPin className="size-3.5" />
      </a>
      <span className="shrink-0">{event.campus}</span>
      <span className="shrink-0">{formatEventWhen(event)}</span>
      <span
        className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 ${entryClass(event.free)}`}
      >
        {event.free ? "Free" : "Paid"}
      </span>
      <a
        href={event.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex shrink-0 items-center gap-1 text-muted-foreground transition-colors hover:text-primary"
      >
        {event.free ? "Free ticket" : "Buy tickets"}
        <ArrowUpRight className="size-2.5 transition-colors group-hover:text-primary" />
      </a>
    </div>
  );
}

/** Assistant text becomes prose paragraphs plus one detail line per recommended event. */
function AssistantText({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let prose: string[] = [];

  const flush = () => {
    if (prose.length === 0) return;
    const body = prose.join("\n").trim();
    prose = [];
    if (body)
      blocks.push(
        <p key={`p-${blocks.length}`} className="whitespace-pre-wrap">
          {body}
        </p>,
      );
  };

  text.split("\n").forEach((line) => {
    const event = eventFromLine(line);
    if (event === undefined) return; // partial event line while streaming
    if (event) {
      flush();
      blocks.push(<EventRow key={`e-${blocks.length}`} event={event} />);
      return;
    }
    if (line.trim() === "") {
      flush();
      return;
    }
    prose.push(line);
  });
  flush();

  return <div className="space-y-2.5">{blocks}</div>;
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
                  : "w-full text-sm leading-relaxed text-foreground"
              }
            >
              {message.role === "assistant" ? (
                <AssistantText text={messageText(message)} />
              ) : (
                messageText(message)
              )}
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
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground outline-none placeholder:text-foreground/75 focus:border-primary/60"
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
