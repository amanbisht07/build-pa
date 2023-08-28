import {
  DialogActions,
  DialogContent,
  Tab,
  Tabs,
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
import React, { useCallback, useEffect, useState } from "react";
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
  rtisendFiles,
  sendInternalCorespondence,
  sendEyesonlyCorespondence,
  sendExternalCorespondence,
  PCFileClosuer,
  addToFavourite,
  fetchFavouriteList,
  deleteFavourite,
  sendbackRti,
  PCFileClosuerRti,
} from "../../camunda_redux/redux/action";
import snackbar, { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { connect, useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import { Loading } from "./therme-source/material-ui/loading";
import { debounce } from "utils";

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

const CorrHrmDialog = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const hrmRole = Cookies.get("HrmRole");
  let hasCoverNote = Cookies.get("hasCoverNote");
  let creater = Cookies.get("creater");
  let Rtistatus = Cookies.get("status");
  const sessionRole = sessionStorage.getItem("role");
  const inboxid = sessionStorage.getItem("InboxID");

  const [role, setRole] = useState("");
  const [value, setValue] = useState(0);

  // Send Internal
  const [intService, setIntService] = useState([]);
  const [intServiceList, setIntServiceList] = useState([]);
  const [intServiceObj, setIntServiceObj] = useState([]);
  const [favIntService, setFavIntService] = useState("");
  const [intServiceFavouriteList, setIntServiceFavouriteList] = useState([]);
  const [favIntServiceDepName, setFavIntServiceDepName] = useState("");
  const [favIntServiceObj, setFavIntServicObj] = useState([]);

  // Send External
  const [section, setSection] = useState([]);
  const [sectionCopy, setSectionCopy] = useState([]);
  const [sectionInfo, setSectionInfo] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [secCopyList, setSecCopyList] = useState([]);
  const [secInfoList, setSecInfoList] = useState([]);
  const [sectionObj, setSectionObj] = useState([]);
  const [favSection, setFavSection] = useState("");
  const [sectionFavouriteList, setSectionFavouriteList] = useState([]);
  const [favSectionObj, setFavSectionObj] = useState([]);

  // Send Eyes Only
  const [service, setService] = useState([]);
  const [serviceCopy, setServiceCopy] = useState([]);
  const [serviceInfo, setServiceInfo] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [serCopyList, setSerCopyList] = useState([]);
  const [serInfoList, setSerInfoList] = useState([]);
  const [serviceObj, setServiceObj] = useState([]);
  const [favService, setFavService] = useState("");
  const [serviceFavouriteList, setServiceFavouriteList] = useState([]);
  const [favServiceObj, setFavServiceObj] = useState([]);
  const [favServiceDepName, setFavServiceDepName] = useState("");

  const [blnDisable, setBlnDisable] = useState(true);
  const [blnNextDisable, setBlnNextDisable] = useState(true);
  const [sameDep, setSameDep] = useState(true);
  const [addFavBlnDisable, setAddFavBlnDisable] = useState(true);
  const [deleteFavBlnDisable, setDeleteFavBlnDisable] = useState(true);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  // const [openCoverLetterDialog, setOpenCoverLetterDialog] = useState(false);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectFileDialog, setSelectFileDialog] = useState(false);
  const [paFlowDialog, setPaFlowDialog] = useState(false);
  // const username = sessionStorage.getItem("username");
  const username = localStorage.getItem("username");
  const displayUserName = sessionStorage.getItem("displayUserName");
  const FileID = Cookies.get("partcaseId");
  let isRegister = Cookies.get("isRegister");
  let status = Cookies.get("status");
  // let corrDocId = Cookies.get("props.corrDocId");
  const [list, setList] = useState([]);

  const { corrId, corrDocId } = props;
  const dispatch = useDispatch();

  const callMessageOut = (msg) => {
    dispatch(setSnackbar(true, "error", msg));
  };

  const callMessageSuccess = (msg) => {
    dispatch(setSnackbar(true, "success", t(msg)));
  };

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSection([]);
    setIntService([]);
    setService([]);
    setSectionCopy([]);
    setSectionInfo([]);
    setServiceCopy([]);
    setServiceInfo([]);
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
      service.length ||
      section.length ||
      intService.length ||
      favSection.length ||
      favService.length ||
      favIntService.length
    ) {
      setBlnDisable(false);
    } else {
      setBlnDisable(true);
    }

    if (section || favSection) {
      if (sameDep) {
        setBlnNextDisable(true);
      } else {
        setBlnNextDisable(false);
      }
    } else {
      setBlnNextDisable(true);
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
          setSection([]),
          setIntService([]),
          setFavService(""),
          setFavSection(""),
          setFavIntService("")
        );
      case "section":
        return (
          setService([]),
          setIntService([]),
          setFavService(""),
          setFavSection(""),
          setFavIntService("")
        );
      case "internal_service":
        return (
          setSection([]),
          setService([]),
          setFavService(""),
          setFavSection(""),
          setFavIntService("")
        );
      case "fav_service":
        return (
          setSection([]),
          setIntService([]),
          setService([]),
          setFavSection(""),
          setFavIntService("")
        );
      case "fav_section":
        return (
          setSection([]),
          setIntService([]),
          setFavService(""),
          setService([]),
          setFavIntService("")
        );
      case "fav_internal_service":
        return (
          setSection([]),
          setIntService([]),
          setFavService(""),
          setFavSection(""),
          setService([])
        );
      default:
        break;
    }
  };

  const handleInputValueChangeInternalService = async (newValue) => {
    if (newValue && newValue.length >= 3) {
      const dept = sessionStorage.getItem("department");
      await props.getInternalServiceNumber(newValue, dept).then((resp) => {
        let tmpArray = [];
        setIntServiceObj(resp.data);
        setIntServiceList(resp.data);
      });
      setSectionList([]);
      setServiceList([]);
    }
  };

  const handleOnChangeInternalService = async (newValue) => {
    // let roleData = !isNullOrUndefined(newValue) && newValue.split(" | ")[1];
    // setRole(roleData);
    // let data =
    //   !isNullOrUndefined(newValue) &&
    //   newValue.substr(0, newValue.indexOf(" |"));
    setIntService(newValue);
    newValue && handleClearList("internal_service");
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

  const handleInputValueChange = async (newValue, type) => {
    if (newValue && newValue.length >= 3) {
      let formData = new FormData();
      formData.append("sau", newValue);
      await props.getGroupList(formData).then((resp) => {
        switch (type) {
          case "section-to":
            setSectionObj(resp.data);
            setSectionList(resp.data);
            break;
          case "section-copy":
            setSecCopyList(resp.data);
            break;
          case "section-info":
            setSecInfoList(resp.data);
            break;
        }
      });
      setServiceList([]);
      setIntServiceList([]);
    }
  };

  const handleOnChange = (newValue, type) => {
    let tmpArr = newValue.map((item, i) => {
      return {
        ...item,
        branch: item.branch[0],
      };
    });
    switch (type) {
      case "section-to":
        setSection(tmpArr);
        break;
      case "section-copy":
        setSectionCopy(tmpArr);
        break;
      case "section-info":
        setSectionInfo(tmpArr);
        break;
    }
    newValue && newValue.length > 0 && handleClearList("section");
  };

  const handleOnChangeFavSection = async (value) => {
    setFavSection(value);
    handleClearList("fav_section");
    let formData = new FormData();
    formData.append("sau", value);
    await props.getGroupList(formData).then((resp) => {
      try {
        setFavSectionObj([...favSectionObj, resp.data]);
        // let data =
        //   resp.data && resp.data.find((ele) => ele.deptDisplayName === value);
        // setRole(data.deptCoordRole);
        let tmpArray = [];
        for (var i = 0; i < resp.data.length; i++) {
          tmpArray.push(`${resp.data[i].deptDisplayName}`);
        }
      } catch (e) {
        callMessageOut(e.message);
      }
    });
    setServiceFavouriteList([]);
  };

  const handleInputValueChangeService = async (newValue, type) => {
    if (newValue && newValue.length >= 3) {
      await props.getServiceNumber(newValue).then((resp) => {
        console.log("rest", resp.data);
        switch (type) {
          case "service-to":
            setServiceObj(resp.data);
            setServiceList(resp.data);
            break;
          case "service-copy":
            setSerCopyList(resp.data);
            break;
          case "service-info":
            setSerInfoList(resp.data);
            break;
        }
      });
      setSectionList([]);
      setIntServiceList([]);
    }
  };

  const handleOnChangeService = (newValue, type) => {
    switch (type) {
      case "service-to":
        setService(newValue);
        break;
      case "service-copy":
        setServiceCopy(newValue);
        break;
      case "service-info":
        setServiceInfo(newValue);
        break;
    }
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
          setSnackbar(true, "success", "Add to favourite list successfully")
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
          setSnackbar(true, "success", "Delete to favourite list successfully")
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const backRti = () => {
    setLoading(true);
    props
      .sendbackRti(FileID, username)
      .then((resp) => {
        // setLoading(false);
        // history.push({ pathname: "/eoffice/inbox/file" });
        // dispatch(setSnackbar(true, "success", `${t("file_has_been_sended_successfully")}`));

        try {
          if (resp.error) {
            setLoading(false);
            console.log(resp.error);
            dispatch(setSnackbar(true, "error", resp.error));
            return;
          } else {
            console.log("res", resp);
            setLoading(false);

            dispatch(
              setSnackbar(
                true,
                "success",
                `${t("file_has_been_sended_successfully")}`
              )
            );
            return;
          }
        } catch (error) {
          dispatch(setSnackbar(true, "error", error.message));
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSend = (val) => {
    setLoading(true);
    const role = sessionStorage.getItem("role");
    let group = serviceObj.filter(
      (data) => data.deptRole !== role || data.deptRole === role
    );
    let intGroup = intServiceObj.find(
      (data) => data.deptName === data.deptName
    );
    let sectionGroup = sectionObj.filter(
      (data) => data.deptDisplayName === section[0]
    );
    console.log({
      intService,
      service,
      section,
    });
    const partcaseID = sessionStorage.getItem("partcaseID");
    const inboxId = sessionStorage.getItem("InboxID");
    const fromRole = sessionStorage.getItem("role");

    if (service.length > 0) {
      props
        .sendEyesonlyCorespondence(
          props.fileId,
          service,
          serviceCopy,
          serviceInfo,
          val,
          props.pfileName
        )
        .then((resp) => {
          console.log(resp);
          callMessageSuccess("corr_sent_successfully");
          props.handleStatus(props.fileId);
          props.handleCloseEvent();
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } else if (section.length > 0) {
      props
        .sendExternalCorespondence(
          props.fileId,
          section,
          sectionCopy,
          sectionInfo,
          sessionRole,
          username,
          val
        )
        .then((resp) => {
          console.log("response == ", resp);
          try {
            if (resp.error) {
              callMessageOut(resp.error);
            } else {
              console.log(resp);
              callMessageSuccess("corr_sent_successfully");
              props.handleStatus(props.fileId);
              props.handleCloseEvent();
              setLoading(false);
            }
          } catch (error) {
            console.log("exterr", console);
            callMessageOut(error.message);
          }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } else if (intService.length > 0) {
      props
        .sendInternalCorespondence(
          props.fileId,
          intService,
          val,
          props.pfileName
        )
        .then((resp) => {
          console.log(resp);
          callMessageSuccess("corr_sent_successfully");
          props.handleStatus(props.fileId);
          props.handleCloseEvent();
          setLoading(false);
        }).catch,
        (error) => {
          console.log(error);
          setLoading(false);
        };
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
        .sendEyesonlyCorespondence(inboxId, favData, val, props.pfileName, body)
        .then((resp) => {
          setRole("");
          callMessageSuccess();

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
        .sendInternalCorespondence(
          //   props.fileId,
          corrDocId,
          intServiceNumberData,
          val,
          props.pfileName
          // body
        )
        .then((resp) => {
          setRole("");
          callMessageSuccess();

          props.handleClose();
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const state = useSelector((state) => state.rtiReducer);

  const approveRejectMessage = (msg) => {
    dispatch(setSnackbar(true, "success", msg));
  };

  const handleSendConfirmation = (value) => {
    setLoad(true);
    setOpenConfirmation(false);

    const inboxId = sessionStorage.getItem("InboxID");
    if (value != null) {
      setLoad(true);
      props.PCFileClosuerRti(FileID, value).then((resp) => {
        // setLoad(false)
        // dispatch(setSnackbar(true, "success", `${t("file_has_been_merged_successfully")}`));

        // history.push({ pathname: "/eoffice/inbox/file" });
        try {
          if (resp.Error) {
            setLoad(false);
            console.log(resp);
            dispatch(setSnackbar(true, "error", resp.Error));
          } else {
            console.log("res", resp);
            setLoad(false);

            dispatch(
              setSnackbar(
                true,
                "success",
                `${t("file_has_been_merged_successfully")}`
              )
            );
          }
        } catch (error) {
          dispatch(setSnackbar(true, "error", error.message));
        }
      });
    }
  };

  const handleApprove = () => {
    if (props.serviceLetterId) {
      setSelectFileDialog(true);
    } else {
      handleSendConfirmation("Approved");
    }
  };

  // Optimized call
  const optimizedInternalService = useCallback(
    debounce(handleInputValueChangeInternalService),
    []
  );

  const optimizedSection = useCallback(debounce(handleInputValueChange), []);

  const optimizedService = useCallback(
    debounce(handleInputValueChangeService),
    []
  );

  const handleSuccess = () => {
    dispatch(
      setSnackbar(true, "success", t("correspondence_sent_successfully!"))
    );
    setLoading(false);
    props.handleCloseEvent(false);
    props.handleStatus(props.fileId);
    let trigger = false;
    setTimeout(() => {
      trigger = true;
      props.changingTableState(trigger, "CHANGE_PA_FILE");
      props.changingTableStatePA(trigger, "CHANGE_PA_APPLICATION");
      props.changeTableStateDraft(trigger, "CHANGE_PA_DRAFT");
    }, 0);
  };

  return (
    <>
      {loading && <Loading />}
      <DialogContent dividers>
        {/* <AppBar position="static" color="default" style={{ padding: "5px" }} > */}
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label={t("internal")} {...a11yProps(0)} />
          <Tab
            // disabled={isRegister || status == "Returned" || sessionRole !== creater}
            label={t("external")}
            {...a11yProps(1)}
          />
          {/* {!isRegister && <Tab label={t("external")} {...a11yProps(1)} />} */}
          <Tab label={t("eyes_only")} {...a11yProps(2)} />
        </Tabs>
        {/* </AppBar> */}
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <Grid container justifyContent="center" style={{ hight: "500px" }}>
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%" }}>
                  <Autocomplete
                    freeSolo
                    multiple
                    options={intServiceList}
                    getOptionLabel={(option) => {
                      return typeof option === "object"
                        ? `${option.deptUsername} | ${option.deptRole}`
                        : "";
                    }}
                    id="tags-outlined"
                    value={intService}
                    onChange={(event, newValue) => {
                      handleOnChangeInternalService(newValue);
                    }}
                    onInputChange={(event, newInputValue) => {
                      optimizedInternalService(newInputValue);
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
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={value} index={1} dir={theme.direction}>
            <Grid container justifyContent="center" style={{ hight: "500px" }}>
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%" }}>
                  <Autocomplete
                    freeSolo
                    multiple
                    id="tags-outlined"
                    options={sectionList}
                    getOptionLabel={(option) => {
                      return typeof option === "object"
                        ? `${option.deptDisplayName} | ${option.deptCoordRole}`
                        : "";
                    }}
                    value={section}
                    onChange={(event, newValue) => {
                      handleOnChange(newValue, "section-to");
                    }}
                    onInputChange={(event, newInputValue) => {
                      optimizedSection(newInputValue, "section-to");
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={t("search_by_section")}
                        placeholder={t("enter_section")}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%", marginTop: "1rem" }}>
                  <Autocomplete
                    freeSolo
                    multiple
                    id="tags-outlined"
                    options={secCopyList}
                    getOptionLabel={(option) => {
                      return typeof option === "object"
                        ? `${option.deptDisplayName} | ${option.deptCoordRole}`
                        : "";
                    }}
                    value={sectionCopy}
                    onChange={(event, newValue) => {
                      handleOnChange(newValue, "section-copy");
                    }}
                    onInputChange={(event, newInputValue) => {
                      optimizedSection(newInputValue, "section-copy");
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={t("search_by_section")}
                        placeholder={t("enter_section")}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%", marginTop: "1rem" }}>
                  <Autocomplete
                    freeSolo
                    multiple
                    id="tags-outlined"
                    options={secInfoList}
                    getOptionLabel={(option) => {
                      return typeof option === "object"
                        ? `${option.deptDisplayName} | ${option.deptCoordRole}`
                        : "";
                    }}
                    value={sectionInfo}
                    onChange={(event, newValue) => {
                      handleOnChange(newValue, "section-info");
                    }}
                    onInputChange={(event, newInputValue) => {
                      optimizedSection(newInputValue, "section-info");
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={t("search_by_section")}
                        placeholder={t("enter_section")}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={value} index={2} dir={theme.direction}>
            <Grid container justifyContent="center" style={{ hight: "500px" }}>
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%" }}>
                  <Autocomplete
                    freeSolo
                    multiple
                    options={serviceList}
                    getOptionLabel={(option) => {
                      return typeof option === "object"
                        ? `${option.deptUsername} | ${option.deptRole}`
                        : "";
                    }}
                    id="tags-outlined"
                    value={service}
                    onChange={(event, newValue) => {
                      handleOnChangeService(newValue, "service-to");
                    }}
                    onInputChange={(event, newInputValue) => {
                      optimizedService(newInputValue, "service-to");
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
              </Grid>
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%", marginTop: "1rem" }}>
                  <Autocomplete
                    freeSolo
                    multiple
                    options={serCopyList}
                    getOptionLabel={(option) => {
                      return typeof option === "object"
                        ? `${option.deptUsername} | ${option.deptRole}`
                        : "";
                    }}
                    id="tags-outlined"
                    value={serviceCopy}
                    onChange={(event, newValue) => {
                      handleOnChangeService(newValue, "service-copy");
                    }}
                    onInputChange={(event, newInputValue) => {
                      optimizedService(newInputValue, "service-copy");
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
              </Grid>
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%", marginTop: "1rem" }}>
                  <Autocomplete
                    freeSolo
                    multiple
                    options={serInfoList}
                    getOptionLabel={(option) => {
                      return typeof option === "object"
                        ? `${option.deptUsername} | ${option.deptRole}`
                        : "";
                    }}
                    id="tags-outlined"
                    value={serviceInfo}
                    onChange={(event, newValue) => {
                      handleOnChangeService(newValue, "service-info");
                    }}
                    onInputChange={(event, newInputValue) => {
                      optimizedService(newInputValue, "service-info");
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
              </Grid>
            </Grid>
          </TabPanel>
        </SwipeableViews>
      </DialogContent>
      <DialogActions>
        <Button
          id="RTI_end_task_button"
          variant="contained"
          color="secondary"
          style={{
            display: `${
              sessionRole === creater && Rtistatus === "Returned" ? "" : "none"
            }`,
          }}
          onClick={() => setOpenConfirmation(true)}
          // onClick={handleSendConfirmation}
          endIcon={<MailOutlineIcon />}
        >
          {t("end_task")}
        </Button>

        <Button
          id="backRTI_button"
          variant="contained"
          color="secondary"
          style={{
            display: `${
              sessionRole === creater && Rtistatus === "Returned" ? "" : "none"
            }`,
            // display: `${ret === "true" ? "" : "none"}`,
          }}
          // disabled={blnNextDisable}
          // onClick={() => handleSend(true)}
          // onClick={() => setSelectFileDialog(true)}
          onClick={backRti}
          endIcon={<MailOutlineIcon />}
        >
          {t("SEND TO DEPT")}
        </Button>
        <Button
          id="RTI_sendFile_button"
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
            id="RTI_openConfirmation_close_button"
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
            {props.status === "Approved" || props.status === "Rejected" ? (
              <p>
                Update status to applicant <br />
                status = <strong>{props.status}</strong>
              </p>
            ) : (
              <p>
                {t("confirmation_text")} <br />
                {t("confirmation_text_2")}
              </p>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <FormControl component="fieldset">
            {/* {props.status !== "Approved" ||
                (props.status !== "Rejected" && ( */}
            <RadioGroup row>
              <FormControlLabel
                control={<Radio color="primary" />}
                label={t("NO")}
                value="NO"
                onClick={() => setOpenConfirmation(false)}
              />
              <FormControlLabel
                control={<Radio color="primary" />}
                label={t("YES")}
                value="YES"
                onClick={handleSendConfirmation}
              />

              {/* <FormControlLabel
                  control={<Radio color="primary" />}
                  label={t("SEND TO")}
                  disabled={blnDisable}
                  value="Send"
                  onClick={() => handleSend(false)}
                /> */}
            </RadioGroup>
            {/* ))} */}
          </FormControl>
        </DialogActions>
      </Dialog>
    </>
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
  rtisendFiles,
  PCFileClosuer,
  addToFavourite,
  fetchFavouriteList,
  deleteFavourite,
  sendbackRti,
  PCFileClosuerRti,
  sendInternalCorespondence,
  sendEyesonlyCorespondence,
  sendExternalCorespondence,
})(CorrHrmDialog);
