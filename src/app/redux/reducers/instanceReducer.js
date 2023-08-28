import { INSTANCE_CHANGE } from "app/camunda_redux/redux/constants/ActionTypes";

const initialState = null;

const instanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case INSTANCE_CHANGE:
      return action.payload;
    default:
      return state;
  }
};

export default instanceReducer;
