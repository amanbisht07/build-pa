import Axios from "axios";

export const advanceSearch = (data) => async (dispatch) => {
  try {
    const res = await Axios.get(`/esearch/advance-search`);
    dispatch({
      type: ADVANCE_SEARCH,
      payload: {
        token: res.data.access_token,
        user: res.data.user,
      },
    });
    localStorage.setItem("firstLogin", true);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        success: res.data.msg,
      },
    });
  } catch (error) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: error.response.data.msg,
      },
    });
  }
};