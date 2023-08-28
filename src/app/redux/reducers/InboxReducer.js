import {INBOX_DATA} from "../actions/InboxActions";


const initialState = {
    datainbox: {}
};

const InboxReducer = (state=initialState, action) => {
  if (action.type === INBOX_DATA) {
      return {
          ...state,
          datainbox: action.datainbox
      };
  }
  else {
      return {
          ...state
      };
  }
};

export default InboxReducer;
