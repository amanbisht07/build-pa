import React, { useEffect } from "react";
import "../index.css";
import { Grid, Button, Box, Fab, Tooltip, Typography, TableCell } from "@material-ui/core";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import MeetingReSchedule from "./MeetingReSchedule";
import MeetingAttendees from "./MeetingAttendees";
import { ChairamInboxMeeting } from "app/redux/actions/GetInboxDataAction";
import SendIcon from "@material-ui/icons/Send";
import DraftsIcon from "@material-ui/icons/Drafts";
import HistoryIcon from "@material-ui/icons/History";
import CancelIcon from "@material-ui/icons/Cancel";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { InitiatorCancelMeeting } from "app/redux/actions/CreateMeetingAction";
import history from "history.js";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";


import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';




function InitiatorMeetingDetails({ MeetingIds }) {
  const MeetingID = Cookies.get("MeetingId");
  const dispatch = useDispatch();

  const [reSchedule, setReSchedule] = React.useState(false);
  const [Attendess, setAttendess] = React.useState(false);

  const handleReScheduleOpen = () => {
    setReSchedule(true);
  };

  const handleReScheduleClose = () => {
    setReSchedule(false);
  };

  const handleAttendessOpen = () => {
    setAttendess(true);
  };

  const handleAttendessClose = () => {
    setAttendess(false);
  };

  useEffect(() => MeetingIds && dispatch(ChairamInboxMeeting(MeetingIds)), []);

  const getchairmanMeetingDetails = useSelector(
    (state) => state.chairManMeeting.chairmanMeeting
  );

  const backBtn = () => {
    history.push("/eoffice/Meeting/meetingschedule");
  };
 

  const cancelMeeting = () => {
    dispatch(InitiatorCancelMeeting(MeetingIds));
    backBtn();
    
  };




  // --------------table start -------------------

  const columns = [
    { id: 'name', label: <p className="mainclasscss" > HEADING </p>, minWidth: 170 },
    { id: 'code', label: <p className="mainclasscss" >DESCRIPTION </p>, minWidth: 100 },

  ]

  function createData(name, code, population, size) {
    const density = population / size;
    return { name, code, population, size, density };
  }

  const rows = [
    createData(<p className="mainclasscss">Title</p>, `${getchairmanMeetingDetails.title}`),
    createData(<p className="mainclasscss" >ChairMan</p>, `${getchairmanMeetingDetails.chairman}`),
    createData(<p className="mainclasscss">Start Date</p>, `${getchairmanMeetingDetails.startDate}`),
    createData(<p className="mainclasscss">End Date</p>, `${getchairmanMeetingDetails.endDate}`),
    createData(<p className="mainclasscss">Location Place</p>, `${getchairmanMeetingDetails.locationPlace}`),
    createData(<p className="mainclasscss">Initiator</p>, `${getchairmanMeetingDetails.initiator}`),
    createData(<p className="mainclasscss">ProposedLevel</p>, `${getchairmanMeetingDetails.proposedLevel}`),
    createData(<p className="mainclasscss">Description</p>, `${getchairmanMeetingDetails.meetingDescription}`),

  ];

  const useStyles = makeStyles({
    root: {
      width: '100%',

    },
    container: {
      height: window.innerHeight - 100,
      border: "1px solid #ccc"
    },
  });


  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <div
        fontSize={16}
        padding={2}
        gap={2}
        sx={{
          paddingRight: "30px",
          borderRadius: "9px",
          height: window.innerHeight - 100,
          marginLeft: "2.5rem",
          
        }}
      >
      

        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table" className="mainclasscss">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  return (
                    <TableRow >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} >
                            { value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ); 
                })}
              </TableBody>
            </Table>
        <div className="initiator-btn">
          <Button
            id="initiator_cancel_meeting"
            variant="outlined"
            color="error"
            style={{ color: "red", borderColor: "red" }}
            onClick={cancelMeeting}
          >
            Cancel Meeting
            <CancelIcon style={{ marginLeft: "15px" }} />
          </Button>
          <Button
            id="initiator_re-schedule_meeting"
            variant="outlined"
            color="primary"
            onClick={handleReScheduleOpen}
          >
            Re-Schedule Meeting
            <HistoryIcon style={{ marginLeft: "15px" }} />
          </Button>
          {/* <Button variant="outlined" color="primary">
            Meeting Invitation
            <DraftsIcon style={{ marginLeft: "15px" }} />
          </Button>

          <Button variant="outlined" color="primary">
            Send Reminder <SendIcon style={{ marginLeft: "15px" }} />
          </Button> */}
        </div>
          </TableContainer>

        </Paper>
      </div>

      {/* rescheduler dialoge */}
      <Dialog open={reSchedule}>
        <DialogContent width="800px">
          <MeetingReSchedule closebtn={handleReScheduleClose} />
        </DialogContent>
      </Dialog>

      {/*  end rescheduler dialoge */}

      {/* Attendess dialoge */}
      <Dialog open={Attendess}>
        <DialogContent width="800px">
          <MeetingAttendees closebtn={handleAttendessClose} />
        </DialogContent>
      </Dialog>

       {/* end Attendess dialoge */}

    </>
  );
}







export default InitiatorMeetingDetails;
