import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import "../index.css"
import { useTranslation } from "react-i18next";
import UserMeetingDetailsTable from "./UserMeetingDetailsTable";
import UserAgendaTable from "./UserAgendaTable";

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

function UserAttendeeTabs({meetingID}) {
  const { t } = useTranslation();

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const backStep = (e) => {
    handleBack();
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
            label={t("ATTENDING  TABLE")}
            {...a11yProps(0)}
          />
          <Tab
            className="childinitaior"
            label={t("AGENDA TABLE")}
            {...a11yProps(1)}
            style={{marginLeft:"90px"}}
          />
        
        </Tabs>
      </AppBar>
     
      <TabPanel value={value} index={0}>
        <UserMeetingDetailsTable  meetingID={meetingID}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <UserAgendaTable meetingID={meetingID} />
      </TabPanel>
    
    </div>
  );
}

export default UserAttendeeTabs;
