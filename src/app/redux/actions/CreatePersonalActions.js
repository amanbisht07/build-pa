export const CREATE_PERSONAL_DATA = "CREATE_PERSONAL_DATA";

export const setCreatePersonal = mount => {
    return dispatch => {

        dispatch({
            type: CREATE_PERSONAL_DATA,
            mount: mount
        });
    };
};
