import React, { useEffect, useState } from "react";
import fetchWithAuth from "../../auth/fetchWithAuth";
import API_BASE_URL from "../../../../config/api";
import { FaChevronRight, FaChevronUp } from "react-icons/fa";

const PriceListPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetchWithAuth(
          `${API_BASE_URL}/en/department_service/`
        );
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const data = await res.json();
        setData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p className="text-red-600">Ошибка: {error}</p>;

  return (
    <div
      style={{
        scrollbarWidth: "none",
      }}
      className="bg-white h-[85vh] pb-6 px-6 rounded-xl shadow-[1px_1px_6px_2px_rgba(128,128,128,0.5)] space-y-6 overflow-y-auto"
    >
      <h1 className="text-2xl font-semibold p-4 mb-6 text-[#267cdc] sticky top-0 bg-white">
        Прайс-лист услуг
      </h1>

      {data.map((department) => {
        const isActive = expanded === department.id;
        return (
          <div key={department.id} className="mb-4  p-2 rounded shadow-sm">
            {/* Название отделения с активным цветом */}
            <button
              className={`w-full flex justify-start gap-4 items-center px-4 pb-2 font-bold text-left 
                `}
              onClick={() => setExpanded(isActive ? null : department.id)}
            >
              <span
                className={` text-xl ${
                  isActive ? "text-blue-800" : "text-gray-500"
                }`}
              >
                {isActive ? <FaChevronUp /> : <FaChevronRight />}
              </span>
              <span className="text-xl font-[400]">
                {department.department_name}
              </span>
            </button>

            {/* Список услуг */}
            {isActive && (
              <ul className="list-disc pl-8 py-2 bg-white">
                {department.department_services.map((service) => (
                  <li
                    className="flex justify-between gap-4 items-center py-2"
                    key={service.id}
                  >
                    <span className=" text-xl text-gray-700 font-[300]">
                      {service.type.charAt(0).toUpperCase() +
                        service.type.slice(1).toLowerCase()}
                    </span>{" "}
                    <span className=" text-xl font-[300]">
                      {service.price} сом
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PriceListPage;
