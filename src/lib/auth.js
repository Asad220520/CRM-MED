// Получаем текущую роль из localStorage
export function getCurrentUserRole() {
  return localStorage.getItem("role") || null;
}

// Проверяем авторизацию — есть ли access токен
export function isAuthenticated() {
  return Boolean(localStorage.getItem("access"));
}

// ID текущего врача (если авторизован как doctor)
export function getCurrentDoctorId() {
  return localStorage.getItem("doctorId") || null;
}
