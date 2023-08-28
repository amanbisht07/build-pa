// import {
//   GET_AGENDA_FAILURE,
//   GET_AGENDA_REQUEST,
//   GET_AGENDA_SUCCESS,
//   POST_AGENDA_FAILURE,
//   POST_AGENDA_REQUEST,
//   POST_AGENDA_SUCCESS,
// } from "app/camunda_redux/redux/constants/ActionTypes";



// const agendaInitialState = {
//   loading: false,
//   getAgendaData: [],
 
//   error: "",
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
//         getAgendaDatas: action.payload.data,
//         loading: false,
//       };

//     case GET_AGENDA_FAILURE:
//       return {
//         ...state,
//         loading: false,
//         error: action.payload.error,
//       // };

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
//         getAgendaDatas: [...state.getAgendaData,action.payload.data],
//         loading: false,
//       };

//     case POST_AGENDA_FAILURE:
//       return {
//         ...state,
//         loading: false,
//         error: action.payload.error,
//       };

//     default: return state;
//   }

// }