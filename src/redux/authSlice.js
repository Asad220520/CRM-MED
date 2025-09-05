// =========================
// src/redux/authSlice.js
// =========================
import { createSlice } from "@reduxjs/toolkit";

const persistedUser = (() => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

const initialState = {
  user: persistedUser,
  access: localStorage.getItem("access") || null,
  refresh: localStorage.getItem("refresh") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { user, access, refresh } = action.payload || {};
      if (user) {
        state.user = user;
        localStorage.setItem("user", JSON.stringify(user));
        if (user.role) localStorage.setItem("role", user.role);
        if (user.doctorId)
          localStorage.setItem("doctorId", String(user.doctorId));
      }
      if (access) {
        state.access = access;
        localStorage.setItem("access", access);
      }
      if (refresh) {
        state.refresh = refresh;
        localStorage.setItem("refresh", refresh);
      }
    },
    updateUser(state, action) {
      state.user = { ...(state.user || {}), ...(action.payload || {}) };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    logout(state) {
      state.user = null;
      state.access = null;
      state.refresh = null;
      localStorage.removeItem("user");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("role");
      localStorage.removeItem("doctorId");
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
