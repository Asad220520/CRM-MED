import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import React, { useEffect, useState, useRef } from "react";
import API_BASE_URL from "../../../../config/api";
import fetchWithAuth from "../../auth/fetchWithAuth";
import { FiMoreVertical, FiEdit2, FiTrash } from "react-icons/fi";
import Select from "../../../components/ui/Select";
import Input from "../../../components/ui/Input";

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
    <tr ref={rowRef} className="border-0">
      <td colSpan={5} className="p-0 border-0">
        <div
          className={`flex items-center shadow-md rounded-lg bg-white px-3 py-2 text-sm transition-colors ${
            menuOpen ? "bg-[#E6F7F8]" : ""
          }`}
        >
          <div className="flex-1 p-3">
            <span className="text-gray-500 mr-1">Специалист:</span>
            {doc.username}
          </div>
          <div className="flex-1 p-3">
            <span className="text-gray-500 mr-1">Кабинет:</span>
            {doc.room ?? "—"}
          </div>
          <div className="flex-1 p-3">
            <span className="text-gray-500 mr-1">Отделение:</span>
            {doc.department.department_name}
          </div>
          <div className="flex-1 p-3">
            <span className="text-gray-500 mr-1">Телефон:</span>
            {doc.phone ?? "—"}
          </div>
          <div className="p-3 text-right relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-600 hover:text-black cursor-pointer"
              aria-label="Действия"
            >
              <FiMoreVertical size={18} />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fade-in"
                style={{ minWidth: "160px" }}
              >
                <button
                  onClick={() => {
                    onEdit(doc);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors text-gray-600"
                >
                  <FiEdit2 size={16} />
                  <span>Редактировать</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(doc);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors text-gray-600"
                >
                  <FiTrash size={16} />
                  <span>Удалить</span>
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
  const navigate = useNavigate();
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
    if (searchTerm) {
      filtered = filtered.filter((d) =>
        d.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedDepartment !== "all") {
      filtered = filtered.filter(
        (d) => d.department.department_name === selectedDepartment
      );
    }
    setFilteredDoctors(filtered);
  }, [searchTerm, selectedDepartment, doctors]);

  const handleDeleteConfirm = async () => {
    if (!doctorToDelete) return;
    try {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/en/doctor/${doctorToDelete.id}/`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error(`Ошибка удаления: ${res.status}`);
      setDoctors((prev) => prev.filter((d) => d.id !== doctorToDelete.id));
      setDeleteModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditSubmit = async (e) => {
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
      setEditModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-center py-10">Загрузка...</div>;
  if (error)
    return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="w-full mx-auto p-4">
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Поиск по имени..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="
    p-3
    w-60
    rounded-md
    border
    border-gray-300
    bg-white
    text-gray-700
    appearance-none
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    focus:border-blue-500
    cursor-pointer
    relative
    "
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='gray' height='20' viewBox='0 0 20 20' width='20' xmlns='http://www.w3.org/2000/svg'><polygon points='0,0 20,0 10,10'/></svg>")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "1rem",
          }}
        >
          <option value="all">Все отделы</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <Button onClick={() => navigate("/doctorcreate")} startIcon="FiPlus">
          Добавить нового врача
        </Button>
      </div>

      {/* Обёртка с прокруткой */}
      <div className="overflow-x-auto overflow-y-aut max-h-[600px]">
        <table className="w-full border-0 border-separate border-spacing-y-2">
          <tbody>
            {filteredDoctors.map((doc) => (
              <DoctorRow
                key={doc.id}
                doc={doc}
                onEdit={(d) => {
                  setDoctorToEdit(d);
                  setEditUsername(d.username);
                  setEditModalOpen(true);
                }}
                onDelete={(d) => {
                  setDoctorToDelete(d);
                  setDeleteModalOpen(true);
                }}
              />
            ))}
          </tbody>
        </table>
      </div>

      {isDeleteModalOpen && (
        <Modal
          title="Удалить врача?"
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          confirmText="Удалить"
          confirmClass="bg-red-600 hover:bg-red-700"
        >
          Вы уверены, что хотите удалить этого врача?
        </Modal>
      )}

      {isEditModalOpen && (
        <Modal
          title="Редактировать имя"
          onClose={() => setEditModalOpen(false)}
          onConfirm={handleEditSubmit}
          confirmText="Сохранить"
        >
          <input
            type="text"
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </Modal>
      )}
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
  onConfirm,
  confirmText,
  confirmClass,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded p-6 max-w-sm w-full shadow-lg">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="mb-6">{children}</div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 ${
              confirmClass || ""
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
