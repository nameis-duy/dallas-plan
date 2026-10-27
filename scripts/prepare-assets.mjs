import { mkdir, writeFile, readFile } from "node:fs/promises";

const headers = {
  "User-Agent":
    "DallasPersonalTravelJournal/1.0 (static personal itinerary; Wikimedia attribution retained)",
};
const photos = [
  {
    id: "mist",
    file: "Golden Valley in morning fog.jpg",
    caption: "Sương sớm trên Thung Lũng Vàng",
    alt: "Những hàng thông và mặt hồ trong sương sớm ở Thung Lũng Vàng, Đà Lạt",
  },
  {
    id: "lake",
    file: "Ho Xuan Huong - Huy Phuong 2.jpg",
    caption: "Một buổi sáng bên hồ Xuân Hương",
    alt: "Mặt hồ Xuân Hương và những đồi cây của Đà Lạt",
  },
  {
    id: "palace",
    file: "Dinh Bảo Đại, Đà Lạt (3).JPG",
    caption: "Dinh III Bảo Đại",
    alt: "Kiến trúc Dinh III Bảo Đại giữa khu vườn ở Đà Lạt",
    dayId: "day-2026-10-31",
    locationId: "location-day-2026-10-31-activity-02",
  },
  {
    id: "market",
    file: "Dalat market, Vietnam.jpg",
    caption: "Một góc chợ Đà Lạt",
    alt: "Chợ Đà Lạt với những gian hàng và nhịp sống thành phố",
    dayId: "day-2026-10-31",
    locationId: "location-day-2026-10-31-activity-07",
  },
  {
    id: "city",
    file: "View of Da Lat 02.jpg",
    caption: "Thành phố giữa những triền đồi",
    alt: "Những ngôi nhà Đà Lạt trải trên các triền đồi",
  },
];

await mkdir("public/images", { recursive: true });
const titles = photos.map((photo) => `File:${photo.file}`).join("|");
const endpoint = new URL("https://commons.wikimedia.org/w/api.php");
endpoint.search = new URLSearchParams({
  action: "query",
  format: "json",
  prop: "imageinfo",
  iiprop: "url|extmetadata",
  iiurlwidth: "1600",
  titles,
}).toString();
const response = await fetch(endpoint, { headers });
if (!response.ok)
  throw new Error(`Wikimedia metadata unavailable: ${response.status}`);
const metadata = await response.json();
const pages = Object.values(metadata.query.pages);
const gallery = [];
for (const photo of photos) {
  const page = pages.find(
    (item) =>
      item.title.replaceAll("_", " ").toLowerCase() ===
      `File:${photo.file}`.toLowerCase(),
  );
  const info = page?.imageinfo?.[0];
  if (!info) throw new Error(`Missing photo metadata: ${photo.file}`);
  const downloadUrl = info.thumburl || info.url;
  const image = await fetch(downloadUrl, { headers });
  if (!image.ok)
    throw new Error(`Image download failed: ${photo.file} (${image.status})`);
  const localPath = `public/images/${photo.id}.jpg`;
  await writeFile(localPath, Buffer.from(await image.arrayBuffer()));
  const strip = (value) =>
    (value || "").replace(/<[^>]*>/g, "").replaceAll("&amp;", "&");
  gallery.push({
    ...photo,
    src: `images/${photo.id}.jpg`,
    kind: "illustrative",
    credit: strip(info.extmetadata.Artist?.value),
    license: info.extmetadata.LicenseShortName?.value || "See source",
    licenseUrl: info.extmetadata.LicenseUrl?.value || info.descriptionurl,
    sourceUrl: info.descriptionurl,
    downloadUrl,
    width: info.thumbwidth || info.width,
    height: info.thumbheight || info.height,
  });
  await writeFile(
    `${localPath}.json`,
    `${JSON.stringify({ origin: info.descriptionurl, downloadUrl, credit: strip(info.extmetadata.Artist?.value), license: info.extmetadata.LicenseShortName?.value, role: "Illustrative destination photograph, not a personal trip photograph", modifications: "CSS cropping only" }, null, 2)}\n`,
  );
  console.log(`Saved ${photo.id}: ${info.extmetadata.LicenseShortName?.value}`);
}
await writeFile(
  "src/data/gallery.json",
  `${JSON.stringify(gallery, null, 2)}\n`,
);

const locations = JSON.parse(await readFile("src/data/locations.json", "utf8"));
const verifications = [];
for (const location of locations.filter((item) => item.mapUrl)) {
  try {
    const mapResponse = await fetch(location.mapUrl, {
      headers,
      signal: AbortSignal.timeout(15000),
    });
    const match = decodeURIComponent(mapResponse.url).match(
      /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
    );
    if (match)
      verifications.push({
        id: location.id,
        coordinates: [Number(match[1]), Number(match[2])],
        evidenceUrl: location.mapUrl,
        resolvedUrl: mapResponse.url,
        method:
          "Explicit place coordinates in the source Google Maps redirect; viewport centers excluded",
      });
  } catch (error) {
    console.log(`Map remains link-only: ${location.name}: ${error.message}`);
  }
}
await writeFile(
  "src/data/location-verifications.json",
  `${JSON.stringify(verifications, null, 2)}\n`,
);
console.log(
  `Verified ${verifications.length} explicit map coordinates; remaining places stay link-only.`,
);
