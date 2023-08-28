import { Button } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { FormField } from "./file-upload.styles";
import CropFreeIcon from "@material-ui/icons/CropFree";


const KILO_BYTES_PER_BYTE = 10000000000000000;
const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 100000000000000000;

const convertNestedObjectToArray = (nestedObj) =>
  Object.keys(nestedObj).map((key) => nestedObj[key]);

const convertBytesToKB = (bytes) => Math.round(bytes / KILO_BYTES_PER_BYTE);

const ScanDocuments = ({
  label,
  updateFilesCb,
  totalFileSelected,
  blnProgressBar,
  maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES,
  ...otherProps
}) => {
  const fileInputField = useRef(null);
  const [files, setFiles] = useState({});

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
    clearFileList()
    const { files: newFiles } = e.target;
    if (newFiles.length) {
      let updatedFiles = addNewFiles(newFiles);
      setFiles(updatedFiles);
      callUpdateFilesCb(updatedFiles);
    }
  };

  return (
    <>
      <Button
        id="inboxUpload_button"
        onClick={handleUploadBtnClick}
        color="primary"
        variant="contained"
        style={{ minWidth: "16px", padding: "10px 12px" }}
      >
        <CropFreeIcon style={{fontSize:"1rem"}} />
      </Button>
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

export default ScanDocuments;
