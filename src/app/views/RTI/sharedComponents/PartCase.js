import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  Icon,
  IconButton,
  makeStyles,
  MenuItem,
  Paper,
  Tooltip,
  Fab,
  TextField,
} from "@material-ui/core";
import Cookies from "js-cookie";
import PdfViewer from "../../../pdfViewer/pdfViewer";
import Breadcrumb from "matx/components/Breadcrumb";
import history from "../../../../history";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import React, { useEffect, useState } from "react";
import HeadersAndFootersView from "../../FileApproval/documentEditor/editor";
import ForwardForm from "./forwardForm";
import RtiUploader from "./RtiUploader";
import Draggable from "react-draggable";
import CreateIcon from "@material-ui/icons/Create";
import RestorePageIcon from "@material-ui/icons/RestorePage";
import AddIcon from "@material-ui/icons/Add";
import SendIcon from "@material-ui/icons/Send";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import { useTranslation } from "react-i18next";
import CloseIcon from "@material-ui/icons/Close";
import InputForm from "../../inbox/shared/quickSignFrom";
import {
  getPartcaseNoting,
  getPartcaseEnclosures,
  saveRtiFile,
  loadPartCaseData,
} from "app/camunda_redux/redux/action/index";
import { connect, useDispatch } from "react-redux";
import { setPassData } from "app/camunda_redux/redux/ducks/passData";
import { InlineEdit } from "@syncfusion/ej2-react-grids";

const useStyles = makeStyles({
  mainDiv: {
    textAlign: "center",
  },
  formControl: {
    marginTop: 5,
    width: 300,
    // minWidth: 350,
    // maxWidth: 350,
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
    // minWidth: "16px",
    // padding: "10px 12px",
    // backgroundColor: "#808080"
  },
  sign_btn: {
    position: "fixed",
    right: "8px !important",
    bottom: "40px !important",
    zIndex: 1,
    maxHeight: "50px",
    minHeight: "50px",
    minWidth: "50px",
    maxWidth: "50px",
  },
  back_btn: {
    position: "fixed",
    right: "8px !important",
    bottom: "110px !important",
    zIndex: 1,
    maxHeight: "50px",
    minHeight: "50px",
    minWidth: "50px",
    maxWidth: "50px",
  },
});

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title"  cancel={'.cancel-drag'}>
      <Paper {...props} />
    </Draggable>
  );
};

const SplitView = (props) => {
  // let rtiID = Cookies.get("rtiId");
  let title = Cookies.get("Rtifile");
  let priority = Cookies.get("priority");
  let referenceNumber = Cookies.get("referenceNumber");
  const { t } = useTranslation();
  const [blnDisableForward, setBlnDisableForward] = useState(false);
  const [prevEnclouser, setPrevEnclouser] = useState("");
  const [pdfWidth, setpdfWidth] = useState(6);
  const [flag, setFlag] = useState("Noting");
  const [flagNumber, setFlagNumber] = useState(0);
  const [prevFlagNumberEnclouser, setPrevFlagNumberEnclouser] = useState(0);
  const [notingData, setNotingData] = useState([]);
  const [blnVisible, setBlnVisible] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [NOF, setNOF] = useState("");
  const [rowID, setRowID] = useState("");
  const [NOF1, setNOF1] = useState("");
  const [URL, setURL] = useState("");
  const [sfdtData, setSfdtData] = useState("");
  const [fileName, setFileName] = useState("");
  const [open, setOpen] = useState(false);
  const [enclosureData, setEnclosureData] = useState([]);
  const [pdfLoads, setPdfLoads] = useState(false);
  const [openForward, setopenForward] = useState(false);
  const [enclosureId, setEnclosureId] = useState("");
  const [annotationId, setAnnotationId] = useState("");
  const [extension, setExtension] = useState("");
  const [prevNFurl, setPrevNFurl] = useState(" ");
  const [notingId, setNotingId] = useState("");
  const FileID = sessionStorage.getItem("rtiID");
  const [loading, setLoading] = useState(false);
  const [enclosureURL, setEnclosureURL] = useState("");
  const [notingURL, setNotingURL] = useState("");
  const [enclosureArr, setEnclosureArr] = useState([]);
  const [fileChange, setFileChange] = useState(false);
  const [notingSigned, setNotingSigned] = useState(false);
  const [openInPdf, setOpenInPdf] = useState(false);
  const [enclosureSigned, setEnclosureSigned] = useState(false);
  const [reloadPdf, setreloadPdf] = useState(false);

  useEffect(() => {
    let temArr = [];
    if (enclosureData.length !== 0) {
      enclosureData.map((item, i) => {
        temArr.push({ ...item, serialNo: i });
      });
      setEnclosureSigned(enclosureData[0].signed);
    }

    setEnclosureArr(temArr);
    if (temArr.length !== 0) {
      // setURL(temArr[0].filepath);
      // setNOF1(JSON.stringify(temArr[0]));
      // setEnclosureURL(temArr[0].filepath);
      // setFlagNumber(temArr[0].flagNumber);
      setPrevFlagNumberEnclouser(temArr[0].flagNumber);
      // setPrevEnclouser(temArr[0].filepath);
    }
  }, [enclosureData]);

  const handleReload = () => {
    setreloadPdf(!reloadPdf);
  };

  const loadSplitViewData = () => {
    Cookies.set("HrmRole", null);
    setLoading(true);
    const partCase = Cookies.get("partCaseId");
  };

  const loadPartCaseIdData = (val) => {
    setPartCaseId(val);
    sessionStorage.setItem("partcaseID", val);
    let formData = new FormData();
    formData.append("id", val);
    props.loadPartCaseData(formData).then((resp) => {
      if (resp != undefined) {
        loadData(resp.data);
      }
    });
  };
  const loadData = (resp) => {
    let notngTmpArr = [];
    resp.notingList.reverse().map((item, x) =>
      notngTmpArr.push({
        ...item,
        serialNo: x,
        isEditable: x === 0 ? true : false,
      })
    );
    setDepartmentList(resp.deptList);
    setNotingData(notngTmpArr);
    setNotingSigned(notngTmpArr[0].signed);
    setEnclosureData(enclouserTmpArr);
    setRowID(resp.id);
    // setPrevFlagNumberNF(notngTmpArr[0].flagNumber);
    if (!notngTmpArr[0].signed && notngTmpArr[0].prevVersionId) {
      setNotingURL(
        `${notngTmpArr[0].fileUrl}?versionId=${notngTmpArr[0].prevVersionId}`
      );
    } else {
      setNotingURL(notngTmpArr[0].fileUrl);
    }
    // setNotingURL(fileUrl);
    setFileName(notngTmpArr[0].fileName);
    setNOF(JSON.stringify(notngTmpArr[0]));
    setBlnHideSyncfusion(notngTmpArr[0].signed);
    setOpenInPdf(notngTmpArr[0].isEditable);
    setBlnVisible(true);
    setLoading(false);
    setBlnDisableForward(!resp.enableAddNoting);
    loadEnclouserTags();
  };

  const handleChange = (event) => {
    setNOF(event.target.value.filepath);
    const data = event.target.value;
    let url = data.filepath;
    const flagNumber = data.flagNumber;
    const hideViewer = data.signed;
    setNotingId(data.id);
    setNotingSigned(hideViewer);
    setBlnHideSyncfusion(hideViewer);
    setFlag("Noting");
    setFlagNumber(flagNumber);
    setRowID(event.target.value.id);

    setNotingURL(url);
    setSfdtData(url);
    setPrevNFurl(url);
    let arr = event.target.value.filename.split(".");
    arr.length !== 1 ? setExtension(arr[arr.length - 1]) : setExtension("docx");
  };

  const handleChange1 = (event) => {
    setNOF1(event.target.value.filepath);
    const data = event.target.value;
    let url = data.filepath;
    setEnclosureId(data.id);
    setAnnotationId(event.target.value.annotationId);
    setFileChange(true);
    setPrevEnclouser(url);
    let arr = event.target.value.filename.split(".");
    arr.length !== 1 ? setExtension(arr[arr.length - 1]) : setExtension("docx");
    setSfdtData(url);
    setRowID(event.target.value.id);
    setEnclosureURL(url);
  };
  const handleChangePreviousEnclosure = () => {
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
    let data = NOF1;
    if (data.serialNo + 1 === enclosureArr.length) {
      let newData = enclosureArr[0];
      handleChange1(JSON.stringify(newData));
    } else {
      let newData = enclosureArr[data.serialNo + 1];
      handleChange1(JSON.stringify(newData));
    }
  };



  useEffect(() => {
    let data = { extension, url: enclosureURL };

    dispatch(setPassData(data));
  }, [enclosureURL, extension, dispatch]);

  const loadNotingList = (tempPath) => {
    props.getPartcaseNoting(FileID).then((resp) => {
      try {
        if (resp && resp.length > 0) {
          setNotingData(resp);
          setNotingId(resp[0].id);
          setNotingURL(resp[0].filepath);
          setPrevNFurl(resp[0].filepath);
        } else {
          const errorMessage =
            resp.status + " : " + resp.error + " AT " + resp.path;
          callMessageOut(errorMessage);
        }
      } catch (e) {
        callMessageOut(e.message);
      }
      setTimeout(() => {
        tempPath ? setNOF(tempPath) : "";
      }, 100);
    });
  };

  const loadEnclosureList = (tempPath) => {
    props.getPartcaseEnclosures(FileID).then((resp) => {
      try {
        if (resp && resp.length > 0) {
          setEnclosureData(resp);
        } else {
          const errorMessage =
            resp.status + " : " + resp.error + " AT " + resp.path;
          callMessageOut(errorMessage);
        }
      } catch (e) {
        callMessageOut(e.message);
      }
      setTimeout(() => {
        tempPath ? setNOF1(tempPath) : "";
      }, 100);
    });
  };

  const callMessageOut = (message) => { };

  useEffect(() => {
    loadNotingList();
    loadEnclosureList();
    loadSplitViewData();
  }, []);

  const handleAddNoting = () => {
    const groupName = sessionStorage.getItem("department");
    props.saveRtiFile(FileID, groupName).then((resp) => {
      loadNotingList();
      loadSplitViewData();
    });
  };

  const handleSignedCompleted = (val) => {
    // console.log('noting url is ', val)
    setpdfWidth(6);
    setOpen(false);
  };

  const handleReturnedURL = (url) => {
    setBlnHideSyncfusion(true);
    setNotingURL(url);
    // console.log('noting url is ', url)
    // loadSplitViewData();
  };

  return (
    <div
      className="m-sm-30"
      style={{ marginRight: "10px ", overflowY: "hidden" }}
    >
      <div>
        <Tooltip title={t("send")}>
          <Fab
            variant="contained"
            color="secondary"
            className={`${classes.sign_btn}`}
            // onClick={handleRedirectToHrm}
            onClick={() => setopenForward(true)}
          >
            <SendIcon style={{ fontSize: "1rem" }} />
          </Fab>
        </Tooltip>

        <Tooltip title={t("back")} aria-label="BACK">
          <Fab
            variant="contained"
            className={classes.back_btn}
            color="primary"
            onClick={() => history.push({ pathname: "/eoffice/rti/file" })}
          >
            <ArrowBackIcon style={{ fontSize: "1rem" }} />
          </Fab>
        </Tooltip>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={8}>
            <Breadcrumb
              routeSegments={[
                { name: "Rti File", path: "/eoffice/rti/file" },
                { name: "Split View", path: "/eoffice/rti/splitView/file" },
              ]}
              otherData={[
                { key: "Subject", value: title },
                { key: "Ref no", value: referenceNumber },
                { key: "Priority", value: priority },
              ]}
            />
          </Grid>
          <Grid item xs={4}></Grid>
        </Grid>
      </div>
      <Grid container justifyContent="center" spacing={1}>
        <Grid item xs={6} style={{ display: "flex", alignItems: "center" }}>
          {/* {blnVisible ? ( */}
          <FormControl
            variant="outlined"
            size="small"
            className={classes.formControl}
          >
            <TextField
              select
              label={t("noting")}
              value={NOF.filename}
              size="small"
              fullWidth
              onChange={handleChange}
              variant="outlined"
              className={classes.formControl}
            >
              {notingData.map((item, index) => (
                <MenuItem key={index} value={item}>
                  {item.filename}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          {/* // ) : null} */}
          <Tooltip title={t("sign")} aria-label="Sign">
            <Button
              id="partcase_create_btn"
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={() => {
                setSfdtData(prevNFurl);
                setFlag("noting");
                setOpen(true);
              }}
            // disabled={notingSigned || !openInPdf}
            >
              <CreateIcon style={{ fontSize: "1rem" }} />
            </Button>
          </Tooltip>
          <Tooltip title={t("add_noting")} aria-label="Add Noting">
            <Button
              id="partcase_add_btn"
              // style={{ marginBottom: "15px" }}
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={blnDisableForward}
              onClick={handleAddNoting}
            >
              <NoteAddIcon style={{ fontSize: "1rem" }} />
            </Button>
          </Tooltip>
          <Tooltip title={t("Undo")} aria-label="Undo">
            <Button
              id="partCase_undo_btn"
              // style={{ marginBottom: "15px" }}
              variant="contained"
              color="primary"
              className={classes.button}
              // onClick={handleDocumentRollback}
              disabled={!notingSigned || !openInPdf}
            >
              <RestorePageIcon style={{ fontSize: "1rem" }} />
            </Button>
          </Tooltip>
        </Grid>

        <Grid item xs={6} style={{ display: "flex", alignItems: "center" }}>
          <FormControl
            variant="outlined"
            size="small"
            className={classes.formControl}
          >
            <TextField
              select
              label={t("enclosure")}
              value={NOF1.filename}
              size="small"
              fullWidth
              onChange={handleChange1}
              variant="outlined"
              className={classes.formControl}
            >
              {enclosureArr.map((item, index) => (
                <MenuItem key={index} value={item}>
                  {item.filename}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>

          <Tooltip title={t("sign")} aria-label="Sign">
            <Button
              id="partcase_signBtn"
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={() => {
                // setFlagNumber(prevFlagNumberEnclouser);
                setSfdtData(prevEnclouser);
                setFlag("Enclouser");
                setOpen(true);
                loadEnclosureList();
              }}
              disabled={enclosureSigned}
            >
              <CreateIcon style={{ fontSize: "1rem" }} />
            </Button>
          </Tooltip>

          <Tooltip title={t("upload_file")} aria-label="Upload File">
            <div className={classes.uploadButton}>
              <RtiUploader
                rtiID={FileID}
                loadEnclosureList={loadEnclosureList}
              />
            </div>
          </Tooltip>

          <Tooltip title={t("remove_sign")} aria-label="Remove sign">
            <Button
              id="partcase_restorePage"
              variant="contained"
              color="primary"
              className={classes.button}
              // onClick={handleDocumentRollbackEnclosure}
              disabled={!enclosureSigned}
            >
              <RestorePageIcon style={{ fontSize: "1rem" }} />
            </Button>
          </Tooltip>

          <Tooltip
            title={t("Previous Enclosure")}
            aria-label="Previous Enclosure"
          >
            <Button
              id="RTI_partcase_previous_btn"
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handleChangePreviousEnclosure}
            >
              <SkipPreviousIcon style={{ fontSize: "1rem" }} />
            </Button>
          </Tooltip>
          <Tooltip title={t("Next Enclosure")} aria-label="Next">
            <Button
              id="RTI_partcase_next_btn"
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handleChangeNextEnclosure}
            >
              <SkipNextIcon style={{ fontSize: "1rem" }} />
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <div className="customDiv">
            {notingURL && (
              <HeadersAndFootersView
                fileId={rowID}
                filepath={sfdtData}
                blnIsPartCase={true}
              // blnShowQuickSign={!blnBtnDisable}
              />
            )}
          </div>
        </Grid>
        <Grid item xs={6}>
          <PdfViewer
            fileId={enclosureId}
            filepath={enclosureURL}
            anottId={annotationId}
          // pdfLoads={handlereturn}
          />
        </Grid>
      </Grid>
      <Dialog
        open={openForward}
        aria-labelledby="draggable-dialog-title"
        maxWidth="sm"
        PaperComponent={PaperComponent}
        fullWidth
      >
        <Paper>
          <DialogTitle
            style={{ padding: "0px 24px !important", cursor: "move" }}
            id="draggable-dialog-title"
          >
            Forward To Department(s)
            <IconButton
              id="RTI_foward_dept_close"
              aria-label="close"
              onClick={() => setopenForward(false)}
              color="primary"
              style={{ float: "right" }}
              className="cancel-drag"
            >
              <Icon>close</Icon>
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <ForwardForm rtiID={FileID} enclosureData={enclosureData} />
          </DialogContent>
        </Paper>
      </Dialog>
      <Dialog
        open={open}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          onClose={() => setOpen(false)}
        >
          {t("remark_&_sign")}
          <IconButton
            id="RTI_foward_dept_close_btn"
            aria-label="close"
            onClick={() => setOpen(false)}
            color="primary"
            style={{ float: "right", position: "relative", top: "-6px" }}
            className="cancel-drag"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <InputForm
            flag={flag}
            callBackURL={handleReturnedURL}
            isSignedCompleted={handleSignedCompleted}
            fileId={rowID}
            SignURL={sfdtData}
            flagNum={flagNumber}
            handleReload={handleReload}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
  };
}

export default connect(mapStateToProps, {
  getPartcaseNoting,
  getPartcaseEnclosures,
  saveRtiFile,
  loadPartCaseData,
})(SplitView);
