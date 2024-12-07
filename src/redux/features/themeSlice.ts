import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem("theme") || "light";
};

type ThemeState = {
  darkMode: boolean;
};

const initialState: ThemeState = {
  darkMode: getInitialTheme() === "dark",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
    },
    setToLight: (state) => {
      state.darkMode = false;
    },
    setToDark: (state) => {
      state.darkMode = true;
    },
  },
});

export const { setToDark, setToLight, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
