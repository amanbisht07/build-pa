import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import AppContext from "app/appContext";
import { matchRoutes } from "react-router-config";
import routes from "app/RootRoutes";

class AuthGuard extends Component {
  constructor(props, context) {
    super(props);
    let { validRoutes } = context;

    this.state = {
      authenticated: false,
      validRoutes,
    };
  }

  componentDidMount() {
    this.context.validRoutes.some((route) => {
      if (route.path == location.pathname) {
        document.title = `Paperless eOffice (${route.name})`;
        return true;
      }
    });
    this.unlisten = this.props.history.listen((location) => {
      this.context.validRoutes.some((route) => {
        if (route.path == location.pathname) {
          document.title = `Paperless eOffice (${route.name})`;
          return true;
        }
      });
    });

    if (!this.state.authenticated) {
      this.redirectRoute(this.props);
    }
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  //
  // componentDidUpdate() {
  //   if (!this.state.authenticated) {
  //     this.redirectRoute(this.props);
  //   }
  // }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextState.authenticated !== this.state.authenticated;
  // }

  static getDerivedStateFromProps(props, state) {
    const { location, user } = props;
    const { pathname } = location;
    const found = matchRoutes(state.validRoutes, pathname);

    // const matched = state.validRoutes.find((r) => {
    //   if (r.path === pathname) {
    //     return true;
    //   } else if (r.path === pathname.substring(0, pathname.length - 1)) {
    //     return true;
    //   } else {
    //     false;
    //   }
    // });

    const authenticated = found.length ? true : false;

    return {
      authenticated,
    };
  }

  redirectRoute(props) {
    const { location, history } = props;
    const { pathname } = location;
    history.push({
      pathname: "/eoffice/dashboard/analytics",
      state: { redirectUrl: pathname },
    });
    // history.push({
    //   pathname: "/eoffice/personnel/file",
    //   state: { redirectUrl: pathname },
    // });
  }

  render() {
    let { children } = this.props;
    const { authenticated } = this.state;
    return authenticated ? <Fragment>{children}</Fragment> : null;
  }
}

AuthGuard.contextType = AppContext;

const mapStateToProps = (state) => ({
  user: state.user,
});

export default withRouter(connect(mapStateToProps)(AuthGuard));
