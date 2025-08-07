import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import PatientsPage from "../features/patients/pages/PatientsPage";
import AppointmentsPage from "../features/doctorAppointments/pages/DoctorAppointmentsPage";
import CalendarPage from "../features/calendar/pages/CalendarPage";
import DoctorAppointmentsPage from "../features/doctorAppointments/pages/DoctorAppointmentsPage";
import DoctorsPage from "../features/doctors/pages/DoctorsPage";
import AnalyticsPage from "../features/analytics/pages/AnalyticsPage";
import ReportsPage from "../features/reports/pages/ReportsPage";
import PriceListPage from "../features/priceList/pages/PriceListPage";
import ProfilePage from "../features/profile/pages/ProfilePage";

import ProtectedRoute from "./ProtectedRoute";
import { ROLES } from "../lib/roles";

import Login from "../features/auth/LoginPage";
import WelcomePage from "../pages/WelcomePage";
import AddPatientForm from "../features/patients/addPatients/AddPatients";

function AppRouter() {
  return (
    <Routes>
      {/* Welcome page */}
      <Route path="/" element={<WelcomePage />} />

      {/* Login page */}
      <Route path="/login" element={<Login />} />

      {/* Main app layout */}
      <Route element={<MainLayout />}>
        <Route
          path="/patients"
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.ADMIN, ROLES.RECEPTION, ROLES.DOCTOR]}
            >
              <PatientsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/addPatients"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.RECEPTION,]}>
              <AddPatientForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute allowedRoles={[ROLES.RECEPTION, ROLES.DOCTOR]}>
              <AppointmentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/calendar"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.RECEPTION]}>
              <CalendarPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor-appointments"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <DoctorAppointmentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctors"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.RECEPTION]}>
              <DoctorsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.RECEPTION]}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/price-list"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.RECEPTION]}>
              <PriceListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.ADMIN, ROLES.RECEPTION, ROLES.DOCTOR]}
            >
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;
