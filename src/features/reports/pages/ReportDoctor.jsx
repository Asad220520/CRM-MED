/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDoctors } from "../../../redux/doctorsSlice";
import Select from "../../../components/ui/Select";
import Calendar from "../../../components/ui/Calendar";
import API_BASE_URL from "../../../../config/api";
import LoadingSkeleton from "../../../components/ui/LoadingSkeleton";
import { downloadExcel } from "../../../redux/excelReport";
import Button from "../../../components/ui/Button";

const ReportDoctor = () => {
  const dispatch = useDispatch();
  const doctorsList = useSelector((state) => state.doctors.doctors);
  const [cabinetData, setCabinetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const excelLoading = useSelector((state) => state.excel.loading);
  
  // Загружаем список врачей
  useEffect(() => {
    dispatch(fetchDoctors());
  }, []);

  // Функция получения отчёта с фильтрацией
  const fetchCabinetData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access");
      const params = new URLSearchParams();
      if (selectedDoctor) params.append("doctor", selectedDoctor);
      if (selectedDate) params.append("date", selectedDate);

      const response = await fetch(
        `${API_BASE_URL}/en/report/doctor/?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      const results = data.results || [];
      setCabinetData(results);
      setTotalAmount(data.total_price);
    } catch (err) {
      console.error("Ошибка загрузки отчета:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDoctor = () => {
    dispatch(
      downloadExcel({
        endpoint: "/en/report/doctor/",
        paramsObj: {
          doctor: selectedDoctor || "",
          date: selectedDate || "",
          export: "excel",
          filename: "doctor.xlsx",
        },
      })
    );
  };
  useEffect(() => {
    fetchCabinetData();
  }, [selectedDoctor, selectedDate]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, yearAndTime] = dateStr.split("-");
    const [year, time] = yearAndTime.split(" ");
    return new Date(`${year}-${month}-${day}T${time}:00`).toLocaleDateString(
      "ru-RU"
    );
  };

  const formatCurrency = (amount) =>
    `${amount?.toLocaleString("ru-RU") || 0} с`;

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="bg-white p-6">
      {/* Фильтры */}
      <div className="flex gap-4 mb-4">
        <Select
          value={selectedDoctor ?? ""}
          onChange={(e) =>
            setSelectedDoctor(e.target.value === "" ? null : e.target.value)
          }
          options={doctorsList.map((d) => ({ value: d.id, label: d.username }))}
          searchable={true}
          allOptionLabel="Все врачи"
        />
        <Calendar
          filters={{ date: selectedDate }}
          handleFilterChange={(key, value) => setSelectedDate(value)}
          mode="filter"
        />
        <Button
          onClick={handleDownloadDoctor}
          variant="excel"
          size="md"
          loading={excelLoading}
        >
          Скачать Excel
        </Button>
      </div>
      <div className="flex justify-between items-center ">
        <h1 className=" ml-2 text-xl text-gray-800 font-bold mb-4">
          {selectedDoctor === null
            ? "Все врачи"
            : doctorsList
                .find((d) => d.id.toString() === selectedDoctor.toString())
                ?.username.toUpperCase() || ""}
        </h1>
        <span className="text-gray-500 text-lg">Процент врачам</span>
      </div>

      {/* Таблица */}
      <div className="overflow-x-auto overflow-y-auto h-[400px] scrollbar scrollbar-thumb-blue-500 scrollbar-track-gray-100">
        <table className="w-full">
          <thead className="bg-[#f0f0ff] border-b border-gray-200 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
                №
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
                Дата
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
                Пациент
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
                Сумма
              </th>
            </tr>
          </thead>
          <tbody>
            {cabinetData.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  Нет данных для отображения
                </td>
              </tr>
            )}
            {cabinetData.map((item, index) => (
              <tr
                key={item.id}
                className="text-sm hover:bg-gray-50 border-b border-gray-100"
              >
                <td className="px-6 py-4 text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 text-gray-500">
                  {formatDate(item.appointment_date)}
                </td>
                <td className="px-6 py-4 text-gray-900">{item.name}</td>
                <td className="px-6 py-4 text-gray-900">
                  {formatCurrency(item.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Итоги */}
      <div className="mt-6 py-4 border-t bg-blue-50 rounded-lg px-4 flex justify-between font-bold text-gray-700">
        <span>Итого:</span>
        <span>{formatCurrency(totalAmount)}</span>
      </div>
    </div>
  );
};

export default ReportDoctor;
