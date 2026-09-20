import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayResponseHeaders,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "@/lib/ai-gateway.server";
import { campusEvents, campusLabels, formatEventWhen, indexToday } from "@/lib/campus-events";
import { createOpenAI } from "@ai-sdk/openai";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

type ChatRequestBody = { messages?: unknown };

const eventCatalogue = campusEvents
  .map(
    (e) =>
      `- ${e.title} | ${formatEventWhen(e)} | ${campusLabels[e.campus]} (${e.campus}) | ${e.location} | category: ${e.category} | entry: ${e.free ? "Free" : "Paid tickets"} | source: ${e.source} | status: ${e.status} | link: ${e.url}`,
  )
  .join("\n");

const systemPrompt = `You are the Unify assistant, provided by Leteane Industries.
You help University of Johannesburg students find events that suit them.
Today's date in the index is ${indexToday} (Africa/Johannesburg).

Ask at most one short clarifying question when the student's interests or campus are unclear.
Recommend 2-4 events from the indexed catalogue below, each with the date, time, campus and a markdown link to the source.
Never invent events, venues or links — only use the catalogue. If nothing fits, say so and suggest the closest alternative.
Keep replies short, friendly and practical.

INDEXED EVENTS:
${eventCatalogue}`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const initialRunId = getLovableAiGatewayRunId(request);
        const runIdFetch = createLovableAiGatewayRunIdFetch(initialRunId);
        const lovable = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey: key,
          headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
          fetch: runIdFetch.fetch,
        });

        const result = streamText({
          model: lovable.responses("openai/gpt-6-astra"),
          system: systemPrompt,
          messages: await convertToModelMessages(messages as UIMessage[]),
          providerOptions: {
            openai: {
              forceReasoning: true,
              reasoningEffort: "low",
              reasoningSummary: "auto",
              store: false,
              include: ["reasoning.encrypted_content"],
            },
          },
        });

        return withLovableAiGatewayRunIdHeader(
          result.toUIMessageStreamResponse({
            originalMessages: messages as UIMessage[],
            headers: getLovableAiGatewayResponseHeaders(undefined, {
              ...(initialRunId ? { "X-Lovable-AIG-Run-ID": initialRunId } : {}),
            }),
          }),
          runIdFetch,
        );
      },
    },
  },
});
