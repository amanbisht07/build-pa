import * as AT from "../../constants/ActionTypes";
import { BACK_API } from "../../../../middleware/backend";
import { BACK_API1 } from "../../../../middleware/backendPA";
import { BACKEND_API_SAU } from "../../../../middleware/backendSau";
import { BACK_API_AXIOS } from "../../../../middleware/backend_axios";
import { BACK_USER_MANAGEMENT_API } from "../../../../middleware/backend_userManagement";
import { BACK_CREATEPF_API } from "../../../../middleware/backend_createPF";
import { BACK_PERSONAL_INFO_API } from "../../../../middleware/backend_personalinfo";
import { BACK_CREATEPA_API } from "app/middleware/backend_createPA";
import { BACK_SIGN_API } from "app/middleware/backend_sign";
import { BACK_MICROPROJECT_API } from "app/middleware/backend_microproject";
import { BACK_SEND_API } from "app/middleware/backend_send";
import { BACK_UTIL_API } from "app/middleware/backend_util";
import { BACK_HRM_API } from "app/middleware/backend_hrm";
import { BACK_PC_API } from "app/middleware/backend_partCase";
import { BACK_ANNOTATION_API } from "app/middleware/backend_annotation";
import { BACK_FORWARD_API } from "app/middleware/backend_forward";
import { BACK_HISTORY_API } from "app/middleware/backend_history";
import { BACK_CAMUNDA_PA_API } from "app/middleware/backend_camunda_pa";
import { BACK_MERGE_PC_API } from "app/middleware/backend_merge_pc";
import { BACK_API_AXIOS_ENCLOSURE } from "../../../../middleware/backend_enclosure_axios";
import { BACK_RTI_API } from "app/middleware/backend_rti";
import { BACK_AUDIT_API } from "app/middleware/audit_disable";
import { BACKEND_FILE } from "app/middleware/backend_file";
import { BACK_CREATECORRESPONDENCE_API } from "app/middleware/backend_correspondence";

let role = sessionStorage.getItem("role");
let username = localStorage.getItem("username");
const sessionId = sessionStorage.getItem("sessionId");
/*const userData = JSON.parse(userDataParse);*/

export const setCreateForm = (values) => ({
  [BACK_API]: {
    types: [
      AT.INITIATE_FORM_CREATE_REQUEST,
      AT.INITIATE_FORM_CREATE_SUCCESS,
      AT.INITIATE_FORM_CREATE_FAILURE,
    ],
    endpoint: `/api/createFile`,
    settings: {
      method: "post",
      body: values,
      headers: {
        "Content-Type": "application/json",
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
export const getPersonalInfo = (values, abortSignal) => ({
  [BACK_PERSONAL_INFO_API]: {
    types: [
      AT.GET_PERSONAL_SUCCESS,
      AT.GET_PERSONAL_REQUEST,
      AT.GET_PERSONAL_FAILURE,
    ],
    endpoint: `/api/getPersonalInfo`,
    settings: {
      method: "post",
      signal: abortSignal,
      body: values,
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

export const getPersonalInfoForm = (roleName) => ({
  [BACKEND_API_SAU]: {
    types: [
      AT.GET_PERSONALINFO_REQUEST,
      AT.GET_PERSONALINFO_SUCCESS,
      AT.GET_PERSONALINFO_FAILURE,
    ],
    endpoint: `/saufileszip/getInfoDetails?userRole=${roleName}`,
    settings: {
      method: "post",
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

export const getSidenav = (values) => ({
  [BACK_PERSONAL_INFO_API]: {
    types: [
      AT.GET_PERSONAL_SUCCESS,
      AT.GET_PERSONAL_REQUEST,
      AT.GET_PERSONAL_FAILURE,
    ],
    endpoint: `/api/getPersonalInfo`,
    settings: {
      method: "post",
      body: values,
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
export const updatePersonalInfo = (values) => ({
  [BACK_PERSONAL_INFO_API]: {
    types: [
      AT.UPDATE_PERSONAL_SUCCESS,
      AT.UPDATE_PERSONAL_REQUEST,
      AT.UPDATE_PERSONAL_FAILURE,
    ],
    endpoint: `/api/updatePersonalInfo`,
    settings: {
      method: "post",
      body: values,
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

export const uploadEnclosure = (id, file, config, grp, subject, roleName) => ({
  [BACK_API_AXIOS_ENCLOSURE]: {
    types: [
      AT.ENCLOSURE_FILE_FAILURE,
      AT.ENCLOSURE_FILE_REQUEST,
      AT.ENCLOSURE_FILE_SUCCESS,
    ],
    endpoint: `/api/addEnclosure/${id}`,
    settings: {
      method: "post",
      body: file,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        group: grp,
        subject,
        roleName,
        userName: localStorage.getItem("username"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
    config,
  },
});
export const permanentlyClose = (cabinetId) => ({
  [BACK_PC_API]: {
    types: [
      AT.PERMANENTLY_CLOSE_REQUEST,
      AT.PERMANENTLY_CLOSE_SUCCESS,
      AT.PERMANENTLY_CLOSE_FAILURE,
    ],
    endpoint: `/api/permanent-close/${cabinetId}`,
    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        department: sessionStorage.getItem("department"),
      },
    },
  },
});

export const getCreateVolume = (cabinetId) => ({
  [BACK_PC_API]: {
    types: [
      AT.GET_CREATE_VOLUME_REQUEST,
      AT.GET_CREATE_VOLUME_SUCCESS,
      AT.GET_CREATE_VOLUME_FAILURE,
    ],
    endpoint: `/api/create-volume/${cabinetId}`,
    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        department: sessionStorage.getItem("department"),
      },
    },
  },
});

export const getVolume = (subject) => ({
  [BACK_PC_API]: {
    types: [
      AT.GET_VOLUME_REQUEST,
      AT.GET_VOLUME_SUCCESS,
      AT.GET_VOLUME_FAILURE,
    ],
    endpoint: `/api/get-volumes`,
    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        department: sessionStorage.getItem("department"),
        subject,
      },
    },
  },
});

export const uploadNoting = (id, file, role, username) => ({
  [BACK_API]: {
    types: [
      AT.NOTING_FILE_FAILURE,
      AT.NOTING_FILE_REQUEST,
      AT.NOTING_FILE_SUCCESS,
    ],
    endpoint: `/api/upload/noting/file/` + id,

    settings: {
      method: "post",
      body: file,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        userName: username,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const sendFile = (id, data, role) => ({
  [BACK_API]: {
    types: [AT.SEND_FILE_FAILURE, AT.SEND_FILE_REQUEST, AT.SEND_FILE_SUCCESS],
    endpoint: `/api/sendFile/` + id + `/` + false,

    settings: {
      method: "post",
      body: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        userName: localStorage.getItem("username"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const createPersonalFileForm = (values) => ({
  [BACK_CREATEPF_API]: {
    types: [AT.CREATE_PF_REQUEST, AT.CREATE_PF_SUCCESS, AT.CREATE_PF_FAILURE],
    endpoint: `/api/createFile`,
    settings: {
      method: "post",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: values.userName,
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getAnnotation = (id) => ({
  [BACK_ANNOTATION_API]: {
    types: [AT.GET_ANNOT_SUCCESS, AT.GET_ANNOT_REQUEST, AT.GET_ANNOT_FAILURE],
    endpoint: `/api/getAnnotation/` + id,
    settings: {
      method: "get",

      headers: {
        "Content-Type": "application/json",
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

export const createAnnotation = (values, id, flag, flagNumber) => ({
  [BACK_ANNOTATION_API]: {
    types: [AT.ANNOT_SUCCESS, AT.ANNOT_REQUEST, AT.ANNOT_FAILURE],
    endpoint: `/api/uploadAnnotation/` + id,
    settings: {
      method: "post",
      body: values,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        flag: flag,
        flagNumber: flagNumber,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const createExternalAnnotation = (values) => ({
  [BACK_ANNOTATION_API]: {
    types: [
      AT.EXTERNAL_ANNOT_SUCCESS,
      AT.EXTERNAL_ANNOT_REQUEST,
      AT.EXTERNAL_ANNOT_FAILURE,
    ],
    endpoint: `/api/uploadExternal`,
    settings: {
      method: "post",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
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

export const createPersonalApplicationForm = (values, role, grp) => ({
  [BACK_CREATEPA_API]: {
    types: [AT.PA_REQUEST, AT.PA_SUCCESS, AT.PA_FAILURE],
    endpoint: `/api/createApplication`,
    settings: {
      method: "post",
      body: JSON.stringify({ ...values, roleName: role }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        grp: grp,
        userName: values.userName,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const updateSubjectApplicationForm = (subject, id) => ({
  [BACK_CREATEPA_API]: {
    types: [
      AT.UPDATE_SUBJECT_DRAFT_REQUEST,
      AT.UPDATE_SUBJECT_DRAFT_SUCCESS,
      AT.UPDATE_SUBJECT_DRAFT_FAILURE,
    ],
    endpoint: `/api/changeSubject`,
    settings: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        subject: subject,
        id: id,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const sendFiles = (
  id,
  data,
  role,
  username,
  displayUserName,
  pfileName,
  priority
) => ({
  [BACK_SEND_API]: {
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
        nonOfficeUser: false,
        userName: username,
        roleName: role,
        fileId: id,
        priority,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        userName: username,
        displayUsername: displayUserName,
        pfileName: pfileName,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const sendFilesInternal = (
  id,
  data,
  role,
  username,
  displayUserName,
  priority
) => ({
  [BACK_SEND_API]: {
    types: [
      AT.SEND_FILES_FAILURE,
      AT.SEND_FILES_REQUEST,
      AT.SEND_FILES_SUCCESS,
    ],
    endpoint: `/api/send-eyes-only/${id}`,
    settings: {
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        userName: username,
        priority,
        displayUsername: displayUserName,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const addToFavourite = (data, { username, role }, type) => ({
  [BACK_SEND_API]: {
    types: [
      AT.ADD_TO_FAVOURITE_FAILURE,
      AT.ADD_TO_FAVOURITE_REQUEST,
      AT.ADD_TO_FAVOURITE_SUCCESS,
    ],
    endpoint: `/api/v2/add_to_favourite/${type}`,

    settings: {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        role: username ? username : role,
        data: data,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const fetchFavouriteList = (username, role, type) => ({
  [BACK_SEND_API]: {
    types: [
      AT.FETCH_FAVOURITE_LIST_FAILURE,
      AT.FETCH_FAVOURITE_LIST_REQUEST,
      AT.FETCH_FAVOURITE_LIST_SUCCESS,
    ],
    endpoint: `/api/v2/fetch_favourite/${type}`,

    settings: {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        role: username ? username : role,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const deleteFavourite = (data, { username, role }, type) => ({
  [BACK_SEND_API]: {
    types: [
      AT.DELETE_FAVOURITE_FAILURE,
      AT.DELETE_ANNEXURE_REQUEST,
      AT.DELETE_ANNEXURE_SUCCESS,
    ],
    endpoint: `/api/v2/delete_favourite/${type}`,

    settings: {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        role: username ? username : role,
        data: data,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
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
  [BACK_UTIL_API]: {
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

export const uploadAnnexure = (
  personalAppId,
  file,
  role,
  username,
  onUploadProgress,
  subject
) => ({
  [BACK_API_AXIOS]: {
    types: [
      AT.ANNEXURE_FILE_REQUEST,
      AT.ANNEXURE_FILE_SUCCESS,
      AT.ANNEXURE_FILE_FAILURE,
    ],
    endpoint: `/api/upload/annexure/file/` + personalAppId,
    body: file,
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
      sessionId: sessionStorage.getItem("sessionId"),
      roleName: role,
      userName: username,
      subject,
      department: sessionStorage.getItem("department"),
      address: sessionStorage.getItem("ipAddress"),
    },
    onUploadProgress,
  },
});

export const uploadPcAnnexure = (
  id,
  file,
  role,
  username,
  subject,
  onUploadProgress
) => ({
  [BACK_API_AXIOS]: {
    types: [
      AT.PC_ANNEXURE_FILE_REQUEST,
      AT.PC_ANNEXURE_FILE_SUCCESS,
      AT.PC_ANNEXURE_FILE_FAILURE,
    ],
    endpoint: `/api/upload/annexure/serviceLetter/${id}`,
    body: file,
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
      sessionId: sessionStorage.getItem("sessionId"),
      roleName: role,
      userName: username,
      subject,
      department: sessionStorage.getItem("department"),
      address: sessionStorage.getItem("ipAddress"),
    },
    onUploadProgress,
  },
});

export const getbyfilename = (value) => ({
  [BACKEND_API_SAU]: {
    types: [AT.HRM_SAU_REQUEST, AT.HRM_SAU_SUCCESS, AT.HRM_SAU_FAILURE],
    endpoint: `/saufileszip/getbyfilename`,

    settings: {
      method: "post",
      body: value,
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

export const quickSign = (
  value,
  roleName,
  depart,
  username,
  flagNum,
  annexureSign,
  annexureId,
  pfileName,
  isRti,
  fileId,
  body,
  isBm
) => ({
  [isRti ? BACK_RTI_API : BACK_SIGN_API]: {
    types: [AT.QICK_SIGN_REQUEST, AT.QICK_SIGN_SUCCESS, AT.QICK_SIGN_FAILURE],
    endpoint: `/api/sign?color=${value.color}&comments=${value.comments}&dep_desc=${value.dep_desc}&partCaseFileId=${value.partCaseFileId}&pencilColorCode=${value.pencilColorCode}&personalAppliactionFileId=${value.personalAppliactionFileId}&signTitle=${value.signTitle}&tag=${value.tag}&url=${value.url}&username=${value.username}&user_desc=${value.user_desc}`,

    settings: {
      method: "post",
      // body: value,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: roleName,
        department: depart,
        userName: username,
        flagNumber: flagNum,
        annexureSign: annexureSign,
        annexureId: annexureId,
        pfileName: pfileName,
        userName: localStorage.getItem("username"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        fileId: fileId,
        isBm,
      },
      body: JSON.stringify(body),
    },
  },
});

export const getGroupList = (value) => ({
  [BACKEND_API_SAU]: {
    types: [
      AT.GROUP_LIST_REQUEST,
      AT.GROUP_LIST_SUCCESS,
      AT.GROUP_LIST_FAILURE,
    ],
    // endpoint: `/causaumapping/getsaudisplay`,
    endpoint: `/saufileszip/getsaudisplay`,

    settings: {
      method: "post",
      body: value,
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

export const getHrmFileList = (value) => ({
  [BACK_HRM_API]: {
    types: [AT.HRM_LIST_REQUEST, AT.HRM_LIST_SUCCESS, AT.HRM_LIST_FAILURE],
    endpoint: `/api/getHrm`,

    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        inboxId: value,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getServiceLetterList = (
  value,
  department,
  username,
  roleName,
  pageNumber,
  pageSize
) => ({
  [BACK_PC_API]: {
    types: [
      AT.SERVICE_LIST_REQUEST,
      AT.SERVICE_LIST_SUCCESS,
      AT.SERVICE_LIST_FAILURE,
    ],
    endpoint: `/api/getServiceLetter`,

    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        inboxId: value,
        department,
        roleName,
        username,
        pageNumber,
        pageSize,
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getPAWithAnnexureList = (value) => ({
  [BACK_HRM_API]: {
    types: [
      AT.FETCH_PAWITHANNEXURE_REQUEST,
      AT.FETCH_PAWITHANNEXURE_SUCCESS,
      AT.FETCH_PAWITHANNEXURE_FAILURE,
    ],
    endpoint: `/api/getAnnexurelist`,

    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        paId: value,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getSection = (value) => ({
  [BACKEND_API_SAU]: {
    types: [
      AT.FETCH_SECTION_REQUEST,
      AT.FETCH_SECTION_SUCCESS,
      AT.FETCH_SECTION_FAILURE,
    ],
    // endpoint: `/api/getSection`,
    endpoint: `/saufileszip/getSection`,

    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        section: value,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getServiceNumber = (value) => ({
  [BACKEND_API_SAU]: {
    types: [
      AT.FETCH_SERVICENUMBER_REQUEST,
      AT.FETCH_SERVICENUMBER_SUCCESS,
      AT.FETCH_SERVICENUMBER_FAILURE,
    ],
    endpoint: `/saufileszip/getServiceNumber`,

    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: value,
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getInternalServiceNumber = (value, groupName) => ({
  [BACKEND_API_SAU]: {
    types: [
      AT.FETCH_INTERNALSERVICENUMBER_REQUEST,
      AT.FETCH_INTERNALSERVICENUMBER_SUCCESS,
      AT.FETCH_INTERNALSERVICENUMBER_FAILURE,
    ],
    endpoint: `/saufileszip/getInternalServiceNumber`,

    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: value,
        grp: groupName,
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const sendFilesSection = (
  id,
  data,
  rolename,
  department,
  username,
  value,
  pfileName,
  body,
  flgNo,
  isReturn,
  sendTo
) => ({
  [BACK_FORWARD_API]: {
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
        toRoleName: data.roleName,
        group: data.groupName,
        fromroleName: data.fromRole,
        displayDeptName: data.displayDeptName,
        displayRoleName: data.displayRoleName,
        coverLetter: value,
        pfileName: pfileName,
        flagNumber: flgNo,
        isReturn,
        sendTo,
        rolename,
        department,
        username,
      },
    },
  },
});

export const sendFilesServiceNumber = (
  id,
  data,
  value,
  pfileName,
  body,
  flgNo,
  serviceLetterId,
  isReturn,
  sendTo
) => ({
  [BACK_FORWARD_API]: {
    types: [
      AT.SENDFILESERVICENUMBER_REQUEST,
      AT.SENDFILESERVICENUMBER_SUCCESS,
      AT.SENDFILESERVICENUMBER_FAILURE,
    ],
    endpoint:
      `/api/${
      // serviceLetterId ? "sendAsServiceLetter" : "sendFilesServiceNumber"
      "sendFilesServiceNumber"
      }/` + id,

    settings: {
      method: "post",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        toroleName: data.roleName,
        userName: data.userName,
        group: data.groupName,
        fromroleName: data.fromRole,
        displayDeptName: data.displayDeptName,
        displayRoleName: data.displayRoleName,
        coverLetter: value,
        pfileName: pfileName,
        flagNumber: flgNo,
        serviceLetterId,
        isReturn,
        sendTo,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const sendFilesInternalServiceNumber = (
  id,
  data,
  value,
  pfileName,
  body,
  flgNo,
  sendTo
) => ({
  [BACK_FORWARD_API]: {
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
        toroleName: data.roleName,
        userName: data.userName,
        group: data.groupName,
        fromroleName: data.fromRole,
        displayDeptName: data.displayDeptName,
        displayRoleName: data.displayRoleName,
        coverLetter: value,
        pfileName: pfileName,
        flagNumber: flgNo,
        sendTo,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getPartCaseData = (
  data,
  department,
  roleName,
  username,
  isBm
) => ({
  [BACK_PC_API]: {
    types: [
      AT.PART_CASE_DATA_REQUEST,
      AT.PART_CASE_DATA_SUCCESS,
      AT.PART_CASE_DATA_FAILURE,
    ],
    endpoint: `/api/getPartCaseData`,

    settings: {
      method: "POST",
      body: data,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        department,
        roleName,
        username,
        isBm,
      },
    },
  },
});

export const getSplitViewInboxData = (id, username, isBm) => ({
  [BACK_PC_API]: {
    types: [
      AT.SPLITVIEW_INBOXDATA_REQUEST,
      AT.SPLITVIEW_INBOXDATA_SUCCESS,
      AT.SPLITVIEW_INBOXDATA_FAILURE,
    ],
    endpoint: `/api/getInboxDataSplitView/` + id,

    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: username,
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        isBm,
      },
    },
  },
});

export const savePartCaseTag = (partcaseID, data) => ({
  [BACK_PC_API]: {
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

export const createPartCaseNotingFile = (partcaseID, groupName) => ({
  [BACK_PC_API]: {
    types: [
      AT.CREATE_PARTCASE_NOTING_REQUEST,
      AT.CREATE_PARTCASE_NOTING_SUCCESS,
      AT.CREATE_PARTCASE_NOTING_FAILURE,
    ],
    endpoint: `/api/createPartCaseNotingFile`,
    settings: {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        grp: groupName,
        pcId: partcaseID,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const createCoverLetter = (
  partcaseID,
  groupName,
  subject,
  value,
  username,
  department
) => ({
  [BACK_PC_API]: {
    types: [
      AT.CREATE_COVER_LETTER_REQUEST,
      AT.CREATE_COVER_LETTER_SUCCESS,
      AT.CREATE_COVER_LETTER_FAILURE,
    ],
    endpoint: `/api/addCoverLetter/${partcaseID}`,
    settings: {
      method: "POST",
      body: JSON.stringify(value),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: groupName,
        subject: subject,
        userName: username,
        department,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const PCFileClosuer = (inboxID, status, pfileName) => ({
  [BACK_MERGE_PC_API]: {
    types: [
      AT.UPDATE_PARTCASE_STATUS_REQUEST,
      AT.UPDATE_PARTCASE_STATUS_SUCCESS,
      AT.UPDATE_PARTCASE_STATUS_FAILURE,
    ],
    endpoint: `/api/fileClosure`,
    settings: {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        inboxId: inboxID,
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

export const getHistory = (type, id) => ({
  [BACK_HISTORY_API]: {
    types: [
      AT.FETCH_HISTORY_REQUEST,
      AT.FETCH_HISTORY_SUCCESS,
      AT.FETCH_HISTORY_FAILURE,
    ],
    endpoint: `/api/gethistory/${type}/${id}`,

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

export const rollbackPADocument = (id) => ({
  [BACK_CREATEPA_API]: {
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
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const rollbackSplitViewDocument = (id, flagNumber, fileId) => ({
  [BACK_PC_API]: {
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
        fileId,
      },
    },
  },
});

export const rollbackSplitViewEnclosureDocument = (id, flagNumber, fileId) => ({
  [BACK_PC_API]: {
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
        fileId,
      },
    },
  },
});

export const editFlagNumber = (
  pcId,
  newFlagNumber,
  oldFlagNumber,
  roleName,
  fileId,
  subject
) => ({
  [BACK_PC_API]: {
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
        replaceWith: newFlagNumber,
        flagNumber: oldFlagNumber,
        roleName: roleName,
        fileId,
        subject,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});
export const editEncoSubject = (
  pcId, fileId, subject
) => ({
  [BACK_PC_API]: {
    types: [
      AT.PART_CASE_DATA_REQUEST,
      AT.PART_CASE_DATA_SUCCESS,
      AT.PART_CASE_DATA_FAILURE,
    ],
    endpoint: `/api/editSubject`,

    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        pcId,
        fileId,
        subject,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const validateFlagNumber = (pcId, flagNumber) => ({
  [BACK_PC_API]: {
    types: [
      AT.PART_CASE_DATA_REQUEST,
      AT.PART_CASE_DATA_SUCCESS,
      AT.PART_CASE_DATA_FAILURE,
    ],
    endpoint: `/api/editSubject`,

    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        pcId: pcId,
        flagNumber: flagNumber,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getCabinaetData = (
  roleName,
  department,
  username,
  val,
  pageSize,
  pageNumber,
  abortSignal
) => ({
  [BACK_PC_API]: {
    types: [
      AT.GET_CABINATE_REQUEST,
      AT.GET_CABINATE_SUCCESS,
      AT.GET_CABINATE_FAILURE,
    ],
    endpoint: "/api/getCabinetData",
    settings: {
      method: "POST",
      signal: abortSignal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId,
        roleName: roleName,
        department: department,
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        address: sessionStorage.getItem("ipAddress"),
        pageNumber,
        pageSize,
      },
      body: JSON.stringify(val),
    },
  },
});

export const returnPA = (id, group) => ({
  [BACK_SEND_API]: {
    types: [AT.RETURN_PA_REQUEST, AT.RETURN_PA_SUCCESS, AT.RETURN_PA_FAILURE],
    endpoint: `/api/return-pa/${id}`,
    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        group: group,
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const sendAuditdata = (username, actions, status) => ({
  [BACK_AUDIT_API]: {
    types: [
      AT.UPDATE_PARTCASE_STATUS_REQUEST,
      AT.UPDATE_PARTCASE_STATUS_SUCCESS,
      AT.UPDATE_PARTCASE_STATUS_FAILURE,
    ],
    endpoint: `/api/config`,
    settings: {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
      },
      body: {
        username: username,
        actions: actions,
        status: status,
      },
    },
  },
});
// YELLOW NOTES AND REMARKS

export const getYlowNotesDataSplitview = (pcID, pageNumber, pageSize) => ({
  [BACK_PC_API]: {
    types: [
      AT.SPLITVIEW_YELLOW_NOTES_REQUEST,
      AT.SPLITVIEW_YELLOW_NOTES_SUCCESS,
      AT.SPLITVIEW_YELLOW_NOTES_FAILURE,
    ],
    endpoint: `/api/fetch-yellow-notes`,

    settings: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        partcaseId: pcID,
        pageNumber: pageNumber,
        pageSize: pageSize,
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getRemarksDataSplitview = (
  pcID,
  pageNumber,
  pageSize,
  department
) => ({
  [BACK_PC_API]: {
    types: [
      AT.SPLITVIEW_REMARKS_LIST_REQUEST,
      AT.SPLITVIEW_REMARKS_LIST_SUCCESS,
      AT.SPLITVIEW_REMARKS_LIST_FAILURE,
    ],
    endpoint: `/api/fetch-remarks`,

    settings: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        department: department,
        partcaseId: pcID,
        pageNumber: pageNumber,
        pageSize: pageSize,
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const addYlowNoteSplitview = (val) => ({
  [BACK_PC_API]: {
    types: [
      AT.SPLITVIEW_ADD_YELLOW_NOTE_REQUEST,
      AT.SPLITVIEW_ADD_YELLOW_NOTE_SUCCESS,
      AT.SPLITVIEW_ADD_YELLOW_NOTE_FAILURE,
    ],
    endpoint: `/api/add-yellow-note`,

    settings: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      body: JSON.stringify(val),
    },
  },
});

export const deleteYlowNoteSplitview = (id, roleName) => ({
  [BACK_PC_API]: {
    types: [
      AT.SPLITVIEW_ADD_YELLOW_NOTE_REQUEST,
      AT.SPLITVIEW_ADD_YELLOW_NOTE_SUCCESS,
      AT.SPLITVIEW_ADD_YELLOW_NOTE_FAILURE,
    ],
    endpoint: `/api/delete-yellow-note`,
    settings: {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        id: id,
        roleName: roleName,
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const temporaryCloseFileSplitView = (val) => ({
  [BACK_PC_API]: {
    types: [
      AT.SPLITVIEW_TEMPORARY_CLOSE_FILE_REQUEST,
      AT.SPLITVIEW_TEMPORARY_CLOSE_FILE_SUCCESS,
      AT.SPLITVIEW_TEMPORARY_CLOSE_FILE_FAILURE,
    ],
    endpoint: `/api/close-file/`,
    settings: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      body: JSON.stringify(val),
    },
  },
});

export const getexternalcabinet = (department, pageSize, pageNumber) => ({
  [BACK_PC_API]: {
    types: [
      AT.GET_EXTERNAL_CABINET_REQUEST,
      AT.GET_EXTERNAL_CABINET_SUCCESS,
      AT.GET_EXTERNAL_CABINET_FAILURE,
    ],
    endpoint: "/api/get-external-cabinet",
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),

        department: department,
        pageNumber,
        pageSize,
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});
export const getcabinetpartcase = (department, cabinetpartcase, isBm) => ({
  [BACK_PC_API]: {
    types: [
      AT.GET_CABINET_PARTCASE_REQUEST,
      AT.GET_CABINET_PARTCASE_SUCCESS,
      AT.GET_CABINET_PARTCASE_FAILURE,
    ],
    endpoint: "/api/get-cabinet-partcase/" + cabinetpartcase,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        department: department,
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        address: sessionStorage.getItem("ipAddress"),
        isBm,
      },
    },
  },
});
export const openFile = (department, cabinetpartcase) => ({
  [BACK_PC_API]: {
    types: [
      AT.GET_OPEN_FILE_REQUEST,
      AT.GET_OPEN_FILE_SUCCESS,
      AT.GET_OPEN_FILE_FAILURE,
    ],
    endpoint: "/api/open-file/" + cabinetpartcase,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        department: department,
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

/*-------------------------------file Module-----------------------------------*/
export const createFile = (val) => ({
  [BACKEND_FILE]: {
    types: [
      AT.CREATE_FILE_REQUEST,
      AT.CREATE_FILE_SUCCESS,
      AT.CREATE_FILE_FAILURE,
    ],
    endpoint: "/api/createFile",
    settings: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      body: JSON.stringify(val),
    },
  },
});

export const getSubSection = () => ({
  [BACKEND_FILE]: {
    types: [
      AT.GET_SUB_SECTION_REQUEST,
      AT.GET_SUB_SECTION_SUCCESS,
      AT.GET_SUB_SECTION_FAILURE,
    ],
    endpoint: "/api/getSubSection",
    settings: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
export const getBlock = () => ({
  [BACKEND_FILE]: {
    types: [AT.GET_BLOCK_REQUEST, AT.GET_BLOCK_SUCCESS, AT.GET_BLOCK_FAILURE],
    endpoint: "/api/getBlock",
    settings: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

export const getCustodian = (value) => ({
  [BACKEND_FILE]: {
    types: [
      AT.GET_CABINATE_REQUEST,
      AT.GET_CUSTODIAN_SUCCESS,
      AT.GET_CUSTODIAN_FAILURE,
    ],
    endpoint: "/api/getCustodian",
    settings: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        custodian: value,
      },
    },
  },
});

export const uploadNotingFile = (id, file, subject, config, isInternal) => ({
  [BACKEND_FILE]: {
    types: [
      AT.NOTING_FILE_UPLOAD_REQUEST,
      AT.NOTING_FILE_UPLOAD_SUCCESS,
      AT.NOTING_FILE_UPLOAD_FAILURE,
    ],
    endpoint: `/api/uploadNoting/${id}`,
    settings: {
      method: "post",
      body: file,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        subject,
        roleName: sessionStorage.getItem("role"),
        userName: localStorage.getItem("username"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        isInternal,
      },
    },
    config,
  },
});
/*-------------------------------file Module-----------------------------------*/

/*-------------------------------Correspondence-------------------------------- */

export const getAllCorespondence = (pageSize, pageNumber) => ({
  [BACK_CREATECORRESPONDENCE_API]: {
    types: [
      AT.GET_CORRESPONDENCE_LIST_REQUEST,
      AT.GET_CORRESPONDENCE_LIST_SUCCESS,
      AT.GET_CORRESPONDENCE_LIST_FAILURE,
    ],
    endpoint: `/api/v2/fetch-all-correspondences`,
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
        pageSize,
        pageNumber,
      },
    },
  },
});

export const addCorrespondence = (
  subject,
  type,
  classification,
  nofID,
  nofFileName,
  priority
) => ({
  [BACK_CREATECORRESPONDENCE_API]: {
    types: [
      AT.ADD_CORRESPONDENCE_FAILURE,
      AT.ADD_CORRESPONDENCE_REQUEST,
      AT.ADD_CORRESPONDENCE_SUCCESS,
    ],
    endpoint: `/api/v2/add-correspondence`,

    settings: {
      method: "post",
      body: JSON.stringify({
        nofFileId: nofID,
        fileNo: nofFileName,
        subject: subject,
        type: type,
        classification: classification,
        priority: priority,
        rolename: sessionStorage.getItem("role"),
        username: localStorage.getItem("username"),
        department: sessionStorage.getItem("department"),
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
      },
    },
  },
});

export const getCorespondence = (id) => ({
  [BACK_CREATECORRESPONDENCE_API]: {
    types: [
      AT.GET_CORRESPONDENCE_REQUEST,
      AT.GET_CORRESPONDENCE_SUCCESS,
      AT.GET_CORRESPONDENCE_FAILURE,
    ],
    endpoint: `/api/v2/get-correspondence/${id}`,
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

export const getCorrAnnexureTableData = (docId) => ({
  [BACK_CREATECORRESPONDENCE_API]: {
    types: [
      AT.GET_CORR_ANNEXURE_REQUEST,
      AT.GET_CORR_ANNEXURE_SUCCESS,
      AT.GET_CORR_ANNEXURE_FAILURE,
    ],
    endpoint: `/api/v2/annexures/${docId}`,
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

export const getCorrReferenceTableData = (docId) => ({
  [BACK_CREATECORRESPONDENCE_API]: {
    types: [
      AT.GET_CORR_REFERENCE_REQUEST,
      AT.GET_CORR_REFERENCE_SUCCESS,
      AT.GET_CORR_REFERENCE_FAILURE,
    ],
    endpoint: `/api/v2/references/${docId}`,
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

export const rollbackCorrDocument = (body) => ({
  [BACK_CREATECORRESPONDENCE_API]: {
    types: [
      AT.ROLLBACK_CORR_DOC_REQUEST,
      AT.ROLLBACK_CORR_DOC_SUCCESS,
      AT.ROLLBACK_CORR_DOC_FAILURE,
    ],
    endpoint: `/api/v2/remove-sign`,
    settings: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      body: JSON.stringify(body),
    },
  },
});

export const uploadCorrespondenceAnnexure = (id, file, subject) => ({
  [BACK_CREATECORRESPONDENCE_API]: {
    types: [
      AT.UPLOAD_CORR_ANNEXURE_REQUEST,
      AT.UPLOAD_CORR_ANNEXURE_SUCCESS,
      AT.UPLOAD_CORR_ANNEXURE_FAILURE,
    ],
    endpoint: `/api/v2/upload/annexures/${id}`,
    settings: {
      method: "PUT",
      body: file,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        username: localStorage.getItem("username"),
        rolename: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        subject: subject,
      },
    },
  },
});

export const uploadCorrespondenceReference = (id, file, subject) => ({
  [BACK_CREATECORRESPONDENCE_API]: {
    types: [
      AT.UPLOAD_CORR_REFERENCE_REQUEST,
      AT.UPLOAD_CORR_REFERENCE_SUCCESS,
      AT.UPLOAD_CORR_REFERENCE_FAILURE,
    ],
    endpoint: `/api/v2/upload/references/${id}`,
    settings: {
      method: "PUT",
      body: file,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        username: localStorage.getItem("username"),
        rolename: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        subject: subject,
      },
    },
  },
});

export const sendInternalCorespondence = (id, to, value, pfileName, body) => ({
  [BACK_CREATECORRESPONDENCE_API]: {
    types: [
      AT.SEND_CORR_INTERNAL_REQUEST,
      AT.SEND_CORR_INTERNAL_SUCCESS,
      AT.SEND_CORR_INTERNAL_FAILURE,
    ],
    endpoint: `/api/v2/send-internal-correspondence/${id}`,

    settings: {
      method: "post",
      body: JSON.stringify({
        ...body,
        to,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        srcDept: sessionStorage.getItem("department"),
        fromRolename: sessionStorage.getItem("role"),
      },
    },
  },
});

export const sendEyesonlyCorespondence = (
  id,
  to,
  copy,
  info,
  value,
  pfileName,
  body
) => ({
  [BACK_CREATECORRESPONDENCE_API]: {
    types: [
      AT.SEND_CORR_EYES_REQUEST,
      AT.SEND_CORR_EYES_SUCCESS,
      AT.SEND_CORR_EYES_FAILURE,
    ],
    endpoint: `/api/v2/send-eyes-only-correspondence/${id}`,

    settings: {
      method: "post",
      body: JSON.stringify({
        ...body,
        to,
        copy,
        info,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        srcDept: sessionStorage.getItem("department"),
        fromRolename: sessionStorage.getItem("role"),
      },
    },
  },
});

export const sendExternalCorespondence = (id, to, copy, info, body) => ({
  [BACK_CREATECORRESPONDENCE_API]: {
    types: [
      AT.SEND_CORR_EXTERNAL_REQUEST,
      AT.SEND_CORR_EXTERNAL_SUCCESS,
      AT.SEND_CORR_EXTERNAL_FAILURE,
    ],
    endpoint: `/api/v2/send-section-correspondence/${id}`,

    settings: {
      method: "post",
      body: JSON.stringify({
        to,
        copy,
        info,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        srcDept: sessionStorage.getItem("department"),
        fromRolename: sessionStorage.getItem("role"),
      },
    },
  },
});
