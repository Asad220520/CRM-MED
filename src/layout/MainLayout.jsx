import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const routeTitles = {
  "/calendar": "Календарь", 
  "/patients": "Записи клиентов",
  "/doctor-records": "Записи врачей",
  "/doctors": "Список врачей",
  "/analytics": "Аналитика",
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
        <main className="flex-1 p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
