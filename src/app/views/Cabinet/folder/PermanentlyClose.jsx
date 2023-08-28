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
  TableCell,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { connect as useSelector } from "react-redux";
import { getCabinaetData } from "../../../camunda_redux/redux/action/index";
import { changingTableStateCabinet } from "../../../camunda_redux/redux/action/apiTriggers";
import { connect, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import history from "../../../../history";
import PaginationComp from "app/views/utilities/PaginationComp";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import GenericSearch from "app/views/utilities/GenericSearch";
import GenericFilterMenu from "app/views/utilities/GenericFilterMenu";
import GenericChip from "app/views/utilities/GenericChips";
import { unstable_batchedUpdates } from "react-dom";
import axios from "axios";
import { clearCookie } from "utils";

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

  const API_URL = "https://mocki.io/v1/7af3523c-b1e6-49a6-a2f6-8b0c7a1ead80";
  const handlePermanentlyClose = async (e) => {
    e.stopPropagation();
    try {
      const response = await axios.get(API_URL);
      const { data } = response;
      data.id = false;
      await axios.get(API_URL, data);
    } catch (error) {
      console.error(error);
    }
  };

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
      .getCabinaetData(role, department, {
        filter: _.isEmpty(filter) ? null : filter,
        sort: _.isEmpty(SortBy) ? null : SortBy,
      })
      .then((resp) => {
        if (resp.error) {
          callMessageOut(resp.error);
          props.handleLoading(false);
        }
        try {
          setRowData(resp);
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
    Cookies.set("referenceNumber", rowData.referenceNumber);
    Cookies.set("type", rowData.type);
    Cookies.set("partCase", true);
    history.push({
      pathname: "/eoffice/splitView/file",
      state: rowData.subject,
    });
  };

  const CustomToolbarMarkup = () => (
    <div style={{ borderBottom: "1px solid #c7c7c7" }}>
      <div className="CabinetHeadTop">
        <GenericSearch
          FilterTypes={FilterTypes}
          FilterValueTypes={FilterValueTypes}
          addFilter={addFilter}
          cssCls={{}}
        />
        <div>
          <GenericFilterMenu
            FilterValueTypes={SortValueTypes}
            addSort={addSort}
          />
        </div>
      </div>
      <GenericChip Filter={Filter} deleteChip={deleteChip} />
    </div>
  );

  return (
    <>
      <Grid style={{ padding: ".5rem 1rem" }} className="cabinate_container">
        <Grid item xs={12}>
          <Breadcrumb
            routeSegments={[{ name: t("cabinet"), path: "/personnel/file" }]}
          />
        </Grid>
        <Grid className="cabinate_container">
          <Paper
            style={{
              height: "calc(100vh - 90px)",
              width: "101.2%",
              borderRadius: "9px",
              border: "1px solid #c7c7c7",
              marginRight: "1rem",
            }}
          >
            <CustomToolbarMarkup />
            <TableContainer
              component={Paper}
              className="CabinateTableContainer"
            >
              <Table component="div" aria-label="simple-table">
                <TableHead component="div">
                  <TableRow component="div">
                    <div className="closeCabinetTableCellView">
                      <TableCell style={{ fontWeight: "bold" }}>
                        RESIDING WITH
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>
                        OLD FILE
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>
                        SUBJECT
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>
                        CUSTODIAN
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>
                        STATUS
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>
                        CREATED ON
                      </TableCell>
                    </div>
                  </TableRow>
                </TableHead>
                <TableBody component="div">
                  {rows?.map((item, index) => {
                    return (
                      <TableRow
                        key={index}
                        hover
                        component="div"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClick(item);
                        }}
                        style={{
                          border: "1px solid #80808066",
                          borderWidth: "0px 0px 1px 0px",
                          display: "flex",
                          flex: 1,
                        }}
                      >
                        <div className="serialNo">
                          <span>{index + 1}</span>
                        </div>
                        <div className="closeCabinetTableRowView">
                          <span>{item.residingWith}</span>
                          <span>{item.oldFile}</span>
                          <span>{item.subject}</span>
                          <span>{item.custodian}</span>
                          <span className="status">{item.status}</span>
                          <span className="date">{item.createdOn}</span>
                        </div>
                        {/* </div> */}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
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
      </Grid>
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
  getCabinaetData,
  changingTableStateCabinet,
})(CabinetTable);
