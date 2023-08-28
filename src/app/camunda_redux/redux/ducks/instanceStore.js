export const SET_INSTANCE = "teamly/settings/SET_INSTANCE";

const initialState = {
    instancePdf: ""
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_INSTANCE:
            const { instancePdf } = action;
            return {
                ...state,
                instancePdf
            };
        default:
            return state;
    }
};

export const setPdfInstance = (
    instancePdf
) => ({
    type: SET_INSTANCE,
    instancePdf
});
