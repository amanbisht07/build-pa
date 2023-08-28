import React, { useEffect, useState, useCallback } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Filter,
  Inject,
  Sort,
  Resize,
  Toolbar,
  Page,
  CommandColumn,
} from "@syncfusion/ej2-react-grids";

import {
  Typography,
  IconButton,
  Button,
  Tooltip,
  Icon,
  Chip,
  // Paper,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  // TableContainer,
  // Table,
  // TableBody,
  // TableRow,
  Checkbox,
} from "@material-ui/core";
import { connect, useDispatch } from "react-redux";
import SearchIcon from "@material-ui/icons/Search";
import history from "../../../../history";
import {
  loadFinalreg,
  getSearchedData,
} from "app/camunda_redux/redux/action/index";
import { changingTableStateRti } from "app/camunda_redux/redux/action/apiTriggers";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import "../css/file.css";
import { PlaylistAddCheck, Search } from "@material-ui/icons";
import { Breadcrumb } from "matx";
import PaginationComp from "app/views/utilities/PaginationComp";
import { debounce } from "utils";
// import "../../outbox/therme-source/material-ui/loading.css";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const Finalreg = (props, onSearchSubmit) => {
 const classes = useStyles();
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSizes] = useState([5, 10, 15]);
  const [rowData, setRowData] = useState([]);
  const dispatch = useDispatch();
  const [filter, setfilter] = useState(false);
  

  const handleClick = ( rowData ) => { 
    console.log(rowData)
    // mtd that has been triggered while row clicks
    sessionStorage.setItem("rtiID", rowData.rtiId);
    Cookies.set("inboxFile", rowData.subject);
    Cookies.set("priority", rowData.priority);
    Cookies.set("referenceNumber", rowData.referenceNumber);
    Cookies.set("partcaseId", rowData.partcaseId);
    Cookies.set("isRti", true);
    Cookies.set("isRegister", rowData.id);
    Cookies.remove("status");
    Cookies.remove("Rtioutbox");

    history.push({
      pathname: "/eoffice/splitView/file",
      state: { fileID: rowData.id },
    });
  };

  const handleSearch = (value) => {
    props
      .getSearchedData(value)
      .then((resp) => {
        let tmpArr1 = [];

        try {
          if (resp) {
            // condition to check if response then perform further
            if (resp !== undefined) {
              tmpArr1 = resp.data;
              setRowData(tmpArr1);
              setTotalCount(resp.length);
            } else {
              const errorMessage =
                resp.status + " : " + resp.error + " AT " + resp.path;
              callMessageOut(errorMessage);
            }
          }
        } catch (e) {
          callMessageOut(e.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    Cookies.remove("inboxFile");
    Cookies.remove("priority");
    Cookies.remove("referenceNumber");
    Cookies.remove("partcaseId");
    Cookies.remove("isRti");
  }, []);

  const { blnValueRti } = props.subscribeApi; // redux trigger that helps in refreshing table

  useEffect(() => loadRegister(), [blnValueRti]);

  // useEffect(() => {
  //   if (subject1 !== "") {
  //     handleSearch(subject1);
  //   } else {
  //     loadRegister();
  //   }
  // }, [subject1]);

  const loadRegister = () => {
    // setRowData([]);
    props
      .loadFinalreg()
      .then((resp) => {
        let tmpArr = [];

        try {
          if (resp) {
            // condition to check if response then perform further
            if (resp !== undefined) {
              tmpArr = resp.response.content;
              setRowData(tmpArr);
              console.log(tmpArr);
              setTotalCount(resp.length);
            } else {
              const errorMessage =
                resp.status + " : " + resp.error + " AT " + resp.path;
              callMessageOut(errorMessage);
            }
            // props.changingTableStateRti(false, "CHANGE_RTI"); // setting trigger to false as table got updated
          }
        } catch (e) {
          callMessageOut(e.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  function search(value){
     if(value.length>0){
      handleSearch(value);
     } 
     else{
      loadRegister()
     }
  }

  const optimizedSearch = useCallback(debounce(search),[])

  const callMessageOut = (message) => {};
 
  const RenderTable = useCallback(
    (props) => {
      // return (
      //   <div className="rti-register">
      //     <GridComponent
      //       dataSource={props.rowData}
      //       height="20rem"
      //       allowResizing={true}
      //       allowSorting={true}
      //       allowPaging={true}
      //       pageSettings={{ pageCount: 5, pageSizes: true }}
      //       allowFiltering={true}
      //       filterSettings={{ type: "Menu" }}
      //       recordClick={handleClick}
      //       rowDataBound={rowDataBound}
      //     >
      //       <ColumnsDirective>
      //         <ColumnDirective
      //           field="subject"
      //           headerText={t("SUBJECT")}
      //           width="120"
      //           textAlign="left"
      //           allowFiltering={true}
      //           allowSorting={true}
      //         />
      //         <ColumnDirective
      //           field="createdOnDate"
      //           headerText={t("Created On Date")}
      //           width="110"
      //           textAlign="Left"
      //         />
      //         <ColumnDirective
      //           field="appeal"
      //           headerText={t("Appeal.no")}
      //           width="120"
      //           textAlign="Left"
      //         />
      //         <ColumnDirective
      //           field="group"
      //           headerText={t("RECEIVER")}
      //           width="120"
      //           textAlign="Left"
      //         />
      //         <ColumnDirective
      //           field="status"
      //           headerText={t("STATUS")}
      //           width="90"
      //           textAlign="Left"
      //           template={statusTextColor}
      //         />
      //         <ColumnDirective
      //           field="dueDate"
      //           headerText={t("Due Date")}
      //           width="90"
      //           textAlign="Left"
      //         />
      //       </ColumnsDirective>
      //       <Inject
      //         // services={[Resize, Sort, Toolbar, Filter, Page, CommandColumn]}
      //       />
      //     </GridComponent>
      //   </div>
      // );
      return (
        <TableContainer component={Paper} style={{height:"23rem"}}>
          <Table className={classes.table} aria-label="simple table" >
            <TableHead>
              <TableRow>
                <TableCell>SUBJECT</TableCell>
                <TableCell align="right">CREATED DATE</TableCell>
                <TableCell align="right">APPEAL</TableCell>
                <TableCell align="right">STATUS</TableCell>
                <TableCell align="right">REFERENCE NUMBER</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowData.map((rowData) => (
                <TableRow key={rowData} onClick={()=>handleClick(rowData)}>
                  <TableCell  align="right">{rowData.subject}</TableCell>
                  <TableCell align="right">{rowData.createdOnDate}</TableCell>
                  <TableCell align="right">{rowData.appeal}</TableCell>
                  <TableCell align="right">{rowData.status}</TableCell>
                  <TableCell align="right">{rowData.referenceNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    
    },
    [rowData]
  );

  return (
    <div
      onClick={(e) => {
        if (e.target.name !== "fRegister") setfilter(false);
      }}
    >
      <Paper
        className=" rti-table"
        elevation={3}
        style={{
          position: "relative",
          borderRadius: "18px",
        }}
      >
        <div
          style={{
            height: "4rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
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
            {t("FINAL REGISTER")}
          </Typography>
          <div className={`${filter ? "search-box active" : "search-box"}`}>
            <input
              type="text"
              name="fRegister"
              placeholder="Type to search.."
              className={`${filter ? "active" : ""}`}
              onChange={(e) =>{
                optimizedSearch(e.target.value)
              }}
            />

            <IconButton
              id="Icon_Button_Click_Handler"
              className={`search-btn ${filter ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                if (!filter) {
                  setfilter(true);
                } else {
                  handleSearch();
                }
              }}
            >
              <Search />
            </IconButton>
          </div>
        </div>

        <RenderTable rowData={rowData} />
      </Paper>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    subscribeApi: state.subscribeApi,
  };
}

export default connect(mapStateToProps, {
  loadFinalreg,
  changingTableStateRti,
  getSearchedData,
})(Finalreg);
