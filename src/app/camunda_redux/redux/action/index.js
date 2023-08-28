import * as ProcessDefinitionActions from "./camunda-rest/process-definition";
import * as TaskActions from "./camunda-rest/task";
import * as InitiateActions from "./backend-rest/initiate-data";
import * as FormDataAction from "./backend-rest/form-data";
import * as RtiAction from "./backend-rest/rti-data";
import {
  CHANGE_ROUTES_ALL,
  CHANGE_ROUTES_PA,
  CURRENT_SIGN,
  INSTANCE_CHANGE,
  MYINFO_CHANGE,
  SIDENAV_CHANGE,
  THEME_CHANGE,
} from "../constants/ActionTypes";

export const loadTasks = () => (dispatch, getState) => {
  return dispatch(TaskActions.fetchTasks());
};

export const getPersonalInfo = (values, abortSignal) => (dispatch, getState) => {
  return dispatch(FormDataAction.getPersonalInfo(values, abortSignal));
};

export const updatePersonalInfo = (values) => (dispatch, getState) => {
  return dispatch(FormDataAction.updatePersonalInfo(values));
};

export const getPersonalInfoForm = (roleName) => (dispatch, getState) => {
  return dispatch(FormDataAction.getPersonalInfoForm(roleName));
};

export const loadTaskFormKey = (taskId) => (dispatch, getState) => {
  return dispatch(TaskActions.fetchTaskFormKey(taskId));
};

export const completeTask = (taskId, values) => (dispatch, getState) => {
  return dispatch(TaskActions.postCompleTask(taskId, values));
};

/********************************Advance Search*********************************/

export const loadAdvanceSearch =
  (
    val,
    text,
    sendBy,
    createdBy,
    fileNo,
    subject,
    status,
    // CreatedOn,
    // innerChild,
    apiObj,
    scope,
    role,
    pageSize,
    currentPage,
    username,
    department
  ) =>
    (dispatch, getState) => {
      return dispatch(
        InitiateActions.loadAdvanceSearch(
          val,
          text,
          sendBy,
          createdBy,
          fileNo,
          subject,
          status,
          // CreatedOn,
          // innerChild,
          apiObj,
          scope,
          role,
          pageSize,
          currentPage,
          username,
          department
        )
      );
    };

export const loadContentData =
  (value, roleName, department, userName, scope) => (dispatch, getStatus) => {
    return dispatch(
      InitiateActions.loadContentData(value, roleName, department, userName, scope)
    );
  };
export const loadCabinetStatus =
  (roleName, department, userName, scope) => (dispatch, getStatus) => {
    return dispatch(
      InitiateActions.loadCabinetStatus(roleName, department, userName, scope)
    );
  };
export const loadSendBy =
  (value, roleName, userName, department, scope) => (dispatch, getStatus) => {
    return dispatch(
      InitiateActions.loadSendBy(value, roleName, userName, department, scope)
    );
  };
export const loadCreatedBy =
  (value, roleName, userName, department, scope) => (dispatch, getStatus) => {
    return dispatch(
      InitiateActions.loadCreatedBy(value, roleName, userName, department, scope)
    );
  };
export const laodFileNo =
  (value, roleName, userName, department, scope) => (dispatch, getStatus) => {
    return dispatch(
      InitiateActions.laodFileNo(value, roleName, userName, department, scope)
    );
  };
export const loadCabinetSubject =
  (value, roleName, userName, department, scope) => (dispatch, getStatus) => {
    return dispatch(
      InitiateActions.loadCabinetSubject(value, roleName, userName, department, scope)
    );
  };

/********************************Advance Search*********************************/

export const getAdvanceSearch =
  (
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
  ) =>
    (dispatch, getState) => {
      return dispatch(
        InitiateActions.getAdvanceSearch(
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
        )
      );
    };
export const getContentData = (value, rolename, scope) => (dispatch, getstate) => {
  return dispatch(InitiateActions.getContentData(value, rolename, scope));
};
export const getSendData = (value, rolename) => (dispatch, getstate) => {
  return dispatch(InitiateActions.getSendData(value, rolename));
};
export const getFilenumberData = (value, rolename) => (dispatch, getstate) => {
  return dispatch(InitiateActions.getFilenumberData(value, rolename));
};
export const getSubjectData = (value, rolename) => (dispatch, getstate) => {
  return dispatch(InitiateActions.getSubjectData(value, rolename));
};
export const getCreatedData = (value, rolename) => (dispatch, getstate) => {
  return dispatch(InitiateActions.getCreatedData(value, rolename));
};
export const getCabinetStatus = (value, rolename) => (dispatch, getstate) => {
  return dispatch(InitiateActions.getCabinetStatus(value, rolename));
};

export const loadProcessDefinitions =
  (processDefinitionId) => (dispatch, getState) => {
    return dispatch(
      ProcessDefinitionActions.fetchProcessDefinitions(processDefinitionId)
    );
  };

export const loadProcessDefinitionsWithXML =
  (processDefinitionId) => (dispatch, getState) => {
    return dispatch(
      ProcessDefinitionActions.fetchProcessDefinitions(processDefinitionId)
    ).then((data) => {
      data.response.result.forEach((id) => {
        dispatch(ProcessDefinitionActions.fetchProcessDefinitionXML(id));
      });
    });
  };

export const loadProcessDefinitionXML =
  (processDefinitionId) => (dispatch, getState) => {
    return dispatch(
      ProcessDefinitionActions.fetchProcessDefinitionXML(processDefinitionId)
    );
  };

export const loadFormKey = (processDefinitionKey) => (dispatch, getState) => {
  return dispatch(ProcessDefinitionActions.fetchFormKey(processDefinitionKey));
};

export const startProcessInstance =
  (processDefinitionKey, values) => (dispatch, getState) => {
    return dispatch(
      ProcessDefinitionActions.postProcessInstance(processDefinitionKey, values)
    );
  };

export const loadTaskVariables =
  (taskId, variableNames) => (dispatch, getState) => {
    return dispatch(TaskActions.fetchTaskVariables(taskId, variableNames));
  };

export const loadClassificationData = () => (dispatch, getState) => {
  return dispatch(InitiateActions.getClassificationData());
};

export const loadTypesData = () => (dispatch, getState) => {
  return dispatch(InitiateActions.getTypeData());
};
export const loadFileTypesData = (role) => (dispatch, getState) => {
  return dispatch(InitiateActions.getFileTypeData(role));
};

export const loadGroupsData = () => (dispatch, getState) => {
  return dispatch(InitiateActions.getGroupsData());
};

export const loadRolesData = () => (dispatch, getState) => {
  return dispatch(InitiateActions.getRolesData());
};

export const loadDraftData = (role) => (dispatch, getState) => {
  return dispatch(InitiateActions.getDraftData(role));
};

export const loadOutboxData =
  (role, username, pageSize, pageNumber, Date, value, abortSignal) =>
    (dispatch, getState) => {
      return dispatch(
        InitiateActions.getOutboxData(
          role,
          username,
          pageSize,
          pageNumber,
          Date,
          value,
          abortSignal
        )
      );
    };

export const getDataForExport =
  (role, username, ranges) => (dispatch, getState) => {
    return dispatch(InitiateActions.getDataForExport(role, username, ranges));
  };

export const loadOutboxRow = (id) => (dispatch, getState) => {
  return dispatch(InitiateActions.getOutboxRow(id));
};

export const loadInboxData =
  (role, username, department, pageSize, pageNumber, selectedMenuItem, val, abortSignal) =>
    (dispatch, getState) => {
      return dispatch(
        InitiateActions.getInboxData(
          role,
          username,
          department,
          pageSize,
          pageNumber,
          selectedMenuItem,
          val,
          abortSignal
        )
      );
    };

export const loadEnclosureData = (id) => (dispatch, getState) => {
  return dispatch(InitiateActions.getEnclosureData(id));
};

export const loadNotingData = (id) => (dispatch, getState) => {
  return dispatch(InitiateActions.getNotingData(id));
};

export const downloadFile = (url) => (dispatch, getState) => {
  return dispatch(InitiateActions.getFileUrl(url));
};

export const createFormData = (values) => (dispatch, getState) => {
  return dispatch(FormDataAction.setCreateForm(values));
};

export const uploadEnclosure =
  (id, file, config, grp, subject, role) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.uploadEnclosure(id, file, config, grp, subject, role)
    );
  };

export const permanentlyClose = (cabinetId) => (dispatch, getState) => {
  return dispatch(FormDataAction.permanentlyClose(cabinetId));
};

export const getCreateVolume = (cabinetId) => (dispatch, getState) => {
  return dispatch(FormDataAction.getCreateVolume(cabinetId));
};
export const getVolume = (subject) => (dispatch, getState) => {
  return dispatch(FormDataAction.getVolume(subject));
};

export const uploadNoting =
  (id, file, role, username) => (dispatch, getState) => {
    return dispatch(FormDataAction.uploadNoting(id, file, role, username));
  };

export const sendFile = (id, data, role) => (dispatch, getState) => {
  return dispatch(FormDataAction.sendFile(id, data, role));
};

export const loadInstanceVariables = (id) => (dispatch, getState) => {
  return dispatch(ProcessDefinitionActions.postProcessInstanceVariables(id));
};

export const loadSfdt =
  (url, username, id, role, dept) => (dispatch, getState) => {
    return dispatch(InitiateActions.getSfdt(url, username, id, role, dept));
  };

export const getReadStatus = (inboxId, value) => (dispatch) => {
  return dispatch(InitiateActions.getReadStatus(inboxId, value));
};

export const getPinInboxId = (inboxId) => (dispatch) => {
  return dispatch(InitiateActions.getPinInboxId(inboxId));
};

export const getFlagStatus = (inboxId) => (dispatch) => {
  return dispatch(InitiateActions.getFlagStatus(inboxId));
};

export const URLHide = (url) => (dispatch, getState) => {
  return dispatch(InitiateActions.URLHide(url));
};

export const personalFileFormData = (values) => (dispatch, getState) => {
  return dispatch(FormDataAction.createPersonalFileForm(values));
};
export const personalApplicationFormData =
  (values, role, grp) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.createPersonalApplicationForm(values, role, grp)
    );
  };

export const updateSubjectApplicationForm =
  (subject, id) => (dispatch, getState) => {
    return dispatch(FormDataAction.updateSubjectApplicationForm(subject, id));
  };

export const updateSubjectFileForm = (subject, id) => (dispatch, getState) => {
  return dispatch(InitiateActions.updateSubjectFileForm(subject, id));
};

export const loadPFData =
  (username, role, pageSize, pageNumber, value) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.getPF(username, role, pageSize, pageNumber, value)
    );
  };

export const loadPFileData = (username, role) => (dispatch, getState) => {
  return dispatch(InitiateActions.getPFileData(username, role));
};
export const loadPATableData =
  (username, role, pageSize, pageNumber) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.getPATableData(username, role, pageSize, pageNumber)
    );
  };

export const getPADashboardData =
  (username, role, department, pageSize, pageNumber, value, abortSignal) =>
    (dispatch, getState) => {
      return dispatch(
        InitiateActions.getPADashboardData(
          username,
          role,
          department,
          pageSize,
          pageNumber,
          value,
          abortSignal
        )
      );
    };

export const quickSign =
  (
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
  ) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.quickSign(
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
        )
      );
    };

export const sendFiles =
  (id, data, role, username, displayUserName, pfileName, priority) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.sendFiles(
          id,
          data,
          role,
          username,
          displayUserName,
          pfileName,
          priority
        )
      );
    };
export const sendFilesInternal =
  (id, data, role, username, displayUserName, priority) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.sendFilesInternal(
          id,
          data,
          role,
          username,
          displayUserName,
          priority
        )
      );
    };

export const addToFavourite =
  (data, { username, role }, type) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.addToFavourite(data, { username, role }, type)
      );
    };

export const fetchFavouriteList =
  ({ username, role, type }) =>
    (dispatch, getState) => {
      return dispatch(FormDataAction.fetchFavouriteList(username, role, type));
    };

export const deleteFavourite =
  (data, { username, role }, type) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.deleteFavourite(data, { username, role }, type)
      );
    };

export const sendFilesSection =
  (
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
    sendToDep
  ) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.sendFilesSection(
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
          sendToDep
        )
      );
    };

export const sendFilesServiceNumber =
  (
    id,
    data,
    value,
    pfileName,
    body,
    flgNo,
    serviceLetterId,
    isReturn,
    sendToDep
  ) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.sendFilesServiceNumber(
          id,
          data,
          value,
          pfileName,
          body,
          flgNo,
          serviceLetterId,
          isReturn,
          sendToDep
        )
      );
    };

export const sendFilesInternalServiceNumber =
  (id, data, value, pfileName, body, flgNo, sendTo) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.sendFilesInternalServiceNumber(
        id,
        data,
        value,
        pfileName,
        body,
        flgNo,
        sendTo
      )
    );
  };

export const saveDocument =
  (id, formData, role, userName, isPartCase, fileUrl, isAnnexure) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.saveFiles(
          id,
          formData,
          role,
          userName,
          isPartCase,
          fileUrl,
          isAnnexure
        )
      );
    };

export const saveAnnotation =
  (values, id, flag, flagNumber) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.createAnnotation(values, id, flag, flagNumber)
    );
  };

export const saveExternalAnnotation = (values) => (dispatch, getState) => {
  return dispatch(FormDataAction.createExternalAnnotation(values));
};

export const getAnnotation = (id) => (dispatch, getState) => {
  return dispatch(FormDataAction.getAnnotation(id));
};

export const uploadAnnexure =
  (personalAppId, file, role, username, onUploadProgress, subject) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.uploadAnnexure(
          personalAppId,
          file,
          role,
          username,
          onUploadProgress,
          subject
        )
      );
    };

export const uploadPcAnnexure =
  (personalAppId, file, role, username, subject, onUploadProgress) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.uploadPcAnnexure(
          personalAppId,
          file,
          role,
          username,
          subject,
          onUploadProgress
        )
      );
    };

export const getGroupList = (value) => (dispatch, getState) => {
  return dispatch(FormDataAction.getGroupList(value));
};

export const getHrmListData = (value) => (dispatch, getState) => {
  return dispatch(FormDataAction.getHrmFileList(value));
};

export const getServiceLetterList =
  (value, department, username, role, currentPage, pageSize) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.getServiceLetterList(
          value,
          department,
          username,
          role,
          currentPage,
          pageSize
        )
      );
    };

export const getPAWithAnnexureList = (value) => (dispatch, getState) => {
  return dispatch(FormDataAction.getPAWithAnnexureList(value));
};

export const loadAnnexureTableData =
  (username, role, department, id) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.getAnnexureTableData(username, role, department, id)
    );
  };

export const loadUserRoleData = (username) => (dispatch, getState) => {
  return dispatch(InitiateActions.getUserRolesData(username));
};

export const sideNav = (value) => (dispatch, getState) => {
  return dispatch(InitiateActions.sideNav(value));
};

export const getMISTableList = (value) => (dispatch, getState) => {
  return dispatch(InitiateActions.getMISTableData(value));
};

export const getMISDetailTableList = (value) => (dispatch, getState) => {
  return dispatch(InitiateActions.getMISDetailTableData(value));
};

export const deleteAnnexureData = (id) => (dispatch, getState) => {
  return dispatch(InitiateActions.deleteAnnexureData(id));
};

export const createPANotingData =
  (
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
  ) =>
    (dispatch, getState) => {
      return dispatch(
        InitiateActions.createPANotingData(
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
        )
      );
    };

export const addPANotingData =
  (userName, groupName, serviceLetterId, InboxID) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.addPANotingData(
        userName,
        groupName,
        serviceLetterId,
        InboxID
      )
    );
  };

export const createPartCaseServiceLetter =
  (
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
  ) =>
    (dispatch, getState) => {
      return dispatch(
        InitiateActions.createPartCaseServiceLetter(
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
        )
      );
    };

export const getPANotingData = (id) => (dispatch, getState) => {
  return dispatch(InitiateActions.getPANotingData(id));
};

export const getPAEnclosureData =
  (ids, id, role, groupName) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.getPAEnclosureData(ids, id, role, groupName)
    );
  };
export const getbyfilename = (values) => (dispatch, getState) => {
  return dispatch(FormDataAction.getbyfilename(values));
};
export const getSection = (value) => (dispatch, getState) => {
  return dispatch(FormDataAction.getSection(value));
};
export const getServiceNumber = (value) => (dispatch, getState) => {
  return dispatch(FormDataAction.getServiceNumber(value));
};
export const getInternalServiceNumber =
  (value, groupName) => (dispatch, getState) => {
    return dispatch(FormDataAction.getInternalServiceNumber(value, groupName));
  };
export const loadPADraftTableData =
  (username, role, dept, pageSize, pageNumber, val, abortSignal) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.getPADraftTableData(
        username,
        role,
        dept,
        pageSize,
        pageNumber,
        val,
        abortSignal
      )
    );
  };

export const loadPartCaseData =
  (data, department, roleName, username, isBm) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.getPartCaseData(data, department, roleName, username, isBm)
    );
  };

export const loadInboxDataSplitView =
  (id, username, isBm) => (dispatch, getState) => {
    return dispatch(FormDataAction.getSplitViewInboxData(id, username, isBm));
  };
export const getPersonalApplicationFileData =
  (pFileName, pageSize, pageNumber) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.getPersonalApplicationFileData(
        pFileName,
        pageSize,
        pageNumber
      )
    );
  };
export const savePartCaseTag = (partcaseID, data) => (dispatch, getState) => {
  return dispatch(FormDataAction.savePartCaseTag(partcaseID, data));
};
export const fetchSplitViewTags =
  (partcaseID, dept, isBm) => (dispatch, getState) => {
    return dispatch(InitiateActions.fetchSplitViewTags(partcaseID, dept, isBm));
  };
export const createPartCaseNotingFile =
  (partcaseID, groupName) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.createPartCaseNotingFile(partcaseID, groupName)
    );
  };
export const createCoverLetter =
  (partcaseID, groupName, subject, value, username, department) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.createCoverLetter(
          partcaseID,
          groupName,
          subject,
          value,
          username,
          department
        )
      );
    };

export const PCFileClosuer =
  (inboxID, status, pfileName) => (dispatch, getState) => {
    return dispatch(FormDataAction.PCFileClosuer(inboxID, status, pfileName));
  };
export const getHistory = (type, id) => (dispatch, getState) => {
  return dispatch(FormDataAction.getHistory(type, id));
};
export const changeTheme = (value) => (dispatch) => {
  return dispatch({ type: THEME_CHANGE, payload: value });
};
export const currentSign = (value) => (dispatch) => {
  return dispatch({ type: CURRENT_SIGN, payload: value });
};

export const createInstance = (value) => (dispatch) => {
  return dispatch({ type: INSTANCE_CHANGE, payload: value });
};
export const sidenavChange = (value) => (dispatch) => {
  return dispatch({ type: SIDENAV_CHANGE, payload: value });
};

export const myInfo = (value) => (dispatch) => {
  return dispatch({ type: MYINFO_CHANGE, payload: value });
};

export const rollbackPADocument = (id) => (dispatch, getState) => {
  return dispatch(FormDataAction.rollbackPADocument(id));
};
export const rollbackSplitViewDocument =
  (id, flagNumber, fileId) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.rollbackSplitViewDocument(id, flagNumber, fileId)
    );
  };

export const rollbackSplitViewEnclosureDocument =
  (id, flagNumber, fileId) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.rollbackSplitViewEnclosureDocument(id, flagNumber, fileId)
    );
  };

export const deleteEnclosure =
  (rolename, pcId, flagnumber, fileId) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.deleteEnclosure(rolename, pcId, flagnumber, fileId)
    );
  };

export const editFlagNumber =
  (pcId, newFlagNumber, oldFlagNumber, roleName, fileId, subject) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.editFlagNumber(
          pcId,
          newFlagNumber,
          oldFlagNumber,
          roleName,
          fileId,
          subject
        )
      );
    };

export const editEncoSubject =
  (pcId, fileId, subject) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.editEncoSubject(
          pcId, fileId, subject
        )
      );
    };

export const validateFlagNumber =
  (pcId, flagNumber) => (dispatch, getState) => {
    return dispatch(FormDataAction.validateFlagNumber(pcId, flagNumber));
  };

export const getCabinaetData =
  (roleName, department, username, val, pageSize, currentPage, abortSignal) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.getCabinaetData(
          roleName,
          department,
          username,
          val,
          pageSize,
          currentPage,
          abortSignal
        )
      );
    };

export const rollbackAnnexureDocument = (id, value) => (dispatch, getState) => {
  return dispatch(InitiateActions.rollbackAnnexureDocument(id, value));
};

export const updateAnnexureData = (id, newFileName) => (dispatch, getState) => {
  return dispatch(InitiateActions.updateAnnexureData(id, newFileName));
};
export const MoveToBM = (fileId, docId, isBm) => (dispatch) => {
  return dispatch(InitiateActions.MoveToBm(fileId, docId, isBm));
};
export const getSectionData = (department) => (dispatch) => {
  return dispatch(InitiateActions.getSectionData(department));
};

export const MoveToCC = (fileId, docId, isBm) => (dispatch) => {
  return dispatch(InitiateActions.MoveToCC(fileId, docId, isBm));
};

export const getNotification = (role, username) => (dispatch, getState) => {
  return dispatch(InitiateActions.getNotification(role, username));
};

export const notificationStatus = (role, username) => (dispatch, getState) => {
  return dispatch(InitiateActions.notificationStatus(role, username));
};

export const deleteNotification = (role, id) => (dispatch, getState) => {
  return dispatch(InitiateActions.deleteNotification(role, id));
};

export const deleteAllNotification =
  (role, username) => (dispatch, getState) => {
    return dispatch(InitiateActions.deleteAllNotification(role, username));
  };

export const returnPA = (id, group) => (dispatch, getState) => {
  return dispatch(FormDataAction.returnPA(id, group));
};

// ADMIN ACTION CREATORS
export const getADasboardCount = (date) => (dispatch, getState) => {
  return dispatch(InitiateActions.getADasboardCount(date));
};

export const getADUsers = (userId) => (dispatch, getState) => {
  return dispatch(InitiateActions.getADUsers(userId));
};

export const getADRoles = (deptName) => (dispatch, getState) => {
  return dispatch(InitiateActions.getADRoles(deptName));
};

export const getADDepartmens = () => (dispatch, getState) => {
  return dispatch(InitiateActions.getADDepartmens());
};
export const loadRtiPartCaseData = (data) => (dispatch, getState) => {
  return dispatch(RtiAction.getRtiPartCaseData(data));
};

export const loadRtiDataSplitView = (id) => (dispatch, getState) => {
  return dispatch(RtiAction.getSplitViewRtiData(id));
};

export const rollbackRtiSplitViewDocument =
  (id, flagNumber) => (dispatch, getState) => {
    return dispatch(RtiAction.rollbackRtiSplitViewDocument(id, flagNumber));
  };

export const rollbackRtiSplitViewEnclosureDocument =
  (id, flagNumber) => (dispatch, getState) => {
    return dispatch(
      RtiAction.rollbackRtiSplitViewEnclosureDocument(id, flagNumber)
    );
  };

export const addRTI = (value, role, deptName) => (dispatch, getState) => {
  return dispatch(RtiAction.addRti(value, role, deptName));
};

export const forwardToDepts = (id, data) => (dispatch, getState) => {
  return dispatch(RtiAction.forwardToDepts(id, data));
};

export const getPartcaseEnclosures = (id) => (dispatch, getState) => {
  return dispatch(RtiAction.getPartcaseEnclosures(id));
};

export const getPartcaseNoting = (id) => (dispatch, getState) => {
  return dispatch(RtiAction.getPartcaseNoting(id));
};

export const getRtiDepartment = () => (dispatch, getState) => {
  return dispatch(RtiAction.getRtiDepartment());
};

export const loadRtiList = (status) => (dispatch, getState) => {
  return dispatch(RtiAction.getRtiList(status));
};

export const uploadRti =
  (id, file, onUploadProgress, deptName) => (dispatch, getState) => {
    return dispatch(RtiAction.uploadRti(id, file, onUploadProgress, deptName));
  };

export const saveRtiFile =
  (id, file, onUploadProgress, deptName) => (dispatch, getState) => {
    return dispatch(
      RtiAction.saveRtiFile(id, file, onUploadProgress, deptName)
    );
  };

export const saveDoc =
  (id, formData, role, userName, isPartCase, fileUrl, isAnnexure) =>
    (dispatch, getState) => {
      return dispatch(
        RtiAction.saveFiles(
          id,
          formData,
          role,
          userName,
          isPartCase,
          fileUrl,
          isAnnexure
        )
      );
    };

export const rtisendFiles =
  (id, data, role, username, displayUserName, pfileName) =>
    (dispatch, getState) => {
      return dispatch(
        RtiAction.rtisendFiles(
          id,
          data,
          role,
          username,
          displayUserName,
          pfileName
        )
      );
    };

export const RtisendFilesInternalServiceNumber =
  (id, data, value, pfileName, body) => (dispatch, getState) => {
    return dispatch(
      RtiAction.RtisendFilesInternalServiceNumber(
        id,
        data,
        value,
        pfileName,
        body
      )
    );
  };

export const RtisendFilesSection =
  (id, data, value, pfileName, body, isReturn) => (dispatch, getState) => {
    return dispatch(
      RtiAction.RtisendFilesSection(id, data, value, pfileName, body, isReturn)
    );
  };

export const returnRti = (id, deptName, username) => (dispatch, getState) => {
  return dispatch(RtiAction.returnRti(id, deptName, username));
};

export const loadRtiRegister = () => (dispatch, getState) => {
  return dispatch(RtiAction.getRtiRegister());
};

// export const RTIURLHide = (url) => (dispatch, getState) => {
//     return dispatch(RtiAction.RTIURLHide(url))
// };

export const sendbackRti = (id, username) => (dispatch, getState) => {
  return dispatch(RtiAction.sendbackRti(id, username));
};

export const getStatus = (type, id) => (dispatch, getState) => {
  return dispatch(RtiAction.getStatus(type, id));
};

export const getDraftStatus = (type, id) => (dispatch, getState) => {
  return dispatch(RtiAction.getDraftStatus(type, id));
};

export const loadFinalreg = () => (dispatch, getState) => {
  return dispatch(RtiAction.getFinalRegister());
};

export const DeleteDraft = (id) => (dispatch, getState) => {
  return dispatch(RtiAction.DeleteDraft(id));
};

export const getFilterStatus = (id, status) => (dispatch, getState) => {
  return dispatch(RtiAction.getFilterStatus(id, status));
};

export const FindByAppeal = (appealNumber) => (dispatch, getState) => {
  return dispatch(RtiAction.FindByAppeal(appealNumber));
};

export const getSearchedData = (search) => (dispatch, getState) => {
  return dispatch(RtiAction.getSearchedData(search));
};

export const getAutoDetails = (appeal) => (dispatch, getState) => {
  return dispatch(RtiAction.getAutoDetails(appeal));
};

export const getdownloadZip = (id) => (dispatch, getState) => {
  return dispatch(RtiAction.getdownloadZip(id));
};

export const deleteEnclosureRti =
  (rolename, pcId, fileName, flagnumber) => (dispatch, getState) => {
    return dispatch(
      RtiAction.deleteEnclosureRti(rolename, pcId, fileName, flagnumber)
    );
  };

export const fetchSplitViewTagsRti =
  (partcaseID, dept) => (dispatch, getState) => {
    return dispatch(RtiAction.fetchSplitViewTagsRti(partcaseID, dept));
  };

export const savePartCaseTagRti =
  (partcaseID, data) => (dispatch, getState) => {
    return dispatch(RtiAction.savePartCaseTagRti(partcaseID, data));
  };

export const PCFileClosuerRti =
  (inboxID, status, pfileName) => (dispatch, getState) => {
    return dispatch(RtiAction.PCFileClosuerRti(inboxID, status, pfileName));
  };

export const sendAuditdata =
  (username, actions, status) => (dispatch, getState) => {
    return dispatch(FormDataAction.sendAuditdata(username, actions, status));
  };

export const getchardata = (time, abortSignal) => (dispatch, getState) => {
  return dispatch(InitiateActions.getchardata(time, abortSignal));
};

export const getauditsearch =
  (auditType, fileNo, filterby, user, role, responseDate, createdOnDate) =>
    (dispatch, getState) => {
      return dispatch(
        InitiateActions.getauditsearch(
          auditType,
          fileNo,
          filterby,
          user,
          role,
          responseDate,
          createdOnDate
        )
      );
    };
export const editRtiFlagNumber =
  (pcId, newFlagNumber, oldFlagNumber, roleName, flagNumberMarking) =>
    (dispatch, getState) => {
      return dispatch(
        RtiAction.editRtiFlagNumber(
          pcId,
          newFlagNumber,
          oldFlagNumber,
          roleName,
          flagNumberMarking
        )
      );
    };

export const fetchAddress = (state, district) => (dispatch, getState) => {
  return dispatch(RtiAction.fetchAddress(state, district));
};

// YELLOW NOTES AND REMAKRS SPLITVIEW
export const loadYlwNotesDataSplitview =
  (pcID, pageNumber, pageSize) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.getYlowNotesDataSplitview(pcID, pageNumber, pageSize)
    );
  };

export const loadRemarksDataSplitview =
  (pcID, pageNumber, pageSize, department) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.getRemarksDataSplitview(
        pcID,
        pageNumber,
        pageSize,
        department
      )
    );
  };

export const addYlowNote =
  (comment, color, fileId, user, roles) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.addYlowNoteSplitview({
        comment,
        color,
        fileId,
        user,
        roles,
      })
    );
  };

export const deleteYlowNote = (id, roleName) => (dispatch, getState) => {
  return dispatch(FormDataAction.deleteYlowNoteSplitview(id, roleName));
};

export const closeFileTemporary = (val) => (dispatch, getState) => {
  return dispatch(FormDataAction.temporaryCloseFileSplitView(val));
};

export const getexternalcabinet =
  (department, pageSize, pageNumber) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.getexternalcabinet(department, pageSize, pageNumber)
    );
  };
export const getcabinetpartcase =
  (department, cabinetpartcase, isBm) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.getcabinetpartcase(department, cabinetpartcase, isBm)
    );
  };
export const openFile =
  (department, cabinetpartcase) => (dispatch, getState) => {
    return dispatch(FormDataAction.openFile(department, cabinetpartcase));
  };

/*--------------------------------Audit Search----------------------------------- */
export const getroledata = () => (dispatch, getState) => {
  return dispatch(InitiateActions.getroledata());
};

export const getroledatavalues = (data) => (dispatch, getState) => {
  return dispatch(InitiateActions.getroledatavalues(data));
};
export const PostSplitdepartmentdta = (values) => (dispatch, getState) => {
  const data = values.department.slice(0, values.department.indexOf(" |"));
  const { departments } = values;
  return dispatch(InitiateActions.PostSplitdepartmentdta(departments, data));
};
/*--------------------------------Audit Search----------------------------------- */

/*--------------------------------File Module----------------------------------- */
export const createFile = (value) => (dispatch, getState) => {
  return dispatch(FormDataAction.createFile(value));
};
export const getSubSection = () => (dispatch, getState) => {
  return dispatch(FormDataAction.getSubSection());
};
export const getBlock = () => (dispatch, getState) => {
  return dispatch(FormDataAction.getBlock());
};
export const getCustodian = (value) => (dispatch, getState) => {
  return dispatch(FormDataAction.getCustodian(value));
};
export const uploadNotingFile =
  (id, file, subject, config) => (dispatch, getState) => {
    return dispatch(FormDataAction.uploadNotingFile(id, file, subject, config));
  };

/*--------------------------------File Module----------------------------------- */

/*-------------------------------Correspondence----------------------------------- */
export const getAllCorespondence =
  (pageSize, pageNumber) => (dispatch, getState) => {
    return dispatch(FormDataAction.getAllCorespondence(pageSize, pageNumber));
  };

export const addCorrespondence =
  (subject, type, classification, nofID, nofFileName, priority) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.addCorrespondence(
          subject,
          type,
          classification,
          nofID,
          nofFileName,
          priority
        )
      );
    };

export const getCorespondence = (id) => (dispatch, getState) => {
  return dispatch(FormDataAction.getCorespondence(id));
};

export const getCorrAnnexureTableData = (docId) => (dispatch, getState) => {
  return dispatch(FormDataAction.getCorrAnnexureTableData(docId));
};

export const getCorrReferenceTableData = (docId) => (dispatch, getState) => {
  return dispatch(FormDataAction.getCorrReferenceTableData(docId));
};

export const rollbackCorrDocument = (body) => (dispatch, getState) => {
  return dispatch(FormDataAction.rollbackCorrDocument(body));
};

export const uploadCorrespondenceAnnexure =
  (id, file, subject) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.uploadCorrespondenceAnnexure(id, file, subject)
    );
  };

export const uploadCorrespondenceReference =
  (id, file, subject) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.uploadCorrespondenceReference(id, file, subject)
    );
  };

export const sendInternalCorespondence =
  (id, data, value, pfileName, body) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.sendInternalCorespondence(id, data, value, pfileName, body)
    );
  };

export const sendEyesonlyCorespondence =
  (id, data, data1, data2, value, pfileName, body) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.sendEyesonlyCorespondence(
        id,
        data,
        data1,
        data2,
        value,
        pfileName,
        body
      )
    );
  };
export const sendExternalCorespondence =
  (id, data, data1, data2, body) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.sendExternalCorespondence(id, data, data1, data2, body)
    );
  };

// To change Routes
export const changeRoutes = (type) => (dispatch, getState) => {
  if (type === "PA") {
    return dispatch({ type: CHANGE_ROUTES_PA });
  } else if (type === "ALL") {
    return dispatch({ type: CHANGE_ROUTES_ALL });
  }
};

export const getUniquedata = (time, username, abortSignal) => (dispatch, getState) => {
  return dispatch(InitiateActions.getUniquedata(time, username, abortSignal));
};

export const treeSaved = (time, abortSignal) => (dispatch, getState) => {
  return dispatch(InitiateActions.treeSaved(time, abortSignal));
};
