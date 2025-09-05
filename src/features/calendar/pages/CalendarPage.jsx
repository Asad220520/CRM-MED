// =========================
// src/features/calendar/components/WeeklyCalendar/index.jsx
// =========================
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import LoadingSkeleton from "../../../components/ui/LoadingSkeleton";

import {
  ROW_H,
  DAY_START_HOUR,
  DAY_END_HOUR,
  MIN_EVENT_HEIGHT,
  RU_DAYS,
} from "../constants";
import { addDays, clamp, startOfWeek } from "../helpers/date";
import useAppointments from "../hooks/useAppointments";
import useCalendarComputed from "../hooks/useCalendarComputed";

import ErrorBanner from "../components/ErrorBanner";
import WeekNav from "../components/WeekNav";
import TitleBadge from "../components/TitleBadge";
import FiltersBar from "../components/FiltersBar";
import ContextMenu from "../components/ContextMenu";
import EventCard from "../components/EventCard";

// + утилиты для удаления пациента (как в списке)
import API_BASE_URL from "../../../../config/api";
import fetchWithAuth from "../../auth/fetchWithAuth";
import { getPatientId } from "../../../shared/getPatientId";

// Роли и текущий врач
import { getCurrentUserRole, getCurrentDoctorId } from "../../../lib/auth";
import { ROLES } from "../../../lib/roles";

export default function WeeklyCalendar() {
  const navigate = useNavigate();

  // Ролевая логика
  const role = getCurrentUserRole();
  const isDoctor = role === ROLES.DOCTOR;
  const doctorId = isDoctor ? getCurrentDoctorId() : undefined;

  const {
    appointments,
    setAppointments,
    loading,
    error,
    setError,
    doctorOptions,
    departmentOptions,
  } = useAppointments({
    doctorId, // доктор видит только свои записи
    readOnly: isDoctor,
  });

  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));

  const { wrapRef, days, hourSlots, eventsByDay, nowTop } = useCalendarComputed(
    appointments,
    selectedDoctor,
    selectedDepartment,
    weekStart
  );

  const today = new Date();
  const todayIdx = (today.getDay() + 6) % 7;
  const isTodayInWeek = today >= weekStart && today < addDays(weekStart, 7);

  // контекстное меню
  const [menu, setMenu] = useState(null); // {x,y,app}

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMenu(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ДВОЙНОЙ КЛИК ПО ДНЮ — у доктора запрещено, у остальных -> /addPatients
  const handleCreateInDay = () => {
    if (isDoctor) return;
    navigate("/addPatients");
  };

  // Удаление пациента — как в PatientList (для доктора недоступно)
  async function handleDelete(patientId) {
    if (isDoctor) return;
    if (!patientId) return;
    if (!confirm("Удалить пациента? Действие необратимо.")) return;

    try {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/en/patient/${patientId}/edit/`,
        { method: "DELETE" }
      );

      if (![200, 202, 204].includes(res.status)) {
        const text = await res.text().catch(() => "");
        throw new Error(`Не удалось удалить (status ${res.status}): ${text}`);
      }

      // Убираем из календаря все события этого пациента
      setAppointments((prev) =>
        prev.filter((a) => getPatientId(a) !== patientId)
      );
    } catch (e) {
      setError(String(e?.message || e) || "Ошибка удаления пациента");
    }
  }

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
      <ErrorBanner message={error} />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <WeekNav weekStart={weekStart} setWeekStart={setWeekStart} />
        <TitleBadge weekStart={weekStart} />

        {/* Фильтры врач/отдел скрываем у доктора */}
        {!isDoctor && (
          <FiltersBar
            selectedDoctor={selectedDoctor}
            setSelectedDoctor={setSelectedDoctor}
            doctorOptions={doctorOptions}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            departmentOptions={departmentOptions}
          />
        )}

        {/* Кнопка добавления — скрыта у доктора */}
        {!isDoctor && (
          <button
            onClick={() => navigate("/addPatients")}
            className="ml-auto inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" /> Добавить запись
          </button>
        )}
      </div>

      <div
        ref={wrapRef}
        className="relative overflow-auto rounded-2xl border border-gray-200 shadow-sm bg-white"
        style={{ height: 600 }}
      >
        <div
          className="relative grid min-w-[1100px] text-sm"
          style={{
            gridTemplateColumns: "120px repeat(7, minmax(0, 1fr))",
            gridTemplateRows: `72px repeat(${hourSlots.length}, ${ROW_H}px)`,
          }}
        >
          {/* Левый верхний угол */}
          <div className="sticky top-0 left-0 z-30 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-r" />

          {/* Заголовки дней */}
          {days.map((d, i) => {
            const isToday = isTodayInWeek && i === todayIdx;
            const dateStr = `${String(d.getDate()).padStart(2, "0")}.${String(
              d.getMonth() + 1
            ).padStart(2, "0")}`;
            return (
              <div
                key={`hdr-${i}`}
                style={{ gridColumn: i + 2, gridRow: 1 }}
                className={`sticky top-0 z-20 flex flex-col items-center justify-center gap-0.5 border-b border-gray-200 p-3 backdrop-blur supports-[backdrop-filter]:bg-white/60 ${
                  isToday ? "bg-indigo-50" : "bg-white/80"
                }`}
              >
                <div
                  className={`leading-none ${
                    isToday ? "text-indigo-800" : "text-gray-900"
                  } text-base md:text-lg font-semibold`}
                >
                  {dateStr}
                </div>
                <div
                  className={`text-[11px] md:text-xs uppercase tracking-wide ${
                    isToday ? "text-indigo-700" : "text-gray-500"
                  }`}
                >
                  {RU_DAYS[i]}
                </div>
              </div>
            );
          })}

          {/* Левая колонка времени */}
          {hourSlots.map((t, i) => (
            <div
              key={`time-${t}`}
              style={{ gridColumn: 1, gridRow: i + 2 }}
              className="sticky left-0 z-10 flex items-center justify-end gap-2 bg-white/80 pr-6 pl-3 text-[13px] md:text-sm text-gray-800 font-medium backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-100 border-r border-gray-200"
            >
              <span className="tabular-nums">{t}</span>
            </div>
          ))}

          {/* Колонки дней */}
          {days.map((_, day) => (
            <div
              key={`col-${day}`}
              style={{
                gridColumn: day + 2,
                gridRow: `2 / ${hourSlots.length + 2}`,
              }}
              className={`relative border border-gray-100 ${
                isTodayInWeek && day === todayIdx ? "bg-indigo-50/30" : ""
              }`}
              onDoubleClick={handleCreateInDay}
            >
              {hourSlots.map((_, r) => (
                <div
                  key={`hline-${day}-${r}`}
                  className={`border-b border-gray-100 transition-colors hover:bg-gray-50 ${
                    r % 2 === 1 ? "bg-gray-50/40" : ""
                  }`}
                  style={{ height: ROW_H }}
                />
              ))}
              <div className="absolute bottom-0 left-0 right-0 border-t-4 border-gray-100" />

              {isTodayInWeek && day === todayIdx && nowTop != null && (
                <div
                  className="pointer-events-none absolute left-0 right-0 z-10"
                  style={{ top: nowTop }}
                >
                  <div className="h-px w-full bg-indigo-500" />
                  <div className="absolute -left-2 -top-1 h-2 w-2 rounded-full bg-indigo-500" />
                </div>
              )}

              <AnimatePresence>
                {(eventsByDay[day] || []).map((app) => {
                  const start = new Date(app.appointment_date ?? app._start);
                  const dur = Math.max(
                    5,
                    Number(app?.duration_minutes ?? app?._duration) || 60
                  );
                  const actualStartMin =
                    start.getHours() * 60 + start.getMinutes();
                  const visibleStartMin = clamp(
                    actualStartMin,
                    DAY_START_HOUR * 60,
                    DAY_END_HOUR * 60
                  );
                  const actualEndMin = actualStartMin + dur;
                  const visibleEndMin = clamp(
                    actualEndMin,
                    DAY_START_HOUR * 60,
                    DAY_END_HOUR * 60
                  );
                  const clampedDur = Math.max(
                    0,
                    visibleEndMin - visibleStartMin
                  );
                  if (
                    visibleEndMin <= DAY_START_HOUR * 60 ||
                    visibleStartMin >= DAY_END_HOUR * 60
                  )
                    return null;
                  const topPx =
                    (visibleStartMin - DAY_START_HOUR * 60) * (ROW_H / 60);
                  const heightPx = Math.max(
                    clampedDur * (ROW_H / 60),
                    MIN_EVENT_HEIGHT
                  );
                  const leftPct = app._leftPct ?? 0;
                  const widthPct = app._widthPct ?? 100;

                  return (
                    <EventCard
                      key={
                        app.id ||
                        app._tmpId ||
                        `${day}-${+start}-${dur}-${leftPct}`
                      }
                      app={app}
                      topPx={topPx}
                      heightPx={heightPx}
                      leftPct={leftPct}
                      widthPct={widthPct}
                      onContextMenu={(ev) => {
                        if (isDoctor) return; // доктор не видит меню
                        ev.preventDefault();
                        const cont = wrapRef.current;
                        if (!cont) return;
                        const rect = cont.getBoundingClientRect();
                        let x = ev.clientX - rect.left + cont.scrollLeft;
                        let y = ev.clientY - rect.top + cont.scrollTop;
                        const MENU_W = 224;
                        const MENU_H = 100;
                        x = Math.min(x, cont.scrollWidth - MENU_W - 8);
                        y = Math.min(y, cont.scrollHeight - MENU_H - 8);
                        setMenu({ x: x + 4, y: y + 4, app });
                      }}
                    />
                  );
                })}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Меню — только не для доктора */}
        {!isDoctor && menu && (
          <div
            className="absolute inset-0 z-30"
            onClick={() => setMenu(null)}
            aria-hidden
          />
        )}
        {!isDoctor && menu && (
          <div
            style={{
              position: "absolute",
              left: menu.x,
              top: menu.y,
              zIndex: 50,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ContextMenu
              rec={menu.app}
              setIsOpen={() => setMenu(null)}
              onDelete={(patientId) => handleDelete(patientId)}
            />
          </div>
        )}
      </div>

      {!appointments?.length && (
        <div className="text-center text-sm text-gray-500 mt-4">
          {isDoctor
            ? "Записей пока нет."
            : "Записей пока нет. Добавьте приём или измените фильтры."}
        </div>
      )}
    </div>
  );
}
