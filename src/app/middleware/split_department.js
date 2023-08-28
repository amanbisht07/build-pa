const API_ROOT = "/deptAM";

const callApi = (endpoint, settings = {}) => {
  const fullUrl =
    endpoint.indexOf(API_ROOT) === -1 ? API_ROOT + endpoint : endpoint;

  return fetch(fullUrl, settings).then((response) => {
    return response.json().then((res) => {
      return res;
    });
  });
};

export const SPLIT_DEPARTMENT_API = " split department API";

export default (store) => (next) => (action) => {
  const callAPI = action[SPLIT_DEPARTMENT_API];
  if (typeof callAPI === "undefined") {
    return next(action);
  }

  let { endpoint } = callAPI;
  const { types, settings } = callAPI;
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
    delete finalAction[SPLIT_DEPARTMENT_API];
    return finalAction;
  };

  const [requestType, successType, failureType] = types;
  next(actionWith({ type: requestType }));
  return callApi(endpoint, settings).then(
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
