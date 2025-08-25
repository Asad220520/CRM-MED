// src/store/slices/doctorsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_BASE_URL from "../../config/api";

// Асинхронный запрос для получения списка врачей
export const fetchDoctors = createAsyncThunk(
  "doctors/fetchDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access");
      const res = await axios.get(`${API_BASE_URL}/en/doctor/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data; // массив докторов
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const doctorsSlice = createSlice({
  name: "doctors",
  initialState: {
    doctors: [],
    filteredDoctors: [],
    departments: [],
    loading: false,
    error: null,
    selectedDepartmentId: null,
  },
  reducers: {
    setSelectedDepartment: (state, action) => {
      state.selectedDepartmentId = action.payload;
      if (action.payload) {
        state.filteredDoctors = state.doctors.filter(
          (doc) => doc.department.id === Number(action.payload)
        );
      } else {
        state.filteredDoctors = state.doctors;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
        state.filteredDoctors = action.payload;

        // получаем уникальные отделения
        const uniqueDepartmentsMap = new Map();
        action.payload.forEach((doc) => {
          const dep = doc.department;
          if (dep && !uniqueDepartmentsMap.has(dep.id)) {
            uniqueDepartmentsMap.set(dep.id, dep);
          }
        });
        state.departments = Array.from(uniqueDepartmentsMap.values());
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка при загрузке врачей";
      });
  },
});

export const { setSelectedDepartment } = doctorsSlice.actions;
export default doctorsSlice.reducer;
