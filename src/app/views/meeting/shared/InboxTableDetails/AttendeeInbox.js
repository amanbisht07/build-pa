import React, { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PersonIcon from "@material-ui/icons/Person";
import RedoIcon from "@material-ui/icons/Redo";
import DoneIcon from "@material-ui/icons/Done";
import {
  ChairamInboxMeeting,
  getAllComments,
  getuserAttendee,
} from "app/redux/actions/GetInboxDataAction";
import Cookies from "js-cookie";
import {
  Grid,
  Button,
  Paper,
  Tooltip,
  IconButton,
  DialogTitle,
} from "@material-ui/core";

import { Breadcrumb } from "../../../../../matx";
import "../index.css";
import { useTranslation } from "react-i18next";
import {
  ColumnDirective,
  ColumnsDirective,
  Filter,
  GridComponent,
  Inject,
  Page,
  Resize,
  Sort,
} from "@syncfusion/ej2-react-grids";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import MeetingRejected from "../MeetingRejected";
import Box from '@material-ui/core/Box';
import UserForward from "../userAttendee/UserForward";
import AOS from "aos";
import "aos/dist/aos.css";

import CloseIcon from "@material-ui/icons/Close";
import UserAttendeeTabs from "../userAttendee/userAttendeeTabs";
import ChairmanMeetingDetailsTab from "../ChairmanDetails/ChairmanMeetingDetailsTab";
import ChairmanInbox from "../InboxTableDetails/ChairmanInbox";

const MeetingId = createContext();
const HandleClosebtn = createContext();

function AttendeeInbox({meetingID}) {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  // const [userRejects, setuserReject] = React.useState(false);


  //=================commentapiData====================

  const getcomments = () => {
    dispatch(getAllComments(meetingID)), [];
  };

  useEffect(() => {
    getcomments();
  }, []);
  const getAllcommentData = useSelector(
    (state) => state.getAllComments.commets
  );

  //=================  End  commentapiData====================

  //=================  meetingdetails====================

  useEffect(() => dispatch(ChairamInboxMeeting(meetingID)), []);
  const getchairmanMeetingDetails = useSelector(
    (state) => state.chairManMeeting.chairmanMeeting
  );
  console.log(meetingID)

  //=================  End meetingdetails====================



  const { t } = useTranslation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClose1 = () => {
    setOpen1(false);
  };

  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  AOS.init({
    offset: 200,
    duration: 600,
    easing: "ease-in-sine",
    delay: 200,
  });

 
    return (
      <div>
        <Grid
          container
          spacing={3}
          style={{ padding: ".5rem 1rem" }}
          className="cabinate_container"
        >
          <Grid item xs={6}>
            <Breadcrumb
              routeSegments={[
                { name: t("Meeting Details"), path: "/personnel/file" },
              ]}
            />

            <Grid className="cabinate_container">
              <div
                padding={2}
                gap={2}
                sx={{
                  backgroundColor: "white",

                  borderRadius: "16px",
                  height: "520px",
                }}
              >
                <>
                  <div
                    direction="row"
                    justifyContent="space-around"
                    style={{ marginLeft: "80px" }}
                  >
                    <Box
                      width="100%"
                      style={{
                        fontWeight: "500",
                        height: "30px",
                        width: "500px",
                        fontSize: "17px",
                      }}
                    >
                      Title
                    </Box>

                    <Box style={{ width: "100%" }}>
                      { getchairmanMeetingDetails && getchairmanMeetingDetails.title}
                    </Box>
                  </div>
                  <div
                    direction="row"
                    justifyContent="space-between"
                    style={{ marginLeft: "80px" }}
                  >
                    <Box
                      width="100%"
                      style={{
                        fontWeight: "500",
                        height: "30px",
                        width: "500px",
                        fontSize: "17px",
                      }}
                    >
                      ChairMan
                    </Box>

                    <Box style={{ width: "100%" }}>
                      {getchairmanMeetingDetails && getchairmanMeetingDetails.chairman}
                    </Box>
                  </div>
                  <div
                    direction="row"
                    justifyContent="space-between"
                    style={{ marginLeft: "80px" }}
                  >
                    <Box
                      width="100%"
                      style={{
                        fontWeight: "500",
                        height: "30px",
                        width: "500px",
                        fontSize: "17px",
                      }}
                    >
                      Start Date
                    </Box>

                    <Box style={{ width: "100%" }}>
                      {getchairmanMeetingDetails && getchairmanMeetingDetails.startDate}
                    </Box>
                  </div>
                  <div
                    direction="row"
                    justifyContent="space-between"
                    style={{ marginLeft: "80px" }}
                  >
                    <Box
                      width="100%"
                      style={{
                        fontWeight: "500",
                        height: "30px",
                        width: "500px",
                        fontSize: "17px",
                      }}
                    >
                      End Date
                    </Box>

                    <Box style={{ width: "100%" }}>
                      {getchairmanMeetingDetails && getchairmanMeetingDetails.endDate}
                    </Box>
                  </div>
                  {getchairmanMeetingDetails.locationType === "Offline" ? (
                    <div
                      direction="row"
                      justifyContent="space-between"
                      style={{marginLeft: "80px"}}
                    >
                      <Box
                        width="100%"
                        style={{
                          fontWeight: "500",
                          height: "30px",
                          width: "500px",
                          fontSize: "17px",
                        }}
                      >
                        Location Place
                      </Box>

                      <Box style={{ width: "100%" }}>
                        {getchairmanMeetingDetails && getchairmanMeetingDetails.locationPlace}
                      </Box>
                    </div>
                  ) : (
                    <div
                      direction="row"
                      justifyContent="space-between"
                      style={{ marginLeft: "80px" }}
                    >
                      <Box
                        width="100%"
                        style={{
                          fontWeight: "500",
                          height: "30px",
                          width: "500px",
                          fontSize: "17px",
                        }}
                      >
                        Meeting Url
                      </Box>

                      <Box style={{ width: "100%" }}>
                        {getchairmanMeetingDetails && getchairmanMeetingDetails.locationurl}
                      </Box>
                    </div>
                  )}

                  <div
                    direction="row"
                    justifyContent="space-between"
                    style={{ marginLeft: "80px" }}
                  >
                    <Box
                      width="100%"
                      style={{
                        fontWeight: "500",
                        height: "30px",
                        width: "500px",
                        fontSize: "17px",
                      }}
                    >
                      Initiator
                    </Box>

                    <Box style={{ width: "100%" }}>
                      {getchairmanMeetingDetails && getchairmanMeetingDetails.initiator}
                    </Box>
                  </div>
                  <div
                    direction="row"
                    justifyContent="space-between"
                    style={{ marginLeft: "80px" }}
                  >
                    <Box
                      width="100%"
                      style={{
                        fontWeight: "500",
                        height: "30px",
                        width: "500px",
                        fontSize: "17px",
                      }}
                    >
                      Description
                    </Box>

                    <Box style={{ width: "100%" }}>
                      {getchairmanMeetingDetails && getchairmanMeetingDetails.meetingDescription}
                    </Box>
                  </div>

                  <div
                    direction="row"
                    justifyContent="space-between"
                    style={{ marginLeft: "80px" }}
                  >
                    <Box
                      width="100%"
                      style={{
                        fontWeight: "500",
                        height: "30px",
                        width: "500px",
                        fontSize: "17px",
                      }}
                    >
                      Repeat Meeting
                    </Box>

                    <Box style={{ width: "100%" }}>
                      {getchairmanMeetingDetails && getchairmanMeetingDetails.repeatMeeting}
                    </Box>
                  </div>
                </>
              
                  <>
                    <div
                      direction="row"
                      justifyContent="space-between"
                      float="right"
                    >
                      <div style={{ marginTop: "20px" }}>
                        <Button
                          id="attendeeInbox_accept_btn"
                          variant="outlined"
                          color="primary"
                          style={{ marginRight: "20px" }}
                          onClick={handleClickOpen}
                          endIcon={<DoneIcon />}
                        >
                          ACCEPT
                        </Button>

                        <Button
                          id="attendeeInbox_forward_btn"
                          variant="outlined"
                          color="primary"
                          onClick={handleClickOpen2}
                          style={{ marginRight: "20px" }}
                          endIcon={<RedoIcon />}
                        >
                          FORWARD
                        </Button>

                        <Button
                          id="attendeeInbox_reject_btn"
                          variant="outlined"
                          style={{ color: "red", borderColor: "red" }}
                          endIcon={<CloseIcon />}
                          onClick={handleClickOpen1}
                          color="error"
                        >
                          REJECT
                        </Button>
                      </div>
                    </div>
                  </>
                
              </div>
            </Grid>
          </Grid>
          <Grid item xs={6} style={{ marginTop: "27px" }}>
            <Paper
              elevation={3}
              style={{
                position: "relative",
                borderRadius: "18px",
              }}
            >
              {
                <GridComponent
                  dataSource={getAllcommentData}
                  height="425"
                  allowResizing={true}
                  allowSorting={true}
                  allowPaging={true}
                  pageSettings={{ pageCount: 5, pageSizes: true }}
                  filterSettings={{ type: "Menu" }}
                >
                  <ColumnsDirective>
                    <ColumnDirective
                      field="comment"
                      headerText={"COMMENTS"}
                      width="90"
                      textAlign="left"
                    />
                  </ColumnsDirective>
                  <Inject services={[Resize, Page, Sort, Filter]} />
                </GridComponent>
              }
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
              <IconButton
                id="meeting_attendee_close_btn"
                aria-label="close"
                onClick={handleClose}
                style={{
                  float: "right",
                  height: "30px",
                  width: "30px",
                  color: "#3131d5",
                }}
              >
                <Tooltip title={"close"} aria-label="close">
                  <CloseIcon color="primary" />
                </Tooltip>
              </IconButton>
            </DialogTitle>
            <DialogContent width="1100">
           
                <UserAttendeeTabs meetingID={meetingID} />
            
            </DialogContent>
          </Dialog>

          <Dialog open={open1} onClose={handleClose1}>
            <DialogContent width="700px">
              
                <MeetingRejected handleClose1={handleClose1}  meetingID={meetingID}/>
          
            </DialogContent>
          </Dialog>

          <Dialog open={open2} handleClose2={handleClose2} width="700px">
            <DialogContent>
            
                <UserForward handleClose2={handleClose2} meetingID={meetingID} />
            
            </DialogContent>
          </Dialog>
          <Grid />
        </Grid>
      </div>
    );
  };


export { MeetingId, HandleClosebtn };
export default AttendeeInbox;
