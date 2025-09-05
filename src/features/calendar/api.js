// =========================
// src/features/calendar/api.js
// =========================
import fetchWithAuth from "../../features/auth/fetchWithAuth";
import API_BASE_URL from "../../../config/api";

/**
 * Список календаря (GET /en/calendar/).
 * Если передан doctorId — фильтрует по врачу.
 */
export async function apiListAppointments({ signal, params } = {}) {
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  const res = await fetchWithAuth(`${API_BASE_URL}/en/calendar/${qs}`, {
    method: "GET",
    signal,
  });
  if (!res.ok) throw new Error(`Загрузка записей не удалась: ${res.status}`);
  return res.json();
}
