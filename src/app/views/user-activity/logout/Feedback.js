import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import "./logout.css";
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";
import {
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Paper,
  TextField,
  withStyles,
} from "@material-ui/core";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import MuiDialogActions from "@material-ui/core/DialogActions";
import DoneIcon from "@material-ui/icons/Done";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import { Loading } from "app/views/Personnel/therme-source/material-ui/loading";

export default function Feedback({
  username,
  Authorization,
  handleClose,
  deptName,
}) {
  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(1),
    },
  }))(MuiDialogActions);

  const [starvalue, setStarvalue] = useState(5);
  const [loading, setLoading] = useState(false);

  const sendApiData = async (Feedback) => {
    setLoading(true);
    try {
      const response = await Axios.post(
        `/retrieval_service/api/feedback`,
        JSON.stringify({
          username: username,
          rating: starvalue,
          Feedback: Feedback,
          deptName: deptName,
        }),
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json; charset=utf8",
            Authorization: Authorization,
          },
        }
      );
      setLoading(false);
      return response;
    } catch (e) {
      console.log(e.message);
      setLoading(false);
    }
  };

  const initialValues = {
    Feedback: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (value) => {
      sendApiData(value)
        .then((response) => {
          if (response.status === 200) {
            toast.success("Thank you for submitting your feedback", {
              type: toast.TYPE.SUCCESS,
              autoClose: 5000,
            });
          } else {
            toast.error("An error occurred while submitting your feedbacks", {
              type: toast.TYPE.ERROR,
              autoClose: 5000,
            });
          }
          setTimeout(() => {
            handleClose();
          }, 2000);
        })
        .catch((error) => {
          console.error(error);
          toast.error("An error occurred while submitting your feedback", {
            type: toast.TYPE.ERROR,
            autoClose: 5000,
          });
          setTimeout(() => {
            handleClose();
          }, 2000);
        });
    },
  });

  console.log(formik.values.Feedback);

  const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

  return (
    <>
      <ToastContainer theme="colored" position="bottom-right" />
      {loading && <Loading />}
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Please Provide Feedback
        </DialogTitle>
        <DialogContent className="dialog_content" dividers>
          <Grid>
            <Paper elevation={2}>
              <div className="ratingdiv">
                <Box
                  component="fieldset"
                  borderColor="transparent"
                  className="rating_box"
                >
                  <Rating
                    name="simple-controlled"
                    size="large"
                    value={starvalue}
                    onChange={(event, newValue) => {
                      setStarvalue(newValue);
                    }}
                  />
                </Box>
              </div>
              <div>
                <div style={{ padding: "0.5rem 1.5rem 1.5rem 1.5rem" }}>
                  <TextField
                    id="Feedback"
                    label="FEEDBACK"
                    multiline
                    minRows={4}
                    fullWidth
                    variant="outlined"
                    value={formik.values.Feedback}
                    name="Feedback"
                    onChange={formik.handleChange}
                  />
                </div>
              </div>
            </Paper>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            endIcon={<DoneIcon />}
            type="submit"
            variant="contained"
            style={{ background: "#ffb400" }}
          >
            SAVE
          </Button>
        </DialogActions>
      </form>
    </>
  );
}
