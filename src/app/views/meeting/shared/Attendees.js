import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTranslation } from "react-i18next";
import UndoIcon from '@material-ui/icons/Undo';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import {

  sendToChairman,

} from "app/redux/actions/CreateMeetingAction";
import AddIcon from "@material-ui/icons/Add";
import {
  IconButton,
  Tooltip,
  Fab,
  Grid,
  Paper,
  Toolbar,
  Link,
} from "@material-ui/core";
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
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

import "./index.css";
import "../../../../_index.scss";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  addAttendees,
  getAllAttendees,
} from "app/redux/actions/addAgendaAction";

function AttendeesForm(props) {
  //Tab buttons functions

  const [open, setOpen] = useState(false);

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
      <Link
        variant="button"
        align="center"
        color="primary"
        style={{
          fontSize: "medium",
          fontFamily: "inherit !important",
          position: "absolute",
          top: "3.5%",
          right: "10%",
          cursor: "pointer",
        }}
      ></Link>
      <Tooltip title={t("Add Attendees")}>
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

  const { t } = useTranslation();

  AOS.init({
    offset: 200,
    duration: 600,
    easing: "ease-in-sine",
    delay: 200,
  });

  const MeetingsId = useSelector((state) => state.createMeetings.meetingId);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addMoreAttendees = (values) => {
    dispatch(addAttendees(values, MeetingsId));
  };

  useEffect(() => dispatch(getAllAttendees(MeetingsId)), [getAttendees]);
  const getAttendees = useSelector(
    (state) => state.AttendeesReducer.getAttendees
  );

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
      handleClose();
      formik.resetForm({ values: "" });
    },
  });
  //Attending attendess data and api calls End ------------------------------------------------------

  const dispatch = useDispatch();

  

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
            headerText={t("DEPARTMENT NAME")}
            width="120"
            textAlign="left"
            allowFiltering={false}
            allowSorting={false}
          />

          <ColumnDirective
            field="userName"
            headerText={t("DEPARTMENT USER NAME")}
            width="130"
            textAlign="Left"
          />
          <ColumnDirective
            field="userDesignation"
            headerText={t("USER DESIGNATION")}
            width="120"
            textAlign="Left"
          />
          <ColumnDirective
            field="status"
            headerText={t("STATUS")}
            width="70"
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

      <Dialog open={open} onClose={()=> {handleClose(); formik.handleReset()}}>
        <DialogTitle>
          {t("ADD ATTENDEE")}
          <IconButton
            id="close_attendMeeting_btn"
            aria-label="close"
            onClick={() => {handleClose(); formik.handleReset()}}
            style={{
              float: "right",
              height: "30px",
              width: "30px",
              color: "#3131d5",
            }}
          >
            <Tooltip title={t("close")} aria-label="close">
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
              type="text"
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
              type="text"
              size="small"
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
              type="text"
              size="small"
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
              <Button
                id="reset_attendMeeting_btn"
                startIcon={<UndoIcon />}
                variant="outlined"
                color="primary"
                onClick={formik.resetForm}
              >
                {t("Reset")}
              </Button>
              <Button id="submit_attendMeeting_btn" endIcon={<DoneIcon />} color="primary" variant="outlined" type="submit">
                {t("Submit")}
              </Button>
            </DialogActions>

          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AttendeesForm;
