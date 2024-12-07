import { removeAccessToken } from "@/helpers/auth";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// type User = {
//   userId: string;
//   username: string;
//   role: "ADMIN";
// };

type AuthState = {
  user: User | null;
};

const initialState: AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      removeAccessToken();
      state.user = null;

      window.location.href = "/auth/login";
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
