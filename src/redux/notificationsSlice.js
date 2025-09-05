import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_BASE_URL from "../../config/api"; // проверь путь под свой проект

// === Thunk: загрузка уведомлений с реального API ===
export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${API_BASE_URL}/ru/doctor/notification/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        return rejectWithValue(
          `Ошибка: ${res.status}${text ? ` — ${text}` : ""}`
        );
      }

      const data = await res.json();
      // ожидаем массив уведомлений с серверной структурой
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return rejectWithValue(e?.message || "Неизвестная ошибка запроса");
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    // Пометить одно уведомление прочитанным (локально)
    markRead(state, action) {
      const it = state.items.find((x) => x.id === action.payload);
      if (it) it.read = true;
    },
    // Пометить все прочитанными (локально)
    markAllRead(state) {
      state.items.forEach((n) => (n.read = true));
    },
    // Очистить список (локально)
    clear(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Не удалось загрузить уведомления";
      });
  },
});

export default notificationsSlice.reducer;
