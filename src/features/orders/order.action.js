import { backend } from "../../api/index";
import {
  getLoadingLists,
  getOrdersListsFailure,
  getOrdersListsSuccess,
  getOrderSuccess,
  updateOrderSuccess,
} from "./order.reducer";

import { setAlertMessage } from "../alert/alert.action";

const fetch_orders_admin = (query) => (dispatch, getState) => {
  let state = copy(getState().order);
  backend
    .get("/order", {
      params: {
        ...query,
        populate: url_encode([
          {
            path: "items",
            populate: [
              {
                path: "product",
              },
            ],
          },
          {
            path: "customer",
            populate: [
              {
                path: "user",
                select: "-password",
              },
            ],
          },
        ]),
      },
    })
    .then(({ data }) => {
      state = arr;
    })
    .catch((error) => {
      toast.error(error.response ? error.response.data.message : error.message);
    })
    .finally(() => {
      dispatch({
        type: types.ORDER,
        payload: state,
      });
    });
};
