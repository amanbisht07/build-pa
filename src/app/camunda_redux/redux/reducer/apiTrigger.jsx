import { actionTypes } from "../action/apiTriggers";

const initialState = {
    blnValue: false,
    blnValuePA: false,
    blnValuePF: false,
    blnValueInbox: false,
    blnValueOutbox: false,
    blnValueDraft: false,
    blnValueHrm: false,
    blnValueCabinet: false,
    actionValue:""
};

export default function apiTrigger(state = initialState, action) {
    switch (action.type) {
        case actionTypes.CHANGE_PA_APPLICATION:
            return{
                ...state,
                blnValuePA: action.blnValuePA,
                actionValue: action.actionValue
            };
            case actionTypes.CHANGE_PA_DRAFT:
            return{
                ...state,
                blnValueDraft: action.blnValueDraft,
                actionValue: action.actionValue
            };
            case actionTypes.CHANGE_PA_FILE:
            return{
                ...state,
                blnValuePF: action.blnValuePF,
                actionValue: action.actionValue
            };
            case actionTypes.CHANGE_PA_ANNEXURE:
            return{
                ...state,
                blnValue: action.blnValue,
                actionValue: action.actionValue
            };
            case actionTypes.CHANGE_INBOX:
            return{
                ...state,
                blnValueInbox: action.blnValueInbox,
                actionValue: action.actionValue
            };
            case actionTypes.CHANGE_OUTBOX:
            return{
                ...state,
                blnValueOutbox: action.blnValueOutbox,
                actionValue: action.actionValue
            };
            case actionTypes.CHANGE_HRM:
            return{
                ...state,
                blnValueHrm: action.blnValueHrm,
                actionValue: action.actionValue
            };
            case actionTypes.CHANGE_CABINET:
            return{
                ...state,
                blnValueCabinet: action.blnValueCabinet,
                actionValue: action.actionValue
            };
            case actionTypes.CHANGE_RTI:
      return {
        ...state,
        blnValueRti: action.blnValueRti,
        actionValue: action.actionValue,
      };
        default:
            return { ...state };
    }
  
};

