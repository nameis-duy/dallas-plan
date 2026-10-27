export const storageKey = "dallas:saigon-dalat-2026:packing:v1";

export function parsePackingState(raw, starterIds) {
  const empty = { version: 1, checked: [], custom: [] };
  if (!raw) return empty;
  try {
    const value = JSON.parse(raw);
    if (
      !value ||
      value.version !== 1 ||
      !Array.isArray(value.checked) ||
      !Array.isArray(value.custom)
    )
      return empty;
    const custom = value.custom
      .filter(
        (item) =>
          item &&
          typeof item.id === "string" &&
          /^custom-[a-zA-Z0-9-]+$/.test(item.id) &&
          typeof item.label === "string" &&
          item.label.trim() &&
          item.label.length <= 120,
      )
      .slice(0, 100)
      .filter(
        (item, index, all) =>
          all.findIndex((other) => other.id === item.id) === index,
      );
    const validIds = new Set([...starterIds, ...custom.map((item) => item.id)]);
    return {
      version: 1,
      checked: [
        ...new Set(
          value.checked.filter(
            (id) => typeof id === "string" && validIds.has(id),
          ),
        ),
      ],
      custom,
    };
  } catch {
    return empty;
  }
}
