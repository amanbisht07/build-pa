import {REFRESH_DATA} from "../actions/RefreshActions";


const initialState = {
    mount: true
};

const RefreshReducer = (state=initialState, action) => {

  if (action.type === REFRESH_DATA) {
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

export default RefreshReducer;
