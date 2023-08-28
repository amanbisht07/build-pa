import React, { useEffect, useRef, useState } from "react";
import {
  FileUploadContainer,
  FormField,
  DragDropText,
  UploadFileBtn,
  FilePreviewContainer,
  ImagePreview,
  PreviewContainer,
  PreviewList,
  FileMetaData,
  RemoveFileIcon,
  InputLabel,
} from "./file-upload.styles";

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
  correspondence,
  references,
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
    let blnFlag = otherProps?.blnFlag;

    if (blnFlag === true) {
      clearFileList();
      otherProps?.setBlnFlag(false)
    }
  }, [otherProps?.blnFlag]);

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
      <FileUploadContainer>
        {/* <InputLabel>{label}</InputLabel> */}
        {/* <DragDropText>Drag and drop your files anywhere or</DragDropText> */}
        <UploadFileBtn
          id="file_uploadBtn"
          type="button"
          onClick={handleUploadBtnClick}
        >
          <i className="fas fa-file-upload" />
          <span>
            {" "}
            {correspondence && references
              ? `Upload ${otherProps.multiple ? "References" : "An Reference"}`
              : `Upload ${otherProps.multiple ? "Annexures" : "An Annexure"}`}
          </span>
        </UploadFileBtn>
        <FormField
          type="file"
          ref={fileInputField}
          onChange={handleNewFileUpload}
          title=""
          value=""
          {...otherProps}
        />
      </FileUploadContainer>
      <FilePreviewContainer>
        {/* <span>Total File Selected {blnProgressBar ? totalFileSelected : 0}</span> */}
        {/* <PreviewList>
                    {Object.keys(files).map((fileName, index) => {
                        let file = files[fileName];
                        let isImageFile = file.type.split("/")[0] === "image";
                        return (
                            <PreviewContainer key={fileName}>
                                <div>
                                    {isImageFile && (
                                        <ImagePreview
                                            src={URL.createObjectURL(file)}
                                            alt={`file preview ${index}`}
                                        />
                                    )}
                                    <FileMetaData isImageFile={isImageFile}>
                                        <span>{file.name}</span>
                                        <aside>
                                            <span>{convertBytesToKB(file.size)} kb</span>
                                            <RemoveFileIcon
                                                className="fas fa-trash-alt"
                                                onClick={() => removeFile(fileName)}
                                            />
                                        </aside>
                                    </FileMetaData>
                                </div>
                            </PreviewContainer>
                        );
                    })}
                </PreviewList> */}
      </FilePreviewContainer>
    </>
  );
};

export default FileUpload;
