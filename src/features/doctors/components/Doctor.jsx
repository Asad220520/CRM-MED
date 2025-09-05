import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchNotifications } from "../../../redux/notificationsSlice"; // проверь путь

import LoadingSkeleton from "../../../components/ui/LoadingSkeleton"; // проверь путь
import Button from "../../../components/ui/Button"; // проверь путь

const Doctor = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const {
    items: notifications,
    loading,
    error,
  } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="bg-white h-[85vh] py-6 px-6 rounded-xl shadow space-y-6 shadow-[1px_1px_6px_2px_rgba(128,128,128,0.5)]">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-5 text-gray-800">Уведомления</h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => dispatch(fetchNotifications())}
            className="bg-gray-100 text-gray-700 border border-gray-300"
          >
            Обновить
          </Button>
          <Button
            onClick={() => nav(-1)}
            className="bg-gray-100 text-gray-700 border border-gray-300"
          >
            Назад
          </Button>
        </div>
      </div>

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
                  {notif?.department?.department_name}
                </span>
              </p>
              <p className="text-gray-600">Пациент: {notif.name}</p>
              <p className="text-gray-600">
                Регистратор: {notif?.registrar?.username}
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
