import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Typography,
  IconButton,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import "../../therme-source/material-ui/loading.css";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  textField: {
    // height: "20px !important",
  },
  TableCell: {
    height: "30px",
  },
  Serial_number: {
    position: "relative",
    left: "2rem",
    width: "120px",
  },
});

const CloudTable = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const data = [
    {
      id: "649e9c316f98845532cc8d31",
      pfileName: "PA-IAF-1200-3-1",
      subject: "testing",
      comment: "oY1v0HtYdGsttAZTNdw0qA==",
      fileURL:
        "1200/IAF-1200-3/PA-IAF-1200-3-1/1f4448fd-acbb-4b63-8fd1-62e842f20aec",
      displayPfileName: "IAF/1200/Pers/3/PA/1",
      status: "In Progress",
      createdOn: "30/06/2023 02:43 PM",
      notificationStatus: 0,
      prevSubject: null,
      userName: null,
      roleName: null,
      prevVersionId: null,
      currVersionId: null,
      annotationId: null,
      signed: true,
      pfileId: null,
      partCase: false,
    },
    {
      id: "649e7886b4d3e120f796f6d8",
      pfileName: "PA-IAF-1200-2-3",
      subject: "test34",
      comment: "WqWTGCSyrGSGj1INIWWFcg==",
      fileURL:
        "1200/IAF-1200-2/PA-IAF-1200-2-3/00c89fa5-734d-4715-9264-fb0bfdcce332",
      displayPfileName: "IAF/1200/Pers/2/PA/3",
      status: "In Progress",
      createdOn: "30/06/2023 12:10 PM",
      notificationStatus: 0,
      prevSubject: null,
      userName: null,
      roleName: null,
      prevVersionId: null,
      currVersionId: null,
      annotationId: null,
      signed: true,
      pfileId: null,
      partCase: false,
    },
    {
      id: "649e7656b4d3e120f796f6d6",
      pfileName: "PA-IAF-1200-2-2",
      subject: "new",
      comment: "",
      fileURL:
        "1200/IAF-1200-2/PA-IAF-1200-2-2/7a5cbdb2-a699-4ea5-b6f6-a2552193fd9d",
      displayPfileName: "IAF/1200/Pers/2/PA/2",
      status: "Draft",
      createdOn: "30/06/2023 11:59 AM",
      notificationStatus: 0,
      prevSubject: null,
      userName: null,
      roleName: null,
      prevVersionId: null,
      currVersionId: null,
      annotationId: null,
      signed: false,
      pfileId: null,
      partCase: false,
    },
    {
      id: "649e7430b4d3e120f796f6d4",
      pfileName: "PA-IAF-1200-2-1",
      subject: "ten 2",
      comment: "MlC0IHnchGkEm/WH9AvFQw==",
      fileURL:
        "1200/IAF-1200-2/PA-IAF-1200-2-1/16357268-d4bd-46e4-83e9-026523d722b3",
      displayPfileName: "IAF/1200/Pers/2/PA/1",
      status: "In Progress",
      createdOn: "30/06/2023 11:51 AM",
      notificationStatus: 0,
      prevSubject: null,
      userName: null,
      roleName: null,
      prevVersionId: null,
      currVersionId: null,
      annotationId: null,
      signed: true,
      pfileId: null,
      partCase: false,
    },
    {
      id: "649e5e1db4d3e120f796f6d2",
      pfileName: "PA-IAF-1200-1-1",
      subject: "ten",
      comment: "G13C3VxVmLVRHV8VuwNJUw==",
      fileURL:
        "1200/IAF-1200-1/PA-IAF-1200-1-1/9a7f93cb-37eb-482f-833c-1be55724baac",
      displayPfileName: "IAF/1200/Pers/1/PA/1",
      status: "In Progress",
      createdOn: "30/06/2023 10:19 AM",
      notificationStatus: 0,
      prevSubject: null,
      userName: null,
      roleName: null,
      prevVersionId: null,
      currVersionId: null,
      annotationId: null,
      signed: true,
      pfileId: null,
      partCase: false,
    },
  ];

  const handleClick = (rowData) => {
    console.log("handleDoubleClicked", rowData);
    history.push({
      pathname: "/eoffice/splitView/file",
      state: rowData.subject,
    });
  };
  return (
    <div className="container">
      <Dialog
        open={props.opencloud}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        onClose={props.handleCloseCloudTable}
      >
        <DialogTitle>
          <div className="close_content">
            <Typography variant="h5">
              Upload Enclosure From File Cabinet
            </Typography>
            <IconButton onClick={props.handleCloseCloudTable}>
              <CloseIcon style={{ fontSize: "2rem" }} />
            </IconButton>
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent id="cloud_dialog">
          <Typography className="select_text">
            Please select the parent file
          </Typography>
          <Grid container spacing={2} style={{ marginTop: "5px" }}>
            <Grid item sm={6}>
              <TextField
                variant="outlined"
                className={classes.textField}
                fullWidth
                label="File"
                size="small"
              />
            </Grid>
            <Grid item sm={6}>
              <TextField
                variant="outlined"
                className={classes.textField}
                fullWidth
                label="Subject"
                size="small"
              />
            </Grid>
          </Grid>
          <div className="cloud_table">
            <Table>
              <TableHead id="tab_head">
                <TableRow>
                  <TableCell
                    className={classes.Serial_number}
                    style={{ fontSize: "1rem" }}
                  >
                    S.N
                  </TableCell>
                  <TableCell style={{ fontSize: "1rem" }}>File#</TableCell>
                  <TableCell style={{ fontSize: "1rem" }}>Subject</TableCell>
                  <TableCell style={{ fontSize: "1rem" }}>CreateOn</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, i) => (
                  <TableRow
                    key={i}
                    hover
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      handleClick(item);
                    }}
                  >
                    <TableCell
                      className={classes.TableCell}
                      style={{
                        position: "relative",
                        left: "2rem",
                        fontSize: "0.7rem",
                      }}
                    >
                      {i + 1}
                    </TableCell>
                    <TableCell
                      className={classes.TableCell}
                      style={{ fontSize: "0.7rem" }}
                    >
                      {item.pfileName}
                    </TableCell>
                    <TableCell
                      className={classes.TableCell}
                      style={{ fontSize: "0.7rem" }}
                    >
                      {item.subject}
                    </TableCell>
                    <TableCell
                      className={classes.TableCell}
                      style={{ fontSize: "0.7rem" }}
                    >
                      {item.createdOn}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={props.handleCloseCloudTable}
          >
            FINISH
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CloudTable;
