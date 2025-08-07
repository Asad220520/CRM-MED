export function getCurrentUserRole() {
  return localStorage.getItem("role") || "reception";
}
