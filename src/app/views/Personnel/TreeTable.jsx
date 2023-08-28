import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@material-ui/core";
import Row from "./Row";
import "./TreeTable.css";

const TreeTable = (props) => {
  return (
    <TableContainer component={Paper}>
      <Table
        aria-label="collapsible table"
        style={{ tableLayout: "auto", height: "calc(100vh - 145px)" }}
      >
        <TableHead>
          <TableRow id="tableHeader">
            <TableCell width="15%" />
            <TableCell align="left" width="20%">
              SNO.
            </TableCell>
            <TableCell align="center">SUBJECT</TableCell>
            <TableCell align="right" width="25%">
              STATUS
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody style={{ overflow: "auto" }} >
          {props.data.map((row) => (
            <Row
              key={row.id}
              row={row}
              handleUpadtePdf={props.handleUpadtePdf}
              handleAnnexture={props.handleAnnexture}
              setSelectedRowId={props.setSelectedRowId}
              selectedRowId={props.selectedRowId}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TreeTable;
