import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {
  Box,
  DialogActions,
  DialogContent,
  FormControlLabel,
  FormLabel,
  makeStyles,
  Radio,
  RadioGroup,
  Tooltip,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

const useStyles = makeStyles(() => ({
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
    color: "black",
  },
}));

const FormikRadioGroup = ({
  field,
  name,
  options,
  children,
  theme,
  t,
  ...props
}) => {
  const fieldName = name || field.name;

  const renderOptions = (options) => {
    const classes = useStyles();
    return options.map((option) => (
      <FormControlLabel
        key={option}
        value={option}
        control={<Radio color={theme ? "default" : "primary"} />}
        label={option}
        style={{ color: { option } }}
        className={
          option === t("red")
            ? classes.red
            : option === t("green")
            ? classes.green
            : option === t("black")
            ? classes.black
            : classes.blue
        }
      />
    ));
  };

  return (
    <div style={{ marginTop: "20px", display: "flex", alignItems: "center" }}>
      <FormLabel
        component="legend"
        style={{
          display: "flex",
          width: "auto",
          marginRight: "15px",
          color: theme ? "" : "black",
        }}
      >
        {t("color")} :
      </FormLabel>
      <RadioGroup
        {...field}
        {...props}
        name={fieldName}
        color={theme ? "secondary" : "primary"}
        style={{ position: "relative", display: "table-cell" }}
      >
        {options ? renderOptions(options) : children}
      </RadioGroup>
    </div>
  );
};

const FormikToggleBtnGroup = ({
  field,
  name,
  options,
  children,
  value,
  theme,
  t,
  ...props
}) => {
  
  const formik = props.form;
  const fieldName = name || field.name;

  const classes = useStyles();
  const renderOptions = (options) => {
    return options.map((option, i) => (
      <ToggleButton value={option} key={i}>
        <Tooltip title={t(option)}>
          <Box height="25px" width="25px" bgcolor={option}></Box>
        </Tooltip>
      </ToggleButton>
    ));
  };

  return (
    <div
      style={{
        marginTop: "20px",
        display: "flex",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <FormLabel
        component="legend"
        style={{ display: "flex", color: theme ? "" : "black" }}
      >
        {t("color")} :
      </FormLabel>
      <ToggleButtonGroup
        id="sign_toggle_group"
        orientation="horizontal"
        size="medium"
        value={value}
        exclusive
        name={fieldName}
        onChange={(e, v) => v && formik.setFieldValue(fieldName, v)}
        style={{
          margin:"auto"
        }}
      >
        {options ? renderOptions(options) : children}
      </ToggleButtonGroup>
    </div>
  );
};

export const Form = (props) => {
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state);
  const {
    values: { comments, pencilColorCode },
    errors,
    handleSubmit,
    handleChange,
    blnDisable,
  } = props;

  const options = [t("red"), t("green"), t("blue"), t("black")];

  const [rowHeight, setRowHeight] = useState(14);
  useEffect(() => {
    window.innerWidth >= 1920 ? setRowHeight(14) : setRowHeight(10);
  }, []);
  return (
    <form onSubmit={handleSubmit}>
      <DialogContent dividers >
        <TextField
          name="comments"
          error={Boolean(errors.comments)}
          label={t("comment")}
          value={comments || ""}
          onChange={handleChange}
          fullWidth
          multiline
          minRows={rowHeight}
          variant="outlined"
          className={props.theme ? "darkTextField" : ""}
        />
        <div style={{ fontSize: "small", color: "red", textAlign: "end" }}>
          {Boolean(errors.comments) ? errors.comments : ""}
        </div>
        <Field
          name="pencilColorCode"
          value={pencilColorCode}
          options={options}
          component={FormikToggleBtnGroup}
          t={t}
          theme={theme}
        />
        <div style={{ fontSize: "small", color: "red", textAlign: "end" }}>
          {Boolean(errors.pencilColorCode) ? errors.pencilColorCode : ""}
        </div>
      </DialogContent>
      <DialogActions
      >
        <Button
          id="PA_file_form_sign_btn"
          type="submit"
          variant="contained"
          color="secondary"
          disabled={blnDisable}
          endIcon={<CheckIcon />}
        >
          {t("sign")}
        </Button>
      </DialogActions>
    </form>
  );
};
