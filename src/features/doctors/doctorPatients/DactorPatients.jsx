import React, { useEffect, useState, useRef } from "react";
import API_BASE_URL from "../../../../config/api";
import { FiMoreVertical } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Edit2 } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const paymentTypes = {
  Card: { label: "Карта", color: "bg-blue-500" },
  Cash: { label: "Наличные", color: "bg-green-500" },
};

// Компонент строки пациента
function PatientRow({ rec }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const nav = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <tr
      ref={ref}
      className={`border-b hover:bg-gray-50 relative ${
        isOpen ? "bg-[#E6F7F8]" : ""
      }`}
    >
      {/* Дата и время */}
      <td className="p-3">
        {rec.appointment_date
          ? format(new Date(rec.appointment_date), "dd.MM.yyyy HH:mm", {
              locale: ru,
            })
          : "-"}
      </td>

      {/* Пациент */}
      <td className="p-3">{rec.name}</td>

      {/* Врач */}
      <td className="p-3">{rec.doctor?.username || "-"}</td>

      {/* Отделение */}
      <td className="p-3">{rec.department?.department_name || "-"}</td>

      {/* Способ оплаты */}
      <td className="p-3 flex items-center">
        <span
          className={`w-3 h-3 rounded-full mr-2 ${
            paymentTypes[rec.payment_type_display]?.color || "bg-gray-400"
          }`}
        ></span>
        {paymentTypes[rec.payment_type_display]?.label ||
          rec.payment_type_display}
      </td>

      {/* Сумма */}
      <td className="p-3 text-right">{rec.with_discount} c</td>

      {/* Действия */}
      <td className="p-3 text-right relative">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-gray-600 hover:text-black"
        >
          <FiMoreVertical size={18} />
        </button>
        {isOpen && (
          <div className="absolute right-4 mt-0 w-40 bg-white rounded shadow-xl z-10">
            <button
              onClick={() => {
                nav(`/editPasient/${rec.id}`);
                setIsOpen(false);
              }}
              className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              <Edit2 size={18} />
              Редактировать
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

export default function DoctorPatients() {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [patients, setPatients] = useState([]);

  const getDoctorPatients = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${API_BASE_URL}/en/doctor/patient/`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Ошибка от сервера:", errorText);
        throw new Error(`Ошибка: ${res.status}`);
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setPatients(data);
      } else if (Array.isArray(data.results)) {
        setPatients(data.results);
      } else {
        console.warn("⚠️ Неожиданный формат ответа:", data);
        setPatients([]);
      }
    } catch (err) {
      console.error("❌ Ошибка загрузки пациентов:", err);
    }
  };

  useEffect(() => {
    getDoctorPatients();
  }, []);

  // Фильтрация пациентов
  const filteredPatients = patients.filter((rec) => {
    const matchesSearch = rec.name.toLowerCase().includes(search.toLowerCase());

    const matchesDate = dateFilter
      ? rec.appointment_date?.startsWith(dateFilter)
      : true;

    return matchesSearch && matchesDate;
  });
  console.log(patients);

  return (
    <div className="bg-white h-[85vh] py-6 px-6 rounded-xl shadow space-y-6 shadow-[1px_1px_6px_2px_rgba(128,128,128,0.5)]">
      <div className="flex gap-20">
        <h1 className="text-[22px] font-[500]">Все записи клиентов</h1>
      </div>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Поиск по имени"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
        />
            <h1 className="border border-gray-300 rounded-lg px-3 py-2 text-[18px] font-[400]">Врач:{patients[0]?.doctor?.username }</h1>
      </div>

      {/* Таблица пациентов */}
      <div className="overflow-x-auto overflow-y-auto min-h-[360px]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 sticky top-0 z-10">
              <th className="text-left p-3">Дата и время</th>
              <th className="text-left p-3">Пациент</th>
              <th className="text-left p-3">Врач</th>
              <th className="text-left p-3">Отделение</th>
              <th className="text-left p-3">Способ оплаты</th>
              <th className="text-right p-3">Сумма оплаты</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((rec) => (
              <PatientRow key={rec.id} rec={rec} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
