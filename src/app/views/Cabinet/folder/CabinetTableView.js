import React, { useEffect, useState } from "react";
import { Breadcrumb } from "../../../../matx";
import "../folder/index.css";
import {
  Paper,
  Grid,
  Tooltip,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  IconButton,
  TableHead,
  Button,
  Divider,
  Fab,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
  Menu,
  Dialog,
  DialogContent,
  Chip,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { connect as useSelector } from "react-redux";
import {
  getCabinaetData,
  getAdvanceSearch,
  loadAdvanceSearch,
} from "../../../camunda_redux/redux/action/index";
import { changingTableStateCabinet } from "../../../camunda_redux/redux/action/apiTriggers";
import { connect, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import history from "../../../../history";
import PaginationComp from "app/views/utilities/PaginationComp";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import GenericSearch from "app/views/utilities/GenericSearch";
import GenericFilterMenu from "app/views/utilities/GenericFilterMenu";
import GenericChip from "app/views/utilities/GenericChips";
import NoteAddOutlinedIcon from "@material-ui/icons/NoteAddOutlined";
import { unstable_batchedUpdates } from "react-dom";

import SystemUpdateAltTwoToneIcon from "@material-ui/icons/SystemUpdateAltTwoTone";
import AssessmentIcon from "@material-ui/icons/Assessment";
import { makeStyles } from "@material-ui/core/styles";
import ConfirmationDialog from "./ConfirmationDialog";
import { Add, ExpandMore } from "@material-ui/icons";
import CreateFile from "./CreateFile";
import CreateVolumeFile from "./CreateVolumeFile";
import Custodian from "./Custodian";
import AdvanceSeach from "../advanceSeach";
import { useContext } from "react";
import { AdvanceSearchContext } from "./Cabinet";
import { permanentlyClose } from "app/camunda_redux/redux/action/backend-rest/form-data";
import data from "app/views/RTI/sharedComponents/data";
import CloudTable from "app/views/inbox/shared/SplitviewContainer/CloudTable";

let drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaperNotOpen: {
    width: drawerWidth,
    top: "4.7rem",
    height: Number(window.innerHeight - 98),
    visibility: "initial",
    display: "none",
  },
  drawerPaperOpen: {
    width: drawerWidth,
    top: "5rem",
    height: Number(window.innerHeight - 98),
    display: "initial",
  },
  dialog_paper: {
    transform: "translateX(13%)",
    position: "relative",
    top: "7.5rem !important",
  },
}));

const CabinetTable = (props) => {
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowData, setRowData] = useState([]);
  const { blnValueCabinet } = props.subscribeApi;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [selectedRow, setSelectedRow] = useState(null);

  const [openCustodian, setOpenCustodian] = useState(false);
  const [createVolume, setcreateVolume] = useState(false);
  const [createFile, setcreateFile] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAdvance, setOpenAdvance] = useState(false);
  const [navData, setNavData] = useState(null);
  const [tigger, setTrigger] = useState(false);
  const [type2, setType] = useState("");
  const [apiObj, setapiObj] = useState({
    barCreated: "",
    barDocumenttype: "",
  });
  const [chipState, setchipState] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const role = sessionStorage.getItem("role");
  const department = sessionStorage.getItem("department");
  const username = localStorage.getItem("username");
  let cabinetId = Cookies.get("cabinetId");

  const handleTrigger = () => {
    setTrigger(true);
  };

  const openFileCreate = () => {
    setcreateFile(!createFile);
  };

  const handleDialog = () => {
    setOpenDialog(!openDialog);
  };

  const handleFileClose = () => {
    props.permanentlyClose(cabinetId).then((res) => {
      console.log("File has been closed", res);
    });
  };

  const handleCreateVol = () => {
    setcreateVolume(!createVolume);
  };

  const handleCustodian = () => {
    setOpenCustodian(!openCustodian);
  };

  const handleOpenAdvance = () => {
    setOpenAdvance(!openAdvance);
  };
  const handledata = (type1, type2) => {

    if (type1 === "DocumentType") {
      setapiObj({
        ...apiObj,
        barDocumenttype: type2,
      });
    } else {
      setapiObj({
        ...apiObj,
        barCreated: type2,
      });
    }
  };
  const handleChipAndPopulate = (Heading, subHeading) => {
    console.log(Heading, subHeading);
    handleChipState(Heading, subHeading);
    handledata(Heading, subHeading);
    setCurrentPage(0);
  };
  useEffect(() => {
    loadAdvanceSearchTable();
  }, [apiObj.barCreated, apiObj.barDocumenttype, currentPage, pageSize]);

  const handleChipState = (Heading, subHeading) => {
    setchipState([
      ...chipState,
      {
        key: Heading,
        value: subHeading,
      },
    ]);
  };

  const handleChipDelete = (index, chipKey, activeChip) => {
    let modifiedChips = chipState.filter((item) => item.value !== activeChip);
    setchipState(modifiedChips);

    if (chipKey === "DocumentType") {
      setapiObj({
        ...apiObj,
        barDocumenttype: "",
      });
    } else {
      setapiObj({
        ...apiObj,
        barCreated: "",
      });
    }
    setCurrentPage(0);
  };

  const handleClosemenu = () => {
    setAnchorEl(null);
  };

  const FilterOption = [
    {
      value: "Select Field",
      label: "Select Field",
    },
    {
      value: "advance",
      label: "Advance Search",
    },
    {
      value: "oldFile",
      label: "Old File",
    },
    {
      value: "subject",
      label: "Subject",
    },
    {
      value: "status",
      label: "Status",
    },
    {
      value: "caseNumber",
      label: "Case Number",
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
      name: "advance",
      type: "auto",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "oldFile",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "subject",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "caseNumber",
      type: "text",
      size: "small",
      variant: "outlined",
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
      name: "oldFile",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Old FileName",
      color: "primary",
    },
    {
      name: "subject",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Subject",
      color: "primary",
    },
    {
      name: "caseNumber",
      type: "text",
      size: "small",
      variant: "outlined",
      color: "primary",
      label: "Case Number",
    },
    {
      name: "createdOn",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
      label: "CreatedOn",
    },
    {
      name: "status",
      type: "select",
      optionValue: StatusOption,
      size: "small",
      variant: "outlined",
      label: "Status",
      color: "primary",
    },
  ];
  const [Filter, setFilter] = useState({});
  const [SortBy, setSortBy] = useState({});

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
  const addSort = (sortObj) => {
    console.log(sortObj);
    setSortBy(sortObj);
  };

  const deleteChip = (property) => {
    let newFilter = { ...Filter };
    delete newFilter[`${property}`];
    setFilter(newFilter);
  };
  const { mount } = useSelector((state) => state.refreshings);

  useEffect(() => {
    let cabinetAbort = new AbortController()
    if (!text && !sendBy && !createdBy && !fileNo && !subject && !status) {
      loadCabinateData(cabinetAbort.signal);
      setTrigger(false);
    }

    return () => {
      cabinetAbort.abort()
    }
  }, [blnValueCabinet, Filter, SortBy, mount, pageSize, currentPage, tigger]);

  const loadCabinateData = (abortSignal) => {
    props.handleLoading(true);
    let filter = {};
    Object.entries(Filter).map(([property, value]) => {
      let key = property.split("|")[0];
      filter[`${key}`] = value;
    });
    props
      .getCabinaetData(
        role,
        department,
        username,
        {
          filter: _.isEmpty(filter) ? null : filter,
          sort: _.isEmpty(SortBy) ? null : SortBy,
        },
        pageSize,
        currentPage,
        abortSignal
      )
      .then((resp) => {
        if (resp?.error?.includes("aborted")) {
          return;
        }
        let tmpArr = [];
        if (resp.error) {
          callMessageOut(resp.error);
          props.handleLoading(false);
        }
        try {
          tmpArr = resp?.data.map((item, index) => {
            return {
              ...item,
              serialNo: pageSize * currentPage + (index + 1),
            };
          });
          setRowData(tmpArr);
          setTotalCount(resp.length);
          // props.changingTableStateCabinet(false, "CHANGE_CABINET");
          props.handleLoading(false);
        } catch (error) {
          callMessageOut(error.message);
          props.handleLoading(false);
        }
      })
      .catch((err) => {
        callMessageOut(err.message);
        props.handleLoading(false);
      });
  };

  const callMessageOut = (msg) => {
    dispatch(setSnackbar(true, "error", msg));
  };

  const handleClick = (rowData) => {
    sessionStorage.setItem("InboxID", rowData.id);
    sessionStorage.setItem("pa_id", rowData.personalApplicationInventoryId);
    Cookies.set("inboxFile", rowData.subject);
    Cookies.set("priority", rowData.priority);
    Cookies.set("isCabinet", true);
    Cookies.set("cabinetStatus", rowData.status);
    Cookies.set("referenceNumber", rowData.file);
    Cookies.set("type", rowData.type);
    Cookies.set("cabinetpartcase", rowData.partcaseId);
    Cookies.set("cabinetid", rowData.id);
    Cookies.set("department", rowData.department);
    Cookies.set("partCase", true);
    Cookies.set("isFile", true);
    Cookies.set("enc", rowData.encNo);
    Cookies.set("not", rowData.notingNo);
    if (rowData.encNo) {
      Cookies.set("searchEnc", text);
    }
    if (rowData.notingNo) {
      Cookies.set("searchNoting", text);
    }
    history.push({
      pathname: "/eoffice/splitView/file",
      state: rowData.subject,
    });
  };

  const [createOnValue, setCreatedOnValue] = useState(null);

  /*--------------------------------Advance Search------------------------------------*/

  const { text, sendBy, createdBy, fileNo, subject, status, scope } =
    useContext(AdvanceSearchContext);

  // useEffect(() => {
  //   console.log("Internal scope", scope);
  // }, [scope]);

  const loadAdvanceSearchTable = (val) => {
    if (val || text || sendBy || createdBy || fileNo || subject || status) {
      props
        .loadAdvanceSearch(
          val,
          text,
          sendBy,
          createdBy,
          fileNo,
          subject,
          status,
          apiObj,
          scope ? scope : "internal",
          role,
          pageSize,
          currentPage,
          username,
          department
        )
        .then(({ response }) => {
          console.log(response);
          if (response?.error) {
            return callMessageOut(response.error);
          }
          console.log(response?.dataTest?.length);
          let tempArr = [];
          for (let i = 0; i < response?.dataTest?.length; i++) {
            let obj = response.dataTest[i];
            tempArr.push({
              serialNo: pageSize * currentPage + (i + 1),
              residingWith: obj.cabResidingWith,
              oldFile: obj.caboldFile,
              subject: obj.cabSubject,
              status: obj.cabStatus,
              createdOn: obj.fcreatedOnTime,
              createdBy: obj.pcCreatedBy,
              custodian: [],
              partcaseId: obj.partcaseId,
              encNo: obj.encNo,
              notingNo: obj.notingNo,
            });
          }
          setNavData(response?.navData);
          console.log(response?.navData, "responsenavdata");
          setRowData(tempArr);
          setTotalCount(response?.records);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  /*--------------------------------Advance Search------------------------------------*/

  const CustomToolbarMarkup = () => {
    const show = selectedRow?.status === "In-Cabinet";
    return (
      <div>
        <div className="CabinetHeadTop">
          <GenericSearch
            FilterTypes={FilterTypes}
            FilterValueTypes={FilterValueTypes}
            addFilter={addFilter}
            cssCls={{}}
            handleOpenAdvance={handleOpenAdvance}
            width="70%"
            loadAdvanceSearchTable={loadAdvanceSearchTable}
            setCurrentPage={setCurrentPage}
            setchipState={setchipState}
            setapiObj={setapiObj}
          />
          <div
            className="internal-head-icon"
            style={{
              visibility: selectedRow ? "visible" : "hidden",
            }}
          >
            <span
              style={{
                visibility: show ? "visible" : "hidden",
              }}
            >
              <Tooltip title={t("permanently_close")}>
                <IconButton onClick={handleDialog}>
                  <SystemUpdateAltTwoToneIcon />
                </IconButton>
              </Tooltip>
            </span>

            <span
              style={{
                visibility: show ? "visible" : "hidden",
              }}
            >
              <Tooltip title={t("create_volume_file")}>
                <IconButton onClick={handleCreateVol}>
                  <NoteAddOutlinedIcon />
                </IconButton>
              </Tooltip>
            </span>

            <span>
              <Tooltip title={t("manage_custodian")}>
                <IconButton onClick={handleCustodian}>
                  <AssessmentIcon />
                </IconButton>
              </Tooltip>
            </span>
          </div>
          {/* <div className="CabinetIconCon">
            <Tooltip title={t("Create File")}>
              <span>
                <Fab
                  disabled={!props.myInfo}
                  style={{
                    width: "2.2rem",
                    height: ".1rem",
                    backgroundColor: "rgb(230, 81, 71)",
                  }}
                  onClick={() => openFileCreate(true)}
                >
                  <Add style={{ fontSize: "19", color: "#fff" }} />
                </Fab>
              </span>
            </Tooltip>
          </div> */}
          {/* <div>
            <GenericFilterMenu
              FilterValueTypes={SortValueTypes}
              addSort={addSort}
            />
          </div> */}
        </div>
        <GenericChip Filter={Filter} deleteChip={deleteChip} />
      </div>
    );
  };

  const handleChange = (e) => {
    console.log("innertext", e.target.innerText);
  };
  return (
    <>
      <Grid container>
        <Grid>
          <Paper
            style={{
              width: "100%",
              borderRadius: "9px",
              marginRight: "1rem",
            }}
          >
            <CustomToolbarMarkup />
            {Boolean(chipState.length) && (
              <Grid container spacing={2} style={{ padding: "0 1rem" }}>
                {chipState &&
                  chipState.map((chipData, i) => {
                    return (
                      <Chip
                        icon
                        label={`${chipData.key} : ${chipData.value}`}
                        key={i}
                        clickable
                        style={{ margin: "3px 0px 5px 3px" }}
                        onDelete={() => {
                          handleChipDelete(i, chipData.key, chipData.value);
                          console.log(chipData.value, "chipdatavalue");
                        }}
                      // variant="outlined"
                      />
                    );
                  })}
              </Grid>
            )}
            <Grid container spacing={2} style={{ padding: "0 1rem" }}>
              {navData && (
                <Grid item xs={3}>
                  {Object.keys(navData).map((childObj) => {
                    return (
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMore />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography>{childObj}</Typography>
                        </AccordionSummary>
                        {Object.keys(navData[childObj]).map((innerChild, i) => {
                          console.log(innerChild, "||", childObj);
                          return (
                            <MenuItem
                              key={i}
                              onChange={(e) => handleChange(e)}
                              onClick={(e) => {
                                handleChipAndPopulate(childObj, innerChild);
                              }}
                            >
                              {" "}
                              {`${innerChild} ( ${navData[childObj][innerChild]} )`}
                            </MenuItem>
                          );
                        })}
                      </Accordion>
                    );
                  })}
                </Grid>
              )}

              <Grid item xs={navData ? 9 : 12}>
                <TableContainer
                  component={Paper}
                  className="CabinateTableContainer"
                  style={{
                    border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
                  }}
                >
                  <Table component="div">
                    <TableHead
                      component="div"
                      style={{
                        backgroundColor: props.theme ? "#585858" : "#e5e5e5",
                      }}
                    >
                      <TableRow component="div">
                        <div className="CabinetTableCellView head">
                          <div></div>
                          <div>RESIDING WITH</div>
                          <div>OLD FILE#</div>
                          <div>SUBJECT</div>
                          <div>CREATED BY</div>
                          <div>STATUS</div>
                          <div>CREATED ON</div>
                        </div>
                      </TableRow>
                    </TableHead>
                    <TableBody component="div" style={{}}>
                      <div
                        style={{
                          overflowY: "auto",
                          height: `calc(100vh - 260px )`,
                        }}
                      >
                        {rowData?.map((item, index) => {
                          let custodianStr = item?.custodian?.reduce(
                            (a, c, i) =>
                            (a = a.concat(
                              `${c}${i + 1 === item?.custodian?.length ? "" : ", "
                              }`
                            )),
                            ""
                          );
                          return (
                            <TableRow
                              key={index}
                              hover
                              component="div"
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                handleClick(item);
                              }}
                              // onClick={(e) => {
                              //   e.stopPropagation();
                              //   setSelectedRow(item);
                              // }}
                              style={{
                                borderBottom: "1px solid #8080805c",
                                backgroundColor:
                                  selectedRow?.id === item.id
                                    ? "#6fe1e124"
                                    : "",
                              }}
                            >
                              <div className="CabinetTableCellView body">
                                <div className="serialNo">{item.serialNo}</div>
                                <div>{item.residingWith}</div>
                                <div>{item.oldFile}</div>
                                <div>{item.subject}</div>
                                <div>{item.createdBy}</div>

                                {/* <div className="text-overflow">
                                  <Tooltip title={custodianStr}>
                                    <span>{custodianStr}</span>
                                  </Tooltip>
                                </div> */}
                                <div>{item.status}</div>
                                <div className="text-overflow">
                                  <Tooltip title={item.createdOn}>
                                    <span>{item.createdOn}</span>
                                  </Tooltip>
                                </div>
                              </div>
                            </TableRow>
                          );
                        })}
                      </div>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
            <PaginationComp
              pageSize={pageSize}
              pageSizes={[5, 10, 15]}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              totalCount={totalCount}
              setPageSize={setPageSize}
            />
          </Paper>
        </Grid>
        {/* <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="right"
          open={openAdvance}
          classes={{
            paper: !openAdvance
              ? classes.drawerPaperNotOpen
              : classes.drawerPaperOpen,
          }}
        >
          <AdvanceSeach
            handleOpenAdvance={handleOpenAdvance}
            loadAdvanceSearchTable={loadAdvanceSearchTable}
          />
        </Drawer> */}
        {/* <Dialog
          open={openAdvance}
          onClose={() => setOpenAdvance(false)}
          maxWidth="md"
          fullWidth
          classes={{
            paper: classes.dialog_paper,
          }}
        >
          <DialogContent>
            <AdvanceSeach
              handleOpenAdvance={handleOpenAdvance}
              loadAdvanceSearchTable={loadAdvanceSearchTable}
            />
          </DialogContent>
        </Dialog> */}

        <Menu
          id="lock-menu"
          anchorEl={anchorEl}
          open={openAdvance}
          // onClose={handleClosemenu}
          onClose={() => setOpenAdvance(false)}
          MenuListProps={{
            "aria-labelledby": "lock-button",
            role: "listbox",
          }}
          className={classes.dialog_paper}
          PaperProps={{
            style: {
              width: "55vw",
            },
          }}
        >
          <AdvanceSeach
            handleOpenAdvance={handleOpenAdvance}
            loadAdvanceSearchTable={loadAdvanceSearchTable}
          />
        </Menu>
      </Grid>

      <Custodian
        cabinetFile={selectedRow}
        open={openCustodian}
        handleClose={handleCustodian}
      />
      <CreateVolumeFile
        cabinetFile={selectedRow}
        open={createVolume}
        handleClose={handleCreateVol}
      />
      <ConfirmationDialog
        cabinetFile={selectedRow}
        open={openDialog}
        handleClose={handleDialog}
      />
      {/* <CreateFile
        cabinetFile={selectedRow}
        open={createFile}
        handleClose={openFileCreate}
        handleTrigger={handleTrigger}
      /> */}
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    theme: state.theme,
    myInfo: state.myInfo,
    subscribeApi: state.subscribeApi,
  };
}
export default connect(mapStateToProps, {
  getCabinaetData,
  changingTableStateCabinet,
  getAdvanceSearch,
  loadAdvanceSearch,
})(CabinetTable);
