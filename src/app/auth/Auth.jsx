import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { setUserData } from "../redux/actions/UserActions";
import jwtAuthService from "../services/jwtAuthService";
import localStorageService from "../services/localStorageService";
import firebaseAuthService from "../services/firebase/firebaseAuthService";
import history from "history.js";

class Auth extends Component {
  state = {};

  constructor(props) {
    super(props);

    // this.props.setUserData(localStorageService.getItem("auth_user"));
  }

  componentDidMount() {

    // Here no need to perform this jwt Authentication from firebase as we have implemented our own login page front or back

    // jwtAuthService.loginWithToken().then(user => {
    //   this.props.setUserData(user);

    //   // You should redirect user to Dashboard here

    // }).catch(err => {
    //   // Invalid token
    //   console.log(err);
    //   history.push({
    //     pathname: "/eoffice"
    //   });
    // });

  }

  checkJwtAuth = () => {
    // You need to send token to your server to check token is valid
   };

  checkFirebaseAuth = () => {
    firebaseAuthService.checkAuthStatus(user => {
      if (user) {
        console.log(user.uid);
        console.log(user.email);
        console.log(user.emailVerified);
      } else {
        console.log("not logged in");
      }
    });
  };

  render() {
    const { children } = this.props;
    return <Fragment>{children}</Fragment>;
  }
}

const mapStateToProps = state => ({
  setUserData: PropTypes.func.isRequired,
  login: state.login
});

export default connect(
    mapStateToProps,
    { setUserData }
)(Auth);
