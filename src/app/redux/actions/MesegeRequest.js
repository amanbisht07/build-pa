
// import { GET_REQUEST_DATA } from "app/camunda_redux/redux/constants/ActionTypes";
// import { SET_REQUEST_DATA } from "app/camunda_redux/redux/constants/ActionTypes";
// import { FAIL_REQUEST_DATA } from "app/camunda_redux/redux/constants/ActionTypes";
// import Axios from "axios";


// export const getActiveuser = () => async (dispatch) => {
//     let username = localStorage.getItem("username");
  
//     const config = {
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json; charset=utf8",
  
//         Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
  
//         username: username,
        
//       },  // http://11.0.0.118:9090/audit_view_service/api/getaudit
//     };
  
//     try {
//       dispatch({ type: GET_REQUEST_DATA });
//       const res = await Axios.get("/audit_view_service/api/getaudit", config);  
//       console.log(res); 
//       dispatch({
//         type: SET_REQUEST_DATA ,
//         payload: res.data
//       });
//     } catch (error) {
//       dispatch({ type: FAIL_REQUEST_DATA, payload: error });
//     }
//   };