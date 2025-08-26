import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import fetchWithAuth from "../../auth/fetchWithAuth";
import API_BASE_URL from "../../../../config/api";
import Button from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import Calendar from "../../../components/ui/Calendar";
import Select from "../../../components/ui/Select"; // твой кастомный Select
import LoadingSkeleton from "../../../components/ui/LoadingSkeleton";

export default function AddPatientForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const nav = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [registrars] = useState([{ id: 252, name: "Артем Исанов" }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedDepartmentId = watch("department");

  // загрузка докторов и отделений
  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await fetchWithAuth(`${API_BASE_URL}/en/doctor/`);
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const data = await res.json();
        setDoctors(data);
        setFilteredDoctors(data);

        const uniqueDepartmentsMap = new Map();
        data.forEach((doc) => {
          const dep = doc.department;
          if (dep && !uniqueDepartmentsMap.has(dep.id)) {
            uniqueDepartmentsMap.set(dep.id, dep);
          }
        });
        setDepartments(Array.from(uniqueDepartmentsMap.values()));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetchWithAuth(
          `${API_BASE_URL}/en/department_service/`
        );
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const data = await res.json();
        setServices(data); // <- здесь сохраняем полученные услуги
      } catch (err) {
        setError(err.message);
      }
    }
    fetchServices();
  }, []);

  // фильтрация докторов по отделению
  useEffect(() => {
    if (selectedDepartmentId) {
      const filtered = doctors.filter(
        (doc) => doc.department.id === Number(selectedDepartmentId)
      );
      setFilteredDoctors(filtered);
      const selectedDoctorId = watch("doctor");
      if (
        selectedDoctorId &&
        !filtered.some((doc) => doc.id === Number(selectedDoctorId))
      ) {
        setValue("doctor", "");
      }
    } else {
      setFilteredDoctors(doctors);
    }
  }, [selectedDepartmentId, doctors, setValue, watch]);

  // Опции для Select
  const departmentOptions = departments.map((dep) => ({
    value: dep.id,
    label: dep.department_name,
  }));

  const doctorOptions = filteredDoctors.map((doc) => ({
    value: doc.id,
    label: doc.username,
  }));

  const serviceOptions = services.flatMap((srv) =>
    srv.department_services.map((el) => ({
      value: el.id,
      label: `${el.type} ${el.price} сом`,
    }))
  );

  const registrarOptions = registrars.map((reg) => ({
    value: reg.id,
    label: reg.name,
  }));

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

  const onSubmit = async (data) => {
    const payload = {
      name: data.fullName,
      birthday: data.birthDate,
      gender: data.gender,
      phone: data.phone.replace(/[^\d+]/g, ""),
      department: Number(data.department),
      doctor: Number(data.doctor),
      service_type: Number(data.service),
      registrar: Number(data.registrar),
      patient_status: data.status,
      appointment_date: data.appointment_date,
      payment_type: data.payment_type,
      time: data.time,
    };

    try {
      const response = await fetchWithAuth(
        `${API_BASE_URL}/en/patient/create/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Ошибка сервера:", errorData);
        throw new Error(
          `Ошибка ${response.status}: ${JSON.stringify(errorData)}`
        );
      }

      alert("Пациент успешно добавлен!");
    } catch (err) {
      alert("Ошибка: " + err.message);
    }
  };

  if (loading) return <LoadingSkeleton/>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white h-[85vh] py-6 px-30 rounded-xl shadow space-y-6 shadow-[1px_1px_6px_2px_rgba(128,128,128,0.5)]"
    >
      <div className="flex items-center gap-50">
        <div className="flex items-end gap-1">
          <FiChevronLeft size={26} />
          <h2 className="text-xl p-0 text-left font-semibold">
            Записи клиентов
          </h2>
        </div>
        <h2 className="text-xl text-center font-semibold">Добавить пациента</h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* ФИО */}
        <div>
          <label className="block mb-1 font-medium">ФИО</label>
          <input
            type="text"
            placeholder="Мария Ивановна"
            {...register("fullName", { required: true })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          {errors.fullName && (
            <p className="text-red-600 text-sm">Введите ФИО</p>
          )}
        </div>

        {/* Дата рождения */}
        <div>
          <label className="block mb-1 font-medium">Дата рождения</label>
          <Calendar
            filters={{ date: watch("birthDate") }}
            handleFilterChange={(name, value) => setValue("birthDate", value)}
            mode="filter"
          />
          {errors.birthDate && (
            <p className="text-red-600 text-sm">Введите дату рождения</p>
          )}
        </div>

        {/* Пол */}
        <div>
          <Select
            label="Пол"
            name="gender"
            value={watch("gender")}
            onChange={(e) => setValue("gender", e.target.value)}
            options={[
              { value: "male", label: "Мужской" },
              { value: "female", label: "Женский" },
            ]}
            containerWidth="w-full"
            dropdownMaxHeight="max-h-40"
          />
          {errors.gender && (
            <p className="text-red-600 text-sm">Выберите пол</p>
          )}
        </div>

        {/* Телефон */}
        <div>
          <label className="block mb-1 font-medium">Телефон номер</label>
          <input
            type="tel"
            placeholder="+996 550 941 433"
            {...register("phone", { required: true })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          {errors.phone && (
            <p className="text-red-600 text-sm">Введите телефон</p>
          )}
        </div>

        {/* Отделение */}
        <div>
          <Select
            label="Отделение"
            name="department"
            value={watch("department")}
            onChange={(e) => setValue("department", e.target.value)}
            options={departmentOptions}
            containerWidth="w-full"
            dropdownMaxHeight="max-h-40"
          />
          {errors.department && (
            <p className="text-red-600 text-sm">Выберите отделение</p>
          )}
        </div>

        {/* Врач */}
        <div>
          <Select
            label="Врач"
            name="doctor"
            value={watch("doctor")}
            onChange={(e) => setValue("doctor", e.target.value)}
            options={doctorOptions}
            containerWidth="w-full"
            dropdownMaxHeight="max-h-40"
          />
          {errors.doctor && (
            <p className="text-red-600 text-sm">Выберите врача</p>
          )}
        </div>

        {/* Услуги врача */}
        <div>
          <Select
            label="Услуги врача"
            name="service"
            value={watch("service")}
            onChange={(e) => setValue("service", e.target.value)}
            options={serviceOptions}
            containerWidth="w-full"
            dropdownMaxHeight="max-h-40"
          />
          {errors.service && (
            <p className="text-red-600 text-sm">Выберите услугу</p>
          )}
        </div>

        {/* Регистратор */}
        <div>
          <Select
            label="Регистратор"
            name="registrar"
            value={watch("registrar")}
            onChange={(e) => setValue("registrar", e.target.value)}
            options={registrarOptions}
            containerWidth="w-full"
            dropdownMaxHeight="max-h-40"
          />

          {errors.registrar && (
            <p className="text-red-600 text-sm">Выберите регистратора</p>
          )}
        </div>

        {/* Статус пациента */}
        <div>
          <Select
            label="Статус пациента"
            name="status"
            value={watch("status")}
            onChange={(e) => setValue("status", e.target.value)}
            options={statusOptions}
            containerWidth="w-full"
            dropdownMaxHeight="max-h-40"
          />
          {errors.status && (
            <p className="text-red-600 text-sm">Выберите статус пациента</p>
          )}
        </div>

        {/* Дата записи */}
        <div>
          <label className="block mb-1 font-medium">Дата записи</label>
          <Calendar
            filters={{ date: watch("appointment_date") }}
            handleFilterChange={(name, value) =>
              setValue("appointment_date", value)
            }
            mode="booking"
          />
          {errors.appointment_date && (
            <p className="text-red-600 text-sm">Введите дату записи</p>
          )}
        </div>

        {/* Тип оплаты */}
        <div>
          <Select
            label="Тип оплаты"
            name="payment_type"
            value={watch("payment_type")}
            onChange={(e) => setValue("payment_type", e.target.value)}
            options={paymentOptions}
            containerWidth="w-full"
            dropdownMaxHeight="max-h-40"
          />
          {errors.payment_type && (
            <p className="text-red-600 text-sm">Выберите тип оплаты</p>
          )}
        </div>

        {/* Время */}
        <div>
          <label className="block mb-1 font-medium">Укажите время</label>
          <input
            type="text"
            placeholder="18:00 - 20:00"
            {...register("time", { required: true })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          {errors.time && <p className="text-red-600 text-sm">Введите время</p>}
        </div>
      </div>

      <div className="flex gap-10 w-[500px] gap-4 pt-4">
        <Button
          className="w-full"
          variant="outline"
          type="button"
          onClick={() => nav(-1)}
        >
          Назад
        </Button>
        <Button className="w-full" type="submit">
          Далее
        </Button>
      </div>
    </form>
  );
}
