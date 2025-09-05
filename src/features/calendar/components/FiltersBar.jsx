// =========================
// src/components/WeeklyCalendar/components/FiltersBar.jsx
// =========================
import { Filter, User, Building2 } from "lucide-react";

export default function FiltersBar({
  selectedDoctor,
  setSelectedDoctor,
  doctorOptions,
  selectedDepartment,
  setSelectedDepartment,
  departmentOptions,
}) {
  return (
    <div className="ml-auto flex flex-wrap items-center gap-2">
      <div className="relative">
        <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <select
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          className="appearance-none border rounded-xl pl-9 pr-9 py-2 text-sm bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">Врач: все</option>
          {doctorOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Filter className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      <div className="relative">
        <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="appearance-none border rounded-xl pl-9 pr-9 py-2 text-sm bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">Отдел: все</option>
          {departmentOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Filter className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
