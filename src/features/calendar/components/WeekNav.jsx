// =========================
// src/components/WeeklyCalendar/components/WeekNav.jsx
// =========================
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { addDays, startOfWeek } from "../helpers/date";

export default function WeekNav({ weekStart, setWeekStart }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border bg-white shadow-sm p-1">
      <button
        onClick={() => setWeekStart(addDays(weekStart, -7))}
        className="flex items-center gap-1 rounded-lg px-3 py-2 hover:bg-gray-50"
        aria-label="Предыдущая неделя"
      >
        <ChevronLeft className="w-4 h-4" /> Неделя
      </button>
      <div className="w-px self-stretch bg-gray-200" />
      <button
        onClick={() => setWeekStart(startOfWeek(new Date()))}
        className="flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-3 py-2 hover:bg-indigo-700"
        title="Перейти к текущей неделе"
      >
        <CalendarIcon className="w-4 h-4" /> Сегодня
      </button>
      <div className="w-px self-stretch bg-gray-200" />
      <button
        onClick={() => setWeekStart(addDays(weekStart, 7))}
        className="flex items-center gap-1 rounded-lg px-3 py-2 hover:bg-gray-50"
        aria-label="Следующая неделя"
      >
        Неделя <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
