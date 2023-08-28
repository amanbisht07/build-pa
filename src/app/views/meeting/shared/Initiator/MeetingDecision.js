import React, { useContext, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PostAttachDocument } from "app/redux/actions/addAgendaAction";
import { useTranslation } from "react-i18next";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import AttachFileIcon from "@material-ui/icons/AttachFile";

import DoneIcon from "@material-ui/icons/Done";
import AddIcon from "@material-ui/icons/Add";

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
  getAllAttendees,
  InitiatorGetAllDecision,
  InitiatorPostTask,
  postMeetingMemo,
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
  Checkbox,
} from "@material-ui/core";
import history from "history.js";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import CloseIcon from "@material-ui/icons/Close";
import Cookies from "js-cookie";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { useFormik } from "formik";
import * as yup from "yup";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


function MeetingDecision({ MeetingIds }) {
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const [first, setfirst] = useState(false);
  const [open, setOpen] = useState(false);
  const [momDialoge, setMomDialoge] = useState(false);
  const [attach, setAttach] = useState(false);
  const [file, setFile] = useState(null);
  const [decisions, setDecisions] = useState([]);
  const [decisionId, setDecisionId] = useState("");

  const validationSchema = yup.object({
    subject: yup
      .string()

      .required("Subject Is Required"),
    refrence: yup
      .string()

      .required("Reference Is Required"),
    new: yup
      .string()

      .required("This Is Required"),

    onBehalfOf: yup
      .string()

      .required("This Is Required"),

    description: yup
      .string()

      .required("Descripition Is Required"),
    internalUser: yup
      .string()

      .required("Internal User is Required"),
    externalUser: yup
      .string()

      .required("ExternalUser User is Required"),

    dueDate: yup
      .string()

      .required("Due Date Is Required"),
  });

  const formik = useFormik({
    initialValues: {
      externalUser: "",
      internalUser: "",
      description: "",
      subject: "",
      refrence: "",
      new: "",
      onBehalfOf: "",
      dueDate: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      ActionPoint(values);
    },
  });

  const ActionPoint = (values) => {
    dispatch(InitiatorPostTask(decisionId, values));
    handleClose();
    setfirst(true)
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const m = () => {
    setMomDialoge(true);
  };

  const momDialogeClose = () => {
    setMomDialoge(false);
  };

  const handleClickAttachOpen = () => {
    setAttach(true);
  };

  const handleCloseAttach = () => {
    setAttach(false);
  };

  useEffect(() => dispatch(InitiatorGetAllDecision(MeetingIds)), []);

  const meetingDecision = useSelector(
    (state) => state.DecisionMeeting.MeetingDecision.decision
  );

  const handleSelect = (args) => {
    setDecisionId(args.data.id);
    if (args.isHeaderCheckboxClicked) {
      formik.setFieldValue("decisions", args.data.decision);
    } else {
      formik.setFieldValue("decisions", args.data.decision);
    }
  };

  const handlDeselect = (args) => {
    if (args.isHeaderCheckboxClicked) {
    } else {
      let tmpArr = decisions.filter((item) => item.id !== args.data.id);
    }
  };

  const Decision = useSelector(
    (state) => state.DecisionMeeting.MeetingDecision.decision
  );
  console.log(Decision);

  const fileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const attachDocument = () => {
    const fd = new FormData();
    fd.append("file", file);
    dispatch(PostAttachDocument(MeetingIds, decisionId, fd));

    if (file === null) {
      callMessageReject();
    }
    handleCloseAttach();
  };

  

  const callMessageReject = () => {
    dispatch(setSnackbar(true, "error", " please Attach file"));
  };




  // mom dialoge ------------------------------

  useEffect(() => dispatch(getAllAttendees(MeetingIds)), []);
  const getAttendees = useSelector(
    (state) => state.AttendeesReducer.getAttendees.data
  );
  console.log(getAttendees, "getAttendees");

  // end mom dialoge ================================

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
        {t("Meeting Decision")}
      </Typography>

      <Tooltip title={" Add Task"}>
        <Fab
          style={{
            position: "absolute",

            right: "2rem",
            width: "2.2rem",
            height: ".1rem",
            backgroundColor: "rgb(230, 81, 71)",
          }}
          onClick={handleClickOpen}
        >
          <AddIcon style={{ fontSize: "19", color: "#fff" }} />
        </Fab>
      </Tooltip>
    </div>
  );

  const RenderTable = useCallback(() => {
    return (
      <>
        <GridComponent
          dataSource={meetingDecision}
          height={Number(window.innerHeight - 320)}
          allowResizing={true}
          allowSorting={true}
          allowPaging={true}
          pageSettings={{ pageCount: 5, pageSizes: true }}
          filterSettings={{ type: "Menu" }}
          rowSelecting={handleSelect}
          rowDeselecting={handlDeselect}
        >
          <ColumnsDirective>
            <ColumnDirective type="checkbox" width="50"></ColumnDirective>
            <ColumnDirective
              field="agenda"
              headerText={"AGENDA"}
              width="90"
              textAlign="left"
            />

            <ColumnDirective
              field="decision"
              headerText={"DECISION"}
              width="210"
              textAlign="center"
            />
            <ColumnDirective
              field="discussion"
              headerText={"DISCUSSION"}
              width="130"
              textAlign="center"
            />
          </ColumnsDirective>
          <Inject services={[Resize, Page, Sort, Filter]} />
        </GridComponent>
      </>
    );
  }, [meetingDecision]);

  const [checked, setChecked] = useState([]);
  console.log(checked)
  const handleCheck = (event) => {
    var updatedList = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
  };

  const meetingMemo = () => {
    dispatch(postMeetingMemo(MeetingIds, checked));
    momDialogeClose();
  };

  return (
    <div className="cabinate_container">
      <Paper style={{ borderRadius: "16px" }}>
        <CustomToolbarMarkup />
        <RenderTable />
      </Paper>
      <Button
        id="meetingDecision_generate_MOM"
        endIcon={<NoteAddIcon />}
        variant="outlined"
        color="primary"
        disabled={first?false:true}
        style={{ float: "right", marginTop: "1.2rem" }}
        onClick={m}
      >
        GENERATE MOM
      </Button>
      <Dialog open={attach}>
        <DialogTitle>
          {t("ATTACH DOCUMENTS")}
          <IconButton
            id="meetingDecision_attach_docs"
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
          <Grid item xs={12}>
            <form>
              <TextField
                type="file"
                fullWidth
                size="small"
                className="e-field e-input"
                variant="outlined"
                name="file"
                onChange={fileChange}
              />
            </form>
          </Grid>
        </DialogContent>
        <DialogActions style={{ float: "left" }}>
          <Button id="meetingDecision_finish_button" variant="outlined" color="primary" onClick={attachDocument}>
            {t("FINISH")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open}
        onClose={() => {
          handleClose();
          formik.handleReset();
        }}
      >
        <DialogTitle>
          {t("Create An Action Points")}
          <IconButton
            id="actionPoint_close_btn"
            aria-label="close"
            onClick={() => {
              handleClose();
              formik.handleReset();
            }}
            style={{
              float: "right",
              height: "30px",
              width: "30px",
              color: "#3131d5",
            }}
          >
            <Tooltip title={t("Close")} aria-label="close">
              <CloseIcon color="primary" />
            </Tooltip>
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ width: "600px" }}>
          <form onSubmit={formik.handleSubmit} className="formikerror">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="dense"
                  id="subject"
                  name="subject"
                  label="SUBJECT"
                  size="small"
                  variant="outlined"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.subject && Boolean(formik.errors.subject)
                  }
                  helperText={formik.touched.subject && formik.errors.subject}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  minRows={4}
                  id="refrence"
                  name="refrence"
                  label="REFRENCE"
                  size="small"
                  variant="outlined"
                  value={formik.values.refrence}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.refrence && Boolean(formik.errors.refrence)
                  }
                  helperText={formik.touched.refrence && formik.errors.refrence}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="new"
                  name="new"
                  label="NEW"
                  size="small"
                  variant="outlined"
                  value={formik.values.new}
                  onChange={formik.handleChange}
                  error={formik.touched.new && Boolean(formik.errors.new)}
                  helperText={formik.touched.new && formik.errors.new}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="onBehalfOf"
                  name="onBehalfOf"
                  label="ON BEHALF OF"
                  size="small"
                  variant="outlined"
                  value={formik.values.onBehalfOf}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.onBehalfOf &&
                    Boolean(formik.errors.onBehalfOf)
                  }
                  helperText={
                    formik.touched.onBehalfOf && formik.errors.onBehalfOf
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="dueDate"
                  label="DUEDATE"
                  variant="outlined"
                  type="datetime-local"
                  fullWidth
                  size="small"
                  name="dueDate"
                  value={formik.values.dueDate}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.dueDate && Boolean(formik.errors.dueDate)
                  }
                  helperText={formik.touched.dueDate && formik.errors.dueDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="new"
                  name="description"
                  label="DESCIPTION"
                  size="small"
                  variant="outlined"
                  multiline
                  minRows={3}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <div>
                  <p style={{ margin: "0 !important" }}>
                    Please Select Internal User Or Other Units(s) To Proceed
                  </p>
                </div>
                <div>
                  <h6 style={{ fontWeight: 600, fontSize: "18px" }}>
                    Action By
                  </h6>
                </div>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="internalUser"
                  name="internalUser"
                  label="INTERNAL USER"
                  size="small"
                  variant="outlined"
                  value={formik.values.internalUser}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.internalUser &&
                    Boolean(formik.errors.internalUser)
                  }
                  helperText={
                    formik.touched.internalUser && formik.errors.internalUser
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="externalUser"
                  name="externalUser"
                  label="EXTERNAL USER"
                  size="small"
                  variant="outlined"
                  value={formik.values.externalUser}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.externalUser &&
                    Boolean(formik.errors.externalUser)
                  }
                  helperText={
                    formik.touched.externalUser && formik.errors.externalUser
                  }
                />
              </Grid>
            </Grid>
            <DialogActions style={{ marginTop: ".7rem" }}>
              <Button
                id="meeting_attach_document"
                endIcon={<AttachFileIcon />}
                variant="outlined"
                color="primary"
                onClick={handleClickAttachOpen}
              >
                ATTACH DOCUMENT
              </Button>
              <Button
                id="meeting_finish_task"
                endIcon={<DoneIcon />}
                variant="outlined"
                color="primary"
                type="submit"
              >
                FINISH
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={momDialoge}   width="400px">
        <DialogTitle>
          {t("List Of Attendees")}
          <span style={{ float: "right " }}>
            <IconButton
              id="momDialogeClose"
              aria-label="close"
              size="small"
              onClick={momDialogeClose}
            >
              <Tooltip title={t("close")} aria-label="close">
                <CloseIcon color="primary" />
              </Tooltip>
            </IconButton>
          </span>
        </DialogTitle>
        <DialogContent
 
        >

<div className="username-table"> 
       <TableContainer component={Paper} width="400px">
      <Table  aria-label="simple table">
      <TableHead>
          <TableRow>
            <TableCell>Serial.No</TableCell>
            <TableCell align="right">UserName</TableCell>
            <TableCell align="right">Attendeed</TableCell>
           
          </TableRow>
        </TableHead>
        <TableBody>
          { getAttendees && getAttendees.map((row,i) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
             
              <TableCell align="right">{i+1}</TableCell>
              <TableCell align="right">{row.userName}</TableCell>
              <TableCell>
              <input value={row.userName} type="checkbox" onChange={handleCheck} />
              </TableCell>
            
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
</div>


        </DialogContent>
        <DialogActions>
          <Button
            id="meetingMemo_send_btn"
            onClick={meetingMemo}
            variant="outlined"
            color="primary"
            style={{ marginRight: ".3rem" }}
          >
            {t("SEND")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MeetingDecision;
