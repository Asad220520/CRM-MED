import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

import NotFoundPage from "../pages/NotFoundPage";
import PatientsPage from "../features/patients/pages/PatientsPage";
import CalendarPage from "../features/calendar/pages/CalendarPage";
import DoctorsPage from "../features/doctors/pages/DoctorsPage";
import AnalyticsPage from "../features/analytics/pages/AnalyticsPage";
import ReportsPage from "../features/reports/pages/ReportsPage";
import PriceListPage from "../features/priceList/pages/PriceListPage";

import ProtectedRoute from "./ProtectedRoute";
import { ROLES } from "../lib/roles";

import Login from "../features/auth/LoginPage";
import WelcomePage from "../pages/WelcomePage";
import AddPatientForm from "../features/patients/addPatients/AddPatients";
import DoctorCreatePage from "../features/doctors/pages/DoctorCreatePage";
import DactorPatients from "../features/doctors/doctorPatients/DactorPatients";
import EditPatientPage from "../features/patients/pages/PatientTabs";
import Doctor from "../features/doctors/components/Doctor";
import DoctorEdit from "../features/doctors/pages/DoctorEdit";
import ResetPasswordPage from "../features/auth/ResetPasswordPage";
import ProfileDoctor from "../features/profile/ProfileDoctor";
import ProfileReception from "../features/profile/ProfileReception";
import ReceptionEdit from "../features/profile/EditReception";

function AppRouter() {
  return (
    <Routes>
      {/* Welcome page */}
      <Route path="/" element={<WelcomePage />} />

      {/* Login page */}
      <Route path="/login" element={<Login />} />
      {/* Reset Password */}
      <Route path="/resetPassword" element={<ResetPasswordPage />} />
      {/* Main app layout */}
      <Route element={<MainLayout />}>
        <Route
          path="/calendar"
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.ADMIN, ROLES.RECEPTION, ROLES.DOCTOR]}
            >
              <CalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.ADMIN, ROLES.RECEPTION]}
            >
              <PatientsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctorcreate"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.RECEPTION]}>
              <DoctorCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctorEdit/:id"
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.ADMIN, ROLES.RECEPTION, ROLES.DOCTOR]}
            >
              <DoctorEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addPatients"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.RECEPTION]}>
              <AddPatientForm />
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
      </Route>
      <Route element={<MainLayout />}>
        <Route
          path="/calendar"
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.ADMIN, ROLES.RECEPTION, ROLES.DOCTOR]}
            >
              <CalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.RECEPTION]}>
              <PatientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctorcreate"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.RECEPTION]}>
              <DoctorCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addPatients"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.RECEPTION]}>
              <AddPatientForm />
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
          path="/profileReception"
          element={
            <ProtectedRoute allowedRoles={[ROLES.RECEPTION]}>
              <ProfileReception />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editReception/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLES.RECEPTION]}>
              <ReceptionEdit />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route element={<MainLayout />}>
        <Route
          path="/DactorPatients"
          element={
            <ProtectedRoute allowedRoles={ROLES.DOCTOR}>
              <DactorPatients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editPasient/:editId"
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.ADMIN, ROLES.RECEPTION, ROLES.DOCTOR]}
            >
              <EditPatientPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/calendar"
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.ADMIN, ROLES.RECEPTION, ROLES.DOCTOR]}
            >
              <CalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notification"
          element={
            <ProtectedRoute allowedRoles={[ROLES.DOCTOR]}>
              <Doctor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profileDoctor"
          element={
            <ProtectedRoute allowedRoles={[ROLES.DOCTOR]}>
              <ProfileDoctor />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;
