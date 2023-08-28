export const CREATE_FILE_DATA = "CREATE_FILE_DATA";

export const setCreateFile = mount => {
    return dispatch => {

        dispatch({
            type: CREATE_FILE_DATA,
            mount: mount
        });
    };
};
