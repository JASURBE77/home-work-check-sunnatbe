import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  accessToken: null,
  user: null,
  theme: "light",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.theme = "dark";
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.accessToken = null;
      state.user = null;
      state.theme = "light";
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
