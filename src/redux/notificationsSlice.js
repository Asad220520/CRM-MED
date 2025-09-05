// =========================
// src/redux/notificationsSlice.js
// =========================
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithAuth from "../features/auth/fetchWithAuth";
import API_BASE_URL from "../../config/api";

const initialState = {
  items: [],
  error: null,
  doctorPolling: false,
};

let doctorInterval = null;

function shapeDoctorNotif(n) {
  return {
    id: n.id,
    appointment_date: n.appointment_date,
    department_name: n?.department?.department_name || "",
    patientName: n?.name || n?.patient?.name || "",
    registrar: n?.registrar?.username || "",
    read: Boolean(n.read),
    created_at: n.created_at || n.appointment_date || null,
    _raw: n,
  };
}

export const fetchDoctorNotificationsOnce = createAsyncThunk(
  "notifications/fetchDoctorOnce",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/ru/doctor/notification/`,
        { method: "GET" }
      );
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      const data = await res.json();
      const shaped = Array.isArray(data) ? data.map(shapeDoctorNotif) : [];
      shaped.sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
      return shaped;
    } catch (e) {
      return rejectWithValue(e?.message || "Не удалось загрузить уведомления");
    }
  }
);

export const startDoctorNotifications = createAsyncThunk(
  "notifications/startDoctor",
  async (_, { dispatch, getState }) => {
    const { doctorPolling } = getState().notifications || {};
    if (doctorPolling) return;
    await dispatch(fetchDoctorNotificationsOnce());
    doctorInterval = setInterval(() => {
      dispatch(fetchDoctorNotificationsOnce());
    }, 30000);
    dispatch(notificationsSlice.actions.setDoctorPolling(true));
  }
);

export const stopDoctorNotifications = createAsyncThunk(
  "notifications/stopDoctor",
  async (_, { dispatch }) => {
    if (doctorInterval) {
      clearInterval(doctorInterval);
      doctorInterval = null;
    }
    dispatch(notificationsSlice.actions.setDoctorPolling(false));
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setDoctorPolling(state, action) {
      state.doctorPolling = !!action.payload;
    },
    setNotifications(state, action) {
      state.items = Array.isArray(action.payload) ? action.payload : [];
    },
    addNotification(state, action) {
      state.items.unshift(action.payload);
    },
    markAllRead(state) {
      state.items.forEach((n) => (n.read = true));
    },
    markRead(state, action) {
      const it = state.items.find((x) => x.id === action.payload);
      if (it) it.read = true;
    },
    clear(state) {
      state.items = [];
    },
    setError(state, action) {
      state.error = action.payload || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorNotificationsOnce.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.error = null;
      })
      .addCase(fetchDoctorNotificationsOnce.rejected, (state, action) => {
        state.error = action.payload || "Ошибка загрузки";
      });
  },
});

export const {
  setDoctorPolling,
  setNotifications,
  addNotification,
  markAllRead,
  markRead,
  clear,
  setError,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
