import React, { useContext, useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  makeStyles,
  MenuItem,
  Tooltip,
  Paper,
  TextField,
  Fab,
  InputAdornment,
  DialogActions,
  FormControlLabel,
  DialogContentText,
  RadioGroup,
  Radio,
  Typography,
  TableRow,
  TableBody,
  TableHead,
  Table,
  TableContainer,
} from "@material-ui/core";
import HeadersAndFootersView from "../../../../FileApproval/documentEditor/editor";
import PdfViewer from "app/pdfViewer/pdfViewer";
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
} from "../../../../../camunda_redux/redux/action";
import { Loading } from "../../../therme-source/material-ui/loading";
import { setInboxDatas } from "../../../../../redux/actions/InboxActions";
import history from "../../../../../../history";
import { setPassData } from "../../../../../camunda_redux/redux/ducks/passData";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import CloseIcon from "@material-ui/icons/Close";
import InputForm from "../../quickSignFrom";
import "../../../therme-source/material-ui/loading.css";
import SplitViewPdfViewer from "../../pdfViewer/pdfViewer";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";
import Cookies from "js-cookie";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import FileUploader from "../../FileUpload";
import RtiUploader from "app/views/RTI/sharedComponents/RtiUploader";
import RestorePageIcon from "@material-ui/icons/RestorePage";
import CreateIcon from "@material-ui/icons/Create";
import SendIcon from "@material-ui/icons/Send";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import AddIcon from "@material-ui/icons/Add";
import HrmDialog from "../../HrmDialog";
import RtiHrmDialog from "../../RtiHrmDialog";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CoverLetterDialog from "../../CoverLetterDialog";
import { SplitterComponent } from "@syncfusion/ej2-react-layouts";
import {
  Announcement,
  ArrowBack,
  ImportContacts,
  Replay,
} from "@material-ui/icons";
import {
  Autocomplete,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@material-ui/lab";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneIcon from "@material-ui/icons/Done";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import { unstable_batchedUpdates } from "react-dom";
import GetAppIcon from "@material-ui/icons/GetApp";
import { CgNotes } from "react-icons/cg";
import Axios from "axios";
import { saveAs } from "file-saver";
import CloseFile from "../../CloseFile";
import Remarks from "../../Remarks";
import YlowNotes from "../../YlowNotes";
import { FaRegCalendarTimes } from "react-icons/fa";
import { SplitViewContext } from "../Worker";
import { BmContext } from "./Worker";

const PaperComponent = (props) => {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'.cancel-drag'}
    >
      <Paper {...props} />
    </Draggable>
  );
};

const useStyles = makeStyles((theme) => ({
  mainDiv: {
    textAlign: "center",
  },
  formControl: {
    marginTop: 10,
    width: 300,
    // minWidth: 150,
    // maxWidth: 250,
  },
  button: {
    marginTop: 12,
    marginLeft: 4,
    minWidth: "16px",
    padding: "10px 12px",
    // backgroundColor: "#808080"
  },
  enc_btn: {
    marginLeft: 4,
    minWidth: "16px",
    padding: "10px 12px",
    // backgroundColor: "#808080"
  },
  uploadButton: {
    marginTop: 12,
    marginLeft: 4,
    // backgroundColor: "#808080"
  },
  sign_btn: {
    position: "fixed",
    right: "8px !important",
    bottom: "6% !important",
    zIndex: 10,
    maxHeight: "50px",
    minHeight: "50px",
    minWidth: "50px",
    maxWidth: "50px",
  },
  remark_btn: {
    position: "fixed",
    left: "5% !important",
    bottom: "17% !important",
    zIndex: 10,
    maxHeight: "50px",
    minHeight: "50px",
    minWidth: "50px",
    maxWidth: "50px",
  },
  yellowNote_btn: {
    position: "fixed",
    left: "5% !important",
    bottom: "6% !important",
    zIndex: 10,
    maxHeight: "50px",
    minHeight: "50px",
    minWidth: "50px",
    maxWidth: "50px",
  },
  back_btn: {
    position: "fixed",
    right: "8px !important",
    bottom: "17% !important",
    zIndex: 10,
    maxHeight: "50px",
    minHeight: "50px",
    minWidth: "50px",
    maxWidth: "50px",
  },
  response_btn: {
    position: "fixed",
    right: "8px !important",
    bottom: "110px !important",
    zIndex: 10,
    maxHeight: "50px",
    minHeight: "50px",
    minWidth: "50px",
    maxWidth: "50px",
  },
  speedDial: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(6),
  },
  sDialIcon: {
    position: "relative",
  },
}));
const viewTwo = (props) => {
  const { t } = useTranslation();
  let partCase = Cookies.get("partCase");
  let isRti = Cookies.get("isRti");
  const FileID = Cookies.get("partcaseId");
  let creater = Cookies.get("creater");
  let isRegister = Cookies.get("isRegister");
  let Rtioutbox = Cookies.get("Rtioutbox");
  let forwardRti = Cookies.get("isForward");
  let cabinetIcon = Cookies.get("cabinetStatus");
  let cabinetpartcase = Cookies.get("cabinetpartcase");
  let isCabinet = Cookies.get("isCabinet");
  let referenceNumber = Cookies.get("referenceNumber");
  const department = sessionStorage.getItem("department");
  const rolename = sessionStorage.getItem("role");
  const username = localStorage.getItem("username");

  const classes = useStyles();
  const dispatch = useDispatch();

  const {
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
    count2,
    setcount,
    closeFile,
    setcloseFile,
    canClose,
    setcanClose,
    openSpeedDial,
    setOpenSpeedDial,
    pdfViewerButtons,
    setPdfViewerButtons,
    loadSplitViewData,
    loadRtiData,
  } = useContext(BmContext);

  const { loading, setLoading } = useContext(SplitViewContext);

  // State to perform auto save on undo of document
  const [reSaveNof, setreSaveNof] = useState(false);
  const [reSaveEnco, setreSaveEnco] = useState(false);

  const handleChangePage = (val) => {
    setPage(val);
  };

  const showSWpdf = () => {
    if (pdfLoads) {
      return true;
    } else {
      return false;
    }
  };

  const callMessageOut = (message) => {
    setLoading(false);
    return dispatch(setSnackbar(true, "error", message));
  };

  const handleChange = (value) => {
    const data = JSON.parse(value);
    let url = data.fileUrl;
    const flagNumber = data.flagNumber;
    const hideViewer = data.signed;
    let nofUrl;
    // setFlagNumber(flagNumber);
    // setSfdtData(url);
    if (!data.signed && data.prevVersionId) {
      nofUrl = `${url}?versionId=${data.prevVersionId}`;
    } else {
      nofUrl = url;
    }
    console.log(data);
    unstable_batchedUpdates(() => {
      setNOF(value);
      setNofAnnoId(data.annotationId);
      setNotingSigned(hideViewer);
      setBlnHideSyncfusion(hideViewer);
      setNotingURL(nofUrl);
      setOpenInPdf(data.isEditable);
      setBlnDisable(data.blnDisable);
      setFlag("Noting");
      setPrevFlagNumberNF(flagNumber);
    });
  };

  const handleClearInput = () => {
    setNOF1("");
    setNotingStatustatus("");
    setCoverLetter("");
    setFileChange(true);
    setFlag("");
    setPrevEnclouser("");
    setPrevFlagNumberEnclouser(0);
    setValue("");
    setExtension("docx");
    setIsPdf(false);
    setURL(`${process.env.PUBLIC_URL + "/assets/sample.pdf"}`);
    setEnclosureSigned(false);
    setRtifilename("");
  };

  const handleChange1 = (value, page, sfdtId, isCusLink) => {
    isCusLink ? setPageNumber(page) : setPageNumber(1);
    isCusLink
      ? setEnclosureAnnoiD(sfdtId)
      : setEnclosureAnnoiD(value?.annotationId);

    if (value !== null) {
      const data = value;
      const url = data.fileUrl;
      const flagNumber = data.flagNumber;
      unstable_batchedUpdates(() => {
        setNOF1(value);
        setNotingStatustatus(data.status);
        setCoverLetter(data.coverNote);
        setFileChange(true);
        setFlag("Enclouser");
        setPrevEnclouser(url);
        setPrevFlagNumberEnclouser(flagNumber);
        setValue(flagNumber);
        let arr = data.fileName.split(".");
        arr.length !== 1
          ? setExtension(arr[arr.length - 1])
          : setExtension("docx");
        setIsPdf(data.fileName.includes(".pdf"));
        setURL(url);
        setEnclosureSigned(data.signed);
        setRtifilename(data.fileName);
      });
    }
  };

  const handleChangePreviousEnclosure = () => {
    setPageNumber(1);
    let data = NOF1;
    if (data.serialNo === 0) {
      let newData = enclosureArr[enclosureArr.length - 1];
      handleChange1(newData);
    } else {
      let newData = enclosureArr[data.serialNo - 1];
      handleChange1(newData);
    }
  };

  const handleChangeNextEnclosure = () => {
    setPageNumber(1);
    let data = NOF1;
    if (data.serialNo + 1 === enclosureArr.length) {
      let newData = enclosureArr[0];
      handleChange1(newData);
    } else {
      let newData = enclosureArr[data.serialNo + 1];
      handleChange1(newData);
    }
  };

  const handleRedirectToHrm = (row) => {
    Cookies.set("hasCoverNote", hasCoverNote);
    Cookies.set("HrmRole", hrmRole);
    // props.setInboxDatas(row); // row is event object no need to save in redux as it is too big
    setSend(true);
  };

  const resetButton = () => {
    setLoading(true);
    let tempArr = pdfViewerButtons.map((item, i) => ({
      ...item,
      btnId: i,
      backgroundColor: "grey",
      fileurl: "",
      pageNumber: 1,
    }));
    {
      isRti == "true"
        ? props.savePartCaseTagRti(partCaseId, tempArr).then((resp) => {
            try {
              if (resp.error) {
                callMessageOut(resp.error);
                return;
              }
              if (resp) {
                setLoading(false);
                setPdfViewerButtons(tempArr);
                Cookies.set("HrmRole", hrmRole);
                // props.setInboxDatas(row);
                // setSend(true);
              }
            } catch (error) {
              callMessageOut(error.message);
            }
          })
        : props.savePartCaseTag(partCaseId, tempArr).then((resp) => {
            try {
              if (resp.error) {
                callMessageOut(resp.error);
                return;
              }
              if (resp) {
                setLoading(false);
                setPdfViewerButtons(tempArr);
                Cookies.set("HrmRole", hrmRole);
                // props.setInboxDatas(row);
                // setSend(true);
              }
            } catch (error) {
              callMessageOut(error.message);
            }
          });
    }
  };

  const pdfCustomButton = (e) => {
    let elementName = e.target.parentElement.getAttribute("buttonName");
    let fileurl = e.target.parentElement.getAttribute("fileurl");
    let pages = e.target.parentElement.getAttribute("page");

    const tempColour = ["orange", "green", "purple", "blue", "mediumvioletred"];

    let data = enclosureArr.find((item) => item.fileUrl === fileurl);
    let strData = data;

    var urlExist = true;
    var resUrl = "";
    for (let x = 0; x < pdfViewerButtons.length; x++) {
      if (pdfViewerButtons[x].fileurl === URL) {
        urlExist = false;
      }
      if (fileurl) {
        resUrl = fileurl;
      }
    }
    if (resUrl) {
      setPageNumber(pages);
      setURL(resUrl);
      setNOF1(strData);
      let arr = data.fileName.split(".");
      arr.length !== 1
        ? setExtension(arr[arr.length - 1])
        : setExtension("docx");
    } else {
      let updatedElement = pdfViewerButtons.map((item) =>
        item.btnId == elementName && fileChange && urlExist
          ? {
              ...item,

              backgroundColor: tempColour[item.btnId],
              fileurl: URL,
              pageNumber: page,
            }
          : item
      );
      setFileChange(false);
      setPdfViewerButtons(updatedElement);
      {
        isRti == "true"
          ? props
              .savePartCaseTagRti(partCaseId, updatedElement)
              .then((resp) => {
                try {
                  if (resp.error) {
                    callMessageOut(resp.error);
                    return;
                  }
                  if (resp) {
                    Cookies.set("HrmRole", hrmRole);
                    // props.setInboxDatas(row);
                    // setSend(true);
                  }
                } catch (error) {
                  callMessageOut(error.message);
                }
              })
          : props.savePartCaseTag(partCaseId, updatedElement).then((resp) => {
              try {
                if (resp.error) {
                  callMessageOut(resp.error);
                  return;
                }
                if (resp) {
                  Cookies.set("HrmRole", hrmRole);
                  // props.setInboxDatas(row);
                  // setSend(true);
                }
              } catch (error) {
                callMessageOut(error.message);
              }
            });
      }
    }
  };

  const handleSignedCompleted = (val) => {
    setOpen(false);
  };

  const handleReturnedURL = (val) => {
    let tempArr = notingData.map((item) =>
      item.flagNumber === val.flagNumber ? val : item
    );
    setNotingData(tempArr);
    handleChange(JSON.stringify(val));
    // // setNotingURL(url);
    // loadSplitViewData();
  };
  const handleAddPartCaseNoting = () => {
    setLoading(true);
    const groupName = sessionStorage.getItem("department");
    props.createPartCaseNotingFile(partCaseId, groupName).then((resp) => {
      try {
        if (resp.error) {
          callMessageOut(resp.error);
          return;
        }
        setLoading(false);
        loadSplitViewData();
      } catch (error) {
        callMessageOut(error.message);
      }
    });
  };

  const handleAddNoting = () => {
    const groupName = sessionStorage.getItem("department");
    const deptName = sessionStorage.getItem("department");
    props.saveRtiFile(FileID, groupName, deptName).then((resp) => {
      loadRtiData();
    });
  };

  const handleDocumentRollback = () => {
    setLoading(true);
    rowID &&
      props.rollbackSplitViewDocument(rowID, prevFlagNumberNF).then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          }
          const data = resp.edited;
          let temArr = notingData.map((item) =>
            item.flagNumber === data.flagNumber
              ? {
                  ...data,
                  serialNo: 0,
                  isEditable: item.status === "Internal" ? true : false,
                }
              : item
          );
          setNotingData(temArr);
          const flagNumber = data.flagNumber;
          const hideViewer = data.signed;
          setNotingSigned(hideViewer);
          if (data.uploader === department) {
            setBlnHideSyncfusion(hideViewer);
          } else {
            setBlnHideSyncfusion(true);
          }
          setOpenInPdf(true);
          setFlag("Noting");
          let newNofUrl;
          setNOF(JSON.stringify(temArr[0]));
          if (!data.signed && data.prevVersionId) {
            newNofUrl = `${data.fileUrl}?versionId=${data.prevVersionId}`;
          } else {
            newNofUrl = data.fileUrl;
          }
          unstable_batchedUpdates(() => {
            setPrevFlagNumberNF(flagNumber);
            setreSaveNof(true);
            setNotingURL(newNofUrl);
            setLoading(false);
          });
        } catch (error) {
          callMessageOut(error.message);
        }
      });
  };

  const handleRtiDocumentRollback = () => {
    rowID &&
      props
        .rollbackRtiSplitViewDocument(FileID, prevFlagNumberNF)
        .then((resp) => {
          try {
            // // setSfdtData(resp.url);
            // setBlnDisableForward();
            // setBlnHideSyncfusion(false);
            // let fileUrl =
            //   resp.url + !resp.signed && `?versionId=${resp.url.prevVersionId}`;
            // setNotingURL(fileUrl);

            // const data = resp.edited;
            // let temArr = notingData.map((item) =>
            //   item.flagNumber === data.flagNumber
            //     ? { ...data, serialNo: 0, isEditable: false }
            //     : item
            // );
            const data = resp.edited;
            let temArr = notingData.map((item) =>
              item.flagNumber === data.flagNumber
                ? {
                    ...data,
                    serialNo: 0,
                    isEditable: item.status === "Internal" ? true : false,
                  }
                : item
            );
            setNOF(JSON.stringify(temArr[0]));
            setNotingData(temArr);
            // let url = data.fileUrl;
            const flagNumber = data.flagNumber;
            const hideViewer = data.signed;
            setNotingSigned(hideViewer);
            if (data.uploader === department) {
              setBlnHideSyncfusion(hideViewer);
            } else {
              setBlnHideSyncfusion(true);
            }
            // setBlnHideSyncfusion(true)
            setOpenInPdf(true);
            setFlag("Noting");
            // setFlagNumber(flagNumber);
            // setSfdtData(url);
            let newNotingUrl;
            if (!data.signed && data.prevVersionId) {
              newNotingUrl = `${data.fileUrl}`;
            } else {
              newNotingUrl = data.fileUrl;
            }
            unstable_batchedUpdates(() => {
              setreSaveNof(true);
              setPrevFlagNumberNF(flagNumber);
              setNotingURL(newNotingUrl);
            });
          } catch (error) {
            callMessageOut(error.message);
          }
        });
  };

  const handleDocumentRollbackEnclosure = () => {
    setLoading(true);
    rowID &&
      props
        .rollbackSplitViewEnclosureDocument(partCaseId, prevFlagNumberEnclouser)
        .then((resp) => {
          console.log(resp);
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              return;
            }
            handleEnclosure(resp.enclosure, true);
            setLoading(false);
          } catch (error) {
            callMessageOut(error.message);
          }
        });
  };

  const handleRtiDocumentRollbackEnclosure = () => {
    // setLoading(true);
    rowID &&
      props
        .rollbackRtiSplitViewEnclosureDocument(FileID, prevFlagNumberEnclouser)
        .then((resp) => {
          try {
            handleEnclosure(resp.enclosure);
          } catch (error) {
            callMessageOut(error.message);
          }
        });
  };

  const handleCoverLetter = () => {
    setCoverLetterDialog(true);
  };

  const handleAddCoverLetter = (subject, value) => {
    setLoading(true);
    let temArr = [];
    for (let i = 0; i < value.length; i++) {
      temArr.push(value[i].flagNumber);
    }
    const groupName = sessionStorage.getItem("role");
    const department = sessionStorage.getItem("department");
    props
      .createCoverLetter(
        partCaseId,
        groupName,
        subject,
        temArr,
        username,
        department
      )
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          } else {
            if (resp.hasError === "true") {
              callMessageOut(resp.msg);
              return;
            }
            setLoading(false);
            dispatch(setSnackbar(true, "success", resp.msg));
            loadSplitViewData();
            setCoverLetterDialog(false);
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
      });
  };

  const handleSendConfirmation = (value) => {
    setLoading(true);
    const deptName = sessionStorage.getItem("department");
    setOpenConfirmation(false);
    // setLoad(true);
    props
      .returnRti(FileID, deptName, username)
      .then((resp) => {
        // setLoading(false)
        // history.push({ pathname: "/eoffice/inbox/file" });
        // dispatch(setSnackbar(true, "success", `${t("file_has_been_returned_successfully")}`));
        try {
          if (resp.error) {
            setLoading(false);
            console.log(resp.error);
            dispatch(setSnackbar(true, "error", resp.error));
          } else {
            console.log("res", resp);
            setLoading(false);
            history.push({ pathname: "/eoffice/inbox/file" });
            dispatch(
              setSnackbar(
                true,
                "success",
                `${t("file_has_been_returned_successfully")}`
              )
            );
            return;
          }
        } catch (error) {
          dispatch(setSnackbar(true, "error", error.message));
        }

        // dispatch(setSnackbar(true, "Returned file successfully"));
      })
      .catch((err) => console.log(err));
  };

  const handleEnclosure = (data, shouldReSave) => {
    const url = data.fileUrl;
    const flagNumber = data.flagNumber;
    let enclosureName = NOF1;

    let arr = data.fileName.split(".");
    arr.length !== 1 ? setExtension(arr[arr.length - 1]) : setExtension("docx");
    let tempArr = enclosureArr.map((item) =>
      item.flagNumber === flagNumber
        ? {
            ...item,
            fileUrl: data.fileUrl,
            signed: data.signed,
            prevVersionId: data.prevVersionId,
            subject: item.subject ? item.subject : item.fileName,
          }
        : item
    );

    unstable_batchedUpdates(() => {
      setCoverLetter(data.coverNote);
      setEnclosureSigned(data.signed);
      setFileChange(true);
      shouldReSave && setreSaveEnco(true);
      setURL(url);
      setFlag("Enclouser");
      setPrevEnclouser(url);
      setPrevFlagNumberEnclouser(flagNumber);
      setRtifilename(data.fileName);
      setEnclosureArr(tempArr);
      setNOF1({
        ...enclosureName,
        fileUrl: data.fileUrl,
        signed: data.signed,
        prevVersionId: data.prevVersionId,
      });
    });
  };

  const handleAddEnclosure = (data) => {
    let tempArr = [];
    enclosureArr.map((item) => tempArr.push(item));
    data.map((item, i) =>
      tempArr.push({
        ...item,
        serialNo: enclosureArr.length + i,
        subject: item.subject ? item.subject : item.fileName,
      })
    );
    setEnclosureArr(tempArr);
  };

  const handleSignNoting = () => {
    setFlagNumber(prevFlagNumberNF);
    setFlag("Noting");
    setOpen(true);
    let nofUrl = "";
    if (notingStatus === "Internal") {
      nofUrl = notingURL.split("?versionId")[0];
      setSfdtData(nofUrl);
    } else {
      setSfdtData(notingURL);
    }
  };

  const handleFlagOpen = () => {
    setOpenDialog(true);
    setisValid(true);
  };

  const handleFlagClose = () => {
    setOpenDialog(false);
    setisValid(false);
  };

  const deleteEnclosureData = () => {
    setLoading(true);
    const pcId = sessionStorage.getItem("partcaseID");
    const rolename = sessionStorage.getItem("role");
    props
      .deleteEnclosure(rolename, pcId, prevFlagNumberEnclouser)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          }
          dispatch(
            setSnackbar(
              true,
              "success",
              `${t("annexure_has_been_deleted_successfully")} !`
            )
          );
          const newArray = enclosureArr.filter((item) => {
            return item.flagNumber !== prevFlagNumberEnclouser;
          });
          setEnclosureArr(newArray);
          let newData = enclosureArr[0];
          handleChange1(newData);
          setLoading(false);
        } catch (error) {
          callMessageOut(error.message);
        }
      });
  };

  const deleteEnclosureDataRti = () => {
    setLoading(true);
    const pcId = sessionStorage.getItem("partcaseID");
    const rolename = sessionStorage.getItem("role");
    const partcase = Cookies.get("partcaseId");
    props
      .deleteEnclosureRti(rolename, pcId, rtifilename, prevFlagNumberEnclouser)
      .then((resp) => {
        loadRtiData();
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          }
          dispatch(
            setSnackbar(
              true,
              "success",
              `${t("Enclosure_has_been_deleted_successfully")} !`
            )
          );
          const newArray = enclosureArr.filter((item) => {
            return item.flagNumber !== prevFlagNumberEnclouser;
          });
          setEnclosureArr(newArray);
          let newData;
          if (enclosureArr) {
            newData = enclosureArr[0];
          } else {
            newData = [];
          }
          if (newArray.length > 0) {
            handleChange1(newData);
          } else {
            handleClearInput();
          }
          setLoading(false);
        } catch (error) {
          callMessageOut(error.message);
        }
      });
  };

  const handleFlagEdit = (e) => {
    e.preventDefault();
    const pcId = sessionStorage.getItem("partcaseID");
    const roleName = sessionStorage.getItem("role");
    props
      .editFlagNumber(
        pcId,
        value,
        prevFlagNumberEnclouser,
        roleName,
        NOF1.flagNumberMarking
      )
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          } else {
            let tmpArr = enclosureData.map((item) =>
              item.flagNumber === NOF1.flagNumber
                ? { ...NOF1, flagNumber: value }
                : item
            );
            setEnclosureData(tmpArr);
            handleChange1({ ...NOF1, flagNumber: value });
            dispatch(
              // once file has been deleted shows snackbar to notify user.
              setSnackbar(
                true,
                "success",
                `${t("enclosure_has_been_edited_successfully")}`
              )
            );
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      });
    setOpenDialog(false);
  };

  const handleRtiFlagEdit = (e) => {
    e.preventDefault();
    const pcId = sessionStorage.getItem("partcaseID");
    const roleName = sessionStorage.getItem("role");
    props
      .editRtiFlagNumber(
        pcId,
        value,
        prevFlagNumberEnclouser,
        roleName,
        NOF1.flagNumberMarking
      )
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          } else {
            let tmpArr = enclosureData.map((item) =>
              item.flagNumber === NOF1.flagNumber
                ? { ...NOF1, flagNumber: value }
                : item
            );
            setEnclosureData(tmpArr);
            handleChange1({ ...NOF1, flagNumber: value });
            dispatch(
              // once file has been deleted shows snackbar to notify user.
              setSnackbar(
                true,
                "success",
                `${t("enclosure_has_been_edited_successfully")}`
              )
            );
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      });
    setOpenDialog(false);
  };

  const handleFlagValidate = (e) => {
    setValue(Number(e.target.value));
    const isFlagExistIndex = FlagNoArr.indexOf(Number(e.target.value));

    if (isFlagExistIndex == -1) {
      setisValid(true);
    } else {
      setisValid(false);
    }
  };

  const handleDownload = async (e) => {
    const rtiID = sessionStorage.getItem("rtiID");
    try {
      const res = await Axios.post(
        `/rti/api/downloadZip`,
        JSON.stringify(rtiID),
        {
          headers: {
            "Content-Type": "application/json; charset=utf8",
            Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
            id: rtiID,
          },
          responseType: "arraybuffer",
        }
      );
      if (res) {
        let blob = new Blob([res.data], {
          type: "application/octet-stream",
        });
        saveAs(blob, "RTI File.zip");
      }
    } catch (e) {
      callMessageOut(e.message);
    }
  };

  const hanldeCheckCondition = () => {
    if (partCase === "true" || isRegister) {
      return false;
    } else if (isrtiforward) {
      return false;
    } else {
      return true;
    }
  };

  const handleuploadCondition = () => {
    if (isRegister || isrtiforward) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <>
      {loading && <Loading />}
      {partCase !== "true" || !isRegister ? (
        <SpeedDial
          ariaLabel="SpeedDial tooltip example"
          className={classes.speedDial}
          icon={<SpeedDialIcon />}
          onClose={() => setOpenSpeedDial(false)}
          onOpen={() => setOpenSpeedDial(true)}
          open={openSpeedDial}
          direction="left"
        >
          {!isCabinet && (
            <SpeedDialAction
              className={classes.sDialIcon}
              icon={<SendIcon />}
              tooltipTitle={reSaveEnco || reSaveNof ? t("autosave") : t("send")}
              onClick={handleRedirectToHrm}
              style={{
                display: `${!Rtioutbox && partCase !== "true" ? "" : "none"}`,
              }}
              FabProps={{
                disabled: reSaveEnco || reSaveNof,
              }}
            />
          )}

          {isCabinet && cabinetIcon && (
            <SpeedDialAction
              className={classes.sDialIcon}
              icon={<ImportContacts />}
              tooltipTitle={t("open_file")}
              onClick={handleCabinateClick}
            />
          )}

          {canClose && !isCabinet && (
            <SpeedDialAction
              className={classes.sDialIcon}
              icon={<FaRegCalendarTimes />}
              tooltipTitle={t("save in cabinet")}
              onClick={() => setcloseFile(true)}
              FabProps={{
                disabled: reSaveEnco || reSaveNof,
              }}
            />
          )}

          {isRti === "true" ? (
            <SpeedDialAction
              className={classes.sDialIcon}
              icon={<ArrowBack />}
              tooltipTitle={t("RETURN RTI")}
              onClick={() => setOpenConfirmation(true)}
              style={{
                display: `${rolename !== creater}`,
              }}
            />
          ) : (
            <SpeedDialAction
              className={classes.sDialIcon}
              icon={<ArrowBack />}
              tooltipTitle={t("back")}
              onClick={() => history.goBack()}
              style={{
                display: `${partCase === "true" ? "none" : ""}`,
              }}
            />
          )}

          <SpeedDialAction
            className={classes.sDialIcon}
            icon={
              <SpeedDialIcon
                icon={
                  <div>
                    <Announcement />
                    <span className="bm-icons-badge">{count2}</span>
                  </div>
                }
              />
            }
            tooltipTitle={t("remarks")}
            onClick={() => {
              setopenRemarks(true);
            }}
          />

          <SpeedDialAction
            className={classes.sDialIcon}
            icon={
              <SpeedDialIcon
                icon={
                  <div>
                    <CgNotes />
                    <span className="bm-icons-badge">{count1}</span>
                  </div>
                }
              />
            }
            tooltipTitle={t("yellow notes")}
            onClick={() => {
              setopenYellowNotes(true);
            }}
          />

          {isRegister && (
            <SpeedDialAction
              className={classes.sDialIcon}
              icon={<GetAppIcon />}
              tooltipTitle={t("DOWNLOAD")}
              onClick={handleDownload}
              style={{
                display: `${!Rtioutbox ? "" : "none"}`,
              }}
            />
          )}
        </SpeedDial>
      ) : (
        <></>
      )}
      {}
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <SplitterComponent>
            <div
              style={{
                width: "33%",
              }}
            >
              <Paper
                elevation={3}
                style={{
                  position: "relative",
                  borderRadius: "6px",
                }}
              >
                <div style={{ padding: "1rem" }}>
                  <div>
                    <Typography variant="h6" component="h6">
                      NOTING
                    </Typography>
                  </div>
                  <TableContainer
                    component={Paper}
                    style={{
                      border: `1px solid #8080805c`,
                    }}
                  >
                    <Table component="div" className="App-main-table">
                      <TableHead component="div">
                        <TableRow
                          component="div"
                          className="nothing_table head"
                        >
                          <div></div>
                          <div>{t("file_name")}</div>
                        </TableRow>
                      </TableHead>
                      <TableBody
                        component="div"
                        style={{ height: "calc(100vh - 250px)" }}
                      >
                        {notingData.map((item, i) => (
                          <TableRow
                            component="div"
                            className={`nothing_table body ${
                              NOF === JSON.stringify(item) ? "active" : ""
                            }`}
                            key={i}
                            onClick={() => handleChange(JSON.stringify(item))}
                          >
                            <div>{i + 1}</div>
                            <div>
                              {item.fileName.split(".")[0].split(".")[0]}
                            </div>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {partCase !== "true" && (
                    <>
                      {!notingSigned ? (
                        <Tooltip
                          title={reSaveNof ? t("autosave") : t("sign")}
                          aria-label="Sign"
                        >
                          <span>
                            <Button
                              id="inbox_Noting_sign"
                              variant="contained"
                              color="secondary"
                              className={classes.button}
                              onClick={handleSignNoting}
                              disabled={
                                blnDisable ||
                                isRegister ||
                                isrtiforward ||
                                reSaveNof
                              }
                            >
                              <CreateIcon style={{ fontSize: "1rem" }} />
                            </Button>
                          </span>
                        </Tooltip>
                      ) : (
                        <Tooltip title={t("remove_sign")} aria-label="Sign">
                          <span>
                            <Button
                              id="inbox_remove_sign"
                              // style={{ marginBottom: "15px" }}
                              variant="contained"
                              color="primary"
                              className={classes.button}
                              onClick={
                                isRti === "true"
                                  ? handleRtiDocumentRollback
                                  : handleDocumentRollback
                              }
                              disabled={
                                blnDisable || isRegister || isrtiforward
                              }
                            >
                              <RestorePageIcon style={{ fontSize: "1rem" }} />
                            </Button>
                          </span>
                        </Tooltip>
                      )}
                      <Tooltip title={t("add_noting")} aria-label="Add Noting">
                        <span>
                          <Button
                            id="inbox_add_noting"
                            // style={{ marginBottom: "15px" }}
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            disabled={
                              blnDisableForward || isRegister || isrtiforward
                            }
                            onClick={
                              isRti === "true"
                                ? handleAddNoting
                                : handleAddPartCaseNoting
                            }
                          >
                            <NoteAddIcon style={{ fontSize: "1rem" }} />
                          </Button>
                        </span>
                      </Tooltip>
                    </>
                  )}
                </div>
              </Paper>
            </div>
            <div
              style={{
                width: "67%",
              }}
            >
              <div
                style={{
                  display: !blnHideSyncfusion && openInPdf ? "block" : "none",
                }}
              >
                <Paper
                  elevation={3}
                  className="customDiv"
                  style={{ height: "calc(100vh - 100px)", overflow: "hidden" }}
                >
                  <HeadersAndFootersView
                    fileId={!blnHideSyncfusion && openInPdf ? rowID : ""}
                    fileUrl1={!blnHideSyncfusion && openInPdf ? notingURL : ""}
                    blnIsPartCase={true}
                    reSave={reSaveNof}
                    setreSave={(val) => {
                      setreSaveNof(val);
                    }}
                    enclosureData={enclosureData}
                    handleChange1={handleChange1}
                    style={{ border: "1px solid #b6b6b6" }}
                    containerId="container3"
                  />
                </Paper>
              </div>

              <div
                style={{
                  display: !showSWpdf() ? "none" : "initial",
                }}
              >
                <Paper
                  style={{
                    border: "1px solid #8080805c",
                    height: "calc(100vh - 100px)",
                    overflow: "hidden",
                  }}
                >
                  <SplitViewPdfViewer
                    fileUrl={!blnHideSyncfusion && openInPdf ? "" : notingURL}
                    pdfLoads={(val) => {
                      setpdfLoads(val);
                    }}
                    isCustomLink={true}
                    enclosureData={enclosureArr}
                    handleChange1={handleChange1}
                    fileId={!blnHideSyncfusion && openInPdf ? "" : rowID}
                    flag={"SPLIT"}
                    flagNumber={prevFlagNumberNF}
                    anottId={nofAnnoId}
                  />
                </Paper>
              </div>
            </div>
          </SplitterComponent>
        </Grid>
        <Grid item xs={12}>
          <SplitterComponent>
            <div
              style={{
                width: "33%",
              }}
            >
              <Paper
                elevation={3}
                style={{
                  position: "relative",
                  borderRadius: "6px",
                }}
              >
                <div style={{ padding: "1rem" }}>
                  <div>
                    <Typography variant="h6" component="h6">
                      ENCLOSURE
                    </Typography>
                  </div>
                  <TableContainer
                    component={Paper}
                    style={{
                      border: `1px solid #8080805c`,
                    }}
                  >
                    <Table component="div" className="App-main-table">
                      <TableHead component="div">
                        <TableRow
                          component="div"
                          className="nothing_table head"
                        >
                          <div></div>
                          <div>{t("file_name")}</div>
                        </TableRow>
                      </TableHead>
                      <TableBody
                        component="div"
                        style={{ height: "calc(100vh - 250px)" }}
                      >
                        {enclosureArr.map((item, i) => (
                          <TableRow
                            component="div"
                            className={`nothing_table body ${
                              NOF1.flagNumber === item.flagNumber
                                ? "active"
                                : ""
                            }`}
                            key={i}
                            onClick={() => handleChange1(item)}
                          >
                            <div>{i + 1}</div>
                            <div>
                              {item.fileName.split(".")[0].split(".")[0]}
                            </div>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {partCase === "true" ? (
                    <></>
                  ) : (
                    <>
                      {!enclosureSigned ? (
                        <Tooltip
                          title={reSaveEnco ? t("autosave") : t("sign")}
                          aria-label="Sign"
                        >
                          <span>
                            <Button
                              id="FlagNumberEnclouser_sign_button"
                              variant="contained"
                              color="secondary"
                              className={classes.enc_btn}
                              onClick={() => {
                                setFlagNumber(prevFlagNumberEnclouser);
                                setSfdtData(prevEnclouser);
                                setFlag("Enclouser");
                                setOpen(true);
                              }}
                              disabled={
                                isPdf ||
                                isRegister ||
                                isrtiforward ||
                                enclosurelen == 0 ||
                                reSaveEnco
                              }
                            >
                              <CreateIcon style={{ fontSize: "1rem" }} />
                            </Button>
                          </span>
                        </Tooltip>
                      ) : (
                        <Tooltip
                          title={t("remove_sign")}
                          aria-label="Remove sign"
                        >
                          <span>
                            <Button
                              id="FlagNumberEnclouser_removeSign_button"
                              variant="contained"
                              color="primary"
                              className={classes.enc_btn}
                              onClick={
                                isRti === "true"
                                  ? handleRtiDocumentRollbackEnclosure
                                  : handleDocumentRollbackEnclosure
                              }
                              disabled={isPdf || isRegister || isrtiforward}
                            >
                              <RestorePageIcon style={{ fontSize: "1rem" }} />
                            </Button>
                          </span>
                        </Tooltip>
                      )}
                      <Tooltip
                        title={t(
                          "add_cover_letter_to_forward_pa_to_next_level"
                        )}
                        aria-label="Cover Letter"
                      >
                        <span>
                          <Button
                            id="add_cover_letter"
                            variant="contained"
                            color="primary"
                            className={classes.enc_btn}
                            disabled={hasCoverNote}
                            onClick={handleCoverLetter}
                            style={{
                              display: `${!isRti ? "" : "none"}`,
                            }}
                          >
                            <AddIcon style={{ fontSize: "1rem" }} />
                          </Button>
                        </span>
                      </Tooltip>
                      {handleuploadCondition() && (
                        <Tooltip
                          title={t("upload_file")}
                          aria-label="Upload File"
                          style={{ display: "inline-block" }}
                        >
                          <div className={classes.uploadButton}>
                            {isRti === "true" ? (
                              <RtiUploader
                                rtiID={FileID}
                                deptName={department}
                                loadRtiData={loadRtiData}
                              />
                            ) : (
                              <FileUploader
                                handleAddEnclosure={handleAddEnclosure}
                              />
                            )}
                          </div>
                        </Tooltip>
                      )}
                    </>
                  )}
                  {partCase !== "true" && (
                    <>
                      <Tooltip
                        title={t("delete_enclosure")}
                        aria-label="Delete Enclosure"
                      >
                        <span>
                          <Button
                            id="inbox_delete_enclosure"
                            variant="contained"
                            color="secondary"
                            className={classes.enc_btn}
                            disabled={
                              rolename !== NOF1?.uploader ||
                              isRegister ||
                              isrtiforward ||
                              enclosurelen == 0
                            }
                            onClick={() => {
                              setFlagNumber(prevFlagNumberEnclouser);
                              isRti === "true"
                                ? deleteEnclosureDataRti()
                                : deleteEnclosureData();
                            }}
                          >
                            <DeleteIcon style={{ fontSize: "1rem" }} />
                          </Button>
                        </span>
                      </Tooltip>
                      <Tooltip
                        title={t("edit_enclosure_number")}
                        aria-label="Edit Flagnumber"
                      >
                        <span>
                          <Button
                            id="edit_enclosure_number_button"
                            variant="contained"
                            color="secondary"
                            disabled={
                              rolename !== NOF1?.uploader ||
                              isRegister ||
                              isrtiforward
                            }
                            className={classes.enc_btn}
                            onClick={handleFlagOpen}
                          >
                            <LocalOfferIcon style={{ fontSize: "1rem" }} />
                          </Button>
                        </span>
                      </Tooltip>
                    </>
                  )}
                </div>
              </Paper>
            </div>
            <div
              style={{
                width: "67%",
              }}
            >
              <Grid container style={{ flexWrap: "nowrap", height: "100%" }}>
                <Grid
                  item
                  style={{
                    width: hanldeCheckCondition() ? "95%" : "100%",
                    border: "1px solid #8080805c",
                    height: "100%",
                  }}
                >
                  <div
                    className="customDiv"
                    style={{
                      display:
                        !enclosureSigned && coverLetter ? "block" : "none",
                      height: "calc(100vh - 100px)",
                      overflow: "hidden",
                    }}
                  >
                    <HeadersAndFootersView
                      fileId={!enclosureSigned && coverLetter ? rowID : ""}
                      fileUrl1={!enclosureSigned && coverLetter ? URL : ""}
                      blnIsPartCase={true}
                      reSave={reSaveEnco}
                      setreSave={(val) => {
                        setreSaveEnco(val);
                      }}
                      enclosureData={enclosureData}
                      style={{ border: "1px solid #b6b6b6" }}
                      containerId="container4"
                    />
                  </div>

                  <div
                    style={{
                      display:
                        !enclosureSigned && coverLetter ? "none" : "initial",
                      height: "calc(100vh - 100px)",
                      overflow: "hidden",
                    }}
                  >
                    <PdfViewer
                      personalID={!enclosureSigned && coverLetter ? "" : rowID}
                      flag={"SPLIT"}
                      flagNumber={prevFlagNumberEnclouser}
                      fileUrl={""}
                      pdfLoads={(val) => {
                        setEnclosurePdfLoads(val);
                      }}
                      handleChangePage={handleChangePage}
                      pageNumber={pageNumber}
                      isPage={true}
                      anottId={enclosureAnnoiD}
                      isSample={enclosureArr.length > 0 ? false : true}
                    />
                  </div>
                </Grid>
                {
                  // (partCase !== "true" || isRti !== "true")
                  hanldeCheckCondition() && (
                    <Grid>
                      <div className="split-custom-btn-wrapper">
                        {pdfViewerButtons.map((item) => {
                          return (
                            <Button
                              id="pdfViewerButtons"
                              key={item.btnId}
                              size={"small"}
                              fileurl={item.fileurl}
                              buttonname={item.btnId}
                              page={item.pageNumber}
                              style={{ backgroundColor: item.backgroundColor }}
                              onClick={(e) => pdfCustomButton(e)}
                              className="split-btn-custom"
                              variant="contained"
                              color="primary"
                              href="#contained-buttons"
                            >
                              {item.btnName}
                            </Button>
                          );
                        })}
                        <Tooltip title={t("reset_tags")}>
                          <div style={{ fontSize: "1rem", color: "grey" }}>
                            <Button
                              id="reset_tags_button"
                              className="split-btn-custom"
                              onClick={resetButton}
                              variant="contained"
                              color="secondary"
                            >
                              <Replay
                                style={{
                                  fontSize: "medium",
                                  paddingTop: "5px",
                                }}
                              />
                            </Button>
                          </div>
                        </Tooltip>
                      </div>
                    </Grid>
                  )
                }
              </Grid>
            </div>
          </SplitterComponent>
        </Grid>
      </Grid>

      <Dialog
        open={open}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
          onClose={() => setOpen(false)}
        >
          <span>{t("remark_&_sign")}</span>
          <IconButton
            id="Enclosure_remark_&_sign"
            aria-label="close"
            onClick={() => setOpen(false)}
            color="primary"
            className="cancel-drag"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <InputForm
          flag={flag}
          callBackURL={handleReturnedURL}
          isSignedCompleted={handleSignedCompleted}
          handleEnclosure={handleEnclosure}
          fileId={rowID}
          SignURL={sfdtData}
          flagNum={flagNumber}
          loadRtiData={loadRtiData}
        />
      </Dialog>

      <Dialog
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        // PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ minWidth: "300px" }}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {t("confirmation")}?
          <IconButton
            id="setOpenConfirmation_button"
            aria-label="close"
            onClick={() => setOpenConfirmation(false)}
            color="primary"
            style={{ float: "right", padding: "5px !important" }}
            className="cancel-drag"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="alert-dialog-description"
            style={{ color: props.theme ? "#fff" : "black" }}
          >
            {props.status === "Approved" || props.status === "Rejected" ? (
              <p>
                Update status to applicant <br />
                status = <strong>{props.status}</strong>
              </p>
            ) : (
              <p>
                {t("confirmation_text")} <br />
                {t("confirmation_text_2")}
              </p>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <FormControl component="fieldset">
            <RadioGroup row>
              <FormControlLabel
                control={<Radio color="primary" />}
                label={t("NO")}
                value="NO"
                onClick={() => setOpenConfirmation(false)}
              />
              <FormControlLabel
                control={<Radio color="primary" />}
                label={t("YES")}
                value="YES"
                onClick={handleSendConfirmation}
              />
            </RadioGroup>
          </FormControl>
        </DialogActions>
      </Dialog>

      <Dialog
        open={send}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <Paper>
          <DialogTitle
            id="draggable-dialog-title"
            className="dialog_title"
            style={{ cursor: "move" }}
          >
            {t("send_to")}

            <IconButton
              id="inbox_splitView_send_to"
              aria-label="close"
              onClick={() => setSend(false)}
              color="primary"
              className="cancel-drag"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          {isRti === "true" ? (
            <RtiHrmDialog
              fileId={FileID}
              handleClose={() => setSend(false)}
              pfileName={referenceNumber}
              departmentList={departmentList}
              status={status}
              enclosureArr={enclosureArr}
            />
          ) : (
            <HrmDialog
              handleClose={() => setSend(false)}
              pfileName={referenceNumber}
              enclosureArr={enclosureArr}
              serviceLetterId={serviceLetterId}
              departmentList={departmentList}
              status={status}
            />
          )}
        </Paper>
      </Dialog>

      <Dialog
        open={coverLetterDialog}
        onClose={() => setCoverLetterDialog(false)}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          {t("CREATE COVERLETTER")}
          <IconButton
            id="setCoverLetterDialog_close_button"
            aria-label="close"
            onClick={() => setCoverLetterDialog(false)}
            color="primary"
            className="cancel-drag"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <CoverLetterDialog
          enclosureArr={enclosureArr}
          handleSend={handleAddCoverLetter}
          loading={loading}
        />
      </Dialog>

      <Dialog
        open={openDialog}
        PaperComponent={PaperComponent}
        onClose={handleFlagClose}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          <span>ADD ENCLOSURE NUMBER</span>
          <IconButton
            id="add_enclosure_number_close_button"
            aria-label="close"
            onClick={handleFlagClose}
            color="primary"
            className="cancel-drag"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={isRti == "true" ? handleRtiFlagEdit : handleFlagEdit}>
          <DialogContent dividers>
            <Grid style={{ display: "grid", gridTemplateColumns: "6rem 1fr" }}>
              <Grid>
                <p>Flag Number:</p>
              </Grid>
              <Grid>
                <TextField
                  error={isValid ? false : true}
                  helperText={!isValid && "Number already exists."}
                  InputLabelProps={{ shrink: false }}
                  variant="outlined"
                  id="outlined-number"
                  type="number"
                  InputProps={{
                    inputProps: { min: 1 },
                    endAdornment: (
                      <InputAdornment position="end">A</InputAdornment>
                    ),
                  }}
                  size="small"
                  value={value}
                  onChange={handleFlagValidate}
                  onBlur={() => setTouched(true)}
                  fullWidth
                />
              </Grid>
              <Grid>
                <p>Subject:</p>
              </Grid>
              <Grid>
                <TextField
                  InputLabelProps={{ shrink: false }}
                  variant="outlined"
                  id="outlined-text"
                  type="Text"
                  value={NOF1 && NOF1.subject}
                  size="small"
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <span>
              <Button
                id="flagEdit_submit_button"
                variant="outlined"
                endIcon={<DoneIcon />}
                disabled={!isValid}
                color="primary"
                type="submit"
              >
                Submit
              </Button>
            </span>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state) => {
  console.log(state);
  return {
    props: state.props,
    inboxer: state.inboxer,
    theme: state.theme,
  };
};
export default connect(mapStateToProps, {
  setInboxDatas,
  loadInboxDataSplitView,
  loadPartCaseData,
  getPANotingData,
  getPAEnclosureData,
  savePartCaseTag,
  fetchSplitViewTags,
  createPartCaseNotingFile,
  rollbackSplitViewDocument,
  rollbackSplitViewEnclosureDocument,
  createCoverLetter,
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
})(viewTwo);
