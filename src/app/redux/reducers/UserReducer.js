import {
  SET_USER_DATA,
  REMOVE_USER_DATA,
  USER_LOGGED_OUT,
} from "../actions/UserActions";

const initialState = {
  currentUserRole: {},
  UserRoles: [],
};

const userReducer = function (state = initialState, { type, role, roleArr }) {
  
  switch (type) {
    case SET_USER_DATA: {
      return {
        ...state,
        currentUserRole: role ? role : state.currentUserRole,
        UserRoles: roleArr ? roleArr : state.UserRoles,
      };
    }
    case REMOVE_USER_DATA: {
      return {
        ...state,
        currentUserRole: {},
        UserRoles: [],
      };
    }
    case USER_LOGGED_OUT: {
      return {
        ...state,
        currentUserRole: {},
        UserRoles: [],
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};

export default userReducer;
