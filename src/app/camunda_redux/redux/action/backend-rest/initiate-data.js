import * as AT from "../../constants/ActionTypes";
import { BACK_API } from "../../../../middleware/backend";
import { BACK_API1 } from "../../../../middleware/backendPA";
import { BACKEND_API_MISS } from "../../../../middleware/backendMIS";
import localStorageService from "../../../../services/localStorageService";
import { BACK_USER_MANAGEMENT_API } from "../../../../middleware/backend_userManagement";
import { BACK_CREATEPF_API } from "app/middleware/backend_createPF";
import { BACK_CREATEPA_API } from "app/middleware/backend_createPA";
import { BACK_UTIL_API } from "app/middleware/backend_util";
import { BACK_ANNEXURE_API } from "app/middleware/backend_annexure";
import { BACK_ADVANCESEARCH_API } from "app/middleware/advance_search";
import { BACK_RETRIEVAL_API } from "app/middleware/backend_retrieval";
import { NOTIFICATION_SERVICE } from "app/middleware/notification_service";
import { BACK_PC_API } from "app/middleware/backend_partCase";
import { URL_HIDE } from "app/middleware/URL_hide";
import { BACK_ADASBOARD_COUNT_API } from "app/middleware/Admin/backend_admin_dashboard";
import { BACK_ADMIN_USERS_API } from "app/middleware/Admin/backend_admin_users";
import { BACK_ADMIN_ROLES_API } from "app/middleware/Admin/backend_admin_roles";
import { BACK_ADMIN_DEPARTMENTS_API } from "app/middleware/Admin/backend_admin_departments";
import { SPLIT_DEPARTMENT_API } from "app/middleware/split_department";
import { BACKEND_FILE } from "app/middleware/backend_file";

export const getClassificationData = () => ({
  [BACK_API]: {
    types: [
      AT.CLASSIFICATION_REQUEST,
      AT.CLASSIFICATION_SUCCESS,
      AT.CLASSIFICATION_FAILURE,
    ],
    endpoint: `/api/getFileClassification`,
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

export const getTypeData = () => ({
  [BACK_API]: {
    types: [AT.TYPE_REQUEST, AT.TYPE_SUCCESS, AT.TYPE_FAILURE],
    endpoint: `/api/getFileType`,
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

export const getRolesData = () => ({
  [BACK_API]: {
    types: [AT.ROLES_REQUEST, AT.ROLES_SUCCESS, AT.ROLES_FAILURE],
    endpoint: `/api/getRoles`,
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
export const getUserRolesData = (username) => ({
  [BACK_USER_MANAGEMENT_API]: {
    types: [
      AT.USER_ROLES_REQUEST,
      AT.USER_ROLES_SUCCESS,
      AT.USER_ROLES_FAILURE,
    ],
    endpoint: `/api/getUserRoles`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: username || localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const sideNav = (value, isServiceNumber, isRole) => ({
  [BACK_USER_MANAGEMENT_API]: {
    types: [AT.SIDENAV_REQUEST, AT.SIDENAV_SUCCESS, AT.SIDENAV_FAILURE],
    endpoint: `/api/sidenav`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        dropdown: value,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getGroupsData = () => ({
  [BACK_API]: {
    types: [AT.GROUPS_REQUEST, AT.GROUPS_SUCCESS, AT.GROUPS_FAILURE],
    endpoint: `/api/getGroups`,
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

export const getDraftData = (role) => ({
  [BACK_API]: {
    types: [
      AT.DRAFT_DATA_FAILURE,
      AT.DRAFT_DATA_SUCCESS,
      AT.DRAFT_DATA_REQUEST,
    ],
    endpoint: `/api/getDraftData`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
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

export const getOutboxData = (
  role,
  username,
  pageSize,
  pageNumber,
  Date,
  value,
  abortSignal
) => ({
  [BACK_RETRIEVAL_API]: {
    types: [
      AT.OUTBOX_DATA_REQUEST,
      AT.OUTBOX_DATA_SUCCESS,
      AT.OUTBOX_DATA_FAILURE,
    ],
    endpoint: `/api/getOutboxData`,
    settings: {
      method: "POST",
      signal: abortSignal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        userName: username,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        pageSize: pageSize,
        pageNumber: pageNumber,
      },
      body: JSON.stringify(value),
    },
  },
});

export const getDataForExport = (role, username, ranges) => ({
  [BACK_RETRIEVAL_API]: {
    types: [
      AT.OUTBOX_DATA_EXPORT_REQUEST,
      AT.OUTBOX_DATA_EXPORT_SUCCESS,
      AT.OUTBOX_DATA_EXPORT_FAILURE,
    ],
    endpoint: `/api/exportOutboxData`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        userName: username,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      body: JSON.stringify(ranges),
    },
  },
});

export const getOutboxRow = (id) => ({
  [BACK_RETRIEVAL_API]: {
    types: [
      AT.OUTBOX_ROW_REQUEST,
      AT.OUTBOX_ROW_SUCCESS,
      AT.OUTBOX_ROW_FAILURE,
    ],
    endpoint: `/api/getOutbox/${id}`,
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

export const getInboxData = (
  role,
  username,
  department,
  pageSize,
  pageNumber,
  selectedMenuItem,
  val,
  abortSignal
) => ({
  [BACK_RETRIEVAL_API]: {
    types: [
      AT.INBOX_DATA_REQUEST,
      AT.INBOX_DATA_SUCCESS,
      AT.INBOX_DATA_FAILURE,
    ],
    endpoint: `/api/getInboxData`,
    settings: {
      method: "POST",
      signal: abortSignal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        userName: username,
        department,
        pageSize: pageSize,
        pageNumber: pageNumber,
        filter: selectedMenuItem,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      body: JSON.stringify(val),
    },
  },
});

export const getEnclosureData = (id) => ({
  [BACK_API]: {
    types: [
      AT.ENCLOSURE_DATA_FAILURE,
      AT.ENCLOSURE_DATA_REQUEST,
      AT.ENCLOSURE_DATA_SUCCESS,
    ],
    endpoint: `/api/enclosure/data/` + id,
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

export const getNotingData = (id) => ({
  [BACK_API]: {
    types: [
      AT.NOTING_DATA_FAILURE,
      AT.NOTING_DATA_REQUEST,
      AT.NOTING_DATA_SUCCESS,
    ],
    endpoint: `/api/noting/data/` + id,
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

export const getFileUrl = (url) => ({
  [BACK_API]: {
    types: [AT.FILE_FAILURE, AT.FILE_REQUEST, AT.FILE_SUCCESS],
    endpoint: `/api/fileUrl`,
    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        url: url,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getSfdt = (url, username, id, role, grp) => ({
  [BACK_UTIL_API]: {
    types: [AT.SFDT_FAILURE, AT.SFDT_REQUEST, AT.SFDT_SUCCESS],
    endpoint: `/api/sfdt`,
    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        url: url,
        userName: username,
        fileId: id,
        roleName: role,
        groupName: grp,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getReadStatus = (inboxId, readStatus) => ({
  [BACK_RETRIEVAL_API]: {
    types: [AT.STATUS_REQUEST, AT.STATUS_SUCCESS, AT.STATUS_FAILURE],
    endpoint: `/api/inboxStatus`,
    settings: {
      method: "POST",
      body: JSON.stringify(inboxId),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        status: readStatus,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getFlagStatus = (inboxId) => ({
  [BACK_RETRIEVAL_API]: {
    types: [AT.FLAG_REQUEST, AT.FLAG_SUCCESS, AT.FLAG_FAILURE],
    endpoint: `/api/flagInbox`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        inboxId: inboxId,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getPinInboxId = (inboxId) => ({
  [BACK_RETRIEVAL_API]: {
    types: [AT.PIN_REQUEST, AT.PIN_SUCCESS, AT.PIN_FAILURE],
    endpoint: `/api/pinInbox`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        inboxId: inboxId,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const URLHide = (url) => ({
  [URL_HIDE]: {
    types: [AT.TEST_URL_REQUEST, AT.TEST_URL_SUCCESS, AT.TEST_URL_FAILURE],
    endpoint: `/api/url?urls=${url}`,
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

export const getFileTypeData = () => ({
  [BACK_API]: {
    types: [AT.PATYPE_REQUEST, AT.PATYPE_SUCCESS, AT.PATYPE_FAILURE],
    endpoint: `/api/getPersonalFileType`,
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

export const getPF = (username, role, pageSize, pageNumber, value) => ({
  [BACK_CREATEPF_API]: {
    types: [AT.PF_REQUEST, AT.PF_SUCCESS, AT.PF_FAILURE],
    endpoint: `/api/getPersonalFile`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: username,
        roleName: role,
        pageSize: pageSize,
        pageNumber: pageNumber,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      body: JSON.stringify(value),
    },
  },
});

export const getPFileData = (username, role) => ({
  [BACK_CREATEPF_API]: {
    types: [AT.PFILE_REQUEST, AT.PFILE_SUCCESS, AT.PFILE_FAILURE],
    endpoint: `/api/getPFile`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: username,
        roleName: role,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getPATableData = (username, role, pageSize, pageNumber) => ({
  [BACK_CREATEPA_API]: {
    types: [AT.PA_TABLE_REQUEST, AT.PA_TABLE_SUCCESS, AT.PA_TABLE_FAILURE],
    endpoint: `/api/getApplicationData`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: username,
        roleName: role,
        pageSize: pageSize,
        pageNumber: pageNumber,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getPADashboardData = (
  username,
  role,
  department,
  pageSize,
  pageNumber,
  value,
  abortSignal
) => ({
  [BACK_CREATEPA_API]: {
    types: [
      AT.PA_DASHBOARD_REQUEST,
      AT.PA_DASHBOARD_SUCCESS,
      AT.PA_DASHBOARD_FAILURE,
    ],
    endpoint: `/api/getDashboardData`,
    settings: {
      method: "POST",
      signal: abortSignal,
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: username,
        roleName: role,
        department,
        pageSize: pageSize,
        pageNumber: pageNumber,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      body: JSON.stringify(value),
    },
  },
});

export const getAnnexureTableData = (userName, roleName, department, id) => ({
  [BACK_ANNEXURE_API]: {
    types: [
      AT.ANNEXURE_LIST_REQUEST,
      AT.ANNEXURE_LIST_SUCCESS,
      AT.ANNEXURE_LIST_FAILURE,
    ],
    endpoint: `/api/getAnnexureData/${id ? id : userName}`,
    settings: {
      method: "POST",
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

// export const getMISTableData = (value) => ({
//     [BACKEND_API_MISS]: {
//         types: [ AT.MIS_LIST_REQUEST, AT.MIS_LIST_SUCCESS, AT.MIS_LIST_FAILURE ],
//         endpoint: `/api/gethierarchyParent1List`,
//         settings: {
//             method: 'POST',
//             body: value,
//             headers: { }
//         }
//     }
//
// });

export const getMISTableData = (value) => ({
  [BACKEND_API_MISS]: {
    types: [AT.MIS_LIST_REQUEST, AT.MIS_LIST_SUCCESS, AT.MIS_LIST_FAILURE],
    endpoint: `/api/getSauData`,
    settings: {
      method: "GET",
      headers: {
        groupName: value,
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});
export const getMISDetailTableData = (value) => ({
  [BACKEND_API_MISS]: {
    types: [
      AT.MIS_DETAIL_LIST_REQUEST,
      AT.MIS_DETAIL_LIST_SUCCESS,
      AT.MIS_DETAIL_LIST_FAILURE,
    ],
    endpoint: `/api/gettotalfiles`,
    settings: {
      method: "POST",
      body: value,
      headers: {
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const deleteAnnexureData = (id) => ({
  [BACK_ANNEXURE_API]: {
    types: [
      AT.DELETE_ANNEXURE_REQUEST,
      AT.DELETE_ANNEXURE_SUCCESS,
      AT.DELETE_ANNEXURE_FAILURE,
    ],
    endpoint: `/api/deleteAnnexureData/` + id,
    settings: {
      method: "POST",
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

export const rollbackAnnexureDocument = (id, value) => ({
  [BACK_ANNEXURE_API]: {
    types: [
      AT.ROLLBACK_PA_REQUEST,
      AT.ROLLBACK_PA_SUCCESS,
      AT.ROLLBACK_PA_FAILURE,
    ],
    endpoint: `/api/annexure/${id}`,
    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        edit: value,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const deleteEnclosure = (rolename, pcId, flagnumber, fileId) => ({
  [BACK_PC_API]: {
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
        roleName: rolename,
        pcId: pcId,
        flagnumber: flagnumber,
        userName: localStorage.getItem("username"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        fileId,
      },
    },
  },
});

export const updateAnnexureData = (id, newFileName) => ({
  [BACK_ANNEXURE_API]: {
    types: [
      AT.UPDATE_ANNEXURE_REQUEST,
      AT.UPDATE_ANNEXURE_SUCCESS,
      AT.UPDATE_ANNEXURE_FAILURE,
    ],
    endpoint: `/api/renameAnnexure/` + id,
    settings: {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        rename: newFileName,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const MoveToBm = (fileId, docId, isBm) => ({
  [BACKEND_FILE]: {
    types: [AT.MOVE_BM_REQUEST, AT.MOVE_BM_SUCCESS, AT.MOVE_BM_FAILURE],
    endpoint: `/api/moveToBM`,
    settings: {
      method: "PUT",
      headers: {
        Accept: "application/json",
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        fileId,
        docId,
        isBm,
      },
    },
  },
});

export const getSectionData = () => ({
  [BACKEND_FILE]: {
    types: [
      AT.GET_SECTION_REQUEST,
      AT.GET_SECTION_SUCCESS,
      AT.GET_SECTION_FAILURE,
    ],
    endpoint: `/api/getSection`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        department: sessionStorage.getItem("department"),
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
      },
    },
  },
});

export const MoveToCC = (fileId, docId, isBm) => ({
  [BACKEND_FILE]: {
    types: [AT.MOVE_BM_REQUEST, AT.MOVE_BM_SUCCESS, AT.MOVE_BM_FAILURE],
    endpoint: `/api/moveToCC`,
    settings: {
      method: "PUT",
      headers: {
        Accept: "application/json",
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        fileId,
        docId,
        isBm,
      },
    },
  },
});

export const createPANotingData = (
  fileTrackID,
  roleName,
  userName,
  groupName,
  personName,
  nofFileID,
  fileNumber,
  custodian,
  isServiceLetter,
  serviceLetterId,
  nofRowData
) => ({
  [BACK_PC_API]: {
    types: [
      AT.CREATE_PANOTING_REQUEST,
      AT.CREATE_PANOTING_SUCCESS,
      AT.CREATE_PANOTING_FAILURE,
    ],
    endpoint: `/api/createPartCaseFile?fileNumber=${personName}`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: roleName,
        username: userName,
        department: groupName,
        fileTrackId: fileTrackID,
        nofFileID: nofFileID,
        fileNo: fileNumber,
        custodian: custodian,
        isServiceLetter,
        serviceLetterId: isServiceLetter ? serviceLetterId : "",
        address: sessionStorage.getItem("ipAddress"),
      },
      body: JSON.stringify(nofRowData),
    },
  },
});

export const addPANotingData = (
  userName,
  groupName,
  serviceLetterId,
  inboxid
) => ({
  [BACK_PC_API]: {
    types: [
      AT.ADD_PANOTING_REQUEST,
      AT.ADD_PANOTING_SUCCESS,
      AT.ADD_PANOTING_FAILURE,
    ],
    endpoint: `/api/addToPartCase`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: userName,
        department: groupName,
        serviceLetterId: serviceLetterId,
        inboxid,
        roleName: sessionStorage.getItem("role"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const createPartCaseServiceLetter = (
  roleName,
  userName,
  groupName,
  nofFileID,
  fileNumber,
  custodian,
  inboxId,
  partcaseId,
  personName,
  serviceLetterId
) => ({
  [BACK_PC_API]: {
    types: [
      AT.CREATE_COVER_LETTER_REQUEST,
      AT.CREATE_COVER_LETTER_SUCCESS,
      AT.CREATE_SERVICE_LETTER_FAILURE,
    ],
    endpoint: `/api/createPartCaseServiceLetter`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: roleName,
        userName: userName,
        nofFileID: nofFileID,
        grp: groupName,
        fileNo: fileNumber,
        custodian: custodian,
        inboxId: inboxId,
        partcaseId: partcaseId,
        fileNumber: personName,
        serviceLetterId: serviceLetterId,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getPANotingData = (id) => ({
  [BACK_API]: {
    types: [
      AT.FETCH_PANOTING_REQUEST,
      AT.FETCH_PANOTING_SUCCESS,
      AT.FETCH_PANOTING_FAILURE,
    ],
    endpoint: `/api/getPANotingData/` + id,
    settings: {
      method: "POST",
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

export const getPAEnclosureData = (ids, id, role, groupName) => ({
  [BACK_API]: {
    types: [
      AT.FETCH_PAENCLOSURE_REQUEST,
      AT.FETCH_PAENCLOSURE_SUCCESS,
      AT.FETCH_PAENCLOSURE_FAILURE,
    ],
    endpoint: `/api/getPAEnclosureData/` + id,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        inboxId: ids,
        grp: groupName,
        userName: localStorage.getItem("username"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getPADraftTableData = (
  username,
  role,
  dept,
  pageSize,
  pageNumber,
  value,
  abortSignal
) => ({
  [BACK_CREATEPA_API]: {
    types: [AT.PADRAFT_REQUEST, AT.PADRAFT_SUCCESS, AT.PADRAFT_FAILURE],
    endpoint: `/api/getApplicationData`,
    settings: {
      method: "POST",
      signal: abortSignal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: username,
        roleName: role,
        department: dept,
        pageSize: pageSize,
        pageNumber: pageNumber,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      body: JSON.stringify(value),
    },
  },
});

export const getPersonalApplicationFileData = (
  pFileName,
  pageSize,
  pageNumber
) => ({
  [BACK_CREATEPA_API]: {
    types: [
      AT.PA_FILE_DATA_REQUEST,
      AT.PA_FILE_DATA_SUCCESS,
      AT.PA_FILE_DATA_FAILURE,
    ],
    endpoint: `/api/getPersonalApplicationFileData/` + pFileName,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        pageSize: pageSize,
        pageNumber: pageNumber,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const fetchSplitViewTags = (partcaseID, dept, isBm) => ({
  [BACK_PC_API]: {
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
        isBm,
      },
    },
  },
});

export const getNotification = (role, username) => ({
  [NOTIFICATION_SERVICE]: {
    types: [
      AT.GET_NOTIFICATION_REQUEST,
      AT.GET_NOTIFICATION_SUCCESS,
      AT.GET_NOTIFICATION_FAILURE,
    ],
    endpoint: `/api/notification`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
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

export const notificationStatus = (role, username) => ({
  [NOTIFICATION_SERVICE]: {
    types: [
      AT.STATUS_NOTIFICATION_REQUEST,
      AT.STATUS_NOTIFICATION_SUCCESS,
      AT.STATUS_NOTIFICATION_FAILURE,
    ],
    endpoint: `/api/notification/change-status`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
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

export const deleteNotification = (role, id) => ({
  [NOTIFICATION_SERVICE]: {
    types: [
      AT.DELETE_NOTIFICATION_REQUEST,
      AT.DELETE_NOTIFICATION_SUCCESS,
      AT.DELETE_NOTIFICATION_FAILURE,
    ],
    endpoint: `/api/delete_notification/` + id,
    settings: {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        // 'role': role,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const deleteAllNotification = (role, username) => ({
  [NOTIFICATION_SERVICE]: {
    types: [
      AT.DELETE_ALL_NOTIFICATION_REQUEST,
      AT.DELETE_ALL_NOTIFICATION_SUCCESS,
      AT.DELETE_ALL_NOTIFICATION_FAILURE,
    ],
    endpoint: `/api/delete_all_notification/`,
    settings: {
      method: "DELETE",
      headers: {
        Accept: "application/json",
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

// ADMIN MODULE

export const getADasboardCount = (date) => ({
  [BACK_ADASBOARD_COUNT_API]: {
    types: [
      AT.ADMIN_DBOARD_COUNT_REQUEST,
      AT.ADMIN_DBOARD_COUNT_SUCCESS,
      AT.ADMIN_DBOARD_COUNT_FAILURE,
    ],
    endpoint: `/dataCount`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      body: date,
    },
  },
});

export const getADUsers = (userId) => ({
  [BACK_ADMIN_USERS_API]: {
    types: [
      AT.GET_ADMIN_USERS_REQUEST,
      AT.GET_ADMIN_USERS_SUCCESS,
      AT.GET_ADMIN_USERS_FAILURE,
    ],
    endpoint: `/UsersTable`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      body: userId,
    },
  },
});

export const getADRoles = (deptName) => ({
  [BACK_ADMIN_ROLES_API]: {
    types: [
      AT.GET_ADMIN_ROLES_REQUEST,
      AT.GET_ADMIN_ROLES_SUCCESS,
      AT.GET_ADMIN_ROLES_FAILURE,
    ],
    endpoint: `/RolesTable`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      body: deptName,
    },
  },
});

export const getADDepartmens = () => ({
  [BACK_ADMIN_DEPARTMENTS_API]: {
    types: [
      AT.GET_ADMIN_DEPARTMENTS_REQUEST,
      AT.GET_ADMIN_DEPARTMENTS_SUCCESS,
      AT.GET_ADMIN_DEPARTMENTS_FAILURE,
    ],
    endpoint: `/DepartmentsTable`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

/***************************************Advance Search************************************** */

export const getAdvanceSearch = (
  names,
  files,
  types,
  from,
  to,
  filesubjects,
  oldfilerefs,
  apiObj,
  contentnamess,
  sendbynamess,
  filenamess,
  subjectnamess,
  createdbynamess,
  rolename,
  size
) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/text-Cabinet?${createdbynamess && `CreatedBy=${createdbynamess}`
      }&${filenamess && `PcFileNumber=${filenamess}`}&${contentnamess && `Text=${contentnamess.slice(0, 100) + "..."}`
      }&${sendbynamess && `SendBy=${sendbynamess}`}&${from && `Datefrom=${from}`
      }&${to && `Dateto=${to}`}&${subjectnamess && `Subject=${subjectnamess}`}&${oldfilerefs && `Oldref=${oldfilerefs}`
      }&${apiObj?.barCreated && `CreatedBy=${apiObj?.barCreated}`}&${apiObj?.barType && `Type=${apiObj?.barType}`
      }&${apiObj?.barSend && `SendBy=${apiObj?.barSend}`}&${apiObj?.barDate && `SType=${apiObj?.barDate}`
      }&${apiObj?.barDocumenttype && `DocumentType=${apiObj?.barDocumenttype}`}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        rolename: rolename,
        size: size,
      },
    },
  },
});

export const getContentData = (value, rolename, scope) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/text-autoSuggest?${value && `Text=${value}`}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        rolename: rolename,
        scope
      },
    },
  },
});
export const getSendData = (value, rolename) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/sendBy-autoSuggest?${value && `SendBy=${value}`}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        rolename: rolename,
      },
    },
  },
});

export const getFilenumberData = (value, rolename) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/pcFileNumber-autoSuggest?${value && `PcFileNumber=${value}`}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        rolename: rolename,
      },
    },
  },
});

export const getSubjectData = (value, rolename) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/subject-autoSuggest?${value && `Subject=${value}`}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        rolename: rolename,
      },
    },
  },
});

export const getCreatedData = (value, rolename) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/createdBy-autoSuggest?${value && `CreatedBy=${value}`}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        rolename: rolename,
      },
    },
  },
});

export const getCabinetStatus = (rolename) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/getStatusList?rolename=${rolename}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
      },
    },
  },
});

export const updateSubjectFileForm = (subject, id) => ({
  [BACK_CREATEPF_API]: {
    types: [
      AT.UPDATE_SUBJECT_FILE_REQUEST,
      AT.UPDATE_SUBJECT_FILE_SUCCESS,
      AT.UPDATE_SUBJECT_FILE_FAILURE,
    ],
    endpoint: `/api/editSubject`,
    settings: {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
      },
      body: JSON.stringify({
        newSubject: subject,
        id: id,
      }),
    },
  },
});

export const getchardata = (time, abortSignal) => ({
  [BACK_RETRIEVAL_API]: {
    types: [
      AT.FETCH_BARCHAT_REQUEST,
      AT.FETCH_BARCHAT_SUCCESS,
      AT.FETCH_BARCHAT_FAILURE,
    ],
    endpoint: `/api/getRating`,
    settings: {
      method: "GET",
      signal: abortSignal,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        time: time,
      },
    },
  },
});

export const getauditsearch = (
  auditType,
  fileNo,
  filterby,
  user,
  role,
  responseDate,
  createdOnDate
) => ({
  [BACK_ANNEXURE_API]: {
    types: [
      AT.FETCH_AUDIT_REQUEST,
      AT.FETCH_AUDIT_SUCCESS,
      AT.FETCH_AUDIT_FAILURE,
    ],
    endpoint: `/api/search`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        auditType: auditType,
        fileNo: fileNo,
        filterBy: filterby,
        user: user,
        role: role,
        responseDate: responseDate,
        createdOnDate: createdOnDate,
      },
    },
  },
});

/********************************Advance Search*********************************/

export const loadAdvanceSearch = (
  val,
  text,
  sendBy,
  createdBy,
  fileNo,
  subject,
  status,
  // CreatedOn,
  // DocumentType,
  apiObj,
  scope,
  roleName,
  pageSize,
  currentPage,
  userName,
  department
) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/advance-searchCabinet?${`Text=${val ? encodeURIComponent(val) : encodeURIComponent(text)}`}&${sendBy && `SendBy=${sendBy}`
      }&${createdBy && `CreatedBy=${encodeURIComponent(createdBy)}`}&${fileNo && `FileNumber=${fileNo}`
      }&${subject && `FileSubject=${subject}`}&${status && `Status=${status}`}&${apiObj?.barCreated && `CreatedOn=${apiObj?.barCreated}`
      }&${apiObj?.barDocumenttype && `DocumentType=${apiObj?.barDocumenttype}`}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        scope,
        roleName,
        pageSize,
        pageNumber: currentPage,
        userName,
        department,
        sessionId: sessionStorage.getItem("sessionId"),
      },
    },
  },
});

export const loadContentData = (value, roleName, department, userName, scope) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/text-CabinetAutoSuggest?${value && `Text=${encodeURIComponent(value)}`}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName,
        userName,
        department,
        scope,
        sessionId: sessionStorage.getItem("sessionId"),
      },
    },
  },
});

export const loadCabinetStatus = (roleName, department, userName, scope) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: "/status-autoSuggestCab",
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName,
        department,
        userName,
        scope,
        sessionId: sessionStorage.getItem("sessionId"),
      },
    },
  },
});

export const loadSendBy = (value, roleName, userName, department, scope) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/sendBy-autoSuggestCab?${value && `SendBy=${value}`}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName,
        userName,
        department,
        scope,
        sessionId: sessionStorage.getItem("sessionId"),
      },
    },
  },
});

export const loadCreatedBy = (value, roleName, userName, department, scope) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/createdBy-autoSuggestCab?${value && `CreatedBy=${encodeURIComponent(value)}`}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName,
        userName,
        department,
        scope,
        sessionId: sessionStorage.getItem("sessionId"),
      },
    },
  },
});

export const laodFileNo = (value, roleName, userName, department, scope) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/pcFileNumber-autoSuggestCAB?${value && `FileNumber=${value}`}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName,
        userName,
        department,
        scope,
        sessionId: sessionStorage.getItem("sessionId"),
      },
    },
  },
});

export const loadCabinetSubject = (value, roleName, userName, department, scope) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/subject-autoSuggestCab?${value && `Subject=${value}`}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName,
        userName,
        department,
        scope,
        sessionId: sessionStorage.getItem("sessionId"),
      },
    },
  },
});

/********************************Advance Search*********************************/

/*-----------------------------Audit Search-----------------------------*/
export const getroledata = () => ({
  [SPLIT_DEPARTMENT_API]: {
    types: [
      AT.GET_DEPARTMENT_ROLE_REQUEST,
      AT.GET_DEPARTMENT_ROLE_SUCCES,
      AT.GET_DEPARTMENT_ROLE_FAILUER,
    ],
    endpoint: `/deptNameList`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName: sessionStorage.getItem("role"),
      },
    },
  },
});

export const getroledatavalues = (data) => ({
  [SPLIT_DEPARTMENT_API]: {
    types: [
      AT.GET_DEPARTMENT_ROLE_REQUEST,
      AT.GET_DEPARTMENT_ROLE_SUCCES,
      AT.GET_DEPARTMENT_ROLE_FAILUER,
    ],
    endpoint: `/deptListRoles`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName: sessionStorage.getItem("role"),
        deptName: data,
      },
    },
  },
});

export const PostSplitdepartmentdta = (departments, data) => ({
  [SPLIT_DEPARTMENT_API]: {
    types: [
      AT.GET_DEPARTMENT_ROLE_REQUEST,
      AT.GET_DEPARTMENT_ROLE_SUCCES,
      AT.GET_DEPARTMENT_ROLE_FAILUER,
    ],
    endpoint: `/deptSplit`,

    settings: {
      method: "post",
      body: JSON.stringify(departments),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName: sessionStorage.getItem("role"),
        department: data,
      },
    },
  },
});

/*-----------------------------Audit Search-----------------------------*/

export const getUniquedata = (time, username, abortSignal) => ({
  [BACK_CREATEPA_API]: {
    types: [
      AT.GET_UNIQUE_USERS_REQUEST,
      AT.GET_UNIQUE_USERS_SUCCES,
      AT.GET_UNIQUE_USERS_FAILUER,
    ],
    endpoint: `/api/uniqueUsers`,
    settings: {
      method: "GET",
      signal: abortSignal,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName: sessionStorage.getItem("role"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: username,
        deptName: sessionStorage.getItem("department"),
        time: time,
      },
    },
  },
});

export const treeSaved = (time, abortSignal) => ({
  [BACK_CREATEPA_API]: {
    types: [
      AT.GET_TREE_SAVED_REQUEST,
      AT.GET_TREE_SAVED_SUCCES,
      AT.GET_TREE_SAVED_FAILUER,
    ],
    endpoint: `/api/treesSaved`,
    settings: {
      method: "POST",
      signal: abortSignal,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        time: time,
      },
    },
  },
});