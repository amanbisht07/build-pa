import React, { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import {
  ColumnDirective,
  ColumnsDirective,
  Filter,
  GridComponent,
  Inject,
  Page,
  Resize,
  Sort,
} from "@syncfusion/ej2-react-grids";

import {
  GetAttachDocument,
  getMeetingMemo,
} from "app/redux/actions/CreateMeetingAction";
import {
  Button,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Grid,
  Link,
  Fab,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import history from "history.js";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import "../index.css";

import {
  getAllAttendees,
  InitiatorGetAllDecision,
  InitiatorPostTask,
  postMeetingMemo,
} from "app/redux/actions/CreateMeetingAction";
import { PostAttachDocument } from "app/redux/actions/addAgendaAction";

import Cookies from "js-cookie";
import GetAppIcon from "@material-ui/icons/GetApp";

function MeetingMom({ MeetingIds }) {
  const { t } = useTranslation();

  const [attach, setAttach] = React.useState(false);

  const [file, setFile] = useState(null);

  // --------------------open----------------------

  const handleClickAttachOpen = () => {
    setAttach(true);
  };

  const handleCloseAttach = () => {
    setAttach(false);
  };

  const fileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const attachDocument = (e) => {
    e.preventDefault()
    const fd = new FormData();
    fd.append("file", file);
    dispatch(PostAttachDocument(MeetingIds, "", fd));
    handleCloseAttach();
  };

  // --------------------------------end------------------------

  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const momDownloadFile = (e, row) => {
    e.stopPropagation(); // don't select this row after clicking
    const anchor = document.createElement("a");
    anchor.href = row.url;
    anchor.download = row.displayPfileName;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const attachmentDownloadFile = (e, row) => {
    e.stopPropagation(); // don't select this row after clicking
    const anchor = document.createElement("a");
    anchor.href = row.fileUrl;
    anchor.download = row.displayPfileName;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const momButtonTheme = (args) => {
    return (
      <>
        <IconButton id="momDownloadFile" aria-label="userHistory" size="small">
          <Tooltip title={"Download"} aria-label="Download">
            <GetAppIcon
              color="primary"
              onClick={(e) => momDownloadFile(e, args)}
            />
          </Tooltip>
        </IconButton>
      </>
    );
  };

  const attacgmentButtonTheme = (args) => {
    return (
      <>
        <IconButton id="momDownload_btn" aria-label="userHistory" size="small">
          <Tooltip title={"Download"} aria-label="Download">
            <GetAppIcon
              color="primary"
              onClick={(e) => attachmentDownloadFile(e, args)}
            />
          </Tooltip>
        </IconButton>
      </>
    );
  };

  useEffect(() => {
    dispatch(getMeetingMemo(MeetingIds));
  }, []);

  const memoMeeting = useSelector(
    (state) => state.MeetingMemo.meetingMemo.data
  );
  console.log(memoMeeting);

  useEffect(() => {
    dispatch(GetAttachDocument(MeetingIds));
  }, []);

  const attachDocuments = useSelector(
    (state) => state.InitiatorPostAttachDocument.documents.data
  );
 
  const CustomToolbarMarkup = () => (
    <div
      style={{
        height: "4rem",
        display: "flex",
        alignItems: "center",
        borderBottom: `1px solid  "#d9d9d9"}`,
      }}
    >
      <Typography
        variant="button"
        align="center"
        color="primary"
        style={{
          fontSize: "medium",
          fontFamily: "inherit !important",
          marginLeft: "15px",
        }}
      >
        {"Meeting Memo"}
      </Typography>
    </div>
  );

  const AttachmentCustomToolbarMarkup = () => (
    <div
      style={{
        height: "4rem",
        display: "flex",
        alignItems: "center",
        borderBottom: `1px solid  "#d9d9d9"}`,
      }}
    >
      <Typography
        variant="button"
        align="center"
        color="primary"
        style={{
          fontSize: "medium",
          fontFamily: "inherit !important",
          marginLeft: "15px",
        }}
      >
        {"Meeting Attachment"}
      </Typography>
      {/* <Tooltip title={" Add Attachments"}>
        <Fab
          style={{
            position: "absolute",

            right: "2rem",
            width: "2.2rem",
            height: ".1rem",
            backgroundColor: "rgb(230, 81, 71)",
          }}
          onClick={handleClickAttachOpen}
        >
          <AddIcon style={{ fontSize: "19", color: "#fff" }} />
        </Fab>
      </Tooltip> */}
    </div>
  );

  const AttachmentTable = useCallback(() => {
    return (
      <>
        <GridComponent
          dataSource={attachDocuments}
          height={Number(window.innerHeight - 450)}
          allowResizing={true}
          allowSorting={true}
          allowPaging={true}
          pageSettings={{ pageCount: 5, pageSizes: true }}
          filterSettings={{ type: "Menu" }}
        >
          <ColumnsDirective>
            <ColumnDirective
              field="fileTitle"
              headerText={"SUBJECT"}
              width="90"
              textAlign="left"
            />

            <ColumnDirective
              field="iconBtn"
              headerText={"DOWNLOAD"}
              width="60"
              template={attacgmentButtonTheme}
              allowFiltering={false}
              allowSorting={false}
            />
          </ColumnsDirective>
          <Inject services={[Resize, Page, Sort, Filter]} />
        </GridComponent>
      </>
    );
  }, [attachDocuments]);

  const RenderTable = useCallback(() => {
    return (
      <>
        <GridComponent
          dataSource={memoMeeting}
          height={Number(window.innerHeight - 450)}
          allowResizing={true}
          allowSorting={true}
          allowPaging={true}
          pageSettings={{ pageCount: 5, pageSizes: true }}
          filterSettings={{ type: "Menu" }}
        >
          <ColumnsDirective>
            <ColumnDirective
              field="momTitle"
              headerText={"SUBJECT"}
              width="90"
              textAlign="left"
            />

            <ColumnDirective
              field="iconBtn"
              headerText={"DOWNLOAD"}
              width="60"
              template={momButtonTheme}
              allowFiltering={false}
              allowSorting={false}
            />
          </ColumnsDirective>
          <Inject services={[Resize, Page, Sort, Filter]} />
        </GridComponent>
      </>
    );
  }, [memoMeeting]);

  return (
    <div className="cabinate_container">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper style={{ borderRadius: "16px" }}>
            <CustomToolbarMarkup />
            <RenderTable />
          </Paper>

          {/* <div>
            <Button
              variant="contained"
              disabled
              style={{ marginTop: "20px", float: "right", marginLeft: "15px" }}
            >
              WorkFlows
              <CloudSyncIcon style={{ marginLeft: "15px" }} />
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "20px", float: "right", marginLeft: "15px" }}
            >
              Email MOM <EmailIcon style={{ marginLeft: "15px" }} />
            </Button>
            <Button
              variant="contained"
              color="secondary"
              style={{ marginTop: "20px", float: "right", marginLeft: "15px" }}
            >
              Download
              <CloudDownloadIcon style={{ marginLeft: "15px" }} />
            </Button>

            <Button
              variant="contained"
              style={{
                marginTop: "20px",
                float: "right",
                marginLeft: "15px",
                border: "1px solid red",
                color: "white",
                backgroundColor: "red",
              }}
            >
              Delete
              <DeleteIcon style={{ marginLeft: "15px" }} />
            </Button>

            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "20px", float: "right", marginLeft: "15px" }}
            >
              Generate
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "20px", float: "right", marginLeft: "15px" }}
            >
              Add
              <AddCircleIcon style={{ marginLeft: "15px" }} />
            </Button>
          </div> */}
        </Grid>
        <Grid item xs={12}>
          <Paper style={{ borderRadius: "16px" }}>
            <AttachmentCustomToolbarMarkup />
            <AttachmentTable />
          </Paper>
         
          <Dialog open={attach}>
            <DialogTitle>
              {t("ADD ATTACHMENTS")}
              <IconButton
                id="mom_add_attachments"
                aria-label={"close"}
                onClick={handleCloseAttach}
                style={{
                  float: "right",
                  height: "30px",
                  width: "30px",
                  color: "#3131d5",
                }}
              >
                <Tooltip title={t("close")} aria-label="close">
                  <CloseIcon color="primary" />
                </Tooltip>
              </IconButton>
            </DialogTitle>
            <DialogContent style={{ width: "400px" }}>
              
                <form onSubmit={attachDocument}>
                  <TextField
                    type="file"
                    fullWidth
                    size="small"
                    className="e-field e-input"
                    variant="outlined"
                    name="file"
                    onChange={fileChange}
                  />
                 
                 <DialogActions style={{ float: "left" }}>
              <Button
                id="mom_finish_task"
                variant="outlined"
                color="primary"
                type="submit"
              
              >
                {t("Finish")}
              </Button>
            </DialogActions>
                </form>
             
            </DialogContent>
         
          </Dialog>
          {/* -------------------------------------------------close----------------------------------- */}
        </Grid>
      </Grid>
    </div>
  );
}

export default MeetingMom;
