import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper/Paper";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from "@material-ui/core";
import {
  loadPATableData,
  loadSfdt,
  getHistory,
} from "../../camunda_redux/redux/action";
import { connect, useDispatch, useSelector } from "react-redux";
import Slide from "@material-ui/core/Slide/Slide";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Annexure from "./Annexure";
import {
  changingTableStatePA,
  changeTableStateDraft,
} from "../../camunda_redux/redux/action/apiTriggers";
import { setRefresh } from "../../redux/actions/RefreshActions";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import "./therme-source/material-ui/loading.css";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@material-ui/lab";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import { useTranslation } from "react-i18next";
import Draggables from "react-draggable";
import HistoryIcon from "@material-ui/icons/History";
import { DataGrid } from "@material-ui/data-grid";
import ShowAndHide from "../../views/utilities/ShowAndHide";

const PaperComponent = (props) => {
  return (
    <Draggables
      handle="#draggable-dialog-title"
      cancel={'.cancel-drag'}
    >
      <Paper {...props} />
    </Draggables>
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
  },
  paper: {
    padding: "6px 16px",
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

const PersonalAppTable = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = useState(0);
  const [rowData, setRowData] = useState([]);
  const [openQuickSign, setOpenQuickSign] = useState(false);
  const [open, setOpen] = useState(false);
  const [rowID, setRowID] = useState("");
  const [fileURL, setFileURL] = useState("");
  const [blnOpenQuickSign, setblnOpenQuickSign] = useState(false);
  const [blnOpenEditor, setblnOpenEditor] = useState(true);
  const [blnOpenHistory, setblnOpenHistory] = useState(false);
  let username = localStorage.getItem("username");
  let role = sessionStorage.getItem("role");
  let dept = sessionStorage.getItem("department");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [sampleData, setSampleData] = useState([]);
  const [pageSizes] = useState([5, 10, 15]);
  const { theme } = useSelector((state) => state);

  const columns = [
    {
      field: "serialNo",
      headerName: t(" "),
      width: 10,
    },
    {
      field: "subject",
      headerName: t("subject"),
      width: 250,
      renderCell: (params) => (
        <div>
          <Typography>
            <ShowAndHide data={params.row.subject} />
          </Typography>
        </div>
      ),
    },
    {
      field: "status",
      headerName: t("status"),
      width: 180,
      renderCell: (params) => (
        <div>
          <Typography onClick={(event) => event.stopPropagation()}>
            <IconButton
              id="PATable_on_history"
              aria-label="userHistory"
              size="small"
              onClick={(e) => {
                handleOnClickOpenHistory(e, params.row, true);
              }}
            >
              <Tooltip
                title={t("show_user_history")}
                aria-label="Show User History"
              >
                <HistoryIcon color="primary" />
              </Tooltip>
            </IconButton>
            <span style={cellStyles[params.row.status]}>
              {params.row.status}&nbsp;&nbsp;&nbsp;
            </span>
          </Typography>
        </div>
      ),
    },
    {
      field: "displayPfileName",
      headerName: `${t("pa_number")}`,
      width: 170,
      renderCell: (params) => (
        <div>
          <Typography>
            <ShowAndHide data={params.row.displayPfileName} />
          </Typography>
        </div>
      ),
    },
    {
      field: "createdOn",
      headerName: t("date_applied"),
      width: 170,
    },
  ];

  const cellStyles = {
    "In Progress": {
      color: "rgb(21, 101, 192)",
      fontWeight: "bolder",
    },
    Approved: {
      color: "rgb(76, 175, 80)",
      fontWeight: "bolder",
    },
    Rejected: {
      color: "rgb(198, 40, 40)",
      fontWeight: "bolder",
    },
  };

  const loadSFDT = (url, id) => {
    props.blnEnableLoader(true);
    props
      .loadSfdt(url, username, id, role, dept) // API call to load sfdt which will be visible on sincfusion
      .then((response) => {
        try {
          const URL = response.url;
          setRowID(id);
          setFileURL(URL);
          if (URL) {
            props.blnEnableLoader(false);
            setblnOpenQuickSign(false);
            setblnOpenEditor(true);
            setTabIndex(0);
            setOpenQuickSign(true);
          }
        } catch (e) {
          callMessageOut(e.message);
        }
      });
  };

  const { getPAData } = useSelector((state) => state.PAData);

  useEffect(() => {
    loadPATableData();
  }, [dispatch]);
  useEffect(() => {
    if (getPAData) {
      props.blnEnableLoader(false);
      props.changingTableStatePA(false, "CHANGE_PA_APPLICATION");
      props.changeTableStateDraft(false, "CHANGE_PA_DRAFT");
    }
    let tmpArr = [];
    tmpArr = getPAData.map((item, index) => {
      return { ...item, serialNo: pageSize * currentPage + (index + 1) };
    });
    setRowData(tmpArr);
    setTotalCount(getPAData.length);
  }, [getPAData]);
  const loadPersonalApplicationTable = () => {
    props.blnEnableLoader(true);
    dispatch(loadPATableData(username, role, pageSize, currentPage));
  };

  const { blnValuePA } = props.subscribeApi;
  useEffect(
    () => loadPersonalApplicationTable(),
    [blnValuePA, currentPage, pageSize]
  );

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const handleClickQuickSignClose = () => {
    setOpenQuickSign(false);
    setblnOpenEditor(true);
    setblnOpenQuickSign(false);
  };

  const handleOnClickOpenHistory = (e, row, forDialog) => {
    e.stopPropagation();
    if (row) {
      props.getHistory("PA", row.id).then((resp) => {
        if (resp) {
          !isNullOrUndefined(resp.data)
            ? setSampleData(resp.data)
            : setSampleData([]);
        }
        forDialog && setblnOpenHistory(true);
      });
    }
  };

  const CustomToolbarMarkup = () => (
    <div
      style={{
        padding: "16px 16px",
        textAlign: "left",
        height: "4rem",
        borderBottom: `1px solid ${props.theme ? "#505050" : "#d9d9d9"}`,
      }}
    >
      <Typography
        variant="button"
        align="center"
        color="primary"
        style={{ fontFamily: "inherit !important", fontSize: "medium" }}
      >
        {t("my_personal_applications")}
      </Typography>
    </div>
  );

  const handleOnRowClick = (args, e) => {
    const url = args.row.fileURL;
    sessionStorage.setItem("FileURL", url);
    loadSFDT(url, args.row.id);
    handleOnClickOpenHistory(e, args.row, false);
  };

  return (
    <div>
      <Paper
        elevation={3}
        style={{
          position: "relative",
          borderRadius: "9px",
          // border: `1px solid ${props.theme ? "#505050" : "#d9d9d9"}`,
        }}
      >
        <CustomToolbarMarkup />
        <div
          style={{ height: "calc(100vh - 180px)" }}
          className="mui-table-customize"
        >
          <DataGrid
            rows={rowData}
            columns={columns}
            rowHeight={36}
            pageSize={pageSize}
            rowsPerPageOptions={pageSizes}
            onPageSizeChange={(value) => setPageSize(value)}
            disableSelectionOnClick
            paginationMode="server"
            rowCount={totalCount}
            onRowClick={handleOnRowClick}
            onPageChange={(newPage) => {
              setCurrentPage(newPage);
            }}
            getRowClassName={(params) => `super-app-theme-${params.row.status}`}
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
        className="personal-application-history"
      >
        <DialogTitle id="draggable-dialog-title" style={{ cursor: "move" }}>
          {t("user_history")}
        </DialogTitle>

        <DialogContent dividers style={{ maxHeight: "600px" }}>
          <Timeline align="left">
            {sampleData.map((item, index) => (
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
                  <TimelineDot color={item.color || 'grey'} variant={item.variant || "outlined"}>
                    <item.icon />
                  </TimelineDot>
                  {sampleData.length === index + 1 ? "" : <TimelineConnector />}
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
      </Dialog>
      <Dialog
        open={openQuickSign}
        onClose={handleClickQuickSignClose}
        fullScreen
        aria-labelledby="quickSignDialog"
        TransitionComponent={Transition}
        className={classes.divZIndex}
      >
        <DialogContent
          dividers
          style={{
            backgroundColor: theme ? "rgb(46 46 46)" : "rgb(241 241 241)",
          }}
        >
          <Tabs
            forceRenderTabPanel
            selectedIndex={tabIndex}
            onSelect={(index) => setTabIndex(index)}
          >
            <TabList>
              <Tab style={{ borderRadius: "5px 5px 0 0" }}>
                {t("personal_application").toUpperCase()}
              </Tab>
              <IconButton
                id="personalApp_close_btn"
                aria-label="close"
                onClick={handleClickQuickSignClose}
                style={{
                  borderRadius: "10px",
                  float: "right",
                  height: "35px",
                  width: "35px",
                  color: "blue",
                  borderColor: "blue",
                  borderWidth: "1px",
                  borderStyle: "revert",
                }}
                className="cancel-drag"
              >
                <CloseIcon />
              </IconButton>
            </TabList>

            <TabPanel>
              <div hidden={!blnOpenEditor}>
                <Annexure
                  fileId={rowID}
                  showUploader={false}
                  sampleData={sampleData}
                />
              </div>
            </TabPanel>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    subscribeApi: state.subscribeApi,
    refreshings: state.refreshings,
    theme: state.theme,
  };
}
export default connect(mapStateToProps, {
  setRefresh,
  loadPATableData,
  loadSfdt,
  changingTableStatePA,
  changeTableStateDraft,
  getHistory,
})(PersonalAppTable);
