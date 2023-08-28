import React, { useEffect, useState } from "react";
import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  Resize,
  DragAndDrop,
  ViewsDirective,
  ViewDirective,
  ResourceDirective,
  ResourcesDirective,
} from "@syncfusion/ej2-react-schedule";
import {
  loadRtiRegister,
  getStatus,
  getDraftStatus,
  loadRtiList,
  DeleteDraft,
  getFilterStatus,
} from "app/camunda_redux/redux/action/index";
import RtiForm from "./RtiForm";
import { connect, useDispatch, useSelector } from "react-redux";
import history from "../../../../history";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import clsx from "clsx";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";
import Cookies from "js-cookie";
import Drawer from "@material-ui/core/Drawer";
import "../css/file.css";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import { Grid, Paper, IconButton, Tooltip } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Breadcrumb } from "matx";
import Calendar from "./calendar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { toast } from "react-toastify";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Finalreg from "./Finalreg";
import snackbar, { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { Close } from "@material-ui/icons";
import Draggables from "react-draggable";
import { useTranslation } from "react-i18next";
import { Loading } from "./therme-source/material-ui/loading";

const PaperComponent = (props) => {
  return (
    <Draggables
      handle="#draggable-dialog-title"
      cancel={'.cancel-drag'}
    >
      <Paper {...props} />
    </Draggables>
  );
};
const useStyles = makeStyles((theme) => ({
  // root: {
  //   display: "flex"
  // },
  // "& > *": {
  //   margin: theme.spacing(1),
  // },

  // divZIndex: {
  //   zIndex: "0",
  //   "& .MuiDialogContent-dividers": {
  //     padding: "0px 0px !important",
  //   },
  //   "& #pdfV": {
  //     height: "calc(100vh - 47px) !important",
  //   },
  //   "& .e-de-ctn": {
  //     height: "calc(100vh - 48px) !important",
  //   },
  // },

  // appBar: {
  //   transition: theme.transitions.create(["margin", "width"], {
  //     easing: theme.transitions.easing.sharp,
  //     duration: theme.transitions.duration.leavingScreen,
  //   }),
  // },
  // appBarShift: {
  //   width: `calc(100% - ${drawerWidth}px)`,
  //   transition: theme.transitions.create(["margin", "width"], {

  //     easing: theme.transitions.easing.easeOut,
  //     duration: theme.transitions.duration.enteringScreen,
  //   }),
  //   marginRight: drawerWidth,
  // },
  title: {
    flexGrow: 1,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaperNotOpen: {
    width: drawerWidth,
    top: "4.7rem",
    height: Number(window.innerHeight - 98),
    visibility: "initial",
    display: "none",
  },
  drawerPaperOpen: {
    width: drawerWidth,
    top: "4.7rem",
    height: Number(window.innerHeight - 98),
    display: "initial",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
    background: "	#cecbdf ",
  },
  // content: {
  //   flexGrow: 1,
  //   padding: theme.spacing(3),
  //   transition: theme.transitions.create("margin", {
  //     easing: theme.transitions.easing.sharp,
  //     duration: theme.transitions.duration.leavingScreen,
  //     delay: 600,
  //   }),
  //   marginRight: -drawerWidth,
  // },
  //   contentShift: {
  //     transition: theme.transitions.create("margin", {
  //       easing: theme.transitions.easing.easeOut,
  //       duration: theme.transitions.duration.enteringScreen,
  //       delay: 600,
  //     }),
  //     marginRight: 0,
  //   },
}));

const drawerWidth = "17%";

function RtiRegister(props) {
  const { t } = useTranslation();

  const classes = useStyles();
  const dispatch = useDispatch();
  const [value, setValue] = React.useState("all");
  const [historyData, setHistoryData] = useState([]);
  const [open, setOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [rowData1, setRowData1] = useState([]);
  const [curr, setCurr] = useState(new Date());
  const { blnValueRti } = props.subscribeApi; // redux trigger that helps in refreshing table

  const [open1, setOpen1] = useState(false);
  const [openregister, setOpenregister] = useState(false);
  const [data1, setData1] = useState([]);
  const [deleteid, setDeleteid] = useState("");
  const [showstatus, setShowstatus] = useState("");
  const [isForward, setRtiforward] = useState(false);
  const [scroll, setScroll] = React.useState('paper');
  const [handledata , setHandleData]= useState("");
  const [load, setLoad] = useState(false);

  let clickTimer;
  let preventClick = false;

  useEffect(() => loadRegister(), [blnValueRti]);

  useEffect(() => {
    Cookies.remove("inboxFile");
    Cookies.remove("priority");
    Cookies.remove("referenceNumber");
    Cookies.remove("hasCoverNote");
    Cookies.remove("type");
    Cookies.remove("partCaseId");
    Cookies.remove("partCase");
    Cookies.remove("isRti");
    Cookies.remove("partcaseId");
    Cookies.remove("isRegister");
    Cookies.remove("isForward")
  }, []);

  const handleClickOpens = () => {
    setOpen1(true);
  };

  const handleClickRegister = () => {
    setOpenregister(true);
  };

  const [data, setdata] = useState({
    date: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const [pending, setPending] = useState("");
  const [api, setapi] = useState([]);
  const [apiData, setApiData] = useState([]);

  const handleClose = () => {
    setOpen1(false);
  };

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const handleCloseRegister = () => {
    setOpenregister(false);
  };

  const handleClick = (args) => {
    // handleDrawerOpen(args.data.partcaseId)
    if (!preventClick) {
      handleDrawerOpen(args.data.rtiId);
      setDeleteid(args.data.rtiId);
      setShowstatus(args.data.status);
    }
    // setCurr(args.data.createdOnDate);
  };

  const handleClick1 = ({data}) => {
    // setHandleData({data})  
    setPending(data.status)
    // Mtd to perform operation while row clicks
    // sessionStorage.setItem("rtiID", rowData.rtiId);
    setRtiforward(data.isForward);
    Cookies.set("inboxFile", data.subject);
    Cookies.set("priority", data.priority);
    Cookies.set("referenceNumber", data.referenceNumber);
    Cookies.set("partcaseId", data.partcaseId);
    Cookies.set("isRti", true);
    // Cookies.set("creater", data.createdBy);
    Cookies.remove("isRegister");
    Cookies.remove("status");
    Cookies.set("isForward" , data.isForward)

    history.push("/eoffice/splitView/file");
  };

  const handleDeleteDraft1 = () => {
    props
      .DeleteDraft(deleteid)
      .then((resp) => {
        console.log(resp)
        loadRegister();
      })
    setOpen(false);
    dispatch(
      setSnackbar(
        true,
        "success",
        `${t("file_has_been_deleted_successfully")}`
      )
    );
  };

  const handleDeleteDraft =()=>{
    setLoad(true)
    props.DeleteDraft(deleteid)
    .then((resp)=>{
      loadRegister();
  try {
    if (resp.error) {
      setLoad(false)
      console.log(resp.error);
      dispatch(setSnackbar(true, "error", resp.error));
      return;
    } else {
      console.log("res", resp);
      setLoad(false)
      dispatch(setSnackbar(true, "success", `${t("file_has_been_deleted_successfully")}`));
      return;
    }
  } catch (error) {
    dispatch(setSnackbar(true, "error", error.message));
  }
    })
    setOpen(false);
  }


  const handleFilterStatus = (showstatus) => {
    props
      .getFilterStatus(deleteid, showstatus)
      .then((resp) => {
        let tmpArr2 = [];
        try {
          // condition to check if response then perform further
          if (resp !== undefined) {
            tmpArr2 = resp.data;
            tmpArr2 = resp.data.map((item) => ({
              ...item,
              StartTime: item.createdOnDate,
              EndTime: item.createdOnDate,
              Subject: item.subject,
            }));
            setRowData(tmpArr2);
          } else {
            const errorMessage =
              resp.status + " : " + resp.error + " AT " + resp.path;
            callMessageOut(errorMessage);
          }
          // props.changingTableStateRti(false, "CHANGE_RTI"); // setting trigger to false as table got updated
        } catch (e) {
          callMessageOut(e.message);
        }
      })

      .catch((err) => console.log(err));
  };

  const handleDrawerOpen = (id) => {
    // props
    //   .loadRtiRegister()
    //   .then((resp) => {
    //     console.log(resp, "loadrtiregister");
    props
      .getStatus(id)
      .then((resp) => {
        let tmpArr = [];
        try {
          if (resp !== undefined) {
            tmpArr = resp.data.map((item) => ({
              ...item,
              StartTime: item.createdOnDate,
              EndTime: item.endDate,
              status: item.status,
            }));
            // !isNullOrUndefined(resp.data)
            setHistoryData(resp.data);
            // : setHistoryData([]);
          } else {
            const errorMessage =
              resp.status + " : " + resp.error + " AT " + resp.path;
            console.log(errorMessage);
          }
          // setting trigger to false as table got updated
        } catch (e) {
          console.log(e.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const onEventRendered = (args) => {
    if (args.data.status === "Pending") {
      args.element.style.backgroundColor = "red";
    } else if (args.data.status === "Responded and Closed") {
      args.element.style.backgroundColor = "green";
    } else if (args.data.status === "Returned") {
      args.element.style.backgroundColor = "red";
    }
  };
  // const onPopupOpen = (args) => {

  //   if (args.target && args.target.classList.contains("e-appointment")) {
  //     handleClick1(args);
  //   }
  // };
  const [start, setStart] = useState(date);

  const date = new Date();
  const date1 = start;

  const onPopupOpen = (args) => {
    setStart(args.data.StartTime); 
    args.cancel = false;
    if (args.type === "Editor") {
      args.cancel = true;
      clearTimeout(clickTimer);
      preventClick = true;
      if (args.target.classList.contains("e-appointment")) {
        setTimeout(() => {
          handleClick1(args);     
        }, 200)
      }
      else {
        handleClickOpens();
      }
    }
    if (args.type === "QuickInfo") {
      args.cancel = true;
    }
    

    if (
      args.type === "QuickInfo" &&
      args.target.classList.contains("e-appointment")
    ) {
      args.cancel = true;
      clickTimer = setTimeout(() => {
        if (!preventClick) handleClick(args);
        preventClick = false;
      }, 200);
    }
  };

  const loadRegister = () => {
    Cookies.remove("Rtioutbox");
    props
      .loadRtiList()
      .then((resp) => {
        let tmpArr = [];
        try {
          // condition to check if response then perform further
          if (resp !== undefined) {
            tmpArr = resp.content;
            tmpArr = resp.content.map((item) => ({
              ...item,
              StartTime: item.createdOnDate,
              EndTime: item.createdOnDate,
              Subject: item.subject,
            }));
            setRowData(tmpArr);
          } else {
            const errorMessage =
              resp.status + " : " + resp.error + " AT " + resp.path;
            callMessageOut(errorMessage);
          }
          // props.changingTableStateRti(false, "CHANGE_RTI"); // setting trigger to false as table got updated
        } catch (e) {
          callMessageOut(e.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function handleChange(value) {
    setdata({
      date: value.getDate(),
      year: value.getFullYear(),
      month: value.getMonth(),
    });
  }

  const handleChanges = (event) => {
    setValue(event.target.value);
  };

  function onActionBegin(args) {
    if (args.requestType === "toolbarItemRendering") {
      let load = { template: document.querySelector("#loader") };
      args.items[2] = load;
    }
  }

  return (
    <>
    {load && <Loading />}
      <Grid container id="mainDiv">
        <Grid style={{ padding: ".5rem 1rem" }}>
          <Grid item xs={12}>
            <Breadcrumb
              routeSegments={[{ name: t("RTI FILE"), path: "/personnel/file" }]}
            />
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={3} style={{ width: "100%" }}>
              <Calendar handleChange={handleChange} />
              <div className="filter-data">
                <Paper
                  style={{
                    padding: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  <FormControl
                    component="fieldset"
                    style={{ marginTop: "10px", fontSize: "16px" }}
                    id="rtifilter"
                  >
                    <FormLabel component="legend">
                      <h5>{t("Filter By Status")}</h5>
                    </FormLabel>
                    <RadioGroup
                      aria-label="filter"
                      value={value}
                      onChange={handleChanges}
                    >
                      <FormControlLabel
                        value="all"
                        onClick={() => loadRegister("All")}
                        // onChange={handleChanges}
                        style={{ color: "black", fontSize: "16px" }}
                        control={<Radio style={{ color: "black" }} />}
                        label={t("All")}
                      />

                      <FormControlLabel
                        value="Responded and Closed"
                        onClick={() =>
                          handleFilterStatus("Responded and Closed")
                        }
                        // onChange={handleChanges}
                        style={{ color: "green" }}
                        control={<Radio style={{ color: "green" }} />}
                        label={t("Responded and Closed")}
                      />

                      <FormControlLabel
                        value="Draft"
                        // onChange={handleChanges}
                        onClick={() => handleFilterStatus("Draft")}
                        style={{ color: "rgb(63 81 181)" }}
                        control={<Radio style={{ color: "rgb(63 81 181)" }} />}
                        label={t("Draft")}
                      />
                      <FormControlLabel
                        value="Pending"
                        style={{ color: "red" }}
                        onClick={() => handleFilterStatus("Pending")}
                        control={<Radio style={{ color: "red" }} />}
                        label={t("Pending")}
                      />
                    </RadioGroup>
                  </FormControl>
                </Paper>
              </div>
            </Grid>

            <Grid
              item
              xs={9}
              style={{
                transition: "width .5s",
                width: open ? "calc(75% - 17%)" : "75%",
                flexBasis: "initial",
              }}
            >
              <div
                className="control-pane"
                id="rtischeduler"
                style={{ backgroundColor: "#f1f1f1" }}
              >
                <div
                  // id="targetElement"
                  className="control-section col-lg-12 defaultDialog dialog-target"
                  id="Rticalender"
                  style={{ width: "100%" }}
                >
                  <ScheduleComponent
                    height={Number(window.innerHeight - 98)}
                    selectedDate={new Date(data.year, data.month, data.date)}
                    currentView="Month"
                    // selectedDate={curr}
                    eventSettings={{ dataSource: rowData }}
                    eventRendered={onEventRendered}
                    popupOpen={onPopupOpen}
                    actionBegin={onActionBegin}
                    readonly={false}
                  >
                    <ViewsDirective>
                      <ViewDirective option="Day" />
                      <ViewDirective option="Week" />
                      <ViewDirective option="WorkWeek" />
                      <ViewDirective isSelected={true} option="Month" />
                    </ViewsDirective>

                    <Inject
                      services={[
                        Day,
                        Week,
                        WorkWeek,
                        Month,
                        Resize,
                        DragAndDrop,
                      ]}
                    />
                  </ScheduleComponent>
                  <Button
                    id="loader"
                    onClick={handleClickRegister}
                    style={{
                      marginTop: "0.6rem",
                      cursor: "pointer",
                      fontSize: "13px",
                      padding: "0px 2px",
                    }}
                  >
                    {" "}
                    {t("REGISTER")}{" "}
                  </Button>
                  {/* <Finalreg /> */}

                 
                </div>
              </div>
            </Grid>
          </Grid>
          <Drawer
            className={classes.drawer}
            id="rtidrawer"
            variant="persistent"
            anchor="right"
            open={open}
            classes={{
              paper: !open
                ? classes.drawerPaperNotOpen
                : classes.drawerPaperOpen,
            }}
          >
            <div className={classes.drawerHeader}>
              <Tooltip title={"CLOSE"} aria-label="close">
                <Close
                  style={{ cursor: "pointer" }}
                  onClick={handleDrawerClose}
                />
              </Tooltip>
              <div
                style={{
                  display: "flex",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  justifyContent: "center",
                  width: "70%",
                }}
              >
                STATUS
              </div>
              {showstatus == "Draft" ? (
                <Tooltip title={"DELETE"} aria-label="close">
                  <DeleteIcon
                    color="primary"
                    style={{ cursor: "pointer" }}
                    onClick={handleDeleteDraft}
                  ></DeleteIcon>
                </Tooltip>
              ) : (
                <></>
              )}
            </div>
            <Divider />
            <List>
              {historyData.map((item, index) => {
                if (index === 0) {
                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: "1rem",
                      }}
                    >
                      <div style={{ marginTop: "1rem" }}>
                        <b>Subject : </b>
                        {item.subject}
                      </div>

                      {/* <div style={{ marginTop: "1rem" }}>
                      <b>Start date : </b>
                      {item.createdOnDate.slice(0, 10)}
                    </div>

                    <div style={{ marginTop: "1rem" }}>
                      <b>End date : </b>
                      {item.endDate.slice(0, 10)}
                    </div> */}

                      {showstatus !== "Draft" ? (
                        <div style={{ marginTop: "1rem" }}>
                          <b>From : </b>
                          {item.to}
                        </div>
                      ) : (
                        <></>
                      )}
                      <div style={{ marginTop: "0.5rem" }}>
                        <b> Status : </b>
                        <span
                          style={{
                            fontWeight: "bold",
                            color:
                              item.status == "Pending"
                                ? "red"
                                : item.status == "Responded and Closed"
                                ? "green"
                                : "",
                          }}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: "1rem",
                      }}
                    >
                      <div style={{ marginTop: "2rem" }}>
                        <b>From : </b>
                        {item.to}
                      </div>

                      <div style={{ marginTop: "0.5rem" }}>
                        <b>Status : </b>
                        <span
                          style={{
                            fontWeight: "bold",
                            color:
                              item.status == "Pending"
                                ? "red"
                                : item.status == "Responded and Closed"
                                ? "green"
                                : "",
                          }}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  );
                }
              })}
            </List>
          </Drawer>
        </Grid>
      </Grid>

      {/* ------------------new grid start ----------- */}
      <Dialog
        open={open1}
        onClose={handleClose}
        id="register1"
        PaperComponent={PaperComponent}
      >
        <DialogTitle
          id="draggable-dialog-title"
          style={{
            cursor: "move",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              style={{ fontSize: "24px", padding: "0.3rem", color: "#0564C8" }}
            >
              RTI
            </Typography>
            <IconButton
              id="RTIregister_close_btn"
              aria-label="close"
              onClick={handleClose}
              className="cancel-drag"
            >
              <Tooltip title={"CLOSE"} aria-label="close">
                <Close color="primary" />
              </Tooltip>
            </IconButton>
          </div>
        </DialogTitle>

        {/* <DialogContent dividers> */}
        <RtiForm
          loadRegister={loadRegister}
          handleClose={handleClose}
          dateRti={date1}
          handleClick1={handleClick1}
          handledata={handledata}
        />


        {/* </DialogContent> */}
      </Dialog>

      <Dialog
                    id="register"
                    open={openregister}
                    onClose={handleCloseRegister}
                    PaperComponent={PaperComponent}
                  >
                    {/* <Paper style={{ width: "85vh !important", }}
                    > */}
                    <DialogTitle
                      id="draggable-dialog-title"
                      style={{ cursor: "move" }}>

                    </DialogTitle>
                    <DialogContent>
                      <Finalreg
                        // handleClose={handleCloseRegister}
                      />
                    </DialogContent>
                    {/* </Paper> */}
                  </Dialog>
    </>
  );
}

function mapStateToProps(state) {
  return {
    props: state.props,
    subscribeApi: state.subscribeApi,
    partCaseid: state.rtiReducer,
  };
}

export default connect(mapStateToProps, {
  loadRtiRegister,
  getStatus,
  getDraftStatus,
  loadRtiList,
  DeleteDraft,
  getFilterStatus,
})(RtiRegister);
