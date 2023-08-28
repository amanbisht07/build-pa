import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import AttendeesForm from "../Attendees";
import ExternalAttendee from "./ExternalAttendee";
import GroupDepartment from "./GroupDepartment";
import { useTranslation } from "react-i18next";
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from "react-redux";
import { sendToChairman } from "app/redux/actions/CreateMeetingAction";
import AttendingDepartment from "./AttendingDepartment";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DoneIcon from '@material-ui/icons/Done';

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
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

function AttendeeTab({ handleClose1, getAllMeetingData, handleBack }) {
  const { t } = useTranslation();

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const backStep = (e) => {
    handleBack();
  };

  const MeetingsId = useSelector((state) => state.createMeetings.meetingId);

  const dispatch = useDispatch();

  const MeetingSendToChairMan = () => {
    dispatch(sendToChairman(MeetingsId, getAllMeetingData));
    handleClose1();
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab
            className="childinitaior"
            label={t("ATTENDING  USER")}
            {...a11yProps(0)}
          />
          <Tab
            className="childinitaior"
            label={t("ATTENDING DEPARTMENT")}
            {...a11yProps(1)}
          />
          <Tab
            className="childinitaior"
            label={t("GROUP DEPARTMENT")}
            {...a11yProps(2)}
          />
          <Tab
            className="childinitaior"
            label={t("EXTERNAL USER")}
            {...a11yProps(3)}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <AttendeesForm
          handleClose1={handleClose1}
          getAllMeetingData={getAllMeetingData}
          handleBack={handleBack}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AttendingDepartment />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <GroupDepartment />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ExternalAttendee />
      </TabPanel>
      <Button
        id="MeetingSendToChairMan_save_button"
        style={{ float: "right" }}
        endIcon={<DoneIcon />}
        variant="outlined"
        color="primary"
        onClick={MeetingSendToChairMan}
      >
        Save
      </Button>
      <Button
        id="MeetingSendToChairMan_back_button"
        variant="outlined"
        color="primary"
        startIcon={<ArrowBackIcon/>}
        onClick={backStep}
        style={{ float: "right", marginRight: "20px" }}
      >
        Back 
      </Button>
    </div>
  );
}

export default AttendeeTab;
