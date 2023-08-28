import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper/Paper";
import {
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  TextField,
  TableRow,
  TableContainer,
  Table,
  TableBody,
  Tooltip,
  TableHead,
} from "@material-ui/core";
import { loadAnnexureTableData } from "../../../camunda_redux/redux/action";
import { connect, useSelector } from "react-redux";
import PdfViewer from "../../../pdfViewer/pdfViewer";
import { useDispatch } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { setPassData } from "app/camunda_redux/redux/ducks/passData";
import { Breadcrumb } from "matx";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { makeStyles } from "@material-ui/core/styles";
import SplitViewPdfViewer from "../../inbox/shared/pdfViewer/pdfViewer";
import "../therme-source/material-ui/loading.css";
import { DataGrid } from "@material-ui/data-grid";
import {
  ColumnDirective,
  ColumnsDirective,
  Filter,
  GridComponent,
  Inject,
  Page,
  Resize,
  Sort,
} from "@syncfusion/ej2-react-grids";
import { SplitterComponent } from "@syncfusion/ej2-react-layouts";
import PaginationComp from "app/views/utilities/PaginationComp";

const useStyles = makeStyles({
  formControl: {
    margin: 5,
    minWidth: 350,
    maxWidth: 350,
  },
  table: {
    minWidth: 225,
  },
});

const FileViewTable = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { theme } = useSelector((state) => state);
  const columns = [
    {
      field: "serialNo",
      headerName: t("SL NO"),
      width: 120,
      // editable: true,
    },
    {
      field: "fileName",
      headerName: t("subject"),
      width: 150,
      // editable: true,
    },
  ];

  const [rowData, setRowData] = useState([]);
  const [pdfLoads, setPdfLoads] = useState(false);
  const pFileName = Cookies.get("paFileId");
  const referenceNumber = Cookies.get("paFileName");
  const [pageSize, setPageSize] = useState(5);
  const [pageSizes] = useState([5, 10, 15]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [NOF, setNOF] = useState("");
  const [NOF1, setNOF1] = useState("");
  const [enclosureData, setEnclosureData] = useState([]);
  const [fileURL, setFileURL] = useState("");
  const [annexurefileURL, setAnnexurefileURL] = useState("");
  const [selectedRowIndex, setSelectedRowIndex] = useState(1);
  const [extension, setExtension] = useState("docx");
  const [rows, setRows] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);

  const handleClick = (rowData) => {
    setSelectedRowIndex(rowData.serialNo);
    setFileURL(rowData.fileUrl);
  };

  const handleChangeAnnexure = (event) => {
    const data = JSON.parse(event.target.value);
    let arr = data.fileName.split(".");
    setExtension(arr[arr.length - 1]);
    setNOF1(event.target.value);
    setAnnexurefileURL(data.fileUrl);
  };

  const dataPA = useSelector((state) => state.filepa);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = (e) => {
    setWidth(window.innerWidth);
  };

  // implement pagination
  useEffect(() => {
    let start = currentPage * pageSize;
    let end = (currentPage + 1) * pageSize;
    let tempArr = rowData.slice(start, end);
    setRows(tempArr);
  }, [rowData, pageSize, currentPage]);

  useEffect(() => {
    let tmpArr = [];
    let tmpArr2 = [];
    if (props.resp) {
      tmpArr =
        props.resp.notingList &&
        props.resp.notingList.map((item, index) => {
          return {
            ...item,
            serialNo: pageSize * currentPage + (index + 1),
            id: index,
          };
        });

      setRowData(tmpArr);
      setTotalCount(tmpArr.length);
      if (tmpArr && tmpArr.length !== 0) {
        setFileURL(tmpArr[0].fileUrl);
      }
      tmpArr2 =
        props.resp &&
        props.resp.enclosureList.map((item, index) => {
          return { ...item, id: index };
        });
      setEnclosureData(tmpArr2);
      if (tmpArr2 && tmpArr2.length !== 0) {
        let arr = tmpArr2[0].fileName.split(".");
        setExtension(arr[arr.length - 1]);
      }
      setNOF1(JSON.stringify(tmpArr2[0]));
      setAnnexurefileURL(tmpArr2[0].fileUrl);
    }
  }, [props.resp]);

  const CustomToolbarMarkup = () => (
    <div
      style={{
        padding: "0.4rem 1rem",
      }}
    >
      <Typography variant="h6" component="h6">
        {t("noting")}
      </Typography>
    </div>
  );

  return (
    <div className="m-sm-30">
      <Grid container spacing={1}>
        <Grid item xs={4}></Grid>
        <Grid item xs={3}>
          <div className={classes.formControl}></div>
        </Grid>
        <Grid item xs={5}>
          <div>
            <TextField
              select
              label={t("annexure")}
              value={NOF1}
              size="small"
              fullWidth
              onChange={handleChangeAnnexure}
              variant="outlined"
              className={`${theme && "app-select-dark"}`}
            >
              {enclosureData.map((item, index) => (
                <MenuItem key={index} value={JSON.stringify(item)}>
                  {item.fileName}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </Grid>
        <SplitterComponent
          orientation={width <= 750 ? "Vertical" : "Horizontal"}
        >
          <div style={{ width: width <= 750 ? "100%" : "30%" }}>
            <Paper
              elevation={3}
              style={{
                borderRadius: "8px",
                height: "100%",
              }}
            >
              <CustomToolbarMarkup />
              <div style={{ padding: "0 1rem" }}>
                <TableContainer
                  component={Paper}
                  className="OutBoxPaCon"
                  style={{
                    border: "1px solid #8080805c",
                    height: "60vh",
                  }}
                >
                  <Table
                    component="div"
                    className={classes.table}
                    aria-label="simple table"
                  >
                    <TableHead component="div">
                      <TableRow component="div">
                        <div className="OutBoxPaRow head">
                          <div className="OutBoxPaInfo1">
                            <span></span>
                          </div>
                          <div className="OutBoxPAInfo2">
                            <span>{t("file_name")}</span>
                          </div>
                          <div className="OutBoxPAInfo3">
                            <span>{t("status")}</span>
                          </div>
                        </div>
                      </TableRow>
                    </TableHead>
                    <TableBody component="div">
                      {/* Mapping data coming from backnd */}
                      {rows.map((item, i) => {
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
                          >
                            <div className="OutBoxPaRow body">
                              <div className="OutBoxPaInfo1">
                                <span>{item.serialNo}</span>
                              </div>
                              <div className="OutBoxPAInfo2">
                                {item.fileName?.split(".")[0].length > 30 ? (
                                  <Tooltip title={item.fileName.split(".")[0]}>
                                    <span>
                                      {item.fileName
                                        .split(".")[0]
                                        .substring(0, 30)}
                                      ...
                                    </span>
                                  </Tooltip>
                                ) : item.fileName ? (
                                  <span>{item.fileName.split(".")[0]}</span>
                                ) : (
                                  <span>Name Not Defined</span>
                                )}
                              </div>
                              <div className="OutBoxPAInfo3">
                                <span>{item.status}</span>
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
                  pageSizes={[5, 10, 15]}
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                  totalCount={totalCount}
                  setPageSize={setPageSize}
                />
              </div>
            </Paper>
          </div>
          <div
            style={{
              border: "1px solid #8080805c",
              width: width <= 750 ? "100%" : "35%",
              height: "calc(100vh - 100px)",
              overflow: "hidden",
            }}
            className="ss-privacy-hide"
          >
            <SplitViewPdfViewer
              fileUrl={fileURL}
              pdfLoads={(val) => {
                setPdfLoads(val);
              }}
            />
          </div>
          <div
            style={{
              border: "1px solid #8080805c",
              width: width <= 750 ? "100%" : "35%",
              height: "calc(100vh - 100px)",
              overflow: "hidden",
            }}
            className="ss-privacy-hide"
          >
            <SplitViewPdfViewer
              fileUrl={annexurefileURL}
              extension={extension}
              pdfLoads={(val) => {
                setPdfLoads(val);
              }}
            />
          </div>
          {/* </Grid> */}
        </SplitterComponent>
      </Grid>
    </div>
  );
};

function mapStateToProps(state) {
  return { props: state.props };
}

export default connect(mapStateToProps, {
  loadAnnexureTableData,
})(FileViewTable);
