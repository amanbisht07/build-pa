import React, { useContext, useEffect } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from '@material-ui/core/Box';
import Typography from "@material-ui/core/Typography";
import { Grid, IconButton, Tooltip } from "@material-ui/core";
import "../index.css";
import { getuserAttendee } from "app/redux/actions/GetInboxDataAction";
import { MeetingId, HandleClosebtn } from "../GetMeetingDetails";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from '@material-ui/icons/Close';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function BasicTabs({ tabs, tabs1 }) {
  const MeetingID = useContext(MeetingId);
  const handleclose = useContext(HandleClosebtn);

  //=================  userAttendees====================
  const dispatch = useDispatch();

  const UserAttendees = () => {
    dispatch(getuserAttendee(MeetingID)), [];
  };

  useEffect(() => {
    UserAttendees();
  }, []);

  const getAttendeeDetails = useSelector(
    (state) => state.UserAttendee.attendee
  );

  //================= end  userAttendees====================
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

 

  return (
    <Grid container >
      {!getAttendeeDetails ? (
        <Grid item xs={12}>
          <Box>
            <IconButton
              id="attendeeDetails_close_btn"
              aria-label="close"
              onClick={handleclose}
              style={{
                float: "right",
                height: "30px",
                width: "30px",
                color: "#3131d5",
                position: "relative",
                right: "-.7rem",
                top: "-2.6rem",
              }}
            >
              <Tooltip title={"close"} aria-label="close">
                <CloseIcon color="primary" />
              </Tooltip>
            </IconButton>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="simple tabs example"
              textColor="primary"
              indicatorColor="primary"
              style={{marginTop:"2rem"}}
              className = "newclass"
            >
              {tabs.map(({ label }, i) => (
                <Tab className="childinitaior" label={label} key={i} />
              ))}
            </Tabs>
          </Box>
          {tabs.map(({ Component }, i) => (
            <TabPanel value={value} index={i} key={i}>
              {Component}
            </TabPanel>
          ))}
        </Grid>
      ) : (
        <Grid item xs={12}>
          <Box>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              className = "newclasstab"
            >
              {tabs1.map(({ label }, i) => (
                <Tab label={label} key={i} />
              ))}
            </Tabs>
          </Box>
          {tabs1.map(({ Component }, i) => (
            <TabPanel value={value} index={i} key={i}>
              {Component}
            </TabPanel>
          ))}
        </Grid>
      )}
    </Grid>
  );
}
