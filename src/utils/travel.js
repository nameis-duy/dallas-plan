export function formatDate(date, options = {}) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
    ...options,
  }).format(new Date(`${date}T12:00:00+07:00`));
}

export function formatTime(activity) {
  if (!activity.time) return "Linh hoạt";
  return activity.endTime
    ? `${activity.time} – ${activity.endTime}`
    : activity.time;
}

export function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

export function hasCoordinates(location) {
  return (
    Array.isArray(location?.coordinates) &&
    location.coordinates.length === 2 &&
    location.coordinates.every(Number.isFinite) &&
    Math.abs(location.coordinates[0]) <= 90 &&
    Math.abs(location.coordinates[1]) <= 180
  );
}

export function navigationUrl(location) {
  if (location.mapUrl) return location.mapUrl;
  if (hasCoordinates(location))
    return `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.join(",")}`;
  return null;
}
