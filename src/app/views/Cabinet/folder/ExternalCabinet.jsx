import React, { useContext, useEffect, useState } from "react";
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
  TableCell,
  Button,
  Divider,
  Menu,
  Accordion,
  AccordionSummary,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { connect as useSelector } from "react-redux";
import { getexternalcabinet, getAdvanceSearch, loadAdvanceSearch } from "../../../camunda_redux/redux/action/index";
import { changingTableStateCabinet } from "../../../camunda_redux/redux/action/apiTriggers";
import { connect, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import history from "../../../../history";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { DataUtil } from "@syncfusion/ej2-data";
import PaginationComp from "app/views/utilities/PaginationComp";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import GenericSearch from "app/views/utilities/GenericSearch";
import GenericFilterMenu from "app/views/utilities/GenericFilterMenu";
import GenericChip from "app/views/utilities/GenericChips";
import DesktopAccessDisabledIcon from "@material-ui/icons/DesktopAccessDisabled";
import NoteAddOutlinedIcon from "@material-ui/icons/NoteAddOutlined";
import { unstable_batchedUpdates } from "react-dom";
import axios from "axios";
import SystemUpdateAltTwoToneIcon from "@material-ui/icons/SystemUpdateAltTwoTone";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import AssessmentIcon from "@material-ui/icons/Assessment";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import { Autocomplete } from "@material-ui/lab";
import { useFormik } from "formik";
import * as yup from "yup";
import MultipleSelect from "./MultipleSelect";
import ConfirmationDialog from "./ConfirmationDialog";
import { clearCookie } from "utils";
import { AdvanceSearchContext } from "./Cabinet";
import AdvanceSeach from "../advanceSeach";
import { ExpandMore } from "@material-ui/icons";

let drawerWidth = 300

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
  const [pageSizes] = useState([5, 10, 15]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowData, setRowData] = useState([]);
  const [rows, setRows] = useState([]);
  const { blnValueCabinet } = props.subscribeApi;
  const dispatch = useDispatch();
  const role = sessionStorage.getItem("role");
  const department = sessionStorage.getItem("department");
  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [openCustodian, setOpenCustodian] = React.useState(false);
  const [value, setValue] = React.useState(1);
  const [financialYear, setFinancialYear] = React.useState(2021);
  const [classificationValue, setClassificationValue] = React.useState(null);
  const [financialYearValue, setFinancialYearValue] = React.useState(null);
  const [subSectionValue, setSubSectionValue] = useState(null);
  const [custodianValue, setCustodianValue] = useState(null);
  const [anchorEl, setanchorEl] = useState(null)
  const [navData, setNavData] = useState(null)
  const [openAdvance, setOpenAdvance] = useState(false)


  let cabinetId = Cookies.get("cabinetId");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpenManageCustodian = () => {
    setOpenCustodian(true);
  };

  const handleClickCloseManageCustodian = () => {
    setOpenCustodian(false);
  };

  const handleOpenAdvance = () => {
    setOpenAdvance(!openAdvance)
  }

  const classes = useStyles();

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubSectionChange = (event, newValue) => {
    setSubSectionValue(newValue);
  };

  const handleCustodianChange = (event, newValue) => {
    setCustodianValue(newValue);
  };

  const handleClassificationChange = (event, newValue) => {
    setClassificationValue(newValue);
  };

  const handleFinancialYearChange = (event, newValue) => {
    setFinancialYearValue(newValue);
  };

  const [openDialog, setOpenDialog] = useState(false);

  const handleConfirmationDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDialog = () => {
    setOpenDialog(false);
  };

  const subSectionOptions = [
    { title: "Option 1" },
    { title: "Option 2" },
    { title: "Option 3" },
  ];

  const custodianOptions = [
    { title: "Custodian 1" },
    { title: "Custodian 2" },
    { title: "Custodian 3" },
  ];

  const API_URLA = "https://mocki.io/v1/7af3523c-b1e6-49a6-a2f6-8b0c7a1ead80";
  const handleVolumeFile = async (e) => {
    e.stopPropagation();
    try {
      const response = await axios.get(API_URLA);
      const data = response.data;
      data.id = false;
      await axios.get(API_URLA, data);
    } catch (error) {
      console.error(error);
    }
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
  const [apiObj, setapiObj] = useState({
    barCreated: "",
    barDocumenttype: "",
  });

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
    setSortBy(sortObj);
  };

  const deleteChip = (property) => {
    let newFilter = { ...Filter };
    delete newFilter[`${property}`];
    setFilter(newFilter);
  };
  const { theme } = useSelector((state) => state);
  const { mount } = useSelector((state) => state.refreshings);

  useEffect(() => {
    loadCabinateData();
  }, [blnValueCabinet, Filter, SortBy, mount]);

  // implement pagination
  useEffect(() => {
    let start = currentPage * pageSize;
    let end = (currentPage + 1) * pageSize;
    let tempArr = rowData.data?.slice(start, end);
    setRows(tempArr);
  }, [rowData, pageSize, currentPage]);

  useEffect(() => {
    clearCookie();
  }, []);

  const loadCabinateData = () => {
    props.handleLoading(true);
    let filter = {};
    Object.entries(Filter).map(([property, value]) => {
      let key = property.split("|")[0];
      filter[`${key}`] = value;
    });
    props
      .getexternalcabinet(department, pageSize, currentPage, {
        filter: _.isEmpty(filter) ? null : filter,
        sort: _.isEmpty(SortBy) ? null : SortBy,
      })
      .then((resp) => {
        if (resp.error) {
          callMessageOut(resp.error);
          props.handleLoading(false);
        }
        try {
          setRowData(resp.data);
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
    Cookies.set("isCabinet", rowData.id);
    // Cookies.set("cabinetStatus", rowData.status);
    Cookies.set("cabinetpartcase", rowData.partcaseId);
    Cookies.set("referenceNumber", rowData.referenceNumber);
    Cookies.set("type", rowData.type);
    Cookies.set("partCase", true);
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

  const { text, sendBy, createdBy, fileNo, subject, status, scope } =
    useContext(AdvanceSearchContext);

  const loadAdvanceSearchTable = (val) => {
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
        scope,
        role,
        pageSize,
        currentPage,
        username,
        department
      )
      .then(({ response }) => {
        let tempArr = [];
        for (let i = 0; i < response.dataTest.length; i++) {
          let obj = response.dataTest[i];
          tempArr.push({
            residingWith: obj.cabResidingWith,
            oldFile: obj.caboldFile,
            subject: obj.cabSubject,
            status: obj.cabStatus,
            createdOn: obj.fcreatedOnTime,
            custodian: [],
            partcaseId: obj.partcaseId,
          });
        }
        setNavData(response.navData);
        setRowData(tempArr);
        setTotalCount(tempArr.length);
      });
  };

  const CustomToolbarMarkup = () => (
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
        />
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

  const validationSchema = yup.object({
    subject: yup.string().required("Please enter your feedback"),
  });

  const formik = useFormik({
    initialValues: {
      subject: "",
    },

    validationSchema: validationSchema,
    onSubmit: (value) => {
      handleVolumeFile(value);
    },
  });

  return (
    <>
      <Grid container>
        <Grid>
          <Paper
            style={{
              height: "calc(100vh - 90px)",
              width: "100%",
              borderRadius: "9px",
              border: "1px solid #c7c7c7",
              marginRight: "1rem",
            }}
          >
            <CustomToolbarMarkup />
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
                          return (
                            <MenuItem
                              key={i}
                            >{`${innerChild} ( ${navData[childObj][innerChild]} )`}</MenuItem>
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
                        <div className="ExternalCabinetTableRowView head">
                          <div></div>
                          <div>RESIDING WITH</div>
                          <div>OLD FILE#</div>
                          <div>SUBJECT</div>
                          <div>CUSTODIAN</div>
                          <div>CREATED ON</div>
                        </div>
                      </TableRow>
                    </TableHead>

                    <TableBody component="div">
                      <div
                        style={{
                          overflowY: "auto",
                          height: `calc(100vh - 260px )`,
                        }}
                      >
                        {Array.isArray(rowData) &&
                          rowData.map((item, index) => {
                            let custodianStr = item?.custodian?.reduce(
                              (a, c, i) =>
                              (a = a.concat(
                                `${c}${i + 1 === item?.custodian?.length
                                  ? ""
                                  : ", "
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
                                <div className="ExternalCabinetTableRowView body">
                                  <div className="serialNo">{index + 1}</div>
                                  <div>{item.residingWith}</div>
                                  <div>{item.oldFile}</div>
                                  <div>{item.subject}</div>
                                  <div className="text-overflow"style={{
                                    width: "100%"
                                  }}>
                                    <Tooltip title={custodianStr}>
                                      <span>{custodianStr}</span>
                                    </Tooltip>
                                  </div>
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
        <Menu
          id="lock-menu"
          anchorEl={anchorEl}
          open={openAdvance}
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
      <form onSubmit={formik.handleSubmit}>
        <Dialog
          className="createVolumeForm"
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
          fullWidth={true}
        >
          <DialogTitle className="CreateTitle" id="form-dialog-title">
            CREATE VOLUME FILE
          </DialogTitle>
          <DialogContent>
            <Divider />
            <Grid className="formStyle" item xs={12}>
              <Grid container>
                <TextField
                  id="subject"
                  label="SUBJECT"
                  variant="outlined"
                  className="Subjectclass"
                  name="subject"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.subject && Boolean(formik.errors.subject)
                  }
                  helperText={formik.touched.subject && formik.errors.subject}
                />
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    id="mainHead"
                    label="MAIN HEAD"
                    variant="outlined"
                    className="Subjectclass"
                    size="small"
                  />
                </Grid>
                <Grid item xs={3}>
                  <Autocomplete
                    id="classification-autocomplete"
                    size="small"
                    className="SubjectclassTwo"
                    options={["CLASSIFIED", "UNCLASSIFIED"]}
                    getOptionLabel={(option) => option}
                    value={classificationValue}
                    onChange={handleClassificationChange}
                    renderInput={(params) => (
                      <TextField {...params} label="Classification" />
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Autocomplete
                    id="financial-year-autocomplete"
                    className="SubjectclassThree"
                    size="small"
                    options={[
                      "2020-2021",
                      "2022-2023",
                      "2023-2024",
                      "2024-2025",
                      "2025-2026",
                    ]}
                    getOptionLabel={(option) => option}
                    value={financialYearValue}
                    onChange={handleFinancialYearChange}
                    renderInput={(params) => (
                      <TextField {...params} label="Financial Year" />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    id="subHead"
                    label="SUB HEAD"
                    variant="outlined"
                    className="Subjectclass"
                    size="small"
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControl className="Subjectclass">
                    <Autocomplete
                      id="subSection-autocomplete"
                      size="small"
                      className="SubjectclassTwo"
                      options={subSectionOptions}
                      getOptionLabel={(option) => option.title}
                      value={subSectionValue}
                      onChange={handleSubSectionChange}
                      renderInput={(params) => (
                        <TextField {...params} label="SubSection" />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl className="Subjectclass">
                    <Autocomplete
                      id="custodian-autocomplete"
                      size="small"
                      className="SubjectclassThree"
                      options={custodianOptions}
                      getOptionLabel={(option) => option.title}
                      value={custodianValue}
                      onChange={handleCustodianChange}
                      renderInput={(params) => (
                        <TextField {...params} label="Custodian" />
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    id="connectedFiles"
                    label="CONNECTED FILES"
                    variant="outlined"
                    className="Subjectclass"
                    size="small"
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    id="volume"
                    label="VOLUME"
                    variant="outlined"
                    className="Subjectclass"
                    size="small"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    id="caseNumber"
                    label="CASE NUMBER"
                    variant="outlined"
                    className="Subjectclass"
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="oldFileRefrence"
                    label="OLD FILE REFRENCE"
                    variant="outlined"
                    className="Subjectclass"
                    size="small"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Divider />
            <div className="DialogIcons">
              <Button className="CreateButton" onClick={handleVolumeFile}>
                CREATE
              </Button>
              <Button className="CabinetCancelButton" onClick={handleClose}>
                CANCEL
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </form>
      <div className="selectRolesForm">
        <Dialog
          className="selectRoles"
          open={openCustodian}
          onClose={handleClickCloseManageCustodian}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle className="CreateTitle" id="form-dialog-title">
            SELECT ROLES
          </DialogTitle>
          <DialogContent>
            <Divider />
            <Grid className="formStyle" item xs={12}>
              <Grid container>
                <MultipleSelect />
              </Grid>
              <Divider />
            </Grid>
            <div className="DialogIcons">
              <Button className="CreateButton">UPDATE</Button>
              <Button
                className="CabinetCancelButton"
                onClick={handleClickCloseManageCustodian}
              >
                CANCEL
              </Button>
            </div>
          </DialogContent>
          <Paper
            style={{
              maxHeight: "2vh",
              minHeight: "2vh",
              maxWidth: "60vh",
              minWidth: "60vh",
            }}
          />
        </Dialog>
      </div>
      <ConfirmationDialog open={openDialog} handleClose={handleCloseDialog} />
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    theme: state.theme,
    subscribeApi: state.subscribeApi,
  };
}
export default connect(mapStateToProps, {
  getexternalcabinet,
  changingTableStateCabinet,
})(CabinetTable);
