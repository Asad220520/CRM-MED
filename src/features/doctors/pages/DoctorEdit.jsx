import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import fetchWithAuth from "../../auth/fetchWithAuth";
import API_BASE_URL from "../../../../config/api";
import Button from "../../../components/ui/Button";
import LoadingSkeleton from "../../../components/ui/LoadingSkeleton";
import { fetchDoctors } from "../../../redux/doctorsSlice";
import { Paperclip } from "lucide-react";

export default function DoctorEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const doctors = useSelector((state) => state.doctors.doctors || []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  // Превью фото
  const handleImageChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const removeImage = () => {
    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Загрузка данных
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // Загружаем врачей
        await dispatch(fetchDoctors());

        // Загружаем данные конкретного врача
        const res = await fetchWithAuth(`${API_BASE_URL}/en/doctor/${id}/`);
        if (!res.ok) throw new Error("Ошибка загрузки врача");
        const data = await res.json();

        console.log("Loaded doctor data:", data); // Для отладки
        setDoctorData(data);

        // Устанавливаем значения формы
        setValue("username", data.username || "");
        setValue("email", data.email || "");
        setValue("phone", data.phone || "");
        setValue("bonus", data.bonus || 0);

        // Для селектов устанавливаем строковые значения
        setValue("department", data.department ? String(data.department) : "");
        setValue("job_title", data.job_title ? String(data.job_title) : "");
        setValue("room", data.room ? String(data.room) : "");

        setPreview(data.profile_image || null);
      } catch (err) {
        console.error("Error loading data:", err);
        alert("Ошибка загрузки данных: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id, dispatch, setValue]);

  if (loading) return <LoadingSkeleton />;
  if (!doctorData) return <div>Врач не найден</div>;

  // Простые опции для селектов
  const allDepartments = doctors
    .map((doc) => doc.department)
    .filter((dep) => dep && dep.id && dep.department_name);

  const uniqueDepartments = allDepartments.filter(
    (dep, index, arr) => arr.findIndex((d) => d.id === dep.id) === index
  );

  const departmentOptions = uniqueDepartments.map((dep) => ({
    value: String(dep.id),
    label: dep.department_name,
  }));

  const allJobTitles = doctors
    .map((doc) => doc.job_title)
    .filter((jt) => jt && jt.id && jt.job_title);

  const uniqueJobTitles = allJobTitles.filter(
    (jt, index, arr) => arr.findIndex((j) => j.id === jt.id) === index
  );

  const jobTitleOptions = uniqueJobTitles.map((jt) => ({
    value: String(jt.id),
    label: jt.job_title,
  }));

  const allRooms = doctors
    .map((doc) => doc.room)
    .filter((room) => room !== null && room !== undefined);

  const uniqueRooms = [...new Set(allRooms)].sort((a, b) => a - b);

  const roomOptions = uniqueRooms.map((room) => ({
    value: String(room),
    label: `Комната ${room}`,
  }));

  // Обработчик отправки формы
  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const formData = new FormData();

      // Добавляем только измененные поля
      if (data.username !== doctorData.username) {
        formData.append("username", data.username);
      }
      if (data.email !== doctorData.email) {
        formData.append("email", data.email);
      }
      if (data.phone !== (doctorData.phone || "")) {
        formData.append("phone", data.phone || "");
      }
      if (
        data.department &&
        String(data.department) !== String(doctorData.department)
      ) {
        formData.append("department", Number(data.department));
      }
      if (
        data.job_title &&
        String(data.job_title) !== String(doctorData.job_title)
      ) {
        formData.append("job_title", Number(data.job_title));
      }
      if (data.room && String(data.room) !== String(doctorData.room)) {
        formData.append("room", Number(data.room));
      }
      if (Number(data.bonus) !== (doctorData.bonus || 0)) {
        formData.append("bonus", Number(data.bonus));
      }
      if (file) {
        formData.append("profile_image", file);
      }

      // Проверяем, есть ли изменения
      if ([...formData].length === 0) {
        alert("Нет изменений для сохранения");
        return;
      }

      const res = await fetchWithAuth(`${API_BASE_URL}/en/doctor/${id}/`, {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || JSON.stringify(errData));
      }

      alert("Данные врача успешно обновлены!");
      navigate(-1);
    } catch (err) {
      console.error("Save error:", err);
      alert("Ошибка сохранения: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        scrollbarWidth: "none",
      }}
      className="bg-white py-6 p-12 w-[700px] rounded-xl shadow space-y-6 max-w-lg mx-auto border border-gray-200 overflow-y-auto h-[85vh]"
    >
      {/* Фото */}
      <div className="flex flex-col w-full items-center gap-4">
        {preview && (
          <div className="flex gap-2 items-center">
            <img
              src={preview}
              alt="preview"
              className="w-28 h-28 rounded-full object-cover border-4 border-gray-200"
            />
            <Button type="button" onClick={removeImage}>
              Удалить фото
            </Button>
          </div>
        )}
        <div className="w-full">
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
            className="flex justify-between items-center bg-[#f6f6f6] px-4 py-3 w-full rounded-lg font-medium"
            onClick={() => fileInputRef.current?.click()}
          >
            Загрузите новое фото <Paperclip />
          </button>
        </div>
      </div>

      {/* Основные поля */}
      <InfoField label="Имя врача">
        <input
          type="text"
          {...register("username", { required: true })}
          className="bg-gray-100 w-full px-3 py-2 rounded"
        />
        {errors.username && <p className="text-red-600">Введите имя</p>}
      </InfoField>

      <InfoField label="Email">
        <input
          type="email"
          {...register("email", { required: true })}
          className="bg-gray-100 w-full px-3 py-2 rounded"
        />
        {errors.email && <p className="text-red-600">Введите email</p>}
      </InfoField>

      <InfoField label="Телефон">
        <input
          type="tel"
          {...register("phone")}
          className="bg-gray-100 w-full px-3 py-2 rounded"
        />
      </InfoField>

      {/* Селекты */}
      <InfoField label="Отделение">
        <select
          {...register("department")}
          className="bg-gray-100 w-full px-3 py-2 rounded"
        >
          <option value="">Выберите отделение</option>
          {departmentOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </InfoField>

      <InfoField label="Должность">
        <select
          {...register("job_title")}
          className="bg-gray-100 w-full px-3 py-2 rounded"
        >
          <option value="">Выберите должность</option>
          {jobTitleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </InfoField>

      <InfoField label="Комната">
        <select
          {...register("room")}
          className="bg-gray-100 w-full px-3 py-2 rounded"
        >
          <option value="">Выберите комнату</option>
          {roomOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </InfoField>

      <InfoField label="Бонус (%)">
        <input
          type="number"
          {...register("bonus")}
          className="bg-gray-100 w-full px-3 py-2 rounded"
        />
      </InfoField>

      {/* Кнопки */}
      <div className="flex justify-end gap-4 pt-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Назад
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>
    </form>
  );
}

function InfoField({ label, children }) {
  return (
    <div>
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      {children}
    </div>
  );
}
