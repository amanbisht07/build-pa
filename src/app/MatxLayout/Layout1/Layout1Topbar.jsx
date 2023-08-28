import React, { Component, createRef } from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router-dom";
import {
  FormControl,
  Icon,
  IconButton,
  MenuItem,
  withStyles,
  MuiThemeProvider,
  Select,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  DialogActions,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
  Box,
} from "@material-ui/core";
import { connect } from "react-redux";
import { setLayoutSettings } from "app/redux/actions/LayoutActions";
import { logoutUser } from "app/redux/actions/UserActions";
import {
  loadUserRoleData,
  changeTheme,
  myInfo,
  getPersonalInfo,
  sideNav,
  sidenavChange,
  sendAuditdata,
  changeRoutes,
} from "../../camunda_redux/redux/action";
import { PropTypes } from "prop-types";
import { MatxMenu } from "./../../../matx";
import { isMdScreen } from "utils";
import NotificationBar from "../SharedCompoents/NotificationBar";
import {
  changingTableStatePA,
  changingTableState,
  changingTableStateInbox,
  changingTableStateOutbox,
  changingTableStateCabinet,
} from "../../camunda_redux/redux/action/apiTriggers";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import "./Layout1.css";
import Cookies from "js-cookie";
import { withTranslation } from "react-i18next";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import InfoForm from "app/views/Personnel/InfoForm";
import CloseIcon from "@material-ui/icons/Close";
import Draggables from "react-draggable";
import i18next from "i18next";
import CryptoJS from "crypto-js";
import Logout from "app/views/user-activity/logout/Logout";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import Aduiddisable from "app/views/user-activity/logout/Aduiddisable";
import { setUserData } from "app/redux/actions/UserActions";
import { Menu, MoreVert } from "@material-ui/icons";
import LoginPage from "LoginPage";

const PaperComponent = (props) => {
  return (
    <Draggables handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggables>
  );
};

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
  },
  topBarWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    gap: "4px",
    marginLeft: "4px",
    "@media (max-width: 767px)": {
      display: "none",
    },
  },
  topBarMoreBtn: {
    display: "none",
    "@media (max-width: 767px)": {
      display: "block",
    },
  },
});

const elem = document.documentElement;
class Layout1Topbar extends Component {
  constructor(props) {
    super(props);
    this.menuRef = createRef();
  }
  state = {
    fullScreen: false,
    comboValue: "",
    comboList: [],
    lightMode: Cookies.get("theme") === "red" ? true : false,
    openInfo: false,
    AuditD: false,
    lang: Cookies.get("i18next"),
    openMenu: false,
    loading: false,
  };

  UNSAFE_componentWillMount() {
    const department = localStorage.getItem("username");
    this.props.loadUserRoleData(department).then((resp) => {
      let tempArr = [];
      try {
        tempArr.push({
          ...resp.data[0],
          showName: resp.data[0]?.deptDisplayUsername,
          username: true, // it means first object is user not role based user
        });
        for (let x = 0; x < resp.data?.length; x++) {
          tempArr.push({
            ...resp.data[x],
            username: false,
            showName: resp.data[x]?.deptRole?.displayRoleName,
          });
        }
        if (tempArr.length > 0) {
          this.setState({
            comboList: tempArr,
            comboValue: JSON.stringify(tempArr[0]),
          });
          sessionStorage.setItem("role", tempArr[0].deptRole?.roleName);
          sessionStorage.setItem("department", tempArr[0].deptName);
          sessionStorage.setItem("pklDirectrate", tempArr[0].deptDisplayName);
          sessionStorage.setItem(
            "displayUserName",
            tempArr[0].deptDisplayUsername
          );
          sessionStorage.setItem(
            "displayRole",
            tempArr[0].deptRole?.displayRoleName
          );
          sessionStorage.setItem(
            "displayDept",
            tempArr[0].deptRole?.displayDepartment
          );
          this.props.setUserData({
            role: {
              ...tempArr[0],
            },
            roleArr: tempArr,
          });
        }
      } catch (e) {
        if (e.message === "Cannot read property 'roleName' of undefined") {
          this.props.history.push("/eoffice/404");
        }
      }
    });

    if (Cookies.get("theme") === "darkTheme") {
      document.getElementById(
        "theme"
      ).href = `${process.env.PUBLIC_URL}/assets1/css/syncfusion-dark.css`;
    }
  }

  // componentDidUpdate() {
  //   this.setState({ lang: Cookies.get("i18next") });
  // }

  componentDidMount() {
    const username = localStorage.getItem("username");
    let formData = new FormData();
    formData.append("username", username);

    // full screen handler
    const handleResize = () => {
      if (
        document.webkitIsFullScreen ||
        document.mozFullscreen ||
        document.mozFullScreenElement
      ) {
        // console.log("FS mode");
        this.setState({ fullScreen: true });
        this.setState({ openMenu: false });
      } else {
        // console.log("DS mode");
        this.setState({ fullScreen: false });
      }
    };
    window.addEventListener("resize", handleResize);

    window.addEventListener("keydown", (e) => {
      if (e.key == "F11") {
        if (this.state.fullScreen == false) {
          window.removeEventListener("resize", handleResize);
          // console.log(`pressed ${e.key} for FS`);
          this.setState({ fullScreen: true });
        }
        setTimeout(() => {
          window.addEventListener("resize", handleResize);
        }, 1000);
      }
    });

    username &&
      this.props.getPersonalInfo(formData).then((res) => {
        if (res.status === "OK") {
          this.props.myInfo(true);
        } else {
          this.props.myInfo(false);
        }
      });

    this.props.changeRoutes("PA");
  }

  openFullScreen = () => {
    this.setState({ fullScreen: true });
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      // elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  closeFullScreen = () => {
    this.setState({ fullScreen: false });
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      // document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  updateSidebarMode = (sidebarSettings) => {
    let { settings, setLayoutSettings } = this.props;
    setLayoutSettings({
      ...settings,
      layout1Settings: {
        ...settings.layout1Settings,
        leftSidebar: {
          ...settings.layout1Settings.leftSidebar,
          ...sidebarSettings,
        },
      },
    });
  };

  handleSidebarToggle = () => {
    let { settings } = this.props;
    let { layout1Settings } = settings;

    let mode;
    if (isMdScreen()) {
      mode = layout1Settings.leftSidebar.mode === "close" ? "mobile" : "close";
    } else {
      mode = layout1Settings.leftSidebar.mode === "full" ? "close" : "full";
    }
    this.updateSidebarMode({ mode });
  };

  encryptFun(password, username) {
    var keybefore = username + "appolocomputers";
    var ivbefore = username + "costacloud012014";
    var key = CryptoJS.enc.Latin1.parse(keybefore.substring(0, 16));
    var iv = CryptoJS.enc.Latin1.parse(ivbefore.substring(0, 16));
    var ciphertext = CryptoJS.AES.encrypt(password, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding,
    }).toString();
    return ciphertext;
  }

  handleSignOut = async () => {

    const data = JSON.stringify({
      refresh_token: localStorage.getItem("refresh_token"),
    });

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
    };

    // const userName = localStorage.getItem("username");
    // const role = sessionStorage.getItem("role");
    // const isDark = Cookies.get("theme") === "darkTheme";
    // const language = Cookies.get("i18next");
    // const sessionId = Cookies.get("SESSION");

    // this.setState({
    //   loading: true,
    // });

    // fetch("/retrieval_service/api/personalize", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     userName,
    //     role,
    //     isDark,
    //     language,
    //     pa: 1,
    //     paFile: 2,
    //     tab: window.location.href,
    //     sessionId,
    //   }),
    // })
    // .then((res) => res.json())
    // .then((res) => console.log(res))
    // .catch((err) => console.log(err));
    const userNameFeedback = localStorage.getItem("username");
    const sessionId = sessionStorage.getItem("sessionId");
    const Authorization = "Bearer " + sessionStorage.getItem("jwt_token");
    const department = sessionStorage.getItem("department");
    const displayUserName = sessionStorage.getItem("displayUserName");

    this.props.setUserData({
      role: {},
      roleArr: [],
    });

    // unsubscribe to refresh token api
    const id = localStorage.getItem("refresh_session");
    clearInterval(id);

    ReactDOM.render(
      <LoginPage
        feedbackdialog={true}
        userNameFeedback={userNameFeedback}
        sessionId={sessionId}
        Authorization={Authorization}
        deptName={department}
      />,
      document.getElementById("root")
    );
    localStorage.clear();
    sessionStorage.clear();
    const logout = await fetch("/auth/logout", {
      method: "POST",
      headers,
      body: data,
    })

  };

  handleThemeChangeBlue = (e) => {
    let { settings } = this.props;
    let { layout1Settings } = settings;
    this.setState({ lightMode: false });
    let sideBarTheme, tobBarTheme, buttonTheme;
    sideBarTheme = layout1Settings.leftSidebar.theme = "blue";
    tobBarTheme = layout1Settings.topbar.theme = "blue";
    tobBarTheme = layout1Settings.footer.theme = "#001049";
    buttonTheme = layout1Settings.activeButton.theme = "blue";
    this.updateSidebarMode({ sideBarTheme, tobBarTheme, buttonTheme });
    Cookies.set("theme", "blue");
    this.props.changeTheme(false);
    setTimeout(() => {
      document.getElementById(
        "theme"
      ).href = `${process.env.PUBLIC_URL}/assets1/css/syncfusion.css`;
    }, [500]);
    // "%PUBLIC_URL%/assets1/css/syncfusion.css";
  };

  handleThemeChangeRed = (e) => {
    let { settings } = this.props;
    let { layout1Settings } = settings;
    this.setState({ lightMode: true });
    let sideBarTheme, tobBarTheme, buttonTheme;
    sideBarTheme = layout1Settings.leftSidebar.theme = "darkTheme";
    tobBarTheme = layout1Settings.topbar.theme = "darkTheme";
    tobBarTheme = layout1Settings.footer.theme = "#001049";
    buttonTheme = layout1Settings.activeButton.theme = "darkTheme";
    this.updateSidebarMode({ sideBarTheme, tobBarTheme, buttonTheme });
    Cookies.set("theme", "darkTheme");
    this.props.changeTheme(true);
    setTimeout(() => {
      document.getElementById(
        "theme"
      ).href = `${process.env.PUBLIC_URL}/assets1/css/syncfusion-dark.css`;
    }, [500]);
  };

  handleChange = (event) => {
    let data = JSON.parse(event.target.value);
    const roleName = data.deptRole?.roleName;
    const dept = data.deptName;
    sessionStorage.setItem("role", roleName);
    sessionStorage.setItem("department", dept);
    sessionStorage.setItem("pklDirectrate", data.deptDisplayName);
    sessionStorage.setItem("displayUserName", data.deptDisplayUsername);
    sessionStorage.setItem(
      "displayRole",
      data.deptRole?.displayRoleName
    );
    sessionStorage.setItem(
      "displayDept",
      data.deptRole?.displayDepartment
    );
    this.props.setUserData({
      role: {
        ...data,
      },
    });

    this.setState({ comboValue: event.target.value });
    this.refreshTables(data);

    // setTimeout(() => {
    //   if (data.username) {
    //     this.props.changeRoutes("PA");
    //   } else {
    //     this.props.changeRoutes("ALL");
    //   }
    // }, 500); // delay so that once trigger to redux of inbox , outbox , cabinet based on role is done then i will change the route
  };

  refreshTables = (data) => {
    if (data?.username) {
      this.props.changeRoutes("PA");
      this.props.history.push("/eoffice/dashboard/analytics");
    } else {
      const {
        blnValuePA,
        blnValuePF,
        blnValueInbox,
        blnValueOutbox,
        blnValueCabinet,
      } = this.props.subscribe;

      this.props.changingTableStatePA(!blnValuePA, "CHANGE_PA_APPLICATION");
      this.props.changingTableState(!blnValuePF, "CHANGE_PA_FILE");
      this.props.changingTableStateInbox(!blnValueInbox, "CHANGE_INBOX");
      this.props.changingTableStateOutbox(!blnValueOutbox, "CHANGE_OUTBOX");
      this.props.changingTableStateCabinet(!blnValueCabinet, "CHANGE_CABINET");
      this.props.changeRoutes("ALL");
      this.props.history.push("/eoffice/inbox/file");
    }
  };

  handalclose = () => {
    this.setState({ AuditD: false });
  };

  handleCloseMenu = (event) => {
    if (
      this.menuRef?.current &&
      this.MenuanchorRef?.current?.contains(event.target)
    ) {
      return;
    }

    this.setState({ openMenu: false });
  };

  render() {
    const { fullScreen, comboList, lightMode } = this.state;
    let {
      theme,
      settings,
      className,
      style,
      darkState,
      t,
      showHam,
      toggleHam,
      classes,
    } = this.props;
    const topbarTheme =
      settings.themes[settings.layout1Settings.topbar.theme] || theme;
    let { layout1Settings } = settings;
    const serviceNumber = localStorage.getItem("username");

    return (
      <MuiThemeProvider theme={topbarTheme}>
        <div className="topbar">
          <div
            className={`topbar-hold ${className}`}
            style={Object.assign(
              {},
              { background: topbarTheme.palette.primary.main },
              style
            )}
          >
            <div className="flex flex-space-between flex-middle h-100">
              <div className="flex">
                <IconButton
                  onClick={() => {
                    // this.handleSidebarToggle()
                    toggleHam(!showHam);
                  }}
                  className="topbar-toggle-btn"
                  style={{
                    color: this.props.appTheme ? "#fff" : "inherit",
                  }}
                >
                  {showHam ? <CloseIcon /> : <Menu />}
                </IconButton>

                <div className="topbar-img">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/assets/images/logo-paperless.png"
                    }
                    alt={"EOffice"}
                    style={{
                      imageRendering: "-webkit-optimize-contrast",
                      maxWidth: "75%",
                    }}
                  />
                </div>
              </div>
              <div className={classes.topBarWrapper}>
                <FormControl
                  className="topbarSelect"
                  style={{
                    minWidth: 300,
                    background: "white",
                    borderRadius: "50px",
                    textAlignLast: "center",
                  }}
                >
                  <Select
                    native
                    value={this.state.comboValue}
                    onChange={this.handleChange}
                    inputProps={{
                      name: "age",
                      id: "age-native-simple",
                    }}
                    style={{ fontSize: "12px", color: "black" }}
                  >
                    {/* {comboList.map((x) => (
                      <option key={x.deptRole}> {x.deptRole}</option>
                    ))} */}
                    {comboList.map((x, i) => (
                      <option
                        style={{
                          color: this.props.appTheme ? "white" : "black",
                        }}
                        key={i + 1}
                        value={JSON.stringify(x)}
                      >
                        {x.showName}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <Box className={classes.box}>
                  {/* <Tooltip title={t("AUDIT INFO")} aria-label="AUDIT INFO">
                    <IconButton
                      onClick={() => this.setState({ AuditD: true })}
                      className="hide_menu_topbar"
                    >
                      <AssignmentTurnedInIcon
                        style={{
                          fontSize: "1.25rem",
                          color: "white",
                        }}
                      />
                    </IconButton>
                  </Tooltip> */}

                  <Tooltip title={t("my_info")} aria-label="myInfo">
                    <IconButton
                      id="my_info_button"
                      onClick={() => this.setState({ openInfo: true })}
                      className="hide_menu_topbar"
                    >
                      <PersonOutlineOutlinedIcon
                        style={{
                          fontSize: "1.25rem",
                          color: "white",
                          // padding: "0px 4px",
                        }}
                      />
                    </IconButton>
                  </Tooltip>

                  <div
                    style={{ display: "inline-block" }}
                    className="hide_menu_topbar"
                  >
                    {this.state.lang == "en" ? (
                      <Tooltip title="हिन्दी">
                        <IconButton
                          id="hindi_lang_Button"
                          onClick={() => {
                            i18next.changeLanguage("hi");
                            this.setState({ lang: "hi" });
                          }}
                          className="hide_menu_topbar"
                        >
                          <div
                            style={{
                              fontSize: "1.15rem",
                              color: "white",
                              marginTop: "-1px",
                              // padding: "0 4px",
                            }}
                          >
                            अ
                          </div>
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="ENGLISH">
                        <IconButton
                          id="eng_lang_Button"
                          onClick={() => {
                            i18next.changeLanguage("en");
                            this.setState({ lang: "en" });
                          }}
                          className="hide_menu_topbar"
                        >
                          <div
                            style={{
                              fontSize: "1.1rem",
                              color: "white",
                              // padding: "0 4px",
                            }}
                          >
                            A
                          </div>
                        </IconButton>
                      </Tooltip>
                    )}
                  </div>
                  {this.props.appTheme ? (
                    <Tooltip title={t("light_mode")} aria-label="DarkMode">
                      <IconButton
                        id="darkMode_Button"
                        onClick={this.handleThemeChangeBlue}
                        className="hide_menu_topbar"
                      >
                        <Brightness7Icon style={{ fontSize: "1.1rem" }} />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title={t("dark_mode")} aria-label="LightMode">
                      <IconButton
                        id="lightMode_Button"
                        onClick={this.handleThemeChangeRed}
                        className="hide_menu_topbar"
                      >
                        <Brightness4Icon
                          style={{
                            fontSize: "1.1rem",
                            color: "#fff",
                            // padding: "0px 4px",
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                  <IconButton
                    id="notification_Button"
                    className="hide_menu_topbar"
                    style={{ marginTop: "-2px" }}
                  >
                    <NotificationBar style={{ fontSize: "1.1rem" }} />
                  </IconButton>
                  <Tooltip title={t("logout")} aria-label="Logout">
                    <IconButton
                      id="logout_Button"
                      onClick={this.handleSignOut}
                      color="secondary"
                      className="hide_menu_topbar"
                    >
                      <ExitToAppIcon style={{ fontSize: "1.2rem" }} />
                    </IconButton>
                  </Tooltip>
                  {fullScreen ? (
                    <Tooltip
                      title={t("exit_fullScreen")}
                      aria-label="Exit FullScreen"
                    >
                      <span className="hide_menu_topbar">
                        <IconButton
                          id="closeFullScreen_Button"
                          onClick={this.closeFullScreen}
                        >
                          <FullscreenExitIcon style={{ color: "#fff" }} />
                        </IconButton>
                      </span>
                    </Tooltip>
                  ) : (
                    <Tooltip title={t("fullScreen")} aria-label="FullScreen">
                      <span className="hide_menu_topbar">
                        <IconButton
                          id="fullScreen_Button"
                          onClick={this.openFullScreen}
                        >
                          <FullscreenIcon style={{ color: "#fff" }} />
                        </IconButton>
                      </span>
                    </Tooltip>
                  )}
                </Box>
                <IconButton
                  onClick={() =>
                    this.setState({ openMenu: !this.state.openMenu })
                  }
                  ref={this.menuRef}
                  className={classes.topBarMoreBtn}
                >
                  <Tooltip title="MENU">
                    <MoreVert style={{ color: "#fff" }} />
                  </Tooltip>
                </IconButton>
                <Popper
                  open={this.state.openMenu}
                  anchorEl={this.menuRef.current}
                  role={undefined}
                  transition
                  disablePortal
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === "bottom"
                            ? "center top"
                            : "center bottom",
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={this.handleCloseMenu}>
                          <MenuList
                            autoFocusItem={this.state.openMenu}
                            id="topbar-menu-list-grow"
                            style={{ zIndex: "1" }}
                          >
                            {this.state.lang == "en" ? (
                              <MenuItem
                                onClick={() => {
                                  i18next.changeLanguage("hi");
                                  this.setState({ lang: "hi" });
                                }}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: ".7rem",
                                }}
                              >
                                हिन्दी
                              </MenuItem>
                            ) : (
                              <MenuItem
                                onClick={() => {
                                  i18next.changeLanguage("en");
                                  this.setState({ lang: "en" });
                                }}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: ".7rem",
                                }}
                              >
                                ENGLISH
                              </MenuItem>
                            )}
                            {/* <MenuItem
                              onClick={() => this.setState({ AuditD: true })}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: ".7rem",
                              }}
                            >
                              <AssignmentTurnedInIcon /> {t("AUDIT INFO")}
                            </MenuItem> */}
                            <MenuItem
                              onClick={() => this.setState({ openInfo: true })}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: ".7rem",
                              }}
                            >
                              <PersonOutlineOutlinedIcon /> {t("my_info")}
                            </MenuItem>

                            {this.props.appTheme ? (
                              <MenuItem
                                onClick={this.handleThemeChangeBlue}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: ".7rem",
                                }}
                              >
                                <Brightness7Icon /> {t("light_mode")}
                              </MenuItem>
                            ) : (
                              <MenuItem
                                onClick={this.handleThemeChangeRed}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: ".7rem",
                                }}
                              >
                                <Brightness4Icon /> {t("dark_mode")}
                              </MenuItem>
                            )}
                            {fullScreen ? (
                              <MenuItem
                                onClick={this.closeFullScreen}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: ".7rem",
                                }}
                              >
                                <FullscreenExitIcon /> {t("exit_fullScreen")}
                              </MenuItem>
                            ) : (
                              <MenuItem
                                onClick={this.openFullScreen}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: ".7rem",
                                }}
                              >
                                <FullscreenIcon /> {t("fullScreen")}
                              </MenuItem>
                            )}
                            <MenuItem
                              onClick={this.handleSignOut}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: ".7rem",
                              }}
                            >
                              <ExitToAppIcon /> {t("logout")}
                            </MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </div>
            </div>
          </div>
        </div>
        <Dialog
          open={this.state.openInfo}
          aria-labelledby="draggable-dialog-title"
          PaperComponent={PaperComponent}
          maxWidth="sm"
        >
          <DialogTitle id="draggable-dialog-title" style={{ cursor: "move" }}>
            {t("personal_information")}
            <Tooltip title={t("close")}>
              <IconButton
                id="myInfo_closeIcon"
                aria-label="close"
                onClick={() => this.setState({ openInfo: false })}
                color="primary"
                style={{
                  float: "right",
                  position: "relative",
                  top: "-9px",
                  color: this.props.appTheme ? "#fff" : "inherit",
                }}
                className="cancel-drag"
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </DialogTitle>
          <InfoForm handleSubmit={(val) => this.setState({ openInfo: val })} />
        </Dialog>

        <Dialog
          open={this.state.AuditD}
          aria-labelledby="draggable-dialog-title"
          PaperComponent={PaperComponent}
          maxWidth="sm"
        >
          <DialogTitle
            id="draggable-dialog-title"
            style={{ cursor: "move", userSelect: "none" }}
          >
            {t("audit_information")}
            <Tooltip title={t("close")}>
              <IconButton
                aria-label="close"
                onClick={this.handalclose}
                color="primary"
                style={{
                  float: "right",
                  position: "relative",
                  top: "-9px",
                  color: this.props.appTheme ? "#fff" : "inherit",
                }}
                className="cancel-drag"
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </DialogTitle>
          <Aduiddisable handalclose={this.handalclose} />
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

Layout1Topbar.propTypes = {
  setLayoutSettings: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  loadUserRoleData: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  changeTheme: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  setLayoutSettings: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  loadUserRoleData: PropTypes.func.isRequired,
  settings: state.layout.settings,
  appTheme: state.theme,
  paInfo: state.myInfo,
  subscribe: state.subscribeApi,
});

export default withStyles(styles, { withTheme: true })(
  withRouter(
    connect(mapStateToProps, {
      setUserData,
      setLayoutSettings,
      logoutUser,
      loadUserRoleData,
      changingTableStatePA,
      changingTableState,
      changingTableStateInbox,
      changingTableStateOutbox,
      changingTableStateCabinet,
      changeTheme,
      myInfo,
      getPersonalInfo,
      sideNav,
      sidenavChange,
      sendAuditdata,
      changeRoutes,
    })(withTranslation()(Layout1Topbar))
  )
);
