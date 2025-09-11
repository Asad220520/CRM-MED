// src/store/slices/depJobRoomSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://13.62.101.249/en";

const initialState = {
  departments: [],
  jobs: [],
  rooms: [],
  loading: false,
  error: null,
};

const depJobRoomSlice = createSlice({
  name: "depJobRoom",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setDepartments: (state, action) => {
      state.departments = action.payload;
    },
    setJobs: (state, action) => {
      state.jobs = action.payload;
    },
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },
  },
});

export const { setLoading, setError, setDepartments, setJobs, setRooms } =
  depJobRoomSlice.actions;

export default depJobRoomSlice.reducer;

// ====== Async functions ======
export const fetchDepartments = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get(`${API_BASE_URL}/department/`);
    dispatch(setDepartments(res.data));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchJobs = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get(`${API_BASE_URL}/jobs/`);
    dispatch(setJobs(res.data));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchRooms = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get(`${API_BASE_URL}/rooms/`);
    dispatch(setRooms(res.data));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};
