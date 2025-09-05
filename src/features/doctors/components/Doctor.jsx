// =========================
// src/features/doctors/components/DoctorNotifications.jsx
// =========================
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import LoadingSkeleton from "../../../components/ui/LoadingSkeleton";
import Button from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { markRead } from "../../../redux/notificationsSlice";

function fmtRu(dtStr) {
  if (!dtStr) return "-";
  const d = new Date(dtStr);
  if (isNaN(+d)) return dtStr;
  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DoctorNotifications() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const {
    items: notifications = [],
    error,
    doctorPolling,
  } = useSelector((s) => s.notifications || {});

  if (!doctorPolling && notifications.length === 0 && !error) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="bg-white h-[85vh] py-6 px-6 rounded-xl shadow space-y-6 shadow-[1px_1px_6px_2px_rgba(128,128,128,0.5)]">
      <h2 className="text-2xl font-bold mb-5 text-gray-800">Уведомления</h2>

      {error && <p className="text-red-500">{error}</p>}
      {!error && notifications.length === 0 && (
        <p className="text-gray-500 text-lg">Нет уведомлений.</p>
      )}

      <div className="space-y-4">
        {notifications.map((n) => {
          const date = n.appointment_date || n.created_at;
          const dep = n.department_name || "-";
          const patientName = n.patientName || "-";
          const registrar = n.registrar || "";
          return (
            <div
              key={n.id}
              className={`bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center gap-3 ${
                n.read ? "" : "ring-1 ring-indigo-200 bg-indigo-50/40"
              }`}
            >
              <div className="space-y-1">
                <p className="font-semibold text-gray-700">
                  Запись на <span className="text-blue-600">{fmtRu(date)}</span>{" "}
                  — <span className="text-gray-600">{dep}</span>
                </p>
                <p className="text-gray-600">Пациент: {patientName}</p>
                {!!registrar && (
                  <p className="text-gray-600">Регистратор: {registrar}</p>
                )}
              </div>

              <div className="mt-2 md:mt-0 flex gap-2">
                {!n.read && (
                  <Button
                    onClick={() => dispatch(markRead(n.id))}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Прочитать
                  </Button>
                )}
                <Button
                  onClick={() => {
                    if (date) {
                      const iso = new Date(date).toISOString();
                      nav(`/calendar?date=${encodeURIComponent(iso)}`);
                    } else {
                      const patientId = n?._raw?.patient?.id || n.id;
                      nav(`/editPasient/${patientId}`);
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Открыть
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
