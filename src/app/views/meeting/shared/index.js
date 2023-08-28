import React, { useState, useEffect, useRef } from "react";

import { connect, useDispatch, useSelector } from "react-redux";
import {
  getAllMeeting,

} from "app/redux/actions/CreateMeetingAction";
import history from "history.js";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from "@material-ui/icons/Close";

import "./index.css";

import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";

import axios from "axios";
import "./index.css";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Paper,
  Tooltip,
} from "@material-ui/core";
import ActiveStep from "./ActiveStep";
import Calendar from "./Calendar";
import { Breadcrumb } from "matx";
import Divider from "@material-ui/core/Divider";

import { makeStyles } from "@material-ui/core/styles";

import Drawer from "@material-ui/core/Drawer";
import { ChairamInboxMeeting } from "app/redux/actions/GetInboxDataAction";

import InitiatorComponets from "./Initiator/InitiatorComponents";
import { toast } from "react-toastify";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

import { sendfillterdata } from "app/redux/actions/addAgendaAction";

const Scheduler = () => {
  const [value, setValue] = React.useState("all");

  const handleChanges = (event) => {
    setValue(event.target.value);
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
    },
    "& > *": {
      margin: theme.spacing(1),
    },

    divZIndex: {
      zIndex: "0",
      "& .MuiDialogContent-dividers": {
        padding: "0px 0px !important",
      },
      "& #pdfV": {
        height: "calc(100vh - 47px) !important",
      },
      "& .e-de-ctn": {
        height: "calc(100vh - 48px) !important",
      },
    },

    appBar: {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: drawerWidth,
    },
    title: {
      flexGrow: 1,
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
      top: "10%",
      height: "80%",
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: "flex-end",
      background: "	#cecbdf ",
      height: "32px !important",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginRight: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    },
  }));

  const drawerWidth = 700;

  const [data, setdata] = useState({
    date: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

  const handleClickOpens = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen1(false);
  };

  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
  };

  function handleChange(value) {
    setdata({
      date: value.getDate(),
      year: value.getFullYear(),
      month: value.getMonth(),
    });
  }

  const [MeetingIds, setMeetingIds] = useState("");

  const handleclickOpen = (args) => {
    handleDrawerOpen(args.data.meetingId);
    setMeetingIds(args.data.meetingId);
    setOpen1(true);
  };

  const dispatch = useDispatch();

  const handleDrawerOpen = (meetingId) => { meetingId && dispatch(ChairamInboxMeeting(meetingId)) };

  const getAllMeetingsData = () => {
    dispatch(getAllMeeting());
  };

  useEffect(() => {
    getAllMeetingsData();
  }, []);

  const getAllMeetingData = useSelector(
    (state) => state.getAllMeeting.getAllMeeting
  );


  const onEventRendered = (args) => {
    if (args.data.meetingStatus === "created") {
      args.element.style.backgroundColor = "#3f51b5";
    } else if (
      args.data.status === "chairman" &&
      args.data.meetingStatus === "Approved"
    ) {
      args.element.style.backgroundColor = "orange";
    } else if (args.data.meetingStatus === "Approved") {
      args.element.style.backgroundColor = "green";
    }
    else if (args.data.meetingStatus === "Cancelled") {
      args.element.style.backgroundColor = "black";
    }
  };

  const filterData = (meetingStatus, status, isMeetingStatus) => {
    dispatch(sendfillterdata(meetingStatus, status, isMeetingStatus));
  };

  // add a day

  const [start, setStart] = useState(date);

  const date = new Date();
  const date1 = start


  const onPopupOpen = (args) => {
    setStart(args.data.StartTime);
    console.log(args)
    if (args.type === "Editor") {
      args.cancel = true;

      if (args.target.classList.contains("e-appointment")) {
        handleclickOpen(args);
        args.cancel = true;
      } else {
        handleClickOpens();
        args.cancel = true;
      }
    }


    if (args.type === "QuickInfo") {
      args.cancel = true;
    }
  };

  return (
    <>
      <div style={{ backgroundColor: "#f5f5f5" }}>
        <Grid style={{ padding: ".5rem 1rem" }} className="cabinate_container">
          <Grid item xs={12}>
            <Breadcrumb
              routeSegments={[{ name: "Meeting", path: "/personnel/file" }]}
            />
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={3} style={{ width: "100%" }}>
              <Calendar handleChange={handleChange} />
              <div className="filter-data">
                <Paper
                  style={{
                    padding: 8,
                    marginTop: "15px",
                  }}
                >
                  <FormControl
                    component="fieldset"
                    style={{ marginTop: "10px", fontSize: "16px" }}
                  >
                    <FormLabel component="legend">
                      <h5>Filter By Status </h5>
                    </FormLabel>
                    <RadioGroup
                      aria-label="filter"
                      value={value}
                      onChange={handleChanges}
                    >
                      <FormControlLabel
                        value="all"
                        onClick={getAllMeetingsData}
                        style={{ color: "black", fontSize: "16px" }}
                        control={<Radio style={{ color: "black" }} />}
                        label="All"
                      />

                      <FormControlLabel
                        value="Approved"
                        onClick={() => filterData("Approved", "", "true")}
                        style={{ color: "green" }}
                        control={<Radio style={{ color: "green" }} />}
                        label="Approved"
                      />

                      <FormControlLabel
                        value="Initiator"
                        onClick={() => filterData("created", "", "true")}
                        style={{ color: "rgb(63 81 181)" }}
                        control={<Radio style={{ color: "rgb(63 81 181)" }} />}
                        label="Created"
                      />

                      <FormControlLabel
                        value="Reject"
                        onClick={() => filterData("Reject", "", "true")}
                        style={{ color: "red" }}
                        control={<Radio style={{ color: "red" }} />}
                        label="Rejected"
                      />
                      <FormControlLabel
                        value="chairman"
                        onClick={() => filterData("", "chairman", "false")}
                        style={{ color: "orange" }}
                        control={<Radio style={{ color: "orange" }} />}
                        label="Chairman"
                      />
                      <FormControlLabel
                        value="attendee"
                        onClick={() => filterData("", "attendee", "false")}
                        style={{ color: "rgb(6,57,112)" }}
                        control={<Radio style={{ color: "attendee" }} />}
                        label="Attendee"
                      />
                    </RadioGroup>
                  </FormControl>
                </Paper>
              </div>
            </Grid>

            <Grid item xs={9}>
              <div
                className="control-pane"
                style={{ backgroundColor: "#f1f1f1" }}
              >
                <div
                  id="targetElement"
                  className="control-section col-lg-12 defaultDialog dialog-target"
                >
                  <ScheduleComponent
                    height="630px"
                    selectedDate={new Date(data.year, data.month, data.date)}
                    showQuickInfo={true}
                    popupOpen={onPopupOpen}
                    eventSettings={{ dataSource: getAllMeetingData }}
                    readonly={false}
                    className="qucik"
                    eventRendered={onEventRendered}
                  >
                    <ViewsDirective>
                      <ViewDirective option="Day" />
                      <ViewDirective option="Week" />
                      <ViewDirective option="WorkWeek" />
                      <ViewDirective isSelected={true} option="Month" />
                    </ViewsDirective>
                    <Inject
                      services={[
                        Day,
                        Week,
                        WorkWeek,
                        Month,

                        Resize,
                        DragAndDrop,
                      ]}
                    />
                  </ScheduleComponent>
                  <Dialog
                    open={open}

                    className="index_dialoge meetingform"
                  >
                    <DialogTitle>
                      CREATE MEETING
                      <IconButton
                        id="close_create_meeting_btn"
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
                          <CloseIcon color="primary" fontSize="medium" />
                        </Tooltip>
                      </IconButton>
                    </DialogTitle>
                    <DialogContent style={{ width: "750px" }}>
                      <ActiveStep
                        getAllMeetingData={getAllMeetingsData}
                        handleClose={handleClose}
                        starttime={start}
                        date={date1}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </Grid>
          </Grid>
        </Grid>

        <Drawer
          transitionDuration={{ enter: 500, exit: 500 }}
          className={classes.drawer}
          variant="persistent"
          anchor="right"
          open={open1}
          style={{ opacity: "0.8px !important", backgroundColor: "red !important" }}
          drawerWidth={800}
          overl
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              backgroundColor: "#f9f9f9",
            }}
          >
            <CloseIcon color="primary" onClick={handleDrawerClose}></CloseIcon>
          </div>
          <Divider />

          <InitiatorComponets MeetingIds={MeetingIds} />
        </Drawer>
      </div>
    </>
  );
};

export default Scheduler;
