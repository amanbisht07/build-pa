import { GET_ADMIN_ROLES_REQUEST,GET_ADMIN_ROLES_SUCCESS,GET_ADMIN_ROLES_FAILURE } from '../../../camunda_redux/redux/constants/ActionTypes';

const initialState = {
  loading: false,
  success: false,
  roles: [],
  error: "",
};

const RolesReducer = (state = initialState, action) => {
  
  switch (action.type) {
    case GET_ADMIN_ROLES_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
      }

    case GET_ADMIN_ROLES_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        roles: action.response,
      }

    case GET_ADMIN_ROLES_FAILURE:
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
export default RolesReducer;
