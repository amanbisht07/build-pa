import React, { useEffect, useState } from "react";
import "../css/PrimeSearch.css";
import SearchIcon from "@material-ui/icons/Search";
import { Button, Collapse, Paper, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import SearchTableP from "./Audit_search_Table";
import { Breadcrumb } from "matx";
import moment from "moment";
import { useFormik } from "formik";
import * as yup from "yup";
import { getauditsearch } from "../../../camunda_redux/redux/action/index";
import { connect, useSelector } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { useDispatch } from "react-redux";
import { SplitterComponent } from "@syncfusion/ej2-react-layouts";

const auditType = [
  "Login Fail",
  "Login Successful",
  "Read",
  "Write",
  "Create",
  "Sign",
];
const filterBy = ["User", "Role", "Department"];
const User_fail = ["user"];

const Home = (props) => {
  const dispatch = useDispatch();
  const date = new Date();
  const [dateTo, setresponseDate] = useState(moment(date).format("YYYY-MM-DD"));
  const [dateFrom, setDates] = useState(moment(date).format("YYYY-MM-DD"));
  const [getauditsearchdata, setGetauditsearchdata] = useState([]);
  const { theme } = useSelector((state) => state);
  const [showInput, setShowInput] = useState(false);
  const [showInputFilter, setShowInputFilter] = useState(false);

  useEffect(() => {
    if (formik.values.auditType !== null) {
      setShowInput(true);
    } else {
      setShowInput(false);
    }
    if (formik.values.filterBy !== null) {
      setShowInputFilter(true);
    } else {
      setShowInputFilter(false);
    }
  }, []);

  useEffect(() => {
    getDatesAlgo();
  }, [dateFrom]);
  const getDatesAlgo = () => {
    setresponseDate(() => {
      let currDate = new Date(dateFrom);
      return get30DayGap(currDate);
    });
  };
  const get30DayGap = (date) => {
    let d = date.setDate(date.getDate() + 30);
    const gappedDate = moment(new Date(d)).format("YYYY-MM-DD");
    return convert(gappedDate);
  };

  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  const dateChange = (e) => {
    setDates(e.target.value);
  };

  const dateChangeResp = (e) => {
    setresponseDate(e.target.value);
  };

  // ------------------------------ FORMIK START -------------------------------

  const validationSchema = yup.object({
    auditType: yup.string().required(" Enter Audit Type "),
    filterBy: yup.string().required("This Field Required"),
    filterValue: yup.string().required("This Field Required"),
    fileNo: yup
      .string()
      .when("auditType", {
        is: "Read",
        then: yup.string().required(" Enter File No"),
        otherwise: yup.string(),
      })
      .when("auditType", {
        is: "Write",
        then: yup.string().required(" Enter File No"),
        otherwise: yup.string(),
      })
      .when("auditType", {
        is: "Create",
        then: yup.string().required(" Enter File No"),
        otherwise: yup.string(),
      })
      .when("auditType", {
        is: "Sign",
        then: yup.string().required(" Enter File No"),
        otherwise: yup.string(),
      }),
  });

  const initialValues = {
    auditType: "",
    read: "",
    write: "",
    create: "",
    sign: "",
    fileNo: "",
    filterBy: "",
    filterValue: "",
  };
  const handlesearch = (values) => {
    const { auditType, fileNo, filterBy, filterValue } = values;
    props
      .getauditsearch(
        auditType,
        fileNo,
        filterBy,
        filterValue,
        dateFrom,
        dateTo
      )
      .then((resp) => {
        if (!resp.error) {
          setGetauditsearchdata(resp);
        } else {
          dispatch(setSnackbar(true, "error", resp.error));
        }
      });
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handlesearch(values);
    },
  });

  // ------------------------------------FORMIK END -------------------------------------

  return (
    <>
      <div className="bradcrum_audit">
        <span>
          <Breadcrumb
            routeSegments={[{ name: "AUDIT  SEARCH", path: "/personnel/file" }]}
          />
        </span>
      </div>

      <div style={{ padding: " 0 1rem " }}>
        <SplitterComponent>
          <div style={{ flex: "33%" }}>
            <Paper
              elevation={3}
              style={{
                borderRadius: "8px",
                padding: "1rem",
              }}
            >
              <form onSubmit={formik.handleSubmit}>
                <div className="grid_spacing">
                  <Autocomplete
                    size="small"
                    name="auditType"
                    options={["", ...auditType]}
                    value={formik.values.auditType}
                    onChange={(event, newValue) => {
                      formik.handleReset();
                      newValue
                        ? formik.setFieldValue("auditType", newValue)
                        : formik.setFieldValue("auditType", "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Audit Type"
                        variant="outlined"
                        error={
                          formik.touched.auditType &&
                          Boolean(formik.errors.auditType)
                        }
                        helperText={
                          formik.touched.auditType && formik.errors.auditType
                        }
                      />
                    )}
                  />
                </div>
                <div className="grid_spacing">
                  <TextField
                    size="small"
                    fullWidth
                    value={dateFrom}
                    name="date"
                    type="date"
                    variant="outlined"
                    label=" Created Date "
                    onChange={dateChange}
                  />
                </div>
                <div className="grid_spacing">
                  <TextField
                    size="small"
                    fullWidth
                    value={dateTo}
                    name="date"
                    type="date"
                    variant="outlined"
                    label="Response Date"
                    onChange={dateChangeResp}
                    inputProps={{
                      min: dateFrom,
                      max: get30DayGap(new Date(dateFrom)),
                    }}
                  />
                </div>
                <Collapse in={Boolean(formik.values.auditType)}>
                  <div className="grid_spacing">
                    {formik.values.auditType === "Login Fail" ? (
                      <Autocomplete
                        size="small"
                        name="filterBy"
                        value={formik.values.filterBy}
                        options={["", ...User_fail]}
                        onChange={(event, newValue) => {
                          newValue
                            ? formik.setFieldValue("filterBy", newValue)
                            : formik.setFieldValue("filterBy", "");
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Filter By"
                            variant="outlined"
                            error={
                              formik.touched.filterBy &&
                              Boolean(formik.errors.filterBy)
                            }
                            helperText={
                              formik.touched.filterBy && formik.errors.filterBy
                            }
                          />
                        )}
                      />
                    ) : formik.values.auditType === "Login Successful" ? (
                      <Autocomplete
                        size="small"
                        name="filterBy"
                        value={formik.values.filterBy}
                        options={["", ...User_fail]}
                        onChange={(event, newValue) => {
                          newValue
                            ? formik.setFieldValue("filterBy", newValue)
                            : formik.setFieldValue("filterBy", "");
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Filter By"
                            variant="outlined"
                            error={
                              formik.touched.filterBy &&
                              Boolean(formik.errors.filterBy)
                            }
                            helperText={
                              formik.touched.filterBy && formik.errors.filterBy
                            }
                          />
                        )}
                      />
                    ) : formik.values.auditType === "Read" ? (
                      <TextField
                        fullWidth
                        label="File No"
                        id="locationPlace"
                        autoComplete="off"
                        size="small"
                        variant="outlined"
                        name="fileNo"
                        value={formik.values.fileNo}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.fileNo && Boolean(formik.errors.fileNo)
                        }
                        helperText={
                          formik.touched.fileNo && formik.errors.fileNo
                        }
                      />
                    ) : formik.values.auditType === "Write" ? (
                      <TextField
                        fullWidth
                        label="File No"
                        autoComplete="off"
                        id="locationPlace"
                        size="small"
                        variant="outlined"
                        name="fileNo"
                        value={formik.values.fileNo}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.fileNo && Boolean(formik.errors.fileNo)
                        }
                        helperText={
                          formik.touched.fileNo && formik.errors.fileNo
                        }
                      />
                    ) : formik.values.auditType === "Create" ? (
                      <TextField
                        fullWidth
                        label="File No"
                        autoComplete="off"
                        id="locationPlace"
                        size="small"
                        variant="outlined"
                        name="fileNo"
                        value={formik.values.fileNo}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.fileNo && Boolean(formik.errors.fileNo)
                        }
                        helperText={
                          formik.touched.fileNo && formik.errors.fileNo
                        }
                      />
                    ) : formik.values.auditType === "Sign" ? (
                      <TextField
                        fullWidth
                        label="File No"
                        autoComplete="off"
                        id="locationPlace"
                        size="small"
                        variant="outlined"
                        name="fileNo"
                        value={formik.values.fileNo}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.fileNo && Boolean(formik.errors.fileNo)
                        }
                        helperText={
                          formik.touched.fileNo && formik.errors.fileNo
                        }
                      />
                    ) : null}
                  </div>
                </Collapse>
                <Collapse in={Boolean(formik.values.auditType)}>
                  <div className="grid_spacing">
                    {formik.values.auditType === "Login Fail" && (
                      <TextField
                        label="User"
                        fullWidth
                        autoComplete="off"
                        id="locationPlace"
                        size="small"
                        variant="outlined"
                        name="filterValue"
                        value={formik.values.filterValue}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.filterValue &&
                          Boolean(formik.errors.filterValue)
                        }
                        helperText={
                          formik.touched.filterValue &&
                          formik.errors.filterValue
                        }
                      />
                    )}
                    {formik.values.auditType === "Login Successful" && (
                      <TextField
                        label="User"
                        fullWidth
                        autoComplete="off"
                        id="locationPlace"
                        size="small"
                        variant="outlined"
                        name="filterValue"
                        value={formik.values.filterValue}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.filterValue &&
                          Boolean(formik.errors.filterValue)
                        }
                        helperText={
                          formik.touched.filterValue &&
                          formik.errors.filterValue
                        }
                      />
                    )}
                    {formik.values.auditType === "Read" && (
                      <Autocomplete
                        fullWidth
                        size="small"
                        name="filterBy"
                        value={formik.values.filterBy}
                        options={["", ...filterBy]}
                        onChange={(event, newValue) => {
                          newValue
                            ? formik.setFieldValue("filterBy", newValue)
                            : formik.setFieldValue("filterBy", "");
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Filter By"
                            variant="outlined"
                            error={
                              formik.touched.filterBy &&
                              Boolean(formik.errors.filterBy)
                            }
                            helperText={
                              formik.touched.filterBy && formik.errors.filterBy
                            }
                          />
                        )}
                      />
                    )}
                    {formik.values.auditType === "Write" && (
                      <Autocomplete
                        size="small"
                        name="filterBy"
                        value={formik.values.filterBy}
                        options={["", ...filterBy]}
                        onChange={(event, newValue) => {
                          newValue
                            ? formik.setFieldValue("filterBy", newValue)
                            : formik.setFieldValue("filterBy", "");
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Filter By"
                            variant="outlined"
                            error={
                              formik.touched.filterBy &&
                              Boolean(formik.errors.filterBy)
                            }
                            helperText={
                              formik.touched.filterBy && formik.errors.filterBy
                            }
                          />
                        )}
                      />
                    )}
                    {formik.values.auditType === "Create" && (
                      <Autocomplete
                        size="small"
                        name="filterBy"
                        value={formik.values.filterBy}
                        options={["", ...filterBy]}
                        onChange={(event, newValue) => {
                          newValue
                            ? formik.setFieldValue("filterBy", newValue)
                            : formik.setFieldValue("filterBy", "");
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Filter By"
                            variant="outlined"
                            error={
                              formik.touched.filterBy &&
                              Boolean(formik.errors.filterBy)
                            }
                            helperText={
                              formik.touched.filterBy && formik.errors.filterBy
                            }
                          />
                        )}
                      />
                    )}
                    {formik.values.auditType === "Sign" && (
                      <Autocomplete
                        size="small"
                        name="filterBy"
                        value={formik.values.filterBy}
                        options={["", ...filterBy]}
                        onChange={(event, newValue) => {
                          newValue
                            ? formik.setFieldValue("filterBy", newValue)
                            : formik.setFieldValue("filterBy", "");
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Filter By"
                            variant="outlined"
                            error={
                              formik.touched.filterBy &&
                              Boolean(formik.errors.filterBy)
                            }
                            helperText={
                              formik.touched.filterBy && formik.errors.filterBy
                            }
                          />
                        )}
                      />
                    )}
                  </div>
                </Collapse>
                <Collapse in={Boolean(formik.values.filterBy)}>
                  <div className="grid_spacing">
                    {formik.values.filterBy === "Role" ? (
                      <TextField
                        fullWidth
                        label="Role"
                        autoComplete="off"
                        id="locationPlace"
                        size="small"
                        variant="outlined"
                        name="filterValue"
                        value={formik.values.filterValue}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.filterValue &&
                          Boolean(formik.errors.filterValue)
                        }
                        helperText={
                          formik.touched.filterValue &&
                          formik.errors.filterValue
                        }
                      />
                    ) : formik.values.filterBy === "Department" ? (
                      <TextField
                        fullWidth
                        label="Department"
                        autoComplete="off"
                        id="locationPlace"
                        size="small"
                        variant="outlined"
                        name="filterValue"
                        value={formik.values.filterValue}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.filterValue &&
                          Boolean(formik.errors.filterValue)
                        }
                        helperText={
                          formik.touched.filterValue &&
                          formik.errors.filterValue
                        }
                      />
                    ) : formik.values.filterBy === "User" ? (
                      <TextField
                        fullWidth
                        label="User"
                        autoComplete="off"
                        id="locationPlace"
                        size="small"
                        variant="outlined"
                        name="filterValue"
                        value={formik.values.filterValue}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.filterValue &&
                          Boolean(formik.errors.filterValue)
                        }
                        helperText={
                          formik.touched.filterValue &&
                          formik.errors.filterValue
                        }
                      />
                    ) : null}
                  </div>
                </Collapse>
                <div className="audit_button_search">
                  <Button
                    type="submit"
                    size="large"
                    endIcon={<SearchIcon />}
                    variant="outlined"
                    color="primary"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </Paper>
          </div>
          <div style={{ flex: "67%" }}>
            {" "}
            <SearchTableP getauditsearchdata={getauditsearchdata} />
          </div>
        </SplitterComponent>
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    subscribeApi: state.subscribeApi,
  };
}

export default connect(mapStateToProps, {
  getauditsearch,
})(Home);
