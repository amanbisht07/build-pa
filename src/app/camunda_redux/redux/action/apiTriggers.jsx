export const actionTypes = {
  CHANGE_PA_APPLICATION: "pa/paApplication",
  CHANGE_PA_DRAFT: "pa/paDraft",
  CHANGE_PA_FILE: "paFilepa/",
  CHANGE_PA_ANNEXURE: "pa/Annexure",
  CHANGE_INBOX: 'pa/Inbox',
  CHANGE_OUTBOX: 'pa/Outbox',
  CHANGE_HRM: 'pa/HrmConcern',
  CHANGE_CABINET: 'pa/Cabinet',
  CHANGE_RTI: "rti/Files",
};

export function changingTableState(blnValuePF, actionValue) {
  if (actionValue === "CHANGE_PA_FILE") {
    return (dispatch) => {
      return dispatch({
        type: actionTypes.CHANGE_PA_FILE,
        blnValuePF: blnValuePF,
      });
    };
  }
}

export function changingTableStatePA(blnValuePA, actionValue) {
  if (actionValue === "CHANGE_PA_APPLICATION") {
    return (dispatch) => {
      return dispatch({
        type: actionTypes.CHANGE_PA_APPLICATION,
        blnValuePA: blnValuePA,
      });
    };
  }
}
export function changeTableStateDraft(blnValueDraft, actionValue) {
  if (actionValue === "CHANGE_PA_DRAFT") {
    return (dispatch) => {
      return dispatch({
        type: actionTypes.CHANGE_PA_DRAFT,
        blnValueDraft: blnValueDraft,
      });
    };
  }
}
export function changingTableStateAnnexure(blnValue, actionValue) {
  if (actionValue === "CHANGE_PA_ANNEXURE") {
    return (dispatch) => {
      return dispatch({
        type: actionTypes.CHANGE_PA_ANNEXURE,
        blnValue: blnValue,
      });
    };
  }
}

export function changingTableStateInbox(blnValueInbox, actionValue) {
  if (actionValue === "CHANGE_INBOX") {
    return (dispatch) => {
      return dispatch({
        type: actionTypes.CHANGE_INBOX,
        blnValueInbox: blnValueInbox,
      });
    };
  }
}

export function changingTableStateOutbox(blnValueOutbox, actionValue) {
  if (actionValue === "CHANGE_OUTBOX") {
    return (dispatch) => {
      return dispatch({
        type: actionTypes.CHANGE_OUTBOX,
        blnValueOutbox: blnValueOutbox,
      });
    };
  }
}

export function changingTableStateHrmConcern(blnValueHrm, actionValue) {
  if (actionValue === "CHANGE_HRM") {
    return (dispatch) => {
      return dispatch({
        type: actionTypes.CHANGE_HRM,
        blnValueHrm: blnValueHrm,
      });
    };
  }
}

export function changingTableStateRti(blnValueRti, actionValue) {
  if (actionValue === "CHANGE_RTI") {
    return (dispatch) => {
      return dispatch({
        type: actionTypes.CHANGE_RTI,
        blnValueRti: blnValueRti,
      });
    };
  }
}

export function changingTableStateCabinet(blnValueCabinet, actionValue) {

  if (actionValue === 'CHANGE_CABINET') {
    return dispatch => {
      return dispatch({ type: actionTypes.CHANGE_CABINET, blnValueCabinet: blnValueCabinet });
    };
  }

}
