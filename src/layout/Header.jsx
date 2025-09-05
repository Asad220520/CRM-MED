// =========================
// src/layout/Header.jsx
// =========================
import React, { useEffect, useMemo, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { FiArrowLeft, FiBell } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { getCurrentUserRole } from "../lib/auth";
import { ROLES } from "../lib/roles";
import { startDoctorNotifications } from "../redux/notificationsSlice";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch();

  const userRole = getCurrentUserRole();
  const isDoctor = userRole === ROLES.DOCTOR;

  const { items: notifItems = [] } = useSelector((s) => s.notifications || {});
  const { user } = useSelector((s) => s.auth || {});
  const unreadCount = notifItems.filter((n) => !n.read).length;

  // звук при приходе новых
  const lastCountRef = useRef(0);
  const playDing = useMemo(() => {
    return () => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = "sine";
        o.frequency.value = 880;
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01);
        o.start();
        setTimeout(() => (o.frequency.value = 660), 100);
        setTimeout(() => {
          g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
          o.stop(ctx.currentTime + 0.08);
        }, 200);
      } catch {}
    };
  }, []);

  useEffect(() => {
    const unread = notifItems.filter((n) => !n.read).length;
    if (unread > lastCountRef.current) playDing();
    lastCountRef.current = unread;
  }, [notifItems, playDing]);

  // реальный поллинг только врачу
  useEffect(() => {
    if (isDoctor) dispatch(startDoctorNotifications());
  }, [dispatch, isDoctor]);

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

  const avatarUrl =
    user?.avatar || user?.profile_image || "/default-avatar.png";

  return (
    <header className="flex items-center justify-between h-[65px] px-6 py-2 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:text-blue-500 hover:bg-blue-50 transition-colors text-gray-600"
          aria-label="Назад"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-[20px] text-gray-700">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-4">
        {isDoctor && (
          <>
            <button
              onClick={() => navigate("/notification")}
              className="relative h-12 w-12 border flex items-center justify-center border-gray-300 rounded-full hover:bg-blue-50 transition-colors text-gray-600"
              aria-label="Уведомления"
            >
              <FiBell color="rgba(38, 124, 220, 1)" size={24} />
              {!!unreadCount && (
                <span className="absolute top-3 right-3 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white px-1">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="w-0.5 h-10 bg-gray-300 rounded-full ring-2 ring-white"></div>
          </>
        )}

        <div className="flex items-center gap-2">
          <img
            src={avatarUrl}
            alt={user?.username || "Аватар пользователя"}
            className="h-12 w-12 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-gray-700">
            {user?.username || ""}
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;
