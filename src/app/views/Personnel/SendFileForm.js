import React, { useCallback, useEffect, useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  TextField,
  Tooltip,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { connect as reduxConnect, useDispatch } from "react-redux";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  getGroupList,
  sendFiles,
  addToFavourite,
  fetchFavouriteList,
  deleteFavourite,
  getServiceNumber,
  sendFilesInternal,
} from "../../camunda_redux/redux/action";
import {
  changingTableState,
  changingTableStatePA,
  changeTableStateDraft,
} from "../../camunda_redux/redux/action/apiTriggers";
import { setSnackbar } from "../../camunda_redux/redux/ducks/snackbar";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import { useTranslation } from "react-i18next";
import "./therme-source/material-ui/loading.css";
import { debounce } from "utils";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/styles";
import PropTypes from "prop-types";
import { FcHighPriority, FcLowPriority, FcMediumPriority } from "react-icons/fc"
import { Loading } from "./therme-source/material-ui/loading";

const useStyles = makeStyles((theme) => ({
  priority_box: {
    width: "100%",
    display: "flex",
    justifyContent: "space-evenly"
  },
  priority_btn: {
    fontSize: "2rem",
    border: "1px solid #8080804f !important",
    borderRadius: "8%"
  }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box py={3}>
          <Grid>{children}</Grid>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const SendFileForm = (props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [priority, setPriorty] = useState("medium");
  const [tabValue, setTabValue] = useState(0);

  const classes = useStyles();

  const [externalList, setExternalList] = useState([]);
  const [externalDep, setExternalDep] = useState(null);
  const [eyesOnlyArr, setEyesOnlyArr] = useState([]);
  const [eyesOnlyDep, setEyesOnlyDep] = useState(null);
  const [favouriteList, setFavouriteList] = useState([]);
  const [serviceFavouriteList, setServiceFavouriteList] = useState([]);
  const [favDep, setFavDep] = useState("");
  const [blnDisable, setBlnDisable] = useState(true);
  const [eyesOnlyfavObj, setEyesOnlyfavObj] = useState(null);
  const [alreadyFav, setAlreadyFav] = useState(false);

  const [loading, setLoading] = useState(false);

  const username = localStorage.getItem("username");
  const displayUserName = sessionStorage.getItem("displayUserName");
  const role = sessionStorage.getItem("role");

  const handleClearAll = () => {
    setExternalList([]);
    setExternalDep(null);
    setEyesOnlyArr([]);
    setEyesOnlyDep(null);
    setEyesOnlyfavObj(null);
    setFavDep("");
    setBlnDisable(true);
    setAlreadyFav(false);
  };

  useEffect(() => {
    if (externalDep || eyesOnlyDep || favDep) {
      setBlnDisable(false);
    } else {
      setBlnDisable(true);
    }
  }, [externalDep, eyesOnlyDep, favDep]);

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  const callMessageOut = (msg) => {
    dispatch(setSnackbar(true, "error", msg));
  };

  useEffect(async () => {
    fetchFavourite();
  }, [tabValue]);

  const onHandleSubmitExtenal = async (value) => {
    await props
      .sendFiles(
        props.fileId,
        value,
        role,
        username,
        displayUserName,
        props.pfileName,
        priority
      )
      .then((resp) => {
        console.log(resp);
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            setLoading(false);
          } else {
            dispatch(
              setSnackbar(true, "success", t("file_sent_successfully!"))
            );
            props.handleCloseEvent(false);
            props.handleStatus(props.fileId);
            let trigger = false;
            props.setSend(false);
            setLoading(false);
            setTimeout(() => {
              trigger = true;
              props.changingTableState(trigger, "CHANGE_PA_FILE");
              props.changingTableStatePA(trigger, "CHANGE_PA_APPLICATION");
              props.changeTableStateDraft(trigger, "CHANGE_PA_DRAFT");
            }, 0);
          }
        } catch (error) {
          callMessageOut(error.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        callMessageOut(error.message);
        setLoading(false);
      });
  };

  const handleEyesOnlySubmit = async (value) => {
    await props
      .sendFilesInternal(
        props.fileId,
        value,
        role,
        username,
        displayUserName,
        priority
      )
      .then((resp) => {
        console.log(resp);
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            setLoading(false);
          } else {
            dispatch(
              setSnackbar(true, "success", t("file_sent_successfully!"))
            );
            props.handleCloseEvent(false);
            props.handleStatus(props.fileId);
            let trigger = false;
            props.setSend(false);
            setLoading(false);
            setTimeout(() => {
              trigger = true;
              props.changingTableState(trigger, "CHANGE_PA_FILE");
              props.changingTableStatePA(trigger, "CHANGE_PA_APPLICATION");
              props.changeTableStateDraft(trigger, "CHANGE_PA_DRAFT");
            }, 0);
          }
        } catch (error) {
          callMessageOut(error.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        callMessageOut(error.message);
        setLoading(false);
      });
  };

  // Debounce function
  const optimizedInpChange = useCallback(debounce(getGroupListFunc), []);
  const optimizedEyesOnlyInpChange = useCallback(
    debounce(getInternalGroupListFunc),
    []
  );

  const handleInputChange = async (e) => {
    if (e && e.target) {
      if (!isNullOrUndefined(e.target.value)) {
        optimizedInpChange(e.target.value);
      }
    }
  };

  const handleEyesOnlyInputChange = async (e) => {
    if (e && e.target) {
      if (!isNullOrUndefined(e.target.value)) {
        optimizedEyesOnlyInpChange(e.target.value);
      }
    }
  };

  async function getGroupListFunc(value) {
    if (value && value.length > 2) {
      let formData = new FormData();
      formData.append("sau", value);
      await props
        .getGroupList(formData)
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
            } else {
              let tmpArray = [];
              // for (var i = 0; i < resp.data.length; i++) {
              //   tmpArray.push(resp.data[i]);
              // }
              setExternalList(resp.data);
            }
          } catch (err) {
            callMessageOut(err.message);
          }
        })
        .catch((err) => {
          callMessageOut(err.message);
        });
    }
  }

  async function getInternalGroupListFunc(value) {
    if (value && value.length > 2) {
      const dept = sessionStorage.getItem("department");
      await props
        .getServiceNumber(value, dept)
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
            } else {
              let tmpArray = [];
              // for (var i = 0; i < resp.data.length; i++) {
              //   tmpArray.push(resp.data[i]);
              // }
              setEyesOnlyArr(resp.data);
            }
          } catch (err) {
            callMessageOut(err.message);
          }
        })
        .catch((err) => {
          callMessageOut(err.message);
        });
    }
  }

  const handleAddToFavourite = async (newValues, type) => {
    console.log(newValues);
    await props
      .addToFavourite(newValues.id, { username }, type)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          } else {
            setAlreadyFav(true);
            fetchFavourite();
            dispatch(
              setSnackbar(true, "success", "Added to favourite successfully")
            );
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      })
      .catch((err) => {
        callMessageOut(err.message);
      });
  };

  const fetchFavourite = async () => {
    let type = tabValue == 0 ? "section" : "service"
    await props
      .fetchFavouriteList({ username, type })
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          } else {
            setFavouriteList(resp.favourite.sectionFavourite);
            setServiceFavouriteList(resp.favourite.serviceFavourite);
          }
        } catch (err) {
          callMessageOut(err.message);
        }
      })
      .catch((err) => {
        callMessageOut(err.message);
      });
  };

  const handleDeletFavourite = async (type) => {
    await props
      .deleteFavourite(favDep?.id, { username }, type)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          } else {
            setFavDep("");
            fetchFavourite();
            dispatch(
              setSnackbar(true, "success", "Delete to favourite successfully")
            );
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      })
      .catch((err) => {
        callMessageOut(err.message);
      });
  };

  const handleSubmitBtn = (e) => {
    e.preventDefault();
    setLoading(true);
    if (tabValue === 0) {
      if (externalDep) {
        onHandleSubmitExtenal(externalDep?.deptName);
      } else if (favDep) {
        onHandleSubmitExtenal(favDep?.deptName);
      }
    } else if (tabValue === 1) {
      if (eyesOnlyDep) {
        handleEyesOnlySubmit(eyesOnlyDep);
      } else if (favDep) {
        handleEyesOnlySubmit(eyesOnlyfavObj);
      }
    }
  };

  const handleChangeAddToFav = async (value) => {
    setFavDep(value);
    setAlreadyFav(false);
    setEyesOnlyDep(null);
    setEyesOnlyfavObj(value);
    // if (value) {
    //   const dept = sessionStorage.getItem("department");
    //   await props
    //     .getServiceNumber(value, dept)
    //     .then((resp) => {
    //       try {
    //         if (resp.error) {
    //           callMessageOut(resp.error);
    //         } else {
    //           setEyesOnlyfavObj(resp?.data[0]);
    //         }
    //       } catch (err) {
    //         callMessageOut(err.message);
    //       }
    //     })
    //     .catch((err) => {
    //       callMessageOut(err.message);
    //     });
    // }
  };

  const handleTabs = (event, newValue) => {
    setTabValue(newValue);
    handleClearAll();
  };

  const handleChangeIndex = (index) => {
    setTabValue(index);
    handleClearAll();
  };

  const handleChangeExternal = (value) => {
    if (!isNullOrUndefined(value)) {
      setExternalDep(value);
      setFavDep("");
      let bool = favouriteList.some(
        (item) => item?.deptName === value?.deptName
      );
      setAlreadyFav(bool);
    } else {
      setExternalDep(null);
      setAlreadyFav(false);
      setFavDep("");
    }
  };

  const handleOnChangeEyesOnly = (value) => {
    if (!isNullOrUndefined(value)) {
      console.log(value);
      setEyesOnlyDep(value);
      setFavDep("");
      let bool = serviceFavouriteList.some(
        (item) => item?.deptUsername === value?.deptUsername
      );
      setAlreadyFav(bool);
    } else {
      setEyesOnlyDep(null);
      setAlreadyFav(false);
      setFavDep("");
    }
  };

  const handlePriority = (type) => {
    if (type == priority) {
      setPriorty("medium");
    }
    else {
      setPriorty(type);
    }
    // setPriorty(type);
  };

  return (
    <>
      {loading && <Loading />}
      <form onSubmit={handleSubmitBtn}>
        <DialogContent dividers>
          <Tabs
            value={tabValue}
            onChange={handleTabs}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label={t("external")} {...a11yProps(0)} />
            <Tab label={t("eyes_only")} {...a11yProps(1)} />
          </Tabs>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={tabValue}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={tabValue} index={0} dir={theme.direction}>
              <>
                <div style={{ display: "flex" }}>
                  <FormControl style={{ width: "100%" }}>
                    <Autocomplete
                      freeSolo
                      forcePopupIcon={true}
                      limitTags={2}
                      value={externalDep}
                      options={externalList}
                      onChange={(_, value) => handleChangeExternal(value)}
                      onInputChange={handleInputChange}
                      name="section"
                      getOptionLabel={(option) => {
                        return option.deptDisplayName
                          ? option.deptDisplayName
                          : "";
                      }}
                      getOptionSelected={(option, value) =>
                        option.deptDisplayName === value.deptDisplayName
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label={t("choose_department")}
                          margin="normal"
                          fullWidth
                          className={props.theme ? "darkTextField" : ""}
                        />
                      )}
                    />
                  </FormControl>
                  {alreadyFav ? (
                    <IconButton color="secondary" style={{ cursor: "pointer" }}>
                      <Tooltip title={t("ALREADY FAVOURITE")}>
                        <FavoriteIcon />
                      </Tooltip>
                    </IconButton>
                  ) : (
                    <IconButton
                      color="secondary"
                      id="fileForm_favourite"
                      onClick={() =>
                        handleAddToFavourite(externalDep, "section")
                      }
                      style={{ cursor: "pointer" }}
                      disabled={!externalDep}
                    >
                      <Tooltip title={t("ADD TO FAVOURITE")}>
                        <FavoriteBorderIcon />
                      </Tooltip>
                    </IconButton>
                  )}
                </div>
                <div className="favourite_list">
                  <div style={{ display: "flex" }}>
                    <FormControl style={{ width: "100%" }}>
                      <Autocomplete
                        freeSolo
                        forcePopupIcon={true}
                        value={favDep}
                        options={favouriteList}
                        onChange={(_, value) => {
                          setFavDep(value);
                          setExternalDep(null);
                          setAlreadyFav(false);
                        }}
                        name="section"
                        getOptionLabel={(option) => {
                          return option.deptDisplayName
                            ? option.deptDisplayName
                            : "";
                        }}
                        getOptionSelected={(option, value) =>
                          option.deptDisplayName === value.deptDisplayName
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label={t("CHOOSE FROM FAVOURITE LIST")}
                            margin="normal"
                            className={props.theme ? "darkTextField" : ""}
                          />
                        )}
                      />
                    </FormControl>
                    <IconButton
                      id="fileForm_delete_fav"
                      color="secondary"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDeletFavourite("section")}
                      disabled={!favDep}
                    >
                      <Tooltip title={t("delete_favourite")}>
                        <DeleteIcon />
                      </Tooltip>
                    </IconButton>
                  </div>
                </div>
              </>
            </TabPanel>
            <TabPanel value={tabValue} index={1} dir={theme.direction}>
              <>
                <div style={{ display: "flex" }}>
                  <FormControl style={{ width: "100%" }}>
                    <Autocomplete
                      freeSolo
                      forcePopupIcon={true}
                      options={eyesOnlyArr}
                      value={eyesOnlyDep}
                      getOptionLabel={(option) => {
                        return typeof option === "object"
                          ? `${option?.deptUsername} | ${option?.deptDisplayUsername} | ${option?.deptRole?.displayRoleName}`
                          : "";
                      }}
                      id="tags-outlined"
                      onChange={(_, value) => handleOnChangeEyesOnly(value)}
                      onInputChange={handleEyesOnlyInputChange}
                      filterSelectedOptions
                      getOptionDisabled={(option) =>
                        option?.deptUsername === eyesOnlyDep?.deptUsername
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          style={{ width: "100%" }}
                          variant="outlined"
                          label={t("search_by_service_number")}
                          placeholder={t("enter_service_number")}
                          className={props.theme ? "darkTextField" : ""}
                        />
                      )}
                    />
                  </FormControl>
                  {alreadyFav ? (
                    <IconButton color="secondary">
                      <Tooltip title={t("ALREADY FAVOURITE")}>
                        <FavoriteIcon />
                      </Tooltip>
                    </IconButton>
                  ) : (
                    <IconButton
                      color="secondary"
                      id="fileForm_favourite"
                      onClick={() =>
                        handleAddToFavourite(eyesOnlyDep, "service")
                      }
                      style={{ cursor: "pointer" }}
                      disabled={!eyesOnlyDep}
                    >
                      <Tooltip title={t("ADD TO FAVOURITE")}>
                        <FavoriteBorderIcon />
                      </Tooltip>
                    </IconButton>
                  )}
                </div>
                <div className="favourite_list">
                  <div style={{ display: "flex" }}>
                    <FormControl style={{ width: "100%" }}>
                      <Autocomplete
                        freeSolo
                        forcePopupIcon={true}
                        limitTags={2}
                        value={favDep}
                        options={serviceFavouriteList}
                        onChange={(_, value) => handleChangeAddToFav(value)}
                        name="section"
                        getOptionLabel={(option) => {
                          return typeof option === "object"
                            ? `${option?.deptUsername} | ${option?.deptDisplayUsername} | ${option?.deptRole?.displayRoleName}`
                            : "";
                        }}
                        getOptionDisabled={(option) =>
                          option?.deptUsername === favDep?.deptUsername
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label={t("CHOOSE FROM FAVOURITE LIST")}
                            margin="normal"
                            className={props.theme ? "darkTextField" : ""}
                          />
                        )}
                      />
                    </FormControl>
                    <IconButton
                      id="eyes_only_delete_fav"
                      color="secondary"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDeletFavourite("service")}
                      disabled={!favDep}
                    >
                      <Tooltip title={t("delete_favourite")}>
                        <DeleteIcon />
                      </Tooltip>
                    </IconButton>
                  </div>
                </div>
              </>
            </TabPanel>
          </SwipeableViews>

          <FormControl
            style={{
              paddingLeft: "4px",
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <h6>PRIORITY:</h6>
            <Box className={classes.priority_box}>
              <Tooltip title={t("low")}>
                <IconButton className={classes.priority_btn} onClick={() => handlePriority("low")} style={{
                  background: priority == "low" ? "rgb(53 76 100 / 39%)" : "none"
                }}>
                  <FcLowPriority />
                </IconButton>
              </Tooltip>
              {/* <Tooltip title={t("medium")}>
                <IconButton className={classes.priority_btn} onClick={() => handlePriority("medium")} style={{
                  background: priority == "medium" ? "#354c6491" : "none"
                }}>
                  <FcMediumPriority />
                </IconButton>
              </Tooltip> */}
              <Tooltip title={t("high")}>
                <IconButton className={classes.priority_btn} onClick={() => handlePriority("high")} style={{
                  background: priority == "high" ? "rgb(53 76 100 / 39%)" : "none"
                }}>
                  <FcHighPriority />
                </IconButton>
              </Tooltip>
            </Box>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            id="fileForm_send_btn"
            className="sendIcon"
            color="secondary"
            variant="contained"
            type="submit"
            disabled={blnDisable}
            endIcon={<SendIcon />}
          >
            {t("send")}
          </Button>
        </DialogActions>
      </form>
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    theme: state.theme,
  };
}

export default reduxConnect(mapStateToProps, {
  getGroupList,
  sendFiles,
  addToFavourite,
  fetchFavouriteList,
  changingTableState,
  changingTableStatePA,
  changeTableStateDraft,
  deleteFavourite,
  getServiceNumber,
  sendFilesInternal,
})(SendFileForm);

// let newArr = [
//   {
//     deptCoordRole: "7wg.hrc.hrc",
//     deptDisplayName: "7WG.HRC",
//     deptName: "7wghrc",
//     deptRoleDisplayName: null,
//     id: "63d9f6c175e822719efb02c9",
//   },
//   {
//     deptCoordRole: "7wg.meto.meto",
//     deptDisplayName: "7WG.METO",
//     deptName: "7wgmeto",
//     deptRoleDisplayName: null,
//     id: "63d9f6c175e822719efb02ca",
//   },
//   {
//     deptCoordRole: "7wg.cad.cad",
//     deptDisplayName: "7WG.CAD",
//     deptName: "7wgcad",
//     deptRoleDisplayName: null,
//     id: "63d9f6c175e822719efb02cb",
//   },
//   {
//     deptCoordRole: "7wg.adm.adm",
//     deptDisplayName: "7WG.ADM",
//     deptName: "7wgadm",
//     deptRoleDisplayName: null,
//     id: "63d9f6c175e822719efb02cc",
//   },
// ];
