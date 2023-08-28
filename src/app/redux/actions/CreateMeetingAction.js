import axios from "axios";
import {
  GET_DEPARTMENT_REQUEST,
  GET_DEPARTMENT_SUCCESS,
  GET_DEPARTMENT_FAILURE,
  CREATE_MEETING_FAILURE,
  CREATE_MEETING_REQUEST,
  CREATE_MEETING_SUCCESS,
  GET_USERNAME_FAILURE,
  GET_USERNAME_SUCCESS,
  GET_USERNAME_REQUEST,
  GET_MEETING_REQUEST,
  GET_MEETING_FAILURE,
  GET_MEETING_SUCCESS,
  GET_MEETINGDEPT_FAILURE,
  GET_MEETINGDEPT_REQUEST,
  GET_MEETINGDEPT_SUCCESS,
  GET_ATTENDEES_FAILURE,
  GET_ATTENDEES_REQUEST,
  GET_ATTENDEES_SUCCESS,
  SEND_CHAIRMAN_FAILURE,
  SEND_CHAIRMAN_REQUEST,
  SEND_CHAIRMAN_SUCCESS,
  POST_ATTENDEES_REQUEST,
  POST_ATTENDEES_SUCCESS,
  POST_ATTENDEES_FAILURE,
  RESHEDULE_MEETING_REQUEST,
  RESHEDULE_MEETING_SUCCESS,
  RESHEDULE_MEETING_FAILURE,
  INITIATOR_CANCELMEETING_REQUEST,
  INITIATOR_CANCELMEETING_FAILURE,
  INITIATOR_CANCELMEETING_SUCCESS,
  INITIATOR_DECISION_MEETING_REQUEST,
  INITIATOR_DECISION_MEETING_SUCCESS,
  INITIATOR_DECISION_MEETING_FAILURE,
  INITIATOR_GET_DECISION_MEETING_REQUEST,
  INITIATOR_GET_DECISION_MEETING_FAILURE,
  INITIATOR_GET_DECISION_MEETING_SUCCESS,
  INITIATOR_POST_TASK_REQUEST,
  INITIATOR_POST_TASK_SUCCESS,
  INITIATOR_POST_TASK_FAILURE,
  INITIATOR_GET_TASK_REQUEST,
  INITIATOR_GET_TASK_SUCCESS,
  INITIATOR_GET_TASK_FAILURE,
  POST_ATTACH_DOCUMENT_FAILURE,
  POST_ATTACH_DOCUMENT_SUCCESS,
  POST_ATTACH_DOCUMENT_REQUEST,
  GET_ATTACH_DOCUMENT_FAILURE,
  GET_ATTACH_DOCUMENT_SUCCESS,
  GET_ATTACH_DOCUMENT_REQUEST,
  POST_MEETINGMEMO_REQUEST,
  POST_MEETINGMEMO_SUCCESS,
  POST_MEETINGMEMO_FAILURE,
  GET_MEETINGMEMO_REQUEST,
  GET_MEETINGMEMO_SUCCESS,
  GET_MEETINGMEMO_FAILURE,
  GET_GROUP_REQUEST,
  GET_GROUP_SUCCESS,
  GET_GROUP_FAILURE,
  POST_EXTERNALATTENDEES_REQUEST,
  POST_EXTERNALATTENDEES_SUCCESS,
  POST_EXTERNALATTENDEES_FAILURE,
  GET_EXTERNALATTENDEES_REQUEST,
  GET_EXTERNALATTENDEES_SUCCESS,
  GET_EXTERNALATTENDEES_FAILURE,
  GET_AGENDA_FAILURE,
  GET_AGENDA_REQUEST,
  GET_AGENDA_SUCCESS,
  POST_AGENDA_FAILURE,
  POST_AGENDA_REQUEST,
  POST_AGENDA_SUCCESS,
} from "app/camunda_redux/redux/constants/ActionTypes";
import { toast } from "react-toastify";

export const getDepartment = () => {
  return async (dispatch) => {
    dispatch({ type: GET_DEPARTMENT_REQUEST });
    try {
      const response = await fetch("/meeting_service/api//getDepartment", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),

          Accept: "application/json",
        },
      });
      const data = await response.json();
      dispatch({ type: GET_DEPARTMENT_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: GET_DEPARTMENT_FAILURE, payload: err });
    }
  };
};

export const getuserName = (dep) => {
  return async (dispatch) => {
    dispatch({ type: GET_USERNAME_REQUEST });
    try {
      const response = await fetch("/meeting_service/api//getUserName", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
          deptName: dep,
        },
      });
      const data = await response.json();
      dispatch({ type: GET_USERNAME_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: GET_USERNAME_FAILURE, payload: err });
    }
  };
};

export const createMeeting = (value) => (dispatch) => {
 const role = sessionStorage.getItem("role");
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf8",

      Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
      role: role,
    },
  };
  dispatch({ type: CREATE_MEETING_REQUEST });
  axios
    .post("/meeting_service/api/create", JSON.stringify(value), config)
    .then((data) => {
      dispatch({ type: CREATE_MEETING_SUCCESS, payload: data });
    })
    .catch((error) => {
      dispatch({ type: CREATE_MEETING_FAILURE, payload: error });
    });
};

export const getAllMeeting = () => async (dispatch) => {
  const username = localStorage.getItem("username");
  const role = sessionStorage.getItem("role");
  dispatch({ type: GET_MEETING_REQUEST });
  try {
    const config = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),

        userName: username,
        role:role
      },
    };
    const response = await axios.get("/meeting_service/api/getCalendar", config);

    let arr = response.data.data.map((item, i) => {
      return {
        ...item,
        StartTime: item.date,
        EndTime: item.date,
        Subject: item.subject,
      };
    });
    console.log(arr);
    dispatch({ type: GET_MEETING_SUCCESS, payload: arr });
  } catch (err) {
    dispatch({ type: GET_MEETING_FAILURE, payload: err });
    toast.error(err.message);
  }
};

export const getAllMeetingDepartment = (meetingId) => {
 const role = sessionStorage.getItem("role");
  return async (dispatch) => {
    dispatch({ type: GET_MEETINGDEPT_REQUEST });
    try {
      const response = await fetch("/meeting_service/api/getMeetingDepartment", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
          roleName: role,
          meetingId: meetingId,
        },
      });
      const data = await response.json();
      dispatch({ type: GET_MEETINGDEPT_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: GET_MEETINGDEPT_FAILURE, payload: err });
    }
  };
};

export const addAttendees = (value, meetingId, CB) => {
  return (dispatch) => {
    dispatch({ type: POST_ATTENDEES_REQUEST });

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        meetingId: meetingId,
      },
    };

    axios
      .post("/meeting_service/api/addAttendees", JSON.stringify(value), config)
      .then(({ data }) => {
        dispatch({
          type: POST_ATTENDEES_SUCCESS,
          payload: data,
        });
        CB();
      })

      .catch((error) => {
        dispatch({ type: POST_ATTENDEES_FAILURE, payload: error });
      });
  };
};

export const getAllAttendees = (meetingId) => {
  return (dispatch) => {
   const role = sessionStorage.getItem("role");

    dispatch({ type: GET_ATTENDEES_REQUEST });

    axios
      .get("/meeting_service/api/getAttendees", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
          roleName: role,
          meetingId: meetingId,
        },
      })
      .then((data) => {
        dispatch({ type: GET_ATTENDEES_SUCCESS, payload: data });
      })
      .catch((error) => {
        dispatch({ type: GET_ATTENDEES_FAILURE, payload: error });
      });
  };
};

export const sendToChairman = (meetingId, CB) => {
  return (dispatch) => {
   const role = sessionStorage.getItem("role");

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",

        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName: role,
        meetingId: meetingId,
      },
    };
    dispatch({ type: SEND_CHAIRMAN_REQUEST });

    axios
      .post("/meeting_service/api/sendToChairman", {}, config)
      .then((data) => {
        dispatch({
          type: SEND_CHAIRMAN_SUCCESS,
          payload: data,
        });
        toast.success("Meeting create Successfully !");
        CB();
      })

      .catch((error) => {
        dispatch({ type: SEND_CHAIRMAN_FAILURE, payload: error });
      });
  };
};

export const reScheduleMeeting = (meetingId, comment, meeting) => {
  return (dispatch) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",

        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),

        meetingId: meetingId,
        comment: comment,
      },
    };
    dispatch({ type: RESHEDULE_MEETING_REQUEST });

    axios
      .post("/meeting_service/api/rescheduledMeeting", JSON.stringify(meeting), config)
      .then((data) => {
        dispatch({ type: RESHEDULE_MEETING_SUCCESS, payload: data });
      })
      .catch((error) => {
        dispatch({ type: RESHEDULE_MEETING_FAILURE, payload: error });
      });
  };
};

export const InitiatorCancelMeeting = (meetingId) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf8",

      Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
      meetingId:meetingId
     
    },
  };
  try {
    dispatch({ type: INITIATOR_CANCELMEETING_REQUEST });

    const res = await axios.post("/meeting_service/api/cancelMeeting", {}, config);
toast.success(res.data.message)
    dispatch({ type: INITIATOR_CANCELMEETING_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: INITIATOR_CANCELMEETING_FAILURE, payload: error });
    toast.error(error)
  }
};

export const InitiatorPostDecision = (decision) => (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf8",
      Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
    },
  };
  try {
    dispatch({ type: INITIATOR_DECISION_MEETING_REQUEST });
    axios
      .post("/meeting_service/api//decision", JSON.stringify(decision), config)
      .then((data) => {
        dispatch({ type: INITIATOR_DECISION_MEETING_SUCCESS, payload: data });
        toast.success("Decision Add Successfully !");
      })
      .catch((error) => {
        dispatch({ type: INITIATOR_DECISION_MEETING_FAILURE, payload: error });
      });
  } catch (error) {
    dispatch({ type: INITIATOR_DECISION_MEETING_FAILURE, payload: error });
    toast.error(error.message);
  }
};

export const InitiatorGetAllDecision = (meetingId) => {
  return (dispatch) => {
    dispatch({ type: INITIATOR_GET_DECISION_MEETING_REQUEST });

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",

        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        meetingId: meetingId,
      },
    };
    axios
      .get("/meeting_service/api/Getdecision", config)
      .then((data) => {
        dispatch({
          type: INITIATOR_GET_DECISION_MEETING_SUCCESS,
          payload: data,
        });
      })
      .catch((error) => {
        dispatch({
          type: INITIATOR_GET_DECISION_MEETING_FAILURE,
          payload: error,
        });
      });
  };
};

export const InitiatorPostTask = (decisionId, task) => (dispatch) => {
  dispatch({ type: INITIATOR_POST_TASK_REQUEST });

  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf8",

      Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
      decisionId: decisionId,
    },
  };
  axios
    .post("/meeting_service/api//task", JSON.stringify(task), config)
    .then((data) => {
      dispatch({ type: INITIATOR_POST_TASK_SUCCESS, payload: data });
    })
    .catch((error) => {
      dispatch({
        type: INITIATOR_POST_TASK_FAILURE,
        payload: error,
      });
    });
};

export const InitiatorGetTask = (meetingId) => {
  return (dispatch) => {
    dispatch({ type: INITIATOR_GET_TASK_REQUEST });

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",

        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        meetingId: meetingId,
      },
    };
    axios
      .get("/meeting_service/api/getTask", config)
      .then((data) => {
        dispatch({ type: INITIATOR_GET_TASK_SUCCESS, payload: data });
      })
      .catch((error) => {
        dispatch({
          type: INITIATOR_GET_TASK_FAILURE,
          payload: error,
        });
      });
  };
};

// export const PostAttachDocument = (meetingId, decisionId, file) => {
//   return (dispatch) => {
//     const username = JSON.parse(sessionStorage.getItem("userInfo")).username;

//     dispatch({ type: POST_ATTACH_DOCUMENT_REQUEST });

//     const config = {
//       headers: {
//         "Content-Type": "multipart/form-data",

//         Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
//         meetingId: meetingId,
//         decisionId: decisionId,
//         username: username,
//       },
//     };
//     axios
//       .post("/meeting_service/api//attachDocument", file, config)
//       .then((data) => {
//         dispatch({ type: POST_ATTACH_DOCUMENT_SUCCESS, payload: data });
//       })
//       .catch((error) => {
//         dispatch({ type: POST_ATTACH_DOCUMENT_FAILURE, payload: error });
//       });
//   };
// };

export const GetAttachDocument = (meetingId) => {
  return (dispatch) => {
    dispatch({ type: GET_ATTACH_DOCUMENT_REQUEST });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",

        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        meetingId: meetingId,
      },
    };
    axios
      .get("/meeting_service/api/getDocument", config)
      .then((data) => {
        dispatch({ type: GET_ATTACH_DOCUMENT_SUCCESS, payload: data });
      })
      .catch((error) => {
        dispatch({ type: GET_ATTACH_DOCUMENT_FAILURE, payload: error });
      });
  };
};

export const postMeetingMemo = (meetingId, Attendees) => {
  return (dispatch) => {
    dispatch({ type: POST_MEETINGMEMO_REQUEST });

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",

        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        meetingId: meetingId,
      },
    };
    axios
      .post("/meeting_service/api//meetingMemo", JSON.stringify(Attendees), config)
      .then((data) => {
        dispatch({ type: POST_MEETINGMEMO_SUCCESS, payload: data });
      })
      .catch((error) => {
        dispatch({
          type: POST_MEETINGMEMO_FAILURE,
          payload: error,
        });
      });
  };
};

export const getMeetingMemo = (meetingId) => {
  return (dispatch) => {
    dispatch({ type: GET_MEETINGMEMO_REQUEST });

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",

        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        meetingId: meetingId,
      },
    };
    axios
      .get("/meeting_service/api/getmeetingMemo", config)
      .then((data) => {
        dispatch({ type: GET_MEETINGMEMO_SUCCESS, payload: data });
      })
      .catch((error) => {
        dispatch({
          type: GET_MEETINGMEMO_FAILURE,
          payload: error,
        });
      });
  };
};

export const getAttendingGroup = () => {
  return (dispatch) => {
    dispatch({ type: GET_GROUP_REQUEST });

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",

        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
      },
    };
    axios
      .get("/meeting_service/api/getGroups", config)
      .then((data) => {
        dispatch({ type: GET_GROUP_SUCCESS, payload: data });
      })
      .catch((error) => {
        dispatch({
          type: GET_GROUP_FAILURE,
          payload: error,
        });
      });
  };
};

export const postExternalAttendees = (meetingId, value) => (dispatch) => {
  dispatch({ type: POST_EXTERNALATTENDEES_REQUEST });

  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf8",
      Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
      meetingId: meetingId,
    },
  };

  axios
    .post("/meeting_service/api/addExternalAttendee", JSON.stringify(value), config)
    .then(({ data }) => {
      dispatch({ type: POST_EXTERNALATTENDEES_SUCCESS, payload: data });
    })

    .catch((error) => {
      dispatch({ type: POST_EXTERNALATTENDEES_FAILURE, payload: error });
    });
};

export const getExternalAttendees = (meetingId) => (dispatch) => {
  dispatch({ type: GET_EXTERNALATTENDEES_REQUEST });
  const config = {
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),

      meetingId: meetingId,
    },
  };
  axios
    .get("/meeting_service/api/getExternalAttendee", config)
    .then((data) => {
      dispatch({ type: GET_EXTERNALATTENDEES_SUCCESS, payload: data });
    })
    .catch((error) => {
      dispatch({ type: GET_EXTERNALATTENDEES_FAILURE, payload: error });
    });
};

// export const   addAgendass = (value, meetingId) => (dispatch) => {
//  const role = sessionStorage.getItem("role");

//   const config = {
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json; charset=utf8",

//       Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),

//       roleName: role,
//       meetingId: meetingId,
//     },
//   };
//   dispatch({ type: POST_AGENDA_REQUEST });
//   axios.post("/meeting_service/api//addAgenda",JSON.stringify(value), config)

//     .then(({data}) => {
//       dispatch({ type: POST_AGENDA_SUCCESS, payload: data });
//     })
//     .catch((error) => {
//       dispatch({ type: POST_AGENDA_FAILURE, payload: error });
//     });
// };

// export const getAgendass = (meetingId) => (dispatch) => {
//  const role = sessionStorage.getItem("role");

//   const config = {
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json; charset=utf8",

//       Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),

//       roleName: role,
//       meetingId: meetingId,
//     },
//   };

//     dispatch({ type: GET_AGENDA_REQUEST });
//      axios.get("/meeting_service/api//getmeetingAgenda", config)
//   .then(({data})=>{

//     dispatch({
//       type: GET_AGENDA_SUCCESS,
//       payload: data,
//     });
//   })

//    .catch ((error)=>{

//      dispatch({ type: GET_AGENDA_FAILURE, payload: error })
//    })
//   }
