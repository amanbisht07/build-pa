import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import UndoIcon from '@material-ui/icons/Undo';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import {
  getDepartment,
  getuserName,
} from "app/redux/actions/CreateMeetingAction";
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

import "../index.css";

import { useFormik } from "formik";
import * as yup from "yup";

const AttendingDepartment = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [departmentDialoge, setDepartmentDialoge] = useState(false);
  const departmentDialogeOpen = () => {
    setDepartmentDialoge(true);
  };

  const departmentDialogeClose = () => {
    setDepartmentDialoge(false);
  };
  //   useEffect(() => dispatch(getAllMeetingDepartment(MeetingsId)), []);
  useEffect(() => dispatch(getDepartment()), [dispatch]);

  const [userDepartment, setUserDepartMent] = useState([]);
  useEffect(() => {
    if (userDepartment.length !== 0) {
      dispatch(getuserName(department[0]));
    }
  }, [dispatch, userDepartment]);

  const department = useSelector((state) => state.department.department);

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
        {" Attending Department"}
      </Typography>

      <Tooltip title={" Add Attending Department"}>
        <Fab
          style={{
            position: "absolute",

            right: "2rem",
            width: "2.2rem",
            height: ".1rem",
            backgroundColor: "rgb(230, 81, 71)",
          }}
          onClick={departmentDialogeOpen}
        >
          <AddIcon style={{ fontSize: "19", color: "#fff" }} />
        </Fab>
      </Tooltip>
    </div>
  );

  const AttendingDepartmnetTable = useCallback(() => {
    return (
      <GridComponent
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
            field="status"
            headerText={t("STATUS")}
            width="90"
            textAlign="Left"
          />
        </ColumnsDirective>
        <Inject services={[Resize, Sort, Filter, Page]} />
      </GridComponent>
    );
  }, []);
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
        <AttendingDepartmnetTable />
      </Paper>

      <Dialog open={departmentDialoge} onClose={departmentDialogeClose}>
        <DialogTitle>
          ADD DEPARTMENT
          <IconButton
            id="add_Department_close_button"
            aria-label="close"
            onClick={departmentDialogeClose}
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
            id="standard-select-currency-native" KKK
            select
            label="DEPARTMENT NAME"
            fullWidth
            variant="outlined"
            name="deptName"
            size="small"
            SelectProps={{
              native: true,
            }}
          >
            {department &&
              department.map((option, i) => <option key={i}>{option}</option>)}
          </TextField>
          <TextField
            margin="dense"
            id="standard-select-currency-native"
            fullWidth
            size="small"
            label="DEPARTMENT USER NAME "
            variant="outlined"
            name="userName"
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button id="addDepartment_reset_button" startIcon={<UndoIcon />} variant="outlined" color="primary">
            Reset
          </Button>
          <Button id="addDepartment_add_button" endIcon={<AddIcon />} variant="outlined" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AttendingDepartment;
