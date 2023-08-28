import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import UndoIcon from '@material-ui/icons/Undo';
import DoneIcon from '@material-ui/icons/Done';

import AddIcon from "@material-ui/icons/Add";
import { IconButton, Tooltip, Fab, Paper } from "@material-ui/core";
import { useTranslation } from "react-i18next";
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
import AOS from "aos";
import "aos/dist/aos.css";

import CloseIcon from '@material-ui/icons/Close';

import Typography from "@material-ui/core/Typography";

import "../index.css";

import { useFormik } from "formik";

import * as yup from "yup";
import { getExternalAttendees, postExternalAttendees } from "app/redux/actions/addAgendaAction";

const ExternalAttendee = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const MeetingsId = useSelector((state) => state.createMeetings.meetingId);
  const [externalDialoge, setexternalDialoge] = useState(false);

  const externalhandleClickOpen = () => {
    setexternalDialoge(true);
  };

  const externalhandleClickClose = () => {
    setexternalDialoge(false);
  };

  const externalValidationSchema = yup.object({
    mobileNo: yup
      .string("Enter your Number")

      .required("Phone Number  is required"),
    emailId: yup
      .string("Enter your email")
      .email("Enter a valid email")
      .required("Email is required"),
    externalAttendees: yup
      .string("Add Attendees")

      .required("Attendees is required"),
  });

  const externalAttendeesFormik = useFormik({
    initialValues: {
      mobileNo: "",
      emailId: "",
      externalAttendees: "",
    },
    validationSchema: externalValidationSchema,
    onSubmit: (values) => {
      externalAttendee(values);

      externalhandleClickClose();
    },
  });

  
  const externalAttendee = (values) => {
    dispatch(postExternalAttendees(MeetingsId, values));
  };

 

  const ExternalAttendees = useSelector((state) => state.externalAttendees.externalattendee);
  console.log(ExternalAttendees, "edftgh");

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
        {" External User"}
      </Typography>

      <Tooltip title={" Add External User"}>
        <Fab
          style={{
            position: "absolute",

            right: "2rem",
            width: "2.2rem",
            height: ".1rem",
            backgroundColor: "rgb(230, 81, 71)",
          }}
          onClick={externalhandleClickOpen}
        >
          <AddIcon style={{ fontSize: "19", color: "#fff" }} />
        </Fab>
      </Tooltip>
    </div>
  );

  const ExternalTable = useCallback(() => {
    return (
      <GridComponent
        dataSource={ExternalAttendees}
        height={Number(window.innerHeight - 500)}
        allowResizing={true}
        allowSorting={true}
        allowPaging={true}
        pageSettings={{ pageCount: 5, pageSizes: true }}
        allowFiltering={false}
        filterSettings={{ type: "Menu" }}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="externalAttendees"
            headerText={t("EXTERNAL ATTENDEES")}
            width="160"
            textAlign="left"
            allowFiltering={false}
            allowSorting={false}
          />

          <ColumnDirective
            field="emailId"
            headerText={t("EMAIL")}
            width="80"
            textAlign="Left"
          />
          <ColumnDirective
            field="mobileNo"
            headerText={t("PHONE")}
            width="120"
            textAlign="Left"
          />
          <ColumnDirective
            field="status"
            headerText={t("STATUS")}
            width="90"
            textAlign="Left"
          />
        </ColumnsDirective>
        <Inject services={[Resize, Sort, Filter, Page]} />
      </GridComponent>
    );
  }, [ExternalAttendees]);

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
        <ExternalTable />
      </Paper>

      <Dialog open={externalDialoge} onClose={() =>{ externalhandleClickClose(); externalAttendeesFormik.handleReset()}}>
        <DialogTitle>
          ADD EXTERNAL
          <IconButton
            id="addExternalAttende_close_button"
            aria-label="close"
            onClick={() =>{ externalhandleClickClose(); externalAttendeesFormik.handleReset()}}
            style={{
              float: "right",
              height: "30px",
              width: "30px",
              color: "#3131d5",
            }}
          >
            <Tooltip title={"close"} aria-label="close">
              <CloseIcon color="primary" />
            </Tooltip>
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ width: "500px" }}>
          <form onSubmit={externalAttendeesFormik.handleSubmit}>
            <TextField
              margin="dense"
              fullWidth
              id="externalAttendees"
              name="externalAttendees"
              label="EXTERNAL ATTENDEES"
              size="small"
              value={externalAttendeesFormik.values.externalAttendees}
              onChange={externalAttendeesFormik.handleChange}
              error={
                externalAttendeesFormik.touched.externalAttendees &&
                Boolean(externalAttendeesFormik.errors.externalAttendees)
              }
              helperText={
                externalAttendeesFormik.touched.externalAttendees &&
                externalAttendeesFormik.errors.externalAttendees
              }
            />
            <TextField
              margin="dense"
              fullWidth
              id="emailId"
              name="emailId"
              label="EMAIL ID"
              type="email"
              size="small"
              value={externalAttendeesFormik.values.emailId}
              onChange={externalAttendeesFormik.handleChange}
              error={
                externalAttendeesFormik.touched.emailId &&
                Boolean(externalAttendeesFormik.errors.emailId)
              }
              helperText={
                externalAttendeesFormik.touched.emailId &&
                externalAttendeesFormik.errors.emailId
              }
            />

            <TextField
              fullWidth
              margin="dense"
              id="mobileNo"
              name="mobileNo"
              label="MOBILE NO"
              type="text"
              size="small"
              value={externalAttendeesFormik.values.mobileNo}
              onChange={externalAttendeesFormik.handleChange}
              error={
                externalAttendeesFormik.touched.mobileNo &&
                Boolean(externalAttendeesFormik.errors.mobileNo)
              }
              helperText={
                externalAttendeesFormik.touched.mobileNo &&
                externalAttendeesFormik.errors.mobileNo
              }
            />
            <DialogActions>
              <Button
                id="externalAttendee_undo_button"
                startIcon={<UndoIcon />}
                variant="outlined"
                color="primary"
                onClick={externalAttendeesFormik.resetForm}
              >
                Reset
              </Button>
              <Button id="externalAttendee_submit_button" endIcon={<DoneIcon />} color="primary" variant="outlined" type="submit">
                Submit 
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExternalAttendee;
