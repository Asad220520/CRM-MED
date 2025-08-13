import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

function statusStyles(status) {
  switch (status.toLowerCase()) {
    case "had an appointment":
    case "был на приёме":
      return "bg-green-100 text-green-800";
    case "waiting":
    case "ожидает":
      return "bg-yellow-100 text-yellow-800";
    case "canceled":
    case "отменено":
      return "bg-red-100 text-red-800";
    case "предварительная запись":
    case "pre-registration":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function PatientHistory({ name }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://13.62.101.249/en/patient/${name}/history/`)
      .then((res) => {
        setHistory(res.data?.patients || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [name]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-[16px] font-medium">
        Загрузка...
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-[16px] font-medium">
        История записей (пока пусто)
      </div>
    );
  }

  // 📊 Подсчёт статистики
  const total = history.length;
  const appointment = history.filter(
    (h) =>
      h.patient_status_display?.toLowerCase() === "был на приёме" ||
      h.patient_status_display?.toLowerCase() === "had an appointment"
  ).length;
  const preRegistration = history.filter(
    (h) =>
      h.patient_status_display?.toLowerCase() === "предварительная запись" ||
      h.patient_status_display?.toLowerCase() === "pre-registration"
  ).length;
  const liveReception = history.filter(
    (h) =>
      h.patient_status_display?.toLowerCase() === "ожидает" ||
      h.patient_status_display?.toLowerCase() === "waiting"
  ).length;
  const canceled = history.filter(
    (h) =>
      h.patient_status_display?.toLowerCase() === "отменено" ||
      h.patient_status_display?.toLowerCase() === "canceled"
  ).length;

  return (
    <div>
      {/* 📌 Сводка в виде табов */}
      <div className="flex justify-between gap-2 mb-4">
        <div className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow font-medium">
          Все записи: <span className="font-bold">{total}</span>
        </div>
        <div className="px-4 py-2 bg-green-100 text-green-800rounded-lg shadow font-medium">
          Был на приёме: <span className="font-bold">{appointment}</span>
        </div>
        <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg shadow font-medium">
          Предзапись: <span className="font-bold">{preRegistration}</span>
        </div>
        <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg shadow font-medium">
          Живой приём: <span className="font-bold">{liveReception}</span>
        </div>
        <div className="px-4 py-2 bg-red-100 text-red-800 rounded-lg shadow font-medium">
          Отмененные: <span className="font-bold">{canceled}</span>
        </div>
      </div>

      {/* 📜 Список */}
      <div
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="overflow-x-auto overflow-y-auto max-h-[360px] py-2"
      >
        {history.map((item) => (
          <div
            key={item.id}
            className="flex text-center items-center justify-between p-3 rounded-lg shadow-lg gap-2"
          >
            {/* Левая часть — карточки */}
            <div className="flex  gap-2">
              <div className="px-3 py-1 rounded-md shadow text-gray-700 bg-gray-50">
                <span className="text-gray-500 text-sm font-medium">
                  Регистратор:{" "}
                </span>
                <span className="font-medium">{item.registrar?.username}</span>
              </div>

              <div className="flex items-center px-3 py-1 rounded-md shadow text-gray-700 bg-gray-50">
                <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                <span className="text-gray-500 text-sm font-medium">
                  Отдел:{" "}
                </span>
                <span className="font-medium ml-1">
                  {item.department?.department_name}
                </span>
              </div>

              <div className="px-3 py-1 rounded-md shadow text-gray-700 bg-gray-50">
                <span className="text-gray-500 text-sm font-medium">
                  Специалист:{" "}
                </span>
                <span className="font-medium">{item.doctor?.username}</span>
              </div>

              <div className="px-3 py-1 rounded-md shadow text-gray-700 bg-gray-50">
                <span className="text-gray-500 text-sm font-medium">
                  Услуга:{" "}
                </span>
                <span className="font-medium">{item.service_type?.type}</span>
              </div>

              <div className="px-3 py-1 rounded-md shadow text-gray-700 bg-gray-50">
                <span className="text-gray-500 text-sm font-medium">
                  Дата создания:{" "}
                </span>
                <span className="font-medium">{item.created_date}</span>
              </div>
            </div>

            {/* Правая часть */}
            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1 rounded-full font-medium ${statusStyles(
                  item.patient_status_display
                )}`}
              >
                {item.patient_status_display}
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
