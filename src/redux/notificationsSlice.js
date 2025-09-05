// =========================
// src/redux/notificationsSlice.js (mock version)
// =========================
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  items: [], // список уведомлений
  error: null,
};

// хелпер для генерации фейковых уведомлений
function makeMockNotification(i) {
  return {
    id: Date.now() + i,
    title: "Новая запись пациента",
    message: `Пациент #${1000 + i} записан к врачу`,
    read: false,
    created_at: new Date().toISOString(),
  };
}

// thunk запускает mock-polling
export const startMockNotifications = createAsyncThunk(
  "notifications/mock",
  async (_, { dispatch }) => {
    let counter = 1;

    function pushFake() {
      const newNotif = makeMockNotification(counter++);
      dispatch(notificationsSlice.actions.addNotification(newNotif));
    }

    // сразу создаём одно уведомление
    pushFake();

    // каждые 20 сек будет приходить новое
    const interval = setInterval(pushFake, 20000);

    return () => clearInterval(interval);
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
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
  },
});

export const { addNotification, markAllRead, markRead, clear } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
