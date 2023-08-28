import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper/Paper";
import {
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { connect, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import "react-tabs/style/react-tabs.css";
import { loadAnnexureTableData } from "../../../camunda_redux/redux/action";
import { changingTableStateAnnexure } from "../../../camunda_redux/redux/action/apiTriggers";
import { setSnackbar } from "../../../camunda_redux/redux/ducks/snackbar";
import { useTranslation } from "react-i18next";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@material-ui/lab";
import SplitViewPdfViewer from "../../inbox/shared/pdfViewer/pdfViewer";
import PaginationComp from "app/views/utilities/PaginationComp";
import { unstable_batchedUpdates } from "react-dom";
import { SplitterComponent } from "@syncfusion/ej2-react-layouts";
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  table: {
    minWidth: 300,
  },
}));

// functional Component begins
const Annexure = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [rowData, setRowData] = useState([]);
  const [pdfLoads, setPdfLoads] = useState(false);
  const [pdfDataStore, setpdfDataStore] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [pageSizes] = useState([5, 10, 15]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedRowIndex, setSelectedRowIndex] = useState(1);
  const [extension, setExtension] = useState("docx");
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [rows, setRows] = useState([]);

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, [])

  let { blnValue } = props.subscribeApi; // apitrigger that is used to update table by using redux

  const loadAnnextureTableData = (fileId) => {
    props
      .loadAnnexureTableData(fileId)
      .then((resp) => {
        if (resp.error) {
          callMessageOut(resp.error);
        }
        // API call with redux to fetch table data based on Personal Inventory ID
        let tmpArr = [];
        try {
          // condition to check if response has data then process further
          if (resp.data.length !== 0) {
            tmpArr =
              resp.data &&
              resp.data.map((item, index) => {
                return { ...item, serialNo: index + 1 };
              });
            if (tmpArr.length > 0) {
              unstable_batchedUpdates(() => {
                setRowData(tmpArr);
                setTotalCount(tmpArr.length);
                setpdfDataStore(tmpArr[0]);
                setSelectedIndex(tmpArr[0].serialNo);
                props.changingTableStateAnnexure(false, "CHANGE_PA_ANNEXURE"); // redux call to change trigger to false as table got updated
                let arr = tmpArr[0].fileName.split(".");
                setExtension(arr[arr.length - 1]);
              });
            }
          }
        } catch (e) {
          callMessageOut(e.message);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
      });
  };

  useEffect(() => {
    const { fileId } = props; // Personal Inventory ID that is passed by parent component to peocess API
    fileId && loadAnnextureTableData(fileId);
  }, [blnValue, props.fileId]);

  // implement pagination
  useEffect(() => {
    let start = currentPage * pageSize;
    let end = (currentPage + 1) * pageSize;
    let tempArr = rowData.slice(start, end);
    setRows(tempArr);
  }, [rowData, pageSize, currentPage]);

  const callMessageOut = (message) => {
    props.handleLoading(false);
    dispatch(setSnackbar(true, "error", message));
  };

  const handleClick = (rowData, index) => {
    setSelectedRowIndex(rowData.serialNo);
    setpdfDataStore(rowData);
    let arr = rowData.fileName.split(".");
    setExtension(arr[arr.length - 1]);
    setSelectedIndex(index);
  };

  const CustomToolbarMarkup = ({ title }) => (
    <div
      style={{
        padding: "0.5rem 1rem",
      }}
    >
      <Typography
        variant="h6"
        style={{
          fontFamily: "inherit !important",
        }}
      >
        {title}
      </Typography>
    </div>
  );

  return (
    <>
      <div
        style={{
          padding: "0 1rem",
          overflow: "auto",
          height: "calc(100vh - 45px)",
        }}
      >
        <Grid container>
          <SplitterComponent
            style={{ height: "100%" }}
            orientation={width <= 750 ? "Vertical" : "Horizontal"}
          >
            <div style={{ width: width <= 750 ? "100%" : "60%" }}>
              {rowData.length !== 0 ? (
                <div
                  style={{
                    border: "1px solid #b6b6b66b",
                    height: "calc(100vh - 50px)",
                    overflow: "hidden",
                  }}
                  className="ss-privacy-hide"
                >
                  <SplitViewPdfViewer
                    fileUrl={pdfDataStore && pdfDataStore.fileUrl}
                    extension={extension}
                    pdfLoads={(val) => {
                      setPdfLoads(val);
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    height: "90vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h1>No Annexure</h1>{" "}
                </div>
              )}
            </div>
            <div style={{ width: width <= 750 ? "100%" : "40%" }}>
              <Paper className="mui-table-customize">
                <CustomToolbarMarkup title={t("annexure")} />
                {rowData.length ? (
                  <>
                    <div style={{ padding: "0 1rem" }}>
                      <TableContainer
                        component={Paper}
                        className="DashAnnexTableCon"
                        style={{
                          border: "1px solid #8080805c",
                        }}
                      >
                        <Table
                          component="div"
                          className={classes.table}
                          aria-label="simple table"
                        >
                          <TableHead component="div">
                            <TableRow
                              component="div"
                              style={{
                                borderBottom: "1px solid #8080805c",
                                position: "relative",
                              }}
                            >
                              <div className="DashAnnexRow head">
                                <div className="DashAnnexInfo1"></div>
                                <div className="DashAnnexInfo2">
                                  <span>{t("file_name")}</span>
                                </div>
                                <div className="DashAnnexInfo3">
                                  <span>{t("created_on")}</span>
                                </div>
                              </div>
                            </TableRow>
                          </TableHead>
                          <TableBody
                            component="div"
                            style={{
                              overflow: "auto",
                            }}
                          >
                            {/* Mapping data coming from backnd */}
                            {rows.map((item, i) => {
                              // Row defination and styling here
                              return (
                                <TableRow
                                  hover
                                  component="div"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleClick(item, item.serialNo);
                                  }}
                                  key={i}
                                  style={{
                                    borderBottom: "1px solid #8080805c",
                                    position: "relative",
                                  }}
                                  className={`${item.serialNo == selectedIndex
                                      ? "active"
                                      : ""
                                    }`}
                                >
                                  <div className="DashAnnexRow body">
                                    <div className="DashAnnexInfo1">
                                      <span>{item.serialNo}</span>
                                    </div>
                                    <div className="DashAnnexInfo2">
                                      {item.fileName?.split(".")[0].length >
                                        10 ? (
                                        <Tooltip
                                          title={item.fileName.split(".")[0]}
                                        >
                                          <span>
                                            {item.fileName.split(".")[0]}
                                          </span>
                                        </Tooltip>
                                      ) : item.fileName ? (
                                        <span>
                                          {item.fileName.split(".")[0]}
                                        </span>
                                      ) : (
                                        <span>Name Not Defined</span>
                                      )}
                                    </div>
                                    <div className="DashAnnexInfo3">
                                      <span>{item.createdOn}</span>
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
                  </>
                ) : (
                  <div
                    style={{
                      height: "90vh",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <h1> {t("no_annexure")}</h1>
                  </div>
                )}
              </Paper>
              <div>
                {props.sampleData && (
                  <Card
                    className="user_history_card"
                    style={{
                      marginTop: "1rem",
                    }}
                  >
                    <CustomToolbarMarkup title={t("history")} />
                    <CardContent
                      style={{
                        maxHeight: "40vh",
                        overflowY: "auto",
                        border: "1px solid #8080805c",
                        margin: "0 1rem 1rem 1rem",
                        borderRadius: ".3rem",
                      }}
                    >
                      <Timeline>
                        {props.sampleData.map((item, index) => (
                          <TimelineItem
                            key={item.id}
                            style={{ display: "flex", fontSize: ".5rem" }}
                          >
                            <TimelineOppositeContent
                              style={{ display: "none" }}
                            ></TimelineOppositeContent>
                            <TimelineSeparator>
                              <TimelineDot
                                color={item.color || "grey"}
                                variant={item.variant || "outlined"}
                              ></TimelineDot>
                              {props.sampleData.length === index + 1 ? (
                                ""
                              ) : (
                                <TimelineConnector />
                              )}
                            </TimelineSeparator>
                            <TimelineContent>
                              <Paper
                                elevation={3}
                                className={classes.paper}
                                style={{
                                  backgroundColor: "#eaeaea",
                                  // backgroundColor: item.background,
                                  display: "flex",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  style={{ fontWeight: "bold" }}
                                >
                                  {item.title}
                                  {item.title === "Created Personal Application"
                                    ? ""
                                    : ":"}
                                  &nbsp;
                                </Typography>
                                <Typography>{item.description}</Typography>
                              </Paper>
                              <Typography variant="body2" color="textSecondary">
                                {item.typo}
                              </Typography>
                            </TimelineContent>
                          </TimelineItem>
                        ))}
                      </Timeline>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </SplitterComponent>
        </Grid>
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    subscribeApi: state.subscribeApi,
    theme: state.theme,
  };
}
export default connect(mapStateToProps, {
  loadAnnexureTableData,
  changingTableStateAnnexure,
})(Annexure);
