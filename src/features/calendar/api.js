import fetchWithAuth from "../../features/auth/fetchWithAuth";
import API_BASE_URL from "../../../config/api";

export async function apiListAppointments({ signal, params } = {}) {
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  const res = await fetchWithAuth(`${API_BASE_URL}/en/calendar/${qs}`, {
    method: "GET",
    signal,
  });
  if (!res.ok) throw new Error(`Загрузка записей не удалась: ${res.status}`);
  return res.json();
}
