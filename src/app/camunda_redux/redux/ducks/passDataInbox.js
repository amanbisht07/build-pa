export const SET_INBOX_PASSDATA = "teamly/settings/SET_INBOX_PASSDATA";

const initialState = {
    messageToPassInboxUrl: ""
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_INBOX_PASSDATA:
            const { messageToPassInboxUrl } = action;
            return {
                ...state,
                messageToPassInboxUrl
            };
        default:
            return state;
    }
};

export const setInboxPassData = (
    messageToPassInboxUrl
) => ({
    type: SET_INBOX_PASSDATA,
    messageToPassInboxUrl
});
