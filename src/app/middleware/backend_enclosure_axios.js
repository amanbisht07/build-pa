import axios from "axios";

const API_ROOT = "/partcase_service";

const callApi = async (endpoint, settings, config) => {
  const { body, headers } = settings;
  const fullUrl =
    endpoint.indexOf(API_ROOT) === -1 ? API_ROOT + endpoint : endpoint;

  const { data } = await axios.post(fullUrl, body, { ...config, headers });
  return data;
};

export const BACK_API_AXIOS_ENCLOSURE = "Back API Axios Enclosure";

export default (store) => (next) => (action) => {
  const callAPI = action[BACK_API_AXIOS_ENCLOSURE];
  if (typeof callAPI === "undefined") {
    return next(action);
  }

  let { endpoint } = callAPI;
  const { types, settings, config } = callAPI;
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
    delete finalAction[BACK_API_AXIOS_ENCLOSURE];
    return finalAction;
  };

  const [requestType, successType, failureType] = types;
  next(actionWith({ type: requestType }));
  return callApi(endpoint, settings, config).then(
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
