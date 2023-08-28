import {
  DialogActions,
  DialogContent,
  Tab,
  Tabs,
  Typography,
  Box,
  Grid,
  FormControl,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContentText,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import PropTypes from "prop-types";
import { Autocomplete } from "@material-ui/lab";
import { useTranslation } from "react-i18next";
import SendIcon from "@material-ui/icons/Send";
import DeleteIcon from "@material-ui/icons/Delete";
import FavoriteIcon from "@material-ui/icons/Favorite";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import CloseIcon from "@material-ui/icons/Close";
import {
  sendFilesInternalServiceNumber,
  getInternalServiceNumber,
  getGroupList,
  getSection,
  getServiceNumber,
  sendFilesSection,
  sendFilesServiceNumber,
  PCFileClosuer,
  addToFavourite,
  fetchFavouriteList,
  deleteFavourite,
} from "../../../camunda_redux/redux/action";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { connect, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import history from "../../../../history";
import { Loading } from "../../inbox/therme-source/material-ui/loading";
import SelectFile from "../../inbox/shared/SelectFile";

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

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
}));

let data = ["item1", "item2", "item3"];

const HrmDialog = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const hrmRole = Cookies.get("HrmRole");
  let hasCoverNote = Cookies.get("hasCoverNote");
  const sessionRole = sessionStorage.getItem("role");
  const [role, setRole] = useState("");
  const [value, setValue] = useState(0);
  const [intService, setIntService] = useState("");
  const [intServiceList, setIntServiceList] = useState([]);
  const [intServiceObj, setIntServiceObj] = useState([]);
  const [favIntService, setFavIntService] = useState("");
  const [intServiceFavouriteList, setIntServiceFavouriteList] = useState([]);
  const [favIntServiceDepName, setFavIntServiceDepName] = useState("");
  const [favIntServiceObj, setFavIntServicObj] = useState([]);
  const [section, setSection] = useState("");
  const [sectionList, setSectionList] = useState([]);
  const [sectionObj, setSectionObj] = useState([]);
  const [favSection, setFavSection] = useState("");
  const [sectionFavouriteList, setSectionFavouriteList] = useState([]);
  const [favSectionObj, setFavSectionObj] = useState([]);
  const [service, setService] = useState("");
  const [serviceList, setServiceList] = useState([]);
  const [serviceObj, setServiceObj] = useState([]);
  const [favService, setFavService] = useState("");
  const [serviceFavouriteList, setServiceFavouriteList] = useState([]);
  const [favServiceObj, setFavServiceObj] = useState([]);
  const [favServiceDepName, setFavServiceDepName] = useState("");
  const [blnDisable, setBlnDisable] = useState(true);
  const [addFavBlnDisable, setAddFavBlnDisable] = useState(true);
  const [deleteFavBlnDisable, setDeleteFavBlnDisable] = useState(true);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [load, setLoad] = useState(false);
  const [selectFileDialog, setSelectFileDialog] = useState(false);

  const dispatch = useDispatch();

  const callMessageSuccess = () => {
    dispatch(setSnackbar(true, "success", "File has been send successfully!"));
  };

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);

    setSection("");
    setIntService("");
    setService("");
    setFavSection("");
    setFavIntService("");
    setFavService("");
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const fetchFavourite = async () => {
    await props
      .fetchFavouriteList(sessionRole)
      .then((resp) => {
        const { internalServiceFavourite, sectionFavourite, serviceFavourite } =
          resp.favourite;
        setSectionFavouriteList(sectionFavourite);
        setServiceFavouriteList(serviceFavourite);
        setIntServiceFavouriteList(internalServiceFavourite);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchFavourite();
  }, []);

  useEffect(() => {
    if (
      service ||
      section ||
      intService ||
      favSection ||
      favService ||
      favIntService
    ) {
      setBlnDisable(false);
    } else {
      setBlnDisable(true);
    }

    if (service || section || intService) {
      setAddFavBlnDisable(false);
    } else {
      setAddFavBlnDisable(true);
    }

    if (favSection || favService || favIntService) {
      setDeleteFavBlnDisable(false);
    } else {
      setDeleteFavBlnDisable(true);
    }
  }, [section, service, intService, favIntService, favSection, favService]);

  const handleClearList = (type) => {
    switch (type) {
      case "service":
        return (
          setSection(""),
          setIntService(""),
          setFavService(""),
          setFavSection(""),
          setFavIntService("")
        );
      case "section":
        return (
          setService(""),
          setIntService(""),
          setFavService(""),
          setFavSection(""),
          setFavIntService("")
        );
      case "internal_service":
        return (
          setSection(""),
          setService(""),
          setFavService(""),
          setFavSection(""),
          setFavIntService("")
        );
      case "fav_service":
        return (
          setSection(""),
          setIntService(""),
          setService(""),
          setFavSection(""),
          setFavIntService("")
        );
      case "fav_section":
        return (
          setSection(""),
          setIntService(""),
          setFavService(""),
          setService(""),
          setFavIntService("")
        );
      case "fav_internal_service":
        return (
          setSection(""),
          setIntService(""),
          setFavService(""),
          setFavSection(""),
          setService("")
        );
      default:
        break;
    }
  };

  const handleInputValueChangeInternalService = async (newValue) => {
    const dept = sessionStorage.getItem("department");
    await props.getInternalServiceNumber(newValue, dept).then((resp) => {
      let tmpArray = [];
      setIntServiceObj(resp.data);
      for (var i = 0; i < resp.data.length; i++) {
        tmpArray.push(
          `${resp.data[i].deptUsername} | ${resp.data[i].deptRole}`
        );
      }
      setIntServiceList(tmpArray);
    });
    setSectionList([]);
    setServiceList([]);
  };

  const handleOnChangeInternalService = async (newValue) => {
    let roleData = !isNullOrUndefined(newValue) && newValue.split(" | ")[1];
    setRole(roleData);
    let data =
      !isNullOrUndefined(newValue) &&
      newValue.substr(0, newValue.indexOf(" |"));
    setIntService(data);
    newValue && newValue.length > 0 && handleClearList("internal_service");
  };

  const handleOnChangeFavInternalService = async (value) => {
    setFavIntService(value);
    handleClearList("fav_internal_service");
    const dept = sessionStorage.getItem("department");
    await props
      .getInternalServiceNumber(value, dept)
      .then((resp) => {
        setFavIntServicObj(resp.data);
        const data =
          resp.data && resp.data.find((ele) => ele.deptUsername === value);
        setFavIntServiceDepName(data.deptName);
        setRole(data.deptCoordRole);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleInputValueChange = async (newValue) => {
    await props.getSection(newValue).then((resp) => {
      setSectionObj(resp.data);
      let tmpArray = [];
      for (var i = 0; i < resp.data.length; i++) {
        tmpArray.push(
          `${resp.data[i].deptName} | ${resp.data[i].deptCoordRole}`
        );
      }
      setSectionList(tmpArray);
    });
    setServiceList([]);
    setIntServiceList([]);
  };

  const handleOnChange = (newValue) => {
    let roleData = !isNullOrUndefined(newValue) && newValue.split(" | ")[1];
    setRole(roleData);
    let strSection =
      !isNullOrUndefined(newValue) &&
      newValue.substr(0, newValue.indexOf(" |"));
    setSection(strSection);
    newValue && newValue.length > 0 && handleClearList("section");
  };

  const handleOnChangeFavSection = async (value) => {
    setFavSection(value);
    handleClearList("fav_section");
    await props
      .getSection(value)
      .then((resp) => {
        setFavSectionObj(resp.data);
        let data = resp.data && resp.data.find((ele) => ele.deptName === value);
        setRole(data.deptCoordRole);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleInputValueChangeService = async (newValue) => {
    await props.getServiceNumber(newValue).then((resp) => {
      let tmpArray = [];
      const response = resp.data;
      setServiceObj(response);
      for (var i = 0; i < resp.data.length; i++) {
        tmpArray.push(
          `${resp.data[i].deptUsername} | ${resp.data[i].deptRole}`
        );
      }
      setServiceList(tmpArray);
    });
    setSectionList([]);
    setIntServiceList([]);
  };

  const handleOnChangeService = (newValue) => {
    let roleData = !isNullOrUndefined(newValue) && newValue.split(" | ")[1];
    setRole(roleData);
    let data =
      !isNullOrUndefined(newValue) &&
      newValue.substr(0, newValue.indexOf(" |"));
    setService(data);
    newValue && newValue.length > 0 && handleClearList("service");
  };

  const handleOnChangeFavService = async (value) => {
    setFavService(value);
    handleClearList("fav_service");
    await props
      .getServiceNumber(value)
      .then((resp) => {
        setFavServiceObj(resp.data);
        let data =
          resp.data && resp.data.find((ele) => ele.deptUsername === value);
        setFavServiceDepName(data.deptName);
        setRole(data.deptCoordRole);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddToFavourite = async () => {
    let data = section
      ? section
      : service
      ? service
      : intService
      ? intService
      : "";
    let type = section
      ? "section"
      : service
      ? "service"
      : intService
      ? "internalService"
      : "";
    await props
      .addToFavourite(data, sessionRole, type)
      .then((resp) => {
        fetchFavourite();
        dispatch(
          setSnackbar(true, "success", "Add to favourate list successfully")
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteFavourite = () => {
    let data = favSection
      ? favSection
      : favService
      ? favService
      : favIntService
      ? favIntService
      : "";
    let type = favSection
      ? "section"
      : favService
      ? "service"
      : favIntService
      ? "internalService"
      : "";
    props
      .deleteFavourite(data, sessionRole, type)
      .then((resp) => {
        fetchFavourite();
        setFavSection("");
        setFavService("");
        setFavIntService("");
        dispatch(
          setSnackbar(true, "success", "Delete to favourate list successfully")
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSend = (val, body) => {
    let group = serviceObj.find((data) => data.deptRole === role);
    let intGroup = intServiceObj.find((data) => data.deptRole === role);
    let sectionGroup = sectionObj.find((data) => data.deptName === section);
    const partcaseID = sessionStorage.getItem("partcaseID");
    const rtiID = sessionStorage.getItem("rtiID");
    const fromRole = sessionStorage.getItem("role");
    if (section.length > 0) {
      const sectionData = {
        groupName: section,
        roleName: role,
        fromRole: fromRole,
        displayDeptName: sectionGroup.deptDisplayName,
        displayRoleName: sectionGroup.deptRoleDisplayName,
      };
      props
        .sendFilesSection(rtiID, sectionData, val, props.pfileName, body)
        .then((resp) => {
          callMessageSuccess();
          history.push({ pathname: "/eoffice/inbox/file" });
          props.handleClose();
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (service.length > 0) {
      const serviceNumberData = {
        groupName: group.deptName,
        roleName: role,
        userName: service,
        fromRole: fromRole,
        displayDeptName: group.deptDisplayName,
        displayRoleName: group.deptRoleDisplayName,
      };
      props
        .sendFilesServiceNumber(
          rtiID,
          serviceNumberData,
          val,
          props.pfileName,
          body
        )
        .then((resp) => {
          callMessageSuccess();
          history.push({ pathname: "/eoffice/inbox/file" });
          props.handleClose();
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (intService.length > 0) {
      const intServiceNumberData = {
        groupName: intGroup.deptName,
        roleName: role,
        userName: intService,
        fromRole: fromRole,
        displayDeptName: intGroup.deptDisplayName,
        displayRoleName: intGroup.deptRoleDisplayName,
      };
      props
        .sendFilesInternalServiceNumber(
          rtiID,
          intServiceNumberData,
          val,
          props.pfileName,
          props.inboxId,
          body
        )
        .then((resp) => {
          callMessageSuccess();
          history.push({ pathname: "/eoffice/inbox/file" });
          props.handleClose();
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (favSection.length > 0) {
      const favData = {
        groupName: favSection,
        roleName: favSectionObj[0].deptCoordRole,
        fromRole: fromRole,
        displayDeptName: favSectionObj[0].deptDisplayName,
        displayRoleName: favSectionObj[0].deptRoleDisplayName,
      };
      props
        .sendFilesSection(rtiID, favData, val, props.pfileName, body)
        .then((resp) => {
          setRole("");
          callMessageSuccess();
          history.push({ pathname: "/eoffice/inbox/file" });
          props.handleClose();
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (favService.length > 0) {
      const favData = {
        groupName: favServiceDepName,
        roleName: favServiceObj[0].deptRole,
        userName: favService,
        fromRole: fromRole,
        displayDeptName: favServiceObj[0].deptDisplayName,
        displayRoleName: favServiceObj[0].deptRoleDisplayName,
      };
      props
        .sendFilesServiceNumber(rtiID, favData, val, props.pfileName, body)
        .then((resp) => {
          setRole("");
          callMessageSuccess();
          history.push({ pathname: "/eoffice/inbox/file" });
          props.handleClose();
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (favIntService.length > 0) {
      const intServiceNumberData = {
        groupName: favIntServiceDepName,
        roleName: favIntServiceObj[0].deptRole,
        userName: favIntService,
        fromRole: fromRole,
        displayDeptName: favIntServiceObj[0].deptDisplayName,
        displayRoleName: favIntServiceObj[0].deptRoleDisplayName,
      };
      props
        .sendFilesInternalServiceNumber(
          rtiID,
          intServiceNumberData,
          val,
          props.pfileName,
          body
        )
        .then((resp) => {
          setRole("");
          callMessageSuccess();
          history.push({ pathname: "/eoffice/inbox/file" });
          props.handleClose();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const approveRejectMessage = (msg) => {
    dispatch(setSnackbar(true, "success", msg));
  };

  const handleSendConfirmation = (value) => {
    setOpenConfirmation(false);
    setLoad(true);
    const rtiID = sessionStorage.getItem("rtiID");
    if (value != null) {
      props.PCFileClosuer(rtiID, value, props.pfileName).then((resp) => {
        if (value === "Approved") {
          approveRejectMessage("File has been approved successfully");
        } else if (value === "Rejected") {
          approveRejectMessage("File has been rejected ");
        }

        if (resp) {
          setLoad(false);
        }
        history.push({ pathname: "/eoffice/inbox/file" });
      });
    }
  };

  return (
    <div>
      {load && <Loading />}
      <DialogContent>
        {/* <AppBar position="static" color="default" style={{ padding: "5px" }} > */}
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Internal" {...a11yProps(0)} />
          <Tab label="External" {...a11yProps(1)} />
          <Tab label="Eyes Only" {...a11yProps(2)} />
        </Tabs>
        {/* </AppBar> */}
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <Grid container justify="center" style={{ hight: "500px" }}>
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 3rem",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%" }}>
                  <Autocomplete
                    options={intServiceList.map((option) => option)}
                    id="tags-outlined"
                    value={intService}
                    onChange={(event, newValue) => {
                      handleOnChangeInternalService(newValue);
                    }}
                    onInputChange={(event, newInputValue) => {
                      if (newInputValue.length >= 3) {
                        handleInputValueChangeInternalService(newInputValue);
                      }
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        style={{ width: "100%" }}
                        variant="outlined"
                        label={t("search_by_service_number")}
                        placeholder={t("enter_service_number")}
                      />
                    )}
                  />
                </FormControl>
                <Tooltip title={t("ADD TO FAVOURITE")}>
                  <IconButton
                    id="RTI_add_fav"
                    color="secondary"
                    disabled={addFavBlnDisable}
                    onClick={handleAddToFavourite}
                  >
                    <FavoriteIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 3rem",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%", marginTop: "1rem" }}>
                  <Autocomplete
                    options={intServiceFavouriteList.map((option) => option)}
                    id="tags-outlined"
                    value={favIntService}
                    onChange={(event, newValue) => {
                      handleOnChangeFavInternalService(newValue);
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={t("search_faviourite")}
                        placeholder={t("enter_service_number")}
                      />
                    )}
                  />
                </FormControl>
                <Tooltip
                  title={t("DELETE FAVOURITE")}
                  style={{ marginTop: "1rem" }}
                >
                  <IconButton
                    id="RTI_delete_fav"
                    color="secondary"
                    disabled={deleteFavBlnDisable}
                    onClick={handleDeleteFavourite}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <Grid container justify="center" style={{ hight: "500px" }}>
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 3rem",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%" }}>
                  <Autocomplete
                    options={sectionList.map((option) => option)}
                    value={section}
                    id="tags-outlined"
                    onChange={(event, newValue) => {
                      handleOnChange(newValue);
                    }}
                    onInputChange={(event, newInputValue) => {
                      if (newInputValue.length >= 3) {
                        handleInputValueChange(newInputValue);
                      }
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        style={{ width: "100%" }}
                        variant="outlined"
                        label={t("search_by_section")}
                        placeholder={t("enter_section")}
                      />
                    )}
                  />
                </FormControl>
                <Tooltip title={t("ADD TO FAVOURITE")}>
                  <IconButton
                    id="RTI_fav_btn"
                    color="secondary"
                    disabled={addFavBlnDisable}
                    onClick={handleAddToFavourite}
                  >
                    <FavoriteIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 3rem",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%", marginTop: "1rem" }}>
                  <Autocomplete
                    options={sectionFavouriteList.map((option) => option)}
                    id="tags-outlined"
                    value={favSection}
                    onChange={(event, newValue) => {
                      handleOnChangeFavSection(newValue);
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={t("search_faviourite")}
                        placeholder={t("enter_section")}
                      />
                    )}
                  />
                </FormControl>
                <Tooltip
                  title={t("DELETE FAVOURITE")}
                  style={{ marginTop: "1rem" }}
                >
                  <IconButton
                    id="RTI_fav_delete"
                    color="secondary"
                    disabled={deleteFavBlnDisable}
                    onClick={handleDeleteFavourite}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <Grid container justify="center" style={{ hight: "500px" }}>
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 3rem",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%" }}>
                  <Autocomplete
                    options={serviceList.map((option) => option)}
                    id="tags-outlined"
                    value={service}
                    onChange={(event, newValue) => {
                      handleOnChangeService(newValue);
                    }}
                    onInputChange={(event, newInputValue) => {
                      if (newInputValue.length >= 3) {
                        handleInputValueChangeService(newInputValue);
                      }
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={t("search_by_service_number")}
                        placeholder={t("enter_service_number")}
                      />
                    )}
                  />
                </FormControl>
                <Tooltip title={t("ADD TO FAVOURITE")}>
                  <IconButton
                    id="fav_RTI_btn"
                    color="secondary"
                    disabled={addFavBlnDisable}
                    onClick={handleAddToFavourite}
                  >
                    <FavoriteIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 3rem",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%", marginTop: "1rem" }}>
                  <Autocomplete
                    options={serviceFavouriteList.map((option) => option)}
                    id="tags-outlined"
                    value={favService}
                    onChange={(event, newValue) => {
                      handleOnChangeFavService(newValue);
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={t("search_faviourite")}
                        placeholder={t("enter_service_number")}
                      />
                    )}
                  />
                </FormControl>
                <Tooltip
                  title={t("DELETE FAVOURITE")}
                  style={{ marginTop: "1rem" }}
                >
                  <IconButton
                    id="delete_RTIfav_btn"
                    color="secondary"
                    disabled={deleteFavBlnDisable}
                    onClick={handleDeleteFavourite}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </TabPanel>
        </SwipeableViews>
      </DialogContent>
      <DialogActions>
        <Button
          id="RTI_end_task"
          variant="contained"
          color="secondary"
          style={{
            display: `${sessionRole === hrmRole ? "" : "none"}`,
          }}
          onClick={() => setOpenConfirmation(true)}
          endIcon={<MailOutlineIcon />}
        >
          {t("End Task")}
        </Button>

        <Button
          id="RTI_send_to_next_level"
          variant="contained"
          color="secondary"
          style={{
            display: `${hasCoverNote === "true" ? "" : "none"}`,
          }}
          disabled={blnDisable}
          // onClick={() => handleSend(true)}
          onClick={() => setSelectFileDialog(true)}
          endIcon={<MailOutlineIcon />}
        >
          {t("Send to Next Level")}
        </Button>
        <Button
          id="RTI_send_next_level"
          variant="contained"
          color="primary"
          onClick={() => handleSend(false)}
          disabled={blnDisable}
          endIcon={<SendIcon />}
        >
          {t("send")}
        </Button>
      </DialogActions>
      <Dialog
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        // PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ minWidth: "300px" }}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {t("confirmation")}?
          <IconButton
            id="RTI_close_confirmation"
            aria-label="close"
            onClick={() => setOpenConfirmation(false)}
            color="primary"
            style={{ float: "right", padding: "5px !important" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="alert-dialog-description"
            style={{ color: props.theme ? "#fff" : "black" }}
          >
            {t("confirmation_text")} <br />
            <p></p> {t("confirmation_text_2")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <FormControl component="fieldset">
            <RadioGroup row>
              <FormControlLabel
                control={<Radio color="primary" />}
                label={t("rejectConfirmation")}
                value="Rejected"
                onClick={() => handleSendConfirmation("Rejected")}
              />
              <FormControlLabel
                control={<Radio color="primary" />}
                label={t("approveConfirmation")}
                value="Approved"
                onClick={() => handleSendConfirmation("Approved")}
              />
              <FormControlLabel
                control={<Radio color="primary" />}
                label={t("SEND TO")}
                disabled={blnDisable}
                value="Send"
                onClick={() => handleSend(false)}
              />
            </RadioGroup>
          </FormControl>
        </DialogActions>
      </Dialog>

      <Dialog
        open={selectFileDialog}
        onClose={() => setSelectFileDialog(false)}
        // PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ minWidth: "300px" }}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {t("Select File")}
          <IconButton
            id="RTI_select_file"
            aria-label="close"
            onClick={() => setSelectFileDialog(false)}
            color="primary"
            style={{ float: "right", padding: "5px !important" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <SelectFile enclosureArr={props.enclosureArr} handleSend={handleSend} />
      </Dialog>
    </div>
  );
};

function mapStateToProps(state) {
  return { props: state.props, theme: state.theme };
}

export default connect(mapStateToProps, {
  sendFilesInternalServiceNumber,
  getInternalServiceNumber,
  getGroupList,
  getSection,
  getServiceNumber,
  sendFilesSection,
  sendFilesServiceNumber,
  PCFileClosuer,
  addToFavourite,
  fetchFavouriteList,
  deleteFavourite,
})(HrmDialog);
