import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PaginationComp from "app/views/utilities/PaginationComp";
import { Loading } from "../therme-source/material-ui/loading";
import { useSelector } from "react-redux";
import { Done } from "@material-ui/icons";

const CoverLetterDialog = (props) => {
  const [selectData, setSelectData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [rows, setRows] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state);

  const CheckBoxSelection = (event, unique) => {
    console.log(event.target.checked);
    let tempArr = rows.map((item) =>
      item.flagNumber === unique.flagNumber
        ? { ...item, isChecked: event.target.checked }
        : item
    );
    if (event.target.checked) {
      setSelectData([...selectData, unique]);
    } else {
      let checkData = selectData.filter(
        (item) => item.flagNumber !== unique.flagNumber
      );
      setSelectData(checkData);
    }
    setRows(tempArr);
  };

  const CheckBoxSelectAll = (e) => {
    const newSelecteds = rows.map((item) => ({
      ...item,
      isChecked: e.target.checked,
    }));
    setRows(newSelecteds);
    if (e.target.checked) {
      setSelectData(newSelecteds);
    } else {
      setSelectData([]);
    }
  };

  useEffect(() => {
    console.log(props.enclosureArr)
    let arr = props.enclosureArr.filter((item) => item.coverNote === false);
    let tempArr = arr.map((item) => ({ ...item, isChecked: false }));
    setRows(tempArr);
    setTotalCount(tempArr.length);
  }, [props.enclosureArr]);

  useEffect(() => {
    let start = currentPage * pageSize;
    let end = (currentPage + 1) * pageSize;
    let tempArr = rows.slice(start, end);
    setRowData(tempArr);
  }, [rows, pageSize, currentPage]);

  const VALIDATION_SCHEMA = Yup.object().shape({
    subject: Yup.string(t("enter_a_subject"))
      .trim()
      .max(250, t("subject_should_not_be_greater_than_250_characters"))
      .required(`${t("this_field_is_required")} !`),
  });

  const formik = useFormik({
    initialValues: { subject: "" },
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: (values) => {
      props.handleSend(values.subject, selectData);
    },
  });

  return (
    <div>
      {props.loading && <Loading />}
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            name="subject"
            label={t("enter_cover_letter_title")}
            value={formik.values.subject}
            onChange={formik.handleChange}
            error={formik.touched.subject && Boolean(formik.errors.subject)}
            helperText={formik.touched.subject && formik.errors.subject}
            autoFocus
            style={{ marginBottom: "1rem" }}
            className={theme ? "darkTextField" : ""}
          />
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
            <Table className="App-main-table" component="div">
              <TableHead component="div">
                <TableRow className="cover_table head" component="div">
                  <div>
                    <Checkbox
                      indeterminate={
                        selectData.length > 0 && selectData.length < rows.length
                      }
                      checked={
                        rows.length > 0 && selectData.length === rows.length
                      }
                      onChange={CheckBoxSelectAll}
                    />
                  </div>
                  <div>
                    <span>{t("SN")}</span>
                  </div>
                  <div>
                    <span>{t("Subject")}</span>
                  </div>
                </TableRow>
              </TableHead>
              <TableBody
                component="div"
                style={{
                  height: "35vh",
                  overflow: "auto",
                }}
              >
                {/* Mapping data coming from backnd */}

                {rowData.map((item, i) => {
                  return (
                    <TableRow
                      hover
                      component="div"
                      key={i}
                      selected={item.isChecked}
                      className="cover_table body"
                    >
                      <div className="checkbox">
                        <Checkbox
                          checked={item.isChecked}
                          onClick={(e) => {
                            e.stopPropagation();
                            CheckBoxSelection(e, item);
                          }}
                        />
                      </div>
                      <div className="info1">
                        <span>{item.serialNo + 1}</span>
                      </div>
                      <div className="info2 text-overflow">
                        <Tooltip title={item.subject?.split(".")[0]}>
                          <span>{item.subject?.split(".")[0]}</span>
                        </Tooltip>
                      </div>
                    </TableRow>
                  );
                })}
              </TableBody>
              <PaginationComp
                pageSize={pageSize}
                pageSizes={[5, 10, 15]}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalCount={totalCount}
                setPageSize={setPageSize}
              />
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button
            id="inbox_coverLetter_submit_button"
            color="secondary"
            type="submit"
            variant="contained"
            disabled={selectData.length === 0}
            endIcon={<Done />}
          >
            {t("save")}
          </Button>
        </DialogActions>
      </form>
    </div>
  );
};

export default CoverLetterDialog;
