import {
  CHANGE_ROUTES_PA,
  CHANGE_ROUTES_ALL,
} from "app/camunda_redux/redux/constants/ActionTypes";

const initialState = {
  showPa: true,
  showAll: false,
};

const routeReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_ROUTES_PA:
      return { ...state, showPa: true, showAll: false };
    case CHANGE_ROUTES_ALL:
      return { ...state, showPa: false, showAll: true };
    default:
      return state;
  }
};

export default routeReducer;
