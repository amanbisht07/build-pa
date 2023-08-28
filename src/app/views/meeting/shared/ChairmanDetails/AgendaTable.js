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

import Typography from "@material-ui/core/Typography";
import DoneIcon from "@material-ui/icons/Done";
import {
  ChairamInboxMeeting,
  getuserAttendee,
  userAcceptMeeting,
} from "app/redux/actions/GetInboxDataAction";
import { MeetingId } from "../InboxTableDetails/GetMeetingDetails";
import { getAllAttendees } from "app/redux/actions/CreateMeetingAction";
import { Button } from "@material-ui/core";
import history from "history.js";
import React, { useEffect, useState, useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import GetAppIcon from "@material-ui/icons/GetApp";

import AddIcon from "@material-ui/icons/Add";
import { IconButton, Tooltip, Fab, Paper } from "@material-ui/core";
import { useTranslation } from "react-i18next";

import "aos/dist/aos.css";
import CloseIcon from "@material-ui/icons/Close";

import "../index.css";

import { useFormik } from "formik";
import * as yup from "yup";
import {
  addAgendass,
  agendaFreeze,
  getAgendass,
} from "app/redux/actions/addAgendaAction";

function AgendaTable(props) {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  //-==================freeze agenda start  ==========================

  const freezeAgenda = () => {
    dispatch(agendaFreeze(props.meetingID));
  };

  //-==================freeze agenda end  ==========================

  //=================  userAttendees====================

  const UserAttendees = () => {
    dispatch(getuserAttendee(props.meetingID)), [];
  };
  console.log(props.meetingID, "ghjkl");

  useEffect(() => {
    UserAttendees();
  }, []);

  const getAttendeeDetails = useSelector(
    (state) => state.UserAttendee.attendee
  );

  useEffect(() => dispatch(getAllAttendees(props.meetingID)), [dispatch]);

  //================= end  userAttendees====================

  useEffect(() => dispatch(getAgendass(props.meetingID)), [dispatch]);

  const getAllAgendasData = useSelector(
    (state) => state.AgendaReducer.getAgendaData
  );

  console.log(getAllAgendasData);

  const userAccept = () => {
    dispatch(userAcceptMeeting(props.meetingID));
  };

  const popUpClose = () => {
    history.push("/eoffice/inbox/file");
  };

  const { t } = useTranslation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validationSchema = yup.object({
    agenda: yup
      .string("Enter your Agenda")

      .required("Agenda is required"),
    requestedBy: yup
      .string("")

      .required("please fill this"),
    description: yup
      .string("Enter your description")

      .required("description is required"),
  });

  const addAgendabtn = (values) => {
    dispatch(addAgendass(values, props.meetingID, getAgendass));
  };
  const formik = useFormik({
    initialValues: {
      agenda: "",
      requestedBy: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      addAgendabtn(values);
      handleClose();
      formik.resetForm();
    },
  });

  const CustomToolbarMarkup = () => (
    <div
      style={{
        height: "4rem",
        display: "flex",
        alignItems: "center",
        borderBottom: `1px solid ${props.theme ? "#505050" : "#d9d9d9"}`,
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
        {t("Agenda")}
      </Typography>

      <Tooltip title={t("Add Agenda")}>
        <Fab
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
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

  //for freeze agenda status  start =================

  useEffect(() => dispatch(ChairamInboxMeeting(props.meetingID)), []);
  const freezeAgendaStatus = useSelector(
    (state) => state.chairManMeeting.chairmanMeeting.freezeAgenda
  );

  console.log(freezeAgendaStatus);

  //for freeze agenda status  end  =================

  const downloadFile = (e, row) => {
    console.log(row);
    e.stopPropagation(); // don't select this row after clicking
    const anchor = document.createElement("a");
    anchor.href = row.url;
    anchor.download = row.displayPfileName;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const buttonTheme = (args) => {
    return (
      <>
        {args.url && (
          <IconButton id="agendaTable_download_file" aria-label="userHistory" size="small">
            <Tooltip title={"Download"} aria-label="Download">
              <GetAppIcon
                color="primary"
                onClick={(e) => downloadFile(e, args)}
              />
            </Tooltip>
          </IconButton>
        )}
      </>
    );
  };

  const AgendaTable = useCallback(() => {
    return (
      <GridComponent
        dataSource={getAllAgendasData}
        height={Number(window.innerHeight - 500)}
        allowResizing={true}
        allowSorting={true}
        allowPaging={true}
        pageSettings={{ pageCount: 5, pageSizes: true }}
        filterSettings={{ type: "Menu" }}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="agenda"
            headerText={t("AGENDA")}
            width="90"
            textAlign="left"
          />

          <ColumnDirective
            field="description"
            headerText={t("DESCRIPTION")}
            width="130"
            textAlign="center"
          />
          <ColumnDirective
            field="requestedBy"
            headerText={t("REQUESTED BY")}
            width="130"
            textAlign="center"
          />
          <ColumnDirective
            field="status"
            headerText={t("STATUS")}
            width="90"
            textAlign="Right"
          />

          <ColumnDirective
            field="iconBtn"
            headerText={"DOWNLOAD"}
            width="120"
            template={buttonTheme}
            allowFiltering={false}
            allowSorting={false}
          />
        </ColumnsDirective>
        <Inject services={[Resize, Page, Sort, Filter]} />
      </GridComponent>
    );
  }, [getAllAgendasData]);

  return (
    <div>
      <Paper
        className=" mui-table-customize"
        elevation={3}
        style={{
          position: "relative",
          borderRadius: "18px",
        }}
      >
        <CustomToolbarMarkup />
        <AgendaTable />
      </Paper>


      {getAttendeeDetails && getAttendeeDetails.status === "pending" ? (
        <Button
          id="attendeesDetails_accept"
          variant="outlined"
          color="primary"
          endIcon={<DoneIcon />}
          style={{

            marginTop: "20px",
            float: "right",
          }}
          onClick={(e) => {
            userAccept();
            popUpClose();
          }}
        >
          Accept
        </Button>
      ) : null}
      <Button id="freeze_agenda" variant="outlined" color="primary" style={{ float: 'right', marginTop: "20px", marginRight: "1rem" }} onClick={freezeAgenda}>Freeze Agenda </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {t("Add Attendees")}
          <IconButton
            id="agenda_close_btn"
            aria-label="close"
            onClick={handleClose}
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
        <DialogContent style={{ width: "500px" }}>
          <Dialog
            open={open}
            onClose={() => {
              handleClose();
              formik.handleReset();
            }}
          >
            <DialogTitle>
              {t("ADD AGENDA")}
              <IconButton
                id="agendaTable_close_btn"
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
                <Tooltip title={"close"} aria-label="close">
                  <CloseIcon />
                </Tooltip>
              </IconButton>{" "}
            </DialogTitle>
            <DialogContent style={{ width: "500px" }}>
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  margin="dense"
                  fullWidth
                  id="agenda"
                  name="agenda"
                  label="AGENDA"
                  size="small"
                  value={formik.values.agenda}
                  onChange={formik.handleChange}
                  error={formik.touched.agenda && Boolean(formik.errors.agenda)}
                  helperText={formik.touched.agenda && formik.errors.agenda}
                />
                <TextField
                  margin="dense"
                  fullWidth
                  id="requestedBy"
                  name="requestedBy"
                  label="REQUESTED BY"
                  type="text"
                  size="small"
                  value={formik.values.requestedBy}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.requestedBy &&
                    Boolean(formik.errors.requestedBy)
                  }
                  helperText={
                    formik.touched.requestedBy && formik.errors.requestedBy
                  }
                />

                <TextField
                  fullWidth
                  margin="dense"
                  id="description"
                  name="description"
                  label="DESCRIPTION"
                  type="description"
                  size="small"
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
                <DialogActions>
                  <Button
                    id="agendaTable_submit_btn"
                    endIcon={<DoneIcon />}
                    color="primary"
                    variant="outlined"
                    type="submit"
                  >
                    {t("Submit")}
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>
        </DialogContent>
      </Dialog>
      
        
     
    </div>
  );
}

export default AgendaTable;
