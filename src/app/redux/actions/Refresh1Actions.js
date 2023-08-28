export const REFRESHS_DATA = "REFRESHS_DATA";

export const setRefresh1 = mount => {
    return dispatch => {
        dispatch({
            type: REFRESHS_DATA,
            mount: mount
        });
    };
};
