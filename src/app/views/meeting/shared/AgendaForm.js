import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import AttachFileIcon from "@material-ui/icons/AttachFile";
import DialogTitle from '@material-ui/core/DialogTitle';
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AddIcon from "@material-ui/icons/Add";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import DoneIcon from "@material-ui/icons/Done";
import GetAppIcon from "@material-ui/icons/GetApp";
import { IconButton, Tooltip, Fab, Paper } from "@material-ui/core";
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
import CloseIcon from "@material-ui/icons/Close";

import Typography from "@material-ui/core/Typography";
import "./index.css";
import "../../../../_index.scss";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  addAgendass,
  getAgendass,
  postAgendaDocument,
} from "app/redux/actions/addAgendaAction";

function AttendeesForm(props) {
  const [open, setOpen] = useState(false);

  const [file, setFile] = useState(null);

  const CustomToolbarMarkup = () => (
    <div
      style={{
        height: "4rem",
        display: "flex",
        alignItems: "center",
        borderBottom: `1px solid ${props.theme ? "#505050" : "#d9d9d9"}`,
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
        {t("Agenda")}
      </Typography>

      <Tooltip title={t("Add Agenda")}>
        <Fab
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
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

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const MeetingsId = useSelector((state) => state.createMeetings.meetingId);

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
          <IconButton id="agendaForm_downloadFile" aria-label="userHistory" size="small">
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

  const validationSchema = yup.object({
    agenda: yup.string().required("Agenda Is Required"),
    requestedBy: yup.string("").required(" Requested By Is Required"),
    description: yup.string().required("Description Is Required"),
  });
  const addAgendabtn = (values) => {
    dispatch(addAgendass(MeetingsId, values));
  };

  const formik = useFormik({
    initialValues: {
      agenda: "",
      requestedBy: "",
      description: "",
      file: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let form = new FormData();
      form.append("file", values.file);
      form.append("agenda", values.agenda);
      form.append("requestedBy", values.requestedBy);
      form.append("description", values.description);
      addAgendabtn(form);
      handleClose();
      formik.resetForm();
    },
  });

  AOS.init({
    offset: 200,
    duration: 600,
    easing: "ease-in-sine",
    delay: 200,
  });

  const getAllAgendasData = useSelector(
    (state) => state.AgendaReducer.getAgendaData
  );
  console.log(getAllAgendasData);

  

  const nextStep = () => {
    props.handleNext();
  };

  const backStep = () => {
    props.handleBack();
  };

  const AgendaTable = useCallback(() => {
    return (
      <GridComponent
        dataSource={getAllAgendasData}
        height="200"
        allowResizing={true}
        allowSorting={true}
        allowPaging={true}
        pageSettings={{ pageCount: 5, pageSizes: true }}
        filterSettings={{ type: "Menu" }}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="agenda"
            headerText={t("AGENDA")}
            width="90"
            textAlign="left"
          />

          <ColumnDirective
            field="description"
            headerText={t("DESCRIPTION")}
            width="130"
            textAlign="center"
          />
          <ColumnDirective
            field="requestedBy"
            headerText={t("REQUESTED BY")}
            width="130"
            textAlign="center"
          />
          <ColumnDirective
            field="status"
            headerText={t("STATUS")}
            width="90"
           
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

        <Inject services={[Resize, Page, Sort, Filter]} />
      </GridComponent>
    );
  }, [getAllAgendasData]);

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
        <AgendaTable />
      </Paper>

      <Dialog
        open={open}
        onClose={() => {
          handleClose();
          formik.handleReset();
        }}
      >
        <DialogTitle>
          {t("ADD AGENDA")}
          <IconButton
            id="add_agendaForm_close_btn"
            aria-label="close"
            onClick={() => {
              handleClose();
              formik.handleReset();
            }}
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
          <form onSubmit={formik.handleSubmit}>
            <TextField
              margin="dense"
              fullWidth
              id="agenda"
              name="agenda"
              label="AGENDA"
              size="small"
              value={formik.values.agenda}
              onChange={formik.handleChange}
              error={formik.touched.agenda && Boolean(formik.errors.agenda)}
              helperText={formik.touched.agenda && formik.errors.agenda}
            />
            <TextField
              margin="dense"
              fullWidth
              id="requestedBy"
              name="requestedBy"
              label="REQUESTED BY"
              type="text"
              size="small"
              value={formik.values.requestedBy}
              onChange={formik.handleChange}
              error={
                formik.touched.requestedBy && Boolean(formik.errors.requestedBy)
              }
              helperText={
                formik.touched.requestedBy && formik.errors.requestedBy
              }
            />

            <TextField
              fullWidth
              margin="dense"
              id="description"
              name="description"
              multiline
              minRows={3}
              label="DESCRIPTION"
              type="text"
              size="small"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
            <TextField
              type="file"
              margin="dense"
              variant="outlined"
              fullWidth
              size="small"
              onChange={(e) => formik.setFieldValue("file", e.target.files[0])}
              name="file"
            />
            <DialogActions>
              <Button
                id="add_agendaForm_reset_btn"
                variant="outlined"
                color="primary"
                onClick={formik.resetForm}
              >
                {t("RESET")}
              </Button>
              <Button
              id="add_agendaForm_submit_btn"
                endIcon={<DoneIcon />}
                color="primary"
                variant="outlined"
                type="submit"
              >
                {t("SUBMIT")}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Button
        id="add_agendaForm_next_btn"
        endIcon={<ArrowForwardIcon />}
        variant="outlined"
        color="primary"
        onClick={nextStep}
        style={{ marginTop: "30px", float: "right", marginLeft: "20px" }}
      >
        {t("Next")}
      </Button>
      <Button
        id="add_agendaForm_back_btn"
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        color="primary"
        onClick={backStep}
        style={{ marginTop: "30px", float: "right" }}
      >
        {t("Back")}
      </Button>
    </div>
  );
}

export default AttendeesForm;
