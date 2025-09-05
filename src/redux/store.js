import { configureStore } from "@reduxjs/toolkit";
import reportReducer from "./reportSlice";
import doctorsReducer from "./doctorsSlice";
import departmentReducer from "./departmentSlice";
import excelReducer from "./excelReport";
import notificationsReducer from "./notificationsSlice";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    report: reportReducer,
    doctors: doctorsReducer,
    department: departmentReducer,
    excel: excelReducer,
    notifications: notificationsReducer,
  },
});

export default store;
