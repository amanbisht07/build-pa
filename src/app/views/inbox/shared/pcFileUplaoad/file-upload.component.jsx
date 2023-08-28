import { Button, Fab, Tooltip } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { FormField, UploadFileBtn } from "./file-upload.styles";
import PublishIcon from "@material-ui/icons/Publish";
import { useTranslation } from "react-i18next";

const KILO_BYTES_PER_BYTE = 10000000000000000;
const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 100000000000000000;

const convertNestedObjectToArray = (nestedObj) =>
  Object.keys(nestedObj).map((key) => nestedObj[key]);

const convertBytesToKB = (bytes) => Math.round(bytes / KILO_BYTES_PER_BYTE);

const FileUpload = ({
  label,
  updateFilesCb,
  totalFileSelected,
  blnProgressBar,
  maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES,
  ...otherProps
}) => {
  const fileInputField = useRef(null);
  const [files, setFiles] = useState({});
  const { t } = useTranslation()

  const handleUploadBtnClick = () => {
    fileInputField.current.click();
  };

  const addNewFiles = (newFiles) => {
    for (let file of newFiles) {
      if (
        file.size <= maxFileSizeInBytes &&
        (file.type === "application/pdf" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.type === "application/msword" ||
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.presentationml.presentation")
      ) {
        if (!otherProps.multiple) {
          return { file };
        }
        files[file.name] = file;
      } else {
        alert(
          "Please Select Valid File Type:{DOCX,PPTX,PPT,XLSX,XLS,PDF,JPEG,PNG,JPG}"
        );
      }
    }
    return { ...files };
  };
  useEffect(() => {
    let blnFlag = otherProps.blnClearFlag();

    if (blnFlag === true) {
      clearFileList();
      blnFlag = false;
    }
  }, [otherProps.blnClearFlag()]);

  const clearFileList = () => {
    setFiles({});
  };

  const callUpdateFilesCb = (files) => {
    const filesAsArray = convertNestedObjectToArray(files);
    updateFilesCb(filesAsArray);
  };

  const handleNewFileUpload = (e) => {
    const { files: newFiles } = e.target;
    if (newFiles.length) {
      let updatedFiles = addNewFiles(newFiles);
      setFiles(updatedFiles);
      callUpdateFilesCb(updatedFiles);
    }
  };

  return (
    <>
      {/* <UploadFileBtn type="button" onClick={handleUploadBtnClick}>
        <i className="fas fa-file-upload" />
      </UploadFileBtn> */}

      <Tooltip title={t("upload")}>
        <Fab
          color="primary"
          style={{
            zIndex: "10",
            maxHeight: "50px",
            minHeight: "50px",
            minWidth: "50px",
            maxWidth: "50px",
            marginBottom: ".7rem"
          }}
          onClick={handleUploadBtnClick}
        >
          <PublishIcon style={{ fontSize: "1rem" }} />
        </Fab>
      </Tooltip>
      <FormField
        type="file"
        ref={fileInputField}
        onChange={handleNewFileUpload}
        title=""
        value=""
        {...otherProps}
      />
    </>
  );
};

export default FileUpload;
