import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import Papa from "papaparse";

export const sourceUrl =
  "https://docs.google.com/spreadsheets/d/1DIYOGjG6-t3a_IEDMYrNogYpEVgAGu3PLOLW0qXdGR4/export?format=csv&gid=493154924";

export function normalizeSheet(csv) {
  const parsed = Papa.parse(csv, { skipEmptyLines: false });
  if (parsed.errors.length) throw new Error(JSON.stringify(parsed.errors));
  const rows = parsed.data;
  const headerIndex = rows.findIndex(
    (row) => row[0] === "Giờ" && row[1] === "Loại hoạt động",
  );
  if (headerIndex < 0)
    throw new Error(
      "Expected four-column Vietnamese itinerary headers were not found. Review the source layout before importing.",
    );
  const itinerary = [];
  const locations = [];
  const issues = [];
  let currentDay;
  for (const [index, raw] of rows.entries()) {
    if (index <= headerIndex) continue;
    const [time = "", activity = "", place = "", note = ""] = raw.map((cell) =>
      cell.trim(),
    );
    if (![time, activity, place, note].some(Boolean)) continue;
    const dateMatch = time.match(/^(T[2-7]|CN)\s+(\d{2})\/(\d{2})\/(\d{4})$/);
    if (dateMatch) {
      const [, weekday, date, month, year] = dateMatch;
      currentDay = {
        id: `day-${year}-${month}-${date}`,
        date: `${year}-${month}-${date}`,
        sourceLabel: time,
        weekday,
        activities: [],
      };
      itinerary.push(currentDay);
      continue;
    }
    if (!currentDay)
      throw new Error(`Activity before day heading at row ${index + 1}`);
    if (!activity && !place && !note) {
      issues.push({
        row: index + 1,
        type: "empty-slot",
        source: raw,
        message:
          "Time-only slot retained here, not rendered as a fabricated activity.",
      });
      continue;
    }
    const sequence = currentDay.activities.length + 1;
    const id = `${currentDay.id}-activity-${String(sequence).padStart(2, "0")}`;
    const times = [...time.matchAll(/(\d{1,2})h(\d{2})?/g)].map(
      (match) => `${match[1].padStart(2, "0")}:${match[2] || "00"}`,
    );
    const sourceLinks = note.match(/https?:\/\/[^\s]+/g) || [];
    const mapUrl =
      sourceLinks.find((link) =>
        /maps\.app\.goo\.gl|google\..*maps/.test(link),
      ) || null;
    const title = activity || place.split("\n")[0];
    const costMatch = place.match(/(\d+)k\s*\/\s*vé/i);
    const isPlace = Boolean(mapUrl) || /Dinh III|Chợ Đà Lạt/.test(place);
    let locationId = null;
    if (isPlace) {
      locationId = `location-${id}`;
      const address =
        place
          .split("\n")
          .slice(1)
          .filter(
            (line) =>
              /^(?:\d+[\w/ -]*\s|Hẻm\s)/u.test(line) && !/\/\s*vé/.test(line),
          )
          .join("\n") || null;
      locations.push({
        id: locationId,
        name: place.split("\n")[0].replace(/\s*-\s*\d+k\s*\/\s*vé/i, ""),
        sourceText: place,
        address,
        type: /Check in/.test(activity)
          ? "accommodation"
          : /Ăn|Mua bánh|Cà phê|Cocktail/.test(activity)
            ? "food"
            : "attraction",
        mapUrl,
        coordinates: null,
        coordinateEvidence: null,
        activityIds: [id],
      });
    }
    currentDay.activities.push({
      id,
      sourceRow: index + 1,
      title,
      time: times[0] || null,
      endTime: times[1] || null,
      sourceTime: time || null,
      place: place || null,
      note: mapUrl === note ? null : note || null,
      links: sourceLinks,
      locationId,
      cost: costMatch
        ? {
            amount: Number(costMatch[1]) * 1000,
            currency: null,
            basis: "per-ticket",
            source: costMatch[0],
          }
        : null,
      source: { time, activity, place, note },
    });
    if (!time)
      issues.push({
        row: index + 1,
        type: "missing-time",
        activityId: id,
        message: "No time supplied; original position preserved.",
      });
  }
  if (!itinerary.length) throw new Error("No dated itinerary sections found.");
  return {
    itinerary,
    locations,
    issues,
    metadata: {
      title: rows[0][0],
      travelers:
        Number(rows.find((row) => row[0] === "Số lượng:")?.[1]) || null,
      headers: rows[headerIndex],
      populatedRows: rows.filter((row) => row.some(Boolean)).length,
      totalRows: rows.length,
      activityCount: itinerary.reduce(
        (total, day) => total + day.activities.length,
        0,
      ),
    },
  };
}

async function main() {
  const localInput = process.argv[2];
  let csv;
  if (localInput) csv = await readFile(resolve(localInput), "utf8");
  else {
    const response = await fetch(sourceUrl);
    if (!response.ok)
      throw new Error(
        `Sheet export unavailable (${response.status}). Supply a local CSV path instead.`,
      );
    csv = await response.text();
    if (/<!doctype|<html/i.test(csv))
      throw new Error(
        "Sheet returned HTML, not CSV. Export the worksheet manually.",
      );
  }
  const result = normalizeSheet(csv);
  await mkdir("src/data", { recursive: true });
  await mkdir("source", { recursive: true });
  await writeFile("source/itinerary.csv", csv);
  for (const key of ["itinerary", "locations"])
    await writeFile(
      `src/data/${key}.json`,
      `${JSON.stringify(result[key], null, 2)}\n`,
    );
  await writeFile(
    "source/migration.json",
    `${JSON.stringify({ sourceUrl, worksheetGid: "493154924", metadata: result.metadata, issues: result.issues }, null, 2)}\n`,
  );
  console.log(
    JSON.stringify(
      {
        days: result.itinerary.length,
        locations: result.locations.length,
        ...result.metadata,
        issues: result.issues.length,
      },
      null,
      2,
    ),
  );
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await main();
