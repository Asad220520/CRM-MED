import React, { useEffect, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import axios from "axios";
import API_BASE_URL from "../../../../../config/api";
import { useNavigate } from "react-router-dom";
import { BiEdit, BiEditAlt } from "react-icons/bi";
import { CiEdit } from "react-icons/ci";
import { Edit2 } from "lucide-react";
import { useRef } from "react";

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

export default function PatientAppointments({ name, setActiveTab }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/en/patient/${name}/history_of_appointment/`)
      .then((res) => {
        setHistory(res.data?.patients || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [name]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenId(null); // Закрываем меню при клике вне
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const total = history.length;
  const appointment = history.filter(
    (h) =>
      h.patient_status_display?.toLowerCase() === "был на приёме" ||
      h.patient_status_display?.toLowerCase() === "had an appointment"
  ).length;

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <div className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow font-medium">
          Все приёмы: <span className="font-bold">{total}</span>
        </div>
        <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg shadow font-medium">
          Был на приёме: <span className="font-bold">{appointment}</span>
        </div>
      </div>

      <div
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className="overflow-x-auto overflow-y-auto max-h-[360px] py-2"
      >
        {history.map((item) => (
          <div
            key={item.id}
            className="flex text-center items-center justify-between p-3 rounded-lg shadow-lg gap-2 mb-2 bg-white relative"
          >
            <div className="flex gap-2">
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

            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1 rounded-full font-medium ${statusStyles(
                  item.patient_status_display
                )}`}
              >
                {item.patient_status_display}
              </div>

              <button
                onClick={() =>
                  setMenuOpenId(menuOpenId === item.id ? null : item.id)
                }
                className="text-gray-400 hover:text-gray-600"
              >
                <FiMoreHorizontal size={18} />
              </button>

              {menuOpenId === item.id && (
                <div
                  ref={menuRef}
                  className="absolute right-3 w-[200px] top-12 w-36 bg-white rounded hover:bg-gray-100 shadow-xl  px-8  z-10"
                >
                  <button
                    onClick={() => {
                      setActiveTab(2);
                      navigate(`/editPasient/${item.id}`);
                      setMenuOpenId(null);
                    }}
                    className=" flex items-center  gap-2 text-left  py-2 "
                  >
                    <span>
                      <Edit2 size={18} />
                    </span>
                    Редактировать
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
