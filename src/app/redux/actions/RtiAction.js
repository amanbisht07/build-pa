import { SEND_FILES_SUCCESS } from "app/camunda_redux/redux/constants/ActionTypes";

export const RtiAction = id => {
    return dispatch => {

        dispatch({
            type: SEND_FILES_SUCCESS,
            payload: id
        });

    };
};
