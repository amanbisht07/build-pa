import React, { useEffect, useState } from "react";
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
} from "@material-ui/core";
import HeadersAndFootersView from "../../../FileApproval/documentEditor/editor";
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
} from "../../../../camunda_redux/redux/action";
import { Loading } from "../../therme-source/material-ui/loading";
import { setInboxDatas } from "../../../../redux/actions/InboxActions";
import history from "../../../../../history";
import { setPassData } from "../../../../camunda_redux/redux/ducks/passData";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import CloseIcon from "@material-ui/icons/Close";
import InputForm from "../quickSignFrom";
import "../../therme-source/material-ui/loading.css";
import SplitViewPdfViewer from "../pdfViewer/pdfViewer";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";
import Cookies from "js-cookie";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import FileUploader from "../FileUpload";
import RtiUploader from "app/views/RTI/sharedComponents/RtiUploader";
import RestorePageIcon from "@material-ui/icons/RestorePage";
import CreateIcon from "@material-ui/icons/Create";
import SendIcon from "@material-ui/icons/Send";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import AddIcon from "@material-ui/icons/Add";
import HrmDialog from "../HrmDialog";
import RtiHrmDialog from "../RtiHrmDialog";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CoverLetterDialog from "../CoverLetterDialog";
import { SplitterComponent } from "@syncfusion/ej2-react-layouts";
import {
  Announcement,
  ArrowBack,
  ImportContacts,
  Replay,
  Search,
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
import RemarkTable from "../Remarks";
import { saveAs } from "file-saver";
import CloseFile from "../CloseFile";
import Remarks from "../Remarks";
import YlowNotes from "../YlowNotes";
import { FaRegCalendarTimes } from "react-icons/fa";

const PaperComponent = (props) => {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
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
    bottom: "40px !important",
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
  cabinetOpen_btn: {
    position: "fixed",
    right: "8px !important",
    bottom: "40px !important",
    zIndex: 5,
    maxHeight: "50px",
    minHeight: "50px",
    minWidth: "50px",
    maxWidth: "50px",
  },
}));

const ViewOne = (props) => {
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
  let referenceNumber = Cookies.get("referenceNumber");
  const department = sessionStorage.getItem("department");
  const rolename = sessionStorage.getItem("role");

  const classes = useStyles();
  const dispatch = useDispatch();

  const [NOF, setNOF] = useState("");
  const [NOF1, setNOF1] = useState("");
  const [sfdtData, setSfdtData] = useState("");
  const [prevEnclouser, setPrevEnclouser] = useState("");
  const InboxIdFromHrmSection = sessionStorage.getItem("InboxID");
  const [blnVisible, setBlnVisible] = useState(false);
  const [loading, setLoading] = useState(true);
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
  const [coverLetter, setCoverLetter] = useState(false);
  const [coverLetterDialog, setCoverLetterDialog] = useState(false);
  const [extension, setExtension] = useState("docx");
  const username = localStorage.getItem("username");
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

  // State to perform auto save on undo of document
  const [reSaveNof, setreSaveNof] = useState(false);
  const [reSaveEnco, setreSaveEnco] = useState(false);
  const sessionRole = sessionStorage.getItem("role");
  const [rtifilename, setRtifilename] = useState("");
  const [addNote, setaddNote] = useState(false);
  const [openRemarks, setopenRemarks] = useState(false);
  const [openYellowNotes, setopenYellowNotes] = useState(false);
  const [count, setcount] = useState({
    ylowNote: 0,
    remarkNote: 0,
  });

  const [closeFile, setcloseFile] = useState(false);
  const [canClose, setcanClose] = useState(false);
  const [openSpeedDial, setOpenSpeedDial] = useState(false);

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

  const loadSplitViewData = () => {
    console.log(isrtiforward);
    Cookies.set("HrmRole", null);
    const inboxId = sessionStorage.getItem("InboxID");
    const InboxID = inboxId !== undefined ? inboxId : InboxIdFromHrmSection;
    if (partCase === "true") {
      loadPartCaseIdData(inboxId);
      setPartCaseId(inboxId);
    } else {
      props.loadInboxDataSplitView(inboxId, username).then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          }
          if (resp.Data.partCaseId) {
            loadPartCaseIdData(resp.Data.partCaseId);
            setPartCaseId(resp.Data.partCaseId);
          }
        } catch (error) {
          callMessageOut(error.message);
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
        console.log(resp);
        if (resp.Data.partcaseId) {
          loadRtiPartCaseIdData(resp.Data.partcaseId);
        }
      });
    }
  };

  const loadRtiPartCaseIdData = (val) => {
    setPartCaseId(val);
    sessionStorage.setItem("partcaseID", val);
    let formData = new FormData();
    formData.append("id", val);
    props.loadRtiPartCaseData(formData).then((resp) => {
      console.log(resp);
      // if (resp != undefined) {
      //   loadData(resp.partcase.data);
      // }
      try {
        loadData(resp.data);
      } catch (e) {
        callMessageOut(e.message);
      }
    });
  };

  const loadPartCaseIdData = (val) => {
    sessionStorage.setItem("partcaseID", val);
    let formData = new FormData();
    formData.append("id", val);
    if (partCase === "true") {
      props.getcabinetpartcase(department, cabinetpartcase).then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          } else {
            loadData(resp);
          }
        } catch (e) {
          callMessageOut(e.message);
        }
      });
    } else {
      props.loadPartCaseData(formData).then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          } else {
            loadData(resp.data);
          }
        } catch (e) {
          callMessageOut(e.message);
        }
      });
    }
  };

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

  const handleCount = (name, val, byVal) => {
    if (val) {
      setcount({
        ...count,
        [name]: val,
      });
    } else if (byVal) {
      setcount({
        ...count,
        [name]: count[name] + byVal,
      });
    }
  };

  const loadData = (resp) => {
    setEnclosureLen(resp.enclosureList.length);
    let NotingUrl;
    let CLetter = coverLetter;
    let enclouserTmpArr = [];
    let flagNoTmpArr = [];
    if (!coverLetter) {
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
    if (!notngTmpArr[0].signed && notngTmpArr[0].prevVersionId) {
      NotingUrl = `${notngTmpArr[0].fileUrl}?versionId=${notngTmpArr[0].prevVersionId}`;
    } else {
      NotingUrl = notngTmpArr[0].fileUrl;
    }

    unstable_batchedUpdates(() => {
      setCoverLetter(CLetter);
      setStatus(resp.status);
      setHrmRole(resp.hrmRole);
      setHasCoverNote(resp.hasCoverNote);
      setServiceLetterId(resp.serviceLetterId);
      setDepartmentList(resp.deptList);
      setNotingStatustatus(notngTmpArr[0].status);
      setNotingData(notngTmpArr);
      setNofAnnoId(notngTmpArr[0].annotationId);
      setNotingSigned(notngTmpArr[0].signed);
      setEnclosureData(enclouserTmpArr);
      setEnclosureAnnoiD(enclouserTmpArr[0]?.annotationId);
      setFlagNoArr(flagNoTmpArr);
      setRowID(resp.id);
      setPrevFlagNumberNF(notngTmpArr[0].flagNumber);
      setNotingURL(NotingUrl);
      setNOF(JSON.stringify(notngTmpArr[0]));
      setBlnHideSyncfusion(notngTmpArr[0].signed);
      setOpenInPdf(notngTmpArr[0].isEditable);
      setBlnDisable(notngTmpArr[0].blnDisable);
      setBlnVisible(true);
      setBlnDisableForward(!resp.enableAddNoting);
      setcanClose(department === resp.department);
      setLoading(false);
    });
    // loadEnclouserTags();
    if (partCase !== "true") {
      isRti === "true" ? loadEnclouserTagsRti() : loadEnclouserTags();
    }
  };

  const loadEnclouserTags = () => {
    const dept = sessionStorage.getItem("department");
    const PartCaseID = sessionStorage.getItem("partcaseID");
    props.fetchSplitViewTags(PartCaseID, dept).then((resp) => {
      try {
        if (resp.error) {
          callMessageOut(resp.error);
          return;
        }
        if (resp) {
          if (resp.Data != null && resp.Data != [] && resp.Data != "") {
            setPdfViewerButtons(resp.Data);
          }
        }
      } catch (error) {
        callMessageOut(error.message);
      }
    });
  };

  const loadEnclouserTagsRti = () => {
    const dept = sessionStorage.getItem("department");
    const PartCaseID = sessionStorage.getItem("partcaseID");
    props.fetchSplitViewTagsRti(PartCaseID, dept).then((resp) => {
      try {
        if (resp.error) {
          callMessageOut(resp.error);
          return;
        }
        if (resp) {
          if (resp.Data != null && resp.Data != [] && resp.Data != "") {
            setPdfViewerButtons(resp.Data);
          }
        }
      } catch (error) {
        callMessageOut(error.message);
      }
    });
  };

  const handleChangePage = (val) => {
    setPage(val);
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
    if (enclosureData.length !== 0) {
      enclosureData.map((item, i) => {
        temArr.push({
          ...item,
          serialNo: i,
          subject: item.subject ? item.subject : item.fileName,
        });
      });
      setEnclosureSigned(enclosureData[0].signed);
    }

    setEnclosureArr(temArr);
    if (temArr.length !== 0) {
      setURL(temArr[0].fileUrl);
      setNOF1(temArr[0]);
      // setFlagNumber(temArr[0].flagNumber);
      setPrevFlagNumberEnclouser(temArr[0].flagNumber);
      setRtifilename(temArr[0].fileName);
      setPrevEnclouser(temArr[0].fileUrl);
    }
  }, [enclosureData]);

  useEffect(() => {
    if (enclosurePdfLoads === true && URL !== undefined) {
      let data = { extension, url: URL };
      dispatch(setPassData(data));
    }
  }, [enclosurePdfLoads, URL, enclosureSigned]);

  useEffect(() => {
    if (!blnHideSyncfusion && openInPdf) {
      setpdfLoads(false);
    }
  }, [blnHideSyncfusion, openInPdf]);

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

  const handleChange = (event) => {
    console.log(event.target.value);
    setNOF(event.target.value);
    const data = JSON.parse(event.target.value);

    let url = data.fileUrl;
    const flagNumber = data.flagNumber;
    const hideViewer = data.signed;
    setNofAnnoId(data.annotationId);
    setNotingSigned(hideViewer);
    setBlnHideSyncfusion(hideViewer);
    setOpenInPdf(data.isEditable);
    setBlnDisable(data.blnDisable);
    setFlag("Noting");
    // setFlagNumber(flagNumber);
    // setSfdtData(url);
    if (!data.signed && data.prevVersionId) {
      setNotingURL(`${url}?versionId=${data.prevVersionId}`);
    } else {
      setNotingURL(url);
    }
    setPrevFlagNumberNF(flagNumber);
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
      : setEnclosureAnnoiD(value.annotationId);

    if (value !== null) {
      setNOF1(value);
      const data = value;
      const url = data.fileUrl;
      const flagNumber = data.flagNumber;
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
    let newVal = {
      target: {
        value: JSON.stringify(val),
      },
    };
    handleChange(newVal);
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

  const handleCabinateClick = () => {
    Cookies.remove("partCase");
    Cookies.remove("cabinetStatus");
    // loadPartCaseIdData();

    props.openFile(department, cabinetpartcase).then((resp) => {
      try {
        if (resp.error) {
          callMessageOut(resp.error);
          return;
        } else {
          loadData(resp);
        }
      } catch (e) {
        callMessageOut(e.message);
      }
    });
  };

  return (
    <>
      {loading && <Loading />}
      {cabinetIcon === "In-Cabinet" ? (
        <div>
          <Tooltip title={t("open_file")}>
            <Fab
              variant="extended"
              className={classes.cabinetOpen_btn}
              color="secondary"
              onClick={handleCabinateClick}
            >
              <ImportContacts style={{ fontSize: "1rem" }} />
            </Fab>
          </Tooltip>
        </div>
      ) : partCase === "true" ? (
        <Tooltip title={t("back")} aria-label="BACK">
          <Fab
            variant="extended"
            className={classes.back_btn}
            color="primary"
            onClick={() => history.push({ pathname: "/eoffice/cabinet/file" })}
          >
            <ArrowBackIcon style={{ fontSize: "1rem" }} />
          </Fab>
        </Tooltip>
      ) : partCase !== "true" || !isRegister ? (
        <SpeedDial
          ariaLabel="SpeedDial tooltip example"
          className={classes.speedDial}
          icon={<SpeedDialIcon />}
          onClose={() => setOpenSpeedDial(false)}
          onOpen={() => setOpenSpeedDial(true)}
          open={openSpeedDial}
          direction="left"
        >
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

          {canClose && (
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
                display: `${sessionRole !== creater}`,
              }}
            />
          ) : (
            <SpeedDialAction
              className={classes.sDialIcon}
              icon={<ArrowBack />}
              tooltipTitle={t("back")}
              onClick={() => history.push({ pathname: "/eoffice/inbox/file" })}
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
                    <span className="bm-icons-badge">{count.remarkNote}</span>
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
                    <span className="bm-icons-badge">{count.ylowNote}</span>
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
        <div></div>
      )}
      {}
      <Grid
        container
        justifyContent="center"
        spacing={1}
        style={{
          margin: "0px",
          padding: "0rem 1rem",
          border: "1px solid #80808085",
          background: "#ffffffa1",
        }}
      >
        <Grid item xs={6} style={{ display: "flex", alignItems: "center" }}>
          {blnVisible ? (
            <TextField
              select
              label={t("note_on_file")}
              value={NOF}
              size="small"
              fullWidth
              onChange={handleChange}
              variant="outlined"
              className={classes.formControl}
            >
              {notingData.map((item, index) => (
                <MenuItem key={index} value={JSON.stringify(item)}>
                  {item.fileName.split(".")[0].split(".")[0]}
                </MenuItem>
              ))}
            </TextField>
          ) : null}
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
                        blnDisable || isRegister || isrtiforward || reSaveNof
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
                      disabled={blnDisable || isRegister || isrtiforward}
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
                    disabled={blnDisableForward || isRegister || isrtiforward}
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

              <Tooltip title={t("add yellow note")} aria-label="Add Noting">
                <span>
                  <Button
                    id="inbox_add_ylo_note"
                    // style={{ marginBottom: "15px" }}
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={() => setaddNote(true)}
                  >
                    <NoteAddIcon style={{ fontSize: "1rem" }} />
                  </Button>
                </span>
              </Tooltip>
            </>
          )}
        </Grid>

        <Grid item xs={6} style={{ display: "flex", alignItems: "center" }}>
          <Autocomplete
            size="small"
            name="enclosure"
            autoHighlight
            options={enclosureArr.map((option) => option)}
            value={NOF1}
            onChange={(e, value) => handleChange1(value)}
            getOptionLabel={(option) =>
              option
                ? `${option.flagNumber}${option.flagNumberMarking} - ${
                    option && option.subject.split(".")[0]
                  }`
                : ""
            }
            renderInput={(params, i) => (
              <>
                <TextField
                  style={{ marginTop: "20px" }}
                  {...params}
                  variant="outlined"
                  className={classes.formControl}
                  label={t("enclosure")}
                  margin="normal"
                  id={i}
                />
              </>
            )}
          />
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
                      className={classes.button}
                      onClick={() => {
                        setFlagNumber(prevFlagNumberEnclouser);
                        setSfdtData(prevEnclouser);
                        setFlag("Enclouser");
                        setOpen(true);
                      }}
                      disabled={
                        isPdf || isRegister || isrtiforward || enclosurelen == 0
                      }
                    >
                      <CreateIcon style={{ fontSize: "1rem" }} />
                    </Button>
                  </span>
                </Tooltip>
              ) : (
                <Tooltip title={t("remove_sign")} aria-label="Remove sign">
                  <span>
                    <Button
                      id="FlagNumberEnclouser_removeSign_button"
                      variant="contained"
                      color="primary"
                      className={classes.button}
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
                title={t("add_cover_letter_to_forward_pa_to_next_level")}
                aria-label="Cover Letter"
              >
                <span>
                  <Button
                    id="add_cover_letter"
                    variant="contained"
                    color="primary"
                    className={classes.button}
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
                <Tooltip title={t("upload_file")} aria-label="Upload File">
                  <div className={classes.uploadButton}>
                    {isRti === "true" ? (
                      <RtiUploader
                        rtiID={FileID}
                        deptName={department}
                        loadRtiData={loadRtiData}
                      />
                    ) : (
                      <FileUploader handleAddEnclosure={handleAddEnclosure} />
                    )}
                  </div>
                </Tooltip>
              )}
            </>
          )}

          <Tooltip
            title={t("previous_enclosure")}
            aria-label="Previous Enclosure"
          >
            <span>
              <Button
                id="inbox_previous_enclosure"
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleChangePreviousEnclosure}
                disabled={isRegister || isrtiforward || enclosurelen == 0}
              >
                <SkipPreviousIcon style={{ fontSize: "1rem" }} />
              </Button>
            </span>
          </Tooltip>
          <Tooltip title={t("next_enclosure")} aria-label="Next Enclosure">
            <span>
              <Button
                id="inbox_next_enclosure"
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleChangeNextEnclosure}
                disabled={isRegister || isrtiforward || enclosurelen == 0}
              >
                <SkipNextIcon style={{ fontSize: "1rem" }} />
              </Button>
            </span>
          </Tooltip>
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
                    className={classes.button}
                    disabled={
                      rolename !== NOF1?.uploader ||
                      isRegister ||
                      isrtiforward ||
                      enclosurelen == 0
                    }
                    // onClick={() => {
                    //   setFlagNumber(prevFlagNumberEnclouser);
                    //   deleteEnclosureData();
                    // }}
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
                      rolename !== NOF1?.uploader || isRegister || isrtiforward
                    }
                    className={classes.button}
                    onClick={handleFlagOpen}
                  >
                    <LocalOfferIcon style={{ fontSize: "1rem" }} />
                  </Button>
                </span>
              </Tooltip>
            </>
          )}
        </Grid>

        <SplitterComponent style={{ zIndex: "0" }}>
          <div
            style={{
              width: "50%",
            }}
          >
            <div
              style={{
                display: !blnHideSyncfusion && openInPdf ? "initial" : "none",
              }}
            >
              <div
                className="customDiv"
                style={{
                  height: "calc(100vh - 150px)",
                  border: "1px solid #80808073",
                }}
              >
                <HeadersAndFootersView
                  fileId={!blnHideSyncfusion && openInPdf ? rowID : ""}
                  fileUrl1={!blnHideSyncfusion && openInPdf ? notingURL : ""}
                  blnIsPartCase={true}
                  reSave={reSaveNof}
                  setreSave={(val) => {
                    console.log(val)
                    setreSaveNof(val);
                  }}
                  enclosureData={enclosureData}
                  handleChange1={handleChange1}
                  style={{ border: "1px solid #b6b6b6" }}
                  containerId="container3"
                />
              </div>
            </div>

            <div
              style={{
                display: !showSWpdf() ? "none" : "initial",
              }}
            >
              <div
                style={{
                  border: "1px solid #b6b6b6",
                  height: "calc(100vh - 150px)",
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
              </div>
            </div>
          </div>

          <div style={{ width: "50%" }}>
            <Grid container style={{ flexWrap: "nowrap", height: "100%" }}>
              <Grid
                item
                style={{
                  width: hanldeCheckCondition() ? "95%" : "100%",
                  border: "1px solid #b6b6b6",
                }}
              >
                <div
                  className="customDiv"
                  style={{
                    display:
                      !enclosureSigned && coverLetter ? "initial" : "none",
                    height: "calc(100vh - 150px)",
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
                    height: "calc(100vh - 150px)",
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
                              style={{ fontSize: "medium", paddingTop: "5px" }}
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

      <Remarks
        pcId={partCaseId}
        open={openRemarks}
        updateCount={handleCount}
        close={(val) => setopenRemarks(val)}
      />

      <YlowNotes
        pcId={partCaseId}
        addNote={addNote}
        toggleDialog={() => setaddNote(false)}
        open={openYellowNotes}
        updateCount={handleCount}
        close={(val) => setopenYellowNotes(val)}
      />

      <CloseFile
        pcId={partCaseId}
        open={closeFile}
        close={(val) => setcloseFile(val)}
      />
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
  getcabinetpartcase,
  openFile,
})(ViewOne);
