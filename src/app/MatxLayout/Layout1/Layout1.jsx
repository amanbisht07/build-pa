import React, { Component } from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { setLayoutSettings } from "app/redux/actions/LayoutActions";
import { Paper, withStyles } from "@material-ui/core";
import { isMdScreen, classList, isMobile } from "utils";
import { renderRoutes } from "react-router-config";
import Layout1Topbar from "./Layout1Topbar";
import Layout1Sidenav from "./Layout1Sidenav";
import Footer from "../SharedCompoents/Footer";
import "./Layout1.css";
import AppContext from "app/appContext";
import { BotProvider } from "app/eOfficeBot/BotContext";
import BotContainer from "app/eOfficeBot/BotContainer";
import history from "../../../history";

const styles = (theme) => {
  return {
    layout: {
      backgroundColor: theme.palette.background.default,
    },
  };
};

class Layout1 extends Component {
  state = {
    show: false,
    showHam: false,
  };

  oldScroll = 0;

  UNSAFE_componentWillMount() {
    // if (isMdScreen()) {
    //   this.updateSidebarMode({ mode: "close" });
    // }
  }

  componentWillUnmount() {}

  updateSidebarMode = (sidebarSettings) => {
    let { settings, setLayoutSettings } = this.props;
    setLayoutSettings({
      ...settings,
      layout1Settings: {
        ...settings.layout1Settings,
        leftSidebar: {
          ...settings.layout1Settings.leftSidebar,
          ...sidebarSettings,
        },
      },
    });
  };

  handleScroll = (event) => {
    this.setState({ show: true });
  };

  toggleHam = (val) => {
    this.setState({
      showHam: val,
    });
  };

  componentDidMount() {
    window.addEventListener("resize", (e) => {
      if (!isMobile()) {
        this.toggleHam(false);
      }
    });

    history.push({
      pathname: "/eoffice/dashboard/analytics",
    });
    
  }

  render() {
    let { settings, classes, theme, appRoutes } = this.props;

    let { validRoutes } = this.context;
    let { layout1Settings } = settings;
    let layoutClasses = {
      [classes.layout]: true,
      [`${settings.activeLayout} sidenav-${layout1Settings.leftSidebar.mode} theme-${theme.palette.type} flex`]: true,
      "topbar-fixed": layout1Settings.topbar.fixed,
    };
    return (
      <div className={classList(layoutClasses)}>
        <Layout1Sidenav
          showHam={this.state.showHam}
          toggleHam={this.toggleHam}
        />

        <div className="content-wrap position-relative">
          <Layout1Topbar
            className="elevation-z8"
            showHam={this.state.showHam}
            toggleHam={this.toggleHam}
          />
          <div className={this.props.appTheme ? "darkTheme" : ""}>
            <Paper
              className="content module-mount-container"
              style={{
                minHeight: "100vh",
                backgroundColor: this.props.appTheme
                  ? "rgb(46 46 46)"
                  : "rgb(241 241 241)",
              }}
            >
              {renderRoutes(validRoutes)}
            </Paper>
            <div className="my-auto" />
          </div>
          <Footer show={this.state.show} />
        </div>

        {/* <BotProvider>
          <BotContainer />
        </BotProvider> */}
      </div>
    );
  }
}

Layout1.contextType = AppContext;

Layout1.propTypes = {
  settings: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  // console.log(state.layout);
  return {
    setLayoutSettings: PropTypes.func.isRequired,
    settings: state.layout.settings,
    appTheme: state.theme,
    appRoutes: state.appRoutes,
  };
};

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, { setLayoutSettings })(Layout1)
);
