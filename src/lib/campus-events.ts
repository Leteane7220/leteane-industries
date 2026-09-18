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
    title: "AI & Machine Learning Society — Kickoff",
    source: "UJ Events Portal",
    location: "UJ Auckland Park Kingsway Campus — Sanlam Auditorium",
    campus: "APK",
    date: "2026-09-18",
    time: "18:00",
    status: "Live",
    category: "Tech & Innovation",
    url: "https://www.uj.ac.za/events/",
  },
  {
    title: "Career Fair: Tech & Finance Recruiters",
    source: "Instagram @uj_careerservices",
    location: "UJ Auckland Park Bunting Road Campus — Main Hall",
    campus: "APB",
    date: "2026-09-19",
    time: "09:30",
    status: "Live",
    category: "Careers",
    url: "https://www.instagram.com/uj_careerservices/",
  },
  {
    title: "Postgrad Research Methods Workshop",
    source: "Faculty Portal",
    location: "UJ Soweto Campus — Library Seminar Room 2",
    campus: "SWC",
    date: "2026-09-19",
    time: "13:00",
    status: "Verified",
    category: "Academic",
    url: "https://www.uj.ac.za/events/",
  },
  {
    title: "Entrepreneurship Pitch Night",
    source: "X / @go2uj",
    location: "UJ Auckland Park Kingsway Campus — UJ Arts Theatre",
    campus: "APK",
    date: "2026-09-20",
    time: "17:00",
    status: "Pending",
    category: "Entrepreneurship",
    url: "https://x.com/go2uj",
  },
  {
    title: "Open Day — Faculty of Engineering",
    source: "UJ Events Portal",
    location: "UJ Auckland Park Kingsway Campus — Engineering Building, D-Lab",
    campus: "APK",
    date: "2026-09-21",
    time: "10:00",
    status: "Live",
    category: "Academic",
    url: "https://www.uj.ac.za/events/",
  },
  {
    title: "Hackathon: Data for Good (48h)",
    source: "Instagram @uj_studentlife",
    location: "UJ Doornfontein Campus — John Orr Building, Lab 3",
    campus: "DFC",
    date: "2026-09-22",
    time: "08:00",
    status: "Live",
    category: "Tech & Innovation",
    url: "https://www.instagram.com/go2uj/",
  },
  {
    title: "CV Clinic & LinkedIn Headshots",
    source: "Instagram @uj_careerservices",
    location: "UJ Auckland Park Bunting Road Campus — Career Services Office",
    campus: "APB",
    date: "2026-09-23",
    time: "11:00",
    status: "Verified",
    category: "Careers",
    url: "https://www.instagram.com/uj_careerservices/",
  },
  {
    title: "SRC Town Hall: Student Funding Update",
    source: "X / @go2uj",
    location: "UJ Soweto Campus — Imbizo Hall",
    campus: "SWC",
    date: "2026-09-24",
    time: "14:00",
    status: "Live",
    category: "Student Life",
    url: "https://x.com/go2uj",
  },
  {
    title: "Intervarsity Athletics Trials",
    source: "UJ Sport",
    location: "UJ Auckland Park Kingsway Campus — UJ Stadium",
    campus: "APK",
    date: "2026-09-25",
    time: "07:30",
    status: "Verified",
    category: "Sport",
    url: "https://www.uj.ac.za/events/",
  },
  {
    title: "Heritage Day Culture Showcase",
    source: "Instagram @go2uj",
    location: "UJ Auckland Park Kingsway Campus — Student Centre Amphitheatre",
    campus: "APK",
    date: "2026-09-26",
    time: "12:00",
    status: "Pending",
    category: "Culture",
    url: "https://www.instagram.com/go2uj/",
  },
  {
    title: "Cloud & DevOps Student Chapter Meetup",
    source: "UJ Events Portal",
    location: "UJ Doornfontein Campus — IT Building, Room 210",
    campus: "DFC",
    date: "2026-09-29",
    time: "17:30",
    status: "Live",
    category: "Tech & Innovation",
    url: "https://www.uj.ac.za/events/",
  },
  {
    title: "Bursary & NSFAS Appeals Workshop",
    source: "Faculty Portal",
    location: "UJ Soweto Campus — Lecture Hall B",
    campus: "SWC",
    date: "2026-10-01",
    time: "10:00",
    status: "Verified",
    category: "Student Life",
    url: "https://www.uj.ac.za/events/",
  },
  {
    title: "Design Thinking Bootcamp",
    source: "Instagram @uj_studentlife",
    location: "UJ Auckland Park Bunting Road Campus — FADA Studio 4",
    campus: "APB",
    date: "2026-10-03",
    time: "09:00",
    status: "Pending",
    category: "Entrepreneurship",
    url: "https://www.instagram.com/go2uj/",
  },
  {
    title: "Exam Prep: Statistics Masterclass",
    source: "Faculty Portal",
    location: "UJ Auckland Park Kingsway Campus — C Les 100",
    campus: "APK",
    date: "2026-10-06",
    time: "16:00",
    status: "Live",
    category: "Academic",
    url: "https://www.uj.ac.za/events/",
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

/** Reference "today" for the demo index. */
export const indexToday = "2026-09-18";

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
