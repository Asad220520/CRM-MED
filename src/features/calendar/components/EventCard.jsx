// =========================
// src/components/WeeklyCalendar/components/EventCard.jsx
// =========================
import { motion } from "framer-motion";
import Avatar from "./Avatar";
import { formatTime } from "../helpers/date";
import { statusStyles, mapStatus } from "../constants";

/** Безопасный текст из любого значения (убирает [object Object]) */
const safeText = (v) => {
  if (v == null) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (typeof v === "object") {
    return (
      v.label ??
      v.username ??
      v.name ??
      v.title ??
      v.type ??
      v.display ??
      v.value ??
      v.id ??
      ""
    ).toString();
  }
  return String(v);
};

/** Красивое имя врача */
const getDoctorName = (app) => {
  const d = app?.doctor;
  if (!d) return "";
  if (typeof d === "object") return safeText(d.username ?? d.name);
  return safeText(d);
};

/** Лейбл услуги из разных форматов данных */
const getServiceLabel = (app, fallback = "") => {
  const direct = safeText(app?.service_name);
  const fromService =
    app?.service && typeof app.service === "object"
      ? safeText(app.service.type ?? app.service.name ?? app.service.title)
      : safeText(app?.service);
  const fromServiceType =
    app?.service_type && typeof app.service_type === "object"
      ? safeText(
          app.service_type.type ??
            app.service_type.name ??
            app.service_type.title
        )
      : safeText(app?.service_type);

  return direct || fromService || fromServiceType || fallback || "";
};

/** Затемнение/осветление цвета */
function shade(hex, percent) {
  const f = parseInt(hex.slice(1), 16);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent) / 100;
  const R = f >> 16,
    G = (f >> 8) & 0x00ff,
    B = f & 0x0000ff;
  const to = (c) => Math.round((t - c) * p) + c;
  return `#${(0x1000000 + (to(R) << 16) + (to(G) << 8) + to(B))
    .toString(16)
    .slice(1)}`;
}

export default function EventCard({
  app,
  topPx,
  heightPx,
  leftPct,
  widthPct,
  onContextMenu,
  onDragStart,
  onResizeStart,
  isDragging,
}) {
  const st = statusStyles[mapStatus(app)] || statusStyles.default;

  const startTime = app?.appointment_date
    ? new Date(app.appointment_date)
    : app?._start
    ? new Date(app._start)
    : null;

  const durMin = Number(app?._duration ?? app?.duration_minutes ?? 60);
  const endTime = startTime
    ? new Date(startTime.getTime() + durMin * 60000)
    : null;

  const doctorName = getDoctorName(app);
  const jobTitle = safeText(app?.doctor?.job_title);
  const serviceName = getServiceLabel(app, st.label);

  const fmt = (d) => (d ? formatTime(d) : "--:--");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={`absolute rounded-xl border shadow-sm cursor-pointer ${
        isDragging ? "opacity-80" : ""
      }`}
      style={{
        top: topPx,
        height: heightPx,
        left: `${leftPct}%`,
        width: `${widthPct}%`,
        background: st.bg,
        borderColor: shade(st.bg, -12),
      }}
      onContextMenu={onContextMenu}
      role="button"
      tabIndex={0}
      aria-label={`${serviceName} — ${fmt(startTime)}–${fmt(endTime)}`}
      onMouseDown={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetY = e.clientY - rect.top;
        const isHandle = rect.height - offsetY < 14;
        if (isHandle) onResizeStart?.(e);
        else onDragStart?.(e);
      }}
    >
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-xl"
        style={{ background: st.accent }}
      />

      {/* Чип статуса */}
      <div className="mb-1 inline-flex items-center gap-2 px-2 pt-2">
        <span
          className="rounded-md px-2 py-0.5 text-xs"
          style={{ background: st.chip }}
        >
          {mapStatus(app) === "live"
            ? "Живая очередь"
            : mapStatus(app) === "booked"
            ? "По записи"
            : "Приём"}
        </span>
      </div>

      {/* Название услуги */}
      <div className="px-2 text-sm font-medium leading-4 line-clamp-2">
        {serviceName || "Приём"}
      </div>

      {/* Время */}
      <div className="px-2 text-xs text-gray-700">
        {fmt(startTime)} – {fmt(endTime)}
      </div>

      {/* Врач */}
      <div className="mt-2 flex items-center gap-2 px-2 pb-2">
        <Avatar name={doctorName || "Врач"} />
        <div className="min-w-0">
          <div className="text-sm font-medium truncate max-w-[180px]">
            {doctorName || "—"}
          </div>
          {jobTitle && (
            <div className="text-xs text-gray-500 truncate max-w-[240px]">
              пми{jobTitle}
            </div>
          )}
        </div>
      </div>

      {/* Ручка для ресайза */}
      <div
        className="absolute bottom-0 left-2 right-2 h-3 rounded-b-xl"
        style={{ cursor: "ns-resize" }}
      />
    </motion.div>
  );
}
