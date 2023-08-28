// import React, { useEffect, useState } from "react";
// import Paper from "@material-ui/core/Paper/Paper";
// import {
//   Grid,
//   MenuItem,
//   Typography,
//   Tooltip,
//   Button,
//   TextField,
//   TableRow,
//   TableBody,
//   Table,
//   TableContainer,
//   IconButton,
//   Dialog,
//   DialogTitle,
// } from "@material-ui/core";
// import {
//   getPersonalApplicationFileData,
//   loadAnnexureTableData,
//   getHistory,
// } from "../../camunda_redux/redux/action";
// import { connect, useSelector } from "react-redux";
// import PdfViewer from "../../pdfViewer/pdfViewer";
// import { useDispatch } from "react-redux";
// import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
// import { setPassData } from "app/camunda_redux/redux/ducks/passData";
// import { Breadcrumb } from "matx";
// import { useTranslation } from "react-i18next";
// import Cookies from "js-cookie";
// import { makeStyles } from "@material-ui/core/styles";
// import SplitViewPdfViewer from "../inbox/shared/pdfViewer/pdfViewer";
// import "./therme-source/material-ui/loading.css";
// import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
// import SkipNextIcon from "@material-ui/icons/SkipNext";
// import { SplitterComponent } from "@syncfusion/ej2-react-layouts";
// import history from "../../../history";
// import { Loading } from "./therme-source/material-ui/loading";
// import PaginationComp from "../utilities/PaginationComp";
// import { GetApp, History } from "@material-ui/icons";
// import { isNullOrUndefined } from "@syncfusion/ej2-base";
// import HistoryDialog from "./HistoryDialog";
// import Draggable from "react-draggable";

// const useStyles = makeStyles((theme) => ({
//   table: {
//     minWidth: 258,
//   },
// }));

// const PaperComponent = (props) => {
//   return (
//     <Draggable
//       handle="#draggable-dialog-title"
//       cancel={'[class*="MuiDialogContent-root"]'}
//     >
//       <Paper {...props} />
//     </Draggable>
//   );
// };

// const FileViewTable = (props) => {
//   const { t } = useTranslation();
//   const dispatch = useDispatch();
//   const classes = useStyles();
//   const { theme } = useSelector((state) => state);

//   const [rowData, setRowData] = useState([]);
//   const [pdfLoads, setPdfLoads] = useState(false);
//   const pFileName = Cookies.get("paFileId");
//   const referenceNumber = Cookies.get("paFileName");
//   const [pageSize, setPageSize] = useState(5);
//   const [pageSizes] = useState([5, 10, 15]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [totalCount, setTotalCount] = useState(0);
//   const [NOF, setNOF] = useState("");
//   const [NOF1, setNOF1] = useState("");
//   const [enclosureData, setEnclosureData] = useState([]);
//   const [enclosureValue, setEnclosureValue] = useState(null);
//   const [fileURL, setFileURL] = useState("");
//   const [annexurefileURL, setAnnexurefileURL] = useState("");
//   const [selectedRowIndex, setSelectedRowIndex] = useState(1);
//   const [extension, setExtension] = useState("docx");
//   const [loading, setloading] = useState(false);
//   const [historyData, setHistoryData] = useState([]);
//   const [blnOpenHistory, setblnOpenHistory] = useState(false);

//   const handleClick = (rowData) => {
//     setSelectedRowIndex(rowData.serialNo);
//     setFileURL(rowData.fileURL);
//     setNOF(`${rowData.pfileName} | ${rowData.subject}`);
//     const paID = rowData.id;
//     props.loadAnnexureTableData(paID).then((resp) => {
//       try {
//         if (resp.error) {
//           callMessageOut(resp.error);
//           return;
//         } else {
//           let tmpArr = [];
//           tmpArr = resp.data.map((item, i) => {
//             return { ...item, serialNo: i };
//           });
//           if (tmpArr.length === 0) {
//             setAnnexurefileURL("");
//           } else {
//             setAnnexurefileURL(tmpArr[0].fileUrl);
//             setNOF1(JSON.stringify(tmpArr[0]));
//             setEnclosureValue(tmpArr[0]);
//             let arr = tmpArr[0].fileName.split(".")[1];
//             setExtension(arr);
//           }
//           setEnclosureData(tmpArr);
//         }
//       } catch (error) {
//         callMessageOut(error.message);
//       }
//     });
//   };

//   const handleChangeAnnexure = (event) => {
//     const data = JSON.parse(event.target.value);
//     setNOF1(event.target.value);
//     setEnclosureValue(data);
//     setAnnexurefileURL(data.fileUrl);
//     let arr = data.pfileName.split(".");
//     setExtension(arr[arr.length - 1]);
//   };

//   const handleChangeNextAnnexure = () => {
//     let data = JSON.parse(NOF1);

//     if (data.serialNo + 1 === enclosureData.length) {
//       let newData = enclosureData[0];
//       setNOF1(JSON.stringify(newData));
//       setEnclosureValue(newData);
//       setAnnexurefileURL(newData.fileUrl);
//     } else {
//       let newData = enclosureData[data.serialNo + 1];
//       setNOF1(JSON.stringify(newData));
//       setEnclosureValue(newData);
//       setAnnexurefileURL(newData.fileUrl);
//     }
//   };

//   const handleChangePreviousAnnexure = () => {
//     let data = JSON.parse(NOF1);

//     if (data.serialNo === 0) {
//       let newData = enclosureData[enclosureData.length - 1];
//       setNOF1(JSON.stringify(newData));
//       setEnclosureValue(newData);
//       setAnnexurefileURL(newData.fileUrl);
//     } else {
//       let newData = enclosureData[data.serialNo - 1];
//       setNOF1(JSON.stringify(newData));
//       setEnclosureValue(newData);
//       setAnnexurefileURL(newData.fileUrl);
//     }
//   };

//   const dataPA = useSelector((state) => state.filepa);

//   useEffect(() => {
//     loadFileView();
//   }, [dispatch, currentPage]);

//   useEffect(() => {
//     let tmpArr = [];
//     tmpArr = dataPA.padata.map((item, index) => {
//       return { ...item, serialNo: pageSize * currentPage + (index + 1) };
//     });
//     setTotalCount(dataPA.padata.length != null ? dataPA.padata.length : 0);
//     setRowData(tmpArr);
//     if (tmpArr.length === 0) {
//       setFileURL("");
//       setloading(false);
//     } else {
//       setFileURL(tmpArr[0].fileURL);
//       setloading(false);
//     }
//   }, [dataPA]);

//   const loadFileView = () => {
//     setloading(true);
//     dispatch(getPersonalApplicationFileData(pFileName, pageSize, currentPage));
//   };

//   useEffect(() => {
//     if (!pFileName) {
//       history.push("/eoffice/personnel/file");
//     }
//   }, [pFileName]);

//   const callMessageOut = (message) => {
//     dispatch(setSnackbar(true, "error", message));
//   };

//   const CustomToolbarMarkup = () => (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         height: "3rem",
//       }}
//     >
//       <Typography variant="button" align="center" color="primary">
//         {t("personal_application")}
//       </Typography>
//     </div>
//   );

//   useEffect(() => {
//     if (pdfLoads === true && annexurefileURL !== "") {
//       let data = { extension, url: annexurefileURL };
//       dispatch(setPassData(data));
//     } else {
//       let data = { extension, url: "" };
//       dispatch(setPassData(data));
//     }
//   }, [pdfLoads, annexurefileURL, extension]);

//   const handleOnClickOpenHistory = (id) => {
//     if (id) {
//       props.getHistory("PA", id).then((resp) => {
//         try {
//           if (resp.error) {
//             callMessageOut(resp.error);
//             return;
//           } else {
//             !isNullOrUndefined(resp.data)
//               ? setHistoryData(resp.data)
//               : setHistoryData([]);
//             setblnOpenHistory(true);
//           }
//         } catch (error) {
//           callMessageOut(error.message);
//         }
//       });
//     }
//   };

//   return (
//     <div className="container_Personal">
//       {loading && <Loading />}
//       <Grid container spacing={1} style={{ padding: "0 1rem" }}>
//         <Grid item xs={7}>
//           <Breadcrumb
//             routeSegments={[
//               { name: t("personnel"), path: "/eoffice/personnel/file" },
//               {
//                 name: `${t("personal_file")}`,
//                 path: "/eoffice/personnel/fileview",
//               },
//             ]}
//             otherData={[{ key: t("file_number"), value: referenceNumber }]}
//           />
//         </Grid>
//         <Grid item xs={5}>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 4rem 4rem",
//               gridGap: ".5rem",
//             }}
//           >
//             <TextField
//               select
//               label="Annexure"
//               value={NOF1}
//               size="small"
//               fullWidth
//               onChange={handleChangeAnnexure}
//               variant="outlined"
//             >
//               {enclosureData.map((item, index) => (
//                 <MenuItem key={index} value={JSON.stringify(item)}>
//                   {item.pfileName}
//                 </MenuItem>
//               ))}
//             </TextField>
//             <Tooltip title={t("previous_annexure")} aria-label="Add Noting">
//               <Button
//                 id="fileView_skipBtn"
//                 variant="contained"
//                 color="primary"
//                 onClick={handleChangePreviousAnnexure}
//               >
//                 <SkipPreviousIcon />
//               </Button>
//             </Tooltip>
//             <Tooltip title={t("next_annexure")} aria-label="Add Noting">
//               <Button
//                 id="changeNextAnnex_skip_btn"
//                 variant="contained"
//                 color="primary"
//                 onClick={handleChangeNextAnnexure}
//               >
//                 <SkipNextIcon />
//               </Button>
//             </Tooltip>
//           </div>
//         </Grid>
//         <SplitterComponent>
//           <Paper elevation={3} style={{ borderRadius: "8px", width: "30%" }}>
//             <CustomToolbarMarkup />
//             <div className="fileViewtable mui-table-customize">
//               <div style={{ padding: "0 1rem" }}>
//                 <TableContainer
//                   component={Paper}
//                   className="FileViewCon"
//                   style={{
//                     border: `1px solid #8080805c`,
//                   }}
//                 >
//                   <Table
//                     component="div"
//                     className={classes.table}
//                     aria-label="simple table"
//                   >
//                     <TableBody component="div">
//                       {/* Mapping data coming from backnd */}
//                       {rowData.map((item, i) => {
//                         // Row defination and styling here

//                         return (
//                           <TableRow
//                             hover
//                             component="div"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleClick(item);
//                             }}
//                             key={i}
//                             style={{
//                               position: "relative",
//                             }}
//                           >
//                             <div className="FileViewRow">
//                               <div className="FileViewInfo1">
//                                 <div>
//                                   <span>{item.serialNo}.</span>
//                                   <span>{item.subject}</span>
//                                 </div>
//                                 <span>{item.displayPfileName}</span>
//                               </div>
//                               <div className="FileViewInfo2">
//                                 <div className="file_icon_btn">
//                                   <Tooltip title={t("user_history")}>
//                                     <IconButton
//                                       id="fileViewTable_history_btn"
//                                       aria-label={t("user_history")}
//                                       color="primary"
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleOnClickOpenHistory(item.id);
//                                       }}
//                                     >
//                                       <History />
//                                     </IconButton>
//                                   </Tooltip>
//                                   <Tooltip title={t("download")}>
//                                     <IconButton
//                                       id="fileViewTable_download_btn"
//                                       aria-label={t("download")}
//                                       color="primary"
//                                     >
//                                       <GetApp />
//                                     </IconButton>
//                                   </Tooltip>
//                                 </div>
//                                 <span>{item.status}</span>
//                               </div>
//                             </div>
//                           </TableRow>
//                         );
//                       })}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </div>
//               <PaginationComp
//                 pageSize={pageSize}
//                 pageSizes={pageSizes}
//                 setCurrentPage={setCurrentPage}
//                 currentPage={currentPage}
//                 totalCount={totalCount}
//                 setPageSize={setPageSize}
//               />
//             </div>
//           </Paper>
//           <div
//             style={{
//               border: "1px solid #b6b6b66b",
//               width: "35%",
//               overflow: "hidden",
//             }}
//           >
//             <SplitViewPdfViewer
//               fileUrl={fileURL}
//               pdfLoads={(val) => {
//                 setPdfLoads(val);
//               }}
//             />
//           </div>
//           <div style={{ border: "1px solid #b6b6b66b", width: "35%" }}>
//             <PdfViewer
//               fileUrl={""}
//               pdfLoads={(val) => {
//                 setPdfLoads(val);
//               }}
//             />
//           </div>
//         </SplitterComponent>
//       </Grid>
//       <Dialog
//         open={blnOpenHistory}
//         onClose={(e) => setblnOpenHistory(false)}
//         aria-labelledby="draggable-dialog-title"
//         PaperComponent={PaperComponent}
//         aria-describedby="alert-dialog-description"
//         style={{ minWidth: "300px" }}
//         fullWidth
//         maxWidth="sm"
//         className="personal-application-history"
//       >
//         <DialogTitle id="draggable-dialog-title" style={{ cursor: "move" }}>
//           {t("user_history")}
//         </DialogTitle>
//         <HistoryDialog historyData={historyData} />
//       </Dialog>
//     </div>
//   );
// };

// function mapStateToProps(state) {
//   return { props: state.props };
// }

// export default connect(mapStateToProps, {
//   getPersonalApplicationFileData,
//   loadAnnexureTableData,
//   getHistory,
// })(FileViewTable);

import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper/Paper";
import { Grid } from "@material-ui/core";
import {
  getPersonalApplicationFileData,
  loadAnnexureTableData,
} from "../../camunda_redux/redux/action";
import { connect, useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Breadcrumb } from "matx";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import SplitViewPdfViewer from "../inbox/shared/pdfViewer/pdfViewer";
import "./therme-source/material-ui/loading.css";
import { SplitterComponent } from "@syncfusion/ej2-react-layouts";
import TreeTable from "./TreeTable";
import { Loading } from "./therme-source/material-ui/loading";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { handleError } from "utils";

const FileViewTable = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [rowData, setRowData] = useState([]);
  const [pdfLoads, setPdfLoads] = useState(false);
  const pFileName = Cookies.get("paFileId");
  const referenceNumber = Cookies.get("paFileName");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pafileURL, setPaFileURL] = useState("");
  const [annexurefileURL, setAnnexureFileURL] = useState("");
  const [extension, setExtension] = useState("docx");
  const [loading, setLoading] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState("");
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
    loadFileView();
  }, [dispatch, currentPage, pageSize]);
  // pFileName, pageSize, currentPage

  const loadFileView = () => {
    setLoading(true);
    props
      .getPersonalApplicationFileData(pFileName, pageSize, currentPage)
      .then(({ response }) => {
        try {
          if (response.error) {
            callMessageOut(response.error);
            setLoading(false);
          } else {
            let tmpArr = [];
            tmpArr = response.data.map((item, index) => {
              return {
                ...item,
                serialNo: pageSize * currentPage + (index + 1),
              };
            });
            setTotalCount(tmpArr.length);
            setRowData(tmpArr);

            if (tmpArr.length === 0) {
              setPaFileURL("");
            } else {
              setPaFileURL(tmpArr[0].fileURL);
              setSelectedRowId(tmpArr[0].id);
            }
            setLoading(false);
          }
        } catch (error) {
          callMessageOut(error.message);
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log(e);
        let errMsg = handleError(e.message);
        callMessageOut(errMsg);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!pFileName) {
      history.push("/eoffice/personnel/file");
    }
  }, [pFileName]);

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const handleUpadtePdf = (url) => {
    setPaFileURL(url);
  };

  const handleAnnexture = (url, exe) => {
    setAnnexureFileURL(url);
    setExtension(exe);
  };

  return (
    <div className="container_Personal">
      {loading && <Loading />}
      <Grid container spacing={1} style={{ padding: "0 1rem" }}>
        <Grid item xs={12}>
          <Breadcrumb
            routeSegments={[
              { name: t("personnel"), path: "/eoffice/personnel/file" },
              {
                name: `${t("personal_file")}`,
                path: "/eoffice/personnel/fileview",
              },
            ]}
            otherData={[{ key: t("file_number"), value: referenceNumber }]}
          />
        </Grid>
        <SplitterComponent
          orientation={width <= 750 ? "Vertical" : "Horizontal"}
        >
          <Paper
            elevation={3}
            style={{
              border: "1px solid #b6b6b66b",
              borderRadius: "8px",
              width: width <= 750 ? "100%" : "34%",
            }}
          >
            {loading && <Loading />}
            <TreeTable
              data={rowData}
              handleUpadtePdf={handleUpadtePdf}
              handleAnnexture={handleAnnexture}
              setSelectedRowId={setSelectedRowId}
              selectedRowId={selectedRowId}
            />
          </Paper>
          <div
            style={{
              border: "1px solid #8181815c",
              width: width <= 750 ? "100%" : "33%",
              height: "calc(100vh - 100px)",
              overflow: "hidden",
            }}
            className="ss-privacy-hide"
          >
            <SplitViewPdfViewer
              fileUrl={pafileURL}
              extension={"docx"}
              pdfLoads={(val) => {
                setPdfLoads(val);
              }}
            />
          </div>
          <div
            style={{
              border: "1px solid #b6b6b66b",
              width: width <= 750 ? "100%" : "33%",
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
        </SplitterComponent>
      </Grid>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
  };
}

export default connect(mapStateToProps, {
  getPersonalApplicationFileData,
  loadAnnexureTableData,
})(FileViewTable);
