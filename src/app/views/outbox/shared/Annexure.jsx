// import React, { useEffect, useState } from "react";
// import Paper from "@material-ui/core/Paper/Paper";
// import { Card, CardContent, Grid, Typography } from "@material-ui/core";
// import { connect, useDispatch } from "react-redux";
// import { makeStyles } from "@material-ui/core/styles";
// import "react-tabs/style/react-tabs.css";
// import { loadAnnexureTableData } from "../../../camunda_redux/redux/action";
// import { changingTableStateAnnexure } from "../../../camunda_redux/redux/action/apiTriggers";
// import { setSnackbar } from "../../../camunda_redux/redux/ducks/snackbar";
// import { useTranslation } from "react-i18next";
// import {
//   Timeline,
//   TimelineConnector,
//   TimelineContent,
//   TimelineDot,
//   TimelineItem,
//   TimelineSeparator,
// } from "@material-ui/lab";
// import SplitViewPdfViewer from "../../inbox/shared/pdfViewer/pdfViewer";
// import { DataGrid } from "@material-ui/data-grid";
// import ShowAndHide from "../../../views/utilities/ShowAndHide";
// import {
//   GridComponent,
//   ColumnsDirective,
//   ColumnDirective,
//   Filter,
//   Inject,
//   Sort,
//   Resize,
//   Page,
//   CommandColumn,
// } from "@syncfusion/ej2-react-grids";
// const useStyles = makeStyles((theme) => ({
//   root: {
//     "& > *": {
//       margin: theme.spacing(1),
//     },
//   },
//   input: {
//     display: "none",
//   },
//   divZIndex: {
//     zIndex: "1500 !important",
//   },
//   paperCss: {
//     position: "relative",
//   },
//   sign_btn: {
//     position: "fixed",
//     right: "50px !important",
//     bottom: "30px !important",
//     zIndex: 1,
//   },
//   sign_btn1: {
//     position: "fixed",
//     right: "50px !important",
//     bottom: "100px !important",
//     zIndex: 10,
//   },
// }));

// // functional Component begins
// const Annexure = (props) => {
//   const { t } = useTranslation();
//   const classes = useStyles();
//   const dispatch = useDispatch();
//   const [rowData, setRowData] = useState([]);
//   const [pdfLoads, setPdfLoads] = useState(false);
//   const [pdfDataStore, setpdfDataStore] = useState({});
//   const [fileUrl, setFileUrl] = useState("");
//   const [pageSize, setPageSize] = useState(10);
//   const [pageSizes] = useState([5, 10, 15]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [totalCount, setTotalCount] = useState(0);
//   const [selectedRowIndex, setSelectedRowIndex] = useState(1);
//   const [extension, setExtension] = useState("docx");

//   const columns = [
//     {
//       field: "serialNo",
//       headerName: t("SL NO"),
//       width: 120,
//     },
//     {
//       field: "fileName",
//       headerName: t("file_name"),
//       width: 194,
//     },
//   ];

//   let { blnValue } = props.subscribeApi; // apitrigger that is used to update table by using redux

//   // const loadAnnextureTableData = (fileId) => {
//   //   props
//   //     .loadAnnexureTableData(fileId)
//   //     .then((resp) => {
//   //       // API call with redux to fetch table data based on Personal Inventory ID
//   //       let tmpArr = [];
//   //       try {
//   //         if (resp.data !== undefined) {
//   //           // condition to check if response has data then process further
//   //           tmpArr =
//   //             resp.data &&
//   //             resp.data.map((item, index) => {
//   //               return { ...item, serialNo: index + 1 };
//   //             });
//   //           setRowData(tmpArr);
//   //           setpdfDataStore(tmpArr[0]);
//   //           props.changingTableStateAnnexure(false, "CHANGE_PA_ANNEXURE"); // redux call to change trigger to false as table got updated
//   //         } else {
//   //           const errorMessage =
//   //             resp.status + " : " + resp.error + " AT " + resp.path;
//   //           callMessageOut(errorMessage);
//   //         }
//   //       } catch (e) {
//   //         callMessageOut(e.message);
//   //       }
//   //     })
//   //     .catch((error) => {
//   //       console.log(error);
//   //     });
//   // };

//   useEffect(() => {
//     console.log(props.resp);
//     let tempArr =
//       props.resp && props.resp.annexuresList &&
//       props.resp.annexuresList.map((item, i) => {
//         return {
//           fileName: item.fileName,
//           serialNo: i + 1,
//           id: `${i + 1}`,
//           displayFileName: item.fileName,
//         };
//       });
//     console.log(tempArr);
//     if (tempArr && tempArr.length !== 0) {
//       setRowData(tempArr);
//       setFileUrl(`${props.resp.annexureUrl}/${tempArr[0].fileName}`);
//       let arr = tempArr[0].displayFileName.split(".");
//       setExtension(arr[arr.length - 1]);
//     }
//   }, [props.resp]);

//   console.log(rowData);

//   //   console.log(props.annexuresList)

//   // useEffect(() => {
//   //   const { fileId } = props; // Personal Inventory ID that is passed by parent component to peocess API
//   //   loadAnnextureTableData(fileId);
//   // }, [blnValue]);

//   const callMessageOut = (message) => {
//     dispatch(setSnackbar(true, "error", message));
//   };

//   const handleOnRowClick = ({ rowData }) => {
//     setSelectedRowIndex(rowData.serialNo);
//     setFileUrl(`${props.resp.annexureUrl}/${rowData.fileName}`);
//     console.log({ rowData });
//     let arr = rowData.displayFileName.split(".");
//     setExtension(arr[arr.length - 1]);
//   };

//   return (
//     <>
//       <div>
//         {/* <button onClick={handleUndo} >undo</button> */}
//         <Paper elevation={3} className={classes.paperCss}>
//           <Grid container spacing={1}>
//             <Grid item xs={9}>
//               <Paper>
//                 {rowData.length !== 0 ? (
//                   <div style={{ border: "1px solid #b6b6b66b" }}>
//                     <SplitViewPdfViewer
//                       fileUrl={fileUrl}
//                       extension={extension}
//                       pdfLoads={(val) => {
//                         setPdfLoads(val);
//                       }}
//                     />
//                   </div>
//                 ) : (
//                   <div
//                     style={{
//                       height: "90vh",
//                       display: "flex",
//                       justifyContent: "center",
//                       alignItems: "center",
//                     }}
//                   >
//                     <h1>No Annexure</h1>
//                   </div>
//                 )}
//               </Paper>
//             </Grid>
//             <Grid item xs={3}>
//               <div style={{ height: "400px" }} className="mui-table-customize">
//               <GridComponent
//                 dataSource={rowData}
//                 // height="400"
//                 allowResizing={true}
//                 allowSorting={true}
//                 allowPaging={true}
//                 pageSettings={{ pageCount: 5, pageSizes: true }}
//                 allowFiltering={true}
//                 filterSettings={{ type: "Menu" }}
//                 // rowSelecting={(e) => handleOnRowClick(e.data)}
//                 // rowDataBound={rowDataBound}
//                 recordClick={handleOnRowClick}
//               >
//                 <ColumnsDirective>
//                   <ColumnDirective
//                     field="serialNo"
//                     headerText={t("SL NO")}
//                     width="70"
//                     textAlign="left"
//                     allowFiltering={false}
//                     allowSorting={false}
//                   />
//                   <ColumnDirective
//                     field="fileName"
//                     width="200"
//                     headerText={t("subject")}
//                   />

//                 </ColumnsDirective>
//                 <Inject
//                   services={[Resize, Sort, Filter, Page, CommandColumn]}
//                 />
//               </GridComponent>
//               </div>
//               <div>
//                 {props.sampleData && (
//                   <Card
//                     className="user_history_card"
//                     style={{
//                       border: "1px solid rgba(182, 182, 182, 0.42)",
//                       marginTop: "1rem",
//                     }}
//                   >
//                     <div style={{ margin: "auto", textAlign: "center" }}>
//                       <Typography
//                         variant="button"
//                         align="center"
//                         color="primary"
//                       >
//                         History
//                       </Typography>
//                     </div>
//                     <CardContent
//                       style={{ maxHeight: "40vh", overflowY: "auto" }}
//                     >
//                       <Timeline>
//                         {props.sampleData.map((item) => (
//                           <TimelineItem
//                             key={item.id}
//                             style={{ fontSize: ".5rem" }}
//                           >
//                             <TimelineSeparator>
//                               <TimelineDot
//                                 color={item.color}
//                                 variant={item.variant}
//                               >
//                                 <item.icon />
//                               </TimelineDot>
//                               <TimelineConnector />
//                             </TimelineSeparator>
//                             <TimelineContent>
//                               <Paper
//                                 elevation={3}
//                                 className={classes.paper}
//                                 style={{
//                                   backgroundColor: item.background,
//                                   display: "flex",
//                                 }}
//                               >
//                                 <Typography
//                                   variant="body2"
//                                   style={{ fontWeight: "bold" }}
//                                 >
//                                   {item.title}
//                                   {item.title === "Created Personal Application"
//                                     ? ""
//                                     : ":"}
//                                   &nbsp;
//                                 </Typography>
//                                 <Typography>{item.description}</Typography>
//                               </Paper>
//                               <Typography variant="body2" color="textSecondary">
//                                 {item.typo}
//                               </Typography>
//                             </TimelineContent>
//                           </TimelineItem>
//                         ))}
//                       </Timeline>
//                     </CardContent>
//                   </Card>
//                 )}
//               </div>
//             </Grid>
//           </Grid>
//         </Paper>
//       </div>
//     </>
//   );
// };

// function mapStateToProps(state) {
//   return {
//     props: state.props,
//     subscribeApi: state.subscribeApi,
//     theme: state.theme,
//   };
// }
// export default connect(mapStateToProps, {
//   loadAnnexureTableData,
//   changingTableStateAnnexure,
// })(Annexure);

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
  TimelineSeparator,
} from "@material-ui/lab";
import SplitViewPdfViewer from "../../inbox/shared/pdfViewer/pdfViewer";

import PaginationComp from "app/views/utilities/PaginationComp";
import { SplitterComponent } from "@syncfusion/ej2-react-layouts";
import "../therme-source/material-ui/loading.css";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
  divZIndex: {
    zIndex: "1500 !important",
  },
  paperCss: {
    position: "relative",
    backgroundColor: "inherit",
    height: "100%",
    margin: "0 1rem",
  },
  sign_btn: {
    position: "fixed",
    right: "50px !important",
    bottom: "30px !important",
    zIndex: 1,
  },
  sign_btn1: {
    position: "fixed",
    right: "50px !important",
    bottom: "100px !important",
    zIndex: 10,
  },
  table: {
    minWidth: 250,
  },
}));

// functional Component begins
const Annexure = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [rowData, setRowData] = useState([]);
  const [pdfLoads, setPdfLoads] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [selectedRowIndex, setSelectedRowIndex] = useState(1);
  const [extension, setExtension] = useState("docx");

  // for pagination
  const [rows, setRows] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
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

  useEffect(() => {
    let tempArr =
      props.resp &&
      props.resp.annexuresList &&
      props.resp.annexuresList.map((item, i) => {
        return {
          ...item,
          fileName: item.fileName,
          serialNo: i + 1,
          id: `${i + 1}`,
          displayFileName: item.displayFileName, // item.displayFileName
        };
      });
    if (tempArr && tempArr.length !== 0) {
      setRowData(tempArr);
      setTotalCount(tempArr.length);
      setFileUrl(`${props.resp.annexureUrl}/${tempArr[0].fileName}`);
      let arr = tempArr[0].displayFileName.split(".");
      setExtension(arr[arr.length - 1]);
    }
  }, [props.resp]);

  // implement pagination
  useEffect(() => {
    let start = currentPage * pageSize;
    let end = (currentPage + 1) * pageSize;
    let tempArr = rowData.slice(start, end);
    setRows(tempArr);
  }, [rowData, pageSize, currentPage]);

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const handleClick = (rowData) => {
    setSelectedRowIndex(rowData.serialNo);
    setFileUrl(`${props.resp.annexureUrl}/${rowData.fileName}`);
    let arr = rowData.displayFileName.split(".");
    setExtension(arr[arr.length - 1]);
  };

  const CustomToolbarMarkup = () => (
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
        {t("annexure")}
      </Typography>
    </div>
  );

  return (
    <React.Fragment>
      <div
        style={{
          padding: "0 1rem",
          overflow: "auto",
          height: "calc(100vh - 45px)",
        }}
      >
        <Grid container>
          {/* Splinter */}
          <SplitterComponent
            style={{ width: "100%" }}
            orientation={width <= 750 ? "Vertical" : "Horizontal"}
          >
            <div style={{ width: width <= 750 ? "100%" : "60%" }}>
              {rowData?.length !== 0 ? (
                <div
                  style={{
                    border: "1px solid #b6b6b66b",
                    height: "calc(100vh - 50px)",
                    overflow: "hidden",
                  }}
                  className="ss-privacy-hide"
                >
                  <SplitViewPdfViewer
                    fileUrl={fileUrl}
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
                  <h1>No Annexure</h1>
                </div>
              )}
            </div>
            <div style={{ width: width <= 750 ? "100%" : "40%" }}>
              <Paper className="mui-table-customize">
                <CustomToolbarMarkup />

                {rowData.length ? (
                  <div style={{ padding: "0 1rem" }}>
                    <TableContainer
                      component={Paper}
                      className="OutBoxPaAnnexCon"
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
                            <div className="outboxAnnRow head">
                              <div className="outboxAnnexInfo1"></div>
                              <div className="outboxAnnexInfo2">
                                <span>{t("file_name")}</span>
                              </div>
                              <div className="outboxAnnexInfo3">
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
                          {rows.map((item, i) => {
                            console.log(item);
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
                                  borderBottom: "1px solid #8080805c",
                                  position: "relative",
                                }}
                                className={`${item.serialNo == selectedRowIndex
                                    ? "active"
                                    : ""
                                  }`}
                              >
                                <div className="outboxAnnRow body">
                                  <div className="OutBoxPaAnnexInfo1">
                                    <span>{item.serialNo}</span>
                                  </div>
                                  <div className="outboxAnnexInfo2 text-overflow">
                                    <Tooltip
                                      title={
                                        item?.displayFileName?.split(".")[0]
                                      }
                                    >
                                      <span>
                                        {item?.displayFileName?.split(".")[0]}
                                      </span>
                                    </Tooltip>
                                  </div>
                                  <div className="outboxAnnexInfo3">
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
                ) : (
                  <div>No Annexure</div>
                )}

                <PaginationComp
                  pageSize={pageSize}
                  pageSizes={[5, 10, 15]}
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                  totalCount={totalCount}
                  setPageSize={setPageSize}
                />
              </Paper>
              <div>
                {props.sampleData && (
                  <Card
                    className="user_history_card"
                    style={{
                      border: "1px solid rgba(182, 182, 182, 0.42)",
                      marginTop: "1rem",
                    }}
                  >
                    <div style={{ margin: "auto", textAlign: "center" }}>
                      <Typography
                        variant="button"
                        align="center"
                        color="primary"
                      >
                        History
                      </Typography>
                    </div>
                    <CardContent
                      style={{ maxHeight: "40vh", overflowY: "auto" }}
                    >
                      <Timeline>
                        {props.sampleData.map((item) => (
                          <TimelineItem
                            key={item.id}
                            style={{ fontSize: ".5rem" }}
                          >
                            <TimelineSeparator>
                              <TimelineDot
                                color={item.color || "grey"}
                                variant={item.variant || "outlined"}
                              >
                                <item.icon />
                              </TimelineDot>
                              <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                              <Paper
                                elevation={3}
                                className={classes.paper}
                                style={{
                                  backgroundColor: item.background,
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
    </React.Fragment>
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
