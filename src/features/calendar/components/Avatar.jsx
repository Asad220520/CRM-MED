// =========================
// src/components/WeeklyCalendar/components/Avatar.jsx
// =========================
export default function Avatar({ name }) {
  const initials = (name || " ")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-gray-700 border shadow-sm">
      {initials}
    </div>
  );
}
