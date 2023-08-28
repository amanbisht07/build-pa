import {
  Button,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  DialogContent,
} from "@material-ui/core";
import { ChevronRight, Search, RotateLeft } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { makeStyles } from "@material-ui/styles";
import React, { memo, useEffect } from "react";
import { useContext } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { debounce } from "utils";
import { useTranslation } from "react-i18next";
import {
  loadCabinetStatus,
  loadSendBy,
  loadCreatedBy,
  laodFileNo,
  loadCabinetSubject,
  getCabinaetData,

} from "../../../camunda_redux/redux/action/index";
import { AdvanceSearchContext } from "../folder/Cabinet";
import { loadCabinetContext } from "../folder/CabinetTableView";

const useStyles = makeStyles(() => ({
  drawerHeader: {
    display: "grid",
    gridTemplateColumns: "3rem 1fr",
    alignItems: "center",
    background: "#9b9b9b5c",
  },
  drawerContainer: {
    padding: "1rem",
  },
}));

const AdvanceSeach = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [sendUsers, setSendUsers] = useState([]);
  const [createdUsers, setCreatedUsers] = useState([]);
  const [fileNoData, setFileNoData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [newValues, setNewValues] = useState("");
  // const [val, setVla] = useState("");

  const {
    sendBy,
    createdBy,
    fileNo,
    subject,
    status,
    AdvanceOnChange,
    scope,
    handleReset,
  } = useContext(AdvanceSearchContext);

  const { handleOpenAdvance } = props;
  const roleName = sessionStorage.getItem("role");
  const userName = localStorage.getItem("username");
  const department = sessionStorage.getItem("department");

  // useEffect(() => {
  // console.log("loadAdvance search", props);
  // });
  // const { sendBy, createBy, fileNo, subject, status } = state;

  const handleSendBy = useCallback(debounce(getSendBy), []);
  const handleCreatedBy = useCallback(debounce(getCreatedBy), []);
  const handleFileNo = useCallback(debounce(getFileNo), []);
  const handleSubject = useCallback(debounce(getSubject), []);



  useEffect(() => {
    loadStatus();
  }, []);

  function loadStatus() {
    props
      .loadCabinetStatus(
        roleName,
        department,
        userName,
        scope ? scope : "internal"
      )
      .then(({ response }) => {
        const data = Object.keys(response.Status);
        setStatusData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getSendBy(val) {
    if (val?.length > 0) {
      props
        .loadSendBy(
          val,
          roleName,
          userName,
          department,
          scope ? scope : "internal"
        )
        .then(({ response }) => {
          const data = Object.keys(response.SendBy);
          setSendUsers(data);
        })
        .catch((error) => console.log(error));
    }
  }

  function getCreatedBy(val) {
    if (val?.length > 0) {
      props
        .loadCreatedBy(
          val,
          roleName,
          userName,
          department,
          scope ? scope : "internal"
        )
        .then(({ response }) => {
          const data = Object.keys(response.CreatedBy);
          setCreatedUsers(data);
        })
        .catch((error) => console.log(error));
    }
  }

  function getFileNo(val) {
    if (val?.length > 0) {
      props
        .laodFileNo(
          val,
          roleName,
          userName,
          department,
          scope ? scope : "internal"
        )
        .then(({ response }) => {
          const data = Object.keys(response.FileNumber);
          setFileNoData(data);
        })
        .catch((error) => console.log(error));
    }
  }

  function getSubject(val) {
    if (val?.length > 0) {
      props
        .loadCabinetSubject(
          val,
          roleName,
          userName,
          department,
          scope ? scope : "internal"
        )
        .then(({ response }) => {
          if (val) {
            const data = Object.keys(response.Subject);
            setSubjectData(data);
          }
        })
        .catch((error) => console.log(error));
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    props.loadAdvanceSearchTable();
  };


  return (
    <div>
      {/* <div className={classes.drawerHeader}>
        <IconButton onClick={handleOpenAdvance} style={{ float: "left" }}>
          <ChevronRight />
        </IconButton>
        <Typography variant="h6" component="h6" align="center" style={{float:"left"}}>
          Advance Search
        </Typography>
      </div> */}

      <div className={classes.drawerContainer}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={2}>
              <span style={{ color: "grey" }}>Send By:</span>
            </Grid>
            <Grid item xs={10}>
              <Autocomplete
                freeSolo
                id="advance_send_by"
                name="sendBy"
                options={sendUsers}
                getOptionLabel={(option) => option}
                value={sendBy}
                onChange={(event, newValue) => {
                  AdvanceOnChange("sendBy", newValue);
                }}
                onInputChange={(event, newInputValue) => {
                  if (newInputValue) {
                    handleSendBy(newInputValue);
                  }
                }}
                disableClearable={true}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    size="small"
                    onChange={(e, value) =>
                      AdvanceOnChange("sendBy", e.target.value)
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <span style={{ color: "grey" }}>Created By:</span>
            </Grid>
            <Grid item xs={10}>
              <Autocomplete
                freeSolo
                id="advance_created_by"
                name="createdBy"
                options={createdUsers}
                getOptionLabel={(option) => option}
                value={createdBy}
                onChange={(event, newValue) => {
                  AdvanceOnChange("createdBy", newValue);
                }}
                onInputChange={(event, newInputValue) => {
                  if (newInputValue) {
                    handleCreatedBy(newInputValue);
                  }
                }}
                disableClearable={true}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    size="small"
                    onChange={(e, value) =>
                      AdvanceOnChange("createdBy", e.target.value)
                    }
                  />
                )}
              />

            </Grid>
            <Grid item xs={2}>
              <span style={{ color: "grey" }}>File No:</span>
            </Grid>

            <Grid item xs={10}>

              <Autocomplete
                freeSolo
                id="advance_file_no"
                name="fileNo"
                options={fileNoData}
                getOptionLabel={(option) => option}
                value={fileNo}
                onChange={(event, newValue) => {
                  AdvanceOnChange("fileNo", newValue);
                }}
                onInputChange={(event, newInputValue) => {
                  if (newInputValue) {
                    handleFileNo(newInputValue);
                  }
                }}
                disableClearable={true}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    size="small"
                    onChange={(e, value) =>
                      AdvanceOnChange("fileNo", e.target.value)
                    }
                  />
                )}
              />


            </Grid>
            <Grid item xs={2}>
              <span style={{ color: "grey" }}>File Subject:</span>
            </Grid>
            <Grid item xs={10}>

              <Autocomplete
                freeSolo
                id="advance_file_subject"
                name="fileSubject"
                options={subjectData}
                getOptionLabel={(option) => option}
                value={subject}
                onChange={(event, newValue) => {
                  AdvanceOnChange("subject", newValue);
                }}
                onInputChange={(event, newInputValue) => {
                  if (newInputValue) {
                    handleSubject(newInputValue);
                  }
                }}
                disableClearable={true}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    size="small"
                    onChange={(e, value) =>
                      AdvanceOnChange("subject", e.target.value)
                    }
                  />
                )}
              />


            </Grid>
            <Grid item xs={2}>
              <span style={{ color: "grey" }}>Status:</span>
            </Grid>
            <Grid item xs={10}>
              <TextField
                select
                fullWidth
                // label="Status"
                variant="outlined"
                size="small"
                name="status"
                value={status}
                onChange={(e) => AdvanceOnChange("status", e.target.value)}
              >
                {statusData.map((item) => (
                  <MenuItem value={item} key={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <div
                style={{ display: "flex", gap: "10px", justifyContent: "end" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<RotateLeft />}
                  onClick={handleReset}
                >
                  {t("reset")}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  endIcon={<Search />}
                  type="submit"
                  onClick={handleOpenAdvance}
                >
                  {t("search")}
                </Button>
              </div>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
  };
}

export default connect(mapStateToProps, {
  loadCabinetStatus,
  loadSendBy,
  loadCreatedBy,
  laodFileNo,
  loadCabinetSubject,
})(memo(AdvanceSeach));
