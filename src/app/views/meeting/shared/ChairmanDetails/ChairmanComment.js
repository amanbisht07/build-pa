import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@material-ui/icons/Close";
import SendIcon from "@material-ui/icons/Send";

import "../index.css";
import { Grid, TextField, Button, Typography } from "@material-ui/core";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { createStyles, makeStyles } from "@material-ui/core/styles";

import axios from "axios";
import { getAllComments } from "app/redux/actions/GetInboxDataAction";
import history from "history.js";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as yup from "yup";

function ChairmanComment(props) {
  const useStyles = makeStyles((theme) =>
    createStyles({
      smallRadioButton: {
        "& svg": {
          width: "0.8em",
          height: "0.8em",
        },
      },
    })
  );

  const classes = useStyles();

  const dispatch = useDispatch();

  //  approve meeting-----------------------------------------//

  const getcomments = () => {
    dispatch(getAllComments(props.meetingID)), [];
  };

  useEffect(() => {
    getcomments();
  }, []);

  const popUpClose = () => {
    history.push("/eoffice/Meeting/meetingschedule");
  };

  // =====================approve meeting start===========================

  const [radioSelectedValue, setRadioSelectedValue] = useState("normal");

  const changethevalue = (event) => {
    setRadioSelectedValue(event.target.value);
  };

  const role = JSON.parse(sessionStorage.getItem("userInfo")).role[0];
  const username = JSON.parse(sessionStorage.getItem("userInfo")).username;

  const approve = async (comment) => {

    try {
      const response = await axios.post("/api/approve", comment, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf8",
          Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
          meetingPriority: radioSelectedValue,
          meetingId: props.meetingID,
          roleName: role,
          userName: username,
        },
      });
      toast.success(response.data.message);
      if (response.status === "OK") {
        getcomments();
      }
      
    } catch (error) {
      toast.error(error)
    }
   
  };

  const validationSchema = yup.object({
    comment: yup.string().required("Comment Is Required"),
  });

  const formik = useFormik({
    initialValues: {
      comment: "",
    },

    validationSchema: validationSchema,
    onSubmit: (value) => {
      approve(value), getcomments();
      popUpClose();
    },
  });

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "3fr 3fr 3fr 1fr",
                }}
              >
                <Typography variant="subtitle1"> Priority :- </Typography>
                <FormControlLabel
                  className={classes.smallRadioButton}
                  control={
                    <Radio
                      checked={radioSelectedValue === "normal"}
                      onChange={changethevalue}
                      value="normal"
                      size="small"
                    />
                  }
                  label="Normal"
                />

                <FormControlLabel
                  className={classes.smallRadioButton}
                  control={
                    <Radio
                      size="small"
                      checked={radioSelectedValue === "high"}
                      onChange={changethevalue}
                      value="high"
                    />
                  }
                  label="High"
                />

                <FormControlLabel
                  className={classes.smallRadioButton}
                  control={
                    <Radio
                      size="small"
                      checked={radioSelectedValue === "urgent"}
                      onChange={changethevalue}
                      value="urgent"
                    />
                  }
                  label="Urgent"
                />
              </div>
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <h5>COMMENTS</h5>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              margin="dense"
              id="comment"
              label="COMMENTS"
              multiline
              minRows={6}
              fullWidth
              className="e-field e-input"
              variant="outlined"
              name="comment"
              value={formik.values.comment}
              onChange={formik.handleChange}
              error={formik.touched.comment && Boolean(formik.errors.comment)}
              helperText={formik.touched.comment && formik.errors.comment}
            />
            <Grid xs={12}>
              <div className="btn-end" style={{ marginTop: "10px" }}>
                <Button
                  id="chairmanComment_Approve_btn"
                  endIcon={<SendIcon />}
                  variant="outlined"
                  color="primary"
                  type="submit"
                >
                  Approve
                </Button>
              </div>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </div>
  );
}

export default ChairmanComment;
