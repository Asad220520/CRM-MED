/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../../../../config/api';

const ReportDoctor = ({ selectedDoctor = 'Елена Ивановна' }) => {
  const [cabinetData, setCabinetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  // Получаем данные по врачам из API
  const fetchCabinetData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(`${API_BASE_URL}/en/report/doctor/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      if (data.results && Array.isArray(data.results)) {
        // Фильтруем по выбранному врачу если нужно
        const filteredResults = selectedDoctor && selectedDoctor === 'Все врачи'
          ? data.results.filter(r => r.name === selectedDoctor)
          : data.results;
          
        setCabinetData(filteredResults);
        
        // Подсчитываем общую сумму
        const total = filteredResults.reduce((sum, item) => sum + (item.price || 0), 0);
        setTotalAmount(total);
      }
    } catch (error) {
      console.error('Ошибка загрузки отчета по кабинетам:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCabinetData();
  }, [selectedDoctor]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const formatCurrency = (amount) => {
    return `${amount?.toLocaleString('ru-RU') || 0} с`;
  };
console.log(cabinetData, "sdsadsd");

  if (loading) {
    return (
      <div className="bg-white p-6">
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-600">Загрузка данных...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="px-6">
        <div className="mb-4 mt-4">
          <h2 className="text-lg font-medium">
            {selectedDoctor} (кабинет 9)
          </h2>
          <div className="text-sm text-gray-500 mt-1">
            Процент врачам
          </div>
        </div>

        {/* Таблица */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600 border-b">
                <th className="pb-3 font-medium">№</th>
                <th className="pb-3 font-medium">Дата</th>
                <th className="pb-3 font-medium">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {cabinetData.map((item, index) => (
                <tr key={item.id} className="text-sm border-b border-gray-100">
                  <td className="py-3">{index + 1}</td>
                  <td className="py-3">{formatDate(item.appointment_date)}</td>
                  <td className="py-3">{formatCurrency(item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {cabinetData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Нет данных для отображения
          </div>
        )}

        {/* Итоги */}
        <div className="mt-6 py-4 border-t bg-blue-50 rounded-lg px-4">
          <div className="flex justify-between items-center">
            <div className="font-medium">Итого:</div>
            <div className="font-medium">{formatCurrency(totalAmount)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDoctor;