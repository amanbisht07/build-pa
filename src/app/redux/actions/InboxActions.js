export const INBOX_DATA = "INBOX_DATA";

export const setInboxDatas = datainbox => {
    return dispatch => {

        dispatch({
            type: INBOX_DATA,
            datainbox: datainbox
        });
    };
};
