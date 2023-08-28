import React, { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAgendass } from "app/redux/actions/addAgendaAction";
import UndoIcon from '@material-ui/icons/Undo';
import CloseIcon from '@material-ui/icons/Close';
import { useTranslation } from "react-i18next";
import DoneIcon from '@material-ui/icons/Done';
import GetAppIcon from "@material-ui/icons/GetApp";
import {
  ColumnDirective,
  ColumnsDirective,
  Filter,
  GridComponent,
  Inject,
  Page,
  Resize,
  Sort,
  Selection,
} from "@syncfusion/ej2-react-grids";

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
import history from "history.js";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import "../index.css";
import { InitiatorPostDecision } from "app/redux/actions/CreateMeetingAction";
import AddIcon from "@material-ui/icons/Add";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";

function MeetingAgenda({ MeetingIds }) {
  const { t } = useTranslation();

  const [agenda, setAgenda] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => dispatch(getAgendass(MeetingIds)), []);

  const getAllAgendasData = useSelector(
    (state) => state.AgendaReducer.getAgendaData
  );
  console.log(getAllAgendasData);

  console.log(getAllAgendasData);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validationSchema = yup.object({
    decision: yup
      .string()

      .required("Decision is required"),
    discussion: yup
      .string()

      .required("Discussion is required"),
  });

  const formik = useFormik({
    initialValues: {
      decision: "",
      discussion: "",
      meetingId: MeetingIds,
      agenda: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      MeetingDecisions(values);
    },
  });

  const MeetingDecisions = (values) => {
    dispatch(InitiatorPostDecision(values));
    handleClose();
  };

  const [select, setSelect] = useState(false);

  const handleSelect = (args) => {
    console.log(args);
    if (args.isCtrlPressed === true && args.rowIndexes[1]) {
      toast.success("please select");
      setSelect(true);
    }
    if (args.isHeaderCheckboxClicked) {
      formik.setFieldValue("agenda", args.data.agenda);
    } else {
      formik.setFieldValue("agenda", args.data.agenda);
    }
  };

  const handlDeselect = (args) => {
    if (args.name === "rowDeselecting") {
    }
    if (args.isHeaderCheckboxClicked) {
      formik.setFieldValue("agenda", []);
    } else {
      let tmpArr = agenda.filter((item) => item.id !== args.data.id);
      formik.setFieldValue(tmpArr);
    }
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
        {" Meeting Agenda"}
      </Typography>

      <Tooltip title={" Add Decision"}>
        <Fab
          style={{
            position: "absolute",

            right: "2rem",
            width: "2.2rem",
            height: ".1rem",
            backgroundColor: "rgb(230, 81, 71)",
          }}
          onClick={handleClickOpen}
        >
          <AddIcon style={{ fontSize: "19", color: "#fff" }} />
        </Fab>
      </Tooltip>
    </div>
  );

  const RenderTable = useCallback(() => {
    return (
      <>
        <GridComponent
          dataSource={getAllAgendasData}
          height={Number(window.innerHeight - 320)}
          allowResizing={true}
          allowSorting={true}
          allowPaging={true}
          pageSettings={{ pageCount: 5, pageSizes: true }}
          filterSettings={{ type: "Menu" }}
          rowSelecting={handleSelect}
          rowDeselecting={handlDeselect}
        >
          <ColumnsDirective>
            <ColumnDirective type="checkbox" width="50"></ColumnDirective>
            <ColumnDirective
              field="agenda"
              headerText={t("AGENDA")}
              width="90"
              textAlign="left"
            />

            <ColumnDirective
              field="description"
              headerText={t("DESCRIPTION")}
              width="150"
              textAlign="center"
            />
            <ColumnDirective
              field="requestedBy"
              headerText={t("REQUESTEDBY")}
              width="130"
              textAlign="center"
            />
            <ColumnDirective
              field="status"
              headerText={t("STATUS")}
              width="130"
              format="yMd"
              textAlign="Right"
            />
            <ColumnDirective
              field="iconBtn"
              headerText={"DOWNLOAD"}
              width="120"
              template={buttonTheme}
              allowFiltering={false}
              allowSorting={false}
            />
          </ColumnsDirective>
          <Inject services={[Selection, Resize, Page, Sort, Filter]} />
        </GridComponent>
      </>
    );
  }, [getAllAgendasData]);

  const downloadFile = (e, row) => {
    console.log(row);
    e.stopPropagation(); // don't select this row after clicking
    const anchor = document.createElement("a");
    anchor.href = row.url;
    anchor.download = row.displayPfileName;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const buttonTheme = (args) => {
    return (
      <>
        {args.url && (
          <IconButton id="meetingAgenda_download_btn" aria-label="userHistory" size="small">
            <Tooltip title={"Download"} aria-label="Download">
              <GetAppIcon
                color="primary"
                onClick={(e) => downloadFile(e, args)}
              />
            </Tooltip>
          </IconButton>
        )}
      </>
    );
  };



  return (
    <div className="cabinate_container">
      <Paper style={{ borderRadius: "16px" }}>
        <CustomToolbarMarkup />
         <RenderTable />
      </Paper>

      <Dialog open={open} onClose={() => {handleClose(); formik.handleReset()}} >
        <DialogTitle>
          {" "}
          {t("ADD DECISION")}
          <span style={{ float: "right " }}>
            {" "}
            <IconButton id="meeting_add_decision_close_btn" aria-label="close" size="small" onClick={() => {handleClose(); formik.handleReset()}}>
              <Tooltip title={t("close")} aria-label="close">
                <CloseIcon color="primary" />
              </Tooltip>
            </IconButton>
          </span>{" "}
        </DialogTitle>
        <DialogContent style={{ width: "550px" }}>
          <form onSubmit={formik.handleSubmit}>

            <TextField
              margin="dense"
              fullWidth
              minRows={4}
              id="discussion"
              name="discussion"
              label="DISCUSSION"
              size="small"
              variant="outlined"
              value={formik.values.discussion}
              onChange={formik.handleChange}
              error={
                formik.touched.discussion && Boolean(formik.errors.discussion)
              }
              helperText={formik.touched.discussion && formik.errors.discussion}
            />

            <TextField
              margin="dense"
              fullWidth
              id="decision"
              name="decision"
              label="DECISION"
              size="small"
              variant="outlined"
              value={formik.values.decision}
              onChange={formik.handleChange}
              error={formik.touched.decision && Boolean(formik.errors.decision)}
              helperText={formik.touched.decision && formik.errors.decision}
            />
            <DialogActions>
              <Button
                id="meeting_decision_reset_button"
                startIcon={<UndoIcon />}
                variant="outlined"
                color="primary"
                onClick={formik.resetForm}
              >
                {t("RESET")}
              </Button>

              <Button id="meeting_decision_finish_button" endIcon={<DoneIcon />} variant="outlined" color="primary" type="submit">
                {t("FINISH")}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MeetingAgenda;
