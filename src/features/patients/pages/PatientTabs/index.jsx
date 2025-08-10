import PatientForm from "./PatientForm";
import PatientHistory from "./PatientHistory";
import PatientAppointments from "./PatientAppointments";
import PaymentInfo from "./PaymentInfo";
import PatientData from "./PatientData";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import fetchWithAuth from "../../../auth/fetchWithAuth";
import API_BASE_URL from "../../../../../config/api";

export default function EditPatientPage() {
  const { editId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [activeTab, setActiveTab] = useState(0);

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
        const res = await fetchWithAuth(
          `${API_BASE_URL}/en/department_service/`
        );
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const data = await res.json();
        // Извлечь отделения из services или другой источник
        const uniqueDepartments = [
          ...new Map(data.map((dep) => [dep.id, dep])).values(),
        ];
        setDepartments(uniqueDepartments);
      } catch (err) {
        console.error(err);
      }
    }

    async function fetchServices() {
      try {
        const res = await fetchWithAuth(
          `${API_BASE_URL}/en/department_service/`
        );
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
  console.log(formData);

  if (loading) return <div>Загрузка...</div>;
  if (!formData) return <div>Пациент не найден</div>;

  return (
    <div className="bg-white  h-[85vh] py-6 px-30 rounded-xl shadow  space-y-6  shadow-[1px_1px_6px_2px_rgba(128,128,128,0.5)]">
      {/* Заголовок */}
      <h1 className="text-3xl font-semibold mb-2 text-center">
        Информация о пациенте
      </h1>
      <h2 className="text-2xl font-semibold mb-6 text-left">{formData.name}</h2>
      {/* Tabs */}
      <div className="flex justify-between mb-6">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`relative w-[180px] h-[40px] border-2 rounded-lg transition-colors ${
              idx === activeTab
                ? "border-blue-500 text-blue-600 font-semibold"
                : "border-gray-300 text-gray-500 hover:text-blue-500"
            }`}
          >
            {tab}
            {idx === activeTab && (
              <span className="absolute top-12 left-0 w-full h-[4px] bg-blue-500 rounded-t-md"></span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        <PatientForm
          formData={formData}
          registrars={registrars}
          doctors={doctors}
          statusOptions={statusOptions}
          departments={departments}
          services={services}
          paymentOptions={paymentOptions}
          handleChange={handleChange}
          handleSave={handleSave}
          navigate={navigate}
          saving={saving}
        />
      )}
      {activeTab === 1 && <PatientHistory />}
      {activeTab === 2 && <PatientAppointments />}
      {activeTab === 3 && <PaymentInfo />}
      {activeTab === 4 && <PatientData />}
    </div>
  );
}
