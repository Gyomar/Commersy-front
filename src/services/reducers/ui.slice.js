import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openAsideMenu: false,
  openListMenu: null,
  openSubMenuPopover: null,
  anchorSubMenuPopover: null,
  loading: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setOpenAsideMenu: (state, action) => {
      state.openAsideMenu = action.payload;
    },
    setOpenListMenu: (state, action) => {
      state.openListMenu = action.payload;
    },
    setOpenSubMenuPopover: (state, action) => {
      state.openSubMenuPopover = action.payload;
    },
    setAnchorSubMenuPopover: (state, action) => {
      state.anchorSubMenuPopover = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setOpenAsideMenu,  setOpenListMenu, setOpenSubMenuPopover, setAnchorSubMenuPopover, setLoading } = uiSlice.actions;

export default uiSlice.reducer;