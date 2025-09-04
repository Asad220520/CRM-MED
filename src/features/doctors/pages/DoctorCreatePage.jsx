import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "../../auth/fetchWithAuth";
import API_BASE_URL from "../../../../config/api";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import LoadingSkeleton from "../../../components/ui/LoadingSkeleton";
import { fetchDoctors } from "../../../redux/doctorsSlice";
import { Paperclip } from "lucide-react";

export default function DoctorCreatePage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const nav = useNavigate();
  const dispatch = useDispatch();
  const doctors = useSelector((state) => state.doctors.doctors);

  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchDoctors()).finally(() => setLoadingDoctors(false));
  }, [dispatch]);

  // Уникальные опции для Select
  const departmentOptions = doctors
    .map((doc) => doc.department)
    .filter(Boolean)
    .map((dep) => ({ value: dep.id, label: dep.department_name }))
    .filter((v, i, a) => a.findIndex((x) => x.value === v.value) === i);

  const jobTitleOptions = doctors
    .map((doc) => doc.job_title)
    .filter(Boolean)
    .map((job) => ({ value: job.id , label: job.job_title }))
    .filter((v, i, a) => a.findIndex((x) => x.value === v.value) === i);

  const roomOptions = doctors
    .map((doc) => doc.room)
    .filter(Boolean)
    .map((room) => ({ value: room, label: `Комната ${room}` }))
    .filter((v, i, a) => a.findIndex((x) => x.value === v.value) === i);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    if (data.department) formData.append("department", data.department);
    if (data.job_title) formData.append("job_title", data.job_title);
    if (data.room) formData.append("room", data.room);
    formData.append("bonus", data.bonus || 0);

    if (file) {
      formData.append("profile_image", file);
    }

    try {
      setSubmitting(true);
      const res = await fetchWithAuth(`${API_BASE_URL}/en/doctor/create/`, {
        method: "POST",
        body: formData,
      });

      const resData = await res.json();

      if (!res.ok) {
        Object.keys(resData).forEach((key) => {
          setError(key, { type: "manual", message: resData[key][0] });
        });
        return;
      }
      nav(-1);
    } catch (err) {
      console.error(err);
      alert("Произошла ошибка при создании врача");
    } finally {
      setSubmitting(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Освобождаем память после превью
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (loadingDoctors) return <LoadingSkeleton />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ scrollbarWidth: "none" }}
      className="bg-white py-6 p-12 w-[700px] rounded-xl shadow space-y-6 max-w-lg mx-auto border border-gray-200 overflow-y-auto h-[85vh]"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Добавление врача
      </h2>

      {/* Фото */}
      <div>
        {preview && (
          <div className="flex gap-2 items-center m-2">
            <img
              src={preview}
              alt="preview"
              className="w-24 h-24 object-cover rounded-full border-3 border-[#d7d0f7]"
            />
            <Button type="button" onClick={removeImage}>
              Удалить фото
            </Button>
          </div>
        )}
        <label className="block mb-1 font-medium">Фото</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
        />

        <button
          type="button"
          className=" flex justify-between items-center bg-[#f6f6f6] px-4 py-3 w-full rounded-lg font-medium"
          onClick={handleButtonClick}
        >
          Загрузите новое фото
          <Paperclip />
        </button>
      </div>

      {/* ФИО */}
      <div>
        <label className="block mb-1 font-medium">ФИО</label>
        <input
          type="text"
          placeholder="Введите ФИО"
          {...register("username", { required: "Введите ФИО" })}
          className="border border-gray-300 bg-[#f6f6f6] rounded px-4 py-2 w-full"
        />
        {errors.username && (
          <p className="text-red-600 text-sm">{errors.username.message}</p>
        )}
      </div>

      {/* Пароль */}
      <div>
        <label className="block mb-1 font-medium">Пароль</label>
        <input
          type="password"
          placeholder="Введите пароль"
          {...register("password", { required: "Введите пароль" })}
          className="border border-gray-300 bg-[#f6f6f6] rounded px-4 py-2 w-full"
        />
        {errors.password && (
          <p className="text-red-600 text-sm">{errors.password.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block mb-1 font-medium">Эл. почта</label>
        <input
          type="email"
          placeholder="user@example.com"
          {...register("email", {
            required: "Введите email",
            pattern: { value: /^\S+@\S+$/i, message: "Некорректный email" },
          })}
          className="border border-gray-300 bg-[#f6f6f6] rounded px-4 py-2 w-full"
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Телефон */}
      <div>
        <label className="block mb-1 font-medium">Телефон</label>
        <input
          type="tel"
          placeholder="+996 550 941 433"
          {...register("phone", {
            required: "Введите телефон",
            pattern: {
              value: /^\+996 \d{3} \d{3} \d{3}$/,
              message: "Формат: +996 550 941 433",
            },
          })}
          className="border border-gray-300 bg-[#f6f6f6] rounded px-4 py-2 w-full"
        />
        {errors.phone && (
          <p className="text-red-600 text-sm">{errors.phone.message}</p>
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
        />
        {errors.department && (
          <p className="text-red-600 text-sm">{errors.department.message}</p>
        )}
      </div>

      {/* Должность */}
      <div>
        <Select
          label="Должность"
          name="job_title"
          value={watch("job_title")}
          onChange={(e) => setValue("job_title", e.target.value)}
          options={jobTitleOptions}
          containerWidth="w-full"
        />
        {errors.job_title && (
          <p className="text-red-600 text-sm">{errors.job_title.message}</p>
        )}
      </div>

      {/* Комната */}
      <div>
        <Select
          label="Комната"
          name="room"
          value={watch("room")}
          onChange={(e) => setValue("room", e.target.value)}
          options={roomOptions}
          containerWidth="w-full"
        />
        {errors.room && (
          <p className="text-red-600 text-sm">{errors.room.message}</p>
        )}
      </div>

      {/* Бонус */}
      <div>
        <label className="block mb-1 font-medium">Бонус (%)</label>
        <input
          type="number"
          placeholder="60"
          {...register("bonus")}
          className="border border-gray-300 bg-[#f6f6f6] rounded px-4 py-2 w-full"
        />
        {errors.bonus && (
          <p className="text-red-600 text-sm">{errors.bonus.message}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={!isValid || submitting}
        className="w-full py-3 text-lg "
      >
        {submitting ? "Создание..." : "Создать"}
      </Button>
    </form>
  );
}
