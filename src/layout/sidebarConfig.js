import {
  FiHome,
  FiBarChart2,
  FiUsers,
  FiUserCheck,
  FiBriefcase,
  FiCalendar,
  FiFileText,
  FiDollarSign,
  FiLogOut,
} from "react-icons/fi";
import { ROLES } from "../lib/roles";

export const sidebarConfig = {
  [ROLES.ADMIN]: [
    { label: "Записи клиентов", path: "/patients", icon: FiHome },
    { label: "Управление Календарь", path: "/calendar", icon: FiCalendar },
    { label: "Список врачей", path: "/doctors", icon: FiUserCheck },
    { label: "Аналитика", path: "/analytics", icon: FiBarChart2 },
    { label: "Отчеты", path: "/reports", icon: FiFileText },
    { label: "Прайс-лист", path: "/price-list", icon: FiDollarSign },
    { label: "Выйти", action: "logout", icon: FiLogOut, isBottom: true },
  ],

  [ROLES.RECEPTION]: [
    { label: "Записи клиентов", path: "/patients", icon: FiHome },
    { label: "Управление Календарь", path: "/calendar", icon: FiCalendar },
    { label: "Список врачей", path: "/doctors", icon: FiUserCheck },
    { label: "Отчеты", path: "/reports", icon: FiFileText },
    { label: "Прайс-лист", path: "/price-list", icon: FiDollarSign },
    {
      label: "Мой профиль",
      path: "/profile",
      icon: FiUserCheck,
      isBottom: true,
    },
    { label: "Выйти", action: "logout", icon: FiLogOut, isBottom: true },
  ],

  [ROLES.DOCTOR]: [
    { label: "Пациенты", path: "/DactorPatients", icon: FiUsers },
    { label: "Записи", path: "/appointments", icon: FiCalendar },
    {
      label: "Мой профиль",
      path: "/profile",
      icon: FiUserCheck,
      isBottom: true,
    },
    { label: "Выйти", action: "logout", icon: FiLogOut, isBottom: true },
  ],
};
