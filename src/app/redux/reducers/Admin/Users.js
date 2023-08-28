import { GET_ADMIN_USERS_REQUEST,GET_ADMIN_USERS_SUCCESS,GET_ADMIN_USERS_FAILURE } from '../../../camunda_redux/redux/constants/ActionTypes';

const initialState = {
  loading: false,
  success: false,
  users: [],
  error: "",
};

const UsersReducer = (state = initialState, action) => {
  
  switch (action.type) {
    case GET_ADMIN_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
      }

    case GET_ADMIN_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        users: action.response,
      }

    case GET_ADMIN_USERS_FAILURE:
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
export default UsersReducer;
