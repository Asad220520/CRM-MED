import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import fetchWithAuth from "../../auth/fetchWithAuth";
import API_BASE_URL from "../../../../config/api";

export default function EditPatientPage() {
  const { editId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [activeTab, setActiveTab] = useState(0); // Для табов

  // Списки для селектов
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [registrars] = useState([{ id: 252, name: "Артем Исанов" }]);

  const statusOptions = [
    { value: "pre-registration", label: "Предзапись" },
    { value: "waiting", label: "Живая очередь" },
    { value: "had an appointment", label: "Был на приёме" },
    { value: "canceled", label: "Отменённые" },
  ];

  const paymentOptions = [
    { value: "cash", label: "Наличные" },
    { value: "card", label: "Карта" },
  ];

  const tabs = [
    "Запись на приём",
    "История записей",
    "История приёмов",
    "Оплата",
    "Данные пациента",
  ];

  useEffect(() => {
      async function fetchPatient() {
      try {
        const res = await fetchWithAuth(
          `${API_BASE_URL}/en/patient/${editId}/edit/`
        );
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const data = await res.json();
        setFormData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    async function fetchDoctors() {
      try {
        const res = await fetchWithAuth(`${API_BASE_URL}/en/doctor/`);
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const data = await res.json();
        setDoctors(data);
      } catch (err) {
        console.error(err);
      }
    }

    async function fetchDepartments() {
      try {
        const res = await fetchWithAuth(`${API_BASE_URL}/en/department_service/`);
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const data = await res.json();
        // Извлечь отделения из services или другой источник
        const uniqueDepartments = [...new Map(data.map(dep => [dep.id, dep])).values()];
        setDepartments(uniqueDepartments);
      } catch (err) {
        console.error(err);
      }
    }

    async function fetchServices() {
      try {
        const res = await fetchWithAuth(`${API_BASE_URL}/en/department_service/`);
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchPatient();
    fetchDoctors();
    fetchDepartments();
    fetchServices();
  }, [editId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/en/patient/${editId}/edit/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(JSON.stringify(errorData));
      }
      alert("Данные сохранены");
      navigate(-1);
    } catch (err) {
      alert("Ошибка сохранения: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (!formData) return <div>Пациент не найден</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Заголовок */}
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Редактирование пациента
      </h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-2 ${
              idx === activeTab
                ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Содержимое активной вкладки */}
      {activeTab === 0 && (
        // Форма редактирования, с применением стилей из модалки
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 font-medium">Имя</label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Телефон</label>
            <input
              type="text"
              value={formData.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Отделение</label>
            <select
              value={formData.department || ""}
              onChange={(e) => handleChange("department", Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Выберите отделение</option>
              {departments.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.department_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Врач</label>
            <select
              value={formData.doctor || ""}
              onChange={(e) => handleChange("doctor", Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Выберите врача</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.username}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Услуга врача</label>
            <select
              value={formData.service_type || ""}
              onChange={(e) => handleChange("service_type", Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Выберите услугу</option>
              {services.flatMap((srv) =>
                srv.department_services.map((el) => (
                  <option key={el.id} value={el.id}>
                    {el.type} {el.price} сом
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Регистратор</label>
            <select
              value={formData.registrar || ""}
              onChange={(e) => handleChange("registrar", Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Выберите регистратора</option>
              {registrars.map((reg) => (
                <option key={reg.id} value={reg.id}>
                  {reg.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Статус пациента</label>
            <select
              value={formData.patient_status || ""}
              onChange={(e) => handleChange("patient_status", e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Выберите статус</option>
              {statusOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Дата записи</label>
            <input
              type="datetime-local"
              value={
                formData.appointment_date
                  ? formData.appointment_date.substring(0, 16)
                  : ""
              }
              onChange={(e) => handleChange("appointment_date", e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Тип оплаты</label>
            <select
              value={formData.payment_type || ""}
              onChange={(e) => handleChange("payment_type", e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Выберите тип оплаты</option>
              {paymentOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm mb-1 font-medium">Комментарий</label>
            <textarea
              value={formData.info || ""}
              onChange={(e) => handleChange("info", e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">
              Время (например, "18:00 - 20:00")
            </label>
            <input
              type="text"
              value={formData.time || ""}
              onChange={(e) => handleChange("time", e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>
      )}

      {/* Можно добавить содержимое для других вкладок, например: */}
      {activeTab === 1 && <div>История записей (пока пусто)</div>}
      {activeTab === 2 && <div>История приёмов (пока пусто)</div>}
      {activeTab === 3 && <div>Оплата (пока пусто)</div>}
      {activeTab === 4 && <div>Данные пациента (пока пусто)</div>}

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="border px-6 py-2 rounded-full text-gray-600"
          type="button"
        >
          Назад
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-full"
          type="button"
        >
          {saving ? "Сохраняем..." : "Сохранить"}
        </button>
      </div>
    </div>
  );
}
