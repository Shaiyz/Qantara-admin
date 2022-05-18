import { backend } from "../../api/index";
import {
  getLoadingLists,
  getSubCategorysListsFailure,
  getSubCategorysListsSuccess,
  getSubCategorySuccess,
  updateSubCategorySuccess,
  getActiveSubCategorys,
} from "./subcategories.reducer";

import { setAlertMessage } from "../alert/alert.action";
import { addSubcategorySuccess } from "./subcategories.reducer";

export const getSubCategorys = () => async (dispatch) => {
  dispatch(getLoadingLists());
  try {
    const res = await backend.get(`/subcategory`);
    dispatch(getSubCategorysListsSuccess(res.data.data));
  } catch (err) {
    if (err) {
      dispatch(getSubCategorysListsFailure(err));
    }
  }
};

export const addSubCategory = (body) => async (dispatch, getState) => {
  dispatch(getLoadingLists());
  try {
    const res = await backend.post(`/subcategory`, body);
    dispatch(addSubcategorySuccess(res.data.data));
    dispatch(setAlertMessage(res.response.data.message, "success"));
    dispatch(getSubCategorys());
  } catch (err) {
    if (err.response) {
      dispatch(setAlertMessage(err.response.data.message, "error"));
      dispatch(getSubCategorysListsFailure(err));
    }
  }
};

export const getSubCategory = (id) => async (dispatch) => {
  dispatch(getLoadingLists());
  try {
    const res = await backend.get(`/subcategory?_id=${id}`);
    dispatch(getSubCategorySuccess(res.data.data));
  } catch (err) {
    if (err) {
      dispatch(getSubCategorysListsFailure(err));
    }
  }
};

export const getActiveSubCategory = () => async (dispatch) => {
  dispatch(getLoadingLists());
  try {
    const res = await backend.get(`/subcategory`);
    dispatch(getActiveSubCategorys(res.data.data));
  } catch (err) {
    if (err) {
      dispatch(getSubCategorysListsFailure(err));
    }
  }
};

export const getSubCategorysByStatus = (status) => async (dispatch) => {
  dispatch(getLoadingLists());
  try {
    const res = await backend.get(`/subcategory?isActive=${status}`);
    dispatch(getSubCategorysListsSuccess(res.data.data));
  } catch (err) {
    if (err.response) {
      dispatch(setAlertMessage(err.response.data.message, "warning"));
      dispatch(getSubCategorysListsFailure(err));
    }
  }
};

export const updateSubCategory = (body, id) => async (dispatch) => {
  dispatch(getLoadingLists());
  await backend
    .put(`/subcategory/${id}`, body)
    .then((response) => {
      dispatch(updateSubCategorySuccess(response.data.data));
      dispatch(setAlertMessage(response.data.message, "success"));
      dispatch(getSubCategory(id));
      dispatch(getSubCategorys());
    })
    .catch((err) => {
      if (err.response) {
        dispatch(setAlertMessage(err.response.data.message, "error"));
        dispatch(getSubCategorysListsFailure(err));
      }
    });
};

export const deleteSubCategory = (id) => async (dispatch, getState) => {
  dispatch(getLoadingLists());
  await backend
    .delete(`/subcategory/${id}`)
    .then((response) => {
      dispatch(setAlertMessage(response.data.message, "success"));
      const sub = getState().subCategories.subcategorys;
      let data = sub.filter((i) => i._id !== id);
      dispatch(getSubCategorysListsSuccess(data));
    })
    .catch((err) => {
      dispatch(setAlertMessage(err.response.data.message, "error"));
    });
};
