export type CampusEvent = {
  title: string;
  source: string;
  location: string;
  campus: "APK" | "APB" | "JBS" | "SWC" | "DFC";
  /** ISO date (Africa/Johannesburg local day) */
  date: string;
  time: string;
  status: "Live" | "Verified" | "Pending";
  category: string;
  /** Whether entry is free or tickets are paid. */
  free: boolean;
  /** Date (ISO) the free/paid status was re-checked on the source page. */
  priceCheckedOn: string;
  /** Registered attendees reported by the source listing. */
  attendees: number;
  url: string;
};

export const campusLabels: Record<CampusEvent["campus"], string> = {
  APK: "Auckland Park Kingsway",
  APB: "Auckland Park Bunting Road",
  JBS: "Johannesburg Business School",
  SWC: "Soweto Campus",
  DFC: "Doornfontein Campus",
};

export const webEvents: CampusEvent[] = [
  {
    title: "Joburg Moves Junior",
    source: "Quicket, UJ Arts & Culture",
    location: "UJ Arts Centre, Auckland Park Kingsway Campus, Kingsway Avenue, Rossmore, Johannesburg",
    campus: "APK",
    date: "2026-09-22",
    time: "18:00",
    status: "Verified",
    category: "Culture",
    free: false,
    priceCheckedOn: "2026-09-22",
    attendees: 214,
    url: "https://www.quicket.co.za/organisers/76480-uj-arts-culture",
  },
  {
    title: "UJ Future Forward Fun Run 2026 (10km, 5km, 2.5km)",
    source: "UJ Sport, Online Entries",
    location: "AW Muller Stadium, UJ Auckland Park Bunting Road Campus, Bunting Road, Auckland Park, Johannesburg",
    campus: "APB",
    date: "2026-09-26",
    time: "08:00",
    status: "Verified",
    category: "Sport",
    free: false,
    priceCheckedOn: "2026-09-22",
    attendees: 1250,
    url: "https://secure.onreg.com/onreg2/front/step1.php?id=7913",
  },
  {
    title: "Future Economy Conference & Career Expo 2026",
    source: "Quicket, Educonnect Media SA",
    location: "Johannesburg Business School, 69 Kingsway Avenue, Auckland Park, Johannesburg",
    campus: "JBS",
    date: "2026-09-28",
    time: "09:00",
    status: "Verified",
    category: "Careers",
    free: true,
    priceCheckedOn: "2026-09-22",
    attendees: 867,
    url: "https://www.quicket.co.za/events/393331-educonnect-media-future-economy-career-expo-2026/",
  },
  {
    title: "Relational Trans_Positions, FADA Creative Research Exhibition (until 9 Oct)",
    source: "UJ Arts & Culture",
    location: "FADA Gallery, UJ Auckland Park Bunting Road Campus, Bunting Road, Auckland Park, Johannesburg",
    campus: "APB",
    date: "2026-10-09",
    time: "09:00",
    status: "Live",
    category: "Culture",
    free: true,
    priceCheckedOn: "2026-09-22",
    attendees: 284,
    url: "https://arts.uj.ac.za/whats-on/fada-gallery-presents-relational-trans-positions-a-creative-research-exhibition/",
  },
  {
    title: "UJ Arts Academy Showcase, Free Events Programme",
    source: "Quicket, UJ Arts & Culture",
    location: "Drama Studio, Bunting Theatre Complex, UJ Auckland Park Bunting Road Campus, Bunting Road, Auckland Park, Johannesburg",
    campus: "APB",
    date: "2026-10-13",
    time: "16:30",
    status: "Verified",
    category: "Culture",
    free: true,
    priceCheckedOn: "2026-09-22",
    attendees: 156,
    url: "https://www.quicket.co.za/organisers/76480-uj-arts-culture",
  },
  {
    title: "Arts Academy Showcase 2026, The Hoopie Games & Close Enough",
    source: "Quicket, UJ Arts & Culture",
    location: "Drama Studio, Bunting Theatre Complex, UJ Auckland Park Bunting Road Campus, Bunting Road, Auckland Park, Johannesburg",
    campus: "APB",
    date: "2026-10-13",
    time: "18:00",
    status: "Verified",
    category: "Culture",
    free: false,
    priceCheckedOn: "2026-09-22",
    attendees: 241,
    url: "https://www.quicket.co.za/events/397037-arts-academy-showcase-2026/",
  },
  {
    title: "JBS Open Day",
    source: "Quicket, UJ Johannesburg Business School",
    location: "Johannesburg Business School, 69 Kingsway Avenue, Auckland Park, Johannesburg",
    campus: "JBS",
    date: "2026-10-24",
    time: "08:00",
    status: "Verified",
    category: "Open Day",
    free: true,
    priceCheckedOn: "2026-10-09",
    attendees: 0,
    url: "https://www.quicket.co.za/events/382273-jbs-open-day/",
  },
];

export type SocialPlatform = "Instagram" | "X" | "Facebook" | "TikTok" | "LinkedIn";

const SOCIAL_HOSTS: [RegExp, SocialPlatform][] = [
  [/(^|\.)instagram\.com$/, "Instagram"],
  [/(^|\.)(x|twitter)\.com$/, "X"],
  [/(^|\.)(facebook|fb)\.com$/, "Facebook"],
  [/(^|\.)tiktok\.com$/, "TikTok"],
  [/(^|\.)linkedin\.com$/, "LinkedIn"],
];

/** Which social platform an event link points to, or null for ticketing and university sites. */
export function socialPlatformOf(url: string): SocialPlatform | null {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return SOCIAL_HOSTS.find(([re]) => re.test(host))?.[1] ?? null;
  } catch {
    return null;
  }
}

/** True when the link opens one specific post, not just an account profile. */
export function isSpecificSocialPost(url: string): boolean {
  const platform = socialPlatformOf(url);
  if (!platform) return false;
  const path = new URL(url).pathname;
  switch (platform) {
    case "Instagram":
      return /^\/(p|reel)\/[\w-]+/.test(path);
    case "X":
      return /^\/[\w]+\/status\/\d+/.test(path);
    case "Facebook":
      return /^\/(events\/\d+|[\w.]+\/posts\/[\w]+)/.test(path);
    case "TikTok":
      return /^\/@[\w.]+\/video\/\d+/.test(path);
    case "LinkedIn":
      return /^\/(events\/[\w-]+|posts\/[\w-]+|feed\/update\/)/.test(path);
  }
}

/**
 * Events announced on social media. Add one entry per real post, using the link to the
 * exact post (for example instagram.com/p/..., x.com/<account>/status/<id>), never a profile page.
 * Example shape:
 * {
 *   title: "CV and LinkedIn Clinic",
 *   source: "Instagram, @uj_careerservices",
 *   location: "Library Auditorium, UJ Auckland Park Kingsway Campus, Kingsway Avenue, Rossmore, Johannesburg",
 *   campus: "APK", date: "2026-10-14", time: "12:00", status: "Verified", category: "Careers",
 *   free: true, priceCheckedOn: "2026-10-09", attendees: 0,
 *   url: "https://www.instagram.com/p/<post id>/",
 * }
 */
const socialEventEntries: CampusEvent[] = [];

/** Only keep social entries that point at a specific post. */
export const socialEvents = socialEventEntries.filter((e) => isSpecificSocialPost(e.url));

export const campusEvents: CampusEvent[] = [...webEvents, ...socialEvents];

export const eventSources = Array.from(new Set(campusEvents.map((e) => e.source))).sort();

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Sat 26 Sep" — built from fixed tables so the server and the browser render identically. */
export function formatEventDate(date: string) {
  const [year = 1970, month = 1, day = 1] = date.split("-").map(Number);
  const weekday = WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()] ?? "Mon";
  const monthName = MONTHS[month - 1] ?? "";
  return `${weekday} ${day} ${monthName}`;
}

/** Thousands-grouped count, identical on server and browser. */
export function formatCount(count: number) {
  return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** 24-hour "HH:MM" clock, identical on server and browser. */
export function formatClock(at: Date) {
  const hh = String(at.getHours()).padStart(2, "0");
  const mm = String(at.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function formatEventWhen(event: CampusEvent) {
  return `${formatEventDate(event.date)}, ${event.time}`;
}

/** Google Maps search link for an event venue. */
export function mapsUrl(event: CampusEvent) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
}

/** Free or paid badge styling, shared by the live index table and the assistant rows. */
export function entryClass(free: boolean) {
  return free
    ? "border-foreground bg-foreground text-background"
    : "border-border bg-surface-2 text-muted-foreground";
}

/** Zero padded position of an event in the index, the same number the table shows. */
export function eventNumber(event: CampusEvent, list: CampusEvent[] = campusEvents) {
  const position = list.findIndex((e) => e.url === event.url);
  return String((position < 0 ? 0 : position) + 1).padStart(2, "0");
}

/** True once the event's scheduled start time has passed (Africa/Johannesburg, UTC+02:00). */
export function isEventPast(event: CampusEvent, at: Date = new Date()): boolean {
  const start = new Date(`${event.date}T${event.time}:00+02:00`);
  return start.getTime() < at.getTime();
}

/** Reference "today" for the index. */
export const indexToday = "2026-10-09";

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
