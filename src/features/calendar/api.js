// =========================
// src/features/calendar/api.js
// =========================
import fetchWithAuth from "../../features/auth/fetchWithAuth";
import API_BASE_URL from "../../../config/api";

/**
 * Бэкенд поддерживает только список календаря (GET /en/calendar/).
 * Создание/редактирование/удаление делаем через редиректы в модуле пациентов.
 */

export async function apiListAppointments(signal) {
  const res = await fetchWithAuth(`${API_BASE_URL}/en/calendar/`, {
    method: "GET",
    signal,
  });
  if (!res.ok) throw new Error(`Загрузка записей не удалась: ${res.status}`);
  return res.json();
}
