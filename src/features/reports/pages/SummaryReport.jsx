import React, { useEffect, useState } from 'react';

const SummaryReport = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Получаем сводные данные из API
  const fetchSummaryData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access");
      const response = await fetch('http://13.62.101.249/en/report/summary/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setSummaryData(data);
    } catch (error) {
      console.error('Ошибка загрузки сводного отчета:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const formatNumber = (num) => {
    return num?.toLocaleString('ru-RU') || '0';
  };

  if (loading) {
    return (
      <div className="bg-white p-6">
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-600">Загрузка данных...</div>
        </div>
      </div>
    );
  }

  if (!summaryData) {
    return (
      <div className="bg-white p-6">
        <div className="text-center py-8 text-gray-500">
          Нет данных для отображения
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="px-6 py-6">
        {/* Основные метрики */}
        <div className="grid grid-cols-5 gap-6 mb-8">
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">Оплачено наличными</div>
            <div className="font-bold text-lg">{formatNumber(summaryData.total_cash)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">Врачам</div>
            <div className="font-bold text-lg">{formatNumber(summaryData.doctor_cash)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">Оплачено безналичными</div>
            <div className="font-bold text-lg">{formatNumber(summaryData.total_card)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">Врачам безнал</div>
            <div className="font-bold text-lg">{formatNumber(summaryData.doctor_card)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">Общая сумма услуг</div>
            <div className="font-bold text-lg">{formatNumber(summaryData.total_clinic)}</div>
          </div>
        </div>

        {/* Суммы клинике */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">Сумма клинике наличные</div>
            <div className="font-bold text-lg">{formatNumber(summaryData.clinic_cash)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">Сумма клинике безнал</div>
            <div className="font-bold text-lg">{formatNumber(summaryData.clinic_card)}</div>
          </div>
        </div>

        {/* Общий итог врачей */}
        <div className="text-center">
          <div className="font-bold text-2xl">
            {formatNumber(summaryData.total_doctor)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryReport;