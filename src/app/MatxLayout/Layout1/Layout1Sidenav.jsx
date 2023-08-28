import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import {
  Switch,
  Icon,
  withStyles,
  MenuItem,
  Tooltip,
  IconButton,
  MuiThemeProvider,
} from "@material-ui/core";

import { connect } from "react-redux";
import {
  setLayoutSettings,
  setDefaultSettings,
} from "app/redux/actions/LayoutActions";
import { logoutUser } from "app/redux/actions/UserActions";
import { withRouter } from "react-router-dom";
import "./SideNav.css";
import Sidenav from "../SharedCompoents/Sidenav";
import Brand from "../SharedCompoents/Brand";
import SidenavTheme from "../MatxTheme/SidenavTheme";
import { isMdScreen } from "utils";
import Cookies from "js-cookie";

const styles = (theme) => ({});

class Layout1Sidenav extends Component {
  state = {
    sidenavToggleChecked: true,
    // hidden: true
  };

  // UNSAFE_componentWillMount() {
  //   // CLOSE SIDENAV ON ROUTE CHANGE ON MOBILE
  //   this.unlistenRouteChange = this.props.history.listen((location, action) => {
  //     if (isMdScreen()) {
  //       this.updateSidebarMode({ mode: "close" });
  //     }
  //   });
  // }

  // componentWillUnmount() {
  //   this.unlistenRouteChange();
  // }

  updateSidebarMode = (sidebarSettings) => {
    let { settings, setLayoutSettings, setDefaultSettings } = this.props;
    const updatedSettings = {
      ...settings,
      layout1Settings: {
        ...settings.layout1Settings,
        leftSidebar: {
          ...settings.layout1Settings.leftSidebar,
          ...sidebarSettings,
        },
      },
    };
    setLayoutSettings(updatedSettings);
    setDefaultSettings(updatedSettings);
  };

  handleSidenavToggle = () => {
    let { sidenavToggleChecked } = this.state;
    let mode = sidenavToggleChecked ? "full" : "compact";
    Cookies.set("ViewSideNav", sidenavToggleChecked);
    this.updateSidebarMode({ mode });
    this.setState({ sidenavToggleChecked: !sidenavToggleChecked });
  };

  handleSignOut = () => {
    this.props.logoutUser();
  };

  renderLogoSwitch = () => (
    // Open Brand component file to replace logo and text

    <Brand>
      <div className="side-logo">
        <img
          src={process.env.PUBLIC_URL + "/assets/images/logo-paperless2.png"}
          alt="EOffice"
          style={{ imageRendering: "-webkit-optimize-contrast", opacity: "0" }}
        />
      </div>
      <Switch
        className="sidenav__toggle show-on-lg"
        // onChange={this.handleSidenavToggle}
        checked={!this.state.sidenavToggleChecked}
        color="secondary"
        style={{ opacity: "0" }}
      />
    </Brand>
  );

  renderUser = () => {
    let { user } = this.props;
    return <div className="sidenav__user"></div>;
  };

  render() {
    let { theme, settings, showHam, toggleHam } = this.props;
    const sidenavTheme =
      settings.themes[settings.layout1Settings.topbar.theme] || theme;
    return (
      <MuiThemeProvider theme={sidenavTheme}>
        <SidenavTheme theme={sidenavTheme} settings={settings} />
        <div
          className={`sidenav ${showHam ? "showHam" : ""}`}
          style={{
            background: `${theme ? "rgb(40 40 40)" : "white"}`,
          }}
        >
          <div className="sidenav__hold">
            {
              <Fragment>
                {/* {this.renderLogoSwitch()} */}
                <Sidenav showHam={showHam} toggleHam={toggleHam}></Sidenav>
              </Fragment>
            }
          </div>
        </div>

        {/* below is dark overlay for sidebar */}
        <div
          onClick={() => {
            // this.updateSidebarMode({ mode: "close" })
            toggleHam(!showHam);
          }}
          className={`${showHam ? "sideNav-overlay" : ""}`}
        />
      </MuiThemeProvider>
    );
  }
}

Layout1Sidenav.propTypes = {
  setLayoutSettings: PropTypes.func.isRequired,
  setDefaultSettings: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  setDefaultSettings: PropTypes.func.isRequired,
  setLayoutSettings: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  user: state.user,
  settings: state.layout.settings,
  theme: state.theme,
});

export default withStyles(styles, { withTheme: true })(
  withRouter(
    connect(mapStateToProps, {
      setLayoutSettings,
      setDefaultSettings,
      logoutUser,
    })(Layout1Sidenav)
  )
);
