# Source migration report

## Evidence and scope

Retrieved on 2026-10-27 from the public CSV export and public HTML view of Google spreadsheet `1DIYOGjG6-t3a_IEDMYrNogYpEVgAGu3PLOLW0qXdGR4`, worksheet `493154924` first.

- Workbook title: **SaiGon - DaLat 29.10 - 02.11**.
- Selected worksheet title: **Copy of Lịch trình**.
- The public view exposed this worksheet; a complete list of other/private worksheets was not established. No claim is made about their contents.
- The ordinary edit view redirected to sign-in. The export and HTML view were accessible and contained matching data.
- Local original: `source/itinerary.csv`.
- Local normalized output: `src/data/itinerary.json` and `locations.json`.
- Machine-readable row issues: `source/migration.json`.

## Actual layout

This is a four-column, sectioned planning sheet, not a flat conventional table:

| Source rows      | Purpose                                                                                |
| ---------------- | -------------------------------------------------------------------------------------- |
| 1                | `LỊCH TRÌNH CHI TIẾT THEO NGÀY` heading                                                |
| 2                | `Số lượng:` / `11` group metadata                                                      |
| 3                | `Giờ`, `Loại hoạt động`, `Địa điểm`, `Ghi chú` headers                                 |
| 4, 8, 16, 26, 37 | Day headings: Thursday 29/10/2026 through Monday 02/11/2026                            |
| Intervening rows | Activity rows and blank separators, with multiline place/transport/accommodation cells |

There are 37 nonempty CSV rows across 41 parsed rows. CSV cannot retain merge/style information. HTML row structure confirmed the day headings and cell positions; exact merged-range metadata was not retrieved. No repeated headers or subtotal tables were observed in the selected worksheet.

| Day      | Date                | Activities |
| -------- | ------------------- | ---------- |
| Thursday | 2026-10-29          | 2          |
| Friday   | 2026-10-30          | 6          |
| Saturday | 2026-10-31          | 8          |
| Sunday   | 2026-11-01          | 8          |
| Monday   | 2026-11-02          | 4          |
| Total    | Five calendar dates | **28**     |

The trip is Sài Gòn to Đà Lạt, not Dallas, Texas. Dallas remains the product name. Five calendar dates include the overnight departure; the villa's `4N3Đ` describes a different scope and is not incorrectly presented as the whole-trip duration.

## Mapping decisions

- Day headings become ISO dates and stable date IDs; source day labels are retained.
- The original row order is preserved within each day, including overlapping times, undated descriptions, and free time.
- `9h30` becomes `09:30`; `6h - 12h` becomes a start/end range. Source strings remain available under `sourceTime` and `source`.
- Missing activity labels use the first source place/description line as a display title, never an invented event.
- Each activity retains its original four cell values and CSV row reference.
- Multiline addresses, accommodation notes, transport instructions, traveler notes, and links remain attached to their own activity.
- Only recognizably address-like later lines populate the optional address field. Check-in notes and the attraction's swing/go-kart description are not addresses.
- Sixteen source places have location records; no precise point is invented for any of them.
- Day/activity/location IDs are deterministic date-and-sequence IDs. Structural source edits require reviewing associations and refreshing coordinate evidence.
- The source does not include packing data. The 16-item starter list is explicitly suggested, editable locally, and separate from imported trip facts.
- No personal photographs were supplied. Five licensed Wikimedia images are labeled illustrative. Images of Thung Lũng Vàng and hồ Xuân Hương establish destination context without adding those visits to the itinerary.

## Missing values and ambiguities

| Row / item             | Treatment                                                                                                                                                                                                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 6, Trọng Phú Limousine | Time cell is empty although place text says `23:30 xe chạy`. Preserve the exact bus time in details; do not silently infer a normalized activity start. Pickup at Bến xe Miền Tây, `395 Kinh Dương Vương`, and arrival at Bến Xe Liên Tỉnh Đà Lạt are retained. The source travel-companion note is retained. |
| 9, Villa C39 An Sơn    | Check-in `06:00 30/10`, check-out `12:00 02/11`, and `4N3Đ` are retained. No reservation number, price, or street address is invented.                                                                                                                                                                        |
| 10 and 12              | Free-time blocks and their original content remain schedule entries, not fabricated activities filling gaps.                                                                                                                                                                                                  |
| 14                     | Activity `Nhậu ở nhà` and place `Quán nhậu Huyền Diệu / 16B Hoàng Văn Thụ` may conflict. Both are retained unchanged, not reconciled by guessing.                                                                                                                                                             |
| 20, Cao Nguyên Hoa     | Source says `250k / vé`, plus swing/go-kart notes. Numeric amount is 250000 with `currency: null`; UI shows original wording. Currency, inclusions, and current price require confirmation.                                                                                                                   |
| 23                     | A combined market/food/tower cell stays one activity and one unresolved location record. No false single precise point is assigned to all named places.                                                                                                                                                       |
| 24, Cocktail           | Venue text is only `420`. No address or coordinates are inferred.                                                                                                                                                                                                                                             |
| 27, `Ò ó o`            | Original label and `3h30` are retained, without interpreting it as an invented booking or destination.                                                                                                                                                                                                        |
| 31, Miết Miết          | No source time; keep original position after the 09:00 bakery entry.                                                                                                                                                                                                                                          |
| 35, `22h` only         | Not an activity. Preserve as an unresolved empty slot in the migration report.                                                                                                                                                                                                                                |
| 38, 39, 41             | No explicit times for sleeping in, Đậm Cafe, and the return-home note. Show flexible time without borrowing neighboring values. Original return-home text and emoji remain in the data.                                                                                                                       |

No source-wide budget, confirmed booking references, transport fares, or complete address/coordinate set was found. Costs and reservations are not filled from outside assumptions. Informal names, spelling, and English/Vietnamese mixed labels remain source-faithful.

## Coordinate verification

The source provides Google Maps short links, not coordinate columns. During development, original short links were resolved and only explicit place `!3d...!4d...` pairs in the final URL were accepted. `@lat,lng` camera centers alone were excluded. The saved source link, resolved URL, method, and activity/location ID form the evidence.

Four verified places, stored in `src/data/location-verifications.json`:

- Canelés Dalat - since 2020: 11.944714, 108.4379307.
- Miết Miết: 11.9213921, 108.4498867.
- Đôi Đũa: 11.9613986, 108.4429215.
- Hap Hap Riverside Kitchen: 11.9246874, 108.453247.

The other twelve location records remain unverified and have no precise markers. Their text and original links remain usable. This is not a claim that those places lack a known location; the available evidence was insufficient to ship a verified point during this import. No geocoder runs in the browser. The initial city map center is geographical context, not an accommodation/activity marker.

## Verification

- Importer tests check five dates, counts `[2, 6, 8, 8, 4]`, 11 travelers, bus multiline details, preserved notes, missing bus time, the empty slot, ticket amount/unspecified currency, conservative addresses, unique associations, and rejection of unrelated CSV headers.
- Production browser tests compare every day's displayed activity titles to the normalized source order, expand/collapse details, check source ticket wording, and verify itinerary/map synchronization and fallback access.
- Remaining manual review: personal photo replacement, unresolved times and location coordinates, current ticket price/currency, source inconsistencies above, privacy before publishing, and testing on physical devices/Safari.
