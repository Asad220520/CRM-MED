/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFilter, fetchReport } from "../../../redux/reportSlice";
import {
  fetchDoctors,
  setSelectedDepartment,
} from "../../../redux/doctorsSlice";
import Select from "../../../components/ui/Select";
import Calendar from "../../../components/ui/Calendar";
import LoadingSkeleton from "../../../components/ui/LoadingSkeleton";
import { downloadExcel } from "../../../redux/excelReport";
import Button from "../../../components/ui/Button";

const ReportExact = () => {
  const dispatch = useDispatch();
  const { filteredDoctors: doctorsList = [], departments = [] } = useSelector(
    (state) => state.doctors
  );
  const { filters, appointments, totals, loading, error } = useSelector(
    (state) => state.report
  );
  const excelLoading = useSelector((state) => state.excel.loading);

  // Форматируем валюту
  const formatCurrency = (amount) =>
    `${amount?.toLocaleString("ru-RU") || 0} с`;

  // Форматируем дату
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, yearAndTime] = dateStr.split("-");
    const [year, time] = yearAndTime.split(" ");
    return new Date(`${year}-${month}-${day}T${time}:00`).toLocaleDateString(
      "ru-RU"
    );
  };
  const handleDownloadExact = () => {
    dispatch(
      downloadExcel({
        endpoint: "/en/report/exact/",
        paramsObj: {
          doctor: filters.doctor || "",
          department: filters.department || "",
          date: filters.date || "",
          export: "excel",
          filename: "exact.xlsx",
        },
      })
    );
  };
  // Загружаем всех докторов один раз при монтировании
  useEffect(() => {
    dispatch(fetchDoctors());
  }, []);

  // Загружаем отчёт при изменении фильтров
  useEffect(() => {
    dispatch(fetchReport(filters));
  }, [filters]);

  // Выбранный врач и отделение
  const selectedDoctor = doctorsList.find(
    (d) => filters.doctor && d.id.toString() === filters.doctor.toString()
  );
  const selectedDepartment = departments.find(
    (d) =>
      filters.department && d.id.toString() === filters.department.toString()
  );

  // Фильтруем врачей по выбранному отделению
  const filteredDoctorsList = useMemo(() => {
    if (!filters.department) return doctorsList;
    return doctorsList.filter(
      (d) => d.department.id?.toString() === filters.department.toString()
    );
  }, [doctorsList, filters.department]);

  // Обработчик изменения фильтров
  const handleFilterChange = (key, value) => {
    dispatch(setFilter({ key, value }));

    if (key === "department") {
      dispatch(setSelectedDepartment(value || null));
      dispatch(setFilter({ key: "doctor", value: "" })); // сброс выбранного врача
    }
  };

  if (loading || excelLoading) return <LoadingSkeleton />;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Фильтры */}
      <div className="flex items-center space-x-4">
        <Select
          value={filters.department}
          onChange={(e) => handleFilterChange("department", e.target.value)}
          searchable={true}
          options={departments.map((d) => ({
            value: d.id,
            label: d.department_name,
          }))}
          allOptionLabel="Все отделения"
        />

        <Select
          value={filters.doctor}
          onChange={(e) => handleFilterChange("doctor", e.target.value)}
          searchable={true}
          options={filteredDoctorsList.map((d) => ({
            value: d.id,
            label: d.username || `Врач ${d.id}`,
          }))}
          allOptionLabel="Все врачи"
        />

        <Calendar
          filters={filters}
          handleFilterChange={handleFilterChange}
          mode="filter"
        />
        <Button
          onClick={handleDownloadExact}
          variant="excel"
          size="md"
          loading={excelLoading}
        >
          Скачать Excel
        </Button>
      </div>

      {/* Заголовок */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-medium">
            {selectedDoctor?.username || "Все врачи"}
          </h3>
          <span className="text-blue-600 text-xl">
            {selectedDepartment?.department_name || "Все отделения"}
          </span>
        </div>
        <span className="text-gray-500 text-xl">Подробный отчет по врачам</span>
      </div>

      {/* Контент */}
      {loading ? (
        <div className="p-6">Загрузка данных...</div>
      ) : error ? (
        <div className="p-6 text-red-500">{error}</div>
      ) : (
        <div
          className="overflow-x-auto overflow-y-auto h-[360px] scrollbar scrollbar-thumb-blue-500 scrollbar-track-gray-100"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <table className="w-full">
            <thead className="bg-[#f0f0ff] border-b border-gray-200 sticky top-0 ">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  №
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Пациент
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Услуга
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тип
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Цена
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Со скидкой
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Врачу
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((a, i) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {i + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(a.appointment_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {a.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {a.service_type?.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm text-gray-900`}>
                      {a.payment_type_display === "Cash"
                        ? "Наличные"
                        : "Безналичный"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(a.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {a.discount_price !== "-"
                      ? formatCurrency(a.discount_price)
                      : formatCurrency(a.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {a.doctor?.bonus || 10}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Итоговая строка */}
          <div className="bg-[#f0f0ff] sticky bottom-0  border-t border-gray-200">
            <div className="px-6 py-4 flex justify-between font-medium text-gray-900">
              <span>Итого:</span>
              <div className="flex space-x-10 text-right">
                <div>{formatCurrency(totals.totalAmount)}</div>
                <div>
                  {formatCurrency(totals.totalAmount - totals.discountAmount)}
                </div>
                <div>{formatCurrency(totals.doctorEarnings)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Нижняя статистика */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center space-x-8">
        <div>
          <span className="text-red-600 text-xl">Все записи:</span>
          <span className="ml-2 font-medium">{totals.totalRecords}</span>
        </div>
        <div>
          <span className="text-red-600 text-xl">Общая сумма:</span>
          <span className="ml-2 font-medium">
            {formatCurrency(totals.totalAmount)}
          </span>
        </div>
        <div className="flex space-x-4 text-gray-600">
          <div>
            <span className="text-xl">Наличные:</span>
            <span className="ml-1">{formatCurrency(totals.cashAmount)}</span>
          </div>
          <div>
            <span className="text-xl">Безналичные:</span>
            <span className="ml-1">{formatCurrency(totals.cardAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportExact;
