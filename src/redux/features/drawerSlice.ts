import { createSlice } from "@reduxjs/toolkit"

type DrawerState = {
  isOpen: boolean
}

const initialState: DrawerState = {
  isOpen: false
};

export const drawerSlice = createSlice({
  name: "drawer",
  initialState,
  reducers: {
    toggleDrawer: (state) => {
      state.isOpen = !state.isOpen
    },
    openDrawer: (state) => {
      state.isOpen = true
    },
    closeDrawer: (state) => {
      state.isOpen = false
    }
  }
})

export const { toggleDrawer, closeDrawer, openDrawer } = drawerSlice.actions
export default drawerSlice.reducer