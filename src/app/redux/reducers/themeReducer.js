import { THEME_CHANGE } from "app/camunda_redux/redux/constants/ActionTypes";
import Cookies from "js-cookie";

const initialState = Cookies.get("theme") === "darkTheme" ? true : false;

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case THEME_CHANGE:
      return action.payload;
    default:
      return state;
  }
};

export default themeReducer;
