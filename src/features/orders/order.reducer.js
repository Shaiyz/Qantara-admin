import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  errors: false,
  orders: [],
  order: null,
};

export const orderSlice = createSlice({
  name: "orderService",
  initialState,
  reducers: {
    getLoadingLists: (state) => {
      state.loading = true;
    },
    getOrdersListsSuccess: (state, { payload }) => {
      state.loading = false;
      state.orders = payload;
    },
    getOrderSuccess: (state, { payload }) => {
      state.loading = false;
      state.order = payload;
    },
    getOrdersListsFailure: (state) => {
      state.loading = false;
      state.hasErrors = true;
    },
    updateOrderSuccess: (state) => {
      state.loading = false;
      state.hasErrors = true;
    },
  },
});

const orderReducer = orderSlice.reducer;
export default orderReducer;
export const {
  getLoadingLists,
  getOrdersListsFailure,
  getOrdersListsSuccess,
  getOrderSuccess,
  updateOrderSuccess,
} = orderSlice.actions;
