import { useNavigate, useLocation, useParams } from "react-router-dom";
import { FiArrowLeft, FiBell } from "react-icons/fi";
import { getCurrentUserRole } from "../lib/auth";
import { ROLES } from "../lib/roles";
import { useState } from "react";

function Header() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const location = useLocation();
  const { id } = useParams();
  const userRole = getCurrentUserRole();
  const isAdmin = userRole !== ROLES.ADMIN;
  const isReceptionist = userRole == ROLES.RECEPTIONIST;

  // Мапа маршрутов и заголовков
  const routeTitles = {
    "/home": "Записи клиентов",
    "/calendar": "Календарь",
    "/doctor-records": "Записи врачей",
    "/doctor-appointments": "Список врачей",
    "/doctors": "Список врачей",
    "/analytics": "Аналитика",
    "/patients": "Пациенты",
    "/reports": "Отчеты",
    "/price-list": "Прайс-лист",
    "/profile": "Мой профиль",
    "/editPasient/:": "Информация о пациенте",
    "/addPatients": "Добавить пациента",
  };

  let pageTitle = routeTitles[location.pathname] || "Без названия";

  if (location.pathname.startsWith("/editPasient/")) {
    pageTitle = `Информация о пациенте ${id || ""}`;
  }
  return (
    <header className="flex items-center justify-between h-[65px] px-6 py-2  border-b border-gray-200 bg-white">
      {/* Левая часть */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:text-blue-500 hover:bg-blue-50 transition-colors text-gray-600 "
          aria-label="Назад"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-[20px]  text-gray-700">{pageTitle}</h1>
      </div>

      {/* Правая часть */}
      {isAdmin && (
        <div className="flex items-center gap-4">
          {isReceptionist && (
            <>
              <button
                onClick={() => { setNotifications(false); navigate("/notification"); }}
                className="relative h-12 w-12 border flex items-center justify-center border-gray-300  rounded-full   hover:bg-blue-50 transition-colors text-gray-600"
                aria-label="Уведомления"
              >
                <FiBell color="rgba(38, 124, 220, 1)" size={24} />
                {notifications && (
                  <span className="absolute top-3 right-3 inline-block w-2 h-2 bg-red-600 rounded-full ring-2 ring-white"></span>
                )}
              </button>
              <div className="w-0.5 h-10 bg-gray-300 rounded-full ring-2 ring-white"></div>
            </>
          )}
          <div className="flex items-center gap-2">
            <img
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHVzZXJ8ZW58MHx8MHx8fDA%3D"
              alt="Аватар пользователя"
              className="h-12 w-12 rounded-full object-cover"
            />
            {/* <span className="text-sm font-medium">{userName}</span> */}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
