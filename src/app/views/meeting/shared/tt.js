import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from '@material-ui/core/Button';
import TextField from "@mui/material/TextField";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  getAllMeetingDepartment,
  getAllAttendees,
  sendToChairman,
  addAttendees,
  getDepartment,
  getuserName,
  getAttendingGroup,
  postExternalAttendees,
  getExternalAttendees,
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
import CloseIcon from "@material-ui/icons/HighlightOff";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import "./index.css";
import "../../../../_index.scss";
import { useFormik } from "formik";
import * as yup from "yup";

function AttendeesForm(props) {
  //Tab buttons functions

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const [value, setValue] = useState(0);

  const handleChanges = (event, newValue) => {
    setValue(newValue);
  };

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
        {value === 0
          ? t("Attending User")
          : value === 1
          ? t("Attending Depaetment")
          : value === 2
          ? t("Attending Group")
          : t("External Depaetment")}
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
      <Tooltip
        title={
          value === 0
            ? t("Add Attendees")
            : value === 1
            ? t("Add Department")
            : value === 2
            ? t("Add Group")
            : value === 3
            ? t("Add External")
            : ""
        }
      >
        <Fab
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            width: "2.2rem",
            height: ".1rem",
            backgroundColor: "rgb(230, 81, 71)",
          }}
          onClick={(e) =>
            value === 0
              ? handleClickOpen()
              : value === 1
              ? departmentDialogeOpen()
              : value === 2
              ? grouphandleClickOpen()
              : value === 3
              ? externalhandleClickOpen()
              : ""
          }
        >
          <AddIcon style={{ fontSize: "19", color: "#fff" }} />
        </Fab>
      </Tooltip>
    </div>
  );

  AOS.init({
    offset: 200,
    duration: 600,
    easing: "ease-in-sine",
    delay: 200,
  });

  const MeetingsId = useSelector( (state) => state.createMeetings.meetingId);
  console.log(MeetingsId)
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [departmentDialoge, setDepartmentDialoge] = useState(false);
  const [groupDialoge, setGroupDialoge] = useState(false);

  //external attendess data and api calls

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

  console.log(externalAttendeesFormik, "externalAttendeesFormik");
  const externalAttendee = (values) => {
    dispatch(postExternalAttendees(MeetingsId, values));
  
  };

 
  useEffect(()=>{
    dispatch(getExternalAttendees(MeetingsId))
  },[ExternalAttendees])

  const ExternalAttendees = useSelector((state) => state.externalAttendees.externalattendee.data);
  console.log(ExternalAttendees, "edftgh");

  //external attendess data and api calls End ----------------------------------------

  //Groups attendess data and api calls ---------------------------------------------------

  const grouphandleClickOpen = () => {
    setGroupDialoge(true);
  };

  const grouphandleClickClose = () => {
    setGroupDialoge(false);
  };

  useEffect(() => dispatch(getAttendingGroup()), []);
  const getGropsNameData = useSelector(
    (state) => state.getGroupNames.getGropsName.data
  );

  //Groups attendess data and api calls End -------------------------------------------------------

  //department attendess data and api calls ------------------------------------------------
  const departmentDialogeOpen = () => {
    setDepartmentDialoge(true);
  };

  const departmentDialogeClose = () => {
    setDepartmentDialoge(false);
  };
  useEffect(() => dispatch(getAllMeetingDepartment(MeetingsId)), []);
  useEffect(() => dispatch(getDepartment()), [dispatch]);

  const [userDepartment, setUserDepartMent] = useState([]);
  useEffect(() => {
    if (userDepartment.length !== 0) {
      dispatch(getuserName(department[0]));
    }
  }, [dispatch, userDepartment]);

  const department = useSelector((state) => state.department.department);
  //department attendess data and api calls End ------------------------------------------------------

  //Attending attendess data and api calls  ------------------------------------------------------

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addMoreAttendees = (values) => {
    dispatch(addAttendees(values, MeetingsId));
  };

  useEffect(() => dispatch(getAllAttendees(MeetingsId)), [dispatch]);
  const getAttendees = useSelector(
    (state) => state.AttendeesReducer.getAttendees.data
  );
  console.log(getAttendees, "getAttendees");

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
      resetForm({ values: "" });
    },
  });
  //Attending attendess data and api calls End ------------------------------------------------------

  const dispatch = useDispatch();

 

  const MeetingSendToChairmanss = () => {
    dispatch(sendToChairman(MeetingsId, props.getAllMeetingData));
    props.handleClose1();
  };

  const backStep = (e) => {
    props.handleBack();
  };

  const { userName } = useSelector((state) => state.userName);

  return (
    <div>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChanges}
          aria-label="simple tabs example"
          className="initiator-tab"
        >
          <Tab label="Attending User" {...a11yProps(0)} />
          <Tab label="Attending Department" {...a11yProps(1)} />
          <Tab label="Group Department" {...a11yProps(2)} />
          <Tab label="External Department" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
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
                  width="70"
                  textAlign="Left"
                />
              </ColumnsDirective>
              <Inject services={[Resize, Sort, Filter, Page]} />
            </GridComponent>
          </Paper>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
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
                  width="120"
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
                  width="90"
                  textAlign="Left"
                />
              </ColumnsDirective>
              <Inject services={[Resize, Sort, Filter, Page]} />
            </GridComponent>
          </Paper>
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
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
                  width="120"
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
                  width="90"
                  textAlign="Left"
                />
              </ColumnsDirective>
              <Inject services={[Resize, Sort, Filter, Page]} />
            </GridComponent>
          </Paper>
        </div>
      </TabPanel>

      <TabPanel value={value} index={3}>
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
          </Paper>
        </div>
      </TabPanel>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Add Attendees
          <IconButton
            id="department_close_btn"
            aria-label="close"
            onClick={handleClose}
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
          <form onSubmit={formik.handleSubmit}>
            <TextField
              margin="dense"
              fullWidth
              id="deptName"
              name="deptName"
              label="deptName"
              size="small"
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
              label="userName"
              type="userName"
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
              label="userDesignation"
              type="userDesignation"
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
                id="department_reset_btn"
                variant="outlined"
                color="secondary"
                onClick={formik.resetForm}
              >
                Reset
              </Button>
              <Button id="department_submit_btn" color="primary" variant="outlined" type="submit">
                Submit
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={departmentDialoge} onClose={departmentDialogeClose}>
        <DialogTitle>
          Add Department
          <IconButton
            id="department_dialog_close_btn"
            aria-label="close"
            onClick={departmentDialogeClose}
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
          <TextField
            margin="dense"
            id="standard-select-currency-native"
            select
            label="deptName"
            fullWidth
            variant="outlined"
            name="deptName"
            size="small"
            SelectProps={{
              native: true,
            }}
          >
            {department &&
              department.map((option, i) => <option key={i}>{option}</option>)}
          </TextField>
          <TextField
            margin="dense"
            id="standard-select-currency-native"
            fullWidth
            size="small"
            label="deptUserName"
            variant="outlined"
            value={userName ? userName[0] : ""}
            name="userName"
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button id="department_dialog_reset_btn" variant="outlined" color="secondary">
            Reset
          </Button>
          <Button
            id="department_dialog_add_btn"
            variant="outlined"
            color="primary"
            onClick={(e) => {
              addMoreAttendees();
              handleClose();
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={groupDialoge} onClose={grouphandleClickClose}>
        <DialogTitle>
          Add Groups
          <IconButton
            id="groupDialog_close_btn"
            aria-label="close"
            onClick={grouphandleClickClose}
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
          <TextField
            margin="dense"
            id="standard-select-currency-native"
            select
            label="Department Name"
            fullWidth
            variant="outlined"
            name="deptName"
            size="small"
            SelectProps={{
              native: true,
            }}
          >
            {getGropsNameData &&
              getGropsNameData.map((option, i) => (
                <option key={i}>{option}</option>
              ))}
          </TextField>
          <TextField
            margin="dense"
            id="standard-select-currency-native"
            fullWidth
            size="small"
            label="deptUserName"
            variant="outlined"
            value={userName ? userName[0] : ""}
            name="userName"
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button id="addMoreAttendees_reset_btn" variant="outlined" color="secondary">
            Reset
          </Button>
          <Button
            id="addMoreAttendees"
            variant="outlined"
            color="primary"
            onClick={(e) => {
              addMoreAttendees();
              handleClose();
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={externalDialoge} onClose={externalhandleClickClose}>
        <DialogTitle>
          Add External
          <IconButton
            id="externalAttendees_close_btn"
            aria-label="close"
            onClick={externalhandleClickClose}
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
              label="externalAttendees"
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
              label="emailId"
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
              label="mobileNo"
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
                id="meeting_resetForm_reset"
                variant="outlined"
                color="secondary"
                onClick={formik.resetForm}
              >
                Reset
              </Button>
              <Button id="meeting_resetForm_submit" color="primary" variant="outlined" type="submit">
                Submit
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Button
        id="MeetingSendToChairman_save_btn"
        style={{ float: "right" }}
        variant="outlined"
        color="primary"
        onClick={MeetingSendToChairmanss}
      >
        Save
      </Button>
      <Button
        id="MeetingSendToChairman_back_btn"
        variant="outlined"
        color="primary"
        onClick={backStep}
        style={{ float: "right", marginRight: "20px" }}
      >
        Back
      </Button>
    </div>
  );
}

export default AttendeesForm;
