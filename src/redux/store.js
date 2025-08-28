import { configureStore } from "@reduxjs/toolkit";
import reportReducer from "./reportSlice";
import doctorsReducer from "./doctorsSlice";
import departmentReducer from "./departmentSlice";
import excelReducer from "./excelReport";

const store = configureStore({
  reducer: {
    report: reportReducer,
    doctors: doctorsReducer,
    department: departmentReducer,
    excel: excelReducer,
  },
});

export default store;
