# Dallas: Sai Gon - Da Lat

A Vietnamese, static travel journal built with React (JavaScript), Vite, Tailwind CSS, Motion, Leaflet, and React Leaflet. The site uses a local copy of the actual itinerary, not sample activities. No backend, account, database, paid API, or runtime Google Sheets access is required.

## Run locally

Use Node.js 22.12 or newer supported by Vite (validated here with Node 25.5) and npm.

```sh
npm ci
npm run dev
```

Open the URL Vite prints, normally http://127.0.0.1:5173/. On Windows, use `npm.cmd` if PowerShell blocks the `npm.ps1` shim. Do not run competing installs in this OneDrive-backed folder. If an install was interrupted, use `npm ci` to restore generated dependencies from the lockfile.

```sh
npm run build
npm run preview
```

Production files are generated in `dist/`. Serve that directory over HTTP; opening the source HTML directly is not supported. The production preview is normally http://127.0.0.1:4173/.

## What is included

- Full-width destination cover, actual dates, group size, accommodation, and trip overview.
- Five selectable days and 31 expandable, source-ordered activities, refreshed from the worksheet on 2026-10-29.
- Lazy-loaded Leaflet map, place-type filters, original map links, four verified markers, and bidirectional schedule selection.
- Five local illustrative destination photographs, credits/licenses, and a lightbox with keyboard, swipe, focus containment, and focus restoration.
- Suggested categorized packing list, custom additions/deletions, progress, confirmed reset, and versioned browser-local persistence with corrupt/blocked storage handling.
- Responsive navigation, visible keyboard focus, reduced-motion support, failed-image captions, tile-failure feedback, and a location-list fallback if the map bundle cannot load.

## Source and data updates

The source is worksheet `493154924`, **Copy of Lịch trình**, in **SaiGon - DaLat 29.10 - 02.11**:

https://docs.google.com/spreadsheets/d/1DIYOGjG6-t3a_IEDMYrNogYpEVgAGu3PLOLW0qXdGR4/edit?gid=493154924

The public CSV export and HTML view were actually retrieved. The CSV snapshot is `source/itinerary.csv`; see `MIGRATION.md` and `source/migration.json` for mapping and ambiguities.

To refresh from the public worksheet:

```sh
npm run import:sheet
```

To use a manually exported copy without network access:

```sh
npm run import:sheet -- path/to/worksheet.csv
```

The importer uses Papa Parse for quoted/multiline CSV cells and rejects an unexpected header layout. It regenerates `itinerary.json`, `locations.json`, the CSV snapshot, and machine-readable migration notes. Never replace them with guessed data when access fails. It does not import unrelated worksheets or interpret missing cells as invented activities.

Data ownership:

| File in `src/data/`           | Purpose                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------ |
| `trip.json`                   | Verified trip metadata and an editorial introduction derived from the itinerary                        |
| `itinerary.json`              | Day/activity IDs, original cells, row references, normalized times, links, and available costs         |
| `locations.json`              | Source place text, supported address lines, map links, location type, and activity IDs                 |
| `location-verifications.json` | Explicit Google place-coordinate evidence, kept separate from raw source facts                         |
| `gallery.json`                | Local photo paths, alt text, illustrative status, attribution, licenses, and optional day/location IDs |
| `packing.json`                | Clearly labeled suggested starter items; edit locally to change the defaults                           |

Day IDs use ISO dates; activity IDs use that day plus source sequence. They are deterministic on repeat import. Inserting/reordering source rows can change activity/location IDs: review all cross-file IDs and regenerate coordinate evidence after structural updates. Changes to dates, counts, accommodation, or photo associations require reviewing the manually maintained files too. Update test expectations when the real itinerary changes.

Coordinate evidence must identify the actual place, not a Google Maps camera/viewport center. The asset preparation script resolves original map links during development and accepts only explicit `!3d...!4d...` place coordinates in the final URL. Unresolved places remain link-only. Do not attach old verification records to changed location IDs.

```sh
npm run prepare:assets
```

This optional development command downloads the five Wikimedia photos and their attribution/provenance, rebuilds gallery metadata, and refreshes map verification evidence. It requires internet access; normal builds do not. Back up personal-photo replacements before running it because its known illustration filenames are regenerated.

## Photos and maps

Personal photos have not been supplied. All included photography is licensed illustrative destination imagery, not trip memories. `gallery.json` and the in-page credits contain the author, source, and license; each shipping JPEG also has a provenance sidecar. Retain appropriate credits/licenses when replacing or recropping those files. Fonts are self-hosted from Fontsource packages; Lucide supplies icons.

Tiles use OpenStreetMap's standard tile server with visible attribution. Follow https://operations.osmfoundation.org/policies/tiles/ and https://www.openstreetmap.org/copyright. Do not bulk download/prefetch tiles or promise offline maps. For traffic beyond this small personal journal, choose a provider whose policy covers the usage and update `TripMap.jsx`. External map/imagery services are not necessary to read the bundled itinerary. Tile requests reveal the usual IP/referrer information to their provider.

Packing state is stored under `dallas:saigon-dalat-2026:packing:v1` in the current origin's `localStorage`. It is not synchronized across devices or hosting origins. Reset clears checked states after confirmation, not custom items. Deleting a custom item removes it from the saved list. Changing starter IDs discards obsolete saved selections safely.

## Tests

```sh
npm test
npm run build
npm run test:browser
```

Browser tests start or reuse a production preview on port **4174**, run serially, and default to installed Microsoft Edge. To use Playwright Chromium instead, install it with `npx playwright install chromium` and set `PLAYWRIGHT_CHANNEL=chromium` in your shell. Build before running browser tests. Do not run multiple suites simultaneously against the same preview/output directory.

The checked-in tests cover source ordering and irregular cells, corrupt packing data, every available day, activity expansion, cost wording, keyboard day navigation, lightbox keyboard/swipe/focus, packing reload/add/delete/reset, blocked storage, verified marker selection/list visibility, unavailable tiles, map-bundle failure fallback, loaded images, and document overflow at 1440/768/390/320px. Screenshots are saved to `.impeccable/review/`. Test traces and output are ignored by Git.

This implementation was validated with a production build, four Node tests, and seven Edge/Playwright tests. Actual iOS/Android devices, Safari, physical touch hardware, and deployment to a remote host were not tested. No formal full WCAG audit or performance benchmark is claimed.

## Deploy a static site

### Netlify or Vercel

- Build command: `npm run build`.
- Output directory: `dist`.
- No backend functions, secrets, or SPA rewrite rules are needed for this single-page anchor-based site.

### GitHub Pages

Build with the repository path, then publish the **contents** of `dist/` through a Pages workflow/artifact or static publishing branch:

```powershell
$env:VITE_BASE_PATH = '/your-repository/'
npm run build
```

For a root/custom-domain deployment use `/`. The default base is `./`, so bundled assets and local photo paths also work in a subdirectory. `assetUrl()` uses Vite's build base; never hardcode root-relative image paths. A deployment workflow has not been added because no repository/hosting target is configured.

Before publishing, review all source notes, traveler names, dates, accommodation, and future booking references for privacy. Anything bundled into a static site is public to its visitors. The app does not fetch private data at runtime or provide access control.

## Remaining source limitations

Fourteen of eighteen locations lack verified coordinates, including the newly added spa and LeKiMa Homestay. Four activity rows have no explicit time. Sunday has two separate `17h` entries, preserved in source order; its `22h` gathering is now a real activity. The only source ticket price is `250k / vé` with no explicit currency, so no overall budget is fabricated. See `MIGRATION.md` for the full uncertainty record.
