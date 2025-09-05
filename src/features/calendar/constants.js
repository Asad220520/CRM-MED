import { asText } from "./helpers/text";

// visual/layout (оставляем как было)
export const ROW_H = 164;
export const DAY_START_HOUR = 8;
export const DAY_END_HOUR = 20;
export const MIN_EVENT_HEIGHT = 96;
export const SNAP_MIN = 15;
// --- добавить в calendar/constants.js ---

// Российские названия дней/месяцев (если нужны в UI)
export const RU_DAYS = [
  "Понедельник", "Вторник", "Среда", "Четверг",
  "Пятница", "Суббота", "Воскресенье",
];

export const RU_MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

// Слоты часов для шкалы календаря (используется в useCalendarComputed)
export const buildHourSlots = (startHour, endHour) => {
  const arr = [];
  for (let h = startHour; h < endHour; h++) {
    arr.push(`${String(h).padStart(2, "0")}:00`);
  }
  return arr;
};
// стили (можешь оставить свои цвета/лейблы)
export const statusStyles = {
  live: {
    bg: "#DCFFD7",
    accent: "#119618",
    chip: "#92FF96",
    label: "Живая очередь",
  },
  booked: {
    bg: "#FFE9E5",
    accent: "#FF684C",
    chip: "#FFA7F2",
    label: "По записи",
  },
  done: {
    bg: "#F3F4F6",
    accent: "#6B7280",
    chip: "#E5E7EB",
    label: "Был на приёме",
  },
  canceled: {
    bg: "#FEF2F2",
    accent: "#EF4444",
    chip: "#FEE2E2",
    label: "Отменён",
  },
  default: {
    bg: "#e0e7ff",
    accent: "#6366f1",
    chip: "#c7d2fe",
    label: "Приём",
  },
};

/** Нормализация строки */
const norm = (v) => asText(v).trim().toLowerCase();

/** 1) Точные коды из бэка (желательно всегда присылать именно их) */
const CODE_TO_KEY = {
  waiting: "live",
  "pre-registration": "booked",
  "had an appointment": "done",
  canceled: "canceled",
};

/** 2) Запасной словарь для display-текста (EN/RU), если кода нет */
const DISPLAY_TO_KEY = {
  // live
  "живая очередь": "live",
  live: "live",
  queue: "live",

  // booked / pre-registration
  "по записи": "booked",
  предзапись: "booked",
  "pre-registration": "booked",
  booked: "booked",

  // done
  "был на приёме": "done",
  "был на приеме": "done",
  done: "done",
  completed: "done",
  finished: "done",
  "had an appointment": "done",

  // canceled
  отменён: "canceled",
  отменен: "canceled",
  отменено: "canceled",
  canceled: "canceled",
  cancelled: "canceled",
};

/**
 * Надёжная нормализация статуса:
 * 1) пробуем patient_status (код),
 * 2) затем patient_status_display / status_display,
 * 3) иначе — default.
 */
export const mapStatus = (app) => {
  const code = norm(
    app?.patient_status ?? app?.status ?? app?.state ?? app?.patientStatus
  );
  if (code && CODE_TO_KEY[code]) return CODE_TO_KEY[code];

  const display = norm(
    app?.patient_status_display ?? app?.status_display ?? app?.statusText
  );
  if (display && DISPLAY_TO_KEY[display]) return DISPLAY_TO_KEY[display];

  return "default";
};

/** Если где-то нужна подпись централизованно */
export const statusLabel = (app) =>
  statusStyles[mapStatus(app)]?.label || statusStyles.default.label;
