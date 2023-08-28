import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAgendass } from "app/redux/actions/addAgendaAction";
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import { FormikProvider, useFormik } from "formik";
import * as yup from "yup";
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
} from "app/redux/actions/addAgendaAction";

import "../index.css";
import {
  TextField,
  Button,
  IconButton,
  Paper,
  Tooltip,
  Fab,
  Typography,
} from "@material-ui/core";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Cookies from "js-cookie";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { useTranslation } from "react-i18next";
import AddIcon from "@material-ui/icons/Add";

import "../../../../../_index.scss";

function MeetingAttendees({ closebtn, MeetingIds }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const callApi = () => {
    const role = JSON.parse(sessionStorage.getItem("userInfo")).role[0];
    dispatch(getAllAttendees(MeetingIds, role)), [];
  };

  useEffect(() => {
    callApi();
  }, []);

  const getAttendees = useSelector(
    (state) => state.AttendeesReducer.getAttendees
  );

  console.log(getAttendees);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };





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
        {t("Meeting Attendees")}
      </Typography>

      <Tooltip title={t("Add Attendees")}>
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
          dataSource={getAttendees}
          height={Number(window.innerHeight - 320)}
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
              width="200"
              headerText={t("Department Name")}
            />
            <ColumnDirective
              field="userName"
              headerText={t("Department User Name")}
              width="150"
            />

            <ColumnDirective
              field="status"
              headerText={t("STATUS")}
              width="130"
            ></ColumnDirective>
          </ColumnsDirective>
          <Inject services={[Resize, Sort, Filter, Page]} />
        </GridComponent>
      </>
    );
  }, [getAttendees]);


  // ------------------------- formik start --------------------


  const addMoreAttendees = (values) => {
    dispatch(addAttendees(values, MeetingIds));
    handleClose()
  };


  const validationSchema = yup.object({

    deptName: yup.string().required('Depatment Is Required'),
    userName: yup.string().required("User Is Required")

  })

  const formik = useFormik({
    initialValues: {
      deptName: "",
      userName: ""
    },

    validationSchema: validationSchema,
    onSubmit: (values) => {
      addMoreAttendees(values)
      formik.handleReset()
    }
  });

  // ------------------formik end ----------------------------

  return (
    <>

      <div className="cabinate_container">
        <Paper style={{ borderRadius: "16px" }}>
          <CustomToolbarMarkup />
          <RenderTable />
        </Paper>
        <Dialog open={open} onClose={() => { handleClose(); formik.handleReset()}}>
          <DialogTitle>
            {t("ADD ATTENDEE")}
            <span style={{ float: "right " }}>
              <IconButton id="meetingAttendee_close_button" aria-label="close" size="small" onClick={() => { formik.handleReset(); handleClose() }}>
                <Tooltip title={t("close")} aria-label="close">
                  <CloseIcon color="primary" />
                </Tooltip>
              </IconButton>
            </span>{" "}
          </DialogTitle>
          <form onSubmit={formik.handleSubmit}>
            <DialogContent style={{ width: "550px" }}>
              <TextField
                autoFocus
                margin="dense"
                id="deptName"
                label="Department"
                type="text"
                size="small"

                fullWidth
                variant="outlined"
                name="deptName"
                value={formik.values.deptName}
                onChange={formik.handleChange}
                error={formik.touched.deptName && Boolean(formik.errors.deptName)}
                helperText={formik.touched.deptName && formik.errors.deptName}
              />
              <TextField
                margin="dense"
                id="userName"
                label="User"
                type="text"
                fullWidth
                size="small"

                variant="outlined"
                name="userName"
                value={formik.values.userName}
                onChange={formik.handleChange}
                error={formik.touched.userName && Boolean(formik.errors.userName)}
                helperText={formik.touched.userName && formik.errors.userName}
              />
            </DialogContent>
            <DialogActions>
              <Button
                id="meetingAttendee_finish_btn"
                endIcon={<DoneIcon />}
                variant="outlined"
                color="primary"
                type="submit"
              >
                {t("FINISH")}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>

    </>
  );
}

export default MeetingAttendees;
