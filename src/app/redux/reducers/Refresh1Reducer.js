import { REFRESHS_DATA } from "../actions/Refresh1Actions";


const initialState = {
    mount: true
};

const Refresh1Reducer = (state = initialState, action) => {

    if (action.type === REFRESHS_DATA) {
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

export default Refresh1Reducer;
