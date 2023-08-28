
import { PA_TABLE_REQUEST, PA_TABLE_SUCCESS, PA_TABLE_FAILURE } from '../../../camunda_redux/redux/constants/ActionTypes';

const initialState = {
    loading: false,
    success: false,
    getPAData: [],
    error: "",
};

const PATableReducer = (state = initialState, action) => {

    switch (action.type) {
        case PA_TABLE_REQUEST:

            return {
                ...state,
                loading: true,
                success: false,


            };
        case PA_TABLE_SUCCESS:

            return {
                ...state,
                loading: false,
                success: true,
                getPAData: action.response.data,
            };
        case PA_TABLE_FAILURE:

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

export default PATableReducer;
