import React, { useState, useRef } from "react";
import FileUpload from "./fileUpload/file-upload.component";
import { connect, useDispatch } from "react-redux";
import { uploadEnclosure } from "../../../camunda_redux/redux/action";
import { setSnackbar } from "../../../camunda_redux/redux/ducks/snackbar";
import { useTranslation } from "react-i18next";
import UploadLoading from "app/views/utilities/UploadLoading";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  TextField,
} from "@material-ui/core";
import Draggable from "react-draggable";
import SaveIcon from "@material-ui/icons/Save";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
}

function FileUploader(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const role = sessionStorage.getItem("role");

  const [newUserInfo, setNewUserInfo] = useState({
    attachedAnnexures: [],
  });
  const grp = sessionStorage.getItem("department");
  const partcaseID = sessionStorage.getItem("partcaseID");
  const [blnFlag, setBlnFlag] = useState(false);
  const [singleProgress, setSingleProgress] = useState(0);
  const [blnProgressBar, setblnProgressBar] = useState(false);
  const [totalFileSelected, setTotalFileSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [currentEnclosure, setCurrentEnclosure] = useState(0);
  const [subject, setSubject] = useState("");

  const handleClose = () => {
    setCurrentEnclosure(0);
    setOpen(false);
    setFiles([]);
    setFile(null);
    setSubject("");
    setBlnFlag(true);
  };

  const updateUploadedFiles = (files) => {
    setNewUserInfo({ ...newUserInfo, attachedAnnexures: files });
    handleSubmit(files);
  };

  const config = {
    onUploadProgress: (progressEvent) => {
      setSingleProgress(0);
      setblnProgressBar(true);
      const { loaded, total } = progressEvent;
      const percentage = Math.floor((loaded / total) * 100);
      setSingleProgress(percentage - 1);
    },
  };

  const handleSubmit = (event) => {
    let fileData = event;
    setFiles(fileData);
    setFile(fileData[0]);
    setSubject(fileData[0].name);
    setOpen(true);
  };

  const callMessageOut = (message) => {
    setblnProgressBar(false);
    dispatch(setSnackbar(true, "error", message));
  };

  const blnClearFileList = () => {
    if (blnFlag === true) {
      setBlnFlag(false);
      return true;
    }
    return false;
  };

  const handleNextEnclosure = () => {
    currentEnclosure + 1 !== files.length &&
      setCurrentEnclosure(currentEnclosure + 1);
    setFile(files[currentEnclosure + 1]);
    let value = currentEnclosure + 1 === files.length ? true : false;
    handleUploadEnclosure(subject, value);
    !value && setSubject(files[currentEnclosure + 1].name);
  };

  const handleUplaodAll = () => {
    let tempArr = [];
    for (let i = currentEnclosure; i < files.length; i++) {
      tempArr.push(files[i]);
    }
    handleUploadEnclosure("", true, tempArr);
  };

  const handleUploadEnclosure = (enclosureSubject, value, tempArr) => {
    let data = enclosureSubject ? [file] : tempArr;
    let formData = new FormData();
    for (var x = 0; x < data.length; x++) {
      formData.append("file", data[x]);
    }
    setTotalFileSelected(data.length);
    return props
      .uploadEnclosure(
        partcaseID,
        formData,
        config,
        grp,
        enclosureSubject,
        role
      )
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          } else {
            props.handleAddEnclosure(resp.addedEnclosure);
            setblnProgressBar(false);
            setBlnFlag(true);
            dispatch(
              setSnackbar(true, "success", t("enclousre_has_been_inserted"))
            );
            if (value) {
              handleClose();
            }
          }
        } catch (e) {
          callMessageOut(e.message);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
      });
  };

  return (
    <div>
      {blnProgressBar && (
        <div className="fileUploder">
          <UploadLoading />
        </div>
      )}
      <form>
        <FileUpload
          accept="application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,
                    application/vnd.openxmlformats-officedocument.presentationml.presentation,image/png,image/jpeg,
                    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          label="Attachment(s)"
          multiple
          totalFileSelected={totalFileSelected}
          blnProgressBar={blnProgressBar}
          updateFilesCb={updateUploadedFiles}
          blnFlag={blnFlag}
          setBlnFlag={(val) => setBlnFlag(val)}
          upload={props.upload}
        />
      </form>
      <Dialog
        open={open}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          {t("add_enclosure_subject")}
          <IconButton
            id="enclosure_subject_close_button"
            aria-label="close"
            onClick={handleClose}
            color="primary"
            className="cancel-drag"
          >
            <CloseIcon style={{ color: props.theme ? "#fff" : "#000" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid>
            <span
              style={{
                float: "right",
                border: "1px solid #ddd",
                padding: "1px 8px",
                borderRadius: "5px",
              }}
            >
              {currentEnclosure + 1}/{files.length}
            </span>
          </Grid>
          <Grid>
            <TextField
              label={t("enter_a_subject")}
              variant="outlined"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
              size="small"
              style={{ margin: "1rem 0" }}
              className={props.theme ? "darkTextField" : ""}
            />
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            id="enclosure_save_button"
            variant="contained"
            color="primary"
            endIcon={<SaveIcon />}
            onClick={handleUplaodAll}
          >
            {t("save_all")}
          </Button>
          <Button
            id="enclosure_done_skip_button"
            variant="contained"
            color="secondary"
            endIcon={
              currentEnclosure + 1 === files.length ? (
                <DoneIcon />
              ) : (
                <SkipNextIcon />
              )
            }
            onClick={handleNextEnclosure}
            disabled={subject === "" ? true : false}
          >
            {currentEnclosure + 1 === files.length ? t("save") : t("next")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function mapStateToProps(state) {
  return { props: state.props, theme: state.theme };
}

export default connect(mapStateToProps, { uploadEnclosure })(FileUploader);
