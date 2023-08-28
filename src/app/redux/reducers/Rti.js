import { SEND_FILES_SUCCESS } from "app/camunda_redux/redux/constants/ActionTypes";

const initialState = {
    id: []
}

const rtiReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEND_FILES_SUCCESS:
            console.log(action)

            return {
                ...state,
                id: action.id

            }
        default:
            return state;
    }
};

export default rtiReducer;