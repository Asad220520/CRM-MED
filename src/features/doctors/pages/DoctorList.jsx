import React, { useEffect, useState, useRef } from "react";
import API_BASE_URL from "../../../../config/api";
import fetchWithAuth from "../../auth/fetchWithAuth";
import { FiMoreVertical, FiEdit2, FiTrash, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import LoadingSkeleton from "../../../components/ui/LoadingSkeleton";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";

function DoctorRow({ doc, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const rowRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (rowRef.current && !rowRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <tr ref={rowRef} className="transition-colors hover:bg-gray-50">
      <td colSpan={5} className="p-0">
        <div
          className={`flex items-center shadow-sm rounded-lg bg-white px-3 py-2 text-sm transition-colors ${
            menuOpen ? "bg-[#E6F7F8]" : ""
          }`}
        >
          <div className="flex-1 p-2">
            <span className="text-gray-500 mr-1">Специалист:</span>
            {doc.username}
          </div>
          <div className="flex-1 p-2">
            <span className="text-gray-500 mr-1">Кабинет:</span>
            {doc.room ?? "—"}
          </div>
          <div className="flex-1 p-2">
            <span className="text-gray-500 mr-1">Отделение:</span>
            {doc.department?.department_name ?? "—"}
          </div>
          <div className="flex-1 p-2">
            <span className="text-gray-500 mr-1">Телефон:</span>
            {doc.phone ?? "—"}
          </div>
          <div className="p-2 text-right relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-600 hover:text-black"
            >
              <FiMoreVertical size={18} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-md z-50">
                <button
                  onClick={() => {
                    onEdit(doc);
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                >
                  <FiEdit2 size={16} /> Редактировать
                </button>
                <button
                  onClick={() => {
                    onDelete(doc);
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  <FiTrash size={16} /> Удалить
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const navigate = useNavigate();

  // Загрузка списка врачей
  useEffect(() => {
    async function fetchDoctorsData() {
      try {
        const res = await fetchWithAuth(`${API_BASE_URL}/en/doctor/`);
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const data = await res.json();
        setDoctors(data);
        setFilteredDoctors(data);
        setDepartments([
          "Все отделы",
          ...Array.from(new Set(data.map((d) => d.department.department_name))),
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctorsData();
  }, []);

  // Фильтрация по имени и отделению
  useEffect(() => {
    let filtered = [...doctors];

    if (searchTerm) {
      filtered = filtered.filter((d) =>
        d.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment && selectedDepartment !== "Все отделы") {
      filtered = filtered.filter(
        (d) => d.department.department_name === selectedDepartment
      );
    }

    setFilteredDoctors(filtered);
  }, [searchTerm, selectedDepartment, doctors]);

  const handleDeleteConfirm = async (doc) => {
    if (!window.confirm(`Удалить врача ${doc.username}?`)) return;

    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/en/doctor/${doc.id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Ошибка удаления: ${res.status}`);
      setDoctors((prev) => prev.filter((d) => d.id !== doc.id));
      alert("Врач успешно удален");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error)
    return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="w-full mx-auto p-4">
      {/* Фильтры */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <h1 className="text-[22px] font-[500] flex-1">Список врачей</h1>
        <input
          type="text"
          placeholder="Поиск по имени..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <Select
          value={selectedDepartment || "all"}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          options={[
            { value: "all", label: "Все отделы" },
            ...departments.map((dept) => ({ value: dept, label: dept })),
          ]}
          searchable={true}
        />

        <Button
          onClick={() => navigate("/doctorCreatePage")}
          startIcon={FiPlus}
        >
          Добавить врача
        </Button>
      </div>

      {/* Таблица */}
      <div
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className="overflow-x-auto max-h-[500px] "
      >
        <table className="w-full border-separate border-spacing-y-2">
          <tbody>
            {filteredDoctors.map((doc) => (
              <DoctorRow
                key={doc.id}
                doc={doc}
                onDelete={handleDeleteConfirm}
                onEdit={(d) => navigate(`/doctorEditPage/${d.id}`)}
              />
            ))}
            {filteredDoctors.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">
                  Нет врачей для отображения
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
