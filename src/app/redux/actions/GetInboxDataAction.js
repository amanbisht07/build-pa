import {
  GET_INBOXDATA_FAILURE,
  GET_INBOXDATA_SUCCESS,
  GET_INBOXDATA_REQUEST,
  GET_CHAIRMANINBOX_DETAILS_FAILURE,
  GET_CHAIRMANINBOX_DETAILS_SUCCESS,
  GET_CHAIRMANINBOX_DETAILS_REQUEST,
  APPROVE_CHAIRMAN_FAILURE,
  APPROVE_CHAIRMAN_SUCCESS,
  APPROVE_CHAIRMAN_REQUEST,
  REJECT_CHAIRMAN_FAILURE,
  REJECT_CHAIRMAN_SUCCESS,
  REJECT_CHAIRMAN_REQUEST,
  GET_CHAIRMANCOMMENT_REQUEST,
  GET_CHAIRMANCOMMENT_SUCCESS,
  GET_CHAIRMANCOMMENT_FAILURE,
  GET_USERATTENDEE_FAILURE,
  GET_USERATTENDEE_SUCCESS,
  GET_USERATTENDEE_REQUEST,
  USER_FORWORD_MEETING_FAILURE,
  USER_FORWORD_MEETING_REQUEST,
  USER_FORWORD_MEETING_SUCCESS,
  USER_ACCEPT_MEETING_REQUEST,
  USER_ACCEPT_MEETING_SUCCESS,
  USER_ACCEPT_MEETING_FAILURE,
  USER_REJECT_MEETING_REQUEST,
  USER_REJECT_MEETING_SUCCESS,
  USER_REJECT_MEETING_FAILURE,
} from "app/camunda_redux/redux/constants/ActionTypes";
import Axios from "axios";
import { toast } from "react-toastify";

export const getInboxDatas = () => {
  return (dispatch) => {
   const role = sessionStorage.getItem("role");
    // const username = JSON.parse(sessionStorage.getItem("userInfo")).username;

    dispatch({ type: GET_INBOXDATA_REQUEST });

    Axios.get("/meeting_service/api/getInboxData", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",

        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),

        roleName: role,
        // username: username,
      },
    })
      .then(({ data }) =>
        dispatch({
          type: GET_INBOXDATA_SUCCESS,
          payload: data,
        })
      )
      .catch((error) => {
        dispatch({ type: GET_INBOXDATA_FAILURE, payload: error });
      });
  };
};

export const ChairamInboxMeeting = (meetingId) => {
  return (dispatch) => {
   const role = sessionStorage.getItem("role");

    dispatch({ type: GET_CHAIRMANINBOX_DETAILS_REQUEST });

    Axios.get("/meeting_service/api/getMeetingById", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",

        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        meetingId: meetingId,
        roleName: role,
      },
    })
      .then(({ data }) =>
        dispatch({
          type: GET_CHAIRMANINBOX_DETAILS_SUCCESS,
          payload: data,
        })
      )
      .catch((error) => {
        dispatch({ type: GET_CHAIRMANINBOX_DETAILS_FAILURE, payload: error });
      });
  };
};

export const chairManApproveMeeting = (comment, meetingId, meetingPriority) => {
  return (dispatch) => {
   const role = sessionStorage.getItem("role");
    // const username = JSON.parse(sessionStorage.getItem("userInfo")).username;

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        meetingPriority: meetingPriority,
        meetingId: meetingId,
        roleName: role,
        // userName: username,
      },
    };

    dispatch({ type: APPROVE_CHAIRMAN_REQUEST });

    Axios.post("/meeting_service/api/approve", JSON.stringify({ comment }), config)
      .then((data) => {
        dispatch({
          type: APPROVE_CHAIRMAN_SUCCESS,
          payload: data,
        });
      })

      .catch((error) => {
        dispatch({ type: APPROVE_CHAIRMAN_FAILURE, payload: error });
      });
  };
};

export const chairManRejectMeeting = (meetingId, comment) => {
  return async (dispatch) => {
    // const username = JSON.parse(sessionStorage.getItem("userInfo")).username;

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        meetingId: meetingId,
        // userName: username,
      },
    };

    dispatch({ type: REJECT_CHAIRMAN_REQUEST });
    try {
      const res = await Axios.post(
        "/meeting_service/api/reject",
        JSON.stringify({ comment }),
        config
      );
      dispatch({
        type: REJECT_CHAIRMAN_SUCCESS,
        payload: res,
      });
    } catch (error) {
      dispatch({ type: REJECT_CHAIRMAN_FAILURE, payload: error });
    }
  };
};

export const getAllComments = (meetingId) => (dispatch) => {
  dispatch({ type: GET_CHAIRMANCOMMENT_REQUEST });

  Axios.get("/meeting_service/api/getAllComment", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf8",

      Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
      meetingId: meetingId,
    },
  })
    .then(({ data }) =>
      dispatch({
        type: GET_CHAIRMANCOMMENT_SUCCESS,
        payload: data,
      })
    )
    .catch((error) => {
      dispatch({ type: GET_CHAIRMANCOMMENT_FAILURE, payload: error });
    });
};

export const getuserAttendee = (meetingId) => {
  return (dispatch) => {
   // const username = JSON.parse(sessionStorage.getItem("userInfo")).username;
    dispatch({ type: GET_USERATTENDEE_REQUEST });

    Axios.get("/meeting_service/api/getUserAttedee", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",

        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        meetingId: meetingId,
        // deptUserName: username,
      },
    })
      .then(({ data }) =>
        dispatch({
          type: GET_USERATTENDEE_SUCCESS,
          payload: data,
        })
      )
      .catch((error) => {
        dispatch({ type: GET_USERATTENDEE_FAILURE, payload: error });
      });
  };
};

// export const userForwardMeeting = (values, meetingId) => (dispatch) => {
//   const username = JSON.parse(sessionStorage.getItem("userInfo")).username;
//   dispatch({ type: USER_FORWORD_MEETING_REQUEST });

//   Axios.post("/meeting_service/api//userForwardMeeting",JSON.stringify(values),
//    {
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json; charset=utf8",
//       Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
//       meetingId: meetingId,
//       deptUserName:username,

//     },
//   })
//     .then(({ data }) =>
//       dispatch({
//         type: USER_FORWORD_MEETING_SUCCESS,
//         payload: data,
//       })
//     )
//     .catch((error) => {
//       dispatch({ type: USER_FORWORD_MEETING_FAILURE, payload: error });
//     });
// };

export const userAcceptMeeting = (meetingId) => async (dispatch) => {
 // const username = JSON.parse(sessionStorage.getItem("userInfo")).username;
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf8",
      Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
      meetingId: meetingId,
      // deptUserName: username,
    },
  };

  try {
    dispatch({ type: USER_ACCEPT_MEETING_REQUEST });

    const res = await Axios.post("/meeting_service/api/userAcceptMeeting", {}, config);

    dispatch({
      type: USER_ACCEPT_MEETING_SUCCESS,
      payload: res.data,
    });
    toast.success(res.message);
  } catch (error) {
    dispatch({ type: USER_ACCEPT_MEETING_FAILURE, payload: error });
    toast.success(error);
  }
};

export const userRejectMeeting = (comment, meetingId) => {
  return (dispatch) => {
  
   //const username = JSON.parse(sessionStorage.getItem("userInfo")).username;
    dispatch({ type: USER_REJECT_MEETING_REQUEST });

    Axios.post("/meeting_service/api/userRejectMeeting", JSON.stringify({ comment }), {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        meetingId: meetingId,
        // deptUserName: username,
      },
    })
      .then(({ data }) =>
        dispatch({
          type: USER_REJECT_MEETING_SUCCESS,
          payload: data,
        })
      )
      .catch((error) => {
        dispatch({ type: USER_REJECT_MEETING_FAILURE, payload: error });
      });
  };
};
