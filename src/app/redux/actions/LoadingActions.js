export const LOAD_DATA = "LOAD_DATA";

export const setLoadData = (isLoading) => dispatch => {
    dispatch({
        type: LOAD_DATA,
        isLoading: isLoading
    });
};
