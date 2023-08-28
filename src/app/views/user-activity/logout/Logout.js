import React from "react";
import "./logout.css";
import ReactDOM from "react-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useEffect, useState } from "react";
import HomeIcon from "@material-ui/icons/Home";
import PaginationComp from "app/views/utilities/PaginationComp";
import Axios from "axios";
import Cookies from "js-cookie";
import Feedback from "./Feedback";
import LoginPage from "LoginPage";
import GetAppIcon from "@material-ui/icons/GetApp";
import { CSVLink } from "react-csv";
import { Grid, IconButton, makeStyles, Tooltip } from "@material-ui/core";
import history from "../../../../history";

const Logout = (props) => {
  const [expoertrowdata, setExpoertrowdata] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizes] = useState([5, 10, 15]);
  const [user, setUser] = useState("");
  const [auth, setAuth] = useState("");
  let username = localStorage.getItem("username");

  const getApidata = async () => {
    try {
      setAuth(sessionStorage.getItem("jwt_token"));
      setUser(localStorage.getItem("username"));

      const { data } = await Axios.get("/audit_view_service/api/getaudit", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf8",
          Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
          username: username,
          sessionId: sessionStorage.getItem("sessionId"),
        },
      });
      setExpoertrowdata(data);
    } catch (error) {}
  };

  useEffect(() => {
    getApidata();
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  useEffect(() => {
    if (expoertrowdata) {
      setTotalCount(expoertrowdata.length);
      Cookies.set("userActivities", expoertrowdata);
    }
  }, [expoertrowdata]);

  const gotohome = () => {
    ReactDOM.render(<LoginPage />, document.getElementById("root"));
    history.push({
      pathname: "/eoffice/login",
    });
  };

  return (
    <>
      {/* -------------------------------------------NAV_BAR START--------------------------------------------- */}
      <Grid className="parent_grid_back">
        <div className="topbardivmain">
          <div className="topbardivleft">
            <div className="topbardivleftchild">
              <img
                src={
                  process.env.PUBLIC_URL + "/assets/images/logo-paperless.png"
                }
              ></img>
            </div>
          </div>
          <div className="topbardivright">
            <div className="topbardivrightchild">
              <Tooltip title={"Home"} aria-label="Home">
                <IconButton onClick={gotohome}>
                  <HomeIcon style={{ color: "white" }} />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
        {/* ---------------------------------------------NAV_BAR END------------------------------------------------------------ */}

        <Grid container>
          <Grid item xs={4}>
            <div className="logonel">
              <Feedback user={user} auth={auth} />
            </div>
          </Grid>
          <Grid item xs={8}>
            <div className="side_grid">
              <Paper
                className="audit-seaech-table-z"
                elevation={2}
                style={{
                  position: "relative",
                  borderRadius: "8px",
                  paddingTop: "1rem",
                }}
              >
                <div className="a-info">
                  <span>audit information</span>
                </div>
                <div style={{ padding: "0 1rem" }}>
                  <TableContainer
                    component={Paper}
                    style={{
                      border: `1px solid ${
                        props.theme ? "#727070" : "#c7c7c7"
                      }`,
                    }}
                  >
                    <Table component="div" aria-label="simple table">
                      <TableHead component="div">
                        <TableRow component="div">
                          <div
                            className="audit-search-body-p"
                            style={{
                              borderBottom: `1px solid ${
                                props.theme ? "#727070" : "#c7c7c7"
                              }`,
                              backgroundColor: props.theme
                                ? "#585858"
                                : "#e5e5e5",
                              padding: "0.5rem",
                            }}
                          >
                            <div className="info2">
                              <span>{"ACTION"}</span>
                            </div>
                            <div className="info3">
                              <span>{"MESSAGE"}</span>
                            </div>
                            <div className="info4">
                              <CSVLink
                                data={expoertrowdata}
                                filename="User-Session-data"
                              >
                                <IconButton
                                  style={{ height: "7px", width: "10px" }}
                                >
                                  <Tooltip
                                    title="Download Session data "
                                    aria-label="Download"
                                  >
                                    <GetAppIcon
                                      style={{ color: "rgb(5 100 200)" }}
                                    />
                                  </Tooltip>
                                </IconButton>
                              </CSVLink>{" "}
                            </div>
                          </div>
                        </TableRow>
                      </TableHead>
                      <TableBody
                        className="search-table-body-p"
                        component="div"
                        style={{
                          height: "calc(100vh - 230px)",
                          overflowY: "auto",
                        }}
                      >
                        {expoertrowdata
                          .slice(
                            currentPage * pageSizes + 1,
                            (currentPage + 1) * pageSize
                          )
                          .map((item) => {
                            return (
                              <TableRow
                                hover
                                component="div"
                                selected={item.isChecked}
                              >
                                <div
                                  className="audit-search-body-p"
                                  style={{
                                    borderBottom: `1px solid ${
                                      props.theme ? "#727070" : "#c7c7c7"
                                    }`,
                                    padding: "10px",
                                  }}
                                >
                                  <div className="info2">
                                    <span>{item.action}</span>
                                  </div>
                                  <div className="info3">
                                    <span className="mess-css">
                                      {item.message}
                                    </span>
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
                  currentPage={currentPage}
                  totalCount={totalCount}
                  pageSize={pageSize}
                  pageSizes={pageSizes}
                  setCurrentPage={setCurrentPage}
                  setPageSize={setPageSize}
                />
              </Paper>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Logout;
