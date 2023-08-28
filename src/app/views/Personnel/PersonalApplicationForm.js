import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Typography,
  Grid,
  Tooltip,
  Button,
  MenuItem,
  IconButton,
  Fab,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Autocomplete } from "@material-ui/lab";
import DoneIcon from "@material-ui/icons/Done";
import UndoIcon from "@material-ui/icons/Undo";
import {
  loadPFileData,
  personalApplicationFormData,
  updateSubjectApplicationForm,
} from "../../camunda_redux/redux/action";
import { changeTableStateDraft } from "../../camunda_redux/redux/action/apiTriggers";
import { connect as reduxConnect, useDispatch, useSelector } from "react-redux";
import { setSnackbar } from "../../camunda_redux/redux/ducks/snackbar";
import { setRefresh1 } from "../../redux/actions/Refresh1Actions";
import { useTranslation } from "react-i18next";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import AddIcon from "@material-ui/icons/Add";
import {
  OPEN_PA_DRAFT,
  UPDATE_SUBJECT,
} from "app/camunda_redux/redux/constants/ActionTypes";
import { Loading } from "./therme-source/material-ui/loading";
import "./therme-source/material-ui/loading.css";

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

const PersonalApplicationForm = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { changeFile } = useSelector((state) => state);

  const [pFileArr, setPFileArr] = useState([]);
  const [blnDisable, setBlnDisable] = useState(false);
  const username = localStorage.getItem("username");
  const role = sessionStorage.getItem("role");
  const grp = sessionStorage.getItem("department");
  const [loading, setloading] = useState(false);

  const { mount } = useSelector((state) => state.refreshings);

  useEffect(() => {
    if (!props.updateSubject) {
      props.loadPFileData(username, role).then((res) => {
        let tmpArray = [];
        if (res.error) {
          callMessageOut("error", res.error);
          return;
        } else {
          const { data } = res;
          // data &&
          //   data.forEach((item) => {
          //     tmpArray.push(`${item.fileName} | ${item.subject}`);
          //   });
          // setPFileArr(tmpArray);
          setPFileArr(data);
        }
      });
    }
  }, [changeFile]);

  const configData = {
    fullWidth: true,
    size: "small",
  };

  const INITIAL_STATE = {
    subject: props.updateSubject ? props.draftSubject : "",
    pfileName: "",
  };

  const VALIDATION_SCHEMA = Yup.object().shape({
    subject: Yup.string(t("enter_a_subject"))
      .trim()
      .max(250, t("subject_should_not_be_greater_than_250_characters"))
      .required(`${t("this_field_is_required")} !`),
    pfileName: Yup.string(t("enter_personal_file_name"))
      .nullable()
      .required(`${t("this_field_is_required")} !`),
  });

  const VALIDATION_UPDATE_SCHEMA = Yup.object().shape({
    subject: Yup.string(t("enter_a_subject"))
      .trim()
      .max(250, t("subject_should_not_be_greater_than_250_characters"))
      .required(`${t("this_field_is_required")} !`),
  });

  const VALIDATION_TARUN_SCHEMA = Yup.object().shape({
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
      let data = {
        pfileName: values.pfileName.fileName,
        subject: values.subject.trim(),
      };
      setloading(true);
      props.updateSubject
        ? props
            .updateSubjectApplicationForm(formik.values.subject, props.draftId)
            .then(async (res) => {
              try {
                props.handleClose();
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
            .personalApplicationFormData(
              { ...data, userName: username },
              role,
              grp
            )
            .then(async (res) => {
              try {
                props.handleClose();
                setBlnDisable(false);
                if (res.response.error) {
                  callMessageOut("error", res.response.error);
                  setloading(false);
                  return;
                } else {
                  setTimeout(() => {
                    dispatch({
                      type: OPEN_PA_DRAFT,
                      payload: res.response.PA,
                    });
                  }, 100);
                  props.setRefresh1(!mount);
                  setloading(false);
                  callMessageOut(
                    "success",
                    t("personal_application_created_successfully!")
                  );
                }
              } catch (error) {
                callMessageOut("error", error.message);
                setloading(false);
              }
            });
    },
  });

  const callMessageOut = (type, msg) => {
    dispatch(setSnackbar(true, type, msg));
  };

  return (
    <div classes={classes.root}>
      {loading && <Loading />}
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <TextField
            {...configData}
            variant="outlined"
            className={props.theme ? "darkTextField" : ""}
            multiline
            minRows={3}
            name="subject"
            label={t("subject")}
            value={formik.values.subject}
            onChange={formik.handleChange}
            error={formik.touched.subject && Boolean(formik.errors.subject)}
            helperText={formik.touched.subject && formik.errors.subject}
            // ref={subjectRef}
            autoFocus
          />
          {!props.updateSubject && (
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
                name="pfileName"
                options={pFileArr}
                getOptionLabel={(option) => {
                  return typeof option == "object"
                    ? `${option.displayFileName} | ${option.subject}`
                    : "";
                }}
                value={formik.values.pfileName}
                onChange={(_, value) =>
                  formik.setFieldValue(
                    "pfileName",
                    !isNullOrUndefined(value) ? value : null
                  )
                }
                getOptionDisabled={(option) =>
                  option?.fileName === formik.values.pfileName?.fileName
                }
                renderInput={(params, i) => (
                  <>
                    <TextField
                      {...params}
                      variant="outlined"
                      className={props.theme ? "darkTextField" : ""}
                      label={t("p_file")}
                      margin="normal"
                      id={i}
                      error={
                        formik.touched.pfileName &&
                        Boolean(formik.errors.pfileName)
                      }
                      helperText={
                        formik.touched.pfileName && formik.errors.pfileName
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
                <Tooltip title={t("create_personal_file")}>
                  <AddIcon style={{ fontSize: "20", color: "#fff" }} />
                </Tooltip>
              </Fab>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            id="personalAppForm_reset_btn"
            className="resetButton"
            color="primary"
            variant="contained"
            style={{ marginLeft: "1rem" }}
            onClick={formik.handleReset}
            endIcon={<UndoIcon />}
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
            endIcon={<DoneIcon />}
            disabled={blnDisable}
          >
            {props.updateSubject ? t("update").toUpperCase() : t("save")}
          </Button>
        </DialogActions>
      </form>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    theme: state.theme,
  };
}

export default reduxConnect(mapStateToProps, {
  loadPFileData,
  personalApplicationFormData,
  updateSubjectApplicationForm,
  changeTableStateDraft,
  setRefresh1,
})(PersonalApplicationForm);
