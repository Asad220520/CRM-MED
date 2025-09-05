// =========================
// src/components/WeeklyCalendar/helpers/date.js
// =========================
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
export const minutesBetween = (a, b) =>
  Math.round((b.getTime() - a.getTime()) / 60000);
export const isValidDate = (d) => d instanceof Date && !isNaN(d?.getTime?.());
export const roundToStep = (minutes, step) => Math.round(minutes / step) * step;

export function startOfWeek(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // 0 => Monday
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d;
}

export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function formatTime(d) {
  if (!isValidDate(d)) return "--:--";
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

// Надёжный парсер обоих форматов:
// 1) YYYY-MM-DD HH:mm
// 2) DD-MM-YYYY HH:mm
export function parseApiDate(s) {
  if (!s || typeof s !== "string") return null;
  const isoLike = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/;
  const ddmmyyyy = /^(\d{2})-(\d{2})-(\d{4})[ T](\d{2}):(\d{2})$/;

  let m = s.match(isoLike);
  if (m) {
    const [, y, mo, d, h, mi] = m.map(Number);
    return new Date(y, mo - 1, d, h, mi, 0, 0);
  }
  m = s.match(ddmmyyyy);
  if (m) {
    const [, d, mo, y, h, mi] = m.map(Number);
    return new Date(y, mo - 1, d, h, mi, 0, 0);
  }
  const fallback = new Date(s.replace(" ", "T"));
  return isNaN(fallback.getTime()) ? null : fallback;
}
