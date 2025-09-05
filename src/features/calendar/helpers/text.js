// =========================
// src/components/WeeklyCalendar/helpers/text.js
// =========================
export function asText(v) {
  if (v == null) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (Array.isArray(v)) return v.map(asText).filter(Boolean).join(", ");
  if (typeof v === "object") {
    for (const k of [
      "name",
      "title",
      "label",
      "full_name",
      "display",
      "value",
      "username",
      "department_name",
    ]) {
      if (typeof v?.[k] === "string") return v[k];
    }
    return "";
  }
  return "";
}
