import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Typography,
  Grid,
  Button,
} from "@material-ui/core";
import { useFormik } from "formik";
import * as Yup from "yup";
import CloseIcon from "@material-ui/icons/Close";
import CheckSharpIcon from "@material-ui/icons/CheckSharp";
import UndoIcon from "@material-ui/icons/Undo";

const useStyles = makeStyles((theme) => ({
  textField: {
    marginTop: theme.spacing(2),
  },
  btnGrid: {
    textAlign: "right",
    marginTop: theme.spacing(4),
  },
  headers: {
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(3),
    borderBottom: "1px solid #ddd"
  },
  cancel: {
    cursor: "pointer",
    color: "blue",
  },
}));

const INITIAL_STATE = {
  subject: "",
};

const VALIDATION_SCHEMA = Yup.object().shape({
  subject: Yup.string("please enter a valid string").required("Required !"),
});

const AddPersonalFile = ({ handleClose }) => {
  const classes = useStyles();

  const configData = {
    fullWidth: true,
    size: "small",
    className: classes.textField,
  };

  const formik = useFormik({
    initialValues: INITIAL_STATE,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div classes={classes.root}>
      {/* <Grid className={classes.headers}>
        <Typography variant="h6">Create A Personal Application</Typography>
        <CloseIcon onClick={handleClose} className={classes.cancel} />
      </Grid> */}
      <form onSubmit={formik.handleSubmit} style={{ padding: "2rem", paddingTop: '0px' }} >
        <TextField
          {...configData}
          name="subject"
          label="Subject"
          value={formik.values.subject}
          onChange={formik.handleChange}
          error={formik.touched.subject && Boolean(formik.errors.subject)}
          helperText={formik.touched.subject && formik.errors.subject}
        />
        <Grid className={classes.btnGrid}>
          <Button
            id="addPF_SUBMIT_btn"
            variant="outlined"
            type="submit"
            style={{ marginLeft: "1rem" }}
          >
            Submit &nbsp;
            <CheckSharpIcon style={{ opacity: "0.5" }} />
          </Button>
          <Button
            id="addPF_reset_btn"
            color="primary"
            variant="outlined"
            style={{ marginLeft: "1rem" }}
            onClick={formik.handleReset}
          >
            Reset &nbsp;
            <UndoIcon />
          </Button>
        </Grid>
      </form>
    </div>
  );
};

export default AddPersonalFile;
