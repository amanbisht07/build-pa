import {CREATE_FILE_DATA} from "../actions/CreateFileActions";

const initialState = {
    mount: true
};

const CreateFileReducer = (state=initialState, action) => {

  if (action.type === CREATE_FILE_DATA) {
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

export default CreateFileReducer;
