import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../../../../config/api";

export default function PatientData({ patientId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!patientId) return;

    axios
      .get(`${API_BASE_URL}/en/patient/${patientId}/info/`)
      .then((res) => {
        setData(res.data);
        setError(null);
      })
      .catch(() => setError("Ошибка загрузки данных пациента"))
      .finally(() => setLoading(false));
  }, [patientId]);
  console.log(data);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-lg">
        Загрузка данных пациента...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-64 text-red-500 text-lg">
        {error}
      </div>
    );

  if (!data)
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-lg">
        Данные пациента отсутствуют
      </div>
    );

  return (
    <div className="w-full mx-auto bg-white p-6 rounded shadow space-y-4">
      <div className="flex justify-between">
        <span className="font-[500] text-[18px] text-gray-500 ">ФИО: </span>
        <span className="font-medium text-[19px]">{data.name}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-[500] text-[18px] text-gray-500">
          Телефон номер:{" "}
        </span>
        <span className="font-medium text-[19px]">{data.phone}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-[500] text-[18px] text-gray-500">Пол: </span>
        <span className="font-medium text-[19px]">
          {data.gender_display === "Male" ? "Мужской" : "Женский"}
        </span>
      </div>
      <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-lg space-y-4">
        {data.info}
      </div>
    </div>
  );
}
