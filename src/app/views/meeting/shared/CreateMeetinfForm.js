import React, { useEffect, useState } from "react";
import "./index.css";
import { useSelector, useDispatch } from "react-redux";
import DoneIcon from "@material-ui/icons/Done";

import {
  getDepartment,
  getuserName,
} from "app/redux/actions/CreateMeetingAction";
import { getAllMeeting } from "app/redux/actions/CreateMeetingAction";

import {
  Button,
  Grid,
  makeStyles,
  TextField,
  LightTooltip,
  Tooltip,
  Typography,
  MenuItem,
  Select,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import Switch from "@material-ui/core/Switch";

import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as yup from "yup";
import { createMeeting } from "app/redux/actions/addAgendaAction";

const MeetingForm = (props) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const nextStep = (e) => {
    props.handleNext();
  };

  const repeatData = ["Daily", "Weekly", "Monthly", "Annually"];
  const locationTypes = ["Online", "Offline"];

  const proposedLevels = [
    "Principal Director",
    "Director",
    "Additional Director",
    "Joint Director",
    "Others",
  ];

  const proposedLevelData = [];
  for (let proposedLevel of proposedLevels) {
    proposedLevelData.push(proposedLevel);
  }

  useEffect(() => dispatch(getDepartment()), [dispatch]);

  // for get department start============

  const department = useSelector((state) => state.department.department);

  const departmentData = [];

  for (let departments of department) {
    departmentData.push(departments);
  }

  // for get department end============

  // for userName start=======================
  let userNames = [];

  const { userName } = useSelector((state) => state.userName);
  for (let username of userName) {
    userNames.push(username);
  }

  // for userName end=======================

  // for date Formate start=========================
  const Starttime = props.starttime;
  const day = props.date;

  const Dates = day.toISOString().slice(0, 10);

  const date = Starttime;
  const dt = new Date(date.getTime());
  dt.setDate(dt.getDate() + 1);

  const toda = new Date(day);
  const yesterday = new Date(toda);

  yesterday.setDate(yesterday.getDate() + 1);
  const dat = yesterday.toISOString().slice(0, 10);

  var today = new Date();
  var Time = today.getHours() + ":" + today.getMinutes();
  const ampm = today.getHours() <= 12 ? "AM" : "PM";

  // for date Formate end=========================

  useEffect(() => {
    formik.setFieldValue({ chairman: userName[1] });
  }, [userName]);

  const configData = {
    fullWidth: true,
    variant: "outlined",
    size: "small",
  };

  useEffect(() => dispatch(getAllMeeting()), [dispatch]);

  const createScheduleBtn = (values) => {
    dispatch(createMeeting(values));
    nextStep();
    formik.handleReset;
  };

  const handleChangeDepartment = (value) => {
    formik.setFieldValue("chairmanDept", value);
    dispatch(getuserName(value));
  };

  const validationSchema = yup.object().shape({
    title: yup.string().required("Meeting Name Is Required"),
    meetingDescription: yup.string().required("Description Rs Required"),
    locationType: yup.string().required("Location Type  Is Required"),
    proposedLevel: yup.string().required("ProposedLevel Is Required"),
    duration: yup.string().required("Duration is Required"),
    repeatMeeting: yup.string().required("Repeat Mode Is Required"),
    chairmanDept: yup.string().required("Chairman Department  Is Required"),
    chairman: yup.string().required("Chairman Is Required"),
    dateValdation: yup.string(),
    startDate: yup
      .date("")
      .when(
        "dateValdation",
        (started, yup) =>
          started && yup.min(started, "You Cannot select Previous Date ")
      ),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      meetingDescription: "",
      locationUrl: "",
      locationPlace: "",
      locationType: "",
      initiator: localStorage.getItem("username"),
      startDate: dat + " " + Time,
      proposedLevel: "",
      duration: "",
      approveMeeting: false,
      approveAgenda: false,
      repeatMeeting: "",
      repeatMonth: "",
      repeatWeek: "",
      repeatDay: "",
      count: 1,
      chairman: "",
      chairmanDept: "",
      dt: dt,
      date: dat + " " + Time,
      dateValdation: new Date(),
    },

    validationSchema: validationSchema,
    onSubmit: (values) => {
      createScheduleBtn(values);
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2} className="meetingform">
          <Grid item xs={12}>
            <TextField
              margin="dense"
              fullWidth
              id="title"
              name="title"
              label="MEETING  NAME"
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
              id="initiator"
              name="initiator"
              label="INITIATOR"
              size="small"
              variant="outlined"
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
              options={departmentData}
              onChange={(event, newValue) => {
                handleChangeDepartment(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="CHAIRMAN DEPARTMENT"
                  id="chairmanDept"
                  fullWidth
                  size="small"
                  variant="outlined"
                  name="chairmanDept"
                  value={formik.values.chairmanDept}
                  error={
                    formik.touched.chairmanDept &&
                    Boolean(formik.errors.chairmanDept)
                  }
                  helperText={
                    formik.touched.chairmanDept && formik.errors.chairmanDept
                  }
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <Select
              label="CHAIRMAN"
              id="demo-simple-select"
              value={formik.values.chairman}
              onChange={formik.handleChange}
              name="chairman"
              variant="outlined"
              fullWidth
              error={formik.touched.chairman && Boolean(formik.errors.chairman)}
              helperText={formik.touched.chairman && formik.errors.chairman}
            >
              {userName.map((username) => (
                <MenuItem value={username} key={username}>
                  {username}
                </MenuItem>
              ))}
            </Select>
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
                  id="locationType"
                  fullWidth
                  size="small"
                  variant="outlined"
                  name="locationType"
                  value={formik.values.locationType}
                  error={
                    formik.touched.locationType &&
                    Boolean(formik.errors.locationType)
                  }
                  helperText={
                    formik.touched.locationType && formik.errors.locationType
                  }
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
                label="MEETING URL"
                id="locationUrl"
                className="e-field e-input"
                fullWidth
                size="small"
                type="url"
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
          ) : null}

          <Grid item xs={6}>
            <TextField
              fullWidth
              id="startDate"
              name="startDate"
              label="START TIME"
              size="small"
              variant="outlined"
              value={formik.values.startDate}
              onChange={formik.handleChange}
              error={
                formik.touched.startDate && Boolean(formik.errors.startDate)
              }
              helperText={formik.touched.startDate && formik.errors.startDate}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="duration"
              name="duration"
              label="DURATION"
              size="small"
              variant="outlined"
              value={formik.values.duration}
              onChange={formik.handleChange}
              error={formik.touched.duration && Boolean(formik.errors.duration)}
              helperText={formik.touched.duration && formik.errors.duration}
            />
          </Grid>

          <Grid item xs={6}>
            <Autocomplete
              options={proposedLevelData}
              onChange={(event, newValue) => {
                formik.setFieldValue("proposedLevel", newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="PROPOSED LEVEL"
                  id="proposedLevel"
                  fullWidth
                  size="small"
                  variant="outlined"
                  name="proposedLevel"
                  value={formik.values.proposedLevel}
                  error={
                    formik.touched.proposedLevel &&
                    Boolean(formik.errors.proposedLevel)
                  }
                  helperText={
                    formik.touched.proposedLevel && formik.errors.proposedLevel
                  }
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <Autocomplete
              options={repeatData}
              onChange={(event, newValue) => {
                formik.setFieldValue("repeatMeeting", newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="REPEAT MEETING"
                  id="repeatMeeting"
                  fullWidth
                  size="small"
                  variant="outlined"
                  name="repeatMeeting"
                  value={formik.values.repeatMeeting}
                  error={
                    formik.touched.repeatMeeting &&
                    Boolean(formik.errors.repeatMeeting)
                  }
                  helperText={
                    formik.touched.repeatMeeting && formik.errors.repeatMeeting
                  }
                />
              )}
            />
          </Grid>
          {formik.values.repeatMeeting === "Annually" ? (
            <>
              <Grid item xs={6}>
                <TextField
                  {...configData}
                  type="month"
                  name="repeatMonth"
                  label="REPEAT MONTH"
                  id="repeatMonth"
                  value={formik.values.repeatMonth}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...configData}
                  type="text"
                  name="repeatWeek"
                  label="REPEAT WEEK"
                  id="repeatWeek"
                  value={formik.values.repeatWeek}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...configData}
                  type="day"
                  name="repeatDay"
                  label="REPEAT DAY"
                  id="repeatDay"
                  value={formik.values.repeatDay}
                  onChange={formik.handleChange}
                />
              </Grid>
            </>
          ) : formik.values.repeatMeeting === "Monthly" ? (
            <>
              <Grid item xs={6}>
                <TextField
                  {...configData}
                  type="text"
                  name="repeatWeek"
                  label="REPEAT WEEK"
                  id="repeatWeek"
                  value={formik.values.repeatWeek}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...configData}
                  type="text"
                  name="repeatDay"
                  label="REPEAT DAY"
                  id="repeatDay"
                  value={formik.values.repeatDay}
                  onChange={formik.handleChange}
                />
              </Grid>
            </>
          ) : formik.values.repeatMeeting === "Weekly" ? (
            <Grid item xs={6}>
              <TextField
                {...configData}
                type="text"
                name="repeatDay"
                label="REPEAT DAY"
                id="repeatDay"
                value={formik.values.repeatDay}
                onChange={formik.handleChange}
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
              value={formik.values.count}
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid item xs={4}>
            <Tooltip title="Click Here To Preapproved Meeting" arrow>
              <Typography variant="subtitle2">
                MEETING APPROVED
                <Switch
                  name="approveMeeting"
                  value={formik.values.approveMeeting}
                  onChange={formik.handleChange}
                />
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item xs={4}>
            <Tooltip title="Click Here To Preapproved Agenda" arrow>
              <Typography variant="subtitle2">
                AGENDA APPROVE
                <Switch
                  name="approveAgenda"
                  value={formik.values.approveAgenda}
                  onChange={formik.handleChange}
                />
              </Typography>
            </Tooltip>
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="meetingDescription"
              name="meetingDescription"
              label="DESCRIPTION"
              size="small"
              variant="outlined"
              fullWidth
              multiline
              minRows={3}
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
        </Grid>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p></p>
          <Button
            id="createMeeting_create_btn"
            endIcon={<DoneIcon />}
            variant="outlined"
            style={{
              marginTop: "1.2rem",
              float: "right",
              marginBottom: ".7rem",
            }}
            color="primary"
            type="submit"
          >
            CREATE
          </Button>
        </div>
      </form>
    </>
  );
};

export default MeetingForm;
