import {SENT_DATA} from "../actions/SendActions";


const initialState = {
    mount: true
};

const SentReducer = (state=initialState, action) => {

  if (action.type === SENT_DATA) {
      return {
          ...state,
          mount: action.mount
      };
  }
  else {
      return {
          ...state
      };
  }
};

export default SentReducer;
