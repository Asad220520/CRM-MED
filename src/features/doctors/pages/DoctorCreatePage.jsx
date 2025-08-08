import React, { useEffect, useState, useRef } from "react";
import API_BASE_URL from "../../../../config/api";
import fetchWithAuth from "../../auth/fetchWithAuth";
import { FiMoreVertical } from "react-icons/fi";

function DoctorRow({ doc, onEdit, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <tr
      ref={ref}
      className={`border-t border-gray-300 text-sm relative ${
        isOpen ? "bg-[#E6F7F8]" : ""
      }`}
    >
      <td className="p-3">
        <span className="text-gray-500 mr-1">Специалист:</span> {doc.username}
      </td>
      <td className="p-3">
        <span className="text-gray-500 mr-1">Кабинет:</span> {doc.room ?? "—"}
      </td>
      <td className="p-3">
        <span className="text-gray-500 mr-1">Отделение:</span>{" "}
        {doc.department.department_name}
      </td>
      <td className="p-3">
        <span className="text-gray-500 mr-1">Телефон:</span> {doc.phone ?? "—"}
      </td>
      <td className="p-3 text-right relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-600 hover:text-black cursor-pointer"
          aria-label="Действия"
        >
          <FiMoreVertical size={18} />
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-36 bg-white rounded shadow-xl z-10">
            <button
              onClick={() => {
                onEdit(doc);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              ✏️ Редактировать
            </button>
            <button
              onClick={() => {
                onDelete(doc);
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

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState(null);
  const [editUsername, setEditUsername] = useState("");

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await fetchWithAuth(`${API_BASE_URL}/en/doctor/`);
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const data = await res.json();
        setDoctors(data);
        setFilteredDoctors(data);
        setDepartments([
          ...new Set(data.map((d) => d.department.department_name)),
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  useEffect(() => {
    let filtered = doctors;
    if (searchTerm)
      filtered = filtered.filter((d) =>
        d.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    if (selectedDepartment !== "all")
      filtered = filtered.filter(
        (d) => d.department.department_name === selectedDepartment
      );
    setFilteredDoctors(filtered);
  }, [searchTerm, selectedDepartment, doctors]);

  const openDeleteModal = (doc) => {
    setDoctorToDelete(doc);
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setDoctorToDelete(null);
    setDeleteModalOpen(false);
  };

  const openEditModal = (doc) => {
    setDoctorToEdit(doc);
    setEditUsername(doc.username);
    setEditModalOpen(true);
  };
  const closeEditModal = () => {
    setDoctorToEdit(null);
    setEditModalOpen(false);
  };

  async function handleDelete() {
    if (!doctorToDelete) return;
    try {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/en/doctor/${doctorToDelete.id}/`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error(`Ошибка удаления: ${res.status}`);
      setDoctors((prev) => prev.filter((d) => d.id !== doctorToDelete.id));
      closeDeleteModal();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    if (!doctorToEdit) return;

    try {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/en/doctor/${doctorToEdit.id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: editUsername }),
        }
      );
      if (!res.ok) throw new Error(`Ошибка редактирования: ${res.status}`);
      const updatedDoctor = await res.json();
      setDoctors((prev) =>
        prev.map((d) => (d.id === updatedDoctor.id ? updatedDoctor : d))
      );
      closeEditModal();
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <div className="text-center py-10">Загрузка...</div>;
  if (error)
    return (
      <div className="text-center py-10 text-red-600 font-semibold">
        Ошибка: {error}
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Список докторов</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Поиск по имени..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-60 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-60 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">Все отделы</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-3 text-left">Username</th>
            <th className="border border-gray-300 p-3 text-left">Room</th>
            <th className="border border-gray-300 p-3 text-left">Department</th>
            <th className="border border-gray-300 p-3 text-left">Phone</th>
            <th className="border border-gray-300 p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDoctors.map((doc) => (
            <DoctorRow
              key={doc.id}
              doc={doc}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          ))}
        </tbody>
      </table>

      {/* Модалка удаления */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Подтверждение удаления
            </h2>
            <p className="mb-6">
              Вы действительно хотите удалить доктора{" "}
              <strong>{doctorToDelete?.username}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Отмена
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка редактирования */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Редактировать доктора
            </h2>
            <form onSubmit={handleEditSubmit}>
              <label htmlFor="username" className="block mb-2 font-medium">
                Имя пользователя
              </label>
              <input
                id="username"
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
