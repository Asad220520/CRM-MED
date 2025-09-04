/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import fetchWithAuth from "../../auth/fetchWithAuth";
import API_BASE_URL from "../../../../config/api";
import LoadingSkeleton from "../../../components/ui/LoadingSkeleton";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate()
  const id = localStorage.getItem("id");

  async function getProfile() {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/en/doctor/${id}/`);
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      const doctor = await res.json();
      setData(doctor);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProfile();
  }, []);
  console.log(data);

  if (loading) return <LoadingSkeleton />;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!data) return <p className="text-center mt-10">Нет данных</p>;

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl border border-gray-200 p-6 mt-6">
      {/* Аватар */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <img
            src={data.profile_image}
            alt={data.username}
            className="w-26 h-26 rounded-full object-cover border-4 border-[#d7d0f7]"
          />
          <button onClick={() => nav(`/doctorEdit/${id}`) } className="absolute bottom-1 right-1 bg-[#d7d0f7] text-black p-2  rounded-full shadow-md">
            <FiEdit />
          </button>
        </div>
      </div>

      {/* Инфо */}
      <div className="space-y-4">
        <InfoField label="Имя врача" value={data.username} />
        <InfoField label="Email" value={data.email} />
        <InfoField label="Контакты" value={data.phone} />
        <InfoField label="Отделение" value={data.department} />
        <InfoField label="Должность" value={data.job_title} />
        <InfoField label="Мои бонусы" value={`${data.bonus}%`} />
      </div>
    </div>
  );
};

function InfoField({ label, value }) {
  return (
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <div className="bg-gray-100 px-4 py-3 rounded-lg font-medium">
        {value || "-"}
      </div>
    </div>
  );
}

export default ProfilePage;
