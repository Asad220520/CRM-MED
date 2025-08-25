import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../../../config/api";

const Doctor = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="p-5  mx-auto">
      <h2 className="text-2xl font-bold mb-5">Уведомления</h2>

      {loading && <p>Загрузка...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && notifications.length === 0 && <p>Нет уведомлений.</p>}

      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="border-b border-gray-200 py-3 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">
              Запись на {notif.appointment_date} - {notif.department.department_name}
            </p>
            <p>Пациент: {notif.name}</p>
            <p>Регистратор: {notif.registrar.username}</p>
          </div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() => alert(`Открыть календарь для ${notif.name}`)}
          >
            Посмотреть в календаре
          </button>
        </div>
      ))}
    </div>
  );
};

export default Doctor;
