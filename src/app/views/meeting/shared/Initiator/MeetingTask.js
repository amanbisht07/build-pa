import React, { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAgendass } from "app/redux/actions/addAgendaAction";
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

import { MeetingId } from "../InboxTableDetails/GetMeetingDetails";
import { InitiatorGetTask } from "app/redux/actions/CreateMeetingAction";
import {
  Button,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Grid,
  Link,
  Fab,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import history from "history.js";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import TaskAltIcon from '@material-ui/icons/Assignment';
import DeleteIcon from "@material-ui/icons/Delete";
import Cookies from "js-cookie";

function MeetingTask({MeetingIds}) {
  const dispatch = useDispatch();



  useEffect(() => {
    dispatch(InitiatorGetTask(MeetingIds));
  }, []);
  console.log(MeetingIds)

  const meetingTask = useSelector( (state) => state.TaskActionPoints.taskActionPoint.task);
  console.log(typeof meetingTask);

  const d = useSelector(
    (state) => state
  );
  console.log(d)
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const CustomToolbarMarkup = () => (
    <div
      style={{
        height: "4rem",
        display: "flex",
        alignItems: "center",
        borderBottom: `1px solid  "#d9d9d9"}`,
      }}
    >
      <Typography
        variant="button"
        align="center"
        color="primary"
        style={{
          fontSize: "medium",
          fontFamily: "inherit !important",
          marginLeft: "15px",
        }}
      >
        {"Meeting Task"}
      </Typography>

     
    </div>
  );

  const RenderTable = useCallback(() => {
    return (
      <>
        <GridComponent
          dataSource={meetingTask}
          height={Number(window.innerHeight - 320)}
          allowResizing={true}
          allowSorting={true}
          allowPaging={true}
          pageSettings={{ pageCount: 5, pageSizes: true }}
          filterSettings={{ type: "Menu" }}
        >
          <ColumnsDirective>
            <ColumnDirective
              field="subject"
              headerText={"SUBJECT"}
              width="90"
              textAlign="left"
            />

            <ColumnDirective
              field="refrence"
              headerText={"REFRENCE"}
              width="90"
              textAlign="left"
            />

            <ColumnDirective
              field="description"
              headerText={"DESCRIPTION"}
              width="150"
              textAlign="center"
            />
            <ColumnDirective
              field="onBehalfOf"
              headerText={"ON BEHALF OF"}
              width="130"
              textAlign="center"
            />

            <ColumnDirective
              field="dueDate"
              headerText={"DUEDATE"}
              width="130"
              textAlign="center"
            />

            <ColumnDirective
              field="externalUser"
              headerText={"EXTERNAL USER"}
              width="130"
              textAlign="center"
            />

            <ColumnDirective
              field="internalUser"
              headerText={"INTERNEL USER"}
              width="130"
              textAlign="center"
            />
            <ColumnDirective
              field="status"
              headerText={"STATUS"}
              width="130"
              format="yMd"
              textAlign="Right"
            />
          </ColumnsDirective>
          <Inject services={[Resize, Page, Sort, Filter]} />
        </GridComponent>
      </>
    );
  }, [meetingTask]);

  return (
    <div className="cabinate_container">
      <Paper style={{ borderRadius: "16px" }}>
        <CustomToolbarMarkup />
        <RenderTable />
        <div>
          <Button
            id="meeting_delete_Task"
            variant="outlined"
            disabled
            style={{
              marginTop: "20px",
              float: "right",
              backgroundColor: "#ccc",
              marginRight: "20px",
            }}
          >
            Delete Task
            <DeleteIcon style={{ marginLeft: "15px" }} />
          </Button>
          <Button
           id="meeting_end_Task"
            variant="outlined"
            disabled
            style={{
              marginTop: "20px",
              float: "right",
              backgroundColor: "#ccc",
              marginRight: "20px",
            }}
          >
            End Task
            <TaskAltIcon style={{ marginLeft: "15px" }} />
          </Button>
        </div>
        <Dialog open={open}>
          <DialogTitle>Add Dicision </DialogTitle>
          <DialogContent style={{ width: "550px" }}>
            <TextField
              autoFocus
              margin="dense"
              id="dicision"
              label="dicision"
              type="text"
              size="small"
              className="e-field e-input"
              fullWidth
              variant="outlined"
              name="dicision"
            />
            <TextField
              margin="dense"
              multiline
              rows={6}
              label="discussion"
              type="text"
              fullWidth
              size="small"
              className="e-field e-input"
              variant="outlined"
              name="discussion"
            />
          </DialogContent>
          <DialogActions>
            <Button id="cancel_meetingTask" variant="outlined" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button id="create_meetingTask" variant="outlined" color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </div>
  );
}

export default MeetingTask;
