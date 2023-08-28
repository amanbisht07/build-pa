import { CHANGE_PA_FILE } from "app/camunda_redux/redux/constants/ActionTypes";

const initialState = false;

const openDraftPa = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_PA_FILE:
      return action.payload;
    default:
      return state;
  }
};

export default openDraftPa;
