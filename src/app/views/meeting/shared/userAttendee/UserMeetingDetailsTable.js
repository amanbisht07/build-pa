import React, { useContext, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import DoneIcon from '@material-ui/icons/Done';
import UndoIcon from '@material-ui/icons/Undo';
import CloseIcon from '@material-ui/icons/Close';
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import {
  Fab,
  Toolbar,
  Link,
} from "@material-ui/core";


import {
  ColumnDirective,
  ColumnsDirective,
  CommandColumnModel,
  Filter,
  GridComponent,
  Inject,
  Page,
  Resize,
  Sort,
} from "@syncfusion/ej2-react-grids";

import {
  addAttendees,
  getAllAttendees,
} from "app/redux/actions/addAgendaAction"

import "../index.css";
import { Grid, TextField, Button, IconButton, Tooltip, Paper } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { MeetingId, HandleClosebtn } from "../InboxTableDetails/GetMeetingDetails";
import PersonIcon from '@material-ui/icons/Person';
import { useFormik } from "formik";
import * as yup from "yup";


import { useTranslation } from "react-i18next";
import { getuserAttendee } from "app/redux/actions/GetInboxDataAction";
import { getAllMeeting } from "app/redux/actions/CreateMeetingAction";

function UserMeetingDetailsTable(props) {
  const { t } = useTranslation();

  const MeetingID = useContext(MeetingId);
 

  const dispatch = useDispatch();

  useEffect(() => dispatch(getAllAttendees(props.meetingID)), [dispatch]);

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const addMoreAttendees = (values) => {
    dispatch(addAttendees(values, props.meetingID));
  };


  const getAttendees = useSelector((state) => state.AttendeesReducer.getAttendees);


  const validationSchema = yup.object({
    deptName: yup
      .string("Enter your Department")

      .required("Department Name  is required"),
    userName: yup
      .string("")

      .required("this field is required "),
    userDesignation: yup
      .string("Enter your description")

      .required("User Designation is required"),
  });

  const formik = useFormik({
    initialValues: {
      deptName: "",
      userName: "",
      userDesignation: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      addMoreAttendees(values);
      handleClose()
      resetForm({ values: "" })
    },
  });


  
  //=================  userAttendees====================
  const getAllMeetingsData = () => {
    dispatch(getAllMeeting());
  };

  useEffect(() => {
    getAllMeetingsData();
  }, []);

  const getAllMeetingData = useSelector(
    (state) => state.getAllMeeting.getAllMeeting
  );
  //================= end  userAttendees====================


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
        {t("Attending User")}
      </Typography>
    {/* <Tooltip>
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
      </Tooltip> */}
      
      
    </div>
  );


  const AttendeesTable = useCallback(() => {
    return (
      <GridComponent
        dataSource={getAttendees}
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
            field="deptName"
            headerText={t("Department Name")}
            width="120"
            textAlign="left"
            allowFiltering={false}
            allowSorting={false}
          />

          <ColumnDirective
            field="userName"
            headerText={t("Department User Name")}
            width="130"
            textAlign="Left"
          />
          <ColumnDirective
            field="userDesignation"
            headerText={t("User Designation")}
            width="120"
            textAlign="Left"
          />
          <ColumnDirective
            field="status"
            headerText={t("STATUS")}
            width="130"
            textAlign="Left"
          />
        </ColumnsDirective>
        <Inject services={[Resize, Sort, Filter, Page]} />
      </GridComponent>
    );
  }, [getAttendees]);

  return (



    <div>
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
          <AttendeesTable />
        </Paper>
      </div>
  
      <Dialog open={open} onClose={() =>{ handleClose(); formik.handleReset()}}>
        <DialogTitle>ADD ATTENDEE
          <IconButton
            id="addAttendee_close_button"
            aria-label="close"
            onClick={() =>{ handleClose(); formik.handleReset()}}
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
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ width: "500px" }}>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              margin="dense"
              fullWidth
              id="deptName"
              name="deptName"
              label="DEPARTMENT NAME"
              size="small"
              variant="outlined"
              value={formik.values.deptName}
              onChange={formik.handleChange}
              error={formik.touched.deptName && Boolean(formik.errors.deptName)}
              helperText={formik.touched.deptName && formik.errors.deptName}
            />
            <TextField
              margin="dense"
              fullWidth
              id="userName"
              name="userName"
              label="USER NAME"
              type="userName"
              size="small"
              variant="outlined"
              value={formik.values.userName}
              onChange={formik.handleChange}
              error={formik.touched.userName && Boolean(formik.errors.userName)}
              helperText={formik.touched.userName && formik.errors.userName}
            />

            <TextField
              fullWidth
              margin="dense"
              id="userDesignation"
              name="userDesignation"
              label="USER DESIGNATION"
              type="userDesignation"
              size="small"
              variant="outlined"
              value={formik.values.userDesignation}
              onChange={formik.handleChange}
              error={
                formik.touched.userDesignation &&
                Boolean(formik.errors.userDesignation)
              }
              helperText={
                formik.touched.userDesignation && formik.errors.userDesignation
              }
            />
            <DialogActions>

              <Button id="userMeeting_undo_btn" startIcon={<UndoIcon />} variant="outlined" color="primary" onClick={formik.resetForm}>
                Reset
              </Button>
              <Button id="userMeeting_done_btn" endIcon={<DoneIcon />} color="primary" variant="outlined" type="submit">
                Submit
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserMeetingDetailsTable;
