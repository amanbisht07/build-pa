import { ADMIN_DBOARD_COUNT_REQUEST, ADMIN_DBOARD_COUNT_SUCCESS, ADMIN_DBOARD_COUNT_FAILURE } from '../../../camunda_redux/redux/constants/ActionTypes';

const initialState = {
  loading: false,
  success: false,
  adminDboard: [],
  error: "",
};

const AdminDasboardReducer = (state = initialState, action) => {
  
  switch (action.type) {
    case ADMIN_DBOARD_COUNT_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
      }

    case ADMIN_DBOARD_COUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        adminDboard: action.response,
      }

    case ADMIN_DBOARD_COUNT_FAILURE:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.error,
      };

    default:
      return {
        ...state
      };
  }
};
export default AdminDasboardReducer;
