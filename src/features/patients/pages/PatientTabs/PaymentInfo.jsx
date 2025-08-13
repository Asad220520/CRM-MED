import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit2 } from "lucide-react";
import { FiMoreHorizontal } from "react-icons/fi";

export default function PaymentInfo({ name }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const fetchData = () => {
    if (!name) return;
    setLoading(true);
    setError(null);
    axios
      .get(`http://13.62.101.249/en/patient/${name}/history_of_payment/`)
      .then((res) => setData(res.data))
      .catch(() => setError("Ошибка загрузки данных оплаты"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenId(null); // Закрываем меню при клике вне
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-lg">
        Загрузка оплаты...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500 text-lg space-y-4">
        <div>{error}</div>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Повторить загрузку
        </button>
      </div>
    );
  }

  if (!data || !data.patients || data.patients.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-lg">
        Оплата (пока пусто)
      </div>
    );
  }

  return (
    <div className="py-4 space-y-4 max-h-[360px] overflow-auto ">
      <div className="flex justify-between text-gray-700 font-semibold">
        <div className="px-4 py-2 bg-red-100 text-red-700 rounded-lg shadow font-medium">
          Общая сумма: <span className="font-bold">{data.total_sum} с</span>
        </div>
        <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg shadow font-medium">
          Наличные: <span className="font-bold">{data.cash} с</span>
        </div>
        <div className="px-4 py-2 bg-green-100 text-green -700 rounded-lg shadow font-medium">
          Безналичные: <span className="font-bold">{data.card} с</span>
        </div>
      </div>

      {/* Список оплат */}
      {data.patients.map((item) => (
        <div
          key={item.id}
          className=" rounded-lg pr-3 py-3 mb-2 bg-gray-50 shadow-lg"
        >
          <div className="flex  items-center justify-between text-center gap-4 relative ">
            <div className="flex items-center px-3 py-1 rounded-md shadow text-gray-700 bg-gray-50">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
              <span className="text-gray-500 text-sm font-medium">Отдел: </span>
              <span className="font-medium ml-1">
                {item.department?.department_name}
              </span>
            </div>
            <div className="px-3 py-1 rounded-md shadow text-gray-700 bg-gray-50">
              <span className="text-gray-500 text-sm font-medium">
                Специалист:{" "}
              </span>
              <span className="font-medium">{item.doctor?.username}</span>
            </div>

            <div className="px-3 py-1 rounded-md shadow text-gray-700 bg-gray-50">
              <span className="text-gray-500 text-sm font-medium">
                Услуга:{" "}
              </span>
              <span className="font-medium">{item.service_type?.type}</span>
            </div>
            <div className="px-3 py-1 rounded-md shadow text-gray-700 bg-gray-50">
              <span className="text-gray-500 text-sm font-medium">
                Дата создания:{" "}
              </span>
              <span>{formatDate(item.appointment_date)}</span>
            </div>
            <div className="px-3 py-1 rounded-md shadow text-gray-700 bg-gray-50">
              <span className="text-gray-500 text-sm font-medium">
                Тип оплаты:
              </span>{" "}
              <span className="font-medium">{item.payment_type_display}</span>
            </div>
            <div className="px-3 py-1 rounded-md shadow text-gray-700 bg-gray-50">
              <span className="text-gray-500 text-sm font-medium">Сумма:</span>{" "}
              <span className="font-medium"> {item.price}</span>
            </div>
            <button
              onClick={() =>
                setMenuOpenId(menuOpenId === item.id ? null : item.id)
              }
              className="text-gray-400 hover:text-gray-600"
            >
              <FiMoreHorizontal size={18} />
            </button>

            {menuOpenId === item.id && (
              <div
                ref={menuRef}
                className="absolute right-3 w-[200px] top-12 w-36 bg-white rounded hover:bg-gray-100 shadow-xl  px-8  z-10"
              >
                <button
                  onClick={() => {
                    navigate(`/editPasient/${item.id}`);
                    setMenuOpenId(null);
                  }}
                  className=" flex items-center  gap-2 text-left  py-2 "
                >
                  <span>
                    <Edit2 size={18} />
                  </span>
                  Редактировать
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
