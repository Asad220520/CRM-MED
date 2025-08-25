import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const months = [
  "Январь","Февраль","Март","Апрель","Май","Июнь",
  "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"
];
const weekdays = ["ПН","ВТ","СР","ЧТ","ПТ","СБ","ВС"];

export default function CalendarFilter({
  filters = {},
  handleFilterChange = () => {},
  mode = "filter", // "filter" или "booking"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(parseDate(filters.date));
  const [calendarPosition, setCalendarPosition] = useState("bottom"); // "bottom" или "top"
  const calendarRef = useRef(null);
  const inputRef = useRef(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function parseDate(dateStr) {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split("-");
    return new Date(year, parseInt(month) - 1, day);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handlePosition = () => {
      if (!inputRef.current) return;
      const rect = inputRef.current.getBoundingClientRect();
      const calendarHeight = 300; // примерная высота календаря
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < calendarHeight && spaceAbove > calendarHeight) {
        setCalendarPosition("top");
      } else {
        setCalendarPosition("bottom");
      }
    };

    handlePosition();
    window.addEventListener("resize", handlePosition);
    window.addEventListener("scroll", handlePosition, true);
    return () => {
      window.removeEventListener("resize", handlePosition);
      window.removeEventListener("scroll", handlePosition, true);
    };
  }, [isOpen]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    let firstDayOfWeek = firstDay.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let day = 1; day <= lastDay.getDate(); day++)
      days.push(new Date(year, month, day));
    return days;
  };

  const formatDisplayDate = (date) =>
    date
      ? `${date.getDate().toString().padStart(2, "0")}.${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}.${date.getFullYear()}`
      : "";

  const isSameDate = (date1, date2) =>
    date1 && date2 && date1.toDateString() === date2.toDateString();

  const isDateSelectable = (date) => {
    if (!date) return false;
    if (mode === "filter") return date <= today;
    if (mode === "booking") return date > today;
    return true;
  };

  const handleDateSelect = (date) => {
    if (!date || !isDateSelectable(date)) return;
    setSelectedDate(date);
    setIsOpen(false);
    const formatted = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    handleFilterChange("date", formatted);
  };

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="relative" ref={calendarRef}>
      <input
        type="text"
        ref={inputRef}
        value={formatDisplayDate(selectedDate)}
        onClick={() => setIsOpen(!isOpen)}
        readOnly
        placeholder="Выберите дату"
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
      />

      {isOpen && (
        <div
          className={`absolute left-0 z-30 bg-white border border-gray-300 rounded-md shadow-lg p-4 min-w-[320px] ${
            calendarPosition === "top" ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {/* Header: месяц, год, навигация */}
          <div className="flex items-center justify-between mb-4 gap-2">
            <select
              value={currentDate.getMonth()}
              onChange={(e) =>
                setCurrentDate(
                  new Date(currentDate.getFullYear(), parseInt(e.target.value), 1)
                )
              }
              className="border px-2 py-1 rounded"
            >
              {months.map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={currentDate.getFullYear()}
              onChange={(e) => {
                const year = parseInt(e.target.value);
                if (!isNaN(year))
                  setCurrentDate(new Date(year, currentDate.getMonth(), 1));
              }}
              min={1900}
              max={2100}
              className="w-20 border outline-none rounded  px-2 py-1 text-sm focus:outline-none"
            />

            <button onClick={() => navigateMonth(-1)} className="p-1 hover:bg-gray-100 rounded-sm">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => navigateMonth(1)} className="p-1 hover:bg-gray-100 rounded-sm">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdays.map((day) => (
              <div key={day} className="text-center text-xs text-gray-500 p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, idx) => {
              const disabled = !isDateSelectable(date);
              return (
                <div
                  key={idx}
                  onClick={() => handleDateSelect(date)}
                  className={`text-center p-2 text-sm rounded-full transition-colors
                    ${!date ? "invisible" : ""}
                    ${disabled ? "text-gray-300 cursor-not-allowed" : "cursor-pointer hover:bg-gray-100"}
                    ${isSameDate(date, selectedDate) ? "bg-blue-500 text-white font-semibold" : ""}
                    ${date && !disabled && date.toDateString() === today.toDateString() ? "bg-blue-100 text-blue-800" : ""}
                  `}
                >
                  {date ? date.getDate() : ""}
                </div>
              );
            })}
          </div>

          {/* Clear button */}
          {selectedDate && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <button
                onClick={() => {
                  setSelectedDate(null);
                  setIsOpen(false);
                  handleFilterChange("date", "");
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Очистить выбор
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
