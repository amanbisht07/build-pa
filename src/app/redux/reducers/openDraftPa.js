import { OPEN_PA_DRAFT } from "app/camunda_redux/redux/constants/ActionTypes";

const initialState = null;

const openDraftPa = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_PA_DRAFT:
      return action.payload;
    default:
      return state;
  }
};

export default openDraftPa;
