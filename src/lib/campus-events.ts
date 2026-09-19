export type CampusEvent = {
  title: string;
  source: string;
  location: string;
  campus: "APK" | "APB" | "SWC" | "DFC";
  /** ISO date (Africa/Johannesburg local day) */
  date: string;
  time: string;
  status: "Live" | "Verified" | "Pending";
  category: string;
  url: string;
};

export const campusLabels: Record<CampusEvent["campus"], string> = {
  APK: "Auckland Park Kingsway",
  APB: "Auckland Park Bunting Road",
  SWC: "Soweto Campus",
  DFC: "Doornfontein Campus",
};

export const campusEvents: CampusEvent[] = [
  {
    title: "Joburg Moves Junior",
    source: "Quicket — UJ Arts & Culture",
    location: "UJ Auckland Park Kingsway Campus — UJ Arts Centre",
    campus: "APK",
    date: "2026-09-22",
    time: "18:00",
    status: "Verified",
    category: "Culture",
    url: "https://www.quicket.co.za/organisers/76480-uj-arts-culture",
  },
  {
    title: "UJ Future Forward Fun Run 2026 (10km / 5km / 2.5km)",
    source: "UJ Sport — Online Entries",
    location: "UJ Auckland Park Bunting Road Campus — AW Muller Stadium",
    campus: "APB",
    date: "2026-09-26",
    time: "08:00",
    status: "Verified",
    category: "Sport",
    url: "https://secure.onreg.com/onreg2/front/step1.php?id=7913",
  },
  {
    title: "Future Economy Conference & Career Expo 2026",
    source: "Quicket — Educonnect Media SA",
    location: "UJ Auckland Park Bunting Road Campus — Johannesburg Business School",
    campus: "APB",
    date: "2026-09-28",
    time: "09:00",
    status: "Verified",
    category: "Careers",
    url: "https://www.quicket.co.za/events/393331-educonnect-media-future-economy-career-expo-2026/",
  },
  {
    title: "Relational Trans_Positions — FADA Creative Research Exhibition (until 9 Oct)",
    source: "UJ Arts & Culture",
    location: "UJ Auckland Park Bunting Road Campus — FADA Gallery",
    campus: "APB",
    date: "2026-10-09",
    time: "09:00",
    status: "Live",
    category: "Culture",
    url: "https://arts.uj.ac.za/whats-on/fada-gallery-presents-relational-trans-positions-a-creative-research-exhibition/",
  },
  {
    title: "UJ Arts Academy Showcase — Free Events Programme",
    source: "Quicket — UJ Arts & Culture",
    location: "UJ Auckland Park Bunting Road Campus — Drama Studio, Bunting Theatre Complex",
    campus: "APB",
    date: "2026-10-13",
    time: "16:30",
    status: "Verified",
    category: "Culture",
    url: "https://www.quicket.co.za/organisers/76480-uj-arts-culture",
  },
  {
    title: "Arts Academy Showcase 2026 — The Hoopie Games & Close Enough",
    source: "Quicket — UJ Arts & Culture",
    location: "UJ Auckland Park Bunting Road Campus — Drama Studio, Bunting Theatre Complex",
    campus: "APB",
    date: "2026-10-13",
    time: "18:00",
    status: "Verified",
    category: "Culture",
    url: "https://www.quicket.co.za/events/397037-arts-academy-showcase-2026/",
  },
];

export const eventSources = Array.from(new Set(campusEvents.map((e) => e.source))).sort();

export function formatEventDate(date: string) {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString("en-ZA", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatEventWhen(event: CampusEvent) {
  return `${formatEventDate(event.date)} · ${event.time}`;
}

/** Reference "today" for the index. */
export const indexToday = "2026-09-19";

export type TimeWindow = "any" | "today" | "week" | "month";

export function withinWindow(event: CampusEvent, window: TimeWindow) {
  if (window === "any") return true;
  const today = new Date(`${indexToday}T00:00:00`);
  const d = new Date(`${event.date}T00:00:00`);
  const days = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (window === "today") return days === 0;
  if (window === "week") return days >= 0 && days <= 6;
  return days >= 0 && days <= 30;
}
