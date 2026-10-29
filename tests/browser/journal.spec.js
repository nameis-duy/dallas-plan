import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

const days = JSON.parse(
  await readFile(
    new URL("../../src/data/itinerary.json", import.meta.url),
    "utf8",
  ),
);
const verifications = JSON.parse(
  await readFile(
    new URL("../../src/data/location-verifications.json", import.meta.url),
    "utf8",
  ),
);
const storageKey = "dallas:saigon-dalat-2026:packing:v1";

test("all source days render in order, details expand, costs retain source wording", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Đà Lạt");
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole("tab")).toHaveCount(5);
  for (const [index, day] of days.entries()) {
    await page.getByRole("tab").nth(index).click();
    await expect(page.locator(".activity")).toHaveCount(day.activities.length);
    await expect(page.locator(".activity-label > strong")).toHaveText(
      day.activities.map((activity) => activity.title),
    );
  }
  await page.getByRole("tab").nth(0).click();
  await page.locator(".activity-trigger").nth(1).click();
  await expect(
    page
      .locator(".activity-detail")
      .filter({ hasText: "395 Kinh Dương Vương" }),
  ).toBeVisible();
  await expect(page.locator(".activity-detail")).toContainText("Joanathan");
  await page.getByRole("tab").nth(2).click();
  await page.locator(".activity-trigger").nth(3).click();
  await expect(page.locator(".cost")).toContainText("250k / vé");
  await page.locator(".activity-trigger").nth(3).click();
  await expect(page.locator(".cost")).toHaveCount(0);
  await page.getByRole("tab").nth(2).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab").nth(3)).toHaveAttribute(
    "aria-selected",
    "true",
  );
  expect(errors).toEqual([]);
});

test("gallery keyboard navigation, focus containment, close and touch controls", async ({
  page,
}) => {
  await page.goto("/");
  const opener = page.getByRole("button", {
    name: "Mở ảnh: Sương sớm trên Thung Lũng Vàng",
    exact: true,
  });
  await opener.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByRole("heading")).toHaveText(
    "Một buổi sáng bên hồ Xuân Hương",
  );
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.getByRole("heading")).toHaveText(
    "Sương sớm trên Thung Lũng Vàng",
  );
  await page.keyboard.press("Shift+Tab");
  await expect(
    dialog.getByRole("button", { name: "Ảnh tiếp theo" }),
  ).toBeFocused();
  await dialog
    .locator(".lightbox-photo")
    .dispatchEvent("touchstart", {
      touches: [{ identifier: 1, clientX: 250, clientY: 100 }],
    });
  await dialog
    .locator(".lightbox-photo")
    .dispatchEvent("touchend", {
      changedTouches: [{ identifier: 1, clientX: 80, clientY: 100 }],
    });
  await expect(dialog.getByRole("heading")).toHaveText(
    "Một buổi sáng bên hồ Xuân Hương",
  );
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test("packing progress and custom items survive reload; reset requires confirmation", async ({
  page,
}) => {
  await page.goto("/");
  const jacket = page.getByRole("checkbox", {
    name: "Áo khoác ấm",
    exact: true,
  });
  await jacket.check();
  await page
    .getByLabel("Thêm đồ cần mang", { exact: true })
    .fill("Khăn choàng của mình");
  await page.getByRole("button", { name: "Thêm vào hành trang" }).click();
  await page.reload();
  await expect(jacket).toBeChecked();
  await expect(
    page.getByRole("checkbox", { name: "Khăn choàng của mình", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "6",
  );
  await page
    .getByRole("button", { name: "Bỏ chọn tất cả", exact: true })
    .click();
  await page.getByRole("button", { name: "Hủy", exact: true }).click();
  await expect(jacket).toBeChecked();
  await page
    .getByRole("button", { name: "Bỏ chọn tất cả", exact: true })
    .click();
  await page
    .getByRole("group", { name: "Xác nhận bỏ chọn" })
    .getByRole("button", { name: "Bỏ chọn tất cả", exact: true })
    .click();
  await expect(jacket).not.toBeChecked();
  await expect(
    page.getByRole("checkbox", { name: "Khăn choàng của mình", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Xóa Khăn choàng của mình", exact: true })
    .click();
  await expect(
    page.getByRole("checkbox", { name: "Khăn choàng của mình", exact: true }),
  ).toHaveCount(0);
});

test("invalid saved data and unavailable storage fail gracefully", async ({
  page,
}) => {
  await page.addInitScript((key) => {
    localStorage.setItem(key, "{invalid");
  }, storageKey);
  await page.goto("/");
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "0",
  );
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage unavailable", "QuotaExceededError");
    };
  });
  await page.reload();
  await page
    .getByRole("checkbox", { name: "Áo khoác ấm", exact: true })
    .check();
  await expect(
    page.getByText("Không thể lưu trên trình duyệt này.", { exact: false }),
  ).toBeVisible();
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "6",
  );
});

test("verified map markers and itinerary selection synchronize; unavailable tiles preserve details", async ({
  page,
}) => {
  await page.route("https://tile.openstreetmap.org/**", (route) =>
    route.abort(),
  );
  await page.goto("/");
  await page.getByRole("tab").nth(3).click();
  await page.locator(".activity-trigger").nth(3).click();
  await page.getByRole("button", { name: "Xem địa điểm", exact: true }).click();
  await expect(page.locator(".leaflet-interactive")).toHaveCount(
    verifications.length,
  );
  await expect(page.locator(".place-selected")).toContainText("Canelés Dalat");
  expect(
    await page.locator(".place-selected").evaluate((row) => {
      const list = row.closest(".place-list");
      return (
        row.getBoundingClientRect().top >= list.getBoundingClientRect().top &&
        row.getBoundingClientRect().top < list.getBoundingClientRect().bottom
      );
    }),
  ).toBe(true);
  await expect(page.locator(".leaflet-popup-content")).toContainText(
    "Canelés Dalat",
  );
  await expect(page.locator(".map-status")).toContainText("Không tải được");
  await page
    .locator(".place-selected")
    .getByRole("button", { name: "Xem lịch trình", exact: true })
    .click();
  await expect(page.getByRole("tab").nth(3)).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.locator(".activity-trigger").nth(3)).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await page
    .locator(".place-filters")
    .getByRole("button", { name: "Nơi ở", exact: true })
    .click();
  await expect(page.locator(".place-list .place-item")).toHaveCount(2);
});

test("map bundle failure preserves usable location links and schedule access", async ({
  page,
}) => {
  await page.route("**/assets/TripMap-*.js", (route) => route.abort());
  await page.goto("/");
  await page.locator("#map").scrollIntoViewIfNeeded();
  await expect(page.locator(".map-fallback")).toBeVisible();
  await expect(page.locator(".map-fallback li")).toHaveCount(18);
  await expect(page.locator(".map-fallback a").first()).toHaveAttribute(
    "href",
    /^https:\/\//,
  );
  await page.locator(".map-fallback button").first().click();
  await expect(page.getByRole("tab").nth(1)).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.locator(".activity-trigger").first()).toHaveAttribute(
    "aria-expanded",
    "true",
  );
});

test("responsive viewports, real images, reduced motion and settled screenshots", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const [width, height, filename] of [
    [1440, 1000, "desktop"],
    [390, 844, "mobile"],
    [768, 1024, "tablet"],
    [320, 740, "small-mobile"],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    for (const section of [
      "overview",
      "itinerary",
      "map",
      "gallery",
      "packing",
    ])
      await page.locator(`#${section}`).scrollIntoViewIfNeeded();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        [...document.images]
          .filter((image) => !image.classList.contains("leaflet-tile"))
          .map((image) => image.decode().catch(() => {})),
      );
    });
    await expect(page.locator(".leaflet-container")).toHaveCount(1);
    const metrics = await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      broken: [...document.images]
        .filter(
          (image) =>
            !image.classList.contains("leaflet-tile") &&
            (!image.complete || !image.naturalWidth),
        )
        .map((image) => image.src),
      reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
    }));
    expect(metrics.scrollWidth).toBeLessThanOrEqual(width);
    expect(metrics.broken).toEqual([]);
    expect(metrics.reduced).toBe(true);
    if (width <= 760) {
      await page.getByRole("button", { name: "Mở menu", exact: true }).click();
      await expect(
        page.getByRole("navigation", { name: "Điều hướng di động" }),
      ).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(
        page.getByRole("navigation", { name: "Điều hướng di động" }),
      ).toHaveCount(0);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `.impeccable/review/${filename}.png`,
      fullPage: true,
    });
    if (width === 1440 || width === 390)
      await page.screenshot({
        path: `.impeccable/review/${filename}-hero.png`,
      });
  }
  expect(errors).toEqual([]);
});
