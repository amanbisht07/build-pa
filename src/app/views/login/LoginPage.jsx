import { Button } from "@material-ui/core";
import App from "app/App";
import Axios from "axios";
import qs from "qs";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./_index.scss";
import { TextField } from "@material-ui/core";
import Loading from "matx/components/MatxLoadable/Loading";
// import { setSnackbar } from "../../../camunda_redux/redux/ducks/snackbar";
// import Particles from "tsparticles"

const LoginPage = () => {
  // React States
  const [errorMessages, setErrorMessages] = useState({});
  const [Cred, setCred] = useState({
    username: "",
    password: "",
    error: "",
  });

  const userName = localStorage.getItem("username");

  const errors = {
    uname: "invalid username",
    pass: "invalid password",
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
      };
      const data = qs.stringify({
        username: Cred.username,
        password: Cred.password,
        grant_type: "password",
        client_id: "costa_cloud",
      });
      const login = await Axios.post(
        "http://11.0.0.118:8180/auth/realms/sample/protocol/openid-connect/token",
        data,
        { headers }
      );
      setCred({
        ...Cred,
        error: "",
      });
      // dispatch(setSnackbar(false, "error","dhjjm"));
      if (login.status == 200) {
        const { data } = login;
        sessionStorage.setItem("jwt_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("client_id", "costa_cloud");
        localStorage.setItem("username", Cred.username);
        localStorage.setItem("expires_in", data.expires_in);
        document.body.style.zoom = "95%";
        ReactDOM.render(<App />, document.getElementById("root"));
      }
    } catch (error) {
      console.log("login error ", { error });
      const errMsg = error.response.data.error_description;
      
      
      setCred({
        ...Cred,
        error: errMsg,

      });
    }
  };

  useEffect(() => {
    setInterval(() => {
      handleRefreshToken();
    }, 400000);

    userName && handleRefreshToken();

    const id = setTimeout(() => {
      const elm = document.querySelector(".form-animate");
      elm && elm.classList.add("show");
    }, 0);

    return () => {
      clearTimeout(id);
    };
  }, []);

  const handleRefreshToken = async () => {
    try {
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
      };
      // new FormData()
      // require
      const data = qs.stringify({
        grant_type: "refresh_token",
        refresh_token: localStorage.getItem("refresh_token"),
        client_id: localStorage.getItem("client_id"),
      });
      const login = await Axios.post(
        "http://11.0.0.118:8180/auth/realms/sample/protocol/openid-connect/token",
        data,
        { headers }
      );

      // important to clear first because previous logged in might contain some inboxId or imp data
      sessionStorage.clear();

      if (login.status == 200) {
        const { data } = login;
        sessionStorage.setItem("jwt_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("client_id", "costa_cloud");
        localStorage.setItem("expires_in", data.expires_in);
        ReactDOM.render(<App />, document.getElementById("root"));
      }
    } catch (error) {
      console.log("refresh token error ", { error });
      localStorage.clear();
      const errMsg = error.response.data.error_description;
      setCred({
        username: "",
        password: "",
        error: errMsg,
      });
    }
  };

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}
      </div>
    );

  // JSX code for login form
  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <TextField
            autoComplete="off"
            fullWidth
            size="small"
            name="username"
            label="Username"
            variant="outlined"
            value={Cred.username}
            onChange={(e) => {
              setCred({ ...Cred, [e.target.name]: e.target.value });
            }}
            onFocus={(event) => {
              event.target.setAttribute("autocomplete", "off");
            }}
            required
          />
        </div>
        <div>
          <TextField
            autoComplete="off"
            required
            fullWidth
            size="small"
            name="password"
            type="password"
            label="Password"
            variant="outlined"
            value={Cred.password}
            onChange={(e) => {
              setCred({ ...Cred, [e.target.name]: e.target.value });
            }}
            onFocus={(event) => {
              event.target.setAttribute("autocomplete", "off");
            }}
          />
        </div>
        {renderErrorMessage("uname")}
        <div className="input-container"></div>
        <Button
          fullWidth
          variant="contained"
          type="submit"
          style={{ background: "#636df3", color: "white" }}
        >
          SIGN IN
        </Button>
      </form>
    </div>
  );

  return (
    <>
      {userName ? (
        <Loading />
      ) : (
        <div className="app">
          <div className="left">
            <img src="https://wallpapercave.com/dwp2x/wp5322454.jpg" alt="" />
          </div>
          <div className="right">
            <div className="login-form form-animate">
              <div className="formRight">
                <h4 className="title"> Sign In To Your Account </h4>
                {Cred.error && (
                  <h4 style={{
                    color: 'red'
                  }}> {Cred.error} </h4>
                )}
                {

                  renderForm
                }
              </div>
            </div>
          </div>
        </div>
      )}
      {/* <ParticlesBackground/>  */}
    </>
  );
};
export default LoginPage;
