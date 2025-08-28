import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { Edit2 } from "lucide-react";

import API_BASE_URL from "../../../../config/api";
import fetchWithAuth from "../../auth/fetchWithAuth";
import { fetchDepartment } from "../../../redux/departmentSlice";
import LoadingSkeleton from "../../../components/ui/LoadingSkeleton";
import Calendar from "../../../components/ui/Calendar";
import Select from "../../../components/ui/Select";

const paymentTypes = {
  Карта: { label: "Карта", color: "bg-blue-500" },
  Наличные: { label: "Наличные", color: "bg-green-500" },
};

// Строка таблицы пациента
function PatientRow({ rec, paymentTypes, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const nav = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dateStr = new Date(rec.appointment_date).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <tr
      ref={ref}
      className={`border-b hover:bg-gray-50 relative ${
        isOpen ? "bg-[#E6F7F8]" : ""
      }`}
    >
      <td className="p-3">{dateStr}</td>
      <td className="p-3">{rec.name}</td>
      <td className="p-3">{rec.doctor?.username}</td>
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
            <button
              onClick={() => {
                onDelete(rec.id);
                setIsOpen(false);
              }}
              className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900"
            >
              <MdDeleteOutline size={18} className="text-gray-600" />
              Удалить
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

// Основной компонент списка пациентов
export default function PatientList() {
  const dispatch = useDispatch();
  const { departments, loading, error } = useSelector(
    (state) => state.department
  );

  const [activeDept, setActiveDept] = useState(null);
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");

  // Загружаем департаменты
  useEffect(() => {
    dispatch(fetchDepartment());
  }, [dispatch]);

  // Автоматически выбираем первый департамент
  useEffect(() => {
    if (!activeDept && departments.length > 0) {
      setActiveDept(departments[0]);
    }
  }, [departments, activeDept]);

  // Получаем пациентов выбранного департамента
  useEffect(() => {
    const getPatients = async (departmentId) => {
      try {
        if (!departmentId) return;
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

    if (activeDept?.id) getPatients(activeDept.id);
  }, [activeDept]);

  // Список уникальных врачей из текущих пациентов
  const doctorsList = Array.from(
    records
      .reduce((acc, r) => {
        if (r.doctor?.id && r.doctor?.username) acc.set(r.doctor.id, r.doctor);
        return acc;
      }, new Map())
      .values()
  );

  // Фильтрация записей
  const filteredRecords = records.filter((rec) => {
    const matchesSearch = rec.name.toLowerCase().includes(search.toLowerCase());

    const recDate = rec.appointment_date
      ? new Date(rec.appointment_date)
      : null;
    const matchesDate =
      !dateFilter ||
      (recDate &&
        !isNaN(recDate) &&
        recDate.toISOString().slice(0, 10) === dateFilter);

    const matchesDoctor =
      !doctorFilter ||
      rec.doctor?.username.toLowerCase() === doctorFilter.toLowerCase();

    return matchesSearch && matchesDate && matchesDoctor;
  });

  // Удаление пациента
  async function handleDelete(patientId) {
    if (!patientId) return;
    try {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/en/patient/${patientId}/edit/`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error(`Ошибка удаления: ${res.status}`);
      setRecords((prev) => prev.filter((p) => p.id !== patientId));
    } catch (err) {
      alert(err.message);
    }
  }
  if (loading) return <LoadingSkeleton />;
  if (error) return <div className="text-red-500">Ошибка: {error}</div>;
  return (
    <div>
      {/* Фильтры */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Поиск по имени"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
        />
        <Calendar
          filters={{ date: dateFilter }}
          handleFilterChange={(key, value) => setDateFilter(value)}
          mode="filter"
        />
        <Select
          value={doctorFilter}
          onChange={(e) => setDoctorFilter(e.target.value)}
          options={doctorsList.map((doc) => ({
            value: doc.username,
            label: doc.username,
          }))}
          searchable={true} // включаем поиск
          allOptionLabel="Все врачи"
        />
      </div>

      {/* Вкладки департаментов */}
      <div
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className="overflow-x-auto w-[1250px] mb-4"
      >
        <div className="flex w-full">
          {departments.map((dept) => (
            <button
              key={dept.id}
              className={`pb-2 px-4 whitespace-nowrap ${
                dept.id === activeDept?.id
                  ? "border-b-4 border-blue-600 font-semibold text-blue-600"
                  : "border-b-4 border-gray-100 text-gray-500"
              }`}
              onClick={() => setActiveDept(dept)}
            >
              {dept.department_name}
            </button>
          ))}
        </div>
      </div>

      {/* Таблица пациентов */}
      <div
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
