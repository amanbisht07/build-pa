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
import "./Hrm.css";
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
import { changingTableStateInbox } from "../../../camunda_redux/redux/action/apiTriggers";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { connect, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import history from "../../../../history";
import { Loading } from "../therme-source/material-ui/loading";
import SelectFile from "./SelectFile";
import PaFlowDialog from "./PaFlowDialof";
import {
  Add,
  Done,
  FavoriteBorder,
  RateReviewOutlined,
} from "@material-ui/icons";
import Axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { debounce } from "utils";
import { useCallback } from "react";

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
  remark_title: {
    display: "flex",
    justifyContent: "space-between",
    gap: "2rem",
    alignItems: "center",
  },
}));

const HrmDialog = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();

  const dispatch = useDispatch();

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
  const [blnNextDisable, setBlnNextDisable] = useState(true);
  const [sameDep, setSameDep] = useState(true);
  const [addFavBlnDisable, setAddFavBlnDisable] = useState(true);
  const [deleteFavBlnDisable, setDeleteFavBlnDisable] = useState(true);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectFileDialog, setSelectFileDialog] = useState(false);
  const [paFlowDialog, setPaFlowDialog] = useState(false);
  const [alreadyFav, setAlreadyFav] = useState(false);

  const [addRemark, setaddRemark] = useState(false); // toggle add remark dialog
  const [sendToDep, setsendToDep] = useState(""); // to know whether sending file to same dept user
  const [remark, setremark] = useState(""); // remark message to be send
  const [sentCount, setsentCount] = useState(0); // to know whether all files has been sent or not

  const initialValue = {
    remark: "",
  };

  const hrmRole = Cookies.get("HrmRole");
  const hrmDepartmet = Cookies.get("HrmDepartment");
  let hasCoverNote = Cookies.get("hasCoverNote");
  const sessionRole = sessionStorage.getItem("role");
  const inboxid = sessionStorage.getItem("InboxID");
  const Dept = sessionStorage.getItem("department");
  const username = localStorage.getItem("username");

  const validationSchema = Yup.object({
    remark: Yup.string(t("enter_a_remark"))
      .trim()
      .required(t("must_enter_a_valid_remark")),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    // onSubmit: handleAddRemark,
  });

  const callMessageOut = (msg) => {
    setLoading(false);
    dispatch(setSnackbar(true, "error", msg));
  };

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
    formik.setFieldValue("remark", "");
    setsendToDep("");
    setSection("");
    setIntService("");
    setService("");
    setFavSection("");
    setFavIntService("");
    setFavService("");
    setAlreadyFav(false);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
    formik.setFieldValue("remark", "");
    setsendToDep("");
  };

  const fetchFavourite = async () => {
    let type = value == 0 ? "internalService" : value == 1 ? "section" : "service"
    let role = sessionRole;
    await props
      .fetchFavouriteList({ role, type })
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          }
          else {
            const { internalServiceFavourite, sectionFavourite, serviceFavourite } =
              resp.favourite;
            setSectionFavouriteList(sectionFavourite);
            setServiceFavouriteList(serviceFavourite);
            setIntServiceFavouriteList(internalServiceFavourite);
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      })
      .catch((err) => {
        console.log(err);
        callMessageOut(err.message);
      });
  };

  useEffect(() => {
    fetchFavourite();
    if (value == 0) handleInputValueChangeInternalService()
  }, [value]);

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

  useEffect(() => {
    const { blnValueInbox } = props.subscribe;
    if (sentCount === props?.checkedData?.length) {
      props.changingTableStateInbox(!blnValueInbox, "CHANGE_INBOX");
    }
    else if (sentCount == "trigger" && props?.checkedData?.length) {
      props.changingTableStateInbox(true, "CHANGE_INBOX");
    }
  }, [sentCount, props?.checkedData]);

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
    // if (newValue && newValue.length >= 3) {
    //   const dept = sessionStorage.getItem("department");
    //   await props.getInternalServiceNumber(newValue, dept).then((resp) => {
    //     try {
    //       if (resp.error) {
    //         callMessageOut(resp.error)
    //       }
    //       else {
    //         let tmpArray = [];
    //         setIntServiceObj(resp.data);
    //         // for (var i = 0; i < resp.data.length; i++) {
    //         //   tmpArray.push(
    //         //     `${resp.data[i].deptUsername} | ${resp.data[i].deptDisplayUsername} | ${resp.data[i].deptRole?.displayRoleName}`
    //         //   );
    //         // }
    //         setIntServiceList(resp.data);
    //       }
    //     } catch (err) {
    //       callMessageOut(err.message);
    //     }
    //   }).catch((err) => {
    //     callMessageOut(err.message);
    //   });
    //   ;
    //   setSectionList([]);
    //   setServiceList([]);
    // }
    const dept = sessionStorage.getItem("department");
    await props.getInternalServiceNumber("", dept).then((resp) => {
      try {
        if (resp.error) {
          callMessageOut(resp.error)
        }
        else {
          let tmpArray = [];
          setIntServiceObj(resp.data);
          // for (var i = 0; i < resp.data.length; i++) {
          //   tmpArray.push(
          //     `${resp.data[i].deptUsername} | ${resp.data[i].deptDisplayUsername} | ${resp.data[i].deptRole?.displayRoleName}`
          //   );
          // }
          setIntServiceList(resp.data);
        }
      } catch (err) {
        callMessageOut(err.message);
      }
    }).catch((err) => {
      callMessageOut(err.message);
    });
    ;
    setSectionList([]);
    setServiceList([]);
  };

  const handleOnChangeInternalService = async (newValue) => {
    if (!isNullOrUndefined(newValue)) {
      let roleData = newValue?.deptRole?.roleName;
      let deptName = newValue?.deptName;
      setRole(roleData);
      setIntService(newValue);
      setsendToDep(deptName);
      handleClearList("internal_service");
      let bool = intServiceFavouriteList.some(
        (item) => item?.deptUsername === newValue?.deptUsername
      );
      setAlreadyFav(bool);
    } else {
      setRole("");
      setIntService("");
      setsendToDep("");
      setAlreadyFav(false);
    }
  };

  const handleOnChangeFavInternalService = async (newValue) => {
    if (!isNullOrUndefined(newValue)) {
      let roleData = newValue?.deptRole?.roleName;
      let deptName = newValue?.deptName;
      setFavIntService(newValue);
      setRole(roleData);
      handleClearList("fav_internal_service");
      setsendToDep(deptName);
      setAlreadyFav(false);
    } else {
      setAlreadyFav(false);
      setRole("");
      setsendToDep("");
      setFavIntService("");
    }
    // await props
    //   .getInternalServiceNumber(value, dept)
    //   .then((resp) => {
    //     setFavIntServicObj(resp.data);
    //     const data =
    //       resp.data && resp.data.find((ele) => ele.deptUsername === value);
    //     setFavIntServiceDepName(data.deptName);
    //     setRole(data.deptCoordRole);
    //   })
    //   .catch((err) => {
    //     callMessageOut(err);
    //   });
  };

  const handleInputValueChange = async (newValue) => {
    // const dept = sessionStorage.getItem("department");
    if (newValue && newValue.length >= 3) {
      let formData = new FormData();
      formData.append("sau", newValue);
      await props.getGroupList(formData).then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          } else {
            let tmpArray = [];
            // for (var i = 0; i < resp.data.length; i++) {
            //   // if(resp.data[i].deptName !== dept){
            //   tmpArray.push(
            //     `${resp.data[i].deptDisplayName} | ${resp.data[i].deptCoordRole} | ${resp.data[i].deptName}`
            //   );
            //   // }
            // }
            setSectionList(resp.data);
            setSectionObj(resp.data);
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      }).catch((err) => {
        callMessageOut(err.message);
      });
      ;
      setServiceList([]);
      setIntServiceList([]);
    }
  };

  const handleOnChange = (newValue) => {
    if (!isNullOrUndefined(newValue)) {
      let roleData = newValue?.deptCoordRole;
      let deptName = newValue?.deptName;
      let val = props.departmentList?.some(
        (item) => item === newValue?.deptName
      );
      setSameDep(val);
      setSection(newValue);
      setRole(roleData);
      handleClearList("section");
      setsendToDep(deptName);
      let bool = sectionFavouriteList.some(
        (item) => item?.deptName === newValue?.deptName
      );
      setAlreadyFav(bool);
    } else {
      setAlreadyFav(false);
      setRole("");
      setsendToDep("");
      setSection("");
      setSameDep(true);
    }
  };

  const handleOnChangeFavSection = async (newValue) => {
    // await props
    //   .getSection(value)
    //   .then((resp) => {
    //     setFavSectionObj(resp.data);
    //     console.log(resp.data);
    //     let data = resp.data && resp.data.find((ele) => ele.deptName === value);
    //     setRole(data.deptCoordRole);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    if (!isNullOrUndefined(newValue)) {
      let roleData = newValue?.deptCoordRole;
      let deptName = newValue?.deptName;
      let val = props.departmentList?.some(
        (item) => item === newValue?.deptName
      );
      setSameDep(val);
      setFavSection(newValue);
      setRole(roleData);
      handleClearList("fav_section");
      setsendToDep(deptName);
      setAlreadyFav(false);
    } else {
      setAlreadyFav(false);
      setRole("");
      setsendToDep("");
      setFavSection("");
      setSameDep(true);
    }
  };

  const handleDisableRemark = () => {
    if (value === 0) {
      return false;
    } else if (value === 1 && sendToDep !== Dept) {
      return true;
    } else if (value === 2 && sendToDep !== Dept) {
      return true;
    } else if (sendToDep === Dept) {
      return false;
    }
  };

  const handleInputValueChangeService = async (newValue) => {
    if (newValue && newValue.length >= 3) {
      await props.getServiceNumber(newValue).then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          }
          else {
            let tmpArray = [];
            const response = resp.data;
            setServiceObj(response);
            // for (var i = 0; i < resp.data.length; i++) {
            //   tmpArray.push(
            //     `${resp.data[i].deptUsername} | ${resp.data[i].deptRole?.displayRoleName}`
            //   );
            // }
            setServiceList(response);
          }
        } catch (err) {
          callMessageOut(err.message);
        }
      }).catch((err) => {
        callMessageOut(err.message);
      });
      ;
      setSectionList([]);
      setIntServiceList([]);
    }
  };

  const handleOnChangeService = (newValue) => {
    if (!isNullOrUndefined(newValue)) {
      let roleData = newValue.deptRole?.roleName;
      let deptName = newValue?.deptName;
      setRole(roleData);
      setService(newValue);
      setsendToDep(deptName);
      handleClearList("service");
      let bool = serviceFavouriteList.some(
        (item) => item.deptUsername === newValue?.deptUsername
      );
      setAlreadyFav(bool);
    } else {
      setRole("");
      setService("");
      setsendToDep("");
      setAlreadyFav(false);
    }
  };

  const handleOnChangeFavService = async (newValue) => {
    if (!isNullOrUndefined(newValue)) {
      let roleData = newValue?.deptRole?.roleName;
      let deptName = newValue?.deptName;
      setAlreadyFav(false);
      setFavService(newValue);
      setRole(roleData);
      setsendToDep(deptName);
      handleClearList("fav_service");
    } else {
      setAlreadyFav(false);
      setRole("");
      setsendToDep("");
      setFavService("");
    }
    // await props
    //   .getServiceNumber(value)
    //   .then((resp) => {
    //     setFavServiceObj(resp.data);
    //     let data =
    //       resp.data && resp.data.find((ele) => ele.deptUsername === value);
    //     setFavServiceDepName(data.deptName);
    //     setRole(data.deptCoordRole);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  const handleAddToFavourite = async () => {
    setLoading(true);
    let role = sessionRole;
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
      .addToFavourite(data.id, { role }, type)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          } else {
            setAlreadyFav(true);
            fetchFavourite();
            setLoading(false);
            dispatch(
              setSnackbar(true, "success", "Add to favourite list successfully")
            );
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteFavourite = () => {
    setLoading(true);
    let role = sessionRole;
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
      .deleteFavourite(data.id, { role }, type)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          } else {
            fetchFavourite();
            setFavSection("");
            setFavService("");
            setFavIntService("");
            setLoading(false);
            dispatch(
              setSnackbar(
                true,
                "success",
                "Delete to favourite list successfully"
              )
            );
          }
        } catch (error) {
          callMessageOut(resp.error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSend = (val, flagNumber, isReturn, message) => {
    setLoading(true);
    const inboxId = sessionStorage.getItem("InboxID");
    // const inboxids = JSON.parse(sessionStorage.getItem("InboxIDS"));
    const inboxids = props?.checkedData;
    if (inboxids) {
      inboxids.forEach((inbox) => {
        handleSendType(val, flagNumber, isReturn, inbox, message);
      });
    } else if (inboxId) {
      handleSendType(val, flagNumber, isReturn, inboxId, message);
    }
  };

  // here below inbox can be either id or object
  const handleSendType = (val, flagNumber, isReturn, inbox, message) => {
    flagNumber = flagNumber ? flagNumber : null;
    const canSendRemark = !handleDisableRemark();

    const id = typeof inbox === "object" ? inbox.id : inbox;
    const fileName =
      typeof inbox === "object" ? inbox.referenceNumber : props.pfileName;
    const pcId =
      typeof inbox === "object"
        ? inbox.partCase
        : sessionStorage.getItem("partcaseID");
    const remarkBody = {
      comment: formik.getFieldMeta("remark").value,
      department: sessionStorage.getItem("department"),
      pcId: sessionStorage.getItem("partcaseID"),
      by: sessionStorage.getItem("role"),
    };

    // let body = canSendRemark ? remarkBody : null;
    let body = remarkBody;

    // let group = serviceObj.find((data) => data.deptRole?.roleName === role);
    // let intGroup = intServiceObj.find(
    //   (data) => data.deptRole?.roleName === role
    // );
    // let sectionGroup = sectionObj.find(
    //   (data) => data.deptDisplayName === section
    // );

    // console.log(!isNullOrUndefined(favService));

    const partcaseID = sessionStorage.getItem("partcaseID");
    const fromRole = sessionStorage.getItem("role");

    if (section && !isNullOrUndefined(section)) {
      const sectionData = {
        groupName: section?.deptName,
        roleName: role,
        fromRole: fromRole,
        displayDeptName: section?.deptDisplayName,
        displayRoleName: section?.deptRoleDisplayName,
      };
      props
        .sendFilesSection(
          id,
          sectionData,
          sessionRole,
          Dept,
          username,
          val,
          fileName,
          body,
          flagNumber,
          isReturn,
          sendToDep
        )
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              setsentCount("trigger")
            } else {
              if (message) {
                approveRejectMessage(message);
              } else {
                callMessageSuccess();
              }
              setsentCount((c) => c + 1);
              props.handleClose();
              setLoading(false);
              setTimeout(() => {
                history.push({ pathname: "/eoffice/inbox/file" });
              }, 0)
            }
          } catch (error) {
            setsentCount("trigger")
            callMessageOut(error.message);
          }
        })
        .catch((error) => {
          setsentCount("trigger")
          console.log(error);
        });
    } else if ((service && !isNullOrUndefined(service)) || isReturn) {
      const serviceNumberData = {
        groupName: isReturn ? "" : service?.deptName,
        roleName: role,
        userName: service.deptUsername,
        fromRole: fromRole,
        displayDeptName: isReturn ? "" : service?.deptDisplayName,
        displayRoleName: isReturn ? "" : service?.deptRole?.displayRoleName,
      };
      props
        .sendFilesServiceNumber(
          id,
          serviceNumberData,
          val,
          fileName,
          body,
          flagNumber,
          props.serviceLetterId,
          isReturn,
          sendToDep
        )
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              setsentCount("trigger")
            } else {
              setsentCount((c) => c + 1);
              callMessageSuccess();
              props.handleClose();
              setLoading(false);
              setTimeout(() => {
                history.push({ pathname: "/eoffice/inbox/file" });
              }, 0)
            }
          } catch (error) {
            setsentCount("trigger")
            callMessageOut(resp.error);
          }
        })
        .catch((error) => {
          setsentCount("trigger")
          console.log(error);
        });
    } else if (intService && !isNullOrUndefined(intService)) {
      const intServiceNumberData = {
        groupName: intService?.deptName,
        roleName: role,
        userName: intService.deptUsername,
        fromRole: fromRole,
        displayDeptName: intService?.deptDisplayName,
        displayRoleName: intService?.deptRole?.displayRoleName,
      };
      props
        .sendFilesInternalServiceNumber(
          id,
          intServiceNumberData,
          val,
          fileName,
          body,
          flagNumber,
          sendToDep
        )
        .then((resp) => {
          try {
            if (resp.error) {
              setsentCount("trigger")
              callMessageOut(resp.error);
            } else {
              setsentCount((c) => c + 1);
              callMessageSuccess();
              props.handleClose();
              setLoading(false);
              setTimeout(() => {
                history.push({ pathname: "/eoffice/inbox/file" });
              }, 0)
            }
          } catch (error) {
            setsentCount("trigger")
            callMessageOut(error.message);
          }
        })
        .catch((error) => {
          setsentCount("trigger")
          console.log(error);
        });
    } else if (favSection && !isNullOrUndefined(favSection)) {
      const favData = {
        groupName: favSection?.deptName,
        roleName: role,
        fromRole: fromRole,
        displayDeptName: favSection?.deptDisplayName,
        displayRoleName: favSection?.deptRoleDisplayName,
      };
      props
        .sendFilesSection(
          id,
          favData,
          sessionRole,
          Dept,
          username,
          val,
          fileName,
          body,
          flagNumber,
          isReturn,
          sendToDep
        )
        .then((resp) => {
          try {
            if (resp.error) {
              setsentCount("trigger")
              callMessageOut(resp.error);
            } else {
              setRole("");
              setsentCount((c) => c + 1);
              callMessageSuccess();
              props.handleClose();
              setLoading(false);
              setTimeout(() => {
                history.push({ pathname: "/eoffice/inbox/file" });
              }, 0)
            }
          } catch (error) {
            setsentCount("trigger")
            callMessageOut(error.message);
          }
        })
        .catch((err) => {
          setsentCount("trigger")
          console.log(err);
        });
    } else if (favService && !isNullOrUndefined(favService)) {
      const favData = {
        groupName: favService?.deptName,
        roleName: role,
        userName: favService?.deptUsername,
        fromRole: fromRole,
        displayDeptName: favService?.deptDisplayName,
        displayRoleName: favService.deptRole?.displayRoleName,
      };
      props
        .sendFilesServiceNumber(
          id,
          favData,
          val,
          fileName,
          body,
          flagNumber,
          props.serviceLetterId,
          isReturn,
          sendToDep
        )
        .then((resp) => {
          try {
            if (resp.error) {
              setsentCount("trigger")
              callMessageOut(resp.error);
            } else {
              setRole("");
              setsentCount((c) => c + 1);
              callMessageSuccess();
              props.handleClose();
              setLoading(false);
              setTimeout(() => {
                history.push({ pathname: "/eoffice/inbox/file" });
              }, 0)
            }
          } catch (error) {
            setsentCount("trigger")
            callMessageOut(error.message);
          }
        })
        .catch((error) => {
          setsentCount("trigger")
          console.log(error);
        });
    } else if (favIntService && !isNullOrUndefined(favIntService)) {
      let intServiceNumberData = {
        groupName: favIntService?.deptName,
        roleName: role,
        userName: favIntService?.deptUsername,
        fromRole: fromRole,
        displayDeptName: favIntService?.deptDisplayName,
        displayRoleName: favIntService?.deptRole?.displayRoleName,
      };
      props
        .sendFilesInternalServiceNumber(
          id,
          intServiceNumberData,
          val,
          fileName,
          body,
          flagNumber,
          sendToDep
        )
        .then((resp) => {
          try {
            if (resp.error) {
              setsentCount("trigger")
              callMessageOut(resp.error);
            } else {
              setRole("");
              setsentCount((c) => c + 1);
              callMessageSuccess();
              props.handleClose();
              setLoading(false);
              setTimeout(() => {
                history.push({ pathname: "/eoffice/inbox/file" });
              }, 0)
            }
          } catch (error) {
            setsentCount("trigger")
            callMessageOut(error.message);
          }
        })
        .catch((error) => {
          setsentCount("trigger")
          console.log(error);
        });
    }
  };


  const approveRejectMessage = (msg) => {
    dispatch(setSnackbar(true, "success", msg));
  };

  const handleSendConfirmation = (value) => {
    setOpenConfirmation(false);
    setLoading(true);
    const inboxId = sessionStorage.getItem("InboxID");
    if (value != null) {
      props.PCFileClosuer(inboxId, value, props.pfileName).then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          }
          if (value === "Approved") {
            approveRejectMessage("File has been approved successfully");
          } else if (value === "Rejected") {
            approveRejectMessage("File has been rejected ");
          }

          if (resp) {
            setLoading(false);
          }
          history.push({ pathname: "/eoffice/inbox/file" });
        } catch (error) {
          callMessageOut(error.message);
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

  // Optimized debounce function
  const optimizedInternalService = useCallback(
    debounce(handleInputValueChangeInternalService),
    []
  );

  const optimizedSectionList = useCallback(
    debounce(handleInputValueChange),
    []
  );

  const optimizedChangeService = useCallback(
    debounce(handleInputValueChangeService),
    []
  );

  return (
    <div>
      {loading && <Loading />}
      <DialogContent dividers>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label={t("internal")} {...a11yProps(0)} />
          <Tab label={t("external")} {...a11yProps(1)} />
          <Tab label={t("eyes_only")} {...a11yProps(2)} />
        </Tabs>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <Grid container justifyContent="center">
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 3rem",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%" }}>
                  <Autocomplete
                    freeSolo
                    forcePopupIcon={true}
                    options={intServiceList}
                    getOptionLabel={(option) => {
                      return typeof option === "object"
                        ? `${option?.deptUsername} | ${option?.deptDisplayUsername} | ${option?.deptRole?.displayRoleName}`
                        : "";
                    }}
                    id="tags-outlined"
                    value={intService}
                    onChange={(event, newValue) => {
                      handleOnChangeInternalService(newValue);
                    }}
                    // onInputChange={(event, newInputValue) => {
                    //   !newInputValue.includes("|") &&
                    //     optimizedInternalService(newInputValue);
                    // }}
                    filterSelectedOptions
                    getOptionDisabled={(option) =>
                      option?.deptUsername === intService?.deptUsername
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
                  <Tooltip title={t("ALREADY FAVOURITE")}>
                    <span>
                      <IconButton color="secondary">
                        <FavoriteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                ) : (
                  <Tooltip title={t("add_to_favourite")}>
                    <span>
                      <IconButton
                        id="inbox_add_to_favourite"
                        color="secondary"
                        disabled={addFavBlnDisable}
                        onClick={handleAddToFavourite}
                      >
                        <FavoriteBorder />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
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
                    freeSolo
                    forcePopupIcon={true}
                    options={intServiceFavouriteList.map((option) => option)}
                    id="tags-outlined"
                    getOptionLabel={(option) => {
                      return typeof option === "object"
                        ? `${option?.deptUsername} | ${option?.deptDisplayUsername} | ${option?.deptRole?.displayRoleName}`
                        : "";
                    }}
                    value={favIntService}
                    onChange={(event, newValue) => {
                      handleOnChangeFavInternalService(newValue);
                    }}
                    filterSelectedOptions
                    getOptionDisabled={(option) =>
                      option?.deptUsername === favIntService?.deptUsername
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={t("search_favourite")}
                        placeholder={t("enter_service_number")}
                        className={props.theme ? "darkTextField" : ""}
                      />
                    )}
                  />
                </FormControl>
                <Tooltip
                  title={t("delete_favourite")}
                  style={{ marginTop: "1rem" }}
                >
                  <span>
                    <IconButton
                      id="inbox_delete_favourite"
                      color="secondary"
                      disabled={deleteFavBlnDisable}
                      onClick={handleDeleteFavourite}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <Grid container justifyContent="center">
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 3rem",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%" }}>
                  <Autocomplete
                    freeSolo
                    forcePopupIcon={true}
                    options={sectionList}
                    getOptionLabel={(option) => {
                      return option.deptDisplayName
                        ? option.deptDisplayName
                        : "";
                    }}
                    value={section}
                    id="tags-outlined"
                    onChange={(event, newValue) => {
                      handleOnChange(newValue);
                    }}
                    onInputChange={(event, newInputValue) => {
                      !newInputValue.includes("|") &&
                        optimizedSectionList(newInputValue);
                    }}
                    filterSelectedOptions
                    getOptionSelected={(option, value) =>
                      option.deptDisplayName === value.deptDisplayName
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        style={{ width: "100%" }}
                        variant="outlined"
                        label={t("search_by_section")}
                        placeholder={t("enter_section")}
                        className={props.theme ? "darkTextField" : ""}
                      />
                    )}
                  />
                </FormControl>
                {alreadyFav ? (
                  <Tooltip title={t("ALREADY FAVOURITE")}>
                    <span>
                      <IconButton color="secondary">
                        <FavoriteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                ) : (
                  <Tooltip title={t("add_to_favourite")}>
                    <span>
                      <IconButton
                        id="AddToFavourite_button"
                        color="secondary"
                        disabled={addFavBlnDisable}
                        onClick={handleAddToFavourite}
                      >
                        <FavoriteBorder />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
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
                    freeSolo
                    forcePopupIcon={true}
                    options={sectionFavouriteList.map((option) => option)}
                    id="tags-outlined"
                    getOptionLabel={(option) => {
                      return option.deptDisplayName
                        ? option.deptDisplayName
                        : "";
                    }}
                    value={favSection}
                    onChange={(event, newValue) => {
                      handleOnChangeFavSection(newValue);
                    }}
                    filterSelectedOptions
                    getOptionSelected={(option, value) =>
                      option.deptDisplayName === value.deptDisplayName
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={t("search_favourite")}
                        placeholder={t("enter_section")}
                        className={props.theme ? "darkTextField" : ""}
                      />
                    )}
                  />
                </FormControl>
                <Tooltip
                  title={t("delete_favourite")}
                  style={{ marginTop: "1rem" }}
                >
                  <span>
                    <IconButton
                      id="DeleteFavourite_button"
                      color="secondary"
                      disabled={deleteFavBlnDisable}
                      onClick={handleDeleteFavourite}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <Grid container justifyContent="center">
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 3rem",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%" }}>
                  <Autocomplete
                    freeSolo
                    forcePopupIcon={true}
                    options={serviceList}
                    getOptionLabel={(option) => {
                      return typeof option === "object"
                        ? `${option?.deptUsername} | ${option?.deptDisplayUsername} | ${option?.deptRole?.displayRoleName}`
                        : "";
                    }}
                    id="tags-outlined"
                    value={service}
                    onChange={(event, newValue) => {
                      handleOnChangeService(newValue);
                    }}
                    onInputChange={(event, newInputValue) => {
                      !newInputValue.includes("|") &&
                        optimizedChangeService(newInputValue);
                    }}
                    getOptionDisabled={(option) =>
                      option?.deptRole?.displayRoleName ===
                      service?.deptRole?.displayRoleName
                    }
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={t("search_by_service_number")}
                        placeholder={t("enter_service_number")}
                        className={props.theme ? "darkTextField" : ""}
                      />
                    )}
                  />
                </FormControl>
                {alreadyFav ? (
                  <Tooltip title={t("ALREADY FAVOURITE")}>
                    <span>
                      <IconButton color="secondary">
                        <FavoriteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                ) : (
                  <Tooltip title={t("add_to_favourite")}>
                    <span>
                      <IconButton
                        id="inbox_addFav_button"
                        color="secondary"
                        disabled={addFavBlnDisable}
                        onClick={handleAddToFavourite}
                      >
                        <FavoriteBorder />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
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
                    freeSolo
                    forcePopupIcon={true}
                    options={serviceFavouriteList.map((option) => option)}
                    id="tags-outlined"
                    getOptionLabel={(option) => {
                      return typeof option === "object"
                        ? `${option?.deptUsername} | ${option?.deptDisplayUsername} | ${option?.deptRole?.displayRoleName}`
                        : "";
                    }}
                    value={favService}
                    onChange={(event, newValue) => {
                      handleOnChangeFavService(newValue);
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={t("search_favourite")}
                        placeholder={t("enter_service_number")}
                        className={props.theme ? "darkTextField" : ""}
                      />
                    )}
                  />
                </FormControl>
                <Tooltip
                  title={t("delete_favourite")}
                  style={{ marginTop: "1rem" }}
                >
                  <span>
                    <IconButton
                      id="inbox_delFav_button"
                      color="secondary"
                      disabled={deleteFavBlnDisable}
                      onClick={handleDeleteFavourite}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </TabPanel>
        </SwipeableViews>
      </DialogContent>
      <DialogActions>
        <Button
          id="hrm_add_remark_button"
          variant="contained"
          color="primary"
          disabled={handleDisableRemark()}
          onClick={() => setaddRemark(true)}
          endIcon={<RateReviewOutlined />}
        >
          {t("Add Remark")}
        </Button>

        <Button
          id="inbox_end_task_button"
          variant="contained"
          color="primary"
          style={{
            display: `${Dept === hrmDepartmet ? "" : "none"}`,
          }}
          onClick={() =>
            props.serviceLetterId
              ? setPaFlowDialog(true)
              : setOpenConfirmation(true)
          }
          endIcon={<MailOutlineIcon />}
        >
          {t("end_task")}
        </Button>

        <Button
          id="send_to_next_level_button"
          variant="contained"
          color="secondary"
          style={{
            display: `${hasCoverNote === "true" ? "" : "none"}`,
          }}
          disabled={blnNextDisable}
          onClick={() => setSelectFileDialog(true)}
          endIcon={<MailOutlineIcon />}
        >
          {t("send_to_next_level")}
        </Button>
        <Button
          id="inbox_HrmDialog_send_button"
          variant="contained"
          color="secondary"
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
            id="inbox_HrmDialog_close_button"
            aria-label="close"
            onClick={() => setOpenConfirmation(false)}
            color="primary"
            style={{ float: "right", padding: "5px !important" }}
          >
            <CloseIcon style={{ color: props.theme ? "#fff" : "black" }} />
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
          {props.status === "Approved" || props.status === "Rejected" ? (
            <Button
              id="inbox_fileStatus_done_button"
              variant="contained"
              endIcon={<Done />}
              color="secondary"
              onClick={() => handleSendConfirmation(props.status)}
            >
              Submit
            </Button>
          ) : (
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
                  onClick={handleApprove}
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
          )}
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
        <DialogTitle
          style={{
            cursor: "move",
          }}
          id="draggable-dialog-title"
        >
          <span>{t("select_file")}</span>
          <IconButton
            id="inbox_fileDialog_close_button"
            aria-label="close"
            onClick={() => setSelectFileDialog(false)}
            color="primary"
            style={{ float: "right", padding: "5px !important" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <SelectFile
          enclosureArr={props.enclosureArr}
          handleSend={handleSend}
          loading={loading}
          fileId={props.fileId}
        />
      </Dialog>

      <Dialog
        open={paFlowDialog}
        onClose={() => setPaFlowDialog(false)}
        // PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ minWidth: "300px" }}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {t("Select File")}
          <IconButton
            id="PAFlowDialog_close_button"
            aria-label="close"
            onClick={() => setPaFlowDialog(false)}
            color="primary"
            style={{ float: "right", padding: "5px !important" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <PaFlowDialog
          enclosureArr={props.enclosureArr}
          handleSend={handleSend}
          setSection={setSection}
          inboxId={inboxid}
          pfileName={props.pfileName}
          approveRejectMessage={approveRejectMessage}
          fileId={props.fileId}
        />
      </Dialog>

      <Dialog
        open={addRemark}
        onClose={() => {
          setaddRemark(false);
        }}
      >
        <DialogTitle>
          <Box className={classes.remark_title}>
            {t("WRITE INTERNAL REMARK")}
            <IconButton
              id="remark-close-button"
              aria-label="close"
              onClick={() => {
                setaddRemark(false);
              }}
              color="primary"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            id="remark"
            error={
              formik.touched.remark ? Boolean(formik.errors.remark) : false
            }
            name="remark"
            label={t("remark")}
            value={formik.values.remark}
            onChange={formik.handleChange}
            multiline
            minRows={10}
            variant="outlined"
          />
          <div style={{ fontSize: "small", color: "red", textAlign: "start" }}>
            {formik.touched.remark && Boolean(formik.errors.remark)
              ? formik.errors.remark
              : ""}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            id="remark_add_done_button"
            variant="contained"
            color="secondary"
            endIcon={<Add />}
            onClick={() => setaddRemark(false)}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

function mapStateToProps(state) {
  return { props: state.props, theme: state.theme, subscribe: state.subscribeApi };
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
  changingTableStateInbox,
})(HrmDialog);

// NOTE:::::

// working with formik never make handler function as arrow function as formik handler function does not work well with arrow function so always use simple js function

// In mui autocomplete sometimes there exist a case when the option present is different than the actual value you want to put in input tag in this case use combination of renderOption and getOptionLabel props
