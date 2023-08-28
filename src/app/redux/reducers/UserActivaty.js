
import { GET_REQUEST_DATA } from "app/camunda_redux/redux/constants/ActionTypes";
import { FAIL_REQUEST_DATA } from "app/camunda_redux/redux/constants/ActionTypes";
import { SET_REQUEST_DATA } from "app/camunda_redux/redux/constants/ActionTypes";

const TaskActionPointsState = {taskActionPoint:[]}

export const getTabledata = (state = TaskActionPointsState, action) => {
    switch (action.type) {
        case GET_REQUEST_DATA:
            return {
                ...state,
                loading: true,
                error: "",
            };

        case SET_REQUEST_DATA:
            return {
                ...state,
                loading: false,
                error: "",
                taskActionPoint: action.payload,
            };
        case FAIL_REQUEST_DATA:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };

        default:
            return state;
    }
};
