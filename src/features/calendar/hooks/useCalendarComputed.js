// =========================
// src/components/WeeklyCalendar/hooks/useCalendarComputed.js
// =========================
import { useEffect, useMemo, useRef, useState } from "react";
import {
  addDays,
  clamp,
  isValidDate,
  minutesBetween,
  parseApiDate,
} from "../helpers/date";
import {
  buildHourSlots,
  DAY_END_HOUR,
  DAY_START_HOUR,
  ROW_H,
} from "../constants";
import layoutDayEvents from "../utils/layoutDayEvents";

export default function useCalendarComputed(
  appointments,
  selectedDoctor,
  selectedDepartment,
  weekStart
) {
  const wrapRef = useRef(null);

  // дни/часы
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );
  const hourSlots = useMemo(
    () => buildHourSlots(DAY_START_HOUR, DAY_END_HOUR),
    []
  );

  // фильтрация по врачу/отделу и неделе
  const filtered = useMemo(() => {
    const weekEnd = addDays(weekStart, 7);
    return appointments.filter((app) => {
      const d = parseApiDate(app?.appointment_date);
      if (!isValidDate(d)) return false;
      const dUser = (app?.doctor?.username ?? "") + "";
      const dep = (app?.department?.department_name ?? "") + "";
      const passFilters =
        (selectedDoctor === "all" || dUser === selectedDoctor) &&
        (selectedDepartment === "all" || dep === selectedDepartment);
      return passFilters && d >= weekStart && d < weekEnd;
    });
  }, [appointments, selectedDoctor, selectedDepartment, weekStart]);

  // группировка по дням + раскладка пересечений
  const eventsByDay = useMemo(() => {
    const map = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    filtered.forEach((app) => {
      const start = parseApiDate(app?.appointment_date);
      if (!isValidDate(start)) return;
      const end = parseApiDate(app?.appointment_date_end);
      const dur = Math.max(
        5,
        Number(app?.duration_minutes) ||
          (isValidDate(end) ? Math.round((end - start) / 60000) : 60)
      );
      const idx = (start.getDay() + 6) % 7;
      map[idx].push({ ...app, _start: start, _duration: dur });
    });
    Object.keys(map).forEach((k) => {
      map[k] = layoutDayEvents(map[k]);
    });
    return map;
  }, [filtered]);

  // «сейчас» линия
  const [nowTop, setNowTop] = useState(null);
  useEffect(() => {
    const calc = () => {
      const d = new Date();
      const mins = d.getHours() * 60 + d.getMinutes();
      const startMin = DAY_START_HOUR * 60;
      const endMin = DAY_END_HOUR * 60;
      if (mins < startMin || mins > endMin) {
        setNowTop(null);
        return;
      }
      const relMin = mins - startMin;
      setNowTop((ROW_H / 60) * relMin);
    };
    calc();
    const id = setInterval(calc, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  // авто-скролл на текущий момент
  useEffect(() => {
    const now = new Date();
    const weekEnd = addDays(weekStart, 6);
    if (now >= weekStart && now <= addDays(weekEnd, 1)) {
      const startOfDay = new Date(now);
      startOfDay.setHours(DAY_START_HOUR, 0, 0, 0);
      const offsetMin = clamp(
        minutesBetween(startOfDay, now),
        0,
        (DAY_END_HOUR - DAY_START_HOUR) * 60
      );
      const target = Math.max(0, Math.floor(offsetMin) * (ROW_H / 60) - 120);
      if (wrapRef.current) wrapRef.current.scrollTop = target;
    }
  }, [weekStart]);

  return { wrapRef, days, hourSlots, eventsByDay, nowTop };
}
