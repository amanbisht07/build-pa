import { normalize, schema } from "normalizr";
import { camelizeKeys } from "humps";
import axios from "axios";

const API_ROOT = "/annexure_service";

const callApi = (endpoint, body, headers, onUploadProgress) => {
  const fullUrl =
    endpoint.indexOf(API_ROOT) === -1 ? API_ROOT + endpoint : endpoint;
  return axios
    .post(fullUrl, body, { ...onUploadProgress, headers })
    .then((res) => {
      return res;
    });
};

export const BACK_API_AXIOS = "Back API Axios";

export default (store) => (next) => (action) => {
  const callAPI = action[BACK_API_AXIOS];
  if (typeof callAPI === "undefined") {
    return next(action);
  }

  let { endpoint } = callAPI;
  const { types, body, headers, onUploadProgress } = callAPI;
  if (typeof endpoint === "function") {
    endpoint = endpoint(store.getState());
  }

  if (typeof endpoint !== "string") {
    throw new Error("Specify a string endpoint URL.");
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error("Expected an array of three action types.");
  }
  if (!types.every((type) => typeof type === "string")) {
    throw new Error("Expected action types to be strings.");
  }

  const actionWith = (data) => {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[BACK_API_AXIOS];
    return finalAction;
  };

  const [requestType, successType, failureType] = types;
  next(actionWith({ type: requestType }));
  return callApi(endpoint, body, headers, onUploadProgress).then(
    (response) => {
      if (response.error) {
        return next(
          actionWith({
            type: failureType,
            error: response.error || "Something bad happened",
          })
        );
      }
      return response;
    },
    (error) =>
      next(
        actionWith({
          type: failureType,
          error: error.message || "Something bad happened",
        })
      )
  );
};
