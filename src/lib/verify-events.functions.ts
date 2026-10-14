import { createServerFn } from "@tanstack/react-start";
import { getLiveCampusEvents } from "./supabase";


export type EventVerification = {
  url: string;
  /** Source page responded successfully. */
  reachable: boolean;
  status: number | null;
  /** true = free signals found, false = paid price found, null = undetermined. */
  free: boolean | null;
  checkedAt: string;
};

const FREE_PATTERNS = [
  /r\s?0[.,]00/i,
  /free\s+(entry|event|admission|ticket)/i,
  /admission\s+(is\s+)?free/i,
  /no\s+charge/i,
];

const PAID_PATTERN = /r\s?\d{1,3}(?:[ ,]\d{3})*(?:[.,]\d{2})?\b/i;

function detectFree(html: string): boolean | null {
  const text = html.replace(/<[^>]+>/g, " ").slice(0, 200_000);
  if (FREE_PATTERNS.some((p) => p.test(text))) return true;
  const paid = text.match(PAID_PATTERN);
  if (paid && !/r\s?0[.,]?0?0?\b/i.test(paid[0])) return false;
  return null;
}

async function verifyOne(url: string): Promise<EventVerification> {
  const checkedAt = new Date().toISOString();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; UnifyIndexBot/1.0; +https://leteane.industries)",
        accept: "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(timer);
    const html = response.ok ? await response.text() : "";
    return {
      url,
      reachable: response.ok,
      status: response.status,
      free: response.ok ? detectFree(html) : null,
      checkedAt,
    };
  } catch {
    return { url, reachable: false, status: null, free: null, checkedAt };
  }
}

/** Re-visits every indexed event's source page to confirm it still exists and whether entry is free. */
export const verifyEvents = createServerFn({ method: "POST" }).handler(async () => {
  const events = await getLiveCampusEvents();
  const results = await Promise.all(events.map((event) => verifyOne(event.url)));
  return { checkedAt: new Date().toISOString(), results };
});
