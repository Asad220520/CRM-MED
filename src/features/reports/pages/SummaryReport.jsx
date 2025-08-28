/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../../../config/api";
import LoadingSkeleton from "../../../components/ui/LoadingSkeleton";
import Calendar from "../../../components/ui/Calendar";
import Button from "../../../components/ui/Button";
import { useDispatch } from "react-redux";
import { downloadExcel } from "../../../redux/excelReport";
import { useSelector } from "react-redux";

// Компонент карточки для каждой метрики
const SummaryCard = ({ title, value, large }) => (
  <div className="p-2 w-full sm:w-52 h-30 flex justify-center flex-col border border-gray-200 rounded-lg shadow-sm">
    <div className="text-[16px] text-gray-600 mb-1">{title}</div>
    <div className={`font-bold ${large ? "text-2xl" : "text-xl"}`}>
      {value ? `${value.toLocaleString("ru-RU")} c` : "0 c"}
    </div>
  </div>
);

const SummaryReport = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const dispatch = useDispatch();
  const excelLoading = useSelector((state) => state.excel.loading);
  const fetchSummaryData = async (all = false) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("access");
      const params = new URLSearchParams();

      if (!all) {
        if (!dateFrom || !dateTo) return;
        params.append("date_from", dateFrom);
        params.append("date_to", dateTo);
      }

      const response = await fetch(
        `${API_BASE_URL}/en/report/summary/?${params.toString()}`,
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
      setSummaryData(data);
    } catch (err) {
      console.error("Ошибка загрузки сводного отчета:", err);
      setError("Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  };
  const handleDownloadSummary = () => {
    dispatch(
      downloadExcel({
        endpoint: "/en/report/summary/",
        paramsObj: {
          date_from: dateFrom,
          date_to: dateTo,
          export: "excel",
          filename: "summary.xlsx",
        },
      })
    );
  };

  useEffect(() => {
    if (dateFrom && dateTo) fetchSummaryData();
  }, [dateFrom, dateTo]);

  if (loading || excelLoading) return <LoadingSkeleton />;

  return (
    <div className="bg-white p-4">
      {/* Календарь для выбора диапазона */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-xl text-gray-600">От:</label>
          <Calendar
            filters={{ date: dateFrom }}
            handleFilterChange={(key, value) => setDateFrom(value)}
            mode="filter"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="text-xl text-gray-600">До:</label>
          <Calendar
            filters={{ date: dateTo }}
            handleFilterChange={(key, value) => setDateTo(value)}
            mode="filter"
          />
        </div>

        {/* Кнопка показать все данные */}
        <Button onClick={() => fetchSummaryData(true)}>
          Показать все данные
        </Button>
        <Button
          onClick={handleDownloadSummary}
          variant="excel"
          size="md"
          loading={excelLoading}
        >
          Скачать Excel
        </Button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {!summaryData ? (
        <div className="p-2 py-4 text-gray-500">Нет данных для отображения</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <SummaryCard
            title="Оплачено наличными"
            value={summaryData.total_cash}
          />
          <SummaryCard title="Врачам" value={summaryData.doctor_cash} />
          <SummaryCard
            title="Оплачено безналичными"
            value={summaryData.total_card}
          />
          <SummaryCard title="Врачам безнал" value={summaryData.doctor_card} />
          <SummaryCard
            title="Общая сумма услуг"
            value={summaryData.total_clinic}
          />
          <SummaryCard
            title="Сумма клинике наличные"
            value={summaryData.clinic_cash}
          />
          <SummaryCard
            title="Сумма клинике безнал"
            value={summaryData.clinic_card}
          />
          <SummaryCard
            title="Общий итог врачей"
            value={summaryData.total_doctor}
            large
          />
        </div>
      )}
    </div>
  );
};
export default SummaryReport;
