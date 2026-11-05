import assert from "node:assert/strict";
import { test } from "node:test";
import { webEvents, type CampusEvent } from "./campus-events";
import { eventNumber } from "./campus-events";

test("events sharing a source URL receive distinct index numbers", () => {
  const sortedCatalogue = [...webEvents].sort((a, b) =>
    `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`),
  );
  const first = sortedCatalogue.find((event) => event.title === "Joburg Moves Junior");
  const second = sortedCatalogue.find(
    (event) => event.title === "UJ Arts Academy Showcase, Free Events Programme",
  );

  assert.ok(first);
  assert.ok(second);
  assert.equal(first.url, second.url);
  assert.equal(eventNumber(first, sortedCatalogue), "01");
  assert.equal(eventNumber(second, sortedCatalogue), "05");
});