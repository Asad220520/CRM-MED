import React, { useEffect, useState } from "react";
import axios from "axios";
import CountUp from "react-countup";
import { TrendingUp, TrendingDown, PieChart } from "lucide-react";
import API_BASE_URL from "../../../../config/api";
import AnalyticsChart from "../components/AnalyticsChart";
import LoadingSkeleton from "../../../components/ui/LoadingSkeleton";

// Компонент карточки статистики
const StatCard = ({
  // eslint-disable-next-line no-unused-vars
  icon: Icon,
  title,
  item,
  value,
  minus,
  iconColor,
}) => (
  <div className="border  border-gray-200 flex gap-6  items-center rounded-2xl p-6 h-30 shadow-sm">
    <div className="">
      <div
        className={`${iconColor
          .replace("text-", "bg-")
          .replace("-600", "-100")
          .replace("-500", "-100")} p-4 rounded-lg`}
      >
        <Icon size={40} className={iconColor} />
      </div>
    </div>
    <div className="text-4xl font-medium text-gray-900">
      <div className="text-gray-400  font-medium text-lg mb-1">{title}</div>
      {minus}
      <CountUp start={0} end={value || 0} duration={2.5} />
      {item}
    </div>
  </div>
);

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("weekly"); // default period

  const getAnalyticsData = async (selectedPeriod = "weekly") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access");
      const res = await axios.get(
        `${API_BASE_URL}/en/analysis/?period=${selectedPeriod}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      setAnalytics(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Ошибка загрузки данных"
      );
      console.error("❌ Ошибка загрузки аналитики:", err);
    } finally {
      setLoading(false);
    }
  };
  console.log(analytics);

  // При первой загрузке и при смене периода
  useEffect(() => {
    getAnalyticsData(period);
  }, [period]);

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen font-sans">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">❌ Ошибка: {error}</p>
          <button
            onClick={() => getAnalyticsData(period)}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Повторить
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center font-sans">
        <div className="text-lg text-gray-500">Нет данных</div>
      </div>
    );
  }

  return (
    <div className="f">
      {/* KPI карточки */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={TrendingUp}
          title="Рост"
          item={"%"}
          value={analytics.rise}
          iconColor="text-green-600"
        />
        <StatCard
          icon={TrendingDown}
          title="Падения"
          item={"%"}
          minus={"-"}
          value={analytics.fall}
          iconColor="text-red-500"
        />
        <StatCard
          icon={PieChart}
          title="Врачей"
          value={analytics.total_doctors}
          iconColor="text-blue-600"
        />
      </div>

      {/* График */}
      <AnalyticsChart
        data={analytics.chart || []} // chart data
        totalPatients={analytics.total_patients || 0}
        newPercent={analytics.new_percent || 0}
        repeatedPercent={analytics.repeated_percent || 0}
        period={period} // текущий период
        onPeriodChange={setPeriod} // передача функции для переключения
      />
    </div>
  );
};

export default AnalyticsPage;
