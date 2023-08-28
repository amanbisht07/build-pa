import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import UndoIcon from '@material-ui/icons/Undo';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import {
  getAllMeetingDepartment,
  sendToChairman,
  getDepartment,
  getuserName,
  getAttendingGroup,
  postExternalAttendees,
  getExternalAttendees,
} from "app/redux/actions/CreateMeetingAction";
import AddIcon from "@material-ui/icons/Add";
import {
  IconButton,
  Tooltip,
  Fab,
  Grid,
  Paper,
  Toolbar,
 
} from "@material-ui/core";
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
import AOS from "aos";
import "aos/dist/aos.css";

import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import "../index.css";

import { useFormik } from "formik";
import * as yup from "yup";

const GroupDepartment = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const [groupDialoge, setGroupDialoge] = useState(false);

  const grouphandleClickOpen = () => {
    setGroupDialoge(true);
  };

  const grouphandleClickClose = () => {
    setGroupDialoge(false);
  };

  useEffect(() => dispatch(getAttendingGroup()), []);
  const getGropsNameData = useSelector(
    (state) => state.getGroupNames.getGropsName.data
  );

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
        {" Group Department"}
      </Typography>

      <Tooltip title={" Add Group Department"}>
        <Fab
          style={{
            position: "absolute",

            right: "2rem",
            width: "2.2rem",
            height: ".1rem",
            backgroundColor: "rgb(230, 81, 71)",
          }}
          onClick={grouphandleClickOpen}
        >
          <AddIcon style={{ fontSize: "19", color: "#fff" }} />
        </Fab>
      </Tooltip>
    </div>
  );

  const GroupTable = useCallback(() => {
    return (
      <GridComponent
        dataSource={getGropsNameData}
        height={Number(window.innerHeight - 500)}
        allowResizing={true}
        allowSorting={true}
        allowPaging={true}
        pageSettings={{ pageCount: 5, pageSizes: true }}
        allowFiltering={false}
        filterSettings={{ type: "Menu" }}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="externalAttendees"
            headerText={t("EXTERNAL ATTENDEES")}
            width="160"
            textAlign="left"
            allowFiltering={false}
            allowSorting={false}
          />

          <ColumnDirective
            field="emailId"
            headerText={t("EMAIL")}
            width="80"
            textAlign="Left"
          />
          <ColumnDirective
            field="mobileNo"
            headerText={t("PHONE")}
            width="120"
            textAlign="Left"
          />
          <ColumnDirective
            field="status"
            headerText={t("STATUS")}
            width="90"
            textAlign="Left"
          />
        </ColumnsDirective>
        <Inject services={[Resize, Sort, Filter, Page]} />
      </GridComponent>
    );
  }, [getGropsNameData]);
  return (
    <div>
      <Paper
        className=" mui-table-customize"
        elevation={3}
        style={{
          position: "relative",
          borderRadius: "18px",
        }}
      >
        <CustomToolbarMarkup />
        <GroupTable />
      </Paper>
      <Dialog open={groupDialoge} onClose={grouphandleClickClose}>
        <DialogTitle>
          ADD GROUPS
          <IconButton
            id= "groupDept_close_button"
            aria-label="close"
            onClick={grouphandleClickClose}
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
        <DialogContent style={{ width: "500px" }}>
          <TextField
            margin="dense"
            id="standard-select-currency-native"
            select
            label="DEPARTMENT NAME "
            fullWidth
            variant="outlined"
            name="deptName"
            size="small"
            SelectProps={{
              native: true,
            }}
          >
            {getGropsNameData &&
              getGropsNameData.map((option, i) => (
                <option key={i}>{option}</option>
              ))}
          </TextField>
          <TextField
            margin="dense"
            id="standard-select-currency-native"
            fullWidth
            size="small"
            label="DEPARTMENT USER NAME"
            variant="outlined"
            name="userName"
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button id="groupDept_reset_button" startIcon={<UndoIcon />} variant="outlined" color="primary">
            Reset
          </Button>
          <Button id="groupDept_add_button" endIcon={<AddIcon />} variant="outlined" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GroupDepartment;
