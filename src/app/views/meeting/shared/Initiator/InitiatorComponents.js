




import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useTranslation } from "react-i18next";
import InitiatorMeetingDetails from "./InitiatorMeetingDetails";
import MeetingAttendees from "./MeetingAttendees";
import { Grid } from "@material-ui/core";
import "../index.css";
import { Breadcrumb } from "matx";
import MeetingAgenda from "./MeetingAgenda";
import MeetingDecision from "./MeetingDecision";
import MeetingMom from "./MeetingMom";
import MeetingTask from "./MeetingTask";
import GroupAddIcon from "@material-ui/icons/GroupAdd";

function TabPanel(props) {
  
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
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
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function InitiatorComponets({ MeetingIds }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { t } = useTranslation();

  return (
    <>
      <Grid
        container
        style={{ padding: "0 0 0  .5rem" ,backgroundColor:"#f9f9f9"}}
        className="cabinate_container"
      >
        <Grid item xs={12}>
          <Breadcrumb
            routeSegments={[
              { name: "Meeting Information", path: "/personnel/file" },
            ]}
          />
        </Grid>

        <Grid
          item
          xs={2}
          className="initiator_details"
          style={{ height: "300px ", marginTop: "1.6rem" }}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            height={Number(window.innerHeight - 430)}
            style={{
              padding: "4px",
              paddingBottom: "8px",
              boxShadow:
                "0px 2px 4px -1px rgb(0 0 0 / 6%), 0px 4px 5px 0px rgb(0 0 0 / 4%), 0px 1px 10px 0px rgb(0 0 0 / 4%)",
              backgroundColor: "#f9f9f9",
              borderRadius: "6px",
            }}
          >
            <Tab  label={t("MEETING DETAILS")} {...a11yProps(0)}/>
            <Tab   label={t("ATTENDEES")} {...a11yProps(1)} />
            <Tab label={t("AGENDA")} {...a11yProps(2)} />
            <Tab label={t("DECISION")} {...a11yProps(3)} />
            <Tab label={t("TASK")} {...a11yProps(4)} />
            <Tab label={t("MOM & ATTACHMENTS")} {...a11yProps(5)} />
          </Tabs>
        </Grid>

        <Grid item xs={10}>
          <TabPanel value={value} index={0}>
            <InitiatorMeetingDetails MeetingIds={MeetingIds} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <MeetingAttendees MeetingIds={MeetingIds} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <MeetingAgenda MeetingIds={MeetingIds} />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <MeetingDecision MeetingIds={MeetingIds} />
          </TabPanel>
          <TabPanel value={value} index={4}>
            <MeetingTask MeetingIds={MeetingIds} />
          </TabPanel>
          <TabPanel value={value} index={5}>
            <MeetingMom MeetingIds={MeetingIds} />
          </TabPanel>
        </Grid>
      </Grid>
    </>
  );
}
