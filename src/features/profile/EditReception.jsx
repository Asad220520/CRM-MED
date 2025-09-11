import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "../auth/fetchWithAuth";
import API_BASE_URL from "../../../config/api";
import Button from "../../components/ui/Button";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import { Paperclip } from "lucide-react";

export default function ReceptionEdit() {
  const navigate = useNavigate();
  const id = localStorage.getItem("id");

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const [receptionData, setReceptionData] = useState(null);
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

  useEffect(() => {
    async function loadReception() {
      try {
        setLoading(true);
        const res = await fetchWithAuth(`${API_BASE_URL}/ru/receptionist/${id}/`);
        if (!res.ok) throw new Error("Ошибка загрузки данных");
        const data = await res.json();
        setReceptionData(data);

        // Заполняем форму
        setValue("username", data.username || "");
        setValue("email", data.email || "");
        setValue("phone", data.phone || "");
        setPreview(data.profile_image || null);
      } catch (err) {
        alert("Ошибка загрузки: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadReception();
  }, [id, setValue]);

  if (loading) return <LoadingSkeleton />;
  if (!receptionData) return <div>Ресепшн не найден</div>;

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const formData = new FormData();

      if (data.username !== receptionData.username) formData.append("username", data.username);
      if (data.email !== receptionData.email) formData.append("email", data.email);
      if (data.phone !== (receptionData.phone || "")) formData.append("phone", data.phone || "");
      if (file) formData.append("profile_image", file);

      if ([...formData].length === 0) {
        alert("Нет изменений для сохранения");
        setSaving(false);
        return;
      }

      const res = await fetchWithAuth(`${API_BASE_URL}/ru/receptionist/${id}/`, {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || JSON.stringify(errData));
      }

      alert("Данные успешно обновлены!");
      navigate(-1);
    } catch (err) {
      alert("Ошибка сохранения: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
      <InfoField label="Имя ресепшн">
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
