import { UPDATE_SUBJECT } from "app/camunda_redux/redux/constants/ActionTypes";

const updateSubject = (state = {subject: "", id: ""}, action) => {
  switch (action.type) {
    case UPDATE_SUBJECT:
      return action.payload;
    default:
      return state;
  }
};

export default updateSubject;
