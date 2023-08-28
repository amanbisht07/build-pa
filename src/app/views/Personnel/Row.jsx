import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { loadAnnexureTableData } from "../../camunda_redux/redux/action";
import { connect, useDispatch } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { Loading } from "./therme-source/material-ui/loading";

const Row = (props) => {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState("");

  let username = localStorage.getItem("username");
  let role = sessionStorage.getItem("role");
  let department = sessionStorage.getItem("department");
  const dispatch = useDispatch();

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const handleDropDown = (e, rowData) => {
    e.stopPropagation();
    setLoading(true);
    if (open === false) {
      props
        .loadAnnexureTableData(username, role, department, rowData.id)
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              return;
            } else {
              let tmpArr = [];
              tmpArr = resp.data.map((item, i) => {
                return { ...item, serialNo: i };
              });
              setData(tmpArr);
            }
          } catch (error) {
            callMessageOut(error.message);
          }
        });
    }
    setLoading(false);
    setOpen(!open);
  };

  const handleFileSelect = (item) => {
    let arr = [];
    if (item.fileName) {
      arr = item.fileName.split(".");
    } else {
      arr[1] = "docx";
    }
    props.handleAnnexture(item.fileURL || item.fileUrl, arr[1]);
    setSelectedRowId(item.id);
  };

  return (
    <React.Fragment>
      <TableRow
        onClick={() => {
          props.handleUpadtePdf(row.fileURL);
          props.setSelectedRowId(row.id);
        }}
        className={props.selectedRowId == row.id ? "active" : ""}
        id="paTableRow"
      >
        <TableCell>
          <IconButton
            id="PA_up_down"
            aria-label="expand row"
            size="small"
            onClick={(e) => handleDropDown(e, row)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.serialNo}
        </TableCell>
        <TableCell align="right">{row.subject}</TableCell>
        <TableCell align="right">{row.status}</TableCell>
      </TableRow>
      <TableRow>
        {loading && <Loading />}
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box padding={2}>
              {data.length > 0 ? (
                <React.Fragment>
                  <Typography variant="h6" gutterBottom component="div">
                    Annexure
                  </Typography>
                  <div id="annexureTable">
                    <Table aria-label="purchases">
                      <TableHead>
                        <TableRow id="annexureTableHeader">
                          <TableCell>SNO.</TableCell>
                          <TableCell>SUBJECT</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((item) => (
                          <TableRow
                            key={item.id}
                            onClick={() => handleFileSelect(item)}
                            id="annexureTableRow"
                            className={selectedRowId == item.id ? "active" : ""}
                          >
                            <TableCell component="th" scope="row">
                              {item.serialNo + 1}
                            </TableCell>
                            <TableCell>{item.subject}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </React.Fragment>
              ) : (
                <Typography variant="h6" gutterBottom component="div">
                  No Annexure
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return { props: state.props };
}

export default connect(mapStateToProps, { loadAnnexureTableData })(Row);
