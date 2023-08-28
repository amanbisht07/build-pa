import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@material-ui/icons/Close";
import "../index.css";
import { Grid, TextField, Button } from "@material-ui/core";
import { getAllComments } from "app/redux/actions/GetInboxDataAction";
import DoneIcon from "@material-ui/icons/Done";
import { IconButton, Tooltip } from "@material-ui/core";

import { MeetingId } from "../InboxTableDetails/GetMeetingDetails";
import { useFormik } from "formik";
import * as yup from "yup";
import { userRejectMeeting } from "app/redux/actions/GetInboxDataAction";

function UserRejectMeeting({ handleClose1,meetingID }) {
        

  const validationSchema = yup.object({
    comment: yup.string().required("Comment Is Required"),
  });
  const handleSubmit = (values) => {
    dispatch(userRejectMeeting(values, meetingID));
    getcomments();
  };

  const formik = useFormik({
    initialValues: {
      comment: "",
    },

    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const dispatch = useDispatch();

  const getcomments = () => {
    dispatch(getAllComments(meetingID)), [];
  };

  useEffect(() => {
    getcomments();
  }, []);

  //===============reject meeting end======================

  return (
    <>
      <IconButton
        id="userRejectMeeting_close_btn"
        aria-label="close"
        onClick={handleClose1}
        style={{
          float: "right",
          height: "25px",
          width: "15px",
          color: "#3131d5",
        }}
      >
        <Tooltip title={"close"} aria-label="close">
          <CloseIcon />
        </Tooltip>
      </IconButton>
      <h6>COMMENTS</h6>

      <form onSubmit={formik.handleSubmit}>
        <TextField
          margin="dense"
          id="comment"
          label="COMMENTS"
          multiline
          minRows={5}
          fullWidth
          value={formik.values.comment}
          onChange={formik.handleChange}
          error={formik.touched.comment && Boolean(formik.errors.comment)}
          helperText={formik.touched.comment && formik.errors.comment}
          variant="outlined"
          name="comment"
        />

        <div className="btn-end" style={{ marginTop: "10px" }}>
          <Button
            id="userRejectMeeting_finish_btn"
            variant="outlined"
            color="primary"
            type="submit"
            endIcon={<DoneIcon />}
          >
            FINISH
          </Button>
        </div>
      </form>
    </>
  );
}

export default UserRejectMeeting;
