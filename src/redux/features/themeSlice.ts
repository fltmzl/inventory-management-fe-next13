import { createSlice } from "@reduxjs/toolkit";

type ThemeState = {
  darkMode: boolean
}

const initialState: ThemeState = {
  darkMode: false
}

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode
    },
    setToLight: (state) => {
      state.darkMode = false
    },
    setToDark: (state) => {
      state.darkMode = true
    }
  }
})

export const { setToDark, setToLight, toggleTheme } = themeSlice.actions
export default themeSlice.reducer