import {
  Fab,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { Breadcrumb } from "matx";
import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import FileForm from "./FileForm";
import "../therme-source/material-ui/loading.css";
import PaginationComp from "app/views/utilities/PaginationComp";

const useStlyes = makeStyles({
  root: {
    padding: ".5rem 1rem",
  },
  paper_comp: {
    borderRadius: "9px",
  },
  file_header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ".5rem 1rem",
  },
});

const index = () => {
  const { t } = useTranslation();
  const classes = useStlyes();
  const [openForm, setOpenForm] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  function handleForm() {
    setOpenForm(!openForm);
  }

  return (
    <>
      <Grid className={classes.root}>
        <Breadcrumb routeSegments={[{ name: t("file"), path: "/File/file" }]} />
        <Grid container={true} spacing={2}>
          <Grid item xs={12}>
            <Paper
              elevation={3}
              style={{
                position: "relative",
                borderRadius: "9px",
              }}
            >
              <div className="FileHeader">
                <Typography variant="h5" component="h5">
                  {t("draft_file")}
                </Typography>
                <Fab
                  id="create_file_btn"
                  style={{
                    height: ".1rem",
                    width: "2.2rem",
                    cursor: "pointer",
                    marginTop: "6px",
                    marginLeft: "2px",
                    backgroundColor: "#5f78c4",
                  }}
                  onClick={handleForm}
                >
                  <Tooltip title={t("create_file")}>
                    <Add style={{ fontSize: "20", color: "#fff" }} />
                  </Tooltip>
                </Fab>
              </div>

              <div style={{ padding: "0 1rem" }}>
                <TableContainer
                  component={Paper}
                  className="FileTableCon"
                  style={{
                    border: `1px solid #8080805c`,
                  }}
                >
                  <Table
                    component="div"
                    className={`${classes.table} App-main-table`}
                    aria-label="simple table"
                  >
                    <TableHead
                      component="div"
                      style={{
                        backgroundColor: "#8080805c",
                      }}
                    >
                      <TableRow component="div">
                        <div className="FileRow">
                          <div></div>
                          <div>
                            <span>{t("file_name")}</span>
                          </div>
                          <div>
                            <span>{t("type")}</span>
                          </div>
                          <div>
                            <span>{t("created_on")}</span>
                          </div>
                          <div>
                            <span>{t("subject")}</span>
                          </div>
                        </div>
                      </TableRow>
                    </TableHead>
                    <TableBody
                      component="div"
                      style={{
                        height: `calc(100vh - 260px )`,
                        overflowY: "auto",
                      }}
                    >
                      {/* Mapping data coming from backnd */}
                      {[].map((item, i) => {
                        const sts = item.status;

                        return (
                          <TableRow
                            hover
                            component="div"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClick(item);
                            }}
                            key={i}
                            style={{
                              // backgroundColor: bgc,
                              borderBottom: "1px solid #8080805c",
                              position: "relative",
                            }}
                          >
                            <div className="FileRow body">
                              <div>
                                <span>{item.serialNo}</span>
                              </div>
                              <div>
                                <span>{item.pfileName}</span>
                              </div>
                              <div>
                                <span>{item.type}</span>
                              </div>
                              <div>
                                <span>{item.createdOn}</span>
                              </div>
                              <div className="text-overflow">
                                <Tooltip
                                  title={item.subject}
                                  aria-label="text-adjust"
                                >
                                  <span>{item.subject}</span>
                                </Tooltip>
                              </div>
                            </div>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <PaginationComp
                pageSize={pageSize}
                pageSizes={[5, 10, 15]}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalCount={totalCount}
                setPageSize={setPageSize}
              />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <FileForm handleForm={handleForm} openForm={openForm} />
    </>
  );
};

export default index;
