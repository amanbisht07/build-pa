import { MYINFO_CHANGE } from "app/camunda_redux/redux/constants/ActionTypes";

const themeReducer = (state = false, action) => {
  switch (action.type) {
    case MYINFO_CHANGE:
      return action.payload;
    default:
      return state;
  }
};

export default themeReducer;
