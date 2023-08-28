import React, { memo, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import "./index.css";
import { Grid, TextField, Button } from "@material-ui/core";
import { getAllComments } from "app/redux/actions/GetInboxDataAction"
import history from "history.js";
import Axios from "axios";
import { MeetingId, handleClose1 } from "./InboxTableDetails/GetMeetingDetails"
import {

  getuserAttendee,

} from "app/redux/actions/GetInboxDataAction";
import UserRejectMeeting from "./userAttendee/UserRejectMeeting";
function MeetingRejected({handleClose1,meetingID }) {

 

  //=================  userAttendees====================
  const UserAttendees = () => {
    dispatch(getuserAttendee(meetingID)), [];
  };

  useEffect(() => {
    UserAttendees();
  }, []);

  const getAttendeeDetails = useSelector((state) => state.UserAttendee.attendee);

  //================= end  userAttendees====================






  const [comment, setComment] = useState("");

  const dispatch = useDispatch()


  const getcomments = () => {
    dispatch(getAllComments(meetingID)),
      []
  }

  useEffect(() => {
    getcomments()
  }, []);

  const username = JSON.parse(sessionStorage.getItem("userInfo")).username;

  const rejectMeeting = async () => {

    await Axios.post("/api/reject", { comment }, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        meetingId: meetingID,
        userName: username,
      }
    })

  }


  const handleSubmit = () => {
    rejectMeeting()
  }
  //===============reject meeting end======================

  const rejectData = useSelector((state) => state.RejectMeeting)
  console.log(rejectData, "rejectData")

  const cancel = () => {
     handleClose1()
  }



  return (
    <div>

      <Grid style={{ padding: ".5rem 1rem", width: "390px" }} className="cabinate_container">

        {
          !getAttendeeDetails ?

            <Grid  >

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >

                <h6>COMMENTS</h6>
                <CloseIcon variant="outlined" color="primary" onClick={cancel} />
              </div>

              <TextField
                style={{ marginTop: "10px" }}
                margin="dense"
                id="comment"
                label="COMMENTS"
                multiline
                minRows={6}
                fullWidth
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="e-field e-input"
                variant="outlined"
                name="comment"
              />


              <Grid xs={12}>
                <div className="btn-end" style={{ marginTop: "10px" }}>
                  <Button
                    id="finish_meeting_reject_btn"
                    endIcon={<DoneIcon />}
                    variant="outlined"
                    color="primary"
                    onClick={(e) => { handleSubmit(), cancel(), getcomments() }}
                  >
                    FINISH 
                  </Button>
                </div>
              </Grid>

            </Grid>
            : <UserRejectMeeting  handleClose1 = {handleClose1} meetingID={meetingID}/>}

      </Grid>

    </div>

  )
}

export default MeetingRejected