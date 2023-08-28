import React, { useState, useRef } from "react";
import FileUpload from "./fileUpload/file-upload.component";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { connect, useDispatch } from "react-redux";
import { uploadRti } from "app/camunda_redux/redux/action/index";
import UploadLoading from "app/views/utilities/UploadLoading";
import "../../Personnel/therme-source/material-ui/loading";

function RtiUploader(props) {
  const dispatch = useDispatch();

  const [newUserInfo, setNewUserInfo] = useState({
    attachedAnnexures: [],
  });
  const role = sessionStorage.getItem("role");
  const username = sessionStorage.getItem("username");
  const [blnFlag, setBlnFlag] = useState(false);
  const { rtiID, loadRtiData, deptName } = props;
  const [singleProgress, setSingleProgress] = useState(0);
  const [blnProgressBar, setblnProgressBar] = useState(false);
  const [totalFileSelected, setTotalFileSelected] = useState(0);

  const updateUploadedFiles = (files) => {
    setNewUserInfo({ ...newUserInfo, attachedAnnexures: files });
    handleSubmit(files);
  };

  const onUploadProgress = {
    onUploadProgress: (progressEvent) => {
      setSingleProgress(0);
      setblnProgressBar(true);
      const { loaded, total } = progressEvent;
      const percentage = Math.floor((loaded / total) * 100);
      setSingleProgress(percentage);
    },
  };

  const handleSubmit = (event) => {
    // event.preventDefault();
    let formData = new FormData();
    let fileData = event;
    for (var x = 0; x < fileData.length; x++) {
      formData.append("files", fileData[x]);
    }
    setTotalFileSelected(fileData.length);
    return props
      .uploadRti(rtiID, formData, onUploadProgress, deptName)
      .then((resp) => {
        try {
          if (resp.status === 200) {
            setblnProgressBar(false);
            setBlnFlag(true);
            blnClearFileList();
            dispatch(
              setSnackbar(
                true,
                "success",
                "Enclosure's has been uploaded successfully!"
              )
            );

            loadRtiData();
            let trigger = false;
            setTimeout(() => {
              trigger = true;
            }, 5000);
          } else {
            setblnProgressBar(false);
            setBlnFlag(true);
            blnClearFileList();
            dispatch(
              setSnackbar(
                true,
                "error",
                "Enclosure didn't upload, please try again !"
              )
            );
            let trigger = false;
            setTimeout(() => {
              trigger = true;
            }, 5000);
          }
        } catch (e) {
          callMessageOut(e.message);
        }
      });
  };

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const blnClearFileList = () => {
    if (blnFlag === true) {
      setBlnFlag(false);
      return true;
    }
    return false;
  };
  return (
    <div>
      {blnProgressBar && <UploadLoading />}
      <form>
        <FileUpload
          accept="application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
          label="Attachment(s)"
          multiple
          totalFileSelected={totalFileSelected}
          blnProgressBar={blnProgressBar}
          updateFilesCb={updateUploadedFiles}
          blnClearFlag={blnClearFileList}
        />
      </form>
    </div>
  );
}
function mapStateToProps(state) {
  return { props: state.props };
}

export default connect(mapStateToProps, { uploadRti })(RtiUploader);
