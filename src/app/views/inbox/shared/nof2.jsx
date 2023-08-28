import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  makeStyles,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Loading } from "../therme-source/material-ui/loading";
import { connect, useDispatch } from "react-redux";
import { getbyfilename } from "../../../camunda_redux/redux/action";
import { Formik } from "formik";
import SearchIcon from "@material-ui/icons/Search";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import "../therme-source/material-ui/loading.css";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import { useTranslation } from "react-i18next";
import {
  ColumnDirective,
  ColumnsDirective,
  CommandColumn,
  Filter,
  GridComponent,
  Inject,
  Page,
  Resize,
  Sort,
} from "@syncfusion/ej2-react-grids";
import { DataUtil } from "@syncfusion/ej2-data";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { Done } from "@material-ui/icons";
import PaginationComp from "app/views/utilities/PaginationComp";

const useStyles = makeStyles({});

const NofFilesTable = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [columns] = useState([
    { field: "fileno", headerName: `${t("file_no")}.`, width: 200 },
    { field: "filename", headerName: t("file_name").toUpperCase(), width: 200 },
  ]);
  const [rows, setRows] = useState([]);
  const [row, setRow] = useState(null);
  const [setClose] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState();
  const [fileName, setFileName] = useState("");
  const [fileNo, setFileNo] = useState("");

  const bodyFormData = () => {
    const dept = sessionStorage.getItem("pklDirectrate");
    let formData = new FormData();

    formData.append("pkldirectorate", dept);
    formData.append("filename", fileName);
    // formData.append("skip", pageSize * currentPage);
    // formData.append("row", pageSize);
    formData.append("fileno", fileNo);
    formData.append("startIndex", 6);
    formData.append("endIndex", 10);
    return formData;
  };

  const getPageCount = () => pageSize * currentPage;

  const nofHandleClick = ({ rowData }) => {
    setRow(rowData);
  };

  const handleSubmit = () => {
    props.onSelectFileData(row);
    props.onSelectFileID(row.id);
    props.handleCloseDialog();
  };

  const loadData = () => {
    const pageCount = getPageCount();
    if (pageCount !== lastQuery && !loading) {
      setLoading(true);
      props
        .getbyfilename(bodyFormData())
        .then((res) => {
          try {
            if (res.error) {
              callMessageOut(res.error);
            } else {
              setRows(res.data);
              setTotalCount(res.length);
              setLoading(false);
            }
          } catch (e) {
            callMessageOut(e.message);
          }
        })
        .catch(() => setLoading(false));
      setLastQuery(pageCount);
    }
  };

  useEffect(() => loadData(), [currentPage,pageSize]);

  useEffect(() => {
    let startIndex = currentPage * pageSize;
    let endIndex = (currentPage + 1) * pageSize;
    let tempArr = rows.slice(startIndex, endIndex);
    setRows(tempArr);
  }, [pageSize, currentPage]);

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const fileTemplate = () => {
    const fileValue = DataUtil.distinct(rows, "fileno");
    return (
      <>
        <Typography
          variant="h6"
          style={{
            marginTop: "-1.5rem",
            marginBottom: ".5rem",
            fontFamily: "Arial",
            fontSize: "1rem",
          }}
        >
          File No
        </Typography>
        <TextBoxComponent
          cssClass="e-outline"
          dataSource={fileValue}
          onChange={onChange}
        />
      </>
    );
  };
  const fileNameTemplate = () => {
    const fileNameValue = DataUtil.distinct(rows, "filename");
    return (
      <>
        <Typography
          variant="h6"
          style={{
            marginTop: "-1.5rem",
            marginBottom: ".5rem",
            fontFamily: "Arial",
            fontSize: "1rem",
          }}
        >
          File Name
        </Typography>
        <TextBoxComponent
          cssClass="e-outline"
          dataSource={fileNameValue}
          onChange={onChange}
        />
      </>
    );
  };
  function onChange(args) {}
  return (
    <div>
      <DialogContent dividers style={{ overflow: "hidden" }}>
        <Paper style={{ position: "relative" }}>
          <Typography>
            {t("please_select_the_file_to_create_partcase_form")}
          </Typography>
          <Formik
            initialValues={{ fileName: "", fileNo: "" }}
            onSubmit={(values, { setSubmitting }) => {
              setFileName(values.fileName);
              setFileNo(values.fileNo);
              setTimeout(() => {
                setSubmitting(false);
                setLastQuery(undefined);
                setCurrentPage(0);
                loadData();
              }, 400);
            }}
          >
            {({}) => (
              <form className={classes.form} autoComplete="off">
                <div>
                  <Grid
                    container
                    justifyContent="center"
                    direction="row"
                    style={{ width: "100%" }}
                  ></Grid>
                </div>
              </form>
            )}
          </Formik>

          <Box
            sx={{ height: 300, width: "100%", marginTop: "20px" }}
            className="cabinate_container"
          >
            <GridComponent
              dataSource={rows}
              height={Number(window.innerHeight - 434.5)}
              allowResizing={true}
              allowSorting={true}
              allowPaging={true}
              pageSettings={{ pageCount: 5, pageSizes: true }}
              allowFiltering={true}
              filterSettings={{ type: "Menu" }}
              recordClick={nofHandleClick}
            >
              <ColumnsDirective>
                <ColumnDirective
                  field="fileno"
                  headerText={t("file_no")}
                  width="100"
                  textAlign="center"
                  filterTemplate={fileTemplate}
                />

                <ColumnDirective
                  field="filename"
                  headerText={t("file_name")}
                  width="100"
                  textAlign="center"
                  filterTemplate={fileNameTemplate}
                />
              </ColumnsDirective>
              <Inject services={[Resize, Sort, Filter, Page, CommandColumn]} />
            </GridComponent>
          </Box>

          {loading && <Loading />}
        </Paper>
      </DialogContent>
      <DialogActions>
        <PaginationComp
          pageSize={pageSize}
          pageSizes={[5, 10, 15]}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalCount={totalCount}
          setPageSize={setPageSize}
        />
        <Tooltip title={t("submit")}>
          <span>
            <Button
              variant="contained"
              color="primary"
              aria-label="submit"
              onClick={handleSubmit}
              disabled={!row}
              endIcon={<Done />}
            >
              {t("submit")}
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </div>
  );
};

function mapStateToProps(state) {
  return { props: state.props };
}
export default connect(mapStateToProps, { getbyfilename })(NofFilesTable);
