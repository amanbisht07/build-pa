import React, { useState } from "react";
import {
  Card,
  Grid,
  Typography,
  Paper,
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@material-ui/core";
import StartProcessPage from "../../initiate/shared/startProcess/StartProcessPage";
import TableCard2 from "./TableCard2";
import TableCard3 from "./TableCard3";
import { PropTypes } from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import PdfViewer from "../../../pdfViewer/pdfViewer";
import CloseIcon from "@material-ui/icons/Close";
import VerticalSplitIcon from "@material-ui/icons/VerticalSplit";
import history from "../../../../history";
import { useTranslation } from "react-i18next";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
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
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
}));

const Tab1 = (props) => {
  const { t } = useTranslation();
  let { currentData, mapPdfData } = props;
  let newData = JSON.parse(currentData);
  const [open, setOpen] = useState(false);
  const [noting, setNoting] = useState(false);
  const [enclosure, setEnclosure] = useState(false);
  const [urlFile, setUrlFile] = useState("");
  const enclouserColumns = [
    { name: "fileNo", title: "#" },
    { name: "enclouserDesc", title: "Enclouser Description" },
    { name: "by", title: "By" },
  ];
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  console.log("Data:" + newData["fileName"]);
  const [fileId, setFileId] = useState(newData["fileid"]);
  const [draftId, setDraftId] = useState(newData["id"]);

  const rows = [
    // {id: 1, fileNo: "Test01", subject: "Male", type: "Delhi", createdOn: "Benz"}
  ];
  const [searchValue, setSearchState] = React.useState("");

  const groupingPanelMessages1 = {
    groupByColumn: "Enclousers",
  };

  const [defaultEnclouserColumnWidths] = React.useState([
    { columnName: "fileNo", width: 120 },
    { columnName: "enclouserDesc", width: 200 },
    { columnName: "by", width: 140 },
  ]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const mapPdfNoting1 = (value) => {
    console.log(value);
    setNoting(value);
    setEnclosure(false);
    if (value === true) {
      console.log(noting);
      setValue(1);
    }
  };

  const handleCloseEvent = (e) => {
    setOpen(e);
  };

  const mapPdfEnclosure1 = (value) => {
    console.log(value);

    setEnclosure(value);
    setNoting(false);
    if (value === true) {
      console.log(enclosure);

      setValue(2);
    }
  };

  const fileUrl = (url) => {
    console.log(url);
    setUrlFile(url);
  };

  const NavigateToApproveFile = () => {
    console.log(currentData);
    let data = JSON.parse(currentData);
    history.push({ pathname: "/costa/file/approval", state: data });
  };

  return (
    <Card elevation={3} className="pt-20 mb-24">
      <Grid container>
        <Grid item xs={3} style={{ marginLeft: "5px" }}>
          <Typography variant="caption" display="block" gutterBottom>
            {t("file")} #: {newData["fileName"]}
          </Typography>
        </Grid>
        <Dialog
          open={open}
          // PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
          maxWidth="md"
        >
          <DialogTitle id="draggable-dialog-title" onClose={handleClose}>
            {t("forward_file_for_review_approval")}
            <IconButton
              id="review_approval_close_button"
              aria-label="close"
              onClick={handleClose}
              color="primary"
              style={{ float: "right" }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <StartProcessPage
              process={"sendFile"}
              fileId={draftId}
              handleCloseEvent={handleCloseEvent}
            />
          </DialogContent>
          {/*<DialogActions>
                        <Button autoFocus onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>*/}
        </Dialog>

        <Grid item xs={3}>
          <Typography variant="caption" display="block" gutterBottom>
            {t("subject")}: {newData["subject"]}
          </Typography>
        </Grid>
        <Grid item sx={5} style={{ width: "40%" }}>
          <Card></Card>
        </Grid>
        <Grid item xs={1}>
          <IconButton
            id="NavigateToApproveFile_button"
            aria-label="delete"
            className={classes.margin}
            onClick={NavigateToApproveFile}
          >
            <VerticalSplitIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Grid container>
        <Grid xs={6}>
          <Grid xs direction={"column"}>
            <div className="ml-10 mb-10">
              <Paper style={{ overflow: "hidden" }}>
                <TableCard2
                  draftId={draftId}
                  fileID={fileId}
                  getFileURL={fileUrl}
                  mapPdfNoting={mapPdfNoting1}
                />
              </Paper>
            </div>
          </Grid>
          <Grid xs>
            <div className="ml-10 mb-10">
              <Paper style={{ overflow: "hidden" }}>
                <TableCard3
                  draftId={draftId}
                  fileID={fileId}
                  getFileURL={fileUrl}
                  mapPdfEnclosure={mapPdfEnclosure1}
                />
              </Paper>
            </div>
          </Grid>
        </Grid>
        <Grid xs={6}>
          <div className="ml-10 mb-10">
            <AppBar position="static" color="default">
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                <Tab label="BM" {...a11yProps(0)} />
                <Tab label="Noting" {...a11yProps(1)} />
                <Tab label="Enclosure" {...a11yProps(2)} />
              </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
              BM
            </TabPanel>
            <TabPanel value={value} index={1}>
              <PdfViewer fileUrl={urlFile} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <PdfViewer fileUrl={urlFile} />
            </TabPanel>
          </div>
        </Grid>
      </Grid>
      <Grid
        container
        justifyContent="center"
        className="mb-10"
        style={{ marginTop: "10px" }}
      >
        <ButtonGroup
          variant="contained"
          color="primary"
          aria-label="contained primary button group"
        >
          <Button id="sendFile_button" onClick={handleClickOpen}>{t("send")}</Button>
          <Button id="closeFile_button">{t("close_file")}</Button>
          <Button id="linkFile_button">{t("link_files")}</Button>
          <Button id="ericFile_button">{t("eric")}</Button>
          <Button id="action_point_button">{t("action_point")}</Button>
          <Button id="downloadFile_button">{t("download")}</Button>
        </ButtonGroup>
      </Grid>
    </Card>
  );
};

export default Tab1;
