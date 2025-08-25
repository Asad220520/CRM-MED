import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API_BASE_URL from "../../config/api";
import axios from "axios";

export const fetchDepartment = createAsyncThunk(
  "department/fetchDepartment",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/en/department/`);
      if (res.status !== 200) {
        throw new Error("Network response was not ok");
      }
      const data = res.data;

      // Если API возвращает объект с "results"
      return data.results || data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Ошибка при загрузке департаментов"
      );
    }
  }
);

const departmentSlice = createSlice({
  name: "department",
  initialState: {
    departments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default departmentSlice.reducer;
