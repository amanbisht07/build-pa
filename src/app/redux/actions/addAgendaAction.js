import Axios from "axios";

import {
  GET_AGENDA_FAILURE,
  GET_AGENDA_REQUEST,
  GET_AGENDA_SUCCESS,
  GET_ATTENDEES_FAILURE,
  GET_ATTENDEES_REQUEST,
  GET_ATTENDEES_SUCCESS,
  POST_AGENDA_FAILURE,
  POST_AGENDA_REQUEST,
  POST_AGENDA_SUCCESS,
  POST_ATTENDEES_FAILURE,
  POST_ATTENDEES_REQUEST,
  POST_ATTENDEES_SUCCESS,
  POST_EXTERNALATTENDEES_REQUEST,
  POST_EXTERNALATTENDEES_SUCCESS,
  POST_EXTERNALATTENDEES_FAILURE,
  GET_EXTERNALATTENDEES_REQUEST,
  GET_EXTERNALATTENDEES_SUCCESS,
  GET_EXTERNALATTENDEES_FAILURE,
  POST_AGENDA_DOCUMENT_REQUEST,
  POST_AGENDA_DOCUMENT_SUCCESS,
  POST_AGENDA_DOCUMENT_FAILURE,
  SEND_FILTER_DATA_REQUEST,
  SEND_FILTER_DATA_SUCCESS,
  SEND_FILTER_DATA_FAILURE,
  POST_ATTACH_DOCUMENT_REQUEST,
  POST_ATTACH_DOCUMENT_SUCCESS,
  POST_ATTACH_DOCUMENT_FAILURE,
  CREATE_MEETING_SUCCESS,
  CREATE_MEETING_FAILURE,
  CREATE_MEETING_REQUEST,
  FREEZE_AGENDA_FAILURE,
  FREEZE_AGENDA_REQUEST,
  FREEZE_AGENDA_SUCCESS,
} from "app/camunda_redux/redux/constants/ActionTypes";
import { toast } from "react-toastify";

export const addAgendass = ( meetingId,value) => async (dispatch) => {
const username = localStorage.getItem.username;

  const config = {
    headers: {
     
      "Content-Type": "multipart/form-data",
    
      Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),

      reqUser: username,
      meetingId: meetingId,
    },
  };

  try {
    dispatch({ type: POST_AGENDA_REQUEST });
    const res = await Axios.post(
      "/meeting_service/api/addAgenda",value,config
    );
    dispatch({
      type: POST_AGENDA_SUCCESS,
      payload: res.data.data,
    });
    toast.success(res.data.message)
  } catch (error) {
    dispatch({ type: POST_AGENDA_FAILURE, payload: error });
  }
};

export const getAgendass = (meetingId) => async (dispatch) => {
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

  try {
    dispatch({ type: GET_AGENDA_REQUEST });
    const res = await Axios.get("/meeting_service/api/getmeetingAgenda", config);
    console.log(res);
    dispatch({
      type: GET_AGENDA_SUCCESS,
      payload: res.data.agenda,
    });
  } catch (error) {
    dispatch({ type: GET_AGENDA_FAILURE, payload: error });
  }
};

export const addAttendees = (value, meetingId) => async (dispatch) => {
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

  try {
    dispatch({ type: POST_ATTENDEES_REQUEST });
    const res = await Axios.post(
      "/meeting_service/api/addAttendees",
      JSON.stringify(value),
      config
    );

    dispatch({
      type: POST_ATTENDEES_SUCCESS,
      payload: res.data,
    });

    toast.success(res.data.message);
  } catch (error) {
    console.log(error.message);
    toast.error(error.message);
    dispatch({ type: POST_ATTENDEES_FAILURE, payload: error });
  }
};

export const getAllAttendees = (meetingId) => (dispatch) => {
 const role = sessionStorage.getItem("role");

  dispatch({ type: GET_ATTENDEES_REQUEST });
  Axios.get("/meeting_service/api/getAttendees", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf8",

      Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),

      roleName: role,
      meetingId: meetingId,
    },
  })
    .then(({ data }) =>
      dispatch({
        type: GET_ATTENDEES_SUCCESS,
        payload: data,
      })
    )
    .catch((error) => {
      dispatch({ type: GET_ATTENDEES_FAILURE, payload: error });
    });
};

export const postExternalAttendees = (meetingId, value) => (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf8",

      Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),

      meetingId: meetingId,
    },
  };

  dispatch({ type: POST_EXTERNALATTENDEES_REQUEST });
  Axios.post("/meeting_service/api/addExternalAttendee", JSON.stringify(value), config)
    .then(({ data }) => {
      console.log(data);
      dispatch({
        type: POST_EXTERNALATTENDEES_SUCCESS,
        payload: data,
      });
    })
    .catch((error) => {
      console.log(error);
      dispatch({ type: POST_EXTERNALATTENDEES_FAILURE, payload: error });
    });
};

export const getExternalAttendees = (meetingId) => async (dispatch) => {
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

  dispatch({ type: GET_EXTERNALATTENDEES_REQUEST });
  Axios.get("/meeting_service/api/getExternalAttendee", config)
    .then((data) => {
      dispatch({
        type: GET_EXTERNALATTENDEES_SUCCESS,
        payload: data,
      });
    })

    .catch((error) => {
      dispatch({ type: GET_EXTERNALATTENDEES_FAILURE, payload: error });
    });
};

export const postAgendaDocument = (meetingId, file) => async (dispatch) => {
const username = localStorage.getItem.username;
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      "Content-Type": "application/json; charset=utf8",

      Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),

      meetingId: meetingId,
      reqUser: username,
    },
  };

  try {
    dispatch({ type: POST_AGENDA_DOCUMENT_REQUEST });
    const res = await Axios.post("/meeting_service/api/addDocAgenda", file, config);
    console.log(res);

    dispatch({
      type: POST_AGENDA_DOCUMENT_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    console.log(error);
    dispatch({ type: POST_AGENDA_DOCUMENT_FAILURE, payload: error });
    toast.error(error.message);
  }
};

export const agendaFreeze = (meetingId) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf8",
      Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
      meetingId: meetingId,
    },
  };
  try {
    dispatch({ type: FREEZE_AGENDA_REQUEST });
    const res = await Axios.post("/meeting_service/api/freezeAgenda", {}, config);

    dispatch({
      type: FREEZE_AGENDA_SUCCESS,
      payload: res.data,
    });
    toast.success(res.data.message);
  } catch (error) {
    dispatch({ type: FREEZE_AGENDA_FAILURE, payload: error });
    toast.error(error.message);
  }
};

export const PostAttachDocument = (meetingId, decisionId, file) => {
  return (dispatch) => {
  const username = localStorage.getItem.username;

    dispatch({ type: POST_ATTACH_DOCUMENT_REQUEST });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",

        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        meetingId: meetingId,
        decisionId: decisionId,
        username: username,
      },
    };
    Axios.post("/meeting_service/api/attachDocument", file, config)
      .then((data) => {
       
        dispatch({ type: POST_ATTACH_DOCUMENT_SUCCESS, payload: data });
        toast.success(data.status)
      })
      .catch((error) => {
        dispatch({ type: POST_ATTACH_DOCUMENT_FAILURE, payload: error });
      });
  };
}; 
  
export const sendfillterdata =
  (meetingStatus, status, isMeetingStatus) => async (dispatch) => {
  const username = localStorage.getItem.username;
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        meetingStatus,
        status,
        userId: userName,
        isMeetingStatus,
      },
    };

    try {
      dispatch({ type: SEND_FILTER_DATA_REQUEST });
      const res = await Axios.post("/meeting_service/api/fetchAllWithStatus", {}, config);
      // console.log(res.data)

      let arr = res.data.data.map((item, i) => {
        return {
          ...item,
          StartTime: item.date,
          EndTime: item.date,
          Subject: item.subject,
        };
      });

      dispatch({
        type: SEND_FILTER_DATA_SUCCESS,
        payload: arr,
      });
    } catch (error) {
      dispatch({ type: SEND_FILTER_DATA_FAILURE, payload: error });
    }
  };

export const createMeeting = (value) => async (dispatch) => {
 const role = sessionStorage.getItem("role");
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf8",

      Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
      roleName: role,
    },
  };

  try {
    dispatch({ type: CREATE_MEETING_REQUEST });
    const startDate = value.dt.toISOString().slice(0, 16);
    const date = value.date
    console.log(date,"fdxnfj")
 
    

    const res = await Axios.post(
      "/meeting_service/api/create",
      JSON.stringify({ ...value,startDate,date }),
      config
    );
    console.log(res);
    dispatch({ type: CREATE_MEETING_SUCCESS, payload: res });
  } catch (error) {
    dispatch({ type: CREATE_MEETING_FAILURE, payload: error });

    console.log(error);
  }
};
