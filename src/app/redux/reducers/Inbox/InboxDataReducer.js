import { INBOX_DATA_SUCCESS, INBOX_DATA_REQUEST, INBOX_DATA_FAILURE } from "../../../camunda_redux/redux/constants/ActionTypes"


const initialState = {
    loading: false,
    success: false,
    error: '',
    getInboxData: [],
};

const getInboxData = (state = initialState, action) => {
    switch (action.type) {
        case INBOX_DATA_REQUEST: {
            return {
                ...state,
                loading: true,
                success: false,
                failure: false,
            }
        }
        case INBOX_DATA_SUCCESS: {
            return {
                ...state,
                loading: false,
                success: true,
                getInboxData: action.response.Data,
            }
        }
        case INBOX_DATA_FAILURE: {
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

}

export default getInboxData;

