
import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/styles";
import RtiFileTable from "../RTI/sharedComponents/RtiFileTable";
import RtiRegister from "./sharedComponents/RtiRegister";
import { Breadcrumb } from "../../../../src/matx";
import StartProcessPage from "../initiate/shared/startProcess/StartProcessPage";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { element, PropTypes } from "prop-types";
import RtiForm from "./sharedComponents/RtiForm";
import { withTranslation } from "react-i18next";
import Draggables from "react-draggable";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Loading } from "../inbox/therme-source/material-ui/loading";
import "../inbox/therme-source/material-ui/loading";
import CloseIcon from "@material-ui/icons/Close";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import Finalreg from "./sharedComponents/Finalreg";
import { getStatus } from "app/camunda_redux/redux/action/index";
import Cookies from "js-cookie";

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

const styles = (theme) => ({});

const RtiCombo = (props) => {
  const [open, setOpen] = useState(false);
  const [openPa, setopenPa] = useState(false);
  const [openInfo, setopenInfo] = useState(false);
  const [loading, setloading] = useState(false);
  const [blnDisableButtoms, setblnDisableButtoms] = useState(false);
  const [Active, setActive] = useState(false);
  const [pa, setpa] = useState(false);
  const [pf, setpf] = useState(true);
  const [updateSubject, setupdateSubject] = useState(false);
  const [draftSubject, setdraftSubject] = useState("");
  const [draftId, setdraftId] = useState("");
  const [close, setClose] = useState(true);
  const [fr, setfr] = useState(true);
  const [totalCount, settotalCount] = useState(0);
  const sidebar = useRef();
  const [panelOpen, setPanelOpen] = useState(false);
  const [Container, setContainer] = useState([
    {
      id: 1,
      // name: "rti_file_table",

      component: (
        // <RtiFileTable
        //   blnDisableButtoms={blnDisableButtoms}
        //   handleClick={() => setopenPa(true)}
        //   handleUpdateSubject={(val, open) => {
        //     setopenPa(true);
        //     setupdateSubject(open);
        //     setdraftSubject(val.subject);
        //     setdraftId(val.rtiId);
        //   }}
        //   blnEnableLoader={(val) => setloading(val)}
        // />
        <RtiRegister/>
      ),
      width: 4,
    },
  ]);

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    let formData = new FormData();
    formData.append("username", username);
  }, []);

  useEffect(() => {
    Cookies.remove("inboxFile");
    Cookies.remove("priority");
    Cookies.remove("referenceNumber");
    Cookies.remove("hasCoverNote");
    Cookies.remove("type");
    Cookies.remove("partCaseId");
    Cookies.remove("isRti");
    Cookies.remove("partcaseId");
    Cookies.remove("isRegister");
  }, []);

  const handllive = () => {
    setpf(false);
    setpa(true);
    setfr(true);
  };
  const handlereg = () => {
    setfr(false);
    setpf(true);
    setpa(true);
  };
  const handleCloseEvent = (e) => {
    // callback function that fires when record of Personal File has been saved
    setOpen(e);
  };

  const handleShow = () => {
    setpa(false);
    setpf(true);
    setfr(true);
  };

  const dragEnd = (result) => {
    // const containerItems = [...Container];
    // const [orderedContainer] = containerItems.splice(result.source.index, 1);
    // containerItems.splice(result.destination.index, 0, orderedContainer);
    // setContainer(containerItems);
  };

  const { t, myInfo } = props;

  return (
    <>
      <div className="m-sm-30">
        {/* process.env.PUBLIC_URL + `/assets/icons/send-plane-fill.svg` */}
        {/* <Grid container spacing={2}>
          <Grid item xs={12}>
            <Breadcrumb
              routeSegments={[{ name: t("rti"), path: "/rti/file" }]}
            />
          </Grid>
        </Grid> */}
        <Grid
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.3rem",
          }}
        >
          <Grid item>
            {!fr ? (
              <Finalreg />
            ) : !pf ? (
              <RtiFileTable
          blnDisableButtoms={blnDisableButtoms}
          handleClick={() => setopenPa(true)}
          handleUpdateSubject={(val, open) => {
            setopenPa(true);
            setupdateSubject(open);
            setdraftSubject(val.subject);
            setdraftId(val.rtiId);
          }}
          blnEnableLoader={(val) => setloading(val)}
        />
            ) : (
              <DragDropContext onDragEnd={dragEnd}>
                <Droppable
                  droppableId="itemSequence"
                  direction="horizontal"
                  type="column"
                >
                  {(provided) => (
                    <Grid
                      container
                      // justifyContent="center"
                      spacing={1}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {Container.map(({ component, width, id }, i) => (
                        <Draggable
                          draggableId={`draggable-${i}`}
                          key={`draggable-${i}`}
                          index={i}
                        >
                          {(provided) => (
                            <Grid
                              item
                              md={
                                Container.length === 1
                                  ? 12
                                  : Container.length === 2
                                  ? 6
                                  : width
                              }
                              sm={6}
                              xs={12}
                              className="personal-file"
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              // style={{position: "relative"}}
                            >
                              <div style={{ position: "relative" }}>
                                <Tooltip title={t("cancel")}>
                                  <IconButton
                                    id="RTI_cancel_button"
                                    size="small"
                                    style={{ color: "lightgrey" }}
                                    className="icons-button"
                                    // onClick={() => handleRemove(id)}
                                  >
                                    <CancelOutlinedIcon fontSize="medium" />
                                  </IconButton>
                                </Tooltip>

                                {component}
                              </div>
                            </Grid>
                          )}
                        </Draggable>
                      ))}

                      {loading && <Loading />}
                      {provided.placeholder}
                    </Grid>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </Grid>

          <Grid item>
            <ul
              style={{
                position: "fixed",
                right: "16px",
                padding: 0,
              }}
            >
              {pa ? (
                <li className="hide1" onClick={() => handleShow()}>
                  CALENDER VIEW
                </li>
              ) : (
                <li
                  className="hide"
                  style={{ userSelect: "none", cursor: "default" }}
                >
                  CALENDER VIEW
                </li>
              )}

              {pf ? (
                <li className="hide1" onClick={() => handllive()}>
                  TABLE VIEW
                </li>
              ) : (
                <li
                  className="hide"
                  onClick={() => handllive()}
                  style={{ userSelect: "none", cursor: "default" }}
                >
                  TABLE VIEW
                </li>
              )}

              {/* {fr ? (
                <li className="hide2" onClick={() => handlereg()}>
                  FINAL REGISTER
                </li>
              ) : (
                <li
                  className="hide"
                  style={{ userSelect: "none", cursor: "default" }}
                  onClick={() => handlereg()}
                >
                  FINAL REGISTER
                </li>
              )} */}
            </ul>
          </Grid>
        </Grid>

        <div>
          <Dialog
            open={openPa}
            aria-labelledby="draggable-dialog-title"
            PaperComponent={PaperComponent}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle
              id="draggable-dialog-title"
              style={{ padding: "0px 24px !important", cursor: "move" }}
            >
              {t("CREATE RTI ")}
              <Tooltip title={t("cancel")}>
                <IconButton
                  id="createRTI_cancel_button"
                  aria-label="close"
                  onClick={() => setopenPa(false)}
                  color="primary"
                  style={{
                    float: "right",
                    cursor: "pointer",
                    position: "relative",
                    top: "-9px",
                  }}
                  className="cancel-drag"
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </DialogTitle>
            <DialogContent dividers pt={0}>
              <RtiForm
                handleClose={() => setopenPa(false)}
                updateSubject={updateSubject}
                draftSubject={draftSubject}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  theme: state.theme,
});
export default withRouter(
  connect(mapStateToProps, { getStatus })(withTranslation()(RtiCombo))
);
