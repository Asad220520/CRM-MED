import API_BASE_URL from "../../../config/api";

async function refreshAccessToken() {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/en/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      return null;
    }

    const data = await res.json();
    if (data.access) {
      localStorage.setItem("access", data.access);
      return data.access;
    }
    return null;
  } catch {
    return null;
  }
}

export default async function fetchWithAuth(url, options = {}) {
  let accessToken = localStorage.getItem("access");

  options.headers = options.headers || {};

  // Проверяем, если тело - FormData, то не ставим Content-Type
  const isFormData = options.body instanceof FormData;

  if (!isFormData) {
    // Если Content-Type не указан, ставим application/json
    if (!options.headers["Content-Type"]) {
      options.headers["Content-Type"] = "application/json";
    }
  } else {
    // Для FormData удаляем Content-Type, чтобы браузер сам установил
    if (options.headers["Content-Type"]) {
      delete options.headers["Content-Type"];
    }
  }

  // Добавляем Authorization заголовок
  options.headers["Authorization"] = `Bearer ${accessToken}`;

  let response = await fetch(url, options);

  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
      options.headers["Authorization"] = `Bearer ${newAccessToken}`;
      response = await fetch(url, options);
    } else {
      window.location.href = "/login";
    }
  }

  return response;
}
