import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  products: [],
  errors: false,
  product: [],
  activeProducts: [],
};
const productSlice = createSlice({
  name: "productService",
  initialState,
  reducers: {
    getLoadingLists: (state) => {
      state.loading = true;
    },
    getProductsListsSuccess: (state, { payload }) => {
      state.loading = false;
      state.products = payload;
    },
    getActiveProducts: (state, { payload }) => {
      state.loading = false;
      state.activeProducts = payload;
    },
    getProductSuccess: (state, { payload }) => {
      state.loading = false;
      state.product = payload;
    },
    getProductsListsFailure: (state) => {
      state.loading = false;
      state.hasErrors = true;
    },
    updateProductSuccess: (state) => {
      state.loading = false;
      state.hasErrors = true;
    },
  },
});

const productReducer = productSlice.reducer;
export default productReducer;
export const {
  getLoadingLists,
  getProductsListsFailure,
  getActiveProducts,
  getProductsListsSuccess,
  getProductSuccess,
  updateProductSuccess,
} = productSlice.actions;
