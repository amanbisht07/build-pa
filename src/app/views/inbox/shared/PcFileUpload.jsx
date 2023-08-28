import React, { useState, useRef } from "react";
import FileUpload from "./pcFileUplaoad/file-upload.component";
import { connect, useDispatch } from "react-redux";
import { uploadPcAnnexure } from "../../../camunda_redux/redux/action";
import { setSnackbar } from "../../../camunda_redux/redux/ducks/snackbar";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import UploadLoading from "app/views/utilities/UploadLoading";

function PcFileUploader(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [newUserInfo, setNewUserInfo] = useState({
    attachedAnnexures: [],
  });
  const grp = sessionStorage.getItem("department");
  const role = sessionStorage.getItem("role");
  let referenceNumber = Cookies.get("referenceNumber");
  const partcaseID = sessionStorage.getItem("partcaseID");
  const [blnFlag, setBlnFlag] = useState(false);
  const [singleProgress, setSingleProgress] = useState(0);
  const [blnProgressBar, setblnProgressBar] = useState(false);
  const [totalFileSelected, setTotalFileSelected] = useState(0);

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
    let formData = new FormData();
    let fileData = event;
    for (var x = 0; x < fileData.length; x++) {
      formData.append("file", fileData[x]);
    }
    setTotalFileSelected(fileData.length);
    return props
      .uploadPcAnnexure(
        props.serviceLetterId,
        formData,
        role,
        grp,
        referenceNumber,
        config
      )
      .then((resp) => {
        try {
          if(resp.error){
            callMessageOut(resp.error)
          }else{
            props.loadServiceLetter();
            setblnProgressBar(false);
          }
        } catch (e) {
          callMessageOut(e.message);
          setblnProgressBar(false);
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
          blnClearFlag={blnClearFileList}
        />
      </form>
    </div>
  );
}

function mapStateToProps(state) {
  return { props: state.props };
}

export default connect(mapStateToProps, { uploadPcAnnexure })(PcFileUploader);
