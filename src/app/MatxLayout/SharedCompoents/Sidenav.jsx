import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// import { navigations } from "../../navigations";

import { setLayoutSettings } from "app/redux/actions/LayoutActions";
import MatxVerticalNav from "../../../matx/components/MatxVerticalNav/MatxVerticalNav";
import { withTranslation } from "react-i18next";
import { Icon, Tooltip, Typography } from "@material-ui/core";

import FolderIcon from "@material-ui/icons/Folder";
// import KitchenIcon from "@mui/icons-material/Kitchen";

import { Class, SupervisedUserCircle } from "@material-ui/icons";
import KitchenIcon from "@material-ui/icons/Kitchen";
import DashboardIcon from "@material-ui/icons/Dashboard";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";
import DraftsRoundedIcon from "@material-ui/icons/DraftsRounded";
import SearchIcon from "@material-ui/icons/Search";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import ReceiptIcon from "@material-ui/icons/Receipt";
import DescriptionIcon from "@material-ui/icons/Description";
import NoteIcon from "@material-ui/icons/Note";
import { loadUserRoleData } from "app/camunda_redux/redux/action";
import AppContext from "app/appContext";

class Sidenav extends Component {
  constructor(props, context) {
    super(props);

    const { t } = props;
    let { LicenseConfig } = context;
    const allNavigations = [
      // {
      //   name: "dashboard",
      //   path: "/eoffice/dashboard/analytics",
      //   icon: <DashboardIcon fontSize="small" style={{ marginTop: "-10px" }} />,
      // },
      {
        name: "inbox",
        path: "/eoffice/inbox/file",
        icon: (
          <DraftsRoundedIcon fontSize="small" style={{ marginTop: "-10px" }} />
        ),
      },
      {
        name: "outbox",
        path: "/eoffice/outbox/file",
        icon: (
          <OpenInBrowserIcon fontSize="small" style={{ marginTop: "-10px" }} />
        ),
      },
      // {
      //   name: "pa",
      //   path: "/eoffice/personnel/file",
      //   icon: (
      //     <Typography
      //       variant="h6"
      //       style={{ fontWeight: "bolder", marginTop: "-2px" }}
      //     >
      //       P
      //     </Typography>
      //   ),
      // },
      // {
      //   name: "correspondence",
      //   path: "/eoffice/correspondence/file",
      //   icon: <NoteIcon fontSize="small" style={{ marginTop: "-10px" }} />,
      // },
      // {
      //   name: "file",
      //   path: "/eoffice/File/file",
      //   icon: (
      //     <DescriptionIcon fontSize="small" style={{ marginTop: "-10px" }} />
      //   ),
      // },
      // {
      //   name: t("initiate"),
      //   path: "/eoffice/initiate/file",
      //   icon: <Tooltip title={t("initiate")} aria-label="Initiate"><ViewQuiltIcon fontSize="normal" style={{ marginTop: '-10px' }} /></Tooltip>
      // },

      // {
      //   name: t("DMS"),
      //   path: "/eoffice/dms/DmsFolderStructure",
      //   icon: <Tooltip title={t("dms")} aria-label="DMS"><FolderIcon fontSize="small" style={{ marginTop: '-10px' }} /></Tooltip>
      // },

      {
        name: "cabinet",
        path: "/eoffice/cabinet/file",
        icon: <KitchenIcon fontSize="small" style={{ marginTop: "-10px" }} />,
      },
      // {
      //   name: "search",
      //   path: "/eoffice/search",
      //   icon: <SearchIcon fontSize="small" style={{ marginTop: "-10px" }} />,
      // },
      // {
      //   name: "admin",
      //   path: "/eoffice/admin/dashboard",
      //   icon: (
      //     <SupervisedUserCircle
      //       fontSize="small"
      //       style={{ marginTop: "-10px" }}
      //     />
      //   ),
      // },
      // {
      //   name: "RTI",
      //   path: "/eoffice/rti/file",
      //   icon: <Class fontSize="small" style={{ marginTop: "-10px" }} />,
      // },
      // {
      //   name: "MEETING",
      //   path: "/eoffice/Meeting/meetingschedule",
      //   icon: (
      //     <ContactMailIcon fontSize="small" style={{ marginTop: "-10px" }} />
      //   ),
      // },
    ];
    this.state = {
      allNavigations, // this will contain all navigations my app provides
      onlyPa: [
        {
          name: "dashboard",
          path: "/eoffice/dashboard/analytics",
          icon: (
            <DashboardIcon fontSize="small" style={{ marginTop: "-10px" }} />
          ),
        },
        {
          name: "pa",
          path: "/eoffice/personnel/file",
          icon: (
            <Typography
              variant="h6"
              style={{ fontWeight: "bolder", marginTop: "-2px" }}
            >
              P
            </Typography>
          ),
        },
      ], // this will contain only pa navigation
      showNavigation: [
        {
          name: "dashboard",
          path: "/eoffice/dashboard/analytics",
          icon: (
            <DashboardIcon fontSize="small" style={{ marginTop: "-10px" }} />
          ),
        },
        {
          name: "pa",
          path: "/eoffice/personnel/file",
          icon: (
            <Typography
              variant="h6"
              style={{ fontWeight: "bolder", marginTop: "-2px" }}
            >
              P
            </Typography>
          ),
        },
      ], // this will contain navigation out of above 2 to show in app
    };
  }

  componentDidMount() {
    let { LicenseConfig } = this.context;
    const validNavigations = this.state.allNavigations.filter((nav, ind) => {
      if (LicenseConfig?.hideRoutes?.includes(nav.path)) return false;
      else return true;
    });
    this.setState({
      allNavigations: validNavigations,
    });
  }

  componentDidUpdate() {
    const { isAdmin, t, appRoutes } = this.props;
    // if (
    //   isAdmin &&
    //   this.state.allNavigations[this.state.allNavigations.length - 1].path !==
    //     "/eoffice/auditsearch"
    // ) {
    //   const adminNav = {
    //     name: t("AUDITSEARCH"),
    //     path: "/eoffice/auditsearch",
    //     icon: <ReceiptIcon fontSize="small" style={{ marginTop: "-10px" }} />,
    //   };
    //   this.setState({
    //     allNavigations: [...this.state.allNavigations, adminNav],
    //   });
    // }
    if (
      appRoutes.showPa &&
      !appRoutes.showAll &&
      this.state.showNavigation.length > 2
    ) {
      this.setState({
        showNavigation: this.state.onlyPa,
      });
    } else if (
      !appRoutes.showPa &&
      appRoutes.showAll &&
      this.state.showNavigation.length === 2
    ) {
      this.setState({
        showNavigation: this.state.allNavigations,
      });
    }
  }

  updateSidebarMode = (sidebarSettings) => {
    let { settings, setLayoutSettings } = this.props;
    let activeLayoutSettingsName = settings.activeLayout + "Settings";
    let activeLayoutSettings = settings[activeLayoutSettingsName];

    setLayoutSettings({
      ...settings,
      [activeLayoutSettingsName]: {
        ...activeLayoutSettings,
        leftSidebar: {
          ...activeLayoutSettings.leftSidebar,
          ...sidebarSettings,
        },
      },
    });
  };

  renderOverlay = () => (
    <div
      onClick={() => this.updateSidebarMode({ mode: "close" })}
      className="sidenav__overlay"
    />
  );
  render() {
    const { t, showHam, toggleHam } = this.props;

    return (
      <Fragment>
        {this.props.children}
        <MatxVerticalNav
          navigation={this.state.showNavigation}
          showHam={showHam}
          toggleHam={toggleHam}
        />
      </Fragment>
    );
  }
}

Sidenav.contextType = AppContext;

Sidenav.propTypes = {
  setLayoutSettings: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  setLayoutSettings: PropTypes.func.isRequired,
  settings: state.layout.settings,
  isAdmin: state.user.currentUserRole?.admin,
  appRoutes: state.appRoutes,
});
export default withRouter(
  connect(mapStateToProps, {
    setLayoutSettings,
    loadUserRoleData,
  })(withTranslation()(Sidenav))
);
