import React, { useEffect, useState, useRef } from "react";
import API_BASE_URL from "../../../../config/api";
import { FiMoreVertical } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const departments = [
  { id: 71, name: "Кардиология" },
  { id: 72, name: "Неврология" },
  { id: 73, name: "УЗИ" },
  { id: 74, name: "Рентген и КТ" },
  { id: 75, name: "Велоэргометрия (ВЭМ)" },
  { id: 76, name: "Допплерография сосудов" },
  { id: 77, name: "Отделение №77" },
  { id: 78, name: "Отделение №78" },
  { id: 79, name: "Отделение №79" },
  { id: 80, name: "Отделение №80" },
];

const paymentTypes = {
  Карта: { label: "Карта", color: "bg-blue-500" },
  Наличные: { label: "Наличные", color: "bg-green-500" },
};

// Компонент строки пациента с локальной выпадашкой
function PatientRow({ rec, paymentTypes, onDelete }) {
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
      <td className="p-3">{rec.appointment_date}</td>
      <td className="p-3">{rec.name}</td>
      <td className="p-3">{rec.doctor.username}</td>
      <td className="p-3 flex items-center">
        <span
          className={`w-3 h-3 rounded-full mr-2 ${
            paymentTypes[rec.payment_type_display]?.color || "bg-gray-400"
          }`}
        ></span>
        {paymentTypes[rec.payment_type_display]?.label ||
          rec.payment_type_display}
      </td>
      <td className="p-3 text-right">{rec.price} c</td>
      <td className="p-3 text-right relative">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-gray-600 hover:text-black"
        >
          <FiMoreVertical size={18} />
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-36 bg-white rounded shadow-xl z-10">
            <button
              onClick={() => {
                nav(`/editPasient/${rec.id}`);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              ✏️ Редактировать
            </button>
            <button
              onClick={() => {
                onDelete(rec);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            >
              🗑️ Удалить
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

export default function PatientList() {
  const [activeDept, setActiveDept] = useState(departments[0]);
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");

  const getPatients = async (departmentId) => {
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(
        `${API_BASE_URL}/ru/department/${departmentId}/patient/`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
      const data = await res.json();
      setRecords(data.patients || []);
    } catch (err) {
      console.error("Ошибка загрузки пациентов", err);
    }
  };

  useEffect(() => {
    getPatients(activeDept.id);
  }, [activeDept]);

  const doctorsList = Array.from(
    records
      .reduce((acc, r) => {
        if (r.doctor?.username && r.doctor?.id) {
          acc.set(r.doctor.id, r.doctor);
        }
        return acc;
      }, new Map())
      .values()
  );

  const filteredRecords = records.filter((rec) => {
    const matchesSearch = rec.name.toLowerCase().includes(search.toLowerCase());
    const matchesDate = dateFilter
      ? rec.appointment_date.startsWith(
          dateFilter.split("-").reverse().join("-")
        )
      : true;
    const matchesDoctor = doctorFilter
      ? rec.doctor.username.toLowerCase() === doctorFilter.toLowerCase()
      : true;
    return matchesSearch && matchesDate && matchesDoctor;
  });

  const handleEdit = (patient) => {
    console.log("Редактировать:", patient);
    // логика редактирования
  };

  const handleDelete = (patient) => {
    console.log("Удалить:", patient);
    // логика удаления
  };

  return (
    <div className="">
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
        <select
          value={doctorFilter}
          onChange={(e) => setDoctorFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
        >
          <option value="">Все врачи</option>
          {doctorsList.map((doc) => (
            <option key={doc.id} value={doc.username}>
              {doc.username}
            </option>
          ))}
        </select>
      </div>

      {/* Вкладки отделений */}
      <div
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="overflow-x-auto w-[1000px]"
      >
        <div className="flex w-max mb-4">
          {departments.map((dept) => (
            <button
              key={dept.id}
              className={`pb-2 px-4 whitespace-nowrap ${
                dept.id === activeDept.id
                  ? "border-b-4 border-blue-600 font-semibold text-blue-600"
                  : "border-b-4 border-gray-100 text-gray-500"
              }`}
              onClick={() => setActiveDept(dept)}
            >
              {dept.name}
            </button>
          ))}
        </div>
      </div>

      {/* Таблица пациентов */}
      <div
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="overflow-x-auto overflow-y-auto max-h-[360px]"
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 sticky top-0 z-10">
              <th className="text-left p-3">Дата и время</th>
              <th className="text-left p-3">Пациент</th>
              <th className="text-left p-3">Врач</th>
              <th className="text-left p-3">Способ оплаты</th>
              <th className="text-right p-3">Сумма оплаты</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((rec) => (
              <PatientRow
                key={rec.id}
                rec={rec}
                paymentTypes={paymentTypes}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
