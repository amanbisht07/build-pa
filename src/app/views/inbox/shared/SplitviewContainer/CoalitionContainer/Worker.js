import Cookies from "js-cookie";
import React from "react";
import {
  getPANotingData,
  getPAEnclosureData,
  loadPartCaseData,
  loadInboxDataSplitView,
  savePartCaseTag,
  fetchSplitViewTags,
  createPartCaseNotingFile,
  createCoverLetter,
  rollbackSplitViewDocument,
  rollbackSplitViewEnclosureDocument,
  deleteEnclosure,
  editFlagNumber,
  validateFlagNumber,
  loadRtiPartCaseData,
  rollbackRtiSplitViewDocument,
  rollbackRtiSplitViewEnclosureDocument,
  saveRtiFile,
  loadRtiDataSplitView,
  returnRti,
  sendbackRti,
  getdownloadZip,
  deleteEnclosureRti,
  fetchSplitViewTagsRti,
  savePartCaseTagRti,
  editRtiFlagNumber,
  getcabinetpartcase,
  openFile,
  loadYlwNotesDataSplitview,
  deleteYlowNote,
} from "../../../../../camunda_redux/redux/action";
import { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { useEffect } from "react";
import { SplitViewContext } from "../Worker";
import { useContext } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { setPassData } from "app/camunda_redux/redux/ducks/passData";

export const CoalitionContext = React.createContext();

const CoalitionProvider = (props) => {
  let partCase = Cookies.get("partCase");
  let isRti = Cookies.get("isRti");
  const isCabinet = Cookies.get("isCabinet");
  const department = sessionStorage.getItem("department");
  const roleName = sessionStorage.getItem("role");
  const username = localStorage.getItem("username");

  const value = CoalitionGetterAndSetter();
  const { setLoading, alignment, tabIndex } = useContext(SplitViewContext);
  let isBm = tabIndex;

  const dispatch = useDispatch();

  const callMessageOut = (message) => {
    setLoading(false);
    return dispatch(setSnackbar(true, "error", message));
  };

  useEffect(() => {
    setLoading(true);
    if (isRti === "true") {
      loadRtiData();
    } else {
      loadSplitViewData();
    }
  }, []);

  useEffect(() => {
    let temArr = [];
    if (value.enclosureData.length !== 0) {
      value.enclosureData.map((item, i) => {
        temArr.push({
          ...item,
          serialNo: i,
          subject: item.subject ? item.subject : item.fileName,
        });
      });
      value.setEnclosureSigned(value.enclosureData[0].signed);
    }

    value.setEnclosureArr(temArr);
    if (temArr.length !== 0) {
      value.setURL(temArr[0].fileUrl);
      value.setNOF1(temArr[0]);
      // setFlagNumber(temArr[0].flagNumber);
      value.setPrevFlagNumberEnclouser(temArr[0].flagNumber);
      value.setRtifilename(temArr[0].fileName);
      value.setPrevEnclouser(temArr[0].fileUrl);
    }
  }, [value.enclosureData]);

  useEffect(() => {
    if (value.enclosurePdfLoads === true && value.URL !== undefined) {
      let data = { extension: value.extension, url: value.URL };
      dispatch(setPassData(data));
    }
  }, [value.enclosurePdfLoads, value.URL, value.enclosureSigned]);

  useEffect(() => {
    if (!value.blnHideSyncfusion && value.openInPdf) {
      value.setpdfLoads(false);
    }
  }, [value.blnHideSyncfusion, value.openInPdf]);

  useEffect(() => {
    if (value.enclosurePdfLoads === true && value.URL !== undefined) {
      let data = { extension: value.extension, url: value.URL };
      dispatch(setPassData(data));
    }
  }, [alignment]);

  const handleIsEdit = (status, x) => {
    if (isRti === true) {
      if (x === 0 && status === "Internal") {
        return true;
      } else {
        return false;
      }
    } else {
      if (status === "Internal" && x === 0) {
        return true;
      } else {
        return false;
      }
    }
  };

  const loadSplitViewData = () => {
    Cookies.set("HrmRole", null);
    let cabinetpartcase = Cookies.get("cabinetpartcase");
    const inboxId = sessionStorage.getItem("InboxID");

    // here if come inside this if() , it means from cabinet i come to splitview and as in cabinet row data i have partcase id present as well so it can be used to fetch the latest yellow note and remarks as well
    if (partCase === "true" && isCabinet) {
      loadPartCaseIdData(inboxId);
      value.setPartCaseId(cabinetpartcase);
    } else {
      props.loadInboxDataSplitView(inboxId, username, false).then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          }
          if (resp.Data.partCaseId) {
            loadPartCaseIdData(resp.Data.partCaseId);
            value.setPartCaseId(resp.Data.partCaseId);
          }
        } catch (error) {
          // callMessageOut(error.message);
        }
      });
    }
  };

  const loadPartCaseIdData = (val) => {
    let cabinetpartcase = Cookies.get("cabinetpartcase");
    sessionStorage.setItem("partcaseID", val);
    let formData = new FormData();
    formData.append("id", val);
    if (partCase === "true") {
      props
        .getcabinetpartcase(department, cabinetpartcase, false)
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              return;
            } else {
              loadData(resp);
            }
          } catch (e) {
            // callMessageOut(e.message);
          }
        });
    } else {
      props
        .loadPartCaseData(formData, department, roleName, username, false)
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              return;
            } else {
              loadData(resp.data);
            }
          } catch (e) {
            // callMessageOut(e.message);
          }
        });
    }
  };

  const loadRtiData = () => {
    Cookies.set("HrmRole", null);
    setLoading(true);
    const rtiID = sessionStorage.getItem("rtiID");
    const partcase = Cookies.get("partcaseId");
    if (partcase) {
      loadRtiPartCaseIdData(partcase);
    } else {
      props.loadRtiDataSplitView(partcase).then((resp) => {
        if (resp.Data.partcaseId) {
          loadRtiPartCaseIdData(resp.Data.partcaseId);
        }
      });
    }
  };

  const loadRtiPartCaseIdData = (val) => {
    value.setPartCaseId(val);
    sessionStorage.setItem("partcaseID", val);
    let formData = new FormData();
    formData.append("id", val);
    props.loadRtiPartCaseData(formData).then((resp) => {
      try {
        loadData(resp.data);
      } catch (e) {
        callMessageOut(e.message);
      }
    });
  };

  const loadData = (resp) => {
    value.setDocId(resp.objId);
    value.setEnclosureLen(resp.enclosureList.length);
    let NotingUrl;
    let CLetter = value.coverLetter;
    let enclouserTmpArr = [];
    let flagNoTmpArr = [];
    if (!value.coverLetter) {
      resp.enclosureList.map((item) => {
        if (item.coverNote === true) CLetter = true;
      });
    }
    for (let x = 0; x < resp.enclosureList.length; x++) {
      if (resp.enclosureList[x].coverNote === true) {
        enclouserTmpArr.unshift({
          ...resp.enclosureList[x],
        });
        flagNoTmpArr.unshift(resp.enclosureList[x].flagNumber);
      } else {
        enclouserTmpArr.push({
          ...resp.enclosureList[x],
        });
        flagNoTmpArr.push(resp.enclosureList[x].flagNumber);
      }
    }

    let notngTmpArr = [];
    resp.notingList.reverse().map((item, x) =>
      notngTmpArr.push({
        ...item,
        serialNo: x,
        isEditable: handleIsEdit(item.status, x),
        blnDisable: x === 0 ? false : true,
      })
    );

    if (notngTmpArr?.length > 0) {
      if (!notngTmpArr[0].signed && notngTmpArr[0].prevVersionId) {
        NotingUrl = `${notngTmpArr[0].fileUrl}?versionId=${notngTmpArr[0].prevVersionId}`;
      } else {
        NotingUrl = notngTmpArr[0].fileUrl;
      }
    }

    setLoading(false);

    unstable_batchedUpdates(() => {
      if (notngTmpArr?.length > 0) {
        value.setNotingStatustatus(notngTmpArr[0]?.status);
        value.setNotingData(notngTmpArr);
        value.setNofAnnoId(notngTmpArr[0]?.annotationId);
        value.setNotingSigned(notngTmpArr[0]?.signed);
        value.setPrevFlagNumberNF(notngTmpArr[0]?.flagNumber);
        value.setNotingURL(NotingUrl);
        value.setNOF(JSON.stringify(notngTmpArr[0]));
        value.setBlnHideSyncfusion(notngTmpArr[0]?.signed);
        value.setOpenInPdf(notngTmpArr[0]?.isEditable);
        value.setBlnDisable(notngTmpArr[0]?.blnDisable);
      }
      value.setCoverLetter(CLetter);
      value.setStatus(resp.status);
      value.setHrmRole(resp.hrmRole);
      value.setHrmDepartmet(resp.department);
      value.setHasCoverNote(resp.hasCoverNote);
      value.setServiceLetterId(resp.serviceLetterId);
      value.setDepartmentList(resp.deptList);

      value.setEnclosureData(enclouserTmpArr);
      value.setEnclosureAnnoiD(enclouserTmpArr[0]?.annotationId);
      value.setFlagNoArr(flagNoTmpArr);
      value.setRowID(resp.id);

      value.setBlnVisible(true);
      value.setBlnDisableForward(!resp.enableAddNoting);
      value.setcanClose(department === resp.department);
    });
    if (partCase !== "true") {
      isRti === "true" ? loadEnclouserTagsRti() : loadEnclouserTags();
    }
  };

  const loadEnclouserTags = () => {
    const dept = sessionStorage.getItem("department");
    const PartCaseID = sessionStorage.getItem("partcaseID");
    props.fetchSplitViewTags(PartCaseID, dept, false).then((resp) => {
      try {
        if (resp.error) {
          // callMessageOut(resp.error);
          return;
        }
        if (resp) {
          if (resp.Data != null && resp.Data != [] && resp.Data != "") {
            value.setPdfViewerButtons(resp.Data);
          }
        }
      } catch (error) {
        // callMessageOut(error.message);
      }
    });
  };

  const loadEnclouserTagsRti = () => {
    const dept = sessionStorage.getItem("department");
    const PartCaseID = sessionStorage.getItem("partcaseID");
    props.fetchSplitViewTagsRti(PartCaseID, dept).then((resp) => {
      try {
        if (resp.error) {
          // callMessageOut(resp.error);
          return;
        }
        if (resp) {
          if (resp.Data != null && resp.Data != [] && resp.Data != "") {
            value.setPdfViewerButtons(resp.Data);
          }
        }
      } catch (error) {
        // callMessageOut(error.message);
      }
    });
  };

  const handleCount = (name, val) => {
    if (name === "ylowNote") {
      value.setcount1(val);
    } else {
      value.setcount2(val);
    }
  };

  return (
    <CoalitionContext.Provider
      value={{
        ...value,
        loadSplitViewData,
        handleCount,
        loadRtiData,
      }}
    >
      {props.children}
    </CoalitionContext.Provider>
  );
};

const CoalitionGetterAndSetter = () => {
  let forwardRti = Cookies.get("isForward");
  const [NOF, setNOF] = useState("");
  const [NOF1, setNOF1] = useState("");
  const [sfdtData, setSfdtData] = useState("");
  const [prevEnclouser, setPrevEnclouser] = useState("");
  const [blnVisible, setBlnVisible] = useState(false);
  const [rowID, setRowID] = useState("");
  const [enclosureData, setEnclosureData] = useState([]);
  const [enclosureArr, setEnclosureArr] = useState([]);
  const [open, setOpen] = useState(false);
  const [URL, setURL] = useState("");
  const [pdfLoads, setpdfLoads] = useState(false);
  const [enclosurePdfLoads, setEnclosurePdfLoads] = useState(false);
  const [blnHideSyncfusion, setBlnHideSyncfusion] = useState(false);
  const [openInPdf, setOpenInPdf] = useState(false);
  const [blnDisable, setBlnDisable] = useState(false);
  const [fileChange, setFileChange] = useState(false);
  const [notingURL, setNotingURL] = useState("");
  const [flag, setFlag] = useState("Noting");
  const [partCaseId, setPartCaseId] = useState("");
  const [flagNumber, setFlagNumber] = useState(0);
  const [prevFlagNumberNF, setPrevFlagNumberNF] = useState(0);
  const [prevFlagNumberEnclouser, setPrevFlagNumberEnclouser] = useState(0);
  const [hrmRole, setHrmRole] = useState("");
  const [hrmDepartmet, setHrmDepartmet] = useState("");
  const [coverLetter, setCoverLetter] = useState(false);
  const [coverLetterDialog, setCoverLetterDialog] = useState(false);
  const [extension, setExtension] = useState("docx");
  const [hasCoverNote, setHasCoverNote] = useState(false);
  const [enclosureSigned, setEnclosureSigned] = useState(false);
  const [notingSigned, setNotingSigned] = useState(false);
  const [blnDisableForward, setBlnDisableForward] = useState(false);
  const [notingData, setNotingData] = useState([]);
  const [send, setSend] = useState(false);
  const [serviceLetterId, setServiceLetterId] = useState("");
  const [departmentList, setDepartmentList] = useState([]);
  const [status, setStatus] = useState("");
  const [notingStatus, setNotingStatustatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [isPdf, setIsPdf] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [touched, setTouched] = React.useState(false);
  const [value, setValue] = useState("");
  const [FlagNoArr, setFlagNoArr] = useState([]);
  const [isValid, setisValid] = useState(false);
  const [enclosureAnnoiD, setEnclosureAnnoiD] = useState("");
  const [enclosurelen, setEnclosureLen] = useState("");
  const [isrtiforward, setIsRtiForward] = useState(forwardRti === "false");
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [nofAnnoId, setNofAnnoId] = useState("");
  const [rtifilename, setRtifilename] = useState("");
  const [addNote, setaddNote] = useState(false);
  const [openRemarks, setopenRemarks] = useState(false);
  const [openYellowNotes, setopenYellowNotes] = useState(false);
  const [count1, setcount1] = useState(0);
  const [count2, setcount2] = useState(0);
  const [ylwNotes, setylwNotes] = useState([]);
  const [closeFile, setcloseFile] = useState(false);
  const [canClose, setcanClose] = useState(false);
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [cahtGpt, setChatGpt] = useState(false);
  const [fileId, setFileId] = useState("");
  const [docId, setDocId] = useState([]);

  const [pdfViewerButtons, setPdfViewerButtons] = useState([
    {
      btnName: "A",
      btnId: 0,
      backgroundColor: "grey",
      fileurl: "",
      pageNumber: 1,
    },
    {
      btnName: "B",
      btnId: 1,
      backgroundColor: "grey",
      fileurl: "",
      pageNumber: 1,
    },
    {
      btnName: "C",
      btnId: 2,
      backgroundColor: "grey",
      fileurl: "",
      pageNumber: 1,
    },
    {
      btnName: "D",
      btnId: 3,
      backgroundColor: "grey",
      fileurl: "",
      pageNumber: 1,
    },
    {
      btnName: "E",
      btnId: 4,
      backgroundColor: "grey",
      fileurl: "",
      pageNumber: 1,
    },
  ]);

  return {
    NOF,
    setNOF,
    NOF1,
    setNOF1,
    sfdtData,
    setSfdtData,
    prevEnclouser,
    setPrevEnclouser,
    blnVisible,
    setBlnVisible,
    rowID,
    setRowID,
    enclosureData,
    setEnclosureData,
    enclosureArr,
    setEnclosureArr,
    open,
    setOpen,
    URL,
    setURL,
    pdfLoads,
    setpdfLoads,
    enclosurePdfLoads,
    setEnclosurePdfLoads,
    blnHideSyncfusion,
    setBlnHideSyncfusion,
    openInPdf,
    setOpenInPdf,
    blnDisable,
    setBlnDisable,
    fileChange,
    setFileChange,
    notingURL,
    setNotingURL,
    flag,
    setFlag,
    partCaseId,
    setPartCaseId,
    flagNumber,
    setFlagNumber,
    prevFlagNumberNF,
    setPrevFlagNumberNF,
    prevFlagNumberEnclouser,
    setPrevFlagNumberEnclouser,
    hrmRole,
    setHrmRole,
    hrmDepartmet,
    setHrmDepartmet,
    coverLetter,
    setCoverLetter,
    coverLetterDialog,
    setCoverLetterDialog,
    extension,
    setExtension,
    hasCoverNote,
    setHasCoverNote,
    enclosureSigned,
    setEnclosureSigned,
    notingSigned,
    setNotingSigned,
    blnDisableForward,
    setBlnDisableForward,
    notingData,
    setNotingData,
    send,
    setSend,
    serviceLetterId,
    setServiceLetterId,
    departmentList,
    setDepartmentList,
    status,
    setStatus,
    notingStatus,
    setNotingStatustatus,
    page,
    setPage,
    pageNumber,
    setPageNumber,
    isPdf,
    setIsPdf,
    openDialog,
    setOpenDialog,
    touched,
    setTouched,
    value,
    setValue,
    FlagNoArr,
    setFlagNoArr,
    isValid,
    setisValid,
    enclosureAnnoiD,
    setEnclosureAnnoiD,
    enclosurelen,
    setEnclosureLen,
    isrtiforward,
    setIsRtiForward,
    openConfirmation,
    setOpenConfirmation,
    nofAnnoId,
    setNofAnnoId,
    rtifilename,
    setRtifilename,
    addNote,
    setaddNote,
    openRemarks,
    setopenRemarks,
    openYellowNotes,
    setopenYellowNotes,
    count1,
    setcount1,
    count2,
    setcount2,
    ylwNotes,
    setylwNotes,
    closeFile,
    setcloseFile,
    canClose,
    setcanClose,
    openSpeedDial,
    setOpenSpeedDial,
    pdfViewerButtons,
    setPdfViewerButtons,
    cahtGpt,
    setChatGpt,
    fileId,
    setFileId,
    docId,
    setDocId,
  };
};

const mapStateToProps = (state) => {
  return {
    props: state.props,
    inboxer: state.inboxer,
    theme: state.theme,
  };
};

export default connect(mapStateToProps, {
  loadInboxDataSplitView,
  getcabinetpartcase,
  loadPartCaseData,
  loadRtiDataSplitView,
  loadRtiPartCaseData,
  fetchSplitViewTags,
  fetchSplitViewTagsRti,
})(CoalitionProvider);
