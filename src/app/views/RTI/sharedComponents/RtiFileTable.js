import React, { useState, useEffect, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  Paper,
  Slide,
} from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { setSnackbar } from "../../../camunda_redux/redux/ducks/snackbar";
import {
  loadSfdt,
  rollbackPADocument,
  getHistory,
  loadRtiList,
} from "../../../camunda_redux/redux/action";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@material-ui/lab";
import { connect as reduxConnect, useDispatch, useSelector } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "../../Personnel/therme-source/material-ui/loading";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
// import HeadersAndFootersView from "../../FileApproval/documentEditor/editor";
import { changingTableStateRti } from "../../../camunda_redux/redux/action/apiTriggers";
import Tooltip from "@material-ui/core/Tooltip";
import SplitViewPdfViewer from "../../inbox/shared/pdfViewer/pdfViewer";
import CreateIcon from "@material-ui/icons/Create";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";
import SendIcon from "@material-ui/icons/Send";
import RestorePageIcon from "@material-ui/icons/RestorePage";
import HistoryIcon from "@material-ui/icons/History";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import { OPEN_PA_DRAFT } from "app/camunda_redux/redux/constants/ActionTypes";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import {
  ColumnDirective,
  ColumnsDirective,
  CommandColumn,
  Filter,
  GridComponent,
  Inject,
  Page,
  Resize,
  Sort,
} from "@syncfusion/ej2-react-grids";
import PaginationComp from "../../utilities/PaginationComp";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import Cookies from "js-cookie";
import history from "../../../../history";

const PaperComponent = (props) => {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'.cancel-drag'}
    >
      <Paper {...props} />
    </Draggable>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  divZIndex: {
    zIndex: "0",
    "& .MuiDialogContent-dividers": {
      padding: "0px 0px !important",
    },
    "& #pdfV": {
      height: "calc(100vh - 47px) !important",
    },
    "& .e-de-ctn": {
      height: "calc(100vh - 48px) !important",
    },
  },
  sign_btn: {
    position: "fixed",
    right: "30px !important",
    bottom: "20px !important",
    zIndex: 10,
  },
  sign_btn1: {
    position: "fixed",
    right: "30px !important",
    bottom: "100px !important",
    zIndex: 10,
  },
  headerText: {
    display: "inline-flex",
    width: "60%",
    justifyContent: "center",
    marginBottom: "0px",
    fontSize: "1.1rem",
  },
  historyTimeLine: {
    justifyContent: "flex-start",
    "& .MuiTimelineOppositeContent-root": {
      flex: "none",
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const RtiFileTable = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();

  const { changeFile } = useSelector((state) => state);


  const [rowData, setRowData] = useState([]);
  const [openQuickSign, setOpenQuickSign] = useState(false);
  const [open, setOpen] = useState(false);
  const [send, setSend] = useState(false);
  const [blnOpenQuickSign, setblnOpenQuickSign] = useState(true);
  const [blnOpenEditor, setblnOpenEditor] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [rowID, setRowID] = useState("");
  const [fileURL, setFileURL] = useState("");
  const username = sessionStorage.getItem("username");
  const role = sessionStorage.getItem("role");
  const dept = sessionStorage.getItem("department");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [openSign, setOpenSign] = useState(false);
  const [pdfLoads, setPdfLoads] = useState(false);
  const [headerLable, setHeaderLable] = useState({});
  const [pageSizes] = useState([5, 10, 15]);
  const [blnOpenHistory, setblnOpenHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [openPaDialog, setOpenPaDialog] = useState(false);
  const { theme } = useSelector((state) => state);

  useEffect(() => loadPFTableData(), [blnValueRti, changeFile]);

  const loadPFTableData = () => {
    // setRowData([]);
    props
      .loadRtiList()
      .then((resp) => {
        let tmpArr = [];
        try {
          if (resp) {
            // condition to check if response then perform further
            if (resp !== undefined) {
              tmpArr = resp.content;
              setRowData(tmpArr);
              setTotalCount(resp.length);
            } else {
              const errorMessage =
                resp.status + " : " + resp.error + " AT " + resp.path;
              callMessageOut(errorMessage);
            }
            props.changingTableStateRti(false, "CHANGE_RTI"); // setting trigger to false as table got updated
          }
        } catch (e) {
          callMessageOut(e.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const { blnValueRti } = props.subscribeApi;

  useEffect(() => {
    if (props.openDraftPa) {
      let row = props.openDraftPa;
      // setHandleClickId(row.id);
      const url = row.fileURL;
      sessionStorage.setItem("FileURL", url);
      setFileURL(url);
      loadSFDT(url, row.id, row.status);
      setblnOpenQuickSign(row.signed);
      setHeaderLable({ subject: row.subject, pfileName: row.pfileName });
    }
    dispatch({
      type: OPEN_PA_DRAFT,
      payload: null,
    });
  }, [props.openDraftPa]);

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
    // };
    // if (this.id === undefined) {
    //   return dispatch(setSnackbar(true, "error", message));
    // }
  };

  useEffect(() => {
    Cookies.remove("inboxFile");
    Cookies.remove("priority");
    Cookies.remove("referenceNumber");
    Cookies.remove("partcaseId");
    Cookies.remove("status")
    Cookies.remove("isRti");
    Cookies.remove("isRegister");
  }, []);


  const handleClick = ({ rowData }) => {
    // Mtd to perform operation while row clicks
    sessionStorage.setItem("rtiID", rowData.rtiId);
    Cookies.set("inboxFile", rowData.subject);
    Cookies.set("priority", rowData.priority);
    Cookies.set("referenceNumber", rowData.referenceNumber);
    Cookies.set("partcaseId", rowData.partcaseId);
    Cookies.set("isRti", true);
    // Cookies.set("creater", rowData.createdBy);
    Cookies.remove("status");

    history.push({
      pathname: "/eoffice/splitView/file",
      state: { fileID: rowData.rtiId },
    });
  };

  const handleStatus = (id) => {
    const newArr = rowData.map((item) =>
      item.id === id ? { ...item, status: "In Progress" } : item
    );
    setRowData(newArr);
  };

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
        {t("RTI")}
      </Typography>
      <Tooltip title={t("RTI")}>
        <Fab
          // disabled={!props.myInfo}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            width: "2.2rem",
            height: ".1rem",
            backgroundColor: "rgb(230, 81, 71)",
          }}
          onClick={() => {
            props.handleUpdateSubject({ subject: "", id: "" }, false);
            props.handleClick();
          }}
        >
          <AddIcon style={{ fontSize: "19", color: "#fff" }} />
        </Fab>
      </Tooltip>
    </div>
  );

  const handleOnClickOpenHistory = (rtiId, forDialog) => {
    // e.stopPropagation();
    if (rtiId) {
      props.getHistory("Rti", rtiId).then((resp) => {
        if (resp) {
          !isNullOrUndefined(resp.data)
            ? setHistoryData(resp.data)
            : setHistoryData([]);
        }
        forDialog && setblnOpenHistory(true);
      });
    }
  };
  const historyIcon = (args) => {
    return (
      <>
        {args.status !== "Draft" ? (
          <Tooltip title={t("user_history")}>
            <HistoryIcon
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleOnClickOpenHistory(args.rtiId, true);
              }}
              style={{ cursor: "pointer" }}
            />
          </Tooltip>
        ) : (
          <Tooltip title={t("edit_subject")} aria-label="Edit Subject">
            <EditIcon
              cursor="pointer"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                props.handleUpdateSubject(args, true);
              }}
            />
          </Tooltip>
        )}
      </>
    );
  };

  const rowDataBound = (args) => {
    let val = args.data.status;

    if (val === "In Progress") {
      args.row.classList.add(`super-app-theme-In-Progress`);
    } else if (val === "Approved") {
      args.row.classList.add(`super-app-theme-Approved`);
    } else if (val === "Rejected") {
      args.row.classList.add(`super-app-theme-Rejected`);
    } else if (val === "Return") {
      args.row.classList.add(`super-app-theme-Return`);
    }
  };

  const statusTextColor = (props) => {
    return (
      <div
        style={{
          color:
            props.status === "In Progress"
              ? "blue"
              : props.status === "Approved"
                ? "green"
                : props.status === "Rejected"
                  ? "red"
                  : "",
        }}
      >
        {props.status}
      </div>
    );
  };

  const tooltipComponent = (args) => {
    return (
      <>
        <TooltipComponent
          content={args.subject}
          offsetY={5}
          style={{
            textAlign: "left",
            justifyContent: "space-between",
            float: "left",
          }}
        >
          {args.subject}
        </TooltipComponent>
      </>
    );
  };

  return (
    <div>
      <Paper
        className=" mui-table-customize"
        elevation={3}
        style={{
          position: "relative",
          borderRadius: "18px",
          border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
        }}
      >
        <CustomToolbarMarkup />
        <div className=" mui-table-customize">
          <GridComponent
            dataSource={rowData}
            height={Number(window.innerHeight - 250)}
            allowResizing={true}
            allowSorting={true}
            allowFiltering={true}
            filterSettings={{ type: "Menu" }}
            recordClick={handleClick}
            rowDataBound={rowDataBound}
          >
            <ColumnsDirective>
              <ColumnDirective
                field="subject"
                width="100"
                headerText={t("subject")}
                template={tooltipComponent}
              />

              <ColumnDirective
                field="priority"
                headerText={t("PRIORITY")}
                width="100"
              />

              <ColumnDirective
                field="status"
                headerText={t("status")}
                width="120"
                template={statusTextColor}
              />

              <ColumnDirective
                field="createdOnDate"
                headerText={t("date")}
                width="100"
                textAlign="Left"
              />
              <ColumnDirective
                field="receivingMode"
                headerText={t("MODE")}
                width="120"
                textAlign="Left"
              />
              <ColumnDirective
                field="appeal"
                headerText={t("TYPE")}
                width="120"
                textAlign="Left"
              />
              <ColumnDirective
                field="typeofServices"
                headerText={t("TYPE OF SERVICE")}
                width="220"
                textAlign="Left"
                template={(props) => {
                  let services = "";
                  props.typeOfService.forEach((service) => {
                    services += `${service}, `;
                  });
                  return (
                    <h4
                      style={{
                        fontSize: "13px",
                        fontFamily: "arial,Helvetica,sans-serif",
                      }}
                    >
                      {services}
                    </h4>
                  );
                }}
              />
              {/* <ColumnDirective
                field=""
                headerText=""
                width="50"
                template={historyIcon}
              /> */}
            </ColumnsDirective>
            <Inject services={[Resize, Sort, Filter, Page, CommandColumn]} />
          </GridComponent>
          <PaginationComp
            pageSize={pageSize}
            pageSizes={pageSizes}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalCount={totalCount}
            setPageSize={setPageSize}
          />
        </div>
      </Paper>

      <Dialog
        open={blnOpenHistory}
        onClose={(e) => setblnOpenHistory(false)}
        aria-labelledby="draggable-dialog-title"
        PaperComponent={PaperComponent}
        aria-describedby="alert-dialog-description"
        style={{ minWidth: "300px" }}
        fullWidth
        maxWidth="sm"
        className="rti-application-history"
      >
        <DialogTitle id="draggable-dialog-title" style={{ cursor: "move" }}>
          {t("user_history")}
        </DialogTitle>

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
                  >
                    {/* <item.icon /> */}
                  </TimelineDot>
                  {historyData.length === index + 1 ? (
                    ""
                  ) : (
                    <TimelineConnector />
                  )}
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
                      {item.title === "Created RTI Application" ? "" : ":"}
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
      </Dialog>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    subscribeApi: state.subscribeApi,
    openDraftPa: state.openDraftPa,
    myInfo: state.myInfo,
    theme: state.theme,
    subjectReducer: state.subjectReducer,
  };
}

export default reduxConnect(mapStateToProps, {
  loadSfdt,
  loadRtiList,
  changingTableStateRti,
  rollbackPADocument,
  getHistory,
})(RtiFileTable);
