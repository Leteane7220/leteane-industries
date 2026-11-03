import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { campusEvents, type CampusEvent } from "@/lib/campus-events";
import { getLiveCampusEvents } from "@/lib/supabase";
import { verifyEvents, type EventVerification } from "@/lib/verify-events.functions";

export type CampusFeed = {
  events: CampusEvent[];
  checks: Record<string, EventVerification>;
  lastRefreshed: Date | null;
  refreshing: boolean;
  refresh: () => Promise<void>;
};

export function useCampusFeed(): CampusFeed {
  const [events, setEvents] = useState<CampusEvent[]>(campusEvents);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [checks, setChecks] = useState<Record<string, EventVerification>>({});
  const runVerification = useServerFn(verifyEvents);

  const refresh = async () => {
    setRefreshing(true);
    try {
      const [data, liveEvents] = await Promise.all([
        runVerification({}),
        getLiveCampusEvents(),
      ]);
      setEvents(liveEvents);
      const next: Record<string, EventVerification> = {};
      for (const result of data.results) next[result.url] = result;
      setChecks(next);
      setLastRefreshed(new Date(data.checkedAt));
    } catch {
      try {
        const liveEvents = await getLiveCampusEvents();
        setEvents(liveEvents);
      } catch {
        // preserve current events
      }
      setLastRefreshed(new Date());
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { events, checks, lastRefreshed, refreshing, refresh };
}
