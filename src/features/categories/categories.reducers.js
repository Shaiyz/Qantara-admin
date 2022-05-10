import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  categorys: [],
  errors: false,
  category: [],
  activeCategorys: [],
};
const categorySlice = createSlice({
  name: "categoryService",
  initialState,
  reducers: {
    getLoadingLists: (state) => {
      state.loading = true;
    },
    getCategorysListsSuccess: (state, { payload }) => {
      state.loading = false;
      state.categorys = payload;
    },
    getActiveCategorys: (state, { payload }) => {
      state.loading = false;
      state.activeCategorys = payload;
    },
    getCategorySuccess: (state, { payload }) => {
      state.loading = false;
      state.category = payload;
    },
    getCategorysListsFailure: (state) => {
      state.loading = false;
      state.hasErrors = true;
    },
    addCategorySuccess: (state) => {
      state.loading = false;
      state.saved = true;
    },
    updateCategorySuccess: (state) => {
      state.loading = false;
      state.hasErrors = true;
    },
  },
});

const categoryReducer = categorySlice.reducer;
export default categoryReducer;
export const {
  getLoadingLists,
  getCategorysListsFailure,
  getActiveCategorys,
  getCategorysListsSuccess,
  getCategorySuccess,
  updateCategorySuccess,
  addCategorySuccess,
} = categorySlice.actions;
