import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_BASE_URL from "../../config/api";

// Универсальный thunk для скачивания Excel
export const downloadExcel = createAsyncThunk(
  "report/downloadExcel",
  async ({ endpoint, paramsObj }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access");
      if (!token) throw new Error("Токен не найден");

      const params = new URLSearchParams(paramsObj);
      const url = `${API_BASE_URL}${endpoint}?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const blob = await response.blob();
      const filename = paramsObj.filename || "report.xlsx";

      // Скачиваем файл сразу здесь, а не сохраняем blob в payload
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();

      return { success: true, filename }; // payload без blob
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(downloadExcel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadExcel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadExcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка при скачивании Excel";
      });
  },
});

export default reportSlice.reducer;
