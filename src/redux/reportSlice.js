import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_BASE_URL from "../../config/api";

// Асинхронный thunk для загрузки отчета
export const fetchReport = createAsyncThunk(
  "report/fetchReport",
  async (filters, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access");

      // Параметры для API
      const params = {
        doctor: filters.doctor || undefined,
        department: filters.department || undefined,
        date: filters.date || undefined,
      };

      const response = await axios.get(`${API_BASE_URL}/en/report/exact/`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      return response.data;
    } catch {
      return rejectWithValue("Ошибка при загрузке данных");
    }
  }
);

const initialState = {
  filters: {
    doctor: "",
    department: "",
    date: "",
  },
  appointments: [],
  totals: {
    totalRecords: 0,
    totalAmount: 0,
    cashAmount: 0,
    cardAmount: 0,
    discountAmount: 0,
    doctorEarnings: 0,
  },
  doctorsList: [],
  loading: false,
  error: null,
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters[action.payload.key] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReport.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;

        // Сохраняем пациентов
        state.appointments = data.patients || [];

        // Берем totals напрямую из API
        state.totals = {
          totalRecords: data.patients_count || 0,
          totalAmount: (data.sum_discount || 0) + (data.sum_no_discount || 0),
          discountAmount: data.sum_discount || 0,
          cashAmount: data.total_cash || 0,
          cardAmount: data.total_card || 0,
          doctorEarnings: data.doctor_earnings || 0,
        };
      })
      .addCase(fetchReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilter, setDoctorsList } = reportSlice.actions;
export default reportSlice.reducer;
