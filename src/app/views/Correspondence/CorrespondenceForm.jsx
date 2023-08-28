import {
  Button,
  DialogActions,
  DialogContent,
  Fab,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  makeStyles,
} from "@material-ui/core";
import {
  getbyfilename,
  addCorrespondence,
} from "../../camunda_redux/redux/action";
import {
  OPEN_PA_DRAFT,
  UPDATE_SUBJECT,
} from "app/camunda_redux/redux/constants/ActionTypes";
import { setRefresh1 } from "../../redux/actions/Refresh1Actions";
import { Done, Undo, ViewList } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import React, { useEffect } from "react";
import { Loading } from "./therme-source/material-ui/loading";
import "./therme-source/material-ui/loading.css";
import { useTranslation } from "react-i18next";
import { connect, useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { useState } from "react";
import { isNullOrUndefined } from "@syncfusion/ej2-base";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  btnGrid: {
    textAlign: "right",
    marginTop: theme.spacing(4),
  },
}));

const CorrespondenceForm = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { mount } = useSelector((state) => state.refreshings);

  const [fileArr, setfileArr] = useState([]);
  const [blnDisable, setBlnDisable] = useState(false);
  const username = localStorage.getItem("username");
  const role = sessionStorage.getItem("role");
  const grp = sessionStorage.getItem("department");
  const [loading, setloading] = useState(false);

  const bodyFormData = () => {
    const dept = sessionStorage.getItem("pklDirectrate");
    let formData = new FormData();
    let startIndex = 1;
    let endIndex = 5;

    formData.append("pkldirectorate", dept);
    formData.append("filename", "");
    formData.append("fileno", "");
    formData.append("startIndex", startIndex);
    formData.append("endIndex", endIndex);
    return formData;
  };

  const configData = {
    fullWidth: true,
    size: "small",
  };

  const fileTypes = [
    "Service Letter",
    "Service Note",
    "Minutes of Meeting",
    "Demi Official",
    "Signal",
  ];

  const classificationlist = ["Unclassified", "Restricted", "Confidential"];

  const INITIAL_STATE = {
    subject: props.updateSubject ? props.draftSubject : "",
    file: "",
    type: fileTypes[0],
    classification: classificationlist[0],
    priority: "",
  };

  const VALIDATION_SCHEMA = Yup.object().shape({
    subject: Yup.string(t("enter_a_subject"))
      .trim()
      .max(250, t("subject_should_not_be_greater_than_250_characters"))
      .required(`${t("this_field_is_required")} !`),
    file: Yup.string(t("enter_personal_file_name"))
      .nullable()
      .required(`${t("this_field_is_required")} !`),

    type: Yup.string(t("enter_correspondence_type")).required(
      `${t("this_field_is_required")} !`
    ),

    classification: Yup.string(
      t("enter_correspondence_classfication")
    ).required(`${t("this_field_is_required")} !`),

    priority: Yup.string(t("enter_correspondence_priority")).required(
      `${t("this_field_is_required")} !`
    ),
  });

  const VALIDATION_UPDATE_SCHEMA = Yup.object().shape({
    subject: Yup.string(t("enter_a_subject"))
      .trim()
      .max(250, t("subject_should_not_be_greater_than_250_characters"))
      .required(`${t("this_field_is_required")} !`),
  });

  const formik = useFormik({
    initialValues: INITIAL_STATE,
    validationSchema: props.updateSubject
      ? VALIDATION_UPDATE_SCHEMA
      : VALIDATION_SCHEMA,

    onSubmit: (values) => {
      setBlnDisable(true);
      setloading(true);
      const { subject, type, classification, file, priority } = formik.values;
      props.updateSubject
        ? props
          .updateSubjectApplicationForm(formik.values.subject, props.draftId)
          .then(async (res) => {
            try {
              setBlnDisable(false);
              if (res.error) {
                callMessageOut("error", res.error);
                setloading(false);
                return;
              } else {
                dispatch({
                  type: UPDATE_SUBJECT,
                  payload: {
                    subject: formik.values.subject,
                    id: props.draftId,
                  },
                });
                props.setRefresh1(!mount);
                setloading(false);
                props.handleClose();
                callMessageOut(
                  "success",
                  t("personal_application_update_successfully!")
                );
              }
            } catch (error) {
              callMessageOut("error", error.message);
              setloading(false);
            }
          })
        : props
          .addCorrespondence(
            subject,
            type,
            classification,
            file.id,
            file.filename,
            priority
          )
          .then((res) => {
            try {
              props.handleClose();
              setBlnDisable(false);
              if (res.response.error) {
                callMessageOut("error", res.response.error);
                setloading(false);
                return;
              } else {
                console.log(res.response);
                setTimeout(() => {
                  dispatch({
                    type: OPEN_PA_DRAFT,
                    payload: res.response,
                  });
                }, 100);
                props.setRefresh1(!mount);
                setloading(false);
                callMessageOut(
                  "success",
                  t("correspondence_created_successfully!")
                );
              }
            } catch (error) {
              callMessageOut("error", error.message);
              setloading(false);
            }
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (props.nofFile) formik.setFieldValue("file", props.nofFile);
  }, [props.nofFile]);

  const loadData = () => {
    props
      .getbyfilename(bodyFormData())
      .then((res) => {
        console.log(res);
        try {
          if (res.error) {
            callMessageOut(res.error);
            return;
          } else {
            setfileArr(res.data);
          }
        } catch (e) {
          callMessageOut(e.message);
        }
      })
      .catch((e) => callMessageOut(e.message));
  };

  const callMessageOut = (type, msg) => {
    dispatch(setSnackbar(true, type, msg));
  };

  return (
    <div classes={classes.root}>
      {loading && <Loading />}
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                {...configData}
                variant="outlined"
                multiline
                minRows={3}
                name="subject"
                label={t("subject")}
                className={props.theme ? "darkTextField" : ""}
                value={formik.values.subject}
                onChange={formik.handleChange}
                error={formik.touched.subject && Boolean(formik.errors.subject)}
                helperText={formik.touched.subject && formik.errors.subject}
                autoFocus
              />
            </Grid>
            {!props.updateSubject && (
              <>
                <Grid
                  item
                  md={6}
                  xs={12}
                  style={{
                    marginTop: "4px",
                  }}
                >
                  <TextField
                    {...configData}
                    id="outlined-select-currency"
                    select
                    label={t("type")}
                    name="type"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    variant="outlined"
                    className={` corr-form-select ${props.theme ? "darkTextField" : ""
                      }`}
                    error={formik.touched.type && Boolean(formik.errors.type)}
                    helperText={formik.touched.type && formik.errors.type}
                  >
                    {fileTypes.map((option, i) => (
                      <MenuItem key={i} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                  style={{
                    marginTop: "4px",
                  }}
                >
                  <TextField
                    {...configData}
                    id="outlined-select-currency"
                    select
                    label={t("classification")}
                    name="classification"
                    value={formik.values.classification}
                    onChange={formik.handleChange}
                    variant="outlined"
                    className={`corr-form-select ${props.theme ? "darkTextField" : ""}`}
                    error={
                      formik.touched.classification &&
                      Boolean(formik.errors.classification)
                    }
                    helperText={
                      formik.touched.classification &&
                      formik.errors.classification
                    }
                  >
                    {classificationlist.map((option, i) => (
                      <MenuItem key={i} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 2rem",
                      alignItems: "center",
                    }}
                  >
                    <Autocomplete
                      freeSolo
                      size="small"
                      name="file"
                      options={fileArr.map((option) => option)}
                      getOptionLabel={(option) => {
                        return option ? option.filename : "";
                      }}
                      value={formik.values.file}
                      onChange={(_, value) => {
                        if (!isNullOrUndefined(value))
                          formik.setFieldValue("file", value);
                        else formik.setFieldValue("file", null);
                      }}
                      renderInput={(params, i) => (
                        <>
                          <TextField
                            {...params}
                            variant="outlined"
                            label={t("search_nof")}
                            margin="normal"
                            id={i}
                            className={props.theme ? "darkTextField" : ""}
                            error={
                              formik.touched.file && Boolean(formik.errors.file)
                            }
                            helperText={
                              formik.touched.file && formik.errors.file
                            }
                          />
                        </>
                      )}
                    />
                    <Fab
                      id="Personal_App_Form_AddIcon"
                      disabled={props.blnDisableButtoms}
                      style={{
                        height: ".1rem",
                        width: "2.2rem",
                        cursor: "pointer",
                        marginTop: "6px",
                        marginLeft: "2px",
                        backgroundColor: "#5f78c4",
                      }}
                      onClick={() => props.handleClickFile()}
                    >
                      <Tooltip title={t("view_more_file")}>
                        <ViewList style={{ fontSize: "20", color: "#fff" }} />
                      </Tooltip>
                    </Fab>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className="corr-form-radio">
                    <h6>{`${t("request")} :`}</h6>
                    <div>
                      <RadioGroup
                        aria-label="correspondence"
                        name="priority"
                        defaultValue="Normal"
                        value={formik.values.priority}
                        onChange={(e) =>
                          formik.setFieldValue("priority", e.target.value)
                        }
                        className="corrs-radio"
                      >
                        <FormControlLabel
                          value="Normal"
                          control={<Radio color="primary" />}
                          label="Normal"
                        />
                        <FormControlLabel
                          value="Priority"
                          control={<Radio color="primary" />}
                          label="Priority"
                        />
                        <FormControlLabel
                          value="Urgent"
                          control={<Radio color="primary" />}
                          label="Urgent"
                        />
                      </RadioGroup>
                    </div>
                  </div>
                  {formik.touched.priority && (
                    <FormHelperText
                      style={{
                        color: "red",
                      }}
                    >
                      {Boolean(formik.errors.priority)
                        ? formik.errors.priority
                        : ""}
                    </FormHelperText>
                  )}
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            id="personalAppForm_reset_btn"
            className="resetButton"
            color="primary"
            variant="contained"
            style={{ marginLeft: "1rem" }}
            onClick={formik.handleReset}
            endIcon={<Undo />}
          >
            {t("reset")}
          </Button>
          <Button
            id="peronalAppForm_done_btn"
            className="submitButton"
            color="secondary"
            variant="contained"
            type="submit"
            style={{ marginLeft: "1rem" }}
            endIcon={<Done />}
            disabled={blnDisable}
          >
            {props.updateSubject ? t("update").toUpperCase() : t("submit")}
          </Button>
        </DialogActions>
      </form>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    theme: state.theme,
  };
}
export default connect(mapStateToProps, {
  getbyfilename,
  addCorrespondence,
  setRefresh1,
})(CorrespondenceForm);
