import { GET_ADMIN_DEPARTMENTS_REQUEST,GET_ADMIN_DEPARTMENTS_SUCCESS,GET_ADMIN_DEPARTMENTS_FAILURE } from '../../../camunda_redux/redux/constants/ActionTypes';

const initialState = {
  loading: false,
  success: false,
  departments: [],
  error: "",
};

const DepartmentsReducer = (state = initialState, action) => {
  
  switch (action.type) {
    case GET_ADMIN_DEPARTMENTS_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
      }

    case GET_ADMIN_DEPARTMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        departments: action.response,
      }

    case GET_ADMIN_DEPARTMENTS_FAILURE:
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
export default DepartmentsReducer;
