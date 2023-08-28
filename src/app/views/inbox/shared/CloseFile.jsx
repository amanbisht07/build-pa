import {
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  makeStyles,
  Paper,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { closeFileTemporary } from "app/camunda_redux/redux/action";
import PaginationComp from "app/views/utilities/PaginationComp";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";
import { connect, useDispatch } from "react-redux";
import { FaRegCalendarTimes } from "react-icons/fa";
import { Close, TextFields, Check } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useContext } from "react";
import { BmContext } from "./SplitviewContainer/BmContainer/Worker";
import history from "../../../../history";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { Loading } from "../therme-source/material-ui/loading";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: "350px",
  },
  close_file_btn: {
    position: "fixed",
    left: "50% !important",
    bottom: "6% !important",
    zIndex: 10,
    maxHeight: "50px",
    minHeight: "50px",
    minWidth: "50px",
    maxWidth: "50px",
  },
}));

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
};

const top100Films = [
  "Done already pls re check it",
  "Busy right now will do it later",
  "Pls re consider it",
];

const CloseFile = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const department = sessionStorage.getItem("department");
  const role = sessionStorage.getItem("role");

  const { partCaseId, closeFile, setcloseFile } = useContext(BmContext);

  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape(
    {
      intComment: Yup.string().when(["intComment", "cusIntComment"], {
        is: (v1, v2) => {
          if (!v1 && !v2) return true;
          else if (!v1 && v2) return false;
          else return true;
        },
        then: Yup.string().required("Int Comment Cannot be empty"),
        otherwise: Yup.string(),
      }),
      cusIntComment: Yup.string().when(["intComment", "cusIntComment"], {
        is: (v1, v2) => {
          if (!v1 && !v2) return true;
          else if (v1 && !v2) return false;
          else return true;
        },
        then: Yup.string().required("Custom Int Comment Cannot be empty"),
        otherwise: Yup.string(),
      }),
    },
    [
      ["intComment", "intComment"],
      ["cusIntComment", "cusIntComment"],
      ["intComment", "cusIntComment"],
      ["cusIntComment", "intComment"], // this is called cyclic dependency when one value depend on itself or another or vice versa
    ]
  );

  const initialValues = {
    intComment: "",
    cusIntComment: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: temporaryCloseFile,
  });

  function temporaryCloseFile(data, action) {
    setLoading(true);
    const { intComment, cusIntComment } = data;
    const body = {
      id: partCaseId,
      department,
      rolename: role,
      remark:
        (intComment && intComment) || (cusIntComment && cusIntComment) || "",
    };
    props
      .closeFileTemporary(body)
      .then((res) => {
        try {
          if (res.error) {
            callMessageOut("error", res.error);
            setLoading(false);
            return;
          } else {
            setLoading(false);
            callMessageOut("success",t("save_in_cabinet_success"))
            history.push({ pathname: "/eoffice/inbox/file" });
          }
        } catch (e) {
          callMessageOut("error", e.error);
          setLoading(false);
        }
      })
      .catch((e) => {
        callMessageOut("error", e.error);
        setLoading(false);
      });
  }

  const callMessageOut = (type, message) => {
    dispatch(setSnackbar(true, type, message));
  };

  return (
    <>
      {loading && <Loading />}
      <Dialog
        open={closeFile}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        id="ylow-note"
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
          onClose={() => setcloseFile(false)}
        >
          <span>{t("in_cabinet_file_comment")}</span>
          <IconButton
            id="Enclosure_remark_&_sign"
            aria-label="close"
            onClick={() => setcloseFile(false)}
            className="cancel-drag"
          >
            <Close style={{ color: props.theme ? "#fff" : "#000" }} />
          </IconButton>
        </DialogTitle>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <div className="close-file-dialog">
              <Autocomplete
                freeSolo
                forcePopupIcon={true}
                options={top100Films}
                value={formik.initialValues.intComment}
                id="tags-outlined"
                onChange={(event, newValue) => {
                  if (newValue) {
                    formik.setFieldValue("intComment", newValue);
                  } else {
                    formik.setFieldValue("intComment", "");
                  }
                }}
                getOptionLabel={(option) => option}
                onInputChange={(event, newInputValue) => {}}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={
                      formik.touched.intComment &&
                      Boolean(formik.errors.intComment)
                    }
                    helperText={
                      formik.touched.intComment && formik.errors.intComment
                    }
                    style={{ width: "100%" }}
                    variant="outlined"
                    label={t("select_internal_comment")}
                    placeholder={t("internal_comment")}
                    className={props.theme ? "darkTextField" : ""}
                  />
                )}
                disabled={Boolean(formik.values.cusIntComment)}
              />

              <div className="close-dialog-or">
                <span></span>
                <span>OR</span>
              </div>

              <TextField
                fullWidth
                id="cusIntComment"
                name="cusIntComment"
                label={t("internal_comment")}
                placeholder={t("write_your_own_internal_comment")}
                multiline
                minRows={10}
                className={props.theme ? "darkTextField" : ""}
                variant="outlined"
                value={formik.values.cusIntComment}
                onChange={formik.handleChange}
                error={
                  formik.touched.cusIntComment &&
                  Boolean(formik.errors.cusIntComment)
                }
                helperText={
                  formik.touched.cusIntComment && formik.errors.cusIntComment
                }
                disabled={Boolean(formik.values.intComment)}
              />
            </div>
          </DialogContent>

          <DialogActions>
            <Button
              id="flagEdit_submit_button"
              variant="contained"
              color="secondary"
              type="submit"
              endIcon={<Check />}
            >
              {t("save")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

function mapStateToProps(state) {
  return {
    theme: state.theme,
  };
}

export default connect(mapStateToProps, {
  closeFileTemporary,
})(CloseFile);
