import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../../../config/api";

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

export default function PatientList() {
  // --- Состояния ---
  const [activeDept, setActiveDept] = useState(departments[0]);
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");
  console.log(records);

  // --- Загрузка пациентов по отделению ---
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

  // --- Уникальный список врачей для селекта ---
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

  // --- Фильтрация записей ---
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
      <div className="flex flex-wrap gap-3 mb-4 border-b">
        {departments.map((dept) => (
          <button
            key={dept.id}
            className={`pb-2 ${
              dept.id === activeDept.id
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveDept(dept)}
          >
            {dept.name}
          </button>
        ))}
      </div>

      {/* Таблица пациентов */}
      <div className="overflow-x-auto overflow-y-auto max-h-[360px]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 sticky top-0 z-10">
              <th scope="col" className="text-left p-3">
                Дата и время
              </th>
              <th scope="col" className="text-left p-3">
                Пациент
              </th>
              <th scope="col" className="text-left p-3">
                Врач
              </th>
              <th scope="col" className="text-left p-3">
                Способ оплаты
              </th>
              <th scope="col" className="text-right p-3">
                Сумма оплаты
              </th>
              <th scope="col" className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((rec) => (
              <tr key={rec.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{rec.appointment_date}</td>
                <td className="p-3">{rec.name}</td>
                <td className="p-3">{rec.doctor.username}</td>
                <td className="p-3 flex items-center">
                  <span
                    className={`w-3 h-3 rounded-full mr-2 ${
                      paymentTypes[rec.payment_type_display]?.color ||
                      "bg-gray-400"
                    }`}
                  ></span>
                  {paymentTypes[rec.payment_type_display]?.label ||
                    rec.payment_type_display}
                </td>
                <td className="p-3 text-right">{rec.price} c</td>
                <td className="p-3 text-xl cursor-pointer select-none">⋮</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
