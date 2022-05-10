import { toast } from "react-toastify";
import { backend } from "../api/index";

export const copy = (x) => JSON.parse(JSON.stringify(x));
export const url_encode = (x) => encodeURI(JSON.stringify(x));

export const get_current_status = (state) => {
  if (!state.status) return { status_title: "" };

  let status_title = null;
  let status_message = null;
  let status_date = null;
  let status_ = Object.keys(state.status).sort(
    (a, b) =>
      Date.parse(state.status[b].date) - Date.parse(state.status[a].date)
  )[0];
  status_message = state.status[status_].message;
  status_date = state.status[status_].date;
  switch (status_) {
    case "checked_out":
      status_title = "Checked Out";
      break;
    case "declined":
      status_title = "Declined";
      break;
    case "in_progress":
      status_title = "In Progress";
      break;
    case "delivered":
      status_title = "Delivered";
      break;
    case "cancel":
      status_title = "Cancel Requested";
      break;
    case "return":
      status_title = "Return Requested";
      break;
    default:
      break;
  }
  return { status_title, status_date, status_message };
};

export const get_current_status_mer = (status) => {
  if (!status) return { status_title: "", status_date: "", status_message: "" };
  let merchant_status = {};
  merchant_status = { ...status };
  let status_title = null;
  let status_message = null;
  let status_date = null;
  let key = "merchant_user";
  delete merchant_status[key];

  let status_ = Object.keys(merchant_status).sort(
    (a, b) =>
      Date.parse(merchant_status[b].date) - Date.parse(merchant_status[a].date)
  )[0];
  status_message = status[status_].message;
  status_date = status[status_].date;
  switch (status_) {
    case "checked_out":
      status_title = "Checked Out";
      break;
    case "declined":
      status_title = "Declined";
      break;
    case "in_progress":
      status_title = "In Progress";
      break;
    case "delivered":
      status_title = "Delivered";
      break;
    case "cancel":
      status_title = "Cancel Requested";
      break;
    case "return":
      status_title = "Return Requested";
      break;
    default:
      break;
  }
  return { status_title, status_date, status_message };
};

export const upload_images = (images) =>
  backend.post("/file", images, {
    headers: {
      "content-type": `multipart/form-data`,
    },
  });
