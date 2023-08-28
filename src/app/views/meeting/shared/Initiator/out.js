import React, { useEffect, useState } from "react";
import "./index.css";
import { useSelector, useDispatch } from "react-redux";
import {
  getDepartment,
  getuserName,
  createMeeting,
} from "app/redux/actions/CreateMeetingAction";
import { getAllMeeting } from "app/redux/actions/CreateMeetingAction";
import Box from '@material-ui/core/Box';
import { Button, Grid, TextField } from "@material-ui/core";
import { Autocomplete } from "@mui/material";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import Switch from "@material-ui/core/Switch";
import { toast } from "react-toastify";

const MeetingForm = (props) => {
  const dispatch = useDispatch();
  const [userDepartment, setUserDepartMent] = useState([]);

  const nextStep = (e) => {
    props.handleNext();
  };

  const callMessageSuccess = () => {
    dispatch(setSnackbar(true, "success", " successfully!"));
  };

  const rejected = (msg) => {
    dispatch(setSnackbar(true, "error", msg));
  };
  const repeatData = ["Daily", "Weekly", "Monthly", "Annually"];
  const locationTypes = ["Online", "Offline"];

  useEffect(() => dispatch(getDepartment()), [dispatch]);

  useEffect(() => {
    if (userDepartment && userDepartment.length !== 0) {
      dispatch(getuserName(department[0]));
    }
  }, [dispatch, userDepartment]);

  const department = useSelector((state) => state.department.department);
  const { userName } = useSelector((state) => state.userName);

  useEffect(() => {
    setUserDepartMent(department);
  }, [department]);

  useEffect(() => {
    if (userName && userName.length !== 0) {
      setData({ ...data, chairman: userName[0] });
    }
  }, [userName]);

  const proposedLevels = [
    "Principal Director",
    "Director",
    "Additional Director",
    "Joint Director",
    "Others",
  ];
  // const Error= useSelector( (state) => state.createMeetings.createMeeting.message);
  // console.log(Error,"fghjk")

  const [data, setData] = useState({
    title: "",
    meetingDescription: "",
    location: "",
    initiator: JSON.parse(sessionStorage.getItem("userInfo")).username,
    chairman: "",
    chairmanDept: "",
    proposedLevel: "",

    startDate: "",
    endDate: "",
    duration: "",
    locationType: "",
    locationPlace: "",
    locationUrl: "",
    repeatMeeting: "",
    repeatMonth: "",
    repeatWeek: "",
    repeatDay: "",
    count: "",
    approveMeeting: false,
    approveAgenda: false,
  });

  console.log(data.approveMeeting, "meetingApprove");

  const configData = {
    fullWidth: true,
    variant: "outlined",
    size: "small",
  };

  const meetingAgendaApprovehandleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.checked });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,

      [name]: value,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    dispatch(getuserName(value));
  };
 
  useEffect(() => dispatch(getAllMeeting()), [dispatch]);

  const createScheduleBtn = () => {

      dispatch(createMeeting(data));
      nextStep()
    
  };

  const configDate = {
    fullWidth: true,
  
    size: "small",
  };

  return (
    <>
      <form>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="MEETING NAME"
                id="title"
                className="e-field e-input"
                fullWidth
                size="small"
                name="title"
                variant="outlined"
                value={data.title}
                onChange={handleInputChange}
              />
            </Grid>

           

            {data.locationType === "Offline" ? (
              <Grid item xs={6}>
                <TextField
                  label="LOCATION PLACE"
                  id="locationPlace"
                  className="e-field e-input"
                  fullWidth
                  size="small"
                  variant="outlined"
                  name="locationPlace"
                  value={data.locationPlace}
                  onChange={handleInputChange}
                />
              </Grid>
            ) : data.locationType === "Online" ? (
              <Grid item xs={6}>
                <TextField
                  label="LOCATION URL"
                  id="locationUrl"
                  className="e-field e-input"
                  fullWidth
                  size="small"
                  variant="outlined"
                  name="locationUrl"
                  value={data.locationUrl}
                  onChange={handleInputChange}
                />
              </Grid>
            ) : (
              <Grid item xs={6}>
              <Autocomplete
                options={locationTypes}
                onChange={(event, newValue) => {
                  setData({ ...data, locationType: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="LOCATION TYPE"
                    id="locationPlace"
                    className="e-field e-input"
                    fullWidth
                    size="small"
                    variant="outlined"
                    name="locationPlace"
                    value={data.locationType}
                  />
                )}
              />
            </Grid>
            )}
            <Grid item xs={6}>
              <TextField
                label="INITIATOR"
                id="initiator"
                className="e-field e-input"
                fullWidth
                size="small"
                name="initiator"
                variant="outlined"
                value={data.initiator}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="standard-select-currency-native"
                select
                label="CHAIRMAN DEPARTMENT"
                value={data.chairmanDept}
                fullWidth
                variant="outlined"
                name="chairmanDept"
                onChange={handleChange}
                SelectProps={{
                  native: true,
                }}
              >
                {department &&
                  department.map((option, i) => (
                    <option key={i}>{option}</option>
                  ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField
                id="standard-select-currency-native"
                fullWidth
                label="CHAIRMAN"
                size="small"
                variant="outlined"
                value={userName ? userName[0] : ""}
                name="chairman"
              ></TextField>
            </Grid>

            <Grid item xs={6}>
              <Autocomplete
                disablePortal
                options={proposedLevels.map((option,i) =>  option,)}
                onChange={(event, newValue) =>
                  setData({ ...data, proposedLevel: newValue })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="PROPOSEDLEVEL"
                    id="proposedLevel"
                    className="e-field e-input"
                    fullWidth
                    size="small"
                    variant="outlined"
                    name="proposedLevel"
                    value={data.proposedLevel}
                  />
                )}
              />
            </Grid>

            {/* <Grid item xs={6}>
              <TextField
                label="EXTERNAL ATTENDEES"
                id="externalAttendees"
                className="e-field e-input"
                fullWidth
                size="small"
                variant="outlined"
                name="externalAttendees"
                value={data.externalAttendees}
                onChange={handleInputChange}
              />
            </Grid> */}
            {/* <Grid item xs={6}>
              <Autocomplete
                multiple
                disablePortal
                options={department && department.map((option) => option)}
                onChange={(event, newValue) =>
                  setData({ ...data, attendingDepartment: newValue })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="ATTENDING DEPARTMENTS"
                    id="attendingDepartment"
                    className="e-field e-input department"
                    fullWidth
                    size="small"
                    variant="outlined"
                    name="attendingDepartment"
                    value={data.attendingDepartment}
                  />
                )}
              />
            </Grid> */}
            <Grid item xs={6}>
              <TextField
                {...configDate}
                id="startDate"
                label="startTime"
                variant="outlined"
                type="datetime-local"
                fullWidth
                size="small"
                name="startDate"
                value={data.startDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                id="duration"
                label="DURATION"
                variant="outlined"
                fullWidth
                size="small"
                name="duration"
                value={data.duration}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
       
            <Grid item xs={6}>
              <Autocomplete
                options={repeatData}
                onChange={(event, newValue) => {
                  setData({ ...data, repeatMeeting: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="REPEAT"
                    id="repeat"
                    className="e-field e-input"
                    fullWidth
                    size="small"
                    variant="outlined"
                    name="repeat"
                    value={data.repeatMeeting}
                  />
                )}
              />
            </Grid>
            {data.repeatMeeting === "Annually" ? (
              <>
                <Grid item xs={6}>
                  <TextField
                    {...configData}
                    type="text"
                    name="repeatMonth"
                    label="REPEAT MONTH"
                    id="repeatMonth"
                    value={data.repeatMonth}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    {...configData}
                    type="text"
                    name="repeatWeek"
                    label="REPEAT WEEK"
                    id="repeatWeek"
                    value={data.repeatWeek}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    {...configData}
                    type="text"
                    name="repeatDay"
                    label="REPEAT DAY"
                    id="repeatDay"
                    value={data.repeatDay}
                    onChange={handleInputChange}
                  />
                </Grid>
              </>
            ) : data.repeatMeeting === "Monthly" ? (
              <>
                <Grid item xs={6}>
                  <TextField
                    {...configData}
                    type="text"
                    name="repeatWeek"
                    label="REPEAT WEEK"
                    id="repeatWeek"
                    value={data.repeatWeek}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    {...configData}
                    type="text"
                    name="repeatDay"
                    label="REPEAT DAY"
                    id="repeatDay"
                    value={data.repeatDay}
                    onChange={handleInputChange}
                  />
                </Grid>
              </>
            ) : data.repeatMeeting === "Weekly" ? (
              <Grid item xs={6}>
                <TextField
                  {...configData}
                  type="text"
                  name="repeatDay"
                  label="REPEAT DAY"
                  id="repeatDay"
                  value={data.repeatDay}
                  onChange={handleInputChange}
                />
              </Grid>
            ) : (
              ""
            )}

            <Grid item xs={4}>
              <TextField
                {...configData}
                type="number"
                name="count"
                label="COUNT"
                id="count"
                value={data.count}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={4}>
              MEETING APPROVE
              <Switch
                checked={data.approveMeeting}
                onChange={meetingAgendaApprovehandleChange}
                color="primary"
                name="approveMeeting"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </Grid>
            <Grid item xs={4}>
              AGNEDA APPROVE
              <Switch
                checked={data.approveAgenda}
                onChange={meetingAgendaApprovehandleChange}
                color="primary"
                name="approveAgenda"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="MEETING DESCRIPTION"
                id="meetingDescription"
                className="e-field e-input"
                fullWidth
                multiline
                minRows={4}
                size="small"
                name="meetingDescription"
                variant="outlined"
                value={data.meetingDescription}
                onChange={handleInputChange}
              />
            </Grid>
           
          </Grid>

         
            <Button
            id="meetingSchedule_create_btn"
            className="btn-end"
              variant="outlined"
              style={{ marginTop: "20px" }}
              color="primary"
              onClick={createScheduleBtn}
            >
              Create
            </Button>
       
        </Box>
      </form>
    </>
  );
};

export default MeetingForm;


import { addAgendass, getAgendass } from "app/redux/actions/addAgendaAction";
import { useDispatch, useSelector } from "react-redux";
import Button from '@material-ui/core/Button';
import TextField from "@mui/material/TextField";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from "@material-ui/icons/Add";
import { IconButton, Tooltip, Fab, Grid } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
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
import CloseIcon from "@material-ui/icons/HighlightOff";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";

import {
  getDepartment,
  getuserName,
  createMeeting,
} from "app/redux/actions/CreateMeetingAction";
import { getAllMeeting } from "app/redux/actions/CreateMeetingAction";
import Box from '@material-ui/core/Box';

import { Autocomplete } from "@mui/material";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import Switch from "@material-ui/core/Switch";

function AgendaForm(props) {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const [userDepartment, setUserDepartMent] = useState([]);

 
  
  const repeatData = ["Daily", "Weekly", "Monthly", "Annually"];

  useEffect(() => dispatch(getDepartment()), [dispatch]);

  useEffect(() => {
    if (userDepartment && userDepartment.length !== 0) {
      dispatch(getuserName(department[0]));
    }
  }, [dispatch, userDepartment]);

  const department = useSelector((state) => state.department.department);
  const { userName } = useSelector((state) => state.userName);

  useEffect(() => {
    setUserDepartMent(department);
  }, [department]);

  useEffect(() => {
    if (userName && userName.length !== 0) {
      formik.setFieldValue({ ...formik.values, chairman: userName[0] });
    }
  }, [userName]);

  const validationSchema = yup.object({
    title: yup
      .string("Enter your Agenda")

      .required("title is required"),
    meetingDescription: yup
      .string("")

      .required("please fill this"),
    location: yup
      .string("Enter your description")

      .required("description is required"),

    locationPlace: yup
      .string("Enter your Agenda")

      .required("title is required"),
    locationUrl: yup
      .string("")

      .required("please fill this"),
  });

  const addAgendabtn = (values) => {
    dispatch(addAgendass(values));
  };

  const handleChanges = (e, values) => {
    const { name, value } = e.target;
    formik.setFieldValue({ ...formik.values, [name]: value });
    dispatch(getuserName(value));
  };


  const createScheduleBtn = (values) => {

    dispatch(createMeeting(values));
  
  
};
  const formik = useFormik({
    initialValues: {
      title: "",
      meetingDescription: "",
      location: "",
      initiator: JSON.parse(sessionStorage.getItem("userInfo")).username,
      chairman: "",
      chairmanDept: "",
      proposedLevel: "",
      startDate: "",
      endDate: "",
      duration: "",
      locationType: "",
      locationPlace: "",
      locationUrl: "",
      repeatMeeting: "",
      repeatMonth: "",
      repeatWeek: "",
      repeatDay: "",
      count: "",
      approveMeeting: false,
      approveAgenda: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      createScheduleBtn(values);
      handleClose();
      formik.resetForm();
    },
  });

  AOS.init({
    offset: 200,
    duration: 600,
    easing: "ease-in-sine",
    delay: 200,
  });

  const getAllAgendasData = useSelector(
    (state) => state.AgendaReducer.getAgendaData
  );

  console.log(getAllAgendasData, "getAllAgendasData");

  const nextStep = () => {
    props.handleNext();
  };

  const backStep = () => {
    props.handleBack();
  };

  const locationTypes = ["Online", "Offline"];

  console.log(formik.values, "newValue newValue");
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              fullWidth
              id="title"
              name="title"
              label="title"
              size="small"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="meetingDescription"
              name="meetingDescription"
              label="meetingDescription"
              type="meetingDescription"
              size="small"
              value={formik.values.meetingDescription}
              onChange={formik.handleChange}
              error={
                formik.touched.meetingDescription &&
                Boolean(formik.errors.meetingDescription)
              }
              helperText={
                formik.touched.meetingDescription &&
                formik.errors.meetingDescription
              }
            />
          </Grid>

          {formik.values.locationType === "Offline" ? (
            <Grid item xs={6}>
              <TextField
                label="LOCATION PLACE"
                id="locationPlace"
                className="e-field e-input"
                fullWidth
                size="small"
                variant="outlined"
                name="locationPlace"
                value={formik.values.locationPlace}
                onChange={formik.handleChange}
                error={
                  formik.touched.locationPlace &&
                  Boolean(formik.errors.locationPlace)
                }
                helperText={
                  formik.touched.locationPlace && formik.errors.locationPlace
                }
              />
            </Grid>
          ) : formik.values.locationType === "Online" ? (
            <Grid item xs={6}>
              <TextField
                label="LOCATION URL"
                id="locationUrl"
                className="e-field e-input"
                fullWidth
                size="small"
                variant="outlined"
                name="locationUrl"
                value={formik.values.locationUrl}
                onChange={formik.handleChange}
                error={
                  formik.touched.locationUrl &&
                  Boolean(formik.errors.locationUrl)
                }
                helperText={
                  formik.touched.locationUrl && formik.errors.locationUrl
                }
              />
            </Grid>
          ) : (
            <Grid item xs={6}>
              <Autocomplete
                options={locationTypes}
                onChange={(event, newValue) => {
                  formik.setFieldValue("locationType", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="LOCATION TYPE"
                    id="locationPlace"
                    className="e-field e-input"
                    fullWidth
                    size="small"
                    variant="outlined"
                    name="locationPlace"
                    value={formik.values.locationType}
                  />
                )}
              />
            </Grid>
          )}

          <Grid item xs={6}>
            <TextField
              margin="dense"
              fullWidth
              id="initiator"
              name="initiator"
              label="initiator"
              size="small"
              value={formik.values.initiator}
              onChange={formik.handleChange}
              error={
                formik.touched.initiator && Boolean(formik.errors.initiator)
              }
              helperText={formik.touched.initiator && formik.errors.initiator}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              id="standard-select-currency-native"
              select
              size="small"
              label="CHAIRMAN DEPARTMENT"
              value={formik.values.chairmanDept}
              fullWidth
              variant="outlined"
              name="chairmanDept"
              onChange={handleChanges}
              SelectProps={{
                native: true,
              }}
            >
              {department &&
                department.map((option, i) => (
                  <option key={i}>{option}</option>
                ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              margin="dense"
              fullWidth
              id="chairman"
              name="chairman"
              label="chairman"
              size="small"
              onChange={formik.handleChange}
              value={userName ? userName[0] : ""}
              error={formik.touched.chairman && Boolean(formik.errors.chairman)}
              helperText={formik.touched.chairman && formik.errors.chairman}
            />
          </Grid>

          <Button id="meetingSchedule_Submit_btn" color="primary" variant="outlined" type="submit">
            Submit
          </Button>
        </Grid>
      </form>
    </>
  );
}

export default AgendaForm;

///===========================================
import React, { useEffect, useState } from "react";
import "./index.css";
import { useSelector, useDispatch } from "react-redux";
import {
  getDepartment,
  getuserName,
  createMeeting,
} from "app/redux/actions/CreateMeetingAction";
import { getAllMeeting } from "app/redux/actions/CreateMeetingAction";
import Box from '@material-ui/core/Box';
import { Button, Grid, makeStyles, TextField } from "@material-ui/core";
import { Autocomplete } from "@mui/material";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import Switch from "@material-ui/core/Switch";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const MeetingForm = (props) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const [userDepartment, setUserDepartMent] = useState([]);

  const nextStep = (e) => {
    props.handleNext();
  };

  const Starttime = props.starttime;
  const Date = Starttime.toISOString().slice(0, 16);

  const callMessageSuccess = () => {
    dispatch(setSnackbar(true, "success", " successfully!"));
  };

  const rejected = (msg) => {
    dispatch(setSnackbar(true, "error", msg));
  };
  const repeatData = ["Daily", "Weekly", "Monthly", "Annually"];
  const locationTypes = ["Online", "Offline"];

  useEffect(() => dispatch(getDepartment()), [dispatch]);

  useEffect(() => {
    if (userDepartment && userDepartment.length !== 0) {
      dispatch(getuserName(department[0]));
    }
  }, [dispatch, userDepartment]);

  const department = useSelector((state) => state.department.department);
  const { userName } = useSelector((state) => state.userName);

  useEffect(() => {
    setUserDepartMent(department);
  }, [department]);

  useEffect(() => {
    if (userName && userName.length !== 0) {
      setData({ ...data, chairman: userName[0] });
    }
  }, [userName]);

  const proposedLevels = [
    "Principal Director",
    "Director",
    "Additional Director",
    "Joint Director",
    "Others",
  ];
 

  const [data, setData] = useState({
    title: "",
    meetingDescription: "",
    location: "",
    initiator: JSON.parse(sessionStorage.getItem("userInfo")).username,
    chairman: "",
    chairmanDept: "",
    proposedLevel: "",

    startDate: Date,
    endDate: "",
    duration: "",
    locationType: "",
    locationPlace: "",
    locationUrl: "",
    repeatMeeting: "",
    repeatMonth: "",
    repeatWeek: Number,
    repeatDay: "",
    count: "",
    approveMeeting: false,
    approveAgenda: false,
  });

  console.log(data.approveMeeting, "meetingApprove");

  const configData = {
    fullWidth: true,
    variant: "outlined",
    size: "small",
  };

  const meetingAgendaApprovehandleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.checked });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,

      [name]: value,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    dispatch(getuserName(value));
  };

  useEffect(() => dispatch(getAllMeeting()), [dispatch]);

  const createScheduleBtn = () => {
    dispatch(createMeeting(data));

    nextStep();
  };

  const useStyles = makeStyles({
    option: {
      fontSize: 15,
      "& > span": {
        marginRight: 10,
        fontSize: 18,
        height: "6px",
      },
    },
  });

  const classes = useStyles();

  const configDate = {
    fullWidth: true,

    size: "small",
  };

  return (
    <>
      <form>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="MEETING NAME"
                id="title"
                className="e-field e-input"
                fullWidth
                size="small"
                name="title"
                variant="outlined"
                value={data.title}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={6}>
              <Autocomplete
                options={locationTypes}
                onChange={(event, newValue) => {
                  setData({ ...data, locationType: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="LOCATION TYPE"
                    id="locationPlace"
                    className="e-field e-input"
                    fullWidth
                    size="small"
                    variant="outlined"
                    name="locationPlace"
                    value={data.locationType}
                  />
                )}
              />
            </Grid>

            {data.locationType === "Offline" ? (
              <Grid item xs={6}>
                <TextField
                  label="LOCATION PLACE"
                  id="locationPlace"
                  className="e-field e-input"
                  fullWidth
                  size="small"
                  variant="outlined"
                  name="locationPlace"
                  value={data.locationPlace}
                  onChange={handleInputChange}
                />
              </Grid>
            ) : data.locationType === "Online" ? (
              <Grid item xs={6}>
                <TextField
                  label="LOCATION URL"
                  id="locationUrl"
                  className="e-field e-input"
                  fullWidth
                  size="small"
                  variant="outlined"
                  name="locationUrl"
                  value={data.locationUrl}
                  onChange={handleInputChange}
                />
              </Grid>
            ) : null}
            <Grid item xs={6}>
              <TextField
                label="INITIATOR"
                id="initiator"
                className="e-field e-input"
                fullWidth
                size="small"
                name="initiator"
                variant="outlined"
                value={data.initiator}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="standard-select-currency-native"
                select
                label="CHAIRMAN DEPARTMENT"
                value={data.chairmanDept}
                fullWidth
                variant="outlined"
                name="chairmanDept"
                onChange={handleChange}
                SelectProps={{
                  native: true,
                }}
              >
                {department &&
                  department.map((option, i) => (
                    <option key={i}>{option}</option>
                  ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField
                id="standard-select-currency-native"
                select
                label="CHAIRMAN DEPARTMENT"
                value={data.chairman}
                fullWidth
                variant="outlined"
                name="chairman"
                onChange={handleInputChange}
                SelectProps={{
                  native: true,
                }}
              >
                {userName &&
                  userName.map((option, i) => (
                    <option key={i}>{option}</option>
                  ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                className="autocomplet-repeat"
                options={proposedLevels.map((option, i) => option)}
                onChange={(event, newValue) =>
                  setData({ ...data, proposedLevel: newValue })
                }
                classes={{
                  option: classes.option,
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="PROPOSEDLEVEL"
                    id="proposedLevel"
                    className=" autocomplet-repeat"
                    fullWidth
                    size="small"
                    variant="outlined"
                    name="proposedLevel"
                    value={data.proposedLevel}
                    style={{ height: "6px" }}
                  />
                )}
              />
            </Grid>

            {/* <Grid item xs={6}>
              <TextField
                label="EXTERNAL ATTENDEES"
                id="externalAttendees"
                className="e-field e-input"
                fullWidth
                size="small"
                variant="outlined"
                name="externalAttendees"
                value={data.externalAttendees}
                onChange={handleInputChange}
              />
            </Grid> */}
            {/* <Grid item xs={6}>
              <Autocomplete
                multiple
                disablePortal
                options={department && department.map((option) => option)}
                onChange={(event, newValue) =>
                  setData({ ...data, attendingDepartment: newValue })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="ATTENDING DEPARTMENTS"
                    id="attendingDepartment"
                    className="e-field e-input department"
                    fullWidth
                    size="small"
                    variant="outlined"
                    name="attendingDepartment"
                    value={data.attendingDepartment}
                  />
                )}
              />
            </Grid> */}
            <Grid item xs={6}>
              <TextField
                {...configDate}
                id="StartTime"
                data-name="StartTime"
                label="StartTime"
                name="startDate"
                fullWidth
                size="small"
                variant="outlined"
                value={data.startDate}
                onChange={handleInputChange}
                className="e-field"
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                id="duration"
                label="DURATION"
                variant="outlined"
                fullWidth
                size="small"
                name="duration"
                value={data.duration}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <Autocomplete
                options={repeatData}
                onChange={(event, newValue) => {
                  setData({ ...data, repeatMeeting: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="REPEAT"
                    id="repeat"
                    className="e-field e-input"
                    fullWidth
                    size="small"
                    variant="outlined"
                    name="repeat"
                    value={data.repeatMeeting}
                  />
                )}
              />
            </Grid>
            {data.repeatMeeting === "Annually" ? (
              <>
                <Grid item xs={6}>
                  <TextField
                    {...configData}
                    type="month"
                    name="repeatMonth"
                    label="REPEAT MONTH"
                    id="repeatMonth"
                    value={data.repeatMonth}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    {...configData}
                    type="text"
                    name="repeatWeek"
                    label="REPEAT WEEK"
                    id="repeatWeek"
                    value={data.repeatWeek}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    {...configData}
                    type="day"
                    name="repeatDay"
                    label="REPEAT DAY"
                    id="repeatDay"
                    value={data.repeatDay}
                    onChange={handleInputChange}
                  />
                </Grid>
              </>
            ) : data.repeatMeeting === "Monthly" ? (
              <>
                <Grid item xs={6}>
                  <TextField
                    {...configData}
                    type="text"
                    name="repeatWeek"
                    label="REPEAT WEEK"
                    id="repeatWeek"
                    value={data.repeatWeek}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    {...configData}
                    type="text"
                    name="repeatDay"
                    label="REPEAT DAY"
                    id="repeatDay"
                    value={data.repeatDay}
                    onChange={handleInputChange}
                  />
                </Grid>
              </>
            ) : data.repeatMeeting === "Weekly" ? (
              <Grid item xs={6}>
                <TextField
                  {...configData}
                  type="text"
                  name="repeatDay"
                  label="REPEAT DAY"
                  id="repeatDay"
                  value={data.repeatDay}
                  onChange={handleInputChange}
                />
              </Grid>
            ) : (
              ""
            )}

            <Grid item xs={4}>
              <TextField
                {...configData}
                type="number"
                name="count"
                label="COUNT"
                id="count"
                value={data.count}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={4}>
              MEETING APPROVE
              <Switch
                checked={data.approveMeeting}
                onChange={meetingAgendaApprovehandleChange}
                color="primary"
                name="approveMeeting"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </Grid>
            <Grid item xs={4}>
              AGENDA APPROVE
              <Switch
                checked={data.approveAgenda}
                onChange={meetingAgendaApprovehandleChange}
                color="primary"
                name="approveAgenda"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="MEETING DESCRIPTION"
                id="meetingDescription"
                className="e-field e-input"
                fullWidth
                multiline
                minRows={4}
                size="small"
                name="meetingDescription"
                variant="outlined"
                value={data.meetingDescription}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          <Button
           id="createScheduleBtn"
            className="btn-end"
            variant="outlined"
            style={{ marginTop: "20px", float: "right" }}
            color="primary"
            onClick={createScheduleBtn}
          >
            Create
          </Button>
        </Box>
      </form>
    </>
  );
};

export default MeetingForm;








import React, { useEffect, useState } from "react";
import { addAgendass, getAgendass } from "app/redux/actions/addAgendaAction";
import { useDispatch, useSelector } from "react-redux";
import Button from '@material-ui/core/Button';
import TextField from "@mui/material/TextField";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from "@material-ui/icons/Add";
import { Fab, Tooltip, Grid } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
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
import CloseIcon from "@material-ui/icons/HighlightOff";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from "react-toastify";

function AgendaForm(props) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const MeetingsId = useSelector((state) => state.createMeetings.meetingId);

  const Error = useSelector((state) => state.createMeetings.createMeeting.message);
  console.log(Error, "fghjk")


  const validationSchema = yup.object({
    agenda: yup
      .string('Enter your Agenda')

      .required('Agenda is required'),
    requestedBy: yup
      .string('')

      .required('please fill this'),
    description: yup
      .string('Enter your description')

      .required('description is required'),
  });

  const addAgendabtn = (values) => {
    dispatch(addAgendass(values, MeetingsId));

  }

 
  


  const formik = useFormik({
    initialValues: {
      agenda: "",
      requestedBy: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {

      addAgendabtn(values)
      handleClose()
      formik.resetForm()
    }
  });





  AOS.init({
    offset: 200,
    duration: 600,
    easing: "ease-in-sine",
    delay: 200,
  });


  const getAllAgendasData = useSelector((state) => state.AgendaReducer.getAgendaData);

  console.log(getAllAgendasData, "getAllAgendasData");



  const nextStep = () => {
    props.handleNext();
  };

  const backStep = () => {
    props.handleBack();
  };



  return (
    <>
      <Grid className="btn-end" data-aos="fade-right" >
        <Tooltip title={t("Add Agenda")}>
          <Fab
            onClick={handleClickOpen}
            style={{
              width: "2.2rem",
              height: "2.1rem",
              backgroundColor: "rgb(25 118 210)",
            }}
          >
            <AddIcon
              style={{ fontSize: "19", color: "#fff", float: "right" }}
            />
          </Fab>
        </Tooltip>

      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t("ADD AGENDA")}
          <Fab
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
          </Fab> </DialogTitle>
        <DialogContent style={{ width: "500px" }}>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              margin="dense"
              fullWidth
              id="agenda"
              name="agenda"
              label="agenda"
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
              label="requested By"
              type="text"
              size="small"
              value={formik.values.requestedBy}
              onChange={formik.handleChange}
              error={formik.touched.requestedBy && Boolean(formik.errors.requestedBy)}
              helperText={formik.touched.requestedBy && formik.errors.requestedBy}
            />

            <TextField
              fullWidth
              margin="dense"
              id="description"
              name="description"
              label="description"
              type="description"
              size="small"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
            <DialogActions>
              <Button id="reset_descriptive_btn"variant="outlined" type="reset" color="secondary" onClick={formik.resetForm}>
                {t("Reset")}
              </Button>
              <Button id="submit_descriptive_btn" color="primary" variant="outlined" type="submit">

                {t("Submit")}
              </Button>

            </DialogActions>
          </form>
        </DialogContent>



      </Dialog>

      {
        <GridComponent
          dataSource={getAllAgendasData}
          height="200"
          allowResizing={true}
          allowSorting={true}
          allowPaging={true}
          pageSettings={{ pageCount: 5, pageSizes: true }}
          filterSettings={{ type: "Menu" }}
          style={{ top: "1rem" }}
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
              width="150"
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
              width="130"
              format="yMd"
              textAlign="Right"
            />
          </ColumnsDirective>
          <Inject services={[Resize, Page, Sort, Filter]} />
        </GridComponent>
      }

      <Button id="next_descriptive_btn" variant="outlined" color="primary" onClick={nextStep} style={{ marginTop: "30px", float: "right", marginLeft: "20px" }}>
        {t("Next")}
      </Button>
      <Button id="back_descriptive_btn" variant="outlined" color="primary" onClick={backStep} style={{ marginTop: "30px", float: "right" }}>
        {t("Back")}
      </Button>

    </>
  );
}

export default AgendaForm;





<form onSubmit={formik.handleSubmit}>
<Grid container spacing={2}>
<Grid item xs={12}>
  <TextField
    margin="dense"
    fullWidth
    id="title"
    name="title"
    label="title"
    size="small"
    variant="outlined"
    value={formik.values.title}
    onChange={formik.handleChange}
    error={formik.touched.title && Boolean(formik.errors.title)}
    helperText={formik.touched.title && formik.errors.title}
  />
</Grid>

 
<Grid item xs={6}>
    <Autocomplete
      options={locationTypes}
      onChange={(event, newValue) => {
        formik.setFieldValue("locationType", newValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="LOCATION TYPE"
          id="locationPlace"
          className="e-field e-input"
          fullWidth
          size="small"
          variant="outlined"
          name="locationPlace"
          value={formik.values.locationType}
        />
      )}
    />
  </Grid>
  {formik.values.locationType === "Offline" ? (
  <Grid item xs={6}>
    <TextField
      label="LOCATION PLACE"
      id="locationPlace"
      className="e-field e-input"
      fullWidth
      size="small"
      variant="outlined"
      name="locationPlace"
      value={formik.values.locationPlace}
      onChange={formik.handleChange}
      error={
        formik.touched.locationPlace &&
        Boolean(formik.errors.locationPlace)
      }
      helperText={
        formik.touched.locationPlace && formik.errors.locationPlace
      }
    />
  </Grid>
) : formik.values.locationType === "Online" ? (
  <Grid item xs={6}>
    <TextField
      label="LOCATION URL"
      id="locationUrl"
      className="e-field e-input"
      fullWidth
      size="small"
      variant="outlined"
      name="locationUrl"
      value={formik.values.locationUrl}
      onChange={formik.handleChange}
      error={
        formik.touched.locationUrl &&
        Boolean(formik.errors.locationUrl)
      }
      helperText={
        formik.touched.locationUrl && formik.errors.locationUrl
      }
    />
  </Grid>
) : (
null
)}
  <Grid item xs={6}>
  <TextField

    fullWidth
    id="initiator"
    name="initiator"
    label="initiator"
    size="small"
    variant="outlined"
    value={formik.values.initiator}
   
    error={formik.touched.initiator && Boolean(formik.errors.initiator)}
    helperText={formik.touched.initiator && formik.errors.initiator}
  />
  </Grid>
  {/* <Grid item xs={6}>
    <TextField
      id="standard-select-currency-native"
      select
      label="CHAIRMAN DEPARTMENT"
      value={data.chairmanDept}
      fullWidth
      variant="outlined"
      name="chairmanDept"
      onChange={handleChange}
      SelectProps={{
        native: true,
      }}
    >
      {department &&
        department.map((option, i) => (
          <option key={i}>{option}</option>
        ))}
    </TextField>
  </Grid>

  <Grid item xs={6}>
    <TextField
      id="standard-select-currency-native"
      select
      label="CHAIRMAN DEPARTMENT"
      value={data.chairman}
      fullWidth
      variant="outlined"
      name="chairman"
      onChange={handleInputChange}
      SelectProps={{
        native: true,
      }}
    >
      {userName &&
        userName.map((option, i) => (
          <option key={i}>{option}</option>
        ))}
    </TextField>
  </Grid>

  <Grid item xs={6}>
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      className="autocomplet-repeat"
      options={proposedLevelsData}
      onChange={(event, newValue) =>
        setData({ ...data, proposedLevel: newValue })
      }
    
      renderInput={(params) => (
        <TextField
          {...params}
          label="PROPOSEDLEVEL"
          id="proposedLevel"
          className=" autocomplet-repeat"
          fullWidth
          size="small"
          variant="outlined"
          name="proposedLevel"
          value={data.proposedLevel}
          style={{ height: "6px" }}
        />
      )}
    />
  </Grid>


  <Grid item xs={6}>
    <TextField
      {...configDate}
      id="StartTime"
      data-name="StartTime"
      label="StartTime"
      name="startDate"
      fullWidth
      size="small"
      variant="outlined"
      value={data.startDate}
      onChange={handleInputChange}
      className="e-field"
    />
  </Grid>

  <Grid item xs={6}>
    <TextField
      id="duration"
      label="DURATION"
      variant="outlined"
      fullWidth
      size="small"
      name="duration"
      value={data.duration}
      onChange={handleInputChange}
      InputLabelProps={{
        shrink: true,
      }}
    />
  </Grid>

  <Grid item xs={6}>
    <Autocomplete
      options={repeatData}
      onChange={(event, newValue) => {
        setData({ ...data, repeatMeeting: newValue });
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="REPEAT"
          id="repeat"
          className="e-field e-input"
          fullWidth
          size="small"
          variant="outlined"
          name="repeat"
          value={data.repeatMeeting}
        />
      )}
    />
  </Grid>
  {data.repeatMeeting === "Annually" ? (
    <>
      <Grid item xs={6}>
        <TextField
          {...configData}
          type="month"
          name="repeatMonth"
          label="REPEAT MONTH"
          id="repeatMonth"
          value={data.repeatMonth}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          {...configData}
          type="text"
          name="repeatWeek"
          label="REPEAT WEEK"
          id="repeatWeek"
          value={data.repeatWeek}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          {...configData}
          type="day"
          name="repeatDay"
          label="REPEAT DAY"
          id="repeatDay"
          value={data.repeatDay}
          onChange={handleInputChange}
        />
      </Grid>
    </>
  ) : data.repeatMeeting === "Monthly" ? (
    <>
      <Grid item xs={6}>
        <TextField
          {...configData}
          type="text"
          name="repeatWeek"
          label="REPEAT WEEK"
          id="repeatWeek"
          value={data.repeatWeek}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          {...configData}
          type="text"
          name="repeatDay"
          label="REPEAT DAY"
          id="repeatDay"
          value={data.repeatDay}
          onChange={handleInputChange}
        />
      </Grid>
    </>
  ) : data.repeatMeeting === "Weekly" ? (
    <Grid item xs={6}>
      <TextField
        {...configData}
        type="text"
        name="repeatDay"
        label="REPEAT DAY"
        id="repeatDay"
        value={data.repeatDay}
        onChange={handleInputChange}
      />
    </Grid>
  ) : (
    ""
  )}

  <Grid item xs={4}>
    <TextField
      {...configData}
      type="number"
      name="count"
      label="COUNT"
      id="count"
      value={data.count}
      onChange={handleInputChange}
    />
  </Grid>

  <Grid item xs={4}>
    <Tooltip title="Click Here To PreApproved Meeting" arrow>
      <Typography variant="P">
        MEETING APPROVE
        <Switch
          checked={data.approveMeeting}
          onChange={meetingAgendaApprovehandleChange}
          color="primary"
          name="approveMeeting"
          inputProps={{ "aria-label": "primary checkbox" }}
        />
      </Typography>
    </Tooltip>
  </Grid>
  <Grid item xs={4}>
    <Tooltip title="Click Here To PreApproved Agenda" arrow>
      <Typography variant="P">
        AGENDA APPROVE
        <Switch
          checked={data.approveAgenda}
          onChange={meetingAgendaApprovehandleChange}
          color="primary"
          name="approveAgenda"
          inputProps={{ "aria-label": "primary checkbox" }}
        />
      </Typography>
    </Tooltip>
  </Grid>
  <Grid item xs={12}>
    <TextField
      label="MEETING DESCRIPTION"
      id="meetingDescription"
      className="e-field e-input"
      fullWidth
      multiline
      minRows={4}
      size="small"
      name="meetingDescription"
      variant="outlined"
      value={data.meetingDescription}
      onChange={handleInputChange}
    />
  </Grid> */}
<Button
  endIcon={<DoneIcon />}
  className="btn-end"
  variant="outlined"
  style={{ marginTop: "20px", float: "right" }}
  color="primary"
   type="submit"
>
  Create
</Button>
</Grid>
</form>

///////////

<form onSubmit={formik.handleSubmit}>
<Grid container spacing={2}>
  <Grid item xs={12}>
    <TextField
      margin="dense"
      fullWidth
      id="title"
      name="title"
      label="title"
      size="small"
      variant="outlined"
      value={formik.values.title}
      onChange={formik.handleChange}
      error={formik.touched.title && Boolean(formik.errors.title)}
      helperText={formik.touched.title && formik.errors.title}
    />
  </Grid>
  <Grid item xs={6}>
    <TextField
      fullWidth
      id="meetingDescription"
      name="meetingDescription"
      label="meetingDescription"
      type="meetingDescription"
      size="small"
      variant="outlined"
      value={formik.values.meetingDescription}
      onChange={formik.handleChange}
      error={
        formik.touched.meetingDescription &&
        Boolean(formik.errors.meetingDescription)
      }
      helperText={
        formik.touched.meetingDescription &&
        formik.errors.meetingDescription
      }
    />
  </Grid>

  <Grid item xs={6}>
      <Autocomplete
        options={locationTypes}
        onChange={(event, newValue) => {
          formik.setFieldValue("locationType", newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="LOCATION TYPE"
            id="locationPlace"
            className="e-field e-input"
            fullWidth
            size="small"
            variant="outlined"
            name="locationPlace"
            value={formik.values.locationType}
          />
        )}
      />
    </Grid>

  {formik.values.locationType === "Offline" ? (
    <Grid item xs={6}>
      <TextField
        label="LOCATION PLACE"
        id="locationPlace"
        className="e-field e-input"
        fullWidth
        size="small"
        
        variant="outlined"
        name="locationPlace"
        value={formik.values.locationPlace}
        onChange={formik.handleChange}
        error={
          formik.touched.locationPlace &&
          Boolean(formik.errors.locationPlace)
        }
        helperText={
          formik.touched.locationPlace && formik.errors.locationPlace
        }
      />
    </Grid>
  ) : formik.values.locationType === "Online" ? (
    <Grid item xs={6}>
      <TextField
        label="LOCATION URL"
        id="locationUrl"
        className="e-field e-input"
        fullWidth
        size="small"
        variant="outlined"
        name="locationUrl"
        value={formik.values.locationUrl}
        onChange={formik.handleChange}
        error={
          formik.touched.locationUrl &&
          Boolean(formik.errors.locationUrl)
        }
        helperText={
          formik.touched.locationUrl && formik.errors.locationUrl
        }
      />
    </Grid>
  ) : (
    null
  )}

  <Grid item xs={6}>
    <TextField
      margin="dense"
      fullWidth
      id="initiator"
      name="initiator"
      label="initiator"
      size="small"
      value={formik.values.initiator}
      onChange={formik.handleChange}
      error={
        formik.touched.initiator && Boolean(formik.errors.initiator)
      }
      helperText={formik.touched.initiator && formik.errors.initiator}
    />
  </Grid>

  <Grid item xs={6}>
<Autocomplete
disablePortal
id="combo-box-demo"
className="autocomplet-repeat"
options={proposedLevelsData}
onChange={(event, newValue) =>
formik.setFieldValue( "proposedLevel", newValue )
}

renderInput={(params) => (
<TextField
  {...params}
  label="PROPOSEDLEVEL"
  id="proposedLevel"
  className=" autocomplet-repeat"
  fullWidth
  size="small"
  variant="outlined"
  name="proposedLevel"
  value={formik.values.proposedLevel}
  style={{ height: "6px" }}
/>
)}
/>
</Grid>

</Grid>
  <Button color="primary" variant="outlined" type="submit">
    Submit
  </Button>
</form>