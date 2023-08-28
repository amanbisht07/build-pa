import { Grid, TextField, IconButton, Button } from "@material-ui/core";
import Cookies from "js-cookie";
import "../index.css";
import React, { useState } from "react";
import CloseIcon from "@material-ui/icons/HighlightOff";
import { useDispatch } from "react-redux";
import { reScheduleMeeting } from "app/redux/actions/CreateMeetingAction";
import { duration } from "moment";

function MeetingReSchedule({ closebtn }) {
  const dispatch = useDispatch();
  const meetingId = Cookies.get("MeetingId");
  const [formdatas, setformdatas] = useState({
    chairmanDept: "",
    chairman: "",
    startDate: "",
    endDate: "",
   
  });
  const { chairmanDept, chairman, startDate, endDate, } = formdatas;
  const [comment, setcomment] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setformdatas({
      ...formdatas,

      [name]: value,
    });
  };

  const reSchedule = () => {
    dispatch(reScheduleMeeting(meetingId,comment, formdatas));
  };

  return (
    <div>
      <IconButton
        id="reschedule_close_btn"
        aria-label="close"
        onClick={closebtn}
        style={{
          float: "right",
          height: "30px",
          width: "30px",
          color: "#3131d5",
        }}
      >
        <CloseIcon />
      </IconButton>

      <TextField
        autoFocus
        margin="dense"
        id="chairmanDept"
        label="chairmanDept"
        type="text"
        size="small"
        className="e-field e-input"
        fullWidth
        variant="outlined"
        name="chairmanDept"
        value={chairmanDept}
        onChange={handleInputChange}
      />
      <TextField
        autoFocus
        margin="dense"
        id="chairman"
        label="chairman"
        type="text"
        size="small"
        className="e-field e-input"
        fullWidth
        variant="outlined"
        name="chairman"
        value={chairman}
        onChange={handleInputChange}
      />
      <Grid container spacing={2}>
        <Grid item sx={6}>
          <TextField
            id="startDate"
            margin="dense"
            label="Start Date"
            variant="outlined"
            size="small"
            type="datetime-local"
            name="startDate"
            value={startDate}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item sx={6}>
          <TextField
            id="End Date"
            margin="dense"
            label="endDate"
            variant="outlined"
            type="datetime-local"
            size="small"
            name="endDate"
            value={endDate}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>
      {/* <TextField
        margin="dense"
        id="duration"
        label="duration"
        type="text"
        size="small"
        className="e-field e-input"
        fullWidth
        variant="outlined"
        name="duration"
        value={duration}
        onChange={handleInputChange}
      /> */}

      <TextField
        margin="dense"
        id="comment"
        label="Comments"
        multiline
        rows={6}
        fullWidth
        className="e-field e-input"
        variant="outlined"
        name="comment"
        value={comment}
        onChange={(e)=>setcomment(e.target.value)}
      />
      <Button id="reschedule_meeting_btn" variant="outlined" color="primary" onClick={reSchedule} style={{float:"right",marginTop:"20px"}}> Reshedule</Button>
    </div>
  );
}

export default MeetingReSchedule;
