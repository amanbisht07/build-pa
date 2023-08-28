import {
  CREATE_MEETING_FAILURE,
  CREATE_MEETING_REQUEST,
  CREATE_MEETING_SUCCESS,
  GET_MEETING_REQUEST,
  GET_MEETING_FAILURE,
  GET_MEETING_SUCCESS,
} from "app/camunda_redux/redux/constants/ActionTypes";

const initialState ={
    createMeeting:[],
    meetingId:'',
    loading:false,
    error:""
    

}


 const createMeetings = (state = initialState, action) => {
    switch (action.type) {
      case CREATE_MEETING_REQUEST:
        return{
          ...state,
          loading:true
        }

        case CREATE_MEETING_SUCCESS:
        console.log(action.payload.data.id)
          return {
          ...state,
          createMeeting: action.payload,
          meetingId:action.payload.data.id,
          loading:false,
      
        };

        case CREATE_MEETING_FAILURE:
          return{
            ...state,
            loading:false,
             error :action.payload.error
          }
      default:return state;
    }
  };


 export default createMeetings;
