import React, { Component, createContext } from "react";
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
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";

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

const Personnel = (props) => {
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
    const [fr, setfr] = useState(true)
    const [totalCount, settotalCount] = useState(0)

    const [Container, setContainer] = useState([
        {
            id: 1,
            name: "rti_file_table",

            component: (
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
            ),
            width: 4,
        },
    ]);

    const [Container1, setContainer1] = useState([
        {
            id: 1,
            name: "rti_file_table",

            component: (
                <RtiFileTable
                    blnDisableButtoms={blnDisableButtoms}
                    handleClick={() => setopenPa(true)}
                    handleUpdateSubject={(val) => {

                        setopenPa(true);
                        setupdateSubject(true);
                        setdraftSubject(val.subject);
                        setdraftId(val.id);
                    }}
                    blnEnableLoader={(val) => setloading(val)}
                />
            ),
            width: 4,
        },

        {
            id: 2,
            name: "my_rti_register",
            component: <RtiRegister />,
            width: 4,
        },
    ]);

    useEffect(() => {
        console.log({
            open,
            openPa,
            openInfo,
            loading,
            blnDisableButtoms,
            Active,
            pa,
            pf,
            updateSubject,
            draftSubject,
            draftId,
        });

        const username = sessionStorage.getItem("username");
        let formData = new FormData();
        formData.append("username", username);
        props.getPersonalInfo(formData).then((res) => {
            if (res.status === "OK") {
                setblnDisableButtoms(false);
            } else {
                setblnDisableButtoms(true);
            }
        });

        if (props.myInfo === false) {
            setopenInfo(true);
        } else {
            setopenInfo(false);
        }
    }, []);

    const handlereg = () => {
        setfr(!fr);
    }
    const handleCloseEvent = (e) => {
        // callback function that fires when record of Personal File has been saved
        setOpen(e);
    };

    const handleRemove = (id) => {
        if (Container.length === 2 || container.length === 3) {
            const newList = Container.filter((item) => item.id !== id);

            setContainer(newList);

            if (id === 1) {
                setpa(true);
            } else if (id === 2) {
                setpf(true);
            }
            else if (id === 3) {
                setfr(true);
            }
        }
    };

    const handleShow = (id) => {
        let arr = [];
        Container1.map((element) => {
            Container.map((item) => {
                if (item.id === element.id) {
                    arr.push(item);
                }
            });
        });

        let showItem = Container1.find((item) => item.id === id);
        arr.push(showItem);

        setContainer(arr);

        if (id === 2) {
            setpf(false);
        } else if (id === 1) {
            setpa(false);
        }
    };

    const handleCloseEventPA = (e) => {
        // callback function that fires when record of Personal File has been saved
        setopenPa(e)
    };

    const dragEnd = (result) => {
        const containerItems = [...Container];
        console.log({ containerItems });

        const [orderedContainer] = containerItems.splice(result.source.index, 1);
        containerItems.splice(result.destination.index, 0, orderedContainer);
        console.log({ containerItems });

        setContainer(containerItems);
    };

    const { t, myInfo } = props;

    return (
        <>
            <div className="m-sm-30">
                {/* process.env.PUBLIC_URL + `/assets/icons/send-plane-fill.svg` */}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Breadcrumb
                            routeSegments={[{ name: t("rti"), path: "/rti/file" }]}
                        />
                    </Grid>
                </Grid>
                <Grid
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1.3rem",
                    }}
                >
                    <Grid item>
                        {!fr ? (
                            <Finalreg />
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
                                            {Container.map(
                                                ({ component, width, id }, i) => (
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
                                                                            id="RTIfunc_cancel_button"
                                                                            size="small"
                                                                            style={{ color: "lightgrey" }}
                                                                            className="icons-button"
                                                                            onClick={() => handleRemove(id)}
                                                                        >
                                                                            <CancelOutlinedIcon fontSize="medium" />
                                                                        </IconButton>
                                                                    </Tooltip>

                                                                    {component}
                                                                </div>
                                                            </Grid>
                                                        )}
                                                    </Draggable>
                                                )
                                            )}

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
                            {this.state.pa ? (
                                <li className="hide1" onClick={() => handleShow(1)}>
                                    RTI
                                </li>
                            ) : (
                                <li
                                    className="hide"
                                    style={{ userSelect: "none", cursor: "default" }}
                                >
                                    RTI
                                </li>
                            )}

                            {this.state.pf ? (
                                <li className="hide1" onClick={() => handleShow(2)}>
                                    LIVE REGISTER
                                </li>
                            ) : (
                                <li
                                    className="hide"
                                    style={{ userSelect: "none", cursor: "default" }}
                                >
                                    LIVE REGISTER
                                </li>
                            )}

                            {this.state.fr ? (
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
                            )}
                        </ul>
                    </Grid>
                </Grid>

                <div>
                    <Dialog
                        open={openPA}
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
                                    id="RTIfunc_close_button"
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
                <SidebarComponent
                    id="defaultSidebar"
                    ref={sidebar}
                    className="default-sidebar"
                    width="260px"
                    position="Left"
                    style={{ visibility: "hidden" }}
                >
                    <div></div>
                </SidebarComponent>
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    getPersonalInfo: PropTypes.func.isRequired,
    theme: state.theme,
    myInfo: state.myInfo,
});

export default withRouter(
    connect(mapStateToProps, { getPersonalInfo })(withTranslation()(Personnel))
);
