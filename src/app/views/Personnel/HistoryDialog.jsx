import {
  DialogContent,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@material-ui/lab";
import React from "react";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  historyTimeLine: {
    justifyContent: "flex-start",
    "& .MuiTimelineOppositeContent-root": {
      flex: "none",
    },
  },
}));

const HistoryDialog = (props) => {
  const { historyData } = props;
  const classes = useStyles();

  return (
    <DialogContent dividers style={{ maxHeight: "600px" }}>
      <Timeline align="left">
        {historyData.map((item, index) => (
          <TimelineItem
            key={item.id}
            className={classes.historyTimeLine}
            style={{ display: "flex" }}
          >
            <TimelineOppositeContent>
              <Typography variant="body2" color="textSecondary">
                {item.typo}
              </Typography>
            </TimelineOppositeContent>

            <TimelineSeparator>
              <TimelineDot
                color={item.color || "grey"}
                variant={item.variant || "outlined"}
              ></TimelineDot>
              {historyData.length === index + 1 ? "" : <TimelineConnector />}
            </TimelineSeparator>

            <TimelineContent>
              <Paper
                elevation={3}
                className={classes.paper}
                style={{ backgroundColor: "#eaeaea", display: "flex" }}
              >
                <Typography
                  variant="body2"
                  style={{ fontWeight: "bold", color: "#000" }}
                >
                  {item.title}
                  {item.title === "Created Personal Application" ? "" : ":"}
                  &nbsp;
                </Typography>
                <Typography style={{ color: "#000" }}>
                  {item.description}
                </Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </DialogContent>
  );
};

export default HistoryDialog;
