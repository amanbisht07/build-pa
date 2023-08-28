import {PA_FILE_DATA_REQUEST, PA_FILE_DATA_SUCCESS, PA_FILE_DATA_FAILURE} from "app/camunda_redux/redux/constants/ActionTypes";

const initialState = {
    padata: [],
    loading: false,
    success: false,
    error: "",

};

const FileView1Reducer = (state=initialState, action) => {
    switch (action.type) {
        case PA_FILE_DATA_REQUEST: {
        
            return {
                ...state,
                loading: true,
            }
        }
        case PA_FILE_DATA_SUCCESS: {
        
            return {
                ...state,
                loading: false,
                success: true,
                padata: action.response.data,
            }
        }    
        case PA_FILE_DATA_FAILURE: {
        
            return {
                ...state,
                loading: false,
                success: false,
                error: action.error,
            }
        }   
         default:
             return{
                 ...state,
             } 
    }    
  };
  
  export default FileView1Reducer;
  