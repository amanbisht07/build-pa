import { SIDENAV_CHANGE } from "app/camunda_redux/redux/constants/ActionTypes";

const initialState = ['PA'];

const sidenavReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIDENAV_CHANGE:
      return action.payload;
    default:
      return state;
  }
};

export default sidenavReducer;
