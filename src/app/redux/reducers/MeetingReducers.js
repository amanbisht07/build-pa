import {
  GET_DEPARTMENT_REQUEST,
  GET_DEPARTMENT_SUCCESS,
  GET_DEPARTMENT_FAILURE,
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
  POST_ATTENDEES_REQUEST,
  POST_ATTENDEES_SUCCESS,
  POST_ATTENDEES_FAILURE,
  GET_CHAIRMANCOMMENT_REQUEST,
  GET_CHAIRMANCOMMENT_SUCCESS,
  GET_CHAIRMANCOMMENT_FAILURE,
  GET_USERATTENDEE_REQUEST,
  GET_USERATTENDEE_SUCCESS,
  USER_FORWORD_MEETING_REQUEST,
  USER_FORWORD_MEETING_SUCCESS,
  USER_FORWORD_MEETING_FAILURE,
  USER_ACCEPT_MEETING_REQUEST,
  USER_ACCEPT_MEETING_SUCCESS,
  USER_ACCEPT_MEETING_FAILURE,
  USER_REJECT_MEETING_REQUEST,
  USER_REJECT_MEETING_SUCCESS,
  USER_REJECT_MEETING_FAILURE,
  GET_AGENDA_FAILURE,
  GET_AGENDA_REQUEST,
  GET_AGENDA_SUCCESS,
  POST_AGENDA_FAILURE,
  POST_AGENDA_REQUEST,
  POST_AGENDA_SUCCESS,
  RESHEDULE_MEETING_REQUEST,
  RESHEDULE_MEETING_SUCCESS,
  RESHEDULE_MEETING_FAILURE,
  INITIATOR_CANCELMEETING_REQUEST,
  INITIATOR_CANCELMEETING_SUCCESS,
  INITIATOR_CANCELMEETING_FAILURE,
  INITIATOR_DECISION_MEETING_REQUEST,
  INITIATOR_DECISION_MEETING_SUCCESS,
  INITIATOR_DECISION_MEETING_FAILURE,
  INITIATOR_POST_TASK_REQUEST,
  INITIATOR_POST_TASK_SUCCESS,
  INITIATOR_POST_TASK_FAILURE,
  INITIATOR_GET_TASK_REQUEST,
  INITIATOR_GET_TASK_SUCCESS,
  INITIATOR_GET_TASK_FAILURE,
  INITIATOR_GET_DECISION_MEETING_REQUEST,
  INITIATOR_GET_DECISION_MEETING_SUCCESS,
  INITIATOR_GET_DECISION_MEETING_FAILURE,
  POST_ATTACH_DOCUMENT_REQUEST,
  POST_ATTACH_DOCUMENT_SUCCESS,
  POST_ATTACH_DOCUMENT_FAILURE,
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
  POST_AGENDA_DOCUMENT_REQUEST,
  POST_AGENDA_DOCUMENT_SUCCESS,
  POST_AGENDA_DOCUMENT_FAILURE,
  FREEZE_AGENDA_REQUEST,
  FREEZE_AGENDA_SUCCESS,
  FREEZE_AGENDA_FAILURE,
  SEND_FILTER_DATA_REQUEST,
  SEND_FILTER_DATA_SUCCESS,
  SEND_FILTER_DATA_FAILURE,
} from "app/camunda_redux/redux/constants/ActionTypes";

const departmentState = {
  error: "",
  loading: false,
  department: [],
};






export const getDepartment = (state = departmentState, action) => {
  switch (action.type) {
    case GET_DEPARTMENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case GET_DEPARTMENT_SUCCESS:
      return {
        ...state,
        department: action.payload.data,
        loading: false,
      };

    case GET_DEPARTMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};

export const getuserName = (state = { userName: [] }, action) => {
  switch (action.type) {
    case GET_USERNAME_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_USERNAME_SUCCESS:
      return {
        ...state,
        userName: action.payload.data,
        loading: false,
      };

    case GET_USERNAME_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};

export const getAllMeeting = (state = { getAllMeeting: [] }, action) => {
  switch (action.type) {
    case GET_MEETING_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_MEETING_SUCCESS:
      return {
        ...state,
        getAllMeeting: action.payload,
        loading: false,
      };

    case GET_MEETING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case SEND_FILTER_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        // error: "",
      };

    case SEND_FILTER_DATA_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        loading: false,

        getAllMeeting: action.payload,
      };
    case SEND_FILTER_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        // error: action.payload.error,
      };
    default:
      return state;
  }
};

export const getAllMeetingDepartment = (
  state = { meetingDept: [] },
  action
) => {
  switch (action.type) {
    case GET_MEETINGDEPT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_MEETINGDEPT_SUCCESS:
      return {
        ...state,
        meetingDept: action.payload.data,
        loading: false,
      };

    case GET_MEETINGDEPT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};

// const agendaInitialState = {
//   loading: false,
//   error: "",
//   getAgendaData: [],
// };

// export const AgendaReducer = (state=agendaInitialState,action)=>{

//   switch (action.type) {
//     case  GET_AGENDA_REQUEST:
//       return {
//         ...state,
//         loading: true,
//       };
//     case GET_AGENDA_SUCCESS:
//       return {
//         ...state,
//         getAgendaData: action.payload.data,
//         loading: false,
//       };

//     case GET_AGENDA_FAILURE:
//       return {
//         ...state,
//         loading: false,
//         error: response.data.error,
//       };

//       case POST_AGENDA_REQUEST:
//       return {
//         ...state,
//         loading: true,
//         error:"",
//       };
//     case POST_AGENDA_SUCCESS:
//       return {
//         ...state,
//         getAgendaData: [...state.getAgendaData,action.payload.data],
//         loading: false,
//       };

//     case POST_AGENDA_FAILURE:
//       return {
//         ...state,
//         loading: false,
//         error: action.payload.error,
//       };

//     default:
//       return state;
//   }

// }

const MeetingAttendees = {
  getAttendees: [],
  loading: false,
  error: "",
};

export const AttendeesReducer = (state = MeetingAttendees, action) => {
  switch (action.type) {
    case GET_ATTENDEES_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_ATTENDEES_SUCCESS:
      return {
        ...state,
        getAttendees: action.payload.data,
        loading: false,
      };

    case GET_ATTENDEES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };

    case POST_ATTENDEES_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case POST_ATTENDEES_SUCCESS:
      return {
        ...state,
        getAttendees: [...state.getAttendees, action.payload.data],
        loading: false,
        error: "",
      };

    case POST_ATTENDEES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };

    default:
      return state;
  }
};

// export const addAttendees = (state = { addAttendees: [] }, action) => {
//   switch (action.type) {
//     case POST_ATTENDEES_REQUEST:
//       return {
//         ...state,
//         loading: true,
//       };
//     case POST_ATTENDEES_SUCCESS:
//       return {
//         ...state,
//         getAttendees: action.payload.data,
//         loading: false,
//       };

//     case POST_ATTENDEES_FAILURE:
//       return {
//         ...state,
//         loading: false,
//         error: response.data.error,
//       };

//     default:
//       return state;
//   }
// };

// export const getAllAttendees = (state = { getAttendees: [] }, action) => {
//   switch (action.type) {
//     case GET_ATTENDEES_REQUEST:
//       return {
//         ...state,
//         loading: true,
//       };
//     case GET_ATTENDEES_SUCCESS:
//       return {
//         ...state,
//         getAttendees: action.payload.data,
//         loading: false,
//       };

//     case GET_ATTENDEES_FAILURE:
//       return {
//         ...state,
//         loading: false,
//         error: response.data.error,
//       };

//     default:
//       return state;
//   }
// };

export const sendToChairman = (state = { chairmanData: [] }, action) => {
  switch (action.type) {
    case SEND_CHAIRMAN_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case SEND_CHAIRMAN_SUCCESS:
      return {
        ...state,
        chairmanData: action.payload.data,
        loading: false,
      };

    case SEND_CHAIRMAN_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      };

    default:
      return state;
  }
};

export const getInboxDatas = (state = { inboxdata: [] }, action) => {
  switch (action.type) {
    case GET_INBOXDATA_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_INBOXDATA_SUCCESS:
      return {
        ...state,

        inboxdata: action.payload.data,
        loading: false,
      };
    case GET_INBOXDATA_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      };

    default:
      return state;
  }
};

export const ChairamInboxMeeting = (
  state = { chairmanMeeting: [] },
  action
) => {
  switch (action.type) {
    case GET_CHAIRMANINBOX_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_CHAIRMANINBOX_DETAILS_SUCCESS:
      return {
        ...state,

        chairmanMeeting: action.payload.data,
        loading: false,
      };
    case GET_CHAIRMANINBOX_DETAILS_FAILURE:
      return {
        ...state,
        error: "something error",
        loading: false,
      };

    default:
      return state;
  }
};

const approveMeetingStete = {
  loading: false,
  approveMeetingData: [],
  error: "",
};

export const chairManApproveMeeting = (state = approveMeetingStete, action) => {
  switch (action.type) {
    case APPROVE_CHAIRMAN_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case APPROVE_CHAIRMAN_SUCCESS:
      return {
        ...state,
        approveMeetingData: action.payload.data,
        loading: false,
      };

    case APPROVE_CHAIRMAN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};

//  export const chairManApproveMeeting = (state = {approveMeeting:[]}, action) => {
//   switch (action.type) {
//     case APPROVE_CHAIRMAN_REQUEST:
//       return{
//         ...state,
//         loading:true
//       }

//       case APPROVE_CHAIRMAN_SUCCESS:
//     return {
//       ...state,
//         approveMeeting: action.payload.data,
//         loading:false
//       };

//       case APPROVE_CHAIRMAN_FAILURE:
//         return{
//           ...state,
//           loading:false,
//            error :action.payload.error
//         }
//     default:
//       return state;
//   }
// };

const initialState = { rejectMeeting: [], loading: false };

export const chairManAndUserRejectMeeting = (state = initialState, action) => {
  switch (action.type) {
    case REJECT_CHAIRMAN_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case REJECT_CHAIRMAN_SUCCESS:
      return {
        ...state,
        rejectMeeting: action.payload.data,
        loading: false,
      };

    case REJECT_CHAIRMAN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case USER_REJECT_MEETING_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case USER_REJECT_MEETING_SUCCESS:
      return {
        ...state,
        loading: false,
        rejectMeeting: action.payload.data,
      };

    case USER_REJECT_MEETING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};

const commentInitState = {
  loading: false,
  commets: [],
  error: "",
};

export const getAllComment = (state = commentInitState, action) => {
  switch (action.type) {
    case GET_CHAIRMANCOMMENT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_CHAIRMANCOMMENT_SUCCESS:
      return {
        ...state,

        commets: action.payload.data,
        loading: false,
      };
    case GET_CHAIRMANCOMMENT_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      };

    default:
      return state;
  }
};

const userAttendeesInitState = {
  loading: false,
  attendee: [],
  error: "",
};

export const getUserAttendee = (state = userAttendeesInitState, action) => {
  switch (action.type) {
    case GET_USERATTENDEE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_USERATTENDEE_SUCCESS:
      return {
        ...state,

        attendee: action.payload.data,
        loading: false,
      };
    case GET_USERNAME_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      };

    default:
      return state;
  }
};

const userForwardMeetingInitState = {
  loading: false,
  ForwardMeeting: [],
  error: "",
};

export const userForwardMeeting = (
  state = userForwardMeetingInitState,
  action
) => {
  switch (action.type) {
    case USER_FORWORD_MEETING_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case USER_FORWORD_MEETING_SUCCESS:
      return {
        ...state,
        loading: false,
        ForwardMeeting: action.payload.data,
      };

    case USER_FORWORD_MEETING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};

const userAcceptRejectInitState = {
  loading: false,
  userAccept: [],
  userReject: [],
  error: "",
};

export const userAcceptRejectdMeeting = (
  state = userAcceptRejectInitState,
  action
) => {
  switch (action.type) {
    case USER_ACCEPT_MEETING_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case USER_ACCEPT_MEETING_SUCCESS:
      return {
        ...state,
        loading: false,
        userAccept: action.payload.data,
      };

    case USER_ACCEPT_MEETING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case USER_REJECT_MEETING_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case USER_REJECT_MEETING_SUCCESS:
      return {
        ...state,
        loading: false,
        userReject: action.payload.data,
      };

    case USER_REJECT_MEETING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};

const rescheduledMeetingState = {
  loading: false,
  error: "",
  rescheduledData: [],
};

export const rescheduledMeeting = (state = rescheduledMeetingState, action) => {
  switch (action.type) {
    case RESHEDULE_MEETING_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case RESHEDULE_MEETING_SUCCESS:
      return {
        ...state,
        loading: false,
        error: "",
        rescheduledData: action.payload.data,
      };
    case RESHEDULE_MEETING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};

const initiatorCancelMeetingState = {
  loading: false,
  error: "",
  InitiatorcancelMeeting: [],
};

export const initiatorCancelMeeting = (
  state = initiatorCancelMeetingState,
  action
) => {
  switch (action.type) {
    case INITIATOR_CANCELMEETING_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case INITIATOR_CANCELMEETING_SUCCESS:
      return {
        ...state,
        loading: false,
        error: "",
        InitiatorcancelMeeting: action.payload.data,
      };
    case INITIATOR_CANCELMEETING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};

const initiatorDecisionMeetingState = {
  loading: false,
  error: "",
  MeetingDecision: [],
};

export const initiatorDecisionMeeting = (
  state = initiatorDecisionMeetingState,
  action
) => {
  switch (action.type) {
    case INITIATOR_GET_DECISION_MEETING_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case INITIATOR_GET_DECISION_MEETING_SUCCESS:
      return {
        ...state,
        loading: false,
        error: "",
        MeetingDecision: action.payload.data,
      };
    case INITIATOR_GET_DECISION_MEETING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case INITIATOR_DECISION_MEETING_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case INITIATOR_DECISION_MEETING_SUCCESS:
      return {
        ...state,
        loading: false,
        error: "",
        MeetingDecision: [...state.MeetingDecision, action.payload.data],
      };
    case INITIATOR_DECISION_MEETING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};

const TaskActionPointsState = {
  loading: false,
  error: "",
  taskActionPoint: [],
};

export const initiatorTaskActionPoints = (state = TaskActionPointsState,action) => {
  switch (action.type) {
    case INITIATOR_GET_TASK_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case INITIATOR_GET_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
        error: "",
        taskActionPoint: action.payload.data,
      };
    case INITIATOR_GET_TASK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case INITIATOR_POST_TASK_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case INITIATOR_POST_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
        error: "",
        taskActionPoint: [...state.taskActionPoint, action.payload.data],
      };
    case INITIATOR_POST_TASK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};

const agendaInitialState = {
  loading: false,
  getAgendaData: [],
  error: "",
};

export const AgendaReducer = (state = agendaInitialState, action) => {
  switch (action.type) {
    case GET_AGENDA_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_AGENDA_SUCCESS:
      return {
        ...state,
        getAgendaData: action.payload,
        loading: false,
      };

    case GET_AGENDA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };

    case POST_AGENDA_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case POST_AGENDA_SUCCESS:
      console.log(action.payload, state.getAgendaData);

      return {
        ...state,
        getAgendaData: [...state.getAgendaData, action.payload],
        loading: false,
        error: "",
      };

    case POST_AGENDA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };

    case POST_AGENDA_DOCUMENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case POST_AGENDA_DOCUMENT_SUCCESS:
     
      return {
        ...state,
        getAgendaData: [...state.getAgendaData, action.payload.url],
        loading: false,
        error: action.payload.message,
      };

    case POST_AGENDA_DOCUMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };

    default:
      return state;
  }
};

// export const AgendaReducer = (state = agendaInitialState, action) => {
//   switch (action.type) {
//     case GET_AGENDA_REQUEST:
//       return {
//         ...state,
//         loading: true,
//       };

//     case GET_AGENDA_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         getAgendaData:action.payload.data

//       };

//     case GET_AGENDA_FAILURE:
//       return {
//         ...state,
//         loading: false,
//         error: action.payload.error,
//       };

//     case POST_AGENDA_REQUEST:
//       return {
//         ...state,
//         loading: true,
//       };

//     case POST_AGENDA_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         getAgendaData: [...state.getAgendaData, action.payload.data],
//       };

//     case POST_AGENDA_FAILURE:
//       return {
//         ...state,
//         loading: false,
//         error: action.payload.error,
//       };

//     default:
//       return state;
//   }
// };

const attachDocument = {
  loading: false,
  documents: [],
  error: "",
};

export const InitiatorPostAttachDocument = (state = attachDocument, action) => {
  switch (action.type) {
    case GET_ATTACH_DOCUMENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case GET_ATTACH_DOCUMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        documents: action.payload.data,
      };
    case GET_ATTACH_DOCUMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case POST_ATTACH_DOCUMENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case POST_ATTACH_DOCUMENT_SUCCESS:
      
      
      return {
        ...state,
        loading: false,
        documents: [...state.documents, action.payload.fileData],
      };

    case POST_ATTACH_DOCUMENT_FAILURE:
    
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

const meetingMemos = {
  loading: false,
  meetingMemo: [],
  error: "",
};

export const MeetingMemo = (state = meetingMemos, action) => {
  switch (action.type) {
    case GET_MEETINGMEMO_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case GET_MEETINGMEMO_SUCCESS:
      return {
        ...state,
        loading: false,
        meetingMemo: action.payload.data,
      };
    case GET_MEETINGMEMO_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case POST_MEETINGMEMO_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case POST_MEETINGMEMO_SUCCESS:
      return {
        ...state,
        loading: false,
        meetingMemo: [...state.meetingMemo, action.payload.data],
      };
    case POST_MEETINGMEMO_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};

const getGroupsState = {
  loading: false,
  error: "",
  getGropsName: [],
};

export const getAttendingGroup = (state = getGroupsState, action) => {
  switch (action.type) {
    case GET_GROUP_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case GET_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
        getGropsName: action.payload.data,
      };
    case GET_GROUP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};

const externalAttendeeState = {
  loading: false,
  error: "",
  externalattendee: [],
};

export const externalAttendees = (state = externalAttendeeState, action) => {
  switch (action.type) {
    case GET_EXTERNALATTENDEES_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case GET_EXTERNALATTENDEES_SUCCESS:
      return {
        ...state,
        loading: false,
        externalattendee: action.payload.data,
      };
    case GET_EXTERNALATTENDEES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case POST_EXTERNALATTENDEES_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case POST_EXTERNALATTENDEES_SUCCESS:
      return {
        ...state,
        loading: false,
        externalattendee: [...state.externalattendee, action.payload.data],
      };
    case POST_EXTERNALATTENDEES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};

const freezeAgendaState = {
  loading: false,
  error: "",
};

export const freezeAgenda = (state = freezeAgendaState, action) => {
  switch (action.type) {
    case FREEZE_AGENDA_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case FREEZE_AGENDA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: "",
      };

    case FREEZE_AGENDA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};
