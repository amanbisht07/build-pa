import {
  PADRAFT_REQUEST,
  PADRAFT_SUCCESS,
  PADRAFT_FAILURE,
} from "../../../camunda_redux/redux/constants/ActionTypes";

const initialState = {
  loading: false,
  success: false,
  draftTableData: [],
  error: "",
};

const DraftTableReducer = (state = initialState, action) => {
  switch (action.type) {
    case PADRAFT_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case PADRAFT_SUCCESS: {
      return {
        ...state,
        success: true,
        draftTableData: action.response.data,
        loading: false,
      };
    }
    case PADRAFT_FAILURE: {
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    }
    default:
      return {
        ...state,
      };
  }
};

export default DraftTableReducer;
