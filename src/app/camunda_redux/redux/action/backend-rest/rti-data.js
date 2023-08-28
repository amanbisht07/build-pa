import * as AT from "../../constants/ActionTypes";
import { BACK_RTI_API } from "app/middleware/backend_rti";
import { RTIBACK_API_AXIOS } from "app/middleware/rtiBackend_axios";
import { BACK_REGISTER_API } from "app/middleware/backend_register";

let sessionId = sessionStorage.getItem("sessionId");

export const getRtiList = (status) => ({
  [BACK_RTI_API]: {
    types: [AT.FETCH_RTI_REQUEST, AT.FETCH_RTI_SUCCESS, AT.FETCH_RTI_FAILURE],
    endpoint: `/api/fetchAllFiles?page=${0}&size=${100}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        status: status,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const rollbackRtiSplitViewDocument = (id, flagNumber) => ({
  [BACK_RTI_API]: {
    types: [
      AT.ROLLBACK_PA_REQUEST,
      AT.ROLLBACK_PA_SUCCESS,
      AT.ROLLBACK_PA_FAILURE,
    ],
    endpoint: `/api/getEditedFile/${id}`,
    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        flagNumber: flagNumber,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const rollbackRtiSplitViewEnclosureDocument = (id, flagNumber) => ({
  [BACK_RTI_API]: {
    types: [
      AT.ROLLBACK_PA_REQUEST,
      AT.ROLLBACK_PA_SUCCESS,
      AT.ROLLBACK_PA_FAILURE,
    ],
    endpoint: `/api/getEditedEnclosure/${id}`,
    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        flagNumber: flagNumber,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const quickSign1 = (
  value,
  role,
  flagNum,
  annexureSign,
  annexureId,
  pfileName
) => ({
  [BACK_RTI_API]: {
    types: [AT.QICK_SIGN_REQUEST, AT.QICK_SIGN_SUCCESS, AT.QICK_SIGN_FAILURE],
    endpoint: `/api/sign`,

    settings: {
      method: "post",
      body: value,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        flagNumber: flagNum,
        annexureSign: annexureSign,
        annexureId: annexureId,
        pfileName: pfileName,
        userName: localStorage.getItem("username"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const addRti = (value, role, deptName) => ({
  [BACK_RTI_API]: {
    types: [AT.ADD_RTI_REQUEST, AT.ADD_RTI_SUCCESS, AT.ADD_RTI_FAILURE],
    endpoint: `/api/add-rti-file`,
    settings: {
      method: "POST",
      body: JSON.stringify(value),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        deptName: deptName,
        userName: localStorage.getItem("username"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const saveRtiFile = (id, data, deptName) => ({
  [BACK_RTI_API]: {
    types: [
      AT.SAVE_RTI_DOC_REQUEST,
      AT.SAVE_RTI_DOC_SUCCESS,
      AT.SAVE_RTI_DOC_FAILURE,
    ],
    endpoint: `/api/add-noting/` + id,

    settings: {
      method: "POST",
      body: data,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        deptName: deptName,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const uploadRti = (id, file, onUploadProgress, deptName) => ({
  [RTIBACK_API_AXIOS]: {
    types: [
      AT.UPLOAD_RTI_ENCLOUSER_REQUEST,
      AT.UPLOAD_RTI_ENCLOUSER_SUCCESS,
      AT.UPLOAD_RTI_ENCLOUSER_FAILURE,
    ],
    endpoint: `/api/add-enclosures/` + id,
    body: file,
    headers: {
      // Accept: "application/json",
      method: "POST",
      Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
      sessionId: sessionStorage.getItem("sessionId"),
      deptName: deptName,
      userName: localStorage.getItem("username"),
      roleName: sessionStorage.getItem("role"),
      department: sessionStorage.getItem("department"),
      address: sessionStorage.getItem("ipAddress"),
    },
    onUploadProgress,
  },
});

export const getPartcaseEnclosures = (id) => ({
  [BACK_RTI_API]: {
    types: [
      AT.GET_ENCLOUSER_REQUEST,
      AT.GET_ENCLOUSER_SUCCESS,
      AT.GET_ENCLOUSER_FAILURE,
    ],
    endpoint: `/api/getenclosures/` + id,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getPartcaseNoting = (id) => ({
  [BACK_RTI_API]: {
    types: [
      AT.GET_NOTING_REQUEST,
      AT.GET_NOTING_SUCCESS,
      AT.GET_NOTING_FAILURE,
    ],
    endpoint: `/api/getnotings/` + id,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getRtiDepartment = () => ({
  [BACK_RTI_API]: {
    types: [
      AT.RTI_DEPARTMENT_REQUEST,
      AT.RTI_DEPARTMENT_SUCCESS,
      AT.RTI_DEPARTMENT_FAILURE,
    ],
    endpoint: `/api/departments`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const forwardToDepts = (id, data) => ({
  [BACK_RTI_API]: {
    types: [
      AT.FORWARD_DEPT_REQUEST,
      AT.FORWARD_DEPT_SUCCESS,
      AT.FORWARD_DEPT_FAILURE,
    ],
    endpoint: `/api/deparray/` + id,

    settings: {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        "Content-Type": "application/json; charset=utf8",
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getInboxData = (role, username, pageSize, pageNumber) => ({
  [BACK_RTI_API]: {
    types: [
      AT.INBOX_DATA_REQUEST,
      AT.INBOX_DATA_SUCCESS,
      AT.INBOX_DATA_FAILURE,
    ],
    endpoint: `/api/getInboxData`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        userName: username,
        pageSize: pageSize,
        pageNumber: pageNumber,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const saveFiles = (
  id,
  data,
  role,
  userName,
  isPartCase,
  fileUrl,
  isAnnexure
) => ({
  [BACK_RTI_API]: {
    types: [
      AT.SAVE_FILES_REQUEST,
      AT.SAVE_FILES_SUCCESS,
      AT.SAVE_FILES_FAILURE,
    ],
    endpoint: `/api/saveDocument/` + id,

    settings: {
      method: "post",
      body: data,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        userName: userName,
        isPartCase: isPartCase,
        fileUrl: fileUrl,
        isAnnexure: isAnnexure,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getSplitViewRtiData = (id) => ({
  [BACK_RTI_API]: {
    types: [
      AT.SPLITVIEW_RTIDATA_REQUEST,
      AT.SPLITVIEW_RTIDATA_SUCCESS,
      AT.SPLITVIEW_RTIDATA_FAILURE,
    ],
    endpoint: `/api/loadRtiDataSplitView/` + id,

    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getRtiPartCaseData = (data) => ({
  [BACK_RTI_API]: {
    types: [
      AT.PART_CASE_DATA_REQUEST,
      AT.PART_CASE_DATA_SUCCESS,
      AT.PART_CASE_DATA_FAILURE,
    ],
    endpoint: `/api/getPartcaseData`,

    settings: {
      method: "POST",
      body: data,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const rtisendFiles = (
  id,
  data,
  role,
  username,
  displayUserName,
  pfileName
) => ({
  [BACK_RTI_API]: {
    types: [
      AT.SEND_FILES_FAILURE,
      AT.SEND_FILES_REQUEST,
      AT.SEND_FILES_SUCCESS,
    ],
    endpoint: `/api/sendFiles/${id}/${false}`,

    settings: {
      method: "post",
      body: JSON.stringify({
        group: data,
        comment: "comment",
        status: "sent",
        // nonOfficeUser: false,
        userName: username,
        roleName: role,
        fileId: id,
        priority: "",
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        userName: username,
        displayUsername: displayUserName,
        pfileName: pfileName,
        group: data,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const RtisendFilesInternalServiceNumber = (
  id,
  data,
  value,
  pfileName,
  body
) => ({
  [BACK_RTI_API]: {
    types: [
      AT.SENDFILEINTERNALSERVICENUMBER_REQUEST,
      AT.SENDFILEINTERNALSERVICENUMBER_SUCCESS,
      AT.SENDFILEINTERNALSERVICENUMBER_FAILURE,
    ],
    endpoint: `/api/sendFilesInternalServiceNumber/` + id,

    settings: {
      method: "post",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: data.roleName,
        fileId: id,
        userName: data.userName,
        group: data.groupName,
        fromroleName: data.fromRole,
        displayDeptName: data.displayDeptName,
        displayRoleName: data.displayRoleName,
        coverLetter: value,
        pfileName: pfileName,
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const RtisendFilesSection = (
  id,
  data,
  value,
  pfileName,
  body,
  isReturn
) => ({
  [BACK_RTI_API]: {
    types: [
      AT.SENDFILESECTION_REQUEST,
      AT.SENDFILESECTION_SUCCESS,
      AT.SENDFILESECTION_FAILURE,
    ],
    endpoint: `/api/sendFilesSection/` + id,

    settings: {
      method: "post",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: data.roleName,
        group: data.groupName,
        fromroleName: data.fromRole,
        displayDeptName: data.displayDeptName,
        displayRoleName: data.displayRoleName,
        coverLetter: value,
        pfileName: pfileName,
        isReturn,
        userName: localStorage.getItem("username"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const returnRti = (id, deptName, username) => ({
  [BACK_RTI_API]: {
    types: [AT.RETURN_PA_REQUEST, AT.RETURN_PA_SUCCESS, AT.RETURN_PA_FAILURE],
    endpoint: `/api/backToDept`,
    settings: {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        // group: group
        id: id,
        deptName: deptName,
        // roleName: role,
        username: username,
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getRtiRegister = () => ({
  [BACK_REGISTER_API]: {
    types: [AT.FETCH_RTI_REQUEST, AT.FETCH_RTI_SUCCESS, AT.FETCH_RTI_FAILURE],
    endpoint: `/fetch-all`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const URLHide = (url) => ({
  [BACK_RTI_API]: {
    types: [AT.TEST_URL_REQUEST, AT.TEST_URL_SUCCESS, AT.TEST_URL_FAILURE],
    endpoint: `/api/urls?urls=${url}`,
    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const PCFileClosuerRti = (id, status, pfileName) => ({
  [BACK_RTI_API]: {
    types: [
      AT.UPDATE_PARTCASE_STATUS_REQUEST,
      AT.UPDATE_PARTCASE_STATUS_SUCCESS,
      AT.UPDATE_PARTCASE_STATUS_FAILURE,
    ],
    endpoint: `/api/mergeFiles`,
    settings: {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        // inboxId: inboxID,
        id: id,
        Status: status,
        pfileName: pfileName,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const sendbackRti = (id, username) => ({
  [BACK_RTI_API]: {
    types: [AT.RETURN_PA_REQUEST, AT.RETURN_PA_SUCCESS, AT.RETURN_PA_FAILURE],
    endpoint: `/api/sendToDept`,
    settings: {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        // group: group
        id: id,
        // roleName: role,
        // userName: userName,
        userName: username,
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getStatus = (id) => ({
  [BACK_RTI_API]: {
    types: [
      AT.FETCH_HISTORY_REQUEST,
      AT.FETCH_HISTORY_SUCCESS,
      AT.FETCH_HISTORY_FAILURE,
    ],
    endpoint: `/api/getStatus`,

    settings: {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        id: id,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getDraftStatus = (id) => ({
  [BACK_RTI_API]: {
    types: [
      AT.FETCH_HISTORY_REQUEST,
      AT.FETCH_HISTORY_SUCCESS,
      AT.FETCH_HISTORY_FAILURE,
    ],
    endpoint: `/api/initialStatus`,

    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        id: id,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getFinalRegister = () => ({
  [BACK_REGISTER_API]: {
    types: [AT.FETCH_RTI_REQUEST, AT.FETCH_RTI_SUCCESS, AT.FETCH_RTI_FAILURE],
    endpoint: `/fetch-all-Merged`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const DeleteDraft = (id) => ({
  [BACK_RTI_API]: {
    types: [
      AT.DELETE_ANNEXURE_REQUEST,
      AT.DELETE_ANNEXURE_SUCCESS,
      AT.DELETE_ANNEXURE_FAILURE,
    ],
    endpoint: `/api/deleteDraft    `,

    settings: {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        id: id,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getFilterStatus = (id, status) => ({
  [BACK_RTI_API]: {
    types: [
      AT.FETCH_HISTORY_REQUEST,
      AT.FETCH_HISTORY_SUCCESS,
      AT.FETCH_HISTORY_FAILURE,
    ],
    endpoint: `/api/filterByStatus`,

    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        id: id,
        status: status,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const FindByAppeal = (appealNumber) => ({
  [BACK_RTI_API]: {
    types: [
      AT.FETCH_HISTORY_REQUEST,
      AT.FETCH_HISTORY_SUCCESS,
      AT.FETCH_HISTORY_FAILURE,
    ],
    endpoint: `/api/findByAppeal`,

    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        appealNumber: appealNumber,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getSearchedData = (search) => ({
  [BACK_RTI_API]: {
    types: [
      AT.FETCH_HISTORY_REQUEST,
      AT.FETCH_HISTORY_SUCCESS,
      AT.FETCH_HISTORY_FAILURE,
    ],
    endpoint: `/api/getSearchedData`,

    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        search: search,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getAutoDetails = (appeal) => ({
  [BACK_RTI_API]: {
    types: [
      AT.FETCH_HISTORY_REQUEST,
      AT.FETCH_HISTORY_SUCCESS,
      AT.FETCH_HISTORY_FAILURE,
    ],
    endpoint: `/api/autofillDetails`,

    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        appeal: appeal,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getdownloadZip = (id) => ({
  [BACK_RTI_API]: {
    types: [
      AT.FETCH_HISTORY_REQUEST,
      AT.FETCH_HISTORY_SUCCESS,
      AT.FETCH_HISTORY_FAILURE,
    ],
    endpoint: `/api/downloadZip`,

    settings: {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf8",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        id: id,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      responseType: "arraybuffer",
    },
  },
});

export const deleteEnclosureRti = (rolename, pcId, fileName, flagnumber) => ({
  [BACK_RTI_API]: {
    types: [
      AT.ENCLOSURE_DATA_REQUEST,
      AT.ENCLOSURE_DATA_SUCCESS,
      AT.ENCLOSURE_DATA_FAILURE,
    ],
    endpoint: `/api/deleteEnclosure`,
    settings: {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        rolename: rolename,
        pcId: pcId,
        fileName: fileName,
        flagnumber: flagnumber,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const fetchSplitViewTagsRti = (partcaseID, dept) => ({
  [BACK_RTI_API]: {
    types: [
      AT.FETCH_PARTCASE_TAG_REQUEST,
      AT.FETCH_PARTCASE_TAG_SUCCESS,
      AT.FETCH_PARTCASE_TAG_FAILURE,
    ],
    endpoint: `/api/fetch-tags/` + partcaseID,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        grp: dept,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const savePartCaseTagRti = (partcaseID, data) => ({
  [BACK_RTI_API]: {
    types: [
      AT.PARTCASE_TAG_REQUEST,
      AT.PARTCASE_TAG_SUCCESS,
      AT.PARTCASE_TAG_FAILURE,
    ],
    endpoint: `/api/add-tags/` + partcaseID,

    settings: {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const editRtiFlagNumber = (
  pcId,
  newFlagNumber,
  oldFlagNumber,
  roleName,
  flagNumberMarking
) => ({
  [BACK_RTI_API]: {
    types: [
      AT.PART_CASE_DATA_REQUEST,
      AT.PART_CASE_DATA_SUCCESS,
      AT.PART_CASE_DATA_FAILURE,
    ],
    endpoint: `/api/editFlagNumber`,

    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        pcId: pcId,
        newFlagNumber: newFlagNumber,
        oldFlagNumber: oldFlagNumber,
        roleName: roleName,
        flagNumberMarking: flagNumberMarking,
        userName: localStorage.getItem("username"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const fetchAddress = (state = "", district = "") => ({
  [BACK_RTI_API]: {
    types: [
      AT.PART_CASE_DATA_REQUEST,
      AT.PART_CASE_DATA_SUCCESS,
      AT.PART_CASE_DATA_FAILURE,
    ],
    endpoint: `/api/fetchAddress`,

    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        state: state,
        district: district,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});
