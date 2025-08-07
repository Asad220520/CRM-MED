import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const routeTitles = {
  "/patients": "Записи клиентов",
  "/calendar": "Календарь",
  "/doctor-records": "Записи врачей",
  "/doctors": "Список врачей",
  "/analytics": "Аналитика",
  "/patients": "Пациенты",
  "/reports": "Отчеты",
  "/price-list": "Прайс-лист",
  "/profile": "Мой профиль",
};

function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Находим заголовок по точному пути
  const pageTitle = routeTitles[location.pathname] || "Без названия";

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title={pageTitle} onBack={() => navigate(-1)} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
