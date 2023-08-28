import { Button } from "@material-ui/core";
import App from "app/App";
import Axios from "axios";
import qs from "qs";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./login.css";
import history from "history.js";
import { TextField } from "@material-ui/core";
// import Particles from "tsparticles"

const LoginPage = () => {
  // React States
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [Cred, setCred] = useState({
    username: "",
    password: "",
  });
  // const [showdata, setShowData] = useState();

  const errors = {
    uname: "invalid username",
    pass: "invalid password",
  };

  useEffect(() => {
    if (localStorage.getItem("username")) {
      history.push({ pathname: "/eoffice/dashboard/analytics" });
    }
  }, []);

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
      const login = Axios.post(
        "http://11.0.0.118:8180/auth/realms/sample/protocol/openid-connect/token",
        data,
        { headers }
      ).then((res) => {
        const data = res.data;
        sessionStorage.setItem("jwt_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("client_id", "costa_cloud");
        localStorage.setItem("username", Cred.username);
        localStorage.setItem("expires_in", data.expires_in);
        document.body.style.zoom = "95%";
        ReactDOM.render(<App />, document.getElementById("root"));
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {

    setInterval(() => {
      handleRefreshToken()
    }, 3600000);
    handleRefreshToken()
    
    const animateForm = document.querySelector('.login-form')
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry)=>{
        entry.target.classList.toggle("show",entry.isIntersecting)
        if(entry.isIntersecting) observer.unobserve(entry.target)
      })
    },
    {
      threshold:0.1
    }
    )

    observer.observe(animateForm)

  }, []);

  const handleRefreshToken = () =>{
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
      const login = Axios.post(
        "http://11.0.0.118:8180/auth/realms/sample/protocol/openid-connect/token",
        data,
        { headers }
      ).then((res) => {
        console.log(res);
        const data = res.data;
        sessionStorage.setItem("jwt_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("client_id", "costa_cloud");
        localStorage.setItem("expires_in", data.expires_in);
        ReactDOM.render(<App />, document.getElementById("root"));
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
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
        <div className="input-container">
        </div>
        <Button
          id="login_sign_in_button"
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
      {/* <ParticlesBackground/>  */}
      <div className="app">
        <div className="left" item xs={12} >
          <img src="https://wallpapercave.com/dwp2x/wp5322454.jpg" alt="" />
        </div>
        <div className="right">
          <div className="login-form form-animate" >
            <div className="formRight" item xs={12} >
              <h4 className="title"> Sign In To Your Account </h4>
              {isSubmitted ? (
                <div>User is successfully logged in</div>
              ) : (
                renderForm
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default LoginPage;
