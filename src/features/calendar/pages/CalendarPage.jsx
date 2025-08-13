import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  RefreshCw,
  Filter,
  User,
  Building2,
} from "lucide-react";
import fetchWithAuth from "../../auth/fetchWithAuth";
import API_BASE_URL from "../../../../config/api";

/* ================= helpers & constants ================= */
const RU_DAYS = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];
const RU_DAYS_SHORT = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const RU_MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const SLOT_MINUTES = 15;
const DAY_START_HOUR = 8;
const DAY_END_HOUR = 20;
const ROW_HEIGHT = 28;
const MIN_EVENT_HEIGHT = 96;

const minutesBetween = (a, b) =>
  Math.round((b.getTime() - a.getTime()) / 60000);
const isValidDate = (d) => d instanceof Date && !isNaN(d?.getTime?.());

function asText(v) {
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
    ]) {
      if (typeof v[k] === "string") return v[k];
    }
    if (typeof v.name === "string") return v.name;
    return "";
  }
  return "";
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // 0 => Mon
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d;
}
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function formatTime(d) {
  if (!isValidDate(d)) return "--:--";
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

/* ================= styles ================= */
const statusStyles = {
  live: {
    ring: "ring-emerald-200",
    bg: "bg-emerald-50",
    border: "border-emerald-300",
    text: "text-emerald-900",
    badge: "bg-emerald-500 text-white",
    leftBar: "before:bg-emerald-500",
    label: "Живая очередь",
  },
  booked: {
    ring: "ring-rose-200",
    bg: "bg-rose-50",
    border: "border-rose-300",
    text: "text-rose-900",
    badge: "bg-rose-500 text-white",
    leftBar: "before:bg-rose-500",
    label: "По записи",
  },
  default: {
    ring: "ring-blue-200",
    bg: "bg-blue-50",
    border: "border-blue-300",
    text: "text-blue-900",
    badge: "bg-blue-500 text-white",
    leftBar: "before:bg-blue-500",
    label: "Приём",
  },
};
const mapStatus = (app) => {
  const s = (asText(app?.status) || "").toLowerCase();
  if (/(live|очеред)/.test(s)) return "live";
  if (/(book|запис)/.test(s)) return "booked";
  return "default";
};

/* ================= small UI pieces ================= */
function LoadingSkeleton() {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
          <RefreshCw className="w-4 h-4 animate-spin" /> Загрузка…
        </div>
        <div className="grid grid-cols-12 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-8 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorBanner({ message }) {
  if (!message) return null;
  return <div className="py-10 text-center text-red-600">{message}</div>;
}

function LegendBar() {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-600">
      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        ● Живая очередь
      </span>
      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
        ● По записи
      </span>
      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
        ● Другие
      </span>
    </div>
  );
}

function WeekNav({ weekStart, setWeekStart }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border bg-white shadow-sm p-1">
      <button
        onClick={() => setWeekStart(addDays(weekStart, -7))}
        className="flex items-center gap-1 rounded-lg px-3 py-2 hover:bg-gray-50"
        aria-label="Предыдущая неделя"
      >
        <ChevronLeft className="w-4 h-4" />
        Неделя
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

function TitleBadge({ weekStart }) {
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

function FiltersBar({
  selectedDoctor,
  setSelectedDoctor,
  doctorOptions,
  selectedDepartment,
  setSelectedDepartment,
  departmentOptions,
}) {
  return (
    <div className="ml-auto flex flex-wrap items-center gap-2">
      {/* Врач */}
      <div className="relative">
        <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <select
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          className="appearance-none border rounded-xl pl-9 pr-9 py-2 text-sm bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">Врач: все</option>
          {doctorOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Filter className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Отдел */}
      <div className="relative">
        <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="appearance-none border rounded-xl pl-9 pr-9 py-2 text-sm bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">Отдел: все</option>
          {departmentOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Filter className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}

function WeekdaysHeader({ days, isTodayInWeek, todayIdx }) {
  return (
    <div
      className="grid sticky top-0 z-20 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75"
      style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}
    >
      <div className="px-2 py-3 text-xs text-gray-500 border-r sticky left-0 bg-white/90">
        Время
      </div>
      {days.map((d, i) => {
        const isToday = isTodayInWeek && i === todayIdx;
        return (
          <div
            key={i}
            className={`px-2 py-2 text-center border-r ${
              isToday ? "bg-indigo-50" : ""
            }`}
          >
            <div
              className={`text-xs uppercase tracking-wide ${
                isToday ? "text-indigo-700 font-semibold" : "text-gray-500"
              }`}
            >
              {RU_DAYS_SHORT[i]}
            </div>
            <div
              className={`text-lg ${
                isToday ? "text-indigo-900 font-semibold" : "text-gray-900"
              }`}
            >
              {d.getDate()}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TimeLabelsColumn({ timeSlots }) {
  return (
    <div className="sticky left-0 z-10 border-r bg-white">
      {timeSlots.map((t, i) => (
        <div
          key={`time-${i}`}
          className={`relative border-b text-[11px] text-gray-600 pl-2 flex items-start ${
            t.getMinutes() === 0 ? "bg-white font-medium" : "bg-gray-50"
          }`}
          style={{ height: ROW_HEIGHT }}
        >
          {t.getMinutes() === 0 ? (
            <span className="translate-y-[-8px]">{formatTime(t)}</span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function CurrentTimeIndicator({}) {
  // Rendered by DayColumn when applicable
  return null;
}

function AppointmentCard({ app, topPx, heightPx, onOpenMenu }) {
  const styles = statusStyles[mapStatus(app)] || statusStyles.default;

  const startTime = isValidDate(app._start) ? new Date(app._start) : null;
  const endTime = startTime
    ? new Date(startTime.getTime() + (app._duration || 60) * 60000)
    : null;
  const doctorName = asText(app?.doctor?.username);
  const jobTitle = asText(app?.doctor?.job_title);
  const serviceName = asText(app?.service_name) || styles.label;

  return (
    <div
      className={`group absolute border ${styles.bg} ${styles.border} rounded-lg shadow-sm hover:shadow-md transition-all duration-150 hover:-translate-y-0.5 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 ${styles.leftBar} focus:outline-none focus:ring-2 ${styles.ring}`}
      style={{ top: topPx, height: heightPx, left: 2, right: 2 }}
      onClick={onOpenMenu}
      role="button"
      tabIndex={0}
    >
      <div className="h-full flex flex-col justify-between px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center text-[10px] leading-none px-2 py-0.5 rounded ${styles.badge}`}
          >
            {mapStatus(app) === "live"
              ? "Живая очередь"
              : mapStatus(app) === "booked"
              ? "По записи"
              : "Приём"}
          </span>
          <span className="text-[11px] text-gray-500">
            {formatTime(startTime)}–{formatTime(endTime)}
          </span>
        </div>

        <div className="mt-0.5">
          <div
            className={`text-sm ${styles.text} font-semibold leading-snug line-clamp-2`}
          >
            {serviceName}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[12px] text-gray-700">
            {doctorName && (
              <span className="truncate max-w-[55%]">{doctorName}</span>
            )}
            {jobTitle && (
              <span className="text-gray-400 truncate">· {jobTitle}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(ev) => {
              ev.stopPropagation();
              console.log("[CALENDAR] Mark as LIVE:", { id: app?.id, app });
            }}
            className="text-[12px] px-2 py-1 rounded border hover:bg-emerald-50"
          >
            Пометить: живая
          </button>
          <button
            onClick={(ev) => {
              ev.stopPropagation();
              console.log("[CALENDAR] Mark as BOOKED:", { id: app?.id, app });
            }}
            className="text-[12px] px-2 py-1 rounded border hover:bg-rose-50"
          >
            Пометить: запись
          </button>
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={(ev) => {
                ev.stopPropagation();
                console.log("[CALENDAR] Edit appointment:", {
                  id: app?.id,
                  app,
                });
              }}
              className="text-[12px] px-2 py-1 rounded border hover:bg-gray-50"
            >
              Редактировать
            </button>
            <button
              onClick={(ev) => {
                ev.stopPropagation();
                console.log("[CALENDAR] Delete appointment:", {
                  id: app?.id,
                  app,
                });
              }}
              className="text-[12px] px-2 py-1 rounded border text-red-600 hover:bg-red-50"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DayColumn({
  dayIdx,
  timeSlots,
  isToday,
  isTodayInWeek,
  events,
  onOpenMenu,
}) {
  const now = new Date();
  const base = new Date(now);
  base.setHours(DAY_START_HOUR, 0, 0, 0);
  const end = new Date(now);
  end.setHours(DAY_END_HOUR, 0, 0, 0);

  const showNowLine = isTodayInWeek && isToday && now >= base && now <= end;
  const nowOffsetPx = showNowLine
    ? Math.max(
        0,
        Math.floor(minutesBetween(base, now) / SLOT_MINUTES) * ROW_HEIGHT
      )
    : 0;

  return (
    <div className="relative border-r">
      {/* Background slots */}
      {timeSlots.map((t, rowIdx) => (
        <div
          key={`cell-${dayIdx}-${rowIdx}`}
          className={`relative ${
            t.getMinutes() === 0 ? "bg-white" : "bg-gray-50"
          } border-b`}
          style={{ height: ROW_HEIGHT }}
        />
      ))}

      {/* Current time line */}
      {showNowLine && (
        <div
          className="absolute left-1 right-1 z-20"
          style={{ top: nowOffsetPx - 1 }}
        >
          <div className="h-0.5 bg-indigo-500/90 rounded-full shadow-[0_0_0_2px_rgba(99,102,241,0.12)]" />
          <div className="w-2 h-2 rounded-full bg-indigo-500 absolute -left-2 -top-1" />
        </div>
      )}

      {/* Events */}
      {events.map((app) => {
        const start = app._start;
        const duration = Math.max(
          5,
          Number(app?._duration) || Number(app?.duration_minutes) || 60
        );

        // slotIndexOf based on the *day's* start time
        const baseDay = new Date(start);
        baseDay.setHours(DAY_START_HOUR, 0, 0, 0);
        const minutesFromBase = Math.max(0, minutesBetween(baseDay, start));
        const slotsFromBase = Math.floor(minutesFromBase / SLOT_MINUTES);

        const topPx = slotsFromBase * ROW_HEIGHT;
        const heightPx = Math.max(
          Math.ceil(duration / SLOT_MINUTES) * ROW_HEIGHT,
          MIN_EVENT_HEIGHT
        );

        return (
          <AppointmentCard
            key={app.id || `${dayIdx}-${topPx}-${heightPx}`}
            app={app}
            topPx={topPx}
            heightPx={heightPx}
            onOpenMenu={(e) => onOpenMenu(e, app)}
          />
        );
      })}
    </div>
  );
}

function ContextMenu({
  menu,
  menuRef,
  appointments,
  onEdit,
  onDelete,
  onClose,
}) {
  if (!menu) return null;
  const app = appointments.find((a) => a.id === menu.id);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white border rounded-lg shadow-xl text-sm overflow-hidden min-w-[200px]"
      style={{ left: menu.x, top: menu.y }}
    >
      <div className="px-4 py-3 border-b font-medium bg-gray-50">
        Действия с записью
      </div>
      <button
        onClick={() => {
          onClose();
          if (app) onEdit(app);
        }}
        className="px-4 py-2 hover:bg-gray-50 w-full text-left flex items-center gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        Редактировать
      </button>
      <button
        onClick={() => {
          onClose();
          if (app) onDelete(app);
        }}
        className="px-4 py-2 hover:bg-red-50 w-full text-left flex items-center gap-2 text-red-600"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        Удалить
      </button>
    </div>
  );
}

/* ================= main component ================= */
export default function WeeklyCalendar() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));

  const [menu, setMenu] = useState(null); // {id,x,y}
  const menuRef = useRef(null);
  const scrollRef = useRef(null);

  // handlers
  const handleEdit = (app) => {
    console.log("[CALENDAR] Edit appointment:", { id: app?.id, app });
    // TODO: модал/форма
  };
  const handleDelete = (app) => {
    console.log("[CALENDAR] Delete appointment:", { id: app?.id, app });
    // TODO: DELETE и обновить список
  };

  // effects
  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(null);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchWithAuth(`${API_BASE_URL}/en/calendar/`);
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const data = await res.json();
        setAppointments(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || "Не удалось загрузить");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // memo: options
  const doctorOptions = useMemo(() => {
    const map = new Map();
    appointments.forEach((a) => {
      const uname = asText(a?.doctor?.username);
      const jtitle = asText(a?.doctor?.job_title);
      if (uname) map.set(uname, `${uname}${jtitle ? ` (${jtitle})` : ""}`);
    });
    const arr = Array.from(map.entries()).map(([value, label]) => ({
      value,
      label,
    }));
    arr.sort((a, b) => a.label.localeCompare(b.label, "ru"));
    return arr;
  }, [appointments]);

  const departmentOptions = useMemo(() => {
    const set = new Set();
    appointments.forEach((a) => {
      const dep = asText(a?.department?.department_name);
      if (dep) set.add(dep);
    });
    const arr = Array.from(set.values()).map((v) => ({ value: v, label: v }));
    arr.sort((a, b) => a.label.localeCompare(b.label, "ru"));
    return arr;
  }, [appointments]);

  // filtering
  const filtered = useMemo(() => {
    return appointments.filter((app) => {
      const dUser = asText(app?.doctor?.username);
      const dep = asText(app?.department?.department_name);
      return (
        (selectedDoctor === "all" || dUser === selectedDoctor) &&
        (selectedDepartment === "all" || dep === selectedDepartment)
      );
    });
  }, [appointments, selectedDoctor, selectedDepartment]);

  // week/day calculations
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const timeSlots = useMemo(() => {
    const start = new Date(weekStart);
    start.setHours(DAY_START_HOUR, 0, 0, 0);
    const end = new Date(weekStart);
    end.setHours(DAY_END_HOUR, 0, 0, 0);
    const slots = [];
    let cur = start;
    while (cur < end) {
      slots.push(new Date(cur));
      cur = new Date(cur.getTime() + SLOT_MINUTES * 60000);
    }
    return slots;
  }, [weekStart]);

  // group events by day
  const eventsByDay = useMemo(() => {
    const map = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    filtered.forEach((app) => {
      const start = app?.appointment_date
        ? new Date(app.appointment_date)
        : null;
      if (!isValidDate(start)) return;
      const idx = (start.getDay() + 6) % 7;
      const dur = Math.max(5, Number(app?.duration_minutes) || 60);
      map[idx].push({ ...app, _start: start, _duration: dur });
    });
    Object.values(map).forEach((list) =>
      list.sort((a, b) => a._start - b._start)
    );
    return map;
  }, [filtered]);

  // autoscroll to "now"
  useEffect(() => {
    const now = new Date();
    const weekEnd = addDays(weekStart, 6);
    if (now >= weekStart && now <= addDays(weekEnd, 1)) {
      const base = new Date(weekStart);
      base.setHours(DAY_START_HOUR, 0, 0, 0);
      const offsetMin = Math.max(0, minutesBetween(base, now));
      const target = Math.max(
        0,
        Math.floor(offsetMin / SLOT_MINUTES) * ROW_HEIGHT - 100
      );
      if (scrollRef.current) scrollRef.current.scrollTop = target;
    }
  }, [weekStart]);

  // today markers
  const today = new Date();
  const todayIdx = (today.getDay() + 6) % 7;
  const isTodayInWeek = today >= weekStart && today < addDays(weekStart, 7);

  // UI states
  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div className="p-4 md:p-6 max-w-[1300px] mx-auto">
      {/* top bar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <WeekNav weekStart={weekStart} setWeekStart={setWeekStart} />
        <TitleBadge weekStart={weekStart} />
        <FiltersBar
          selectedDoctor={selectedDoctor}
          setSelectedDoctor={setSelectedDoctor}
          doctorOptions={doctorOptions}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          departmentOptions={departmentOptions}
        />
      </div>

      <LegendBar />

      {/* calendar card */}
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <WeekdaysHeader
          days={days}
          isTodayInWeek={isTodayInWeek}
          todayIdx={todayIdx}
        />

        <div
          ref={scrollRef}
          className="relative h-[68vh] min-h-[540px] overflow-y-auto bg-gradient-to-b from-white to-gray-50"
        >
          <div
            className="grid relative"
            style={{
              gridTemplateColumns: "80px repeat(7, 1fr)",
              gridTemplateRows: `repeat(${timeSlots.length}, ${ROW_HEIGHT}px)`,
            }}
          >
            <TimeLabelsColumn timeSlots={timeSlots} />

            {Array.from({ length: 7 }).map((_, colIdx) => (
              <DayColumn
                key={`daycol-${colIdx}`}
                dayIdx={colIdx}
                timeSlots={timeSlots}
                isToday={isTodayInWeek && colIdx === todayIdx}
                isTodayInWeek={isTodayInWeek}
                events={eventsByDay[colIdx] || []}
                onOpenMenu={(e, app) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setMenu({ id: app.id, x: rect.left + 8, y: rect.top + 8 });
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <ContextMenu
        menu={menu}
        menuRef={menuRef}
        appointments={appointments}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onClose={() => setMenu(null)}
      />

      {!appointments?.length && (
        <div className="text-center text-sm text-gray-500 mt-4">
          Записей пока нет. Добавьте приём или измените фильтры.
        </div>
      )}
    </div>
  );
}
