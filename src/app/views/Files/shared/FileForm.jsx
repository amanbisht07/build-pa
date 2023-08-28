import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  TextField,
} from "@material-ui/core";
import { Close, Done, Undo } from "@material-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import React from "react";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";
import { createFile } from "app/camunda_redux/redux/action/index";
import { connect, useDispatch } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";

const PaperComponent = (props) => {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'.cancel-drag'}
    >
      <Paper {...props} />
    </Draggable>
  );
};

const FileForm = (props) => {
  const { openForm, handleForm } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const config = {
    variant: "outlined",
    size: "small",
    fullWidth: true,
  };

  const INITIAL_STATE = {
    classification: "",
    financialYear: "",
    subject: "",
    section: "",
    subSection: "",
    blockNo: "",
    volume: 23,
    caseNo: "",
    custodian: [],
    mainHead: "",
    subHead: "",
    oldFileReference: "",
    connectedFiles: "",
  };

  const VALIDATION_SCHEMA = Yup.object().shape({
    classification: Yup.string(t("this_field_is_required")).required(
      `${t("this_field_is_required")} !`
    ),
    financialYear: Yup.string(),
    subject: Yup.string(t("this_field_is_required")).required(
      `${t("this_field_is_required")} !`
    ),
    section: "",
    subSection: Yup.string(t("this_field_is_required")).required(
      `${t("this_field_is_required")} !`
    ),
    blockNo: Yup.string(t("this_field_is_required")).required(
      `${t("this_field_is_required")} !`
    ),
    volume: Yup.string(t("this_field_is_required")),
    caseNo: "",
    custodian: Yup.array(),
    mainHead: "",
    subHead: "",
    oldFileReference: "",
    connectedFiles: "",
  });

  const formik = useFormik({
    initialValues: INITIAL_STATE,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: (values) => {
      props
        .createFile(values)
        .then((res) => {
          try {
          } catch (error) {
            if (res.error) {
              callMessageOut("error", res.error);
            } else {
              callMessageOut("success", "File created successfully");
              console.log(res);
            }
          }
        })
        .catch((error) => {
          callMessageOut("error", error);
        });
    },
  });

  const callMessageOut = (type, message) => {
    dispatch(setSnackbar(trur, type, message));
  };

  return (
    <Dialog
      open={openForm}
      onClose={() => {
        handleForm();
        formik.handleReset();
      }}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="draggable-dialog-title" style={{ cursor: "move" }}>
        {t("create_file")}
        <IconButton
          onClick={() => {
            handleForm();
            formik.handleReset();
          }}
          className="cancel-drag"
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Grid container={true} spacing={2}>
            <Grid item xs={6}>
              <TextField
                {...config}
                select
                label={t("classification")}
                name="classification"
                value={formik.values.classification}
                onChange={formik.handleChange}
                error={
                  formik.touched.classification &&
                  Boolean(formik.errors.classification)
                }
                helperText={
                  formik.touched.classification && formik.errors.classification
                }
              >
                {["Unclassified", "Restricted", "Confidential"].map(
                  (item, i) => (
                    <MenuItem key={i} value={item}>
                      {item}
                    </MenuItem>
                  )
                )}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                {...config}
                select
                label={t("finanacial_year")}
                name="financialYear"
                value={formik.values.financialYear}
                onChange={formik.handleChange}
              >
                {["19-20", "20-21", "21-22", "22-23"].map((item, i) => (
                  <MenuItem key={i} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...config}
                label={t("subject")}
                name="subject"
                value={formik.values.subject}
                onChange={formik.handleChange}
                error={formik.touched.subject && Boolean(formik.errors.subject)}
                helperText={formik.touched.subject && formik.errors.subject}
                autoFocus
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                {...config}
                select
                label={t("sub_section")}
                name="subSection"
                value={formik.values.subSection}
                onChange={formik.handleChange}
                error={
                  formik.touched.subSection && Boolean(formik.errors.subSection)
                }
                helperText={
                  formik.touched.subSection && formik.errors.subSection
                }
              >
                {["Unclassified", "Restricted", "Confidential"].map(
                  (item, i) => (
                    <MenuItem key={i} value={item}>
                      {item}
                    </MenuItem>
                  )
                )}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                {...config}
                select
                label={t("block_no")}
                name="blockNo"
                value={formik.values.blockNo}
                onChange={formik.handleChange}
                error={formik.touched.blockNo && Boolean(formik.errors.blockNo)}
                helperText={formik.touched.blockNo && formik.errors.blockNo}
              >
                {["Unclassified", "Restricted", "Confidential"].map(
                  (item, i) => (
                    <MenuItem key={i} value={item}>
                      {item}
                    </MenuItem>
                  )
                )}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                {...config}
                label={t("volume")}
                name="volume"
                value={formik.values.volume}
                onChange={formik.handleChange}
                error={formik.touched.volume && Boolean(formik.errors.volume)}
                helperText={formik.touched.volume && formik.errors.volume}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                {...config}
                label={t("main_head")}
                name="mainHead"
                value={formik.values.mainHead}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                {...config}
                label={t("sub_head")}
                name="subHead"
                value={formik.values.subHead}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                {...config}
                label={t("old_file_refrence")}
                name="oldFileReference"
                value={formik.values.oldFileReference}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                {...config}
                label={t("case_no")}
                name="caseNo"
                value={formik.values.caseNo}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                {...config}
                label={t("connected_files")}
                name="connectedFiles"
                value={formik.values.connectedFiles}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                {...config}
                label={t("custodian")}
                name="custodian"
                value={formik.values.custodian}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            endIcon={<Undo />}
            color="secondary"
            variant="outlined"
            onClick={formik.handleReset}
          >
            {t("reset")}
          </Button>
          <Button
            endIcon={<Done />}
            color="primary"
            variant="outlined"
            type="submit"
          >
            {t("submit")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
  };
}
export default connect(mapStateToProps, { createFile })(FileForm);
