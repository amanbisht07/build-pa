import {
  PA_DASHBOARD_REQUEST,
  PA_DASHBOARD_SUCCESS,
  PA_DASHBOARD_FAILURE,
} from "../../../camunda_redux/redux/constants/ActionTypes";

const initialState = {
  loading: false,
  success: false,
  getDashboardData: [],
  error: "",
};

const DashboardDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case PA_DASHBOARD_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
      };

    case PA_DASHBOARD_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        getDashboardData: action.response,
      };

    case PA_DASHBOARD_FAILURE:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.error,
      };

    default:
      return {
        ...state,
      };
  }
};
export default DashboardDataReducer;
