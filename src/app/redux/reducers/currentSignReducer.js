import { CURRENT_SIGN } from "app/camunda_redux/redux/constants/ActionTypes";

const signReducer = (state = false, action) => {
  switch (action.type) {
    case CURRENT_SIGN:
      return action.payload;
    default:
      return state;
  }
};

export default signReducer;
