import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAgendass } from "app/redux/actions/addAgendaAction";

import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";
import { useTranslation } from "react-i18next";
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
import { MeetingId } from "../InboxTableDetails/GetMeetingDetails";

import { IconButton, Tooltip } from "@material-ui/core";

function UserForward({ handleClose2 }) {
  const MeetingID = useContext(MeetingId);

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
    dispatch(getAllComments(MeetingID)), [];
  };

  useEffect(() => {
    getcomments();
  }, []);

  const cancel = () => {
    history.push("/eoffice/inbox/file");
  };

  // =====================forward meeting start===========================

  const [comment, setComment] = useState([]);

  const [radioSelectedValue, setRadioSelectedValue] = useState("normal");

  const handleChange = (event) => {
    setRadioSelectedValue(event.target.value);
  };

  //  end forward meeting-----------------------------------------//

  const [forwardUserDepts, setforwardUserDept] = useState([]);
  const [forwardUsers, setforwardUse] = useState([]);

  const userForward = async () => {
    const username = JSON.parse(sessionStorage.getItem("userInfo")).username;

    const response = await axios.post(
      "/api/userForwardMeeting",
      { comment },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf8",
          Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
          meetingPriority: radioSelectedValue,
          meetingId: MeetingID,
          deptusername: username,
          forwardUserDept: forwardUserDepts,
          forwardUser: forwardUsers,
        },
      }
    );

    if (response.status === "OK") {
      getcomments();
    }
  };

  const handleSubmit = () => {
    userForward();
    getcomments();
  };

  return (
    <div>
     
        
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              FORWARD MEETING
            </Typography>
            <IconButton
              id="forwardMeeting_close_btn"
              aria-label="close"
              onClick={() => {
                handleClose2();
                formik.handleReset();
              }}
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
          </div>
          <Typography variant="body2" style={{marginTop:".3rem"}}>
            
            <span style={{ color:"#e63c3c", fontWeight: 400 }}> Note:</span>  Please select Internal Or External Department To Proceed.
          </Typography>

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
                <p> Priority :- </p>
                <FormControlLabel
                  className={classes.smallRadioButton}
                  control={
                    <Radio
                      checked={radioSelectedValue === "normal"}
                      onChange={handleChange}
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
                      onChange={handleChange}
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
                      onChange={handleChange}
                      value="urgent"
                    />
                  }
                  label="Urgent"
                />
              </div>
            </RadioGroup>
          </FormControl>
        
       <form>
     <Grid container spacing={2} >
       <Grid item xs ={6}>
            <TextField
              margin="dense"
              id="forwardUserDepts"
              label="FORWARD  USER DEPARTMENT"
            
              fullWidth
              value={forwardUserDepts}
              onChange={(e) => setforwardUserDept(e.target.value)}
            
              variant="outlined"
              name="forwardUserDepts"
            />
            </Grid>
<Grid item xs ={6}>
            <TextField
              margin="dense"
              id="forwardUsers"
              label="FORWARD USER"
              multiline
              fullWidth
              value={forwardUsers}
              onChange={(e) => setforwardUse(e.target.value)}
              className="e-field e-input"
              variant="outlined"
              name="forwardUsers"
            />
            </Grid>
            <Grid item xs ={12}>
            <TextField
              margin="dense"
              id="commnet"
              label="COMMENTS"
              multiline
              rows={6}
              fullWidth
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="e-field e-input"
              variant="outlined"
              name="commnet"
            />
             <div className="btn-end" style={{ marginTop: "20px" }}>
                <Button
                  id="forwardMeeting_Finish"
                  endIcon={<DoneIcon />}
                  variant="outlined"
                  color="primary"
                  type="submit"
                  onClick={(e) => {
                    handleSubmit();
                    cancel();
                  }}
                >
                  FINISH
                </Button>
              </div>
            </Grid>
           
             
            </Grid>
 
          </form>
        
      
    </div>
  );
}

export default UserForward;
