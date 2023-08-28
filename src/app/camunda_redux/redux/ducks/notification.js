export const NOTIFICATION_LENGTH = "NOTIFICATION_LENGTH";



const initialState = {
    notificationLength: 0,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case NOTIFICATION_LENGTH:
            const { notificationLength } = action;
            return {
                ...state,
                notificationLength
            };
        default:
            return state;
    }
};

export const notificationFun = (
    notificationLength
) => ({
    type: NOTIFICATION_LENGTH,
    notificationLength
});