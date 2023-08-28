import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";
import StatCards from "./shared/StatCards";
import "./shared/loading.css";
import { clearCookie } from "utils";

class Dashboard1 extends Component {
  state = {};

  componentDidMount() {
    sessionStorage.removeItem("InboxID");
    sessionStorage.removeItem("pa_id");
    sessionStorage.removeItem("partcaseID");
    clearCookie();
  }

  render() {
    let { theme } = this.props;

    return (
      <Fragment>
        <div style={{ margin: "15px" }}>
          <Grid container spacing={3}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <StatCards theme={theme} />
            </Grid>
          </Grid>
        </div>
      </Fragment>
    );
  }
}

export default withStyles({}, { withTheme: true })(Dashboard1);
