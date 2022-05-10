import { backend } from "../../api/index";
import {
  getLoadingLists,
  getProductsListsFailure,
  getProductsListsSuccess,
  getProductSuccess,
  updateProductSuccess,
  getActiveProducts,
} from "./product.reducers";

import { setAlertMessage } from "../alert/alert.action";

export const getProducts = () => async (dispatch) => {
  dispatch(getLoadingLists());
  try {
    const res = await backend.get(`/product`);
    dispatch(getProductsListsSuccess(res.data.data));
  } catch (err) {
    if (err) {
      console.log(err.response);
      dispatch(getProductsListsFailure(err));
    }
  }
};

export const getProduct = (id) => async (dispatch) => {
  dispatch(getLoadingLists());
  try {
    const res = await backend.get(`/product?_id=${id}`);
    dispatch(getProductSuccess(res.data.data));
  } catch (err) {
    if (err) {
      dispatch(getProductsListsFailure(err));
    }
  }
};

export const getActiveProduct = () => async (dispatch) => {
  dispatch(getLoadingLists());
  try {
    const res = await backend.get(`/product`);
    dispatch(getActiveProducts(res.data.data));
  } catch (err) {
    if (err) {
      dispatch(getProductsListsFailure(err));
    }
  }
};

export const getProductsByStatus = (status) => async (dispatch) => {
  dispatch(getLoadingLists());
  try {
    const res = await backend.get(`/product?isActive=${status}`);
    dispatch(getProductsListsSuccess(res.data.data));
  } catch (err) {
    if (err.response) {
      dispatch(setAlertMessage(err.response.data.message, "warning"));
      dispatch(getProductsListsFailure(err));
    }
  }
};

export const updateProduct = (body, id) => async (dispatch) => {
  dispatch(getLoadingLists());
  await backend
    .put(`/product/${id}`, body)
    .then((response) => {
      dispatch(updateProductSuccess(response.data.data));
      dispatch(setAlertMessage(response.data.message, "success"));
      dispatch(getProducts());
    })
    .catch((err) => {
      if (err.response) {
        dispatch(setAlertMessage(err.response.data.message, "error"));
        dispatch(getProductsListsFailure(err));
      }
    });
};
