import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import fetchWithAuth from "../auth/fetchWithAuth";
import API_BASE_URL from "../../../config/api";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import {
  fetchDepartments,
  fetchJobs,
  fetchRooms,
} from "../../redux/depJobRoomSlice";

const ProfileDoctor = () => {
  const [data, setData] = useState(null);
  const [localError, setLocalError] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const nav = useNavigate();
  const id = localStorage.getItem("id");

  const { departments, jobs, rooms } = useSelector((state) => state.depJobRoom);

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true);

        // Загружаем справочники
        await Promise.all([
          dispatch(fetchDepartments()),
          dispatch(fetchJobs()),
          dispatch(fetchRooms()),
        ]);

        // Загружаем данные врача
        const res = await fetchWithAuth(`${API_BASE_URL}/en/doctor/${id}/`);
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const doctor = await res.json();
        setData(doctor);
        localStorage.setItem("profile_image", doctor.profile_image);
      } catch (err) {
        setLocalError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, [dispatch, id]);

  if (loading) return <LoadingSkeleton />;
  if (localError)
    return <p className="text-center mt-10 text-red-500">{localError}</p>;
  if (!data) return <p className="text-center mt-10">Нет данных</p>;

  // Получаем названия вместо ID
  const departmentName =
    departments.find((d) => d.id === data.department)?.department_name || "-";
  const jobName = jobs.find((j) => j.id === data.job_title)?.job_title || "-";
  const roomName = rooms.find((r) => r.id === data.room)?.room_number || "-";

  return (
    <div
      style={{
        scrollbarWidth: "none",
      }}
      className="bg-white py-6 p-12 w-[700px] rounded-xl shadow space-y-6 max-w-lg mx-auto border border-gray-200 overflow-y-auto h-[85vh]"
    >
      {/* Аватар */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <img
            src={data.profile_image}
            alt={data.username}
            className="w-26 h-26 rounded-full object-cover border-4 border-[#d7d0f7]"
          />
          <button
            onClick={() => nav(`/doctorEdit/${id}`)}
            className="absolute bottom-1 right-1 bg-[#d7d0f7] text-black p-2 rounded-full shadow-md"
          >
            <FiEdit />
          </button>
        </div>
      </div>

      {/* Инфо */}
      <div className="space-y-4">
        <InfoField label="Имя врача" value={data.username} />
        <InfoField label="Email" value={data.email} />
        <InfoField label="Контакты" value={data.phone} />
        <InfoField label="Отделение" value={departmentName} />
        <InfoField label="Должность" value={jobName} />
        <InfoField label="Комната" value={roomName} />
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

export default ProfileDoctor;
