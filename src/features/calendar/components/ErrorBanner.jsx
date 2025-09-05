// =========================
// src/components/WeeklyCalendar/components/ErrorBanner.jsx
// =========================
export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="py-3 text-center text-red-600 bg-red-50 border border-red-200 rounded-lg mb-3">
      {message}
    </div>
  );
}
