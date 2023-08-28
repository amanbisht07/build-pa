import {
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import { Add, Close, Delete } from "@material-ui/icons";
import PaginationComp from "app/views/utilities/PaginationComp";
import React, { useEffect } from "react";
import { useState } from "react";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";
import InputForm from "./quickSignFrom";
import { connect, useDispatch } from "react-redux";
import { CgNotes } from "react-icons/cg";
import {
  loadYlwNotesDataSplitview,
  deleteYlowNote,
} from "app/camunda_redux/redux/action";
import { BmContext } from "./SplitviewContainer/BmContainer/Worker";
import { CoalitionContext } from "./SplitviewContainer/CoalitionContainer/Worker";
import { useContext } from "react";
import Cookies from "js-cookie";
import { Loading } from "../therme-source/material-ui/loading";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: "350px",
  },
  yellowNote_btn: {
    position: "fixed",
    left: "5% !important",
    bottom: "6% !important",
    zIndex: 10,
    maxHeight: "50px",
    minHeight: "50px",
    minWidth: "50px",
    maxWidth: "50px",
  },
}));

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
};

const YlowNotes = (props) => {
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSizes] = useState([5, 10, 15]);
  const classes = useStyles();

  const isCabinet = Cookies.get("isCabinet");
  const isOutbox = Cookies.get("isOutbox");

  const {
    partCaseId,
    addNote,
    setaddNote,
    openYellowNotes,
    handleCount,
    setopenYellowNotes,
  } = useContext(BmContext);

  const [ylwNotes, setylwNotes] = useState([]);
  const [addYlowNote, setaddYlowNote] = useState(false);
  const [loading, setLoading] = useState(false);

  const userRole = sessionStorage.getItem("role");

  const handleYlowNoteAdd = (val) => {
    setaddYlowNote(val);
    setaddNote(false);
  };

  const addedSuccess = (newYloNote) => {
    setylwNotes([...ylwNotes, newYloNote]);
    setaddYlowNote(false);
    handleCount("ylowNote", ylwNotes.length + 1);
    handleYlowNoteAdd(false);
  };

  useEffect(() => {
    if (partCaseId) getYellowNotes();
  }, [partCaseId, currentPage, pageSize]);

  const getYellowNotes = async () => {
    props
      .loadYlwNotesDataSplitview(partCaseId, currentPage, pageSize)
      .then((res) => {
        try {
          if (res.error) {
            callMessageOut("error", res.error);
            return;
          } else {
            setylwNotes(res.data);
            setTotalCount(res.size);
            handleCount("ylowNote", res.size);
          }
        } catch (e) {
          console.log(e.message);
          callMessageOut("error", res.error);
        }
      })
      .catch((err) => {
        console.log(err);
        callMessageOut("error", err.error);
      });
  };

  const handleDelete = (note, index) => {
    setLoading(true);
    props
      .deleteYlowNote(note.id, note.user)
      .then((res) => {
        try {
          if (res.error) {
            callMessageOut("error", res.error);
            setLoading(false);
            return;
          } else {
            const tmpArr = ylwNotes.filter((item, i) => item.id !== res.id);
            setylwNotes(tmpArr);
            handleCount("ylowNote", tmpArr.length);
            callMessageOut("success", "Yellow Note Deleted Successfully");
            setLoading(false);
          }
        } catch (e) {
          console.log(e.message);
          callMessageOut("error", e.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        callMessageOut(err.message);
        setLoading(false);
      });
  };

  const callMessageOut = (type, message) => {
    dispatch(setSnackbar(true, type, message));
  };

  return (
    <>
      <Dialog
        open={openYellowNotes}
        PaperComponent={PaperComponent}
        onClose={() => setopenYellowNotes(false)}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          <span>{t("YELLOW NOTES")}</span>
          <IconButton
            id="remark_dialog_close_button"
            aria-label="close"
            onClick={() => setopenYellowNotes(false)}
            color="primary"
            className="cancel-drag"
          >
            <Close style={{ color: props.theme ? "#fff" : "#000" }} />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Paper
            style={{
              width: "100%",
              position: "relative",
              borderRadius: "6px",
              border: `1px solid ${props.theme ? "#727272" : "#c7c7c7"}`,
            }}
          >
            {loading && <Loading />}
            <TableContainer component={Paper} className="ylowNoteTableCon">
              <Table
                component="div"
                className={`${classes.table} App-main-table`}
                aria-label="simple table"
              >
                <div>
                  <div className="yellow_note_table_head">
                    <div>
                      <span>{t("date")}</span>
                    </div>
                    <div>
                      <span>{t("by")}</span>
                    </div>
                    <div>
                      <span>{t("yellow note")}</span>
                    </div>
                  </div>
                </div>
                <TableBody
                  component="div"
                  style={{
                    height: "30vh",
                  }}
                >
                  {/* Mapping data coming from backnd */}
                  {ylwNotes.map((item, i) => {
                    // Row defination and styling here
                    let color = item.color.toLowerCase();
                    return (
                      <TableRow
                        hover
                        component="div"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        key={i}
                        style={{
                          border: "1px solid #8080805c",
                          borderWidth: "0px 0px 1px 0px",
                          position: "relative",
                        }}
                      >
                        <div
                          className="ylowNote_table_row"
                          style={{
                            borderBottom: `1px solid ${props.theme ? "#727070" : "#c7c7c7"
                              }`,
                            display: "grid",
                            gridTemplateColumns: "2fr 2fr 4fr",
                            alignItems: "center",
                            textAlign: "center",
                          }}
                        >
                          <div className="ylowNote_info1">
                            <span>{item.createdOn}</span>
                          </div>
                          <div className="ylowNote_info2">
                            <span>{item.user}</span>
                          </div>
                          <div className="ylowNote_info_3">
                            <span
                              style={{
                                color: color,
                                fontWeight: "bold",
                              }}
                            >
                              {item.comment}
                            </span>
                            {userRole === item.user && (
                              <IconButton
                                onClick={() => {
                                  handleDelete(item, i);
                                }}
                              >
                                <Delete color="error" />
                              </IconButton>
                            )}
                          </div>
                        </div>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <PaginationComp
              pageSize={pageSize}
              pageSizes={pageSizes}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              totalCount={totalCount}
              setPageSize={setPageSize}
            />
          </Paper>
        </DialogContent>

        {!isCabinet && !isOutbox && (
          <DialogActions>
            <Button
              id="ylow_note_add_btn"
              variant="contained"
              color="secondary"
              onClick={() => {
                handleYlowNoteAdd(true);
              }}
              endIcon={<Add />}
            >
              {t("NEW YELLOW NOTE")}
            </Button>
          </DialogActions>
        )}
      </Dialog>

      <Dialog
        open={addYlowNote || addNote}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        id="ylow-note"
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
          onClose={() => handleYlowNoteAdd(false)}
        >
          <span>{t("create_yellow_note")}</span>
          <IconButton
            id="Enclosure_remark_&_sign"
            aria-label="close"
            onClick={() => handleYlowNoteAdd(false)}
            color="primary"
            className="cancel-drag"
          >
            <Close style={{ color: props.theme ? "#fff" : "#000" }} />
          </IconButton>
        </DialogTitle>
        {/* passing two prope in isYlowNote so addYlowNote dialog can be opened by both showYlowNotes or addYlowNote btn */}
        <InputForm
          isYloNote={addYlowNote || addNote}
          addedSuccess={addedSuccess}
        />
      </Dialog>
    </>
  );
};

function mapStateToProps(state) {
  return {
    theme: state.theme,
  };
}

export default connect(mapStateToProps, {
  loadYlwNotesDataSplitview,
  deleteYlowNote,
})(YlowNotes);
