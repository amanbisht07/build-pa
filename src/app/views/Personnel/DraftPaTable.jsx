import React, { useState, useEffect } from "react";
import {
  Button,
  Chip,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  Paper,
  Slide,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import { setSnackbar } from "../../camunda_redux/redux/ducks/snackbar";
import {
  loadPADraftTableData,
  loadSfdt,
  rollbackPADocument,
  getHistory,
  currentSign,
  getAllCorespondence,
  getCorespondence,
  rollbackCorrDocument,
} from "../../camunda_redux/redux/action";
import { connect as reduxConnect, useDispatch, useSelector } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "./therme-source/material-ui/loading.css";
import Annexure from "./Annexure";
import InputForm from "./quickSignFrom";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import HeadersAndFootersView from "../FileApproval/documentEditor/editor";
import { changeTableStateDraft } from "../../camunda_redux/redux/action/apiTriggers";
import Tooltip from "@material-ui/core/Tooltip";
import SendFileForm from "./SendFileForm";
import SplitViewPdfViewer from "../inbox/shared/pdfViewer/pdfViewer";
import CreateIcon from "@material-ui/icons/Create";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";
import SendIcon from "@material-ui/icons/Send";
import RestorePageIcon from "@material-ui/icons/RestorePage";
import HistoryIcon from "@material-ui/icons/History";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import { OPEN_PA_DRAFT } from "app/camunda_redux/redux/constants/ActionTypes";
import AddIcon from "@material-ui/icons/Add";
import PaginationComp from "../utilities/PaginationComp";
import { unstable_batchedUpdates } from "react-dom";
import { Loading } from "./therme-source/material-ui/loading";
import _ from "lodash";
import GenericFilterMenu from "../utilities/GenericFilterMenu";
import GenericSearch from "../utilities/GenericSearch";
import GenericChip from "../utilities/GenericChips";
import HistoryDialog from "./HistoryDialog";
import { AiOutlineHistory } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import CorrHrmDialog from "../Correspondence/CorrHrmDialog";
import { CancelOutlined } from "@material-ui/icons";
import { handleError } from "utils";

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
    justifyContent: "center",
    marginBottom: "0px",
    fontSize: "1.1rem",
  },
  table: {
    minWidth: "900px",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DraftPaFileTable = (props) => {
  // Now this same component will be used for both pa and correspondence
  const { correspondence } = props;

  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();

  const [rowData, setRowData] = useState([]);
  const [openQuickSign, setOpenQuickSign] = useState(false);
  const [open, setOpen] = useState(false);
  const [send, setSend] = useState(false);
  const [blnOpenQuickSign, setblnOpenQuickSign] = useState(true);
  const [blnOpenEditor, setblnOpenEditor] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  const [rowID, setRowID] = useState(""); // this id work as both pa id or coor doc id

  const [fileURL, setFileURL] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [openSign, setOpenSign] = useState(false);
  const [pdfLoads, setPdfLoads] = useState(false);
  const [headerLable, setHeaderLable] = useState({});
  const [pageSizes] = useState([5, 10, 15]);

  const [handleClickId, setHandleClickId] = useState(""); // this will work as pa id as well as corr id not doc id

  const [blnOpenHistory, setblnOpenHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [openPaDialog, setOpenPaDialog] = useState(false);
  const [reSave, setreSave] = useState(false);
  const [loading, setloading] = useState(false);

  const username = localStorage.getItem("username");
  const role = sessionStorage.getItem("role");
  const dept = sessionStorage.getItem("department");

  // state Variable which get track of sort option with orderBy
  const [SortBy, setSortBy] = useState({});

  // to handle update single pa either signed or unsigned without calling ap
  const [updatedPa, setupdatedPa] = useState("");

  const [corrType, setCorrType] = useState("");

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
      value: "pfileName",
      label: "File Name",
    },
    {
      value: "status",
      label: "Status",
    },
    {
      value: "createdOn",
      label: "Created On",
    },
  ];
  const StatusOption = [
    "In Progress",
    "Approved",
    "Draft",
    "Rejected",
    "Return",
  ];

  const classObj = {
    Container: "",
    ChipContainer: "PaChipCon",
    FilterInpContainer: "PaFilterInputs",
  };

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
      name: "pfileName",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "createdOn",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
    },
    {
      name: "status",
      type: "select",
      optionValue: StatusOption,
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
      name: "pfileName",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "File Name",
      color: "primary",
    },
    {
      name: "createdOn",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
      label: "Date",
    },
  ];

  // state variable which get track of all filter option with value
  const [Filter, setFilter] = useState({});

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

  const { theme } = useSelector((state) => state);
  const { mount } = useSelector((state) => state.refreshings);

  useEffect(() => {
    let draftAbort = new AbortController();
    pADraftTableData(draftAbort.signal);

    return () => {
      draftAbort.abort();
    };
  }, [
    blnValueDraft,
    currentPage,
    pageSize,
    props.subjectReducer,
    mount,
    Filter,
    SortBy,
  ]);

  const pADraftTableData = (abortSignal) => {
    props.blnEnableLoader(true);
    setRowData([]);
    let filter = {};
    Object.entries(Filter).map(([property, value]) => {
      let key = property.split("|")[0];
      filter[`${key}`] = value;
    });
    if (correspondence) {
      props
        .getAllCorespondence(pageSize, currentPage)
        .then((resp) => {
          let tmpArr = [];
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              props.blnEnableLoader(false);
              return;
            } else {
              setTotalCount(
                resp.response.length != null ? resp.response.length : 0
              );
              tmpArr = resp.response.data.map((item, index) => {
                return {
                  ...item,
                  serialNo: pageSize * currentPage + (index + 1),
                };
              });
              setRowData(tmpArr);
              props.blnEnableLoader(false);
              props.changeTableStateDraft(false, "CHANGE_PA_DRAFT");
            }
          } catch (e) {
            callMessageOut(e.message);
            props.blnEnableLoader(false);
          }
        })
        .catch((e) => {
          callMessageOut(e.message);
          props.blnEnableLoader(false);
        });
    } else {
      props
        .loadPADraftTableData(username, role, dept, pageSize, currentPage, {
          filter: _.isEmpty(filter) ? null : filter,
          sort: _.isEmpty(SortBy) ? null : SortBy,
        }, abortSignal)
        .then((resp) => {
          let tmpArr = [];
          console.log(resp);
          try {
            if (resp.error) {
              if (resp?.error?.includes("aborted")) {
                return;
              }
              let errMsg = handleError(resp.error);
              callMessageOut(errMsg);
              props.blnEnableLoader(false);
              return;
            } else {
              setTotalCount(
                resp.response.length != null ? resp.response.length : 0
              );
              tmpArr = resp.response.data.map((item, index) => {
                return {
                  ...item,
                  serialNo: pageSize * currentPage + (index + 1),
                };
              });
              setRowData(tmpArr);
              props.blnEnableLoader(false);
              props.changeTableStateDraft(false, "CHANGE_PA_DRAFT");
            }
          } catch (e) {
            callMessageOut(e.message);
            props.blnEnableLoader(false);
          }
        })
        .catch((e) => {
          console.log(e);
          let errMsg = handleError(e.message);
          callMessageOut(errMsg);
          props.blnEnableLoader(false);
        });
    }
  };

  const { blnValueDraft } = props.subscribeApi;

  useEffect(() => {
    if (props.openDraftPa && correspondence) {
      let row = props.openDraftPa;
      handleCorrClick(row);
    } else if (props.openDraftPa) {
      let row = props.openDraftPa;
      // setHandleClickId(row.id);
      const url = row.fileURL;
      sessionStorage.setItem("FileURL", url);
      loadSFDT(url, row.id, row.status, row.signed);
      setHandleClickId(row.id);
      setHeaderLable({ subject: row.subject, pfileName: row.displayPfileName });
    }
    dispatch({
      type: OPEN_PA_DRAFT,
      payload: null,
    });
  }, [props.openDraftPa, correspondence]);

  useEffect(() => {
    if (!blnOpenQuickSign) {
      setPdfLoads(false);
    }
  }, [blnOpenQuickSign]);

  const showSWpdf = () => {
    if (pdfLoads) {
      return true;
    } else {
      return false;
    }
  };

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
    // };
    // if (this.id === undefined) {
    //   return dispatch(setSnackbar(true, "error", message));
    // }
  };

  const updateSinglePa = () => {
    let newRowData = [...rowData];
    const index = newRowData.findIndex((item) => {
      return item.id === handleClickId;
    });
    if (index !== -1 && updatedPa) {
      newRowData[index].signed = updatedPa.signed;
      setRowData(newRowData);
      setupdatedPa("");
    }
  };

  const loadSFDT = (url, id, status, signed, corrId) => {
    props.blnEnableLoader(true);
    let URL;
    let fileId = corrId ? corrId : id;
    let OpenPaDialog;
    props
      .loadSfdt(url, username, id, role, dept) // API call to load sfdt which will be visible on sincfusion
      .then((response) => {
        try {
          if (response.error) {
            callMessageOut(response.error);
            props.blnEnableLoader(false);
            return;
          } else {
            URL = response.url;
            if (URL) {
              if (status === "Draft" || status === "Return") {
                OpenPaDialog = false; // show with editor
              } else {
                OpenPaDialog = true; // to show without editor
              }
            }
          }
          unstable_batchedUpdates(() => {
            setblnOpenQuickSign(signed);
            setRowID(fileId);
            setFileURL(URL);
            setblnOpenEditor(true);
            setTabIndex(0);
            setOpenQuickSign(true);
            setOpenPaDialog(OpenPaDialog);
            props.blnEnableLoader(false);
          });
        } catch (e) {
          props.blnEnableLoader(false);
          callMessageOut(e.message);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
        props.blnEnableLoader(false);
      });
  };

  const handleClick = (rowData) => {
    // Again same component for both correspondence and pa
    if (correspondence) {
      handleCorrClick(rowData);
      setCorrType(rowData.type);
    } else {
      const url = rowData.fileURL;
      sessionStorage.setItem("FileURL", url);
      loadSFDT(url, rowData.id, rowData.status, rowData.signed);
      unstable_batchedUpdates(() => {
        setHandleClickId(rowData.id);
        setHeaderLable({
          subject: rowData.subject,
          pfileName: rowData.displayPfileName,
        });
      });
    }
  };

  const handleCorrClick = (rowData) => {
    props.blnEnableLoader(true);
    props
      .getCorespondence(rowData.correspondenceDocId)
      .then((res) => {
        const { application, id: corrId } = res.response;
        sessionStorage.setItem("FileURL", application.fileUrl);
        loadSFDT(
          application.fileUrl,
          rowData.id,
          rowData.status,
          application.signed,
          corrId
        );
        unstable_batchedUpdates(() => {
          setHandleClickId(rowData.id);
          setHeaderLable({
            subject: rowData.subject,
            pfileName: rowData.correspondenceNumber,
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClickQuickSignClose = (shouldUpdatePa) => {
    // Mtd that triggers while clicking on close icon of quick sign dialog
    setOpenQuickSign(false);
    setblnOpenEditor(true);
    // setblnOpenQuickSign(false);
    shouldUpdatePa && updateSinglePa();
  };

  const handleDocumentRollback = () => {
    setloading(true);
    let body;
    if (correspondence) {
      body = {
        corrDocId: rowID,
        annexure: false,
        reference: false,
        application: true,
        flagNumber: 0,
      };
      props.rollbackCorrDocument(body).then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            setloading(false);
            return;
          } else {
            const { response } = resp;
            unstable_batchedUpdates(() => {
              setblnOpenQuickSign(response.signed);
              setFileURL(response.fileUrl);
              // setreSave(true);
              setloading(false);
              setupdatedPa(response);
            });
            sessionStorage.setItem("FileURL", response.fileUrl);
          }
          // pADraftTableData();
        } catch (e) {
          callMessageOut(e.message);
          setloading(false);
        }
      });
    } else {
      rowID &&
        props.rollbackPADocument(rowID).then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              setloading(false);
              return;
            } else {
              unstable_batchedUpdates(() => {
                setblnOpenQuickSign(resp.response.personalApplication.signed);
                setFileURL(resp.response.personalApplication.fileURL);
                // setreSave(true);
                setloading(false);
                setupdatedPa(resp.response.personalApplication);
              });
              sessionStorage.setItem(
                "FileURL",
                resp.response.personalApplication.fileURL
              );
            }
            // pADraftTableData();
          } catch (e) {
            callMessageOut(e.message);
            setloading(false);
          }
        });
    }
  };

  const handleStatus = (id) => {
    const newArr = rowData.map((item) =>
      item.id === id || item.correspondenceDocId === id
        ? { ...item, status: "In Progress" }
        : item
    );
    setRowData(newArr);
  };

  const handleOnClickOpenHistory = (id, forDialog) => {
    // e.stopPropagation();
    if (id) {
      props.getHistory("PA", id).then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          } else {
            !isNullOrUndefined(resp.data)
              ? setHistoryData(resp.data)
              : setHistoryData([]);
          }
          forDialog && setblnOpenHistory(true);
        } catch (error) {
          callMessageOut(error.message);
        }
      });
    }
  };

  const addSort = (sortObj) => {
    setSortBy(sortObj);
  };

  return (
    <div>
      <Paper
        elevation={3}
        style={{
          position: "relative",
          borderRadius: "9px",
          // border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
        }}
      >
        <div className="PaHeader">
          <div className="PaHeadTop">
            <GenericSearch
              FilterTypes={FilterTypes}
              FilterValueTypes={FilterValueTypes}
              addFilter={addFilter}
              cssCls={{}}
            />

            <div>
              <GenericFilterMenu
                SortValueTypes={SortValueTypes}
                addSort={addSort}
              />
              <div className="PaIconCon">
                <Tooltip
                  title={
                    correspondence
                      ? t("create_correspondence")
                      : t("personal_application")
                  }
                >
                  <span>
                    <Fab
                      disabled={!props.myInfo}
                      style={{
                        width: "2.2rem",
                        height: ".1rem",
                        backgroundColor: "rgb(230, 81, 71)",
                      }}
                      onClick={() => props.handleClick()}
                    >
                      <AddIcon style={{ fontSize: "19", color: "#fff" }} />
                    </Fab>
                  </span>
                </Tooltip>
              </div>
            </div>
          </div>

          <GenericChip Filter={Filter} deleteChip={deleteChip} />
        </div>

        <div style={{ padding: "0 1rem" }}>
          <TableContainer
            component={Paper}
            className="PaTableCon"
            style={{
              border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
            }}
          >
            <Table
              component="div"
              className={`${classes.table} App-main-table`}
              aria-label="simple table"
            >
              <TableHead
                component="div"
                style={{ backgroundColor: props.theme ? "#585858" : "#e5e5e5" }}
              >
                <TableRow component="div">
                  <div className="PaRow">
                    <div className="paInfo1"></div>
                    <div className="paInfo2">
                      {correspondence ? (
                        <span>{t("corres_number")}</span>
                      ) : (
                        <span>{t("file_name")}</span>
                      )}
                    </div>
                    <div className="paInfo3">
                      <span>{t("subject")}</span>
                    </div>
                    <div className="paInfo4">
                      <span>{t("created_on")}</span>
                    </div>
                    <div className="paInfo5">
                      <span>{t("status")}</span>
                    </div>
                  </div>
                </TableRow>
              </TableHead>
              <TableBody
                component="div"
                style={{ height: `calc(100vh - 260px )`, overflowY: "auto" }}
              >
                {/* Mapping data coming from backnd */}
                {rowData.map((item, i) => {
                  const sts = item.status;
                  // const bgc =
                  //   sts == "In Progress"
                  //     ? "rgb(208 239 247 / 58%)"
                  //     : sts == "Draft"
                  //     ? "initial"
                  //     : sts == "rejected"
                  //     ? "rgb(246 225 181 / 43%)"
                  //     : "";

                  // Row defination and styling here

                  return (
                    <TableRow
                      hover
                      component="div"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick(item);
                      }}
                      key={i}
                      style={{
                        // backgroundColor: bgc,
                        borderBottom: "1px solid #8080805c",
                        position: "relative",
                      }}
                    >
                      <div className="PaRow body">
                        <div className="paInfo1">
                          <span>{item.serialNo}</span>
                        </div>
                        <div className="paInfo2">
                          {correspondence ? (
                            <span>{item.correspondenceNumber}</span>
                          ) : (
                            <span>{item.displayPfileName}</span>
                          )}
                        </div>
                        <div className="paInfo3 text-overflow">
                          <Tooltip
                            title={item.subject}
                            aria-label="text-adjust"
                          >
                            <span>{item.subject}</span>
                          </Tooltip>
                        </div>
                        <div className="paInfo4">
                          <span>{item.createdOn}</span>
                        </div>
                        <div className="paInfo5">
                          <span
                            style={{
                              backgroundColor:
                                item.status === "In Progress"
                                  ? "#ffaf38"
                                  : item.status === "Draft"
                                    ? "#398ea1"
                                    : item.status === "Rejected"
                                      ? "#fd4e32"
                                      : item.status === "Approved"
                                        ? "#37d392"
                                        : item.status === "Return"
                                          ? "#b73b32"
                                          : "",
                            }}
                            className="status"
                          >
                            {item.status?.toUpperCase()}
                          </span>
                        </div>

                        <div className="paIcons">
                          {item.status !== "Draft" ? (
                            <Tooltip title={t("user_history")}>
                              <button
                                id="draftPA_history_btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOnClickOpenHistory(item.id, true);
                                }}
                              >
                                <AiOutlineHistory />
                              </button>
                            </Tooltip>
                          ) : (
                            !item.signed && (
                              <Tooltip
                                title={t("edit_subject")}
                                aria-label="Edit Subject"
                              >
                                <button
                                  id="draftPA_edit_btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    props.handleUpdateSubject(item);
                                  }}
                                >
                                  <FiEdit2 />
                                </button>
                              </Tooltip>
                            )
                          )}
                        </div>
                      </div>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

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

      {/* Here this below dialog will be used for both pa and correspondence */}
      <Dialog
        open={openQuickSign}
        fullScreen
        aria-labelledby="quickSignDialog"
        TransitionComponent={Transition}
        className={classes.divZIndex}
        id="draggable-dialog-title"
      >
        <DialogContent
          dividers
          style={{
            overflow: "hidden",
            backgroundColor: theme ? "rgb(46 46 46)" : "rgb(241 241 241)",
          }}
        >
          {loading && <Loading />}

          {openPaDialog ? (
            <Tabs
              forceRenderTabPanel
              selectedIndex={tabIndex}
              onSelect={(index) => {
                setTabIndex(index);
              }}
            >
              <TabList
                style={{
                  position: "relative",
                  zIndex: 12,
                }}
              >
                <Tab style={{ borderRadius: "5px 5px 0 0" }}>
                  {correspondence
                    ? t("correspondence").toUpperCase()
                    : t("personal_application").toUpperCase()}
                </Tab>
                <IconButton
                  id="draftPA_close_PA"
                  aria-label="close"
                  onClick={() => {
                    handleClickQuickSignClose(false);
                  }}
                  style={{
                    color: props.theme ? "#fff" : "rgba(0, 0, 0, 0.54)",
                    float: "right",
                    marginTop: "17px",
                    marginRight: "16px",
                  }}
                  className="icons-button"
                  size="small"
                >
                  <CancelOutlined fontSize="small" />
                </IconButton>
              </TabList>

              <TabPanel>
                <div hidden={!blnOpenEditor} style={{ height: "100%" }}>
                  <Annexure
                    fileId={rowID}
                    showUploader={false}
                  // sampleData={sampleData}
                  />
                </div>
              </TabPanel>
            </Tabs>
          ) : (
            <Tabs
              // forceRenderTabPanel
              selectedIndex={tabIndex}
              onSelect={(index) => setTabIndex(index)}
            >
              <TabList
                style={{
                  position: "relative",
                  zIndex: 12,
                }}
              >
                <Tab style={{ borderRadius: "5px 5px 0 0" }}>
                  {correspondence
                    ? t("correspondence").toUpperCase()
                    : t("personal_application").toUpperCase()}
                </Tab>
                {correspondence ? (
                  <>
                    {corrType != "Signal" && (
                      <>
                        <Tab style={{ borderRadius: "5px 5px 0 0" }}>
                          {t("annexure")}
                        </Tab>
                        <Tab style={{ borderRadius: "5px 5px 0 0" }}>
                          {t("references")}
                        </Tab>
                      </>
                    )}
                    <Tab style={{ borderRadius: "5px 5px 0 0" }}>
                      {t("yellow_notes")}
                    </Tab>
                  </>
                ) : (
                  <Tab style={{ borderRadius: "5px 5px 0 0" }}>
                    {t("annexure")}
                  </Tab>
                )}
                <p
                  className={`${classes.headerText} hideText`}
                  style={{
                    width: correspondence ? "40%" : "60%",
                  }}
                >
                  <b>{t("subject")} : &nbsp;</b>
                  {headerLable.subject &&
                    headerLable.subject?.toUpperCase().slice(0, 25)}
                  <b>&nbsp;| {t("inbox_referenceNumber")}&nbsp;</b>
                  {headerLable.pfileName?.toUpperCase()}
                </p>
                <IconButton
                  id="draftPA_close_PA"
                  aria-label="close"
                  onClick={() => {
                    handleClickQuickSignClose(true);
                  }}
                  style={{
                    color: props.theme ? "#fff" : "rgba(0, 0, 0, 0.54)",
                    float: "right",
                    marginTop: "17px",
                    marginRight: "16px",
                  }}
                  className="icons-button"
                  size="small"
                >
                  <CancelOutlined fontSize="small" />
                </IconButton>
              </TabList>
              <TabPanel>
                <>
                  {blnOpenQuickSign && (
                    <>
                      <Tooltip title={t("send")}>
                        <Fab
                          aria-label="close"
                          color="secondary"
                          className={`button-glow ${classes.sign_btn}`}
                          onClick={(e) => setSend(true)}
                          style={{ padding: "1px" }}
                        >
                          <SendIcon />
                        </Fab>
                      </Tooltip>
                      <Tooltip title={t("undo")} className="dialog_sendButton">
                        <Fab
                          aria-label="close"
                          color="primary"
                          className={classes.sign_btn1}
                          onClick={handleDocumentRollback}
                          style={{ padding: "1px" }}
                        >
                          <RestorePageIcon />
                        </Fab>
                      </Tooltip>
                    </>
                  )}
                  <div
                    style={{
                      display: showSWpdf() ? "initial" : "none",
                      height: "calc(100vh - 200px)",
                      overflow: "hidden",
                    }}
                    className="ss-privacy-hide"
                  >
                    <SplitViewPdfViewer
                      fileUrl={blnOpenQuickSign ? fileURL : ""}
                      pdfLoads={(val) => {
                        setPdfLoads(val);
                      }}
                    />
                  </div>
                </>

                <>
                  {!blnOpenQuickSign && (
                    <Tooltip title={reSave ? t("autosave") : t("sign")}>
                      <span className={`${classes.sign_btn}`}>
                        <Fab
                          aria-label="close"
                          color="secondary"
                          className={`button-glow`}
                          onClick={(e) => {
                            setOpenSign(true);
                            props.currentSign(true);
                          }}
                          disabled={reSave}
                        >
                          <CreateIcon />
                        </Fab>
                      </span>
                    </Tooltip>
                  )}
                  <div
                    className="customDiv ss-privacy-hide"
                    style={{
                      display: !blnOpenQuickSign ? "initial" : "none",
                    }}
                  >
                    <HeadersAndFootersView
                      fileId={!blnOpenQuickSign ? rowID : ""}
                      blnIsPartCase={false}
                      fileUrl1={!blnOpenQuickSign ? fileURL : ""}
                      isAnnexure={false}
                      blnShowQuickSign={true}
                      pane={true}
                      comment={false}
                      reSave={reSave}
                      setreSave={(val) => {
                        setreSave(val);
                      }}
                      containerId={"container1"}
                    />
                  </div>
                </>
              </TabPanel>
              <TabPanel>
                {corrType != "Signal" && (
                  <>
                    {blnOpenQuickSign && (
                      <Tooltip title={t("send")}>
                        <Fab
                          id="DraftPaTable_send_btton"
                          aria-label="close"
                          color="secondary"
                          className={`button-glow ${classes.sign_btn}`}
                          onClick={(e) => setSend(true)}
                        >
                          <SendIcon />
                        </Fab>
                      </Tooltip>
                    )}
                    <Annexure
                      correspondence={correspondence ? true : false}
                      references={false}
                      fileId={rowID}
                      sendToogle={(e) => {
                        setTabIndex(3);
                      }}
                      containerId="container2"
                      showUploader={true}
                    />
                  </>
                )}
              </TabPanel>
              {correspondence && (
                <>
                  {corrType != "Signal" && (
                    <TabPanel>
                      <>
                        {blnOpenQuickSign && (
                          <Tooltip title={t("send")}>
                            <Fab
                              id="DraftPaTable_send_btton"
                              aria-label="close"
                              color="secondary"
                              className={`button-glow ${classes.sign_btn}`}
                              onClick={(e) => setSend(true)}
                            >
                              <SendIcon />
                            </Fab>
                          </Tooltip>
                        )}
                        <Annexure
                          correspondence={true}
                          references={true}
                          fileId={rowID}
                          sendToogle={(e) => {
                            setTabIndex(3);
                          }}
                          showUploader={true}
                          containerId="container21"
                        />
                      </>
                    </TabPanel>
                  )}
                  <TabPanel>
                    <>
                      {blnOpenQuickSign && (
                        <Tooltip title={t("send")}>
                          <Fab
                            id="DraftPaTable_send_btton"
                            aria-label="close"
                            color="secondary"
                            className={`button-glow ${classes.sign_btn}`}
                            onClick={(e) => setSend(true)}
                          >
                            <SendIcon />
                          </Fab>
                        </Tooltip>
                      )}

                      <h4>Yellow Notes</h4>
                    </>
                  </TabPanel>
                </>
              )}
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={openSign}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        maxWidth="md"
        id="pa-sign"
      >
        <Paper>
          <DialogTitle
            id="draggable-dialog-title"
            style={{ padding: "0px 24px !important", cursor: "move" }}
          >
            {t("sign")}
            <IconButton
              id="close_draftPA_table"
              aria-label="close"
              color="primary"
              onClick={() => setOpenSign(false)}
              style={{ float: "right", position: "relative", top: "-9px" }}
              className="cancel-drag"
            >
              <CloseIcon
                style={{
                  color: props.theme ? "#fff" : "inherit",
                }}
              />
            </IconButton>
          </DialogTitle>
          <InputForm
            correspondence={correspondence}
            fileId={rowID}
            toggleViewer={(e, url) => {
              unstable_batchedUpdates(() => {
                setOpenSign(e);
                setblnOpenQuickSign(!e);
                setFileURL(url);
              });
            }}
            returnToEditor={(e) => {
              setblnOpenEditor(true);
            }}
            updatePa={(obj) => {
              setupdatedPa(obj);
            }}
            pfileName={headerLable.pfileName}
          />
        </Paper>
      </Dialog>
      <Dialog
        open={send}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <Paper className="dialog_sendButton">
          <DialogTitle
            id="draggable-dialog-title"
            style={{ padding: "0px 24px !important", cursor: "move" }}
            className="send_dialog"
          >
            {t("forward_file_for_review_approval")}
            <div>
              <Tooltip title={t("cancel")}>
                <IconButton
                  id="file_for_review_closeBtn"
                  aria-label="close"
                  onClick={() => setSend(false)}
                  color="primary"
                  style={{ float: "right" }}
                  className="cancel-drag"
                >
                  <CloseIcon
                    style={{
                      color: props.theme ? "#fff" : "inherit",
                    }}
                  />
                </IconButton>
              </Tooltip>

              <IconButton
                id="draftPA_historyBtn"
                aria-label="userHistory"
                color="primary"
                style={{ float: "right" }}
                onClick={(e) => {
                  handleOnClickOpenHistory(handleClickId, true);
                }}
              >
                <Tooltip
                  title={t("show_user_history")}
                  aria-label="Show User History"
                >
                  <HistoryIcon
                    style={{
                      color: props.theme ? "#fff" : "inherit",
                    }}
                  />
                </Tooltip>
              </IconButton>
            </div>
          </DialogTitle>
          {correspondence ? (
            <CorrHrmDialog
              fileId={rowID}
              handleCloseEvent={(e) => {
                setOpen(false);
                setOpenQuickSign(false);
                setSend(false);
              }}
              setSend={setSend}
              pfileName={headerLable.pfileName}
              handleStatus={handleStatus}
            />
          ) : (
            <SendFileForm
              fileId={rowID}
              handleCloseEvent={(e) => {
                setOpen(false);
                setOpenQuickSign(false);
              }}
              setSend={setSend}
              pfileName={headerLable.pfileName}
              handleStatus={handleStatus}
            />
          )}
        </Paper>
      </Dialog>

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
        <DialogTitle
          id="draggable-dialog-title"
          style={{ cursor: "move" }}
          className="send_dialog"
        >
          <span>{t("user_history")}</span>
          <IconButton
            id="PA_Histry_btn"
            aria-label="close"
            color="primary"
            onClick={() => setblnOpenHistory(false)}
            className="cancel-drag"
          >
            <CloseIcon
              style={{
                color: theme ? "#fff" : "inherit",
              }}
            />
          </IconButton>
        </DialogTitle>
        <HistoryDialog historyData={historyData} />
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
  loadPADraftTableData,
  loadSfdt,
  changeTableStateDraft,
  rollbackPADocument,
  getHistory,
  currentSign,
  getAllCorespondence,
  getCorespondence,
  rollbackCorrDocument,
})(DraftPaFileTable);
