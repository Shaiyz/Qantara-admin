import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  subcategorys: [],
  errors: false,
  subcategory: [],
  activeSubCategorys: [],
};
const subcategorySlice = createSlice({
  name: "subcategoryService",
  initialState,
  reducers: {
    getLoadingLists: (state) => {
      state.loading = true;
    },
    getSubCategorysListsSuccess: (state, { payload }) => {
      state.loading = false;
      state.subcategorys = payload;
    },
    getActiveSubCategorys: (state, { payload }) => {
      state.loading = false;
      state.activeSubCategorys = payload;
    },
    getSubCategorySuccess: (state, { payload }) => {
      state.loading = false;
      state.subcategory = payload;
    },
    getSubCategorysListsFailure: (state) => {
      state.loading = false;
      state.hasErrors = true;
    },
    addSubcategorySuccess: (state) => {
      state.loading = false;
      state.saved = true;
    },
    updateSubCategorySuccess: (state) => {
      state.loading = false;
      state.hasErrors = true;
    },
  },
});

const subcategoryReducer = subcategorySlice.reducer;
export default subcategoryReducer;
export const {
  getLoadingLists,
  getSubCategorysListsFailure,
  getActiveSubCategorys,
  getSubCategorysListsSuccess,
  getSubCategorySuccess,
  updateSubCategorySuccess,
  addSubcategorySuccess,
} = subcategorySlice.actions;
