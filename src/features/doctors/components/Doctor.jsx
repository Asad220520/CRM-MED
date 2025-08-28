import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../../../config/api";
import LoadingSkeleton from "../../../components/ui/LoadingSkeleton";
import Button from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";

const Doctor = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nav = useNavigate();
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(`${API_BASE_URL}/ru/doctor/notification/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="bg-white h-[85vh] py-6 px-6 rounded-xl shadow space-y-6 shadow-[1px_1px_6px_2px_rgba(128,128,128,0.5)]">
      <h2 className="text-2xl font-bold mb-5 text-gray-800">Уведомления</h2>

      {error && <p className="text-red-500">{error}</p>}
      {!error && notifications.length === 0 && (
        <p className="text-gray-500 text-lg">Нет уведомлений.</p>
      )}

      <div className="space-y-4">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center gap-3"
          >
            <div className="space-y-1">
              <p className="font-semibold text-gray-700">
                Запись на{" "}
                <span className="text-blue-600">{notif.appointment_date}</span>{" "}
                -{" "}
                <span className="text-gray-600">
                  {notif.department.department_name}
                </span>
              </p>
              <p className="text-gray-600">Пациент: {notif.name}</p>
              <p className="text-gray-600">
                Регистратор: {notif.registrar.username}
              </p>
            </div>
            <div className="mt-2 md:mt-0">
              <Button
                onClick={() => nav(`/editPasient/${notif.id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Посмотреть в календаре
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctor;
