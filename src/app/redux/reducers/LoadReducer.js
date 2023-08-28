import {LOAD_DATA} from "../actions/LoadingActions";

const initialState = {
  isLoading: false
};

const LoadReducer = (state = initialState, action) => {
  if (LOAD_DATA) {
      return {
          ...state,
          isLoading: action.isLoading
      };
  }
};

export default LoadReducer;
