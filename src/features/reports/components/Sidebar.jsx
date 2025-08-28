import React from "react";
import { ChevronLeft } from "lucide-react";

const Sidebar = ({ activeReport, setActiveReport }) => {
  const menuItems = [
    { id: "reportExact", label: "Подробный отчет" },
    { id: "reportDoctor", label: "По врачам (закрытия)" },
    { id: "reportSummary", label: "Сводный отчет" },
  ];

  return (
    <div className="sticky inset-0 h-full w-56 bg-white rounded-lg shadow-[0px_0px_2px_1px_rgba(128,128,128,0.5)] z-20">
      <div className="p-4">
        <h1 className="text-lg font-semibold mb-6">Отчеты</h1>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveReport(item.id)}
              className={`w-full text-left px-3 py-2 rounded text-md transition-colors ${
                activeReport === item.id
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
