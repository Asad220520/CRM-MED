import { configureStore } from "@reduxjs/toolkit";
import reportReducer from "./reportSlice";
import doctorsReducer from "./doctorsSlice";
import departmentReducer from "./departmentSlice";

const store = configureStore({
  reducer: {
    report: reportReducer,
    doctors: doctorsReducer,
    department: departmentReducer,
  },
});

export default store;
