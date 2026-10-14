import { campusEvents, webEvents, type CampusEvent } from "./campus-events";

export const SUPABASE_URL = "https://yfzdfzpvlsguacjffipw.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmemRmenB2bHNndWFjamZmaXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwMDU1NzgsImV4cCI6MjEwNzU4MTU3OH0.aUq_7Wdp-l_cyxpznl-m3GvwAxM4uVajbX5VYgiRU9U";

export interface SupabaseEventRow {
  id?: number;
  title: string;
  source: string;
  location: string;
  campus: "APK" | "APB" | "JBS" | "SWC" | "DFC";
  date: string;
  time: string;
  status?: "Live" | "Verified" | "Pending";
  category?: string;
  free?: boolean;
  price_checked_on?: string;
  priceCheckedOn?: string;
  attendees?: number;
  url: string;
}

export function rowToCampusEvent(row: SupabaseEventRow): CampusEvent {
  return {
    title: row.title,
    source: row.source,
    location: row.location,
    campus: row.campus,
    date: row.date,
    time: row.time,
    status: row.status ?? "Verified",
    category: row.category ?? "Culture",
    free: Boolean(row.free),
    priceCheckedOn:
      row.price_checked_on ??
      row.priceCheckedOn ??
      new Date().toISOString().split("T")[0] ??
      "2026-10-15",
    attendees: Number(row.attendees ?? 0),
    url: row.url,
  };
}

/**
 * Fetches all campus events directly from the Supabase `campus_events` table.
 */
export async function fetchCampusEventsFromSupabase(): Promise<CampusEvent[]> {
  try {
    const endpoint = `${SUPABASE_URL}/rest/v1/campus_events?select=*&order=date.asc,time.asc`;
    const response = await fetch(endpoint, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      console.warn(`[Supabase] Failed to fetch events: HTTP ${response.status}`);
      return [];
    }

    const rows = (await response.json()) as SupabaseEventRow[];
    return rows.map(rowToCampusEvent);
  } catch (err) {
    console.error("[Supabase] Network error fetching events:", err);
    return [];
  }
}

/**
 * Combines verified base web events with live scraped events from Supabase,
 * deduplicating by URL.
 */
export async function getLiveCampusEvents(): Promise<CampusEvent[]> {
  const supabaseEvents = await fetchCampusEventsFromSupabase();
  if (supabaseEvents.length === 0) {
    return campusEvents;
  }

  // Merge webEvents with Supabase events, avoiding duplicate URLs
  const seenUrls = new Set(supabaseEvents.map((e) => e.url));
  const combined = [...supabaseEvents];

  for (const event of webEvents) {
    if (!seenUrls.has(event.url)) {
      combined.push(event);
      seenUrls.add(event.url);
    }
  }

  return combined;
}
