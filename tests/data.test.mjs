import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { normalizeSheet } from "../scripts/import-sheet.mjs";

test("real worksheet preserves day boundaries, row order, multiline cells and missing times", async () => {
  const csv = await readFile(
    new URL("../source/itinerary.csv", import.meta.url),
    "utf8",
  );
  const result = normalizeSheet(csv);
  assert.equal(result.itinerary.length, 5);
  assert.equal(result.metadata.travelers, 11);
  assert.equal(result.itinerary[0].date, "2026-10-29");
  assert.equal(result.itinerary.at(-1).date, "2026-11-02");
  assert.deepEqual(
    result.itinerary.map((day) => day.activities.length),
    [2, 6, 8, 8, 4],
  );
  const bus = result.itinerary[0].activities[1];
  assert.equal(bus.time, null);
  assert.match(bus.place, /395 Kinh Dương Vương/);
  assert.match(bus.place, /23:30/);
  assert.match(bus.note, /Joanathan/);
  assert.equal(
    result.issues.filter((issue) => issue.type === "empty-slot").length,
    1,
  );
  const costActivity = result.itinerary[2].activities.find(
    (activity) => activity.cost,
  );
  assert.equal(costActivity.cost.amount, 250000);
  assert.equal(costActivity.cost.currency, null);
  assert.equal(
    result.locations.find((location) => location.type === "accommodation")
      .address,
    null,
  );
  assert.equal(
    result.locations.find((location) => location.name === "KDL Cao Nguyên Hoa")
      .address,
    null,
  );
  const activityIds = new Set(
    result.itinerary.flatMap((day) =>
      day.activities.map((activity) => activity.id),
    ),
  );
  for (const location of result.locations) {
    assert.equal(location.coordinates, null);
    assert.ok(location.activityIds.every((id) => activityIds.has(id)));
  }
});

test("unexpected source layouts fail instead of inventing a mapping", () => {
  assert.throws(
    () => normalizeSheet("Date,Activity\n2026-10-29,Unknown"),
    /headers/,
  );
});

test("bundled map, gallery, trip and design records keep valid source references", async () => {
  const load = async (path) =>
    JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
  const days = await load("../src/data/itinerary.json");
  const locations = await load("../src/data/locations.json");
  const verifications = await load("../src/data/location-verifications.json");
  const gallery = await load("../src/data/gallery.json");
  const trip = await load("../src/data/trip.json");
  assert.equal(trip.startDate, days[0].date);
  assert.equal(trip.endDate, days.at(-1).date);
  assert.equal(trip.travelers, 11);
  const locationIds = new Set(locations.map((location) => location.id));
  const dayIds = new Set(days.map((day) => day.id));
  assert.equal(locationIds.size, locations.length);
  for (const verification of verifications) {
    const location = locations.find((item) => item.id === verification.id);
    assert.ok(
      location,
      "Verified location must still exist after source updates",
    );
    assert.equal(
      verification.evidenceUrl,
      location.mapUrl,
      "Coordinate evidence must belong to this exact source location",
    );
    const match = decodeURIComponent(verification.resolvedUrl).match(
      /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
    );
    assert.ok(match, "Map viewport centers are not place-coordinate evidence");
    assert.deepEqual(verification.coordinates, [
      Number(match[1]),
      Number(match[2]),
    ]);
  }
  for (const photo of gallery) {
    if (photo.locationId) assert.ok(locationIds.has(photo.locationId));
    if (photo.dayId) assert.ok(dayIds.has(photo.dayId));
    assert.equal(photo.kind, "illustrative");
    assert.ok(photo.credit && photo.license && photo.sourceUrl);
    assert.ok(
      (await readFile(new URL(`../public/${photo.src}`, import.meta.url)))
        .length > 0,
    );
    const provenance = await load(`../public/${photo.src}.json`);
    assert.equal(provenance.origin, photo.sourceUrl);
  }
  const design = await load("../.impeccable/design.json");
  assert.equal(design.schemaVersion, 2);
  assert.ok(design.extensions && design.components.length >= 5);
});
