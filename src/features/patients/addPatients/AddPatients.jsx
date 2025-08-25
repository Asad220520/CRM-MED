import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import fetchWithAuth from "../../auth/fetchWithAuth";
import API_BASE_URL from "../../../../config/api";
import Button from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import CalendarFilter from "../../../components/CalendarFilter";

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
  const [registrars] = useState([
    { id: 252, name: "Артем Исанов" },
    // Добавь других регистраторов с уникальными числовыми id
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedDepartmentId = watch("department");

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
        setServices(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchServices();
  }, []);

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

  const departmentOptions = departments.map((dep) => (
    <option key={dep.id} value={dep.id}>
      {dep.department_name}
    </option>
  ));

  const doctorOptions = filteredDoctors.map((doc) => (
    <option key={doc.id} value={doc.id}>
      {doc.username}
    </option>
  ));

  const serviceOptions = services.flatMap((srv) =>
    srv.department_services.map((el) => (
      <option className=" " key={el.id} value={el.id}>
        {el.type} {el.price} сом
      </option>
    ))
  );

  const registrarOptions = registrars.map((reg) => (
    <option key={reg.id} value={reg.id}>
      {reg.name}
    </option>
  ));

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

  if (loading) return <p>Загрузка данных...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white  h-[85vh] py-6 px-30 rounded-xl shadow  space-y-6  shadow-[1px_1px_6px_2px_rgba(128,128,128,0.5)]"
    >
      <div className="flex items-center gap-50">
        <div className="flex items-end gap-1">
          <FiChevronLeft size={26} />
          <h2 className=" text-xl p-0 text-left font-semibold ">
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

          <CalendarFilter
            filters={{ date: watch("birthDate") }} // react-hook-form watch
            handleFilterChange={(name, value) => setValue("birthDate", value)}
            mode="filter" // только прошлые даты
          />

          {errors.birthDate && (
            <p className="text-red-600 text-sm">Введите дату рождения</p>
          )}
        </div>

        {/* Пол */}
        <div>
          <label className="block mb-1 font-medium">Пол</label>
          <select
            {...register("gender", { required: true })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="">Выберите пол</option>
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
          </select>
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
          <label className="block mb-1 font-medium">Отделение</label>
          <select
            {...register("department", { required: true })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="">Выберите отделение</option>
            {departmentOptions}
          </select>
          {errors.department && (
            <p className="text-red-600 text-sm">Выберите отделение</p>
          )}
        </div>

        {/* Врач */}
        <div>
          <label className="block mb-1 font-medium">Врач</label>
          <select
            {...register("doctor", { required: true })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="">Выберите врача</option>
            {doctorOptions}
          </select>
          {errors.doctor && (
            <p className="text-red-600 text-sm">Выберите врача</p>
          )}
        </div>

        {/* Услуги врача */}
        <div>
          <label className="block mb-1 font-medium">Услуги врача</label>
          <select
            {...register("service", { required: true })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="">Выберите услугу</option>
            {serviceOptions}
          </select>
          {errors.service && (
            <p className="text-red-600 text-sm">Выберите услугу</p>
          )}
        </div>

        {/* Регистратор */}
        <div>
          <label className="block mb-1 font-medium">Регистратор</label>
          <select
            {...register("registrar", { required: true })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="">Выберите регистратора</option>
            {registrarOptions}
          </select>
          {errors.registrar && (
            <p className="text-red-600 text-sm">Выберите регистратора</p>
          )}
        </div>

        {/* Статус пациента */}
        <div>
          <label className="block mb-1 font-medium">Статус пациента</label>
          <select
            {...register("status", { required: true })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="">Выберите статус</option>
            {statusOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="text-red-600 text-sm">Выберите статус пациента</p>
          )}
        </div>

        {/* Дата записи (appointment_date) */}
        <div>
          <label className="block mb-1 font-medium">Дата записи</label>

          <CalendarFilter
            filters={{ date: watch("appointment_date") }} // текущая дата из формы
            handleFilterChange={(name, value) =>
              setValue("appointment_date", value)
            }
            mode="booking" // только будущие даты
          />

          {errors.appointment_date && (
            <p className="text-red-600 text-sm">Введите дату записи</p>
          )}
        </div>

        {/* Тип оплаты (payment_type) */}
        <div>
          <label className="block mb-1 font-medium">Тип оплаты</label>
          <select
            {...register("payment_type", { required: true })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="">Выберите тип оплаты</option>
            {paymentOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
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
