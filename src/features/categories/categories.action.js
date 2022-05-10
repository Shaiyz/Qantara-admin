import { backend } from "../../api/index";
import {
  getLoadingLists,
  getCategorysListsFailure,
  getCategorysListsSuccess,
  getCategorySuccess,
  addCategorySuccess,
  updateCategorySuccess,
  getActiveCategorys,
} from "./categories.reducers";

import { setAlertMessage } from "../alert/alert.action";

export const getCategorys = () => async (dispatch) => {
  dispatch(getLoadingLists());
  try {
    const res = await backend.get(`/category`);
    dispatch(getCategorysListsSuccess(res.data.data));
  } catch (err) {
    if (err) {
      dispatch(getCategorysListsFailure(err));
    }
  }
};

export const getCategory = (id) => async (dispatch) => {
  dispatch(getLoadingLists());
  try {
    const res = await backend.get(`/category?_id=${id}`);
    dispatch(getCategorySuccess(res.data.data));
  } catch (err) {
    if (err) {
      dispatch(getCategorysListsFailure(err));
    }
  }
};

export const getActiveCategory = () => async (dispatch) => {
  dispatch(getLoadingLists());
  try {
    const res = await backend.get(`/category`);
    dispatch(getActiveCategorys(res.data.data));
  } catch (err) {
    if (err) {
      dispatch(getCategorysListsFailure(err));
    }
  }
};

export const getCategorysByStatus = (status) => async (dispatch) => {
  dispatch(getLoadingLists());
  try {
    const res = await backend.get(`/category?isActive=${status}`);
    dispatch(getCategorysListsSuccess(res.data.data));
  } catch (err) {
    if (err.response) {
      dispatch(setAlertMessage(err.response.data.message, "warning"));
      dispatch(getCategorysListsFailure(err));
    }
  }
};

export const updateCategory = (body, id) => async (dispatch) => {
  dispatch(getLoadingLists());
  await backend
    .put(`/category/${id}`, body)
    .then((response) => {
      dispatch(updateCategorySuccess(response.data.data));
      dispatch(setAlertMessage(response.data.message, "success"));
      dispatch(getCategorys());
    })
    .catch((err) => {
      if (err.response) {
        dispatch(setAlertMessage(err.response.data.message, "error"));
        dispatch(getCategorysListsFailure(err));
      }
    });
};

export const deleteCategory = (id) => async (dispatch) => {
  dispatch(getLoadingLists());
  await backend
    .delete(`/category/${id}`)
    .then((response) => {
      dispatch(setAlertMessage(response.data.message, "success"));
      dispatch(getCategorys());
    })
    .catch((err) => {
      dispatch(setAlertMessage(err.response.data.message, "error"));
    });
};

export const addCategory = (body) => async (dispatch, getState) => {
  dispatch(getLoadingLists());
  try {
    const res = await backend.post(`/category`, body);
    dispatch(addCategorySuccess(res.data.data));
    dispatch(setAlertMessage(res.response.data.message, "success"));
    dispatch(getCategorys());
  } catch (err) {
    if (err.response) {
      dispatch(setAlertMessage(err.response.data.message, "error"));
      dispatch(getCategorysListsFailure(err));
    }
  }
};
