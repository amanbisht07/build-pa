import {CREATE_PERSONAL_DATA} from "../actions/CreatePersonalActions";

const initialState = {
    mount: true
};

const CreatePersonalReducer = (state=initialState, action) => {

  if (action.type === CREATE_PERSONAL_DATA) {
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

export default CreatePersonalReducer;
