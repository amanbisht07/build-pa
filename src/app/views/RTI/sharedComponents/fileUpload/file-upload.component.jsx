import React, { useEffect, useRef, useState } from "react";
import { FormField } from "./file-upload.styles";
import { Button } from "@material-ui/core";
import PublishIcon from "@material-ui/icons/Publish";

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
            "application/msword" )
      ) {
        if (!otherProps.multiple) {
          return { file };
        }
        files[file.name] = file;
      } else {
        alert(
          "Please Select Valid File Type:{DOCX,DOC,PDF}"
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

  const removeFile = (fileName) => {
    delete files[fileName];
    setFiles({ ...files });
    callUpdateFilesCb({ ...files });
  };

  return (
    <>
      <Button
        id="RTI_publish_btn"
        onClick={handleUploadBtnClick}
        color="primary"
        variant="contained"
        style={{ minWidth: "16px", padding: "10px 12px" }}
      >
        <PublishIcon style={{ fontSize: "1rem" }} />
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

export default FileUpload;
