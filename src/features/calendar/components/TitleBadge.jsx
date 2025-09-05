// =========================
// src/components/WeeklyCalendar/components/TitleBadge.jsx
// =========================
import { RU_MONTHS } from "../constants";
import { addDays } from "../helpers/date";

export default function TitleBadge({ weekStart }) {
  const monthTitle = `${RU_MONTHS[weekStart.getMonth()]} — ${String(
    weekStart.getDate()
  ).padStart(2, "0")}.${weekStart.getFullYear()}`;
  const end = addDays(weekStart, 6);
  const weekRangeLabel = `${String(weekStart.getDate()).padStart(
    2,
    "0"
  )}–${String(end.getDate()).padStart(2, "0")} ${RU_MONTHS[end.getMonth()]}`;
  const today = new Date();
  const isTodayInWeek = today >= weekStart && today < addDays(weekStart, 7);
  return (
    <div className="text-base md:text-xl font-semibold flex items-center gap-2">
      <span className="hidden md:inline text-gray-500">{monthTitle}</span>
      <span className="inline md:hidden text-gray-700">{weekRangeLabel}</span>
      {isTodayInWeek && (
        <span className="ml-1 text-xs rounded-full bg-indigo-50 text-indigo-700 px-2 py-1">
          сегодня
        </span>
      )}
    </div>
  );
}
