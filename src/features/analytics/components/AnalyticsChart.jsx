import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Select from "../../../components/ui/Select";
const formatDateForChart = (dateString) => {
  if (!dateString) return "";
  const [day, month, yearAndTime] = dateString.split("-"); // ["15","08","2025 15:36"]
  const [year, time] = yearAndTime.split(" "); // ["2025","15:36"]
  const isoString = `${year}-${month}-${day}T${time}`; // "2025-08-15T15:36"
  const date = new Date(isoString);
  if (isNaN(date)) return dateString;
  return date.toLocaleDateString("ru-RU", { month: "short", day: "numeric" }); // Фев 15
};

const AnalyticsChart = ({
  data = [],
  totalPatients = 0,
  newPercent = 0,
  repeatedPercent = 0,
  period,
  onPeriodChange,
}) => {
  const processedData = data.map((item) => ({
    ...item,
    rawDate: item.appointment_date,
    displayDate: formatDateForChart(item.appointment_date),
    appointments: item.had_an_appointment || 0,
    canceled: item.canceled || 0,
  }));

  return (
    <div className="bg-white   rounded-2xl border border-gray-200 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-[500] text-gray-800">
          Статистика записи на прием
        </h1>
        {/* Селектор периода */}
        <Select
          options={[
            { value: "weekly", label: "еженедельно" },
            { value: "monthly", label: "ежемесячно" },
            { value: "yearly", label: "ежегодно" },
          ]}
          value={period}
          onChange={(e) => onPeriodChange(e.target.value)}
          placeholder="Выберите период"
        />
      </div>
      <div className="flex flex-row gap-8">
        <div className="w-[400px] mb-8">
          {/* Статистика */}
          <div className=" flex flex-col gap-10 items-start  ">
            <div className="text-2xl font-bold text-gray-800 ">
              <div className="text-[#616161] text-lg">
                За {period === "weekly" ? "Неделю" : "Месяц"}
              </div>
              {totalPatients.toLocaleString()}{" "}
              <span className=" text-[#616161] text-lg">пациентов</span>
            </div>

            <div className=" text-sm mb-6">
              <div className="flex items-center  gap-2 w-[300px] border border-gray-200 p-2 bg-[#f5f5fb] rounded-lg">
                <span className="font-semibold text-xl">{newPercent}%</span>
                <span className="text-[#616161] text-1xl">
                  первичные пациенты
                </span>
              </div>
              <div className="flex items-center mt-6 gap-2 w-[300px] border border-gray-200 p-2 bg-[#f5f5fb] rounded-lg">
                <span className="font-semibold text-xl">
                  {repeatedPercent}%
                </span>
                <span className="text-[#616161] text-1xl">
                  повторные пациенты
                </span>
              </div>
            </div>

            {/* Легенда */}
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500"></div>
                <span className="text-[#7b7b7b] text-1xl">Все записи</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-orange-400"></div>
                <span className="text-[#7b7b7b] text-1xl">
                  Отменённые записи
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* График */}
        {processedData.length > 0 ? (
          <div className="w-full  h-80 ">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={processedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="9"
                  stroke="#e5e7eb"
                  strokeWidth={2}
                  vertical={false}
                  horizontal={true}
                />
                <XAxis
                  dataKey="rawDate"
                  tick={{ fontSize: 14, fill: "#9CA3AF" }}
                  tickFormatter={(str) =>
                    processedData.find((d) => d.rawDate === str)?.displayDate ||
                    str
                  }
                  tickMargin={20}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 14, fill: "#9CA3AF" }}
                  tickFormatter={(value) => `${value}k`}
                  tickMargin={20}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelFormatter={(label) => {
                    // label = rawDate, например "15-08-2025 15:36"
                    if (!label) return "";
                    const [datePart, timePart] = label.split(" "); // ["15-08-2025", "15:36"]
                    const [day, month] = datePart.split("-");
                    const monthNames = [
                      "янв",
                      "фев",
                      "мар",
                      "апр",
                      "май",
                      "июн",
                      "июл",
                      "авг",
                      "сен",
                      "окт",
                      "ноя",
                      "дек",
                    ];
                    const monthName = monthNames[parseInt(month, 10) - 1];
                    return `${monthName} ${day} ${timePart}`;
                  }}
                  formatter={(value, name) => [
                    value,
                    name === "appointments"
                      ? "Все записи"
                      : "Отменённые записи",
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="appointments"
                  stroke="rgba(127, 126, 224, 1)"
                  strokeWidth={3}
                  name="Все записи"
                  dot={false}
                  activeDot={{ r: 6, fill: "rgba(127, 126, 224, 1)" }}
                />
                <Line
                  type="monotone"
                  dataKey="canceled"
                  stroke="rgba(255, 166, 78, 1)"
                  strokeWidth={3}
                  name="Отменённые записи"
                  dot={false}
                  activeDot={{ r: 6, fill: "rgba(255, 166, 78, 1)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">📈</div>
              <div className="text-lg">Нет данных для отображения</div>
              <div className="text-sm mt-2">
                Данные появятся после первых записей на приём
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsChart;
