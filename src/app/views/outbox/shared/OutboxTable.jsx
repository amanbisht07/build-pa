import React, { useEffect, useRef, useState } from "react";
import {
  IconButton,
  Paper,
  Tooltip,
  FormControl,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Slide,
  DialogActions,
  Button,
  TableContainer,
  Table,
  Checkbox,
  TableBody,
  TableRow,
  Menu,
  MenuItem,
  TableSortLabel,
  Grid,
  TableHead,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  loadOutboxData,
  getHistory,
  loadOutboxRow,
  getDataForExport,
} from "../../../camunda_redux/redux/action";
import { changingTableStateOutbox } from "../../../camunda_redux/redux/action/apiTriggers";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import DateRangeFilter from "../shared/DateRangeFilter";
import { addDays, subDays } from "date-fns";
import "../therme-source/material-ui/loading.css";
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
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";
import HistoryIcon from "@material-ui/icons/History";
import history from "../../../../history";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import SplitViewPdfViewer from "../../inbox/shared/pdfViewer/pdfViewer";
import Annexure from "./Annexure";
import FileViewTable from "./FileViewTable";
import GetAppIcon from "@material-ui/icons/GetApp";
import PaginationComp from "app/views/utilities/PaginationComp";
import Cookies from "js-cookie";
import Done from "@material-ui/icons/Done";
import {
  CancelOutlined,
  DoneAll,
  MoreVert,
  PlaylistAddCheck,
  Save,
  SaveAlt,
} from "@material-ui/icons";
import Axios from "axios";
import { saveAs } from "file-saver";
import { Loading } from "../therme-source/material-ui/loading";
import GenericSearch from "app/views/utilities/GenericSearch";
import { unstable_batchedUpdates } from "react-dom";
import GenericChip from "app/views/utilities/GenericChips";
import _ from "lodash";
import GenericFilterMenu from "app/views/utilities/GenericFilterMenu";
import Workbook from "react-excel-workbook";

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
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
  paper: {
    padding: "6px 16px",
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
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

const OutboxTable = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { theme } = useSelector((state) => state);

  const [date, setDate] = useState([
    {
      startDate: subDays(new Date(), 30),
      endDate: addDays(new Date(), 0),
      key: "selection",
    },
  ]);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [sampleData, setSampleData] = useState([]);
  const [blnOpenHistory, setblnOpenHistory] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizes] = useState([5, 10, 15]);
  const [resp, setResp] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [type, setType] = useState(false);
  const [exportData, setExportData] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [Filter, setFilter] = useState({});
  const [SortBy, setSortBy] = useState({});
  const [pdfLoads, setPdfLoads] = useState(false);
  const [propertiesMenu, setPropertiesMenu] = useState(false);

  const propertiesRef = useRef();

  const handleCloseMenu = (event) => {
    if (propertiesRef.current && propertiesRef.current.contains(event.target)) {
      return;
    }

    setPropertiesMenu(false);
  };

  // const prevOpen = useRef(propertiesMenu);
  // useEffect(() => {
  //   if (prevOpen.current === true && propertiesMenu === false) {
  //     propertiesRef.current.focus();
  //   }

  //   propertiesRef.current = open;
  // }, [propertiesMenu]);

  const role = sessionStorage.getItem("role");
  const userName = localStorage.getItem("username");

  const { blnValueOutbox } = props.subscribeApi;

  const FilterOption = [
    {
      value: "Select Field",
      label: "Select Field",
    },
    {
      value: "subject",
      label: "Subject",
    },
    {
      value: "fileName",
      label: "File Name",
    },
    {
      value: "fileStatus",
      label: "File Status",
    },
    {
      value: "dateSent",
      label: "Date Sent",
    },
    {
      value: "to",
      label: "Send To",
    },
    {
      value: "type",
      label: "Type",
    },
  ];
  const TypeOption = ["PA", "File", "Rti"];

  const statusOption = ["sent", "delivered", "seen", "action"];

  const FilterTypes = {
    type: "select",
    optionValue: FilterOption,
    size: "small",
    variant: "outlined",
    label: "Filter-By",
    color: "primary",
  };

  const FilterValueTypes = [
    {
      name: "subject",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "fileName",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "to",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "dateSent",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
    },
    {
      name: "type",
      type: "select",
      optionValue: TypeOption,
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "fileStatus",
      type: "select",
      optionValue: statusOption,
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
  ];

  const SortValueTypes = [
    {
      name: "subject",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Subject",
      color: "primary",
    },
    {
      name: "fileName",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "File Name",
      color: "primary",
    },
    {
      name: "to",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Send To",
      color: "primary",
    },
    {
      name: "dateSent",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
      label: "Date Sent",
    },
    {
      name: "type",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Type",
      color: "primary",
    },
    {
      name: "fileStatus",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "File Status",
      color: "primary",
    },
  ];

  // state variable which get track of all filter option with value

  const addFilter = (e, type, value) => {
    e.preventDefault();
    let newFilter = { ...Filter };
    if (value) {
      newFilter[`${type}`] = value;
      unstable_batchedUpdates(() => {
        setFilter(newFilter);
        setCurrentPage(0);
        setPageSize(10);
      });
    }
  };

  const deleteChip = (property) => {
    let newFilter = { ...Filter };
    delete newFilter[`${property}`];
    setFilter(newFilter);
  };

  const addSort = (sortObj) => {
    setSortBy(sortObj);
  };

  const DataSet = [
    {
      columns: [
        {
          title: "SL. NO.",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 60 },
        },
        {
          title: "SUBJECT",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
        {
          title: "FILE#",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
        {
          title: "STATUS",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
        {
          title: "DATE SENT",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
        {
          title: "SEND TO",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
        {
          title: "TYPE",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
      ],

      data: exportData?.map((data) => [
        { value: data.serialNo, style: { font: { sz: "12" }, align: "right" } },
        { value: data.subject, style: { font: { sz: "12" } } },
        { value: data.fileName, style: { font: { sz: "12" } } },
        { value: data.status, style: { font: { sz: "12" } } },
        { value: data.dateSent, style: { font: { sz: "12" } } },
        { value: data.to, style: { font: { sz: "12" } } },
        { value: data.type, style: { font: { sz: "12" } } },
      ]),
    },
  ];

  const saveDataSet = [
    {
      columns: [
        {
          title: "SL. NO.",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 60 },
        },
        {
          title: "SUBJECT",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
        {
          title: "FILE#",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
        {
          title: "STATUS",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
        {
          title: "DATE SENT",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
        {
          title: "SENT TO",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
        {
          title: "TYPE",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
        {
          title: "ACTION",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
      ],

      data: selectedList.map((data) => [
        { value: data.serialNo, style: { font: { sz: "12" }, align: "right" } },
        { value: data.subject, style: { font: { sz: "12" } } },
        { value: data.fileName, style: { font: { sz: "12" } } },
        { value: data.status, style: { font: { sz: "12" } } },
        { value: data.dateSent, style: { font: { sz: "12" } } },
        { value: data.to, style: { font: { sz: "12" } } },
        { value: data.type, style: { font: { sz: "12" } } },
        { value: data.fileStatus.toUpperCase(), style: { font: { sz: "12" } } },
      ]),
    },
  ];

  useEffect(() => {
    let outboxAbort = new AbortController()
    loadOutBoxTable(outboxAbort.signal)

    return () => {
      outboxAbort.abort()
    }
  }, [blnValueOutbox, currentPage, pageSize, Filter, SortBy]);

  useEffect(() => {
    Cookies.remove("Rtioutbox");
  }, []);

  const loadOutBoxTable = (abortSignal) => {
    let tmpArr = [];
    props.blnEnableLoader(true);
    let filter = {};
    Object.entries(Filter).map(([property, value]) => {
      let key = property.split("|")[0];
      filter[`${key}`] = value;
    });
    setRowData([]);
    props
      .loadOutboxData(role, userName, pageSize, currentPage, date[0], {
        filter: _.isEmpty(filter) ? null : filter,
        sort: _.isEmpty(SortBy) ? null : SortBy,
      },
        abortSignal)
      .then((resp) => {
        try {
          if (resp?.error?.includes("aborted")) {
            return;
          }
          if (resp.error) {
            callMessageOut(resp.error);
            props.blnEnableLoader(false);
          } else {
            if (!isNullOrUndefined(resp.response.Data)) {
              setTotalCount(resp.response.length);
              tmpArr = resp.response.Data.map((item, index) => {
                return {
                  ...item,
                  serialNo: pageSize * currentPage + (index + 1),
                  isChecked: false,
                  status:
                    item.status === 2
                      ? "In-Progress"
                      : item.status === 3
                        ? "Approved"
                        : item.status === 4
                          ? "Rejected"
                          : item.status,
                };
              });
              // props.changingTableStateOutbox(false, "CHANGE_OUTBOX");
              setRowData(tmpArr);
              props.blnEnableLoader(false);
            }
          }
        } catch (e) {
          callMessageOut(e.message);
          props.blnEnableLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
        callMessageOut(err.message);
      });
  };

  const callMessageOut = (message) => {
    props.blnEnableLoader(false);
    dispatch(setSnackbar(true, "error", message));
  };

  const handleOnClickOpenHistory = (e, row) => {
    e.stopPropagation();
    if (row) {
      props
        .getHistory("file", row.inboxId)
        .then((resp) => {
          console.log(resp);
          try {
            console.log(resp);
            if (resp.error) {
              callMessageOut(resp.error);
              return;
            }
            if (resp) {
              !isNullOrUndefined(resp.data)
                ? setSampleData(resp.data)
                : setSampleData([]);
            }
            setblnOpenHistory(true);
          } catch (e) {
            callMessageOut(e.message);
          }
        })
        .catch((e) => callMessageOut(e.message));
    }
  };

  const handleOnClickSaveFile = async (e) => {
    props.blnEnableLoader(true);
    let tmpArr = [];
    selectedList.map((item) => tmpArr.push(item.id));
    if (selectedList.length > 0) {
      try {
        const res = await Axios.post(
          `/retrieval_service/api/v2/download`,
          JSON.stringify(tmpArr),
          {
            headers: {
              "Content-Type": "application/json; charset=utf8",
              Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
              sessionId: sessionStorage.getItem("sessionId")
            },
            responseType: "arraybuffer",
          }
        );
        if (res) {
          let blob = new Blob([res.data], {
            type: "application/octet-stream",
          });
          props.blnEnableLoader(false);
          saveAs(blob, "Outbox Data.zip");
          // handleCloseMenu();
        }
      } catch (e) {
        callMessageOut(e.message);
        props.blnEnableLoader(false);
      }
    }
  };

  const HeaderDateRange = () => (
    <div
      className="header-input"
      style={{
        width: "100%",
      }}
    >
      <div>
        <Grid item xs={4}>
          <GenericSearch
            FilterTypes={FilterTypes}
            FilterValueTypes={FilterValueTypes}
            addFilter={addFilter}
            cssCls={{}}
            width={"100%"}
          />
        </Grid>

        <Grid
          item
          xs="auto"
          style={{ display: "flex", alignItems: "center" }}
          className="outbox_hide_responsive"
        >
          <FormControl variant="outlined" size="small">
            <label
              style={{
                marginBottom: "0px",
                marginRight: "15px",
                fontWeight: "bold",
              }}
            >
              {t("filter_by_date_sent")} :
            </label>
            <TextField
              style={{ marginRight: "1rem" }}
              id="outlined-basic"
              variant="outlined"
              value={`${months[date[0].startDate.getMonth()]
                } ${date[0].startDate.getDate()}, ${date[0].startDate.getFullYear()} - ${months[date[0].endDate.getMonth()]
                } ${date[0].endDate.getDate()}, ${date[0].endDate.getFullYear()} `}
              onClick={handleClickOpen}
            />
            <IconButton onClick={loadOutBoxTable}>
              <Tooltip title={t("search")} aria-label="Search">
                <SearchIcon />
              </Tooltip>
            </IconButton>
          </FormControl>
          <Workbook
            filename="OutBox_Data.xlsx"
            element={
              <IconButton disabled={!Boolean(selectedList.length)}>
                <Tooltip title={t("export_data")} aria-label="Export Data">
                  <GetAppIcon />
                </Tooltip>
              </IconButton>
            }
          >
            <Workbook.Sheet
              data={selectedList.length > 0 ? selectedList : exportData}
              name="Sheet A"
            >
              <Workbook.Column label="Sl. NO." value="serialNo" />
              <Workbook.Column label="SUBJECT" value="subject" />
              <Workbook.Column label="FILE#" value="status" />
              <Workbook.Column label="STATUS" value="dateSent" />
              <Workbook.Column label="SENT TO" value="to" />
              <Workbook.Column label="TYPE" value="type" />
              <Workbook.Column label="ACTION" value="fileStatus" />
            </Workbook.Sheet>
          </Workbook>

          <IconButton disabled={!Boolean(selectedList.length)} onClick={(e) => handleOnClickSaveFile(e)}>
            <Tooltip title="EXPORT ZIP" aria-label="Search">
              <Save />
            </Tooltip>
          </IconButton>
          <GenericFilterMenu
            SortValueTypes={SortValueTypes}
            addSort={addSort}
          />
        </Grid>
        <Grid
          item
          xs="auto"
          style={{ display: "flex", alignItems: "center" }}
          className="outbox_show_responsive"
        >
          <GenericFilterMenu
            SortValueTypes={SortValueTypes}
            addSort={addSort}
          />
          <IconButton
            ref={propertiesRef}
            aria-controls={propertiesMenu ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            onClick={() => setPropertiesMenu(!propertiesMenu)}
          >
            <Tooltip title="OTHER PROPERTIES">
              <MoreVert />
            </Tooltip>
          </IconButton>
          <Popper
            open={propertiesMenu}
            anchorEl={propertiesRef.current}
            role={undefined}
            transition
            disablePortal
            style={{ zIndex: "1" }}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleCloseMenu}>
                    <MenuList
                      autoFocusItem={open}
                      id="menu-list-grow"
                    // onKeyDown={handleListKeyDown}
                    >
                      <MenuItem
                        onClick={handleCloseMenu}
                        style={{ display: "flex", gap: "1rem" }}
                      >
                        <Workbook
                          filename="OutBox_Data.xlsx"
                          element={
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: ".7rem",
                              }}
                            >
                              <GetAppIcon style={{ color: "#808080" }} />
                              {t("EXPORT DATA")}
                            </div>
                          }
                        >
                          <Workbook.Sheet
                            data={
                              selectedList.length > 0
                                ? selectedList
                                : exportData
                            }
                            name="Sheet A"
                          >
                            <Workbook.Column label="Sl. NO." value="serialNo" />
                            <Workbook.Column label="SUBJECT" value="subject" />
                            <Workbook.Column label="FILE#" value="status" />
                            <Workbook.Column label="STATUS" value="dateSent" />
                            <Workbook.Column label="SENT TO" value="to" />
                            <Workbook.Column label="TYPE" value="type" />
                            <Workbook.Column
                              label="ACTION"
                              value="fileStatus"
                            />
                          </Workbook.Sheet>
                        </Workbook>
                      </MenuItem>
                      <MenuItem
                        // onClick={handleCloseMenu}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: ".7rem",
                        }}
                        onClick={(e) => handleOnClickSaveFile(e)}
                      >
                        <Save style={{ color: "#808080" }} /> {t("EXPORT ZIP")}
                      </MenuItem>
                      <MenuItem>
                        <FormControl variant="outlined" size="small">
                          <label
                            style={{
                              marginBottom: "0px",
                              marginRight: "15px",
                              fontWeight: "bold",
                            }}
                          >
                            {t("filter_by_date_sent")} :
                          </label>
                          <TextField
                            style={{ marginRight: "1rem" }}
                            id="outlined-basic"
                            variant="outlined"
                            size="small"
                            value={`${months[date[0].startDate.getMonth()]
                              } ${date[0].startDate.getDate()}, ${date[0].startDate.getFullYear()} - ${months[date[0].endDate.getMonth()]
                              } ${date[0].endDate.getDate()}, ${date[0].endDate.getFullYear()} `}
                            onClick={handleClickOpen}
                          />
                          <IconButton onClick={loadOutBoxTable}>
                            <Tooltip title={t("search")} aria-label="Search">
                              <SearchIcon />
                            </Tooltip>
                          </IconButton>
                        </FormControl>
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Grid>
      </div>

      <GenericChip Filter={Filter} deleteChip={deleteChip} />
    </div>
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenDialog(false);
  };

  const onDateChange = (ranges) => {
    setDate([ranges]);
  };

  const handleSubmit = () => {
    // call api here
    props.blnEnableLoader(true);
    props.getDataForExport(role, userName, date[0]).then((res) => {
      setExportData(res.response.Data);
      console.log("res dateRange :", exportData);
      handleClose();
      props.blnEnableLoader(false);
    });
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const handleOnRowClick = (rowData) => {
    props.blnEnableLoader(true);
    Cookies.set("paFileId", rowData.id);
    rowData.type === "PA" ? setType(true) : reDirectToSplitview(rowData);
    if (rowData.type === "RTI") {
      Cookies.set("isRti", true);
      Cookies.set("isRegister", rowData.partcaseId);
      Cookies.set("Rtioutbox", true);
      history.push({
        pathname: "/eoffice/splitView/file",
        state: rowData.id,
      });
    }

    if (rowData.type === "PA") {
      props
        .loadOutboxRow(rowData.id)
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              props.blnEnableLoader(false);
              return;
            } else {
              setResp(resp.response.Data);
              setOpenDialog(true);
              props.blnEnableLoader(false);
            }
          } catch (error) {
            callMessageOut(resp.error);
            props.blnEnableLoader(false);
          }
        })
        .catch((err) => {
          console.log(err);
          callMessageOut(resp.error);
          props.blnEnableLoader(false);
        });
    }
  };

  const reDirectToSplitview = (rowData) => {
    Cookies.set("outboxId", rowData.id)
    Cookies.set("isOutbox", true)
    Cookies.set("inboxFile", rowData.subject);
    Cookies.set("priority", rowData.priority);
    Cookies.set("referenceNumber", rowData.fileName);
    props.blnEnableLoader(false);
    history.push({
      pathname: "/eoffice/splitView/file",
      state: rowData.subject,
    });
  }

  const CheckBoxSelection = (event, unique) => {
    let tempArr = rowData.map((item) =>
      item.id === unique.id ? { ...item, isChecked: !item.isChecked } : item
    );
    if (event.target.checked) {
      setSelectedList([...selectedList, unique]);
    } else {
      let checkData = selectedList.filter((item) => item.id !== unique.id);
      setSelectedList(checkData);
    }
    setRowData(tempArr);
  };

  const CheckBoxSelectAll = (e) => {
    const newSelecteds = rowData.map((item) => ({
      ...item,
      isChecked: e.target.checked,
    }));
    setRowData(newSelecteds);
    if (e.target.checked) {
      setSelectedList(newSelecteds);
    } else {
      setSelectedList([]);
    }
  };

  return (
    <>
      <Paper
        className="outbox-table"
        elevation={3}
        style={{
          position: "relative",
          borderRadius: "8px",
        }}
      >
        {HeaderDateRange()}
        <div style={{ padding: "0 1rem" }}>
          <TableContainer
            component={Paper}
            style={{
              border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
            }}
          >
            <Table
              component="div"
              className="outbox_custom_table App-main-table"
              aria-label="simple table"
            >
              <TableHead component="div">
                <TableRow component="div">
                  <div
                    className="outboxCon"
                    style={{
                      borderBottom: `1px solid ${props.theme ? "#727070" : "#c7c7c7"
                        }`,
                      backgroundColor: props.theme ? "#585858" : "#e5e5e5",
                      padding: "0rem",
                    }}
                  >
                    <div className="checkbox">
                      <Checkbox
                        indeterminate={
                          selectedList.length > 0 &&
                          selectedList.length < rowData.length
                        }
                        checked={
                          rowData.length > 0 &&
                          selectedList.length === rowData.length
                        }
                        onChange={CheckBoxSelectAll}
                      />
                    </div>
                    <div className="progress"></div>
                    <div className="info1">
                      <span>{t("to")}</span>
                    </div>
                    <div className="info2">
                      <span>{t("subject")}</span>
                    </div>
                    <div className="info3">
                      <span>{t("file_name")}</span>
                    </div>
                    <div className="info4">
                      <span>{t("date_sent")}</span>
                    </div>
                    <div className="info5">
                      <span>{t("type")}</span>
                    </div>
                  </div>
                </TableRow>
              </TableHead>
              <TableBody
                component="div"
                style={{
                  height: "calc(100vh - 260px)",
                  overflowY: "auto",
                }}
              >
                {rowData.map((item, i) => {
                  return (
                    <TableRow
                      hover
                      component="div"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOnRowClick(item);
                      }}
                      selected={item.isChecked}
                      key={i}
                    >
                      <div
                        className="outboxCon body"
                        style={{
                          borderBottom: `1px solid ${props.theme ? "#727070" : "#c7c7c7"
                            }`,
                        }}
                      >
                        <div className="checkbox">
                          <Checkbox
                            checked={item.isChecked}
                            onClick={(e) => {
                              e.stopPropagation();
                              CheckBoxSelection(e, item);
                            }}
                            disableRipple
                          />
                        </div>
                        <div className="progress">
                          {item.fileStatus === "sent" ? (
                            <Tooltip title="SENT">
                              <IconButton
                                id="outboxBtn_done"
                                className="outboxBtn"
                              >
                                <Done />
                              </IconButton>
                            </Tooltip>
                          ) : item.fileStatus === "delivered" ? (
                            <Tooltip title="DELIVERED">
                              <IconButton
                                id="outboxBtn_doneAll"
                                className="outboxBtn"
                              >
                                <DoneAll />
                              </IconButton>
                            </Tooltip>
                          ) : item.fileStatus === "seen" ? (
                            <Tooltip title="SEEN">
                              <IconButton
                                id="outboxBtn_PlaylistAddCheck"
                                className="outboxBtn"
                              >
                                <DoneAll style={{
                                  color: props.theme
                                    ? "#5cabff"
                                    : "rgb(5 100 200)",
                                }} />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="FORWARDED">
                              <IconButton
                                id="outbox_addCheck_btn"
                                className="outboxBtn tripple-tick"
                              >
                                <Done id="tick-1" style={{
                                  color: props.theme
                                    ? "#5cabff"
                                    : "rgb(5 100 200)",
                                  padding: "0px"
                                }} />
                                <Done id="tick-2" style={{
                                  color: props.theme
                                    ? "#5cabff"
                                    : "rgb(5 100 200)",
                                  padding: "0px"
                                }} />
                                <Done id="tick-3" style={{
                                  color: props.theme
                                    ? "#5cabff"
                                    : "rgb(5 100 200)",
                                  padding: "0px"
                                }} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </div>
                        <div className="info1 text-overflow">
                          <Tooltip title={item.to}>
                            <span>{item.to}</span>
                          </Tooltip>
                        </div>
                        <div className="info2 text-overflow">
                          <Tooltip title={item.subject}>
                            <span
                              style={{
                                color: props.theme
                                  ? "#429cff"
                                  : "rgb(5 100 200)",
                              }}
                            >
                              {item.subject}
                            </span>
                          </Tooltip>
                        </div>
                        <div className="info3 text-overflow">
                          <Tooltip title={item.fileName}>
                            <span>{item.fileName}</span>
                          </Tooltip>
                        </div>
                        <div className="info4 text-overflow">
                          <Tooltip title={item.dateSent}>
                            <span
                              style={{
                                color: props.theme
                                  ? "#429cff"
                                  : "rgb(5 100 200)",
                              }}
                            >
                              {item.dateSent}
                            </span>
                          </Tooltip>
                        </div>
                        <div className="info5">
                          <span>{item.type}</span>
                          <div className="outboxIcons">
                            {item.type === "File" && (
                              <Tooltip
                                title={t("user_history")}
                                aria-label="User History"
                              >
                                <IconButton
                                  id="outboxBtn_history_btn"
                                  className="outboxBtn"
                                  onClick={(e) =>
                                    handleOnClickOpenHistory(e, item)
                                  }
                                >
                                  <HistoryIcon
                                    color={props.theme ? "action" : "primary"}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <PaginationComp
          pageSize={pageSize}
          pageSizes={pageSizes}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalCount={totalCount}
          setPageSize={setPageSize}
        />
      </Paper>
      <Dialog
        open={blnOpenHistory}
        onClose={(e) => setblnOpenHistory(false)}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ minWidth: "300px" }}
        fullWidth
        className="outbox-history"
        maxWidth="sm"
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          <span>{t("user_history")}</span>
          <IconButton
            id="outbox_history_btn"
            onClick={(e) => setblnOpenHistory(false)}
            className="cancel-drag"
          >
            <CloseIcon style={{ color: theme ? "#fff" : "inherit" }} />
          </IconButton>
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
                  <TimelineDot
                    color={item.color || "grey"}
                    variant={item.variant || "outlined"}
                  />
                  {sampleData.length === index + 1 ? "" : <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Paper
                    elevation={3}
                    className={classes.paper}
                    style={{ backgroundColor: "#eaeaea" }}
                  >
                    <Typography
                      variant="body2"
                      style={{ fontWeight: "bold", color: "#000" }}
                    >
                      <span
                        style={{ fontWeight: "bold", color: "#000" }}
                      >{`${item.title}: `}</span>
                      {item.description}
                    </Typography>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </DialogContent>
      </Dialog>
      {openDialog && (
        <Dialog
          fullScreen
          open={openDialog}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <div
            style={{
              backgroundColor: theme ? "rgb(46 46 46)" : "rgb(241 241 241)",
              height: "100%",
            }}
          >
            {type ? (
              <Tabs
                forceRenderTabPanel
                selectedIndex={tabIndex}
                onSelect={(index) => setTabIndex(index)}
                style={{ height: "100%" }}
              >
                <TabList>
                  <Tab style={{ borderRadius: "5px 5px 0 0" }}>
                    {t("personal_application").toUpperCase()}
                  </Tab>
                  <Tab style={{ borderRadius: "5px 5px 0 0" }}>
                    {t("annexure")}
                  </Tab>
                  <IconButton
                    id="outbox_PA_close_btn"
                    aria-label="close"
                    onClick={handleClose}
                    style={{
                      color: props.theme ? "#fff" : "rgba(0, 0, 0, 0.54)",
                      float: "right",
                      marginTop: "15px",
                      marginRight: "16px",
                    }}
                    className="icons-button"
                    size="small"
                  >
                    <CancelOutlined fontSize="small" />
                  </IconButton>
                </TabList>
                <TabPanel style={{ height: "calc(100vh - 60px)" }}>
                  <div
                    style={{
                      border: "1px solid #b6b6b66b",
                      height: "100%",
                      overflow: "hidden",
                    }}
                    className="ss-privacy-hide"
                  >
                    <SplitViewPdfViewer
                      fileUrl={resp && resp.fileUrl}
                      pdfLoads={(val) => {
                        setPdfLoads(val);
                      }}
                    />
                  </div>
                </TabPanel>
                <TabPanel style={{ height: "calc(100vh - 60px)" }}>
                  <Annexure resp={resp} />
                </TabPanel>
              </Tabs>
            ) : (
              <Tabs
                forceRenderTabPanel
                selectedIndex={tabIndex}
                onSelect={(index) => setTabIndex(index)}
              >
                <TabList>
                  <Tab style={{ borderRadius: "5px 5px 0 0" }}>
                    {t("personal_file").toUpperCase()}
                  </Tab>
                  <IconButton
                    id="outbox_PF_close_btn"
                    aria-label="close"
                    onClick={handleClose}
                    style={{
                      color: props.theme ? "#fff" : "rgba(0, 0, 0, 0.54)",
                      float: "right",
                      marginTop: "15px",
                      marginRight: "16px",
                    }}
                    className="icons-button"
                    size="small"
                  >
                    <CancelOutlined fontSize="small" />
                  </IconButton>
                </TabList>
                <TabPanel>
                  <FileViewTable resp={resp} />
                </TabPanel>
              </Tabs>
            )}
          </div>
        </Dialog>
      )}
      <Dialog
        maxWidth="md"
        open={open}
        keepMounted
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <span style={{ fontSize: "20px" }}>{t("choose_date_range")}</span>
          <Typography
            variant="button"
            color="primary"
            style={{ fontSize: "20px", float: "right" }}
            className="cancel-drag"
          >
            <CloseIcon
              style={{ cursor: "pointer", color: theme ? "#fff" : "inherit" }}
              onClick={handleClose}
            />
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <DateRangeFilter onDateChange={onDateChange} date={date} />
        </DialogContent>
        <DialogActions>
          <Button
            id="outbox_apply_btn"
            variant="contained"
            color="secondary"
            style={{ float: "right" }}
            onClick={handleSubmit}
          >
            APPLY
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    subscribeApi: state.subscribeApi,
    subscribeApi: state.subscribeApi,
    theme: state.theme,
  };
}

export default connect(mapStateToProps, {
  loadOutboxData,
  changingTableStateOutbox,
  getHistory,
  loadOutboxRow,
  getDataForExport,
})(OutboxTable);
