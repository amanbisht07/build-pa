import React, { useState } from "react";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  makeStyles,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { useFormik } from "formik";
import CommentIcon from "@material-ui/icons/Comment";
import CheckIcon from "@material-ui/icons/Check";
import { useSelector, connect, useDispatch } from "react-redux";
import { quickSign } from "../../camunda_redux/redux/action";
import { setSnackbar } from "../..//camunda_redux/redux/ducks/snackbar";
import { Loading } from "./therme-source/material-ui/loading";
import "./therme-source/material-ui/loading.css";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "420px",
  },
  red: {
    color: "red",
  },
  green: {
    color: "green",
  },
  blue: {
    color: "blue",
  },
  black: {
    color: "#808080",
  },
}));

const SignForm = (props) => {
  const { paID: corrDocId, correspondence, references, flagNo, isUser } = props;

  const { t } = useTranslation();
  const [pencilColorCode, setPencilColorCode] = useState("blue");
  const { theme } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);

  const initialValues = {
    comments: "",
  };

  const validationSchema = Yup.object({
    comments: Yup.string(t("enter_a_comment")),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (data) => {
      let body;
      let formData = {
        comments: data.comments,
        tag: "APPROVED",
        signTitle: localStorage.getItem("username"),
        pencilColorCode: pencilColorCode,
        username: localStorage.getItem("username"),
        color: pencilColorCode,
        personalAppliactionFileId: correspondence ? corrDocId : props.fileId,
        dep_desc: isUser ? "" : sessionStorage.getItem("department"),
        user_desc: isUser ? sessionStorage.getItem("displayUserName") : "",
        url: props.fileURL,
        partCaseFileId: correspondence ? corrDocId : props.fileId,
        // annexureSign: true,
      };
      // formData.append("comments", data.comments);
      // formData.append("tag", "APPROVED");
      // formData.append("signTitle", localStorage.getItem("username")); //data.signTitle
      // formData.append("pencilColorCode", pencilColorCode);
      // formData.append("username", localStorage.getItem("username"));
      // formData.append("color", pencilColorCode);
      // formData.append("personalAppliactionFileId", props.fileId);
      // formData.append("dep_desc", sessionStorage.getItem("department")); //data.dep_desc
      // formData.append("filebytearray", data.filebytearray);
      // formData.append("url", props.fileURL);
      // formData.append("partCaseFileId", props.fileId);
      // formData.append("annexureSign", true);

      if (correspondence && references) {
        body = {
          corrDocId,
          annexure: false,
          reference: true,
          application: false,
          flagNumber: flagNo,
        };
      } else if (correspondence && !references) {
        body = {
          corrDocId,
          annexure: true,
          reference: false,
          application: false,
          flagNumber: flagNo,
        };
      }

      const roleName = sessionStorage.getItem("role");
      const department = sessionStorage.getItem("department");
      const userName = sessionStorage.getItem("username");
      setloading(true);

      props
        .quickSign(
          formData,
          roleName,
          department,
          userName,
          "",
          body ? false : true, // so that AnnexureSign header will be false for correspondence
          props.annexureId,
          "",
          "",
          "",
          body,
          ""
        )
        .then((resp) => {
          console.log(resp);
          try {
            if (resp.error) {
              callMessageOut("error", resp.error);
              setloading(false);
            } else {
              props.handleAnnexture(resp.file);
              props.handleCurrentSign();
              setloading(false);
              // props.loadAnnextureTableData(props.paID, true);
              callMessageOut(
                "success",
                t("sign_successful,_please-wait_till_PDF_renders.")
              );
              props.setOpenSign(false);
            }
          } catch (error) {
            callMessageOut("error", error.message);
            setloading(false);
          }
        })
        .catch((err) => {
          callMessageOut("error", err.message);
          setloading(false);
        });
    },
  });

  const callMessageOut = (type, msg) => {
    dispatch(setSnackbar(true, type, msg));
  };

  const options = [
    { value: "red", label: t("red") },
    { value: "green", label: t("green") },
    { value: "blue", label: t("blue") },
    { value: "black", label: t("black") },
  ];

  const classes = useStyles();

  const renderOptions = (options) => {
    return options.map((item, i) => (
      <ToggleButton value={item.value} key={i}>
        <Tooltip title={item.label}>
          <Box height="25px" width="25px" bgcolor={item.value}></Box>
        </Tooltip>
      </ToggleButton>
    ));
  };

  return (
    <div className={classes.container}>
      {loading && <Loading />}
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <TextField
            fullWidth
            id="comments"
            name="comments"
            label={t("comment")}
            multiline
            minRows={10}
            variant="outlined"
            value={formik.values.comments}
            onChange={formik.handleChange}
            error={formik.touched.comments && Boolean(formik.errors.comments)}
            helperText={formik.touched.comments && formik.errors.comments}
            className={theme ? "darkTextField" : ""}
          />
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <FormLabel component="legend">{t("color")} :</FormLabel>

            <ToggleButtonGroup
              id="sign_toggle_group"
              orientation="horizontal"
              size="medium"
              value={pencilColorCode}
              exclusive
              onChange={(e, v) => v && setPencilColorCode(v)}
              style={{
                margin: "auto"
              }}
            >
              {renderOptions(options)}
            </ToggleButtonGroup>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            id="personnel_signForm"
            className="signButton"
            type="submit"
            variant="contained"
            color="secondary"
            endIcon={<CheckIcon />}
          >
            {t("sign")}
          </Button>
        </DialogActions>
      </form>
    </div>
  );
};

function mapStateToProps(state) {
  return { props: state.props };
}

export default connect(mapStateToProps, { quickSign })(SignForm);
// export default SignForm
