import React, { useState, useEffect, createContext } from "react";
import { Grid } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { getStatus } from "app/camunda_redux/redux/action/index";
import CabinetTableView from "./CabinetTableView";
import ExternalCabinet from "./ExternalCabinet";
import PermanentlyClose from "./PermanentlyClose";
import "./index.css";
import { clearCookie } from "utils";

import { Breadcrumb } from "matx";
import { Loading } from "../therme-source/material-ui/loading";

export const AdvanceSearchContext = createContext();

const CabinetView = (props) => {
  /*--------------------------using useContext for advance Search---------------------------------*/

  const initialValues = {
    text: "",
    sendBy: "",
    createdBy: "",
    fileNo: "",
    subject: "",
    status: "",
    CreatedOn: "",
    scope: "",
  };
  const [advanceState, setAdvanceState] = useState(initialValues);

  const AdvanceOnChange = (name, value) => {
    setAdvanceState({ ...advanceState, [name]: value });
  };

  const handleReset = () => {
    setAdvanceState(initialValues);
  };

  /*--------------------------using useContext for advance Search---------------------------------*/

  const [cab, setCab] = useState(false);
  const [closefile, setClosefile] = useState(true);
  const [permanentClose, setpermanentClose] = useState(true);
  const [cabinet, setCabinet] = useState(true);
  const [extCabinet, setextCabinet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scope, setScope] = useState("")

  useEffect(() => {
    const username = localStorage.getItem("username");
    let formData = new FormData();
    formData.append("username", username);
  }, []);

  const handleLoading = (val) => {
    setLoading(val);
  };
  useEffect(() => {
    sessionStorage.removeItem("InboxID");
    sessionStorage.removeItem("pa_id");
    sessionStorage.removeItem("partcaseID");
    clearCookie();
  }, []);

  const handleShow = () => {
    setCab(false);
    setCabinet(true);
    setClosefile(true);
    setpermanentClose(true);
    AdvanceOnChange("scope", "internal");
    setScope("internal")
  };

  const handleclose = () => {
    setClosefile(false);
    setCab(true);
    setCabinet(false);
    setpermanentClose(true);
    setextCabinet(true);
    AdvanceOnChange("scope", "external");
    setScope("external")
  };
  const handlepClose = () => {
    setClosefile(true);
    setCab(true);
    setCabinet(true);
    setpermanentClose(false);
    AdvanceOnChange("scope", "closed");
    setScope("closed")
  };
  const { t } = props;

  return (
    <AdvanceSearchContext.Provider
      value={{ ...advanceState, scope, AdvanceOnChange, handleReset }}
    >
      <div className="m-sm-30">
        {loading && <Loading />}
        <Grid container className="cabinate_container">
          <Grid item xs={12}>
            <Breadcrumb
              routeSegments={[{ name: t("cabinet"), path: "/personnel/file" }]}
            />
          </Grid>
          <Grid
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.3rem",
            }}
            item
            xs={12}
          >
            {/* <Grid item>
              {cabinet ? (
                <CabinetTableView handleLoading={handleLoading} />
              ) : extCabinet ? (
                <ExternalCabinet handleLoading={handleLoading} />
              ) : (
                <PermanentlyClose handleLoading={handleLoading} />
              )}
            </Grid> */}
            <Grid item>
              {cabinet ? (
                <CabinetTableView handleLoading={handleLoading} />
              ) : (
                <ExternalCabinet handleLoading={handleLoading} />
              )}
            </Grid>

            <Grid item>
              <ul
                style={{
                  // position: "fixed",
                  right: "16px",
                  padding: 0,
                }}
              >
                {cab ? (
                  <li className="hide1" onClick={() => handleShow()}>
                    INTERNAL
                  </li>
                ) : (
                  <li
                    className="hide"
                    style={{ userSelect: "none", cursor: "default" }}
                  >
                    INTERNAL
                  </li>
                )}

                {closefile ? (
                  <li className="hide1" onClick={() => handleclose()}>
                    EXTERNAL
                  </li>
                ) : (
                  <li
                    className="hide"
                    onClick={() => handleclose()}
                    style={{ userSelect: "none", cursor: "default" }}
                  >
                    EXTERNAL
                  </li>
                )}
                {/* {permanentClose ? (
                  <li className="hide1" onClick={() => handlepClose()}>
                    CLOSED
                  </li>
                ) : (
                  <li
                    className="hide"
                    onClick={() => handlepClose()}
                    style={{ userSelect: "none", cursor: "default" }}
                  >
                    CLOSED
                  </li>
                )} */}
              </ul>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </AdvanceSearchContext.Provider>
  );
};

const mapStateToProps = (state) => ({
  theme: state.theme,
});
export default withRouter(
  connect(mapStateToProps, { getStatus })(withTranslation()(CabinetView))
);
