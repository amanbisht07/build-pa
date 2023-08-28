import { OUTBOX_DATA_REQUEST, OUTBOX_DATA_SUCCESS, OUTBOX_DATA_FAILURE } from "app/camunda_redux/redux/constants/ActionTypes";

const initialState = {
    dataoutbox: [],
    loading: false,
    success: false,
    length: '',
    error: "",

};

const OutboxReducer = (state = initialState, action) => {
    switch (action.type) {
        case OUTBOX_DATA_REQUEST: {

            return {
                ...state,
                loading: true,
            }
        }
        case OUTBOX_DATA_SUCCESS: {

            return {
                ...state,
                loading: false,
                success: true,
                length: action.response.length,
                dataoutbox: action.response.Data,
            }
        }
        case OUTBOX_DATA_FAILURE: {

            return {
                ...state,
                loading: false,
                success: false,
                error: action.error,
            }
        }
        default:
            return {
                ...state,
            }
    }
};

export default OutboxReducer;
