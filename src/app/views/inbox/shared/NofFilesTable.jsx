import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  makeStyles,
  Radio,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  getbyfilename,
  createPANotingData,
} from "../../../camunda_redux/redux/action";
import { Formik } from "formik";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import "../therme-source/material-ui/loading.css";
import { Loading } from "../therme-source/material-ui/loading";
import { useTranslation } from "react-i18next";
import { Done } from "@material-ui/icons";
import PaginationComp from "app/views/utilities/PaginationComp";
import Draggable from "react-draggable";
import { debounce } from "utils";
import { useCallback } from "react";

const useStyles = makeStyles({});

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
};

const NofFilesTable = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileNo, setFileNo] = useState("");
  const [tableId, setTableId] = useState("");

  const { theme } = useSelector((state) => state);

  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);

  const [confirmation, setConfirmation] = useState(false);

  const bodyFormData = (val) => {
    const dept = sessionStorage.getItem("pklDirectrate");
    let formData = new FormData();
    let startIndex = currentPage * pageSize + 1;
    let endIndex = (currentPage + 1) * pageSize;

    formData.append("pkldirectorate", dept);
    formData.append("filename", val || fileName);
    formData.append("fileno", fileNo);
    formData.append("startIndex", startIndex);
    formData.append("endIndex", endIndex);
    return formData;
  };

  const getPageCount = () => pageSize * currentPage;

  const nofHandleClick = (e, rowData) => {
    let tempArr = rows.map((item) =>
      item.id === rowData.id
        ? { ...item, isChecked: e.target.checked }
        : { ...item, isChecked: false }
    );
    // if (e.target.checked) {
    setRow(rowData);
    setTableId(rowData.id);
    // } else {
    //   setRow(null);
    //   setTableId("");
    // }
    setRows(tempArr);
  };

  const handleSubmit = () => {
    props.onSelectFileData(row);
    props.onSelectFileID(row.id);
    // props.handleCloseDialog();
  };

  const handleMultiple = () => {
    setConfirmation(true);
  };

  const handleCreateMultiplePartCase = () => {
    setLoading(true);
    const roleName = sessionStorage.getItem("role");
    const groupName = sessionStorage.getItem("department");
    const userName = localStorage.getItem("username");
    for (let i = 0; i < props.selectedList.length; i++) {
      props
        .createPANotingData(
          props.selectedList[i].trackId,
          roleName,
          userName,
          groupName,
          row.filename,
          row.id,
          row.fileno,
          row.custodian,
          false,
          "",
          row
        )
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              setLoading(false);
            } else {
              if (i + 1 === props.selectedList.length) {
                setConfirmation(false);
                props.loadInboxTable();
                props.handleCloseDialog();
                setLoading(false);
              }
            }
          } catch (e) {
            callMessageOut(e.message);
            setLoading(false);
          }
        })
        .catch((e) => {
          callMessageOut(e.message);
          setLoading(false);
        });
    }
  };

  const loadData = (search) => {
    const pageCount = getPageCount();
    if (!loading) {
      setLoading(true);
      props
        .getbyfilename(bodyFormData(search))
        .then((res) => {
          console.log(res);
          try {
            if (res.error) {
              callMessageOut(res.error);
              setLoading(false);
              return;
            } else {
              let tempArr = res.data.map((item) => ({
                ...item,
                isChecked: false,
              }));
              setRows(tempArr);
              setTotalCount(res.length);
              setLoading(false);
              setRow(null);
            }
          } catch (e) {
            callMessageOut(e.message);
            setLoading(false);
          }
        })
        .catch((e) => {
          callMessageOut(e.message);
          setLoading(false);
        });
    }

    // let tempArr = newArr.map((item) => ({
    //   ...item,
    //   isChecked: false,
    // }));
    // setRows(tempArr);
    // setTotalCount(tempArr.length);
    // setLoading(false);
    // setRow(null);
  };

  useEffect(() => loadData(), [pageSize, currentPage]);

  const callMessageOut = (message) => {
    setLoading(false);
    dispatch(setSnackbar(true, "error", message));
  };

  const handleSearch = (e, rows) => {
    const { value } = e.target;
    if (value && value.length > 2 && value.trim()) {
      loadData(value);
    } else if (!value) {
      loadData();
    }
  };

  const optimizedSearch = useCallback(debounce(handleSearch), []);

  return (
    <>
      {loading && <Loading />}

      <DialogContent dividers style={{ overflow: "hidden" }}>
        <Typography
          style={{ textAlign: "center", paddingBottom: "1rem", opacity: ".7" }}
        >
          {t("please_select_the_file_to_create_partcase_form")}
        </Typography>

        <Box className="nof-search" component="h4">
          <TextField
            id="outlined-basic"
            label={t("search_by_file_name")}
            fullWidth
            onChange={optimizedSearch}
            variant="outlined"
            size="small"
            className={theme ? "darkTextField" : ""}
          />
        </Box>

        <Box sx={{ height: 310, width: "100%" }} className="cabinate_container">
          <TableContainer
            component={Paper}
            className="inbox-tab"
            elevation={3}
            style={{
              position: "relative",
              borderRadius: "9px",
              border: `1px solid ${theme ? "#727272" : "#c7c7c7"}`,
            }}
          >
            <Table component="div" className="App-main-table">
              <div>
                <div
                  className="nof_table_row head"
                  style={{
                    borderBottom: `1px solid #8080805c`,
                    display: "grid",
                    gridTemplateColumns: "2rem 1fr 1fr",
                    background: "#b1b1b15c",
                  }}
                >
                  <div></div>
                  <div>
                    <span>{t("file_no")}</span>
                  </div>
                  <div>
                    <span>{t("file_name")}</span>
                  </div>
                </div>
              </div>
              <TableBody
                component="div"
                style={{
                  height: "30vh",
                  overflow: "auto",
                }}
              >
                {/* Mapping data coming from backnd */}

                {rows.map((item, i) => {
                  return (
                    <TableRow
                      hover
                      component="div"
                      key={i}
                      selected={item.id === tableId}
                    >
                      <div
                        className="nof_table_row"
                        style={{
                          borderBottom: `1px solid ${
                            theme ? "#727070" : "#c7c7c7"
                          }`,
                          display: "grid",
                          gridTemplateColumns: "2rem 1fr 1fr",
                          alignItems: "center",
                        }}
                      >
                        <div className="checkbox">
                          <FormControlLabel
                            control={
                              <Radio
                                checked={item.isChecked}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  nofHandleClick(e, item);
                                }}
                              />
                            }
                          />
                        </div>
                        <div className="info1">
                          <span>{item.fileno}</span>
                        </div>
                        <div className="info2">
                          <span>{item.filename}</span>
                        </div>
                      </div>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <PaginationComp
              pageSize={pageSize}
              pageSizes={[5, 10, 15]}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              totalCount={totalCount}
              setPageSize={setPageSize}
            />
          </TableContainer>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          id="MultiplePartCase_submit_button"
          variant="contained"
          color={props.multiplePartCase ? "secondary" : "primary"}
          aria-label="submit"
          onClick={props.multiplePartCase ? handleMultiple : handleSubmit}
          disabled={!row}
          endIcon={<Done />}
        >
          {props.multiplePartCase ? t("create_part_case_file") : t("submit")}
        </Button>
      </DialogActions>

      <Dialog
        open={confirmation}
        onClose={() => setConfirmation(false)}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ minWidth: "300px" }}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {t("confirmation")}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" align="center" gutterBottom>
            {t("are_you_sure_to_create_a_part_case")} ?{" "}
          </Typography>
          <Typography variant="subtitle2">
            File No :{row?.fileno} <br /> File Name :{row?.filename}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            id="inbox_fileList_cancel_button"
            variant="contained"
            onClick={() => setConfirmation(false)}
            color="primary"
          >
            {t("cancel")}
          </Button>
          <Button
            id="redirectToSplitView_ok_button"
            variant="contained"
            onClick={handleCreateMultiplePartCase}
            color="secondary"
            autoFocus
          >
            {t("ok")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

function mapStateToProps(state) {
  return { props: state.props };
}
export default connect(mapStateToProps, { getbyfilename, createPANotingData })(
  NofFilesTable
);
