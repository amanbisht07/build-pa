import React, { Component, Fragment } from "react";
import { Button, ButtonGroup, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { Breadcrumb } from "../../../matx";
import OutboxTable from "./shared/OutboxTable";
import { Loading } from "./therme-source/material-ui/loading";
import { withTranslation } from "react-i18next";
import { clearCookie } from "utils";

class Outbox1 extends Component {
  state = {
    loading: false,
  };

  componentDidMount() {
    sessionStorage.removeItem("InboxID");
    sessionStorage.removeItem("pa_id");
    sessionStorage.removeItem("partcaseID");
    clearCookie();
  }

  render() {
    let { theme } = this.props;
    const { loading } = this.state;

    return (
      <>
        {loading && <Loading />}
        <div className="m-sm-30">
          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={12}>
              <Breadcrumb
                routeSegments={[
                  { name: this.props.t("outbox"), path: "/inbox/file" },
                ]}
              />
            </Grid>
          </Grid>
          <div className="mt-0">
            <Grid container>
              <Grid item xs={12} className="outbox-table">
                <OutboxTable
                  blnEnableLoader={(val) => this.setState({ loading: val })}
                />
              </Grid>
            </Grid>
          </div>
        </div>
      </>
    );
  }
}

export default withStyles({}, { withTheme: true })(withTranslation()(Outbox1));
