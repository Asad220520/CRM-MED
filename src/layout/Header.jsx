import { useNavigate, useLocation, useParams } from "react-router-dom";
import { FiArrowLeft, FiBell } from "react-icons/fi";

function Header({ userName = "Asad" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // Мапа маршрутов и заголовков
  const routeTitles = {
    "/home": "Записи клиентов",
    "/calendar": "Календарь",
    "/doctor-records": "Записи врачей",
    "/doctor-appointments": "Список врачей",
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
    <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
      {/* Левая часть */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-900"
          aria-label="Назад"
        >
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">{pageTitle}</h1>
      </div>

      {/* Правая часть */}
      <div className="flex items-center gap-4">
        <button
          className="relative text-gray-600 hover:text-gray-900"
          aria-label="Уведомления"
        >
          <FiBell size={24} />
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full ring-2 ring-white"></span>
        </button>
        <div className="flex items-center gap-2">
          <img
            src="/path/to/avatar.png"
            alt="Аватар пользователя"
            className="h-8 w-8 rounded-full object-cover"
          />
          {/* <span className="text-sm font-medium">{userName}</span> */}
        </div>
      </div>
    </header>
  );
}

export default Header;
