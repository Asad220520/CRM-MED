// =========================
// src/features/auth/shapeUser.js
// =========================
import { ROLES } from "../../lib/roles";
import API_BASE_URL from "../../../config/api";

// Настрой соответствия ID → роль под твой бэк
const JOB_TITLE_TO_ROLE = {
  74: ROLES.DOCTOR, // пример: 74 == Врач
  // 75: ROLES.RECEPTION,
  // 76: ROLES.ADMIN,
};

const DEPARTMENT_TO_ROLE = {
  // 80: ROLES.RECEPTION,
};

function pickRoleFromIds(job_title, department) {
  if (job_title != null && JOB_TITLE_TO_ROLE[job_title])
    return JOB_TITLE_TO_ROLE[job_title];
  if (department != null && DEPARTMENT_TO_ROLE[department])
    return DEPARTMENT_TO_ROLE[department];
  return ROLES.ADMIN;
}

function resolveAvatar(rawUrl) {
  if (!rawUrl) return "";
  if (/^https?:\/\//i.test(rawUrl)) return rawUrl;
  const slash = rawUrl.startsWith("/") ? "" : "/";
  return `${API_BASE_URL}${slash}${rawUrl}`;
}

/** Преобразует raw-пользователя бэка к формату приложения */
export function shapeUserFromBackend(raw) {
  if (!raw) return null;

  const role = pickRoleFromIds(raw.job_title, raw.department);
  const doctorId =
    role === ROLES.DOCTOR ? raw.doctor_id || raw.id || null : null;

  return {
    id: raw.id ?? null,
    username: raw.username || raw.email || "Пользователь",
    avatar: resolveAvatar(raw.profile_image), // 👈 важно
    role,
    doctorId: doctorId ? String(doctorId) : null,

    // опционально — дополнительные поля
    email: raw.email || "",
    phone: raw.phone || "",
    department: raw.department ?? null,
    job_title: raw.job_title ?? null,
    room: raw.room ?? null,
    bonus: raw.bonus ?? null,
  };
}
