import { GET_DEPARTMENT_REQUEST,GET_DEPARTMENT_SUCCESS,GET_DEPARTMENT_FAILURE } from "app/camunda_redux/redux/constants/ActionTypes";


const getDepartments = ( state={departmentdata:[]},action)=>{

    switch (action.type) {
        case GET_DEPARTMENT_REQUEST:
            return {loading:true,departmentdata:[]}
            
            case GET_DEPARTMENT_SUCCESS:
                return {loading:false,departmentdata:action.payload}

                case GET_DEPARTMENT_FAILURE:
                    return {loading:false,error:action.payload}

        default: return state
           
    }
}

export default getDepartments