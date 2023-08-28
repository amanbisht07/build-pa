export const SENT_DATA = "SENT_DATA";

export const setSent = mount => {
    return dispatch => {

        dispatch({
            type: SENT_DATA,
            mount: mount
        });
    };
};
