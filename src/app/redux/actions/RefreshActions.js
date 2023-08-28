export const REFRESH_DATA = "REFRESH_DATA";

export const setRefresh = mount => {
    return dispatch => {

        dispatch({
            type: REFRESH_DATA,
            mount: mount
        });
    };
};
