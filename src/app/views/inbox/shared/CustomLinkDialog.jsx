import {
  Button,
  DialogActions,
  DialogContent,
  MenuItem,
  TextField,
} from "@material-ui/core";
import { Close, Done } from "@material-ui/icons";
import Axios from "axios";
import React from "react";
import { useState } from "react";
import { connect, useDispatch } from "react-redux";
import SplitViewPdfViewer from "./pdfViewer/pdfViewer";
import { saveExternalAnnotation } from "../../../camunda_redux/redux/action";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { useTranslation } from "react-i18next";

const CustomLinkDialog = (props) => {
  const { t } = useTranslation();
  const [url, setURL] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [extension, setExtension] = useState("");
  const [getSfdt, setGetSfdt] = useState(false);
  const [pdfLoads, setpdfLoads] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setURL(e.target.value);
    let data = JSON.parse(e.target.value);
    let ext = data.fileName.split(".")[1];
    setFileUrl(data.url);
    setExtension(ext);
  };

  const handleChangePage = (value) => {
    setPageNumber(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGetSfdt(true);
  };

  const handleSfdt = (sfdt) => {
    let data = JSON.parse(url);
    props
      .saveExternalAnnotation({ sfdt })
      .then((res) => {
        let tempObj = { ...data, pageNumber, id: res.annotationId };

        props.addHyperLink(JSON.stringify(tempObj));
      })
      .catch((err) => {
        dispatch(setSnackbar(true, "error", err.message));
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent dividers style={{ overflow: "hidden" }}>
        <TextField
          select
          label="Address"
          size="small"
          fullWidth
          variant="outlined"
          onChange={handleChange}
        >
          {props.enclosureData.map((item, index) => (
            <MenuItem
              key={index}
              value={JSON.stringify({
                flagNumber: item.flagNumber,
                url: item.fileUrl,
                fileName: item.fileName,
              })}
            >
              {item.fileName}
            </MenuItem>
          ))}
        </TextField>

        {fileUrl && (
          <div
            style={{
              height: "55vh",
              border: "1px solid #ddd",
              marginTop: ".6rem",
            }}
            className="ss-privacy-hide"
          >
            <SplitViewPdfViewer
              fileUrl={fileUrl}
              isPage={true}
              handleChangePage={handleChangePage}
              pageNumber={pageNumber}
              extension={extension}
              handleSfdt={handleSfdt}
              getSfdt={getSfdt}
              pdfLoads={(val) => {
                setpdfLoads(val);
              }}
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          id="inbox_customlinkDialog_cancel_button"
          color="primary"
          variant="contained"
          endIcon={<Close />}
          onClick={props.handleClose}
        >
          {t("cancel")}
        </Button>
        <Button
          id="inbox_customlinkDialog_submit_button"
          color="secondary"
          variant="contained"
          endIcon={<Done />}
          type="submit"
        >
          {t("save")}
        </Button>
      </DialogActions>
    </form>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
  };
}

export default connect(mapStateToProps, {
  saveExternalAnnotation,
})(React.memo(CustomLinkDialog));
