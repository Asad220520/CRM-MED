export function getCurrentUserRole() {
  return localStorage.getItem("role") || null;
}
export function isAuthenticated() {
  return Boolean(localStorage.getItem("access"));
}
export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("role");
  localStorage.removeItem("doctorId");
  localStorage.removeItem("user");
}
export function getCurrentDoctorId() {
  return localStorage.getItem("doctorId") || null;
}
