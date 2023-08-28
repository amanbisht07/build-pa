import {
  Button,
  Chip,
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
import React, { useEffect, useState, useCallback } from "react";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";
import {
  createFile,
  getSubSection,
  getBlock,
  getCustodian,
  getSectionData,
} from "app/camunda_redux/redux/action/index";
import { connect, useDispatch } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { Autocomplete } from "@material-ui/lab";
import { debounce } from "utils";
import { isNullOrUndefined } from "@syncfusion/ej2-base";

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
};

const FileForm = (props) => {
  const { open, handleClose, handleTrigger } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [subSectionList, setSubSectionList] = useState([]);
  const [blockList, setBlockList] = useState([]);
  const [custodianData, setCustodianData] = useState([]);
  const [getSection, setGetSection] = useState([]);
  const [autoComplete, setAutoComplete] = useState([]);
  const [userRolesCustodian, setUserRolesCustodian] = useState([]);

  const config = {
    variant: "outlined",
    size: "small",
    fullWidth: true,
  };

  const INITIAL_STATE = {
    fileClassification: "",
    financialYear: "",
    subject: "",
    section: sessionStorage.getItem("department"),
    subSection: "",
    blockNumber: "",
    volume: 1,
    caseNo: "",
    custodian: [],
    mainHead: "",
    subHead: "",
    oldFile: "",
    connectedFiles: "",
  };

  const VALIDATION_SCHEMA = Yup.object().shape({
    fileClassification: Yup.string(t("this_field_is_required")).required(
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
    blockNumber: Yup.string(t("this_field_is_required")).required(
      `${t("this_field_is_required")} !`
    ),
    volume: Yup.string(t("this_field_is_required")),
    caseNo: "",
    custodian: Yup.array().when("classification", {
      is: "Confidential",
      then: Yup.array().required(`${t("this_field_is_required")} !`),
      otherwise: Yup.array(),
    }),
    mainHead: "",
    subHead: "",
    oldFile: "",
    connectedFiles: "",
  });

  const formik = useFormik({
    initialValues: INITIAL_STATE,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: (values) => {
      let data = {
        ...values,
        custodian: values.custodian.map((item) => item.deptRole),
      };
      props
        .createFile(data)
        .then((res) => {
          if (res.error) {
            callMessageOut("error", res.error);
          } else {
            callMessageOut("success", "File created successfully");
            formik.handleReset();
            handleTrigger();
            handleClose();
          }
          try {
          } catch (error) {
            callMessageOut("error", error);
          }
        })
        .catch((error) => {
          callMessageOut("error", error);
        });
    },
  });

  const callMessageOut = (type, message) => {
    dispatch(setSnackbar(true, type, message));
  };

  const fileType = ["Unclassified", "Restricted", "Confidential"];
  const fyType = ["19-20", "20-21", "21-22", "22-23", "23-24"];

  let department = sessionStorage.getItem("department");

  useEffect(() => {
    try {
      props.getSectionData(department).then((response) => {
        setGetSection(response.response);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    props
      .getSubSection()
      .then(({ response }) => {
        try {
          if (response.error) {
            callMessageOut("error", response.error);
          } else {
            setSubSectionList(response);
            console.log(response);
          }
        } catch (error) {
          callMessageOut("error", error);
        }
      })
      .catch((error) => {
        callMessageOut("error", error);
      });

    props
      .getBlock()
      .then(({ response }) => {
        try {
          if (response.error) {
            callMessageOut("error", response.error);
          } else {
            setBlockList(response);
          }
        } catch (error) {
          callMessageOut("error", error);
        }
      })
      .catch((error) => {
        callMessageOut("error", error);
      });
  }, []);

  async function getCustodian(value) {
    await props
      .getCustodian(value)
      .then(({ response }) => {
        try {
          if (response.error) {
            callMessageOut("error", response.error);
          } else {
            setCustodianData(response);
          }
        } catch (error) {
          callMessageOut("error", error);
        }
      })
      .catch((error) => {
        callMessageOut("error", error);
      });
  }

  const optimizedInpChange = useCallback(debounce(getCustodian), []);

  const handleInputChange = async (e) => {
    if (e && e.target) {
      if (!isNullOrUndefined(e.target.value)) {
        optimizedInpChange(e.target.value);
      }
    }
  };

  const handlegetSection = (event, newValue) => {
    setAutoComplete(newValue);
  };
  return (
    <Dialog
      open={open}
      PaperComponent={PaperComponent}
      onClose={() => {
        formik.handleReset();
        handleClose();
      }}
      aria-labelledby="draggable-dialog-title"
      id="cabinet-create-file"
    >
      <DialogTitle
        style={{ cursor: "move" }}
        id="draggable-dialog-title"
        className="dialog_title"
      >
        <span>{t("create_file")}</span>
        <IconButton
          id="create_file_dialog_close_button"
          aria-label="close"
          onClick={() => {
            formik.handleReset();
            handleClose();
          }}
          color="primary"
          className="cancel-drag"
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <TextField
                {...config}
                id="outlined-select-classification-native"
                select
                label={t("classification")}
                name="fileClassification"
                value={formik.values.fileClassification}
                onChange={formik.handleChange}
                error={
                  formik.touched.fileClassification &&
                  Boolean(formik.errors.fileClassification)
                }
                helperText={
                  formik.touched.fileClassification &&
                  formik.errors.fileClassification
                }
              >
                {fileType.map((option, i) => (
                  <MenuItem key={i} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="outlined-volume-normal"
                {...config}
                label={t("volume")}
                name="volume"
                value={formik.values.volume}
                onChange={formik.handleChange}
                error={formik.touched.volume && Boolean(formik.errors.volume)}
                helperText={formik.touched.volume && formik.errors.volume}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                {...config}
                id="outlined-select-fy-native"
                select
                label={t("finanacial_year")}
                name="financialYear"
                value={formik.values.financialYear || "23-24"}
                onChange={formik.handleChange}
              >
                {fyType.map((option, i) => (
                  <MenuItem key={i} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="outlined-subject-normal"
                {...config}
                label={t("subject")}
                name="subject"
                value={formik.values.subject}
                onChange={formik.handleChange}
                error={formik.touched.subject && Boolean(formik.errors.subject)}
                helperText={formik.touched.subject && formik.errors.subject}
                autoFocus
                minRows={4}
                multiline
              />
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                autoComplete={true}
                onChange={(event, newValue) => {
                  handlegetSection(event, newValue);
                }}
                value={autoComplete}
                options={getSection}
                getOptionLable={(option) => option}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Section"
                    variant="outlined"
                    fullWidth
                    size="small"
                    minRows={4}
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="outlined-select-sub-section-native"
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
                {subSectionList.map((option, i) => (
                  <MenuItem key={i} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="outlined-select-block-no-native"
                {...config}
                select
                label={t("block_no")}
                name="blockNumber"
                value={formik.values.blockNumber}
                onChange={formik.handleChange}
                error={
                  formik.touched.blockNumber &&
                  Boolean(formik.errors.blockNumber)
                }
                helperText={
                  formik.touched.blockNumber && formik.errors.blockNumber
                }
              >
                {blockList.map((option, i) => (
                  <MenuItem key={i} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="outlined-main-head-normal"
                {...config}
                label={t("main_head")}
                name="mainHead"
                value={formik.values.mainHead}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="outlined-sub-head-normal"
                {...config}
                label={t("sub_head")}
                name="subHead"
                value={formik.values.subHead}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                id="outlined-select-custodian-native"
                options={custodianData}
                getOptionLabel={(option) => {
                  return typeof option?.deptRoleDisplayName === "string"
                    ? option?.deptRoleDisplayName
                    : "";
                }}
                // renderTags={(value, getTagProps) =>
                //   value.map((option, index) => (
                //     <Chip
                //       variant="outlined"
                //       label={option}
                //       {...getTagProps({ index })}
                //     />
                //   ))
                // }
                value={formik.values.custodian}
                onChange={(e, values) =>
                  formik.setFieldValue("custodian", values)
                }
                onInputChange={handleInputChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    {...config}
                    label={t("custodian")}
                    name="custodian"
                    variant="outlined"
                    error={
                      formik.touched.custodian &&
                      Boolean(formik.errors.custodian)
                    }
                    helperText={
                      formik.touched.custodian && formik.errors.custodian
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="outlined-old-case-no-normal"
                {...config}
                label={t("case_no")}
                name="caseNo"
                value={formik.values.caseNo}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="outlined-old-file-reference-normal"
                {...config}
                label={t("old_file_refrence")}
                name="oldFile"
                value={formik.values.oldFile}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="outlined-connected-files-normal"
                {...config}
                label={t("connected_files")}
                name="connectedFiles"
                value={formik.values.connectedFiles}
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
export default connect(mapStateToProps, {
  createFile,
  getSubSection,
  getBlock,
  getCustodian,
  getSectionData,
})(FileForm);
