import React, { useEffect, useState } from "react";
import "./logout.css";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import Axios from "axios";
import DoneIcon from "@material-ui/icons/Done";
import { Button, DialogActions, DialogContent } from "@material-ui/core";
import { setSnackbar } from "../../../camunda_redux/redux/ducks/snackbar";
import { connect, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

function Aduiddisable({ handalclose , theme }) {

  const {t} = useTranslation()
  const dispatch = useDispatch();
  let username = localStorage.getItem("username");
  const [actionsData, setActionsData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [newid, srtNewid] = useState();
  const handleChange = (index) => {
    let tempArr = statusData.map((item, i) => (i === index ? !item : item));
    setStatusData(tempArr);
  };
  const getAuditdata = async () => {
    try {
      const res = await Axios.get("/audit_view_service/api/getConfig", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf8",
          Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
          username: username,
          sessionId: sessionStorage.getItem("sessionId"),
        },
      });
      setStatusData(res.data.status);
      setActionsData(res.data.actions);
      srtNewid(res.data.id);
      sessionStorage.setItem("actionData", JSON.stringify(res.data.status));
      sessionStorage.setItem("statusData", JSON.stringify(res.data.actions));
    } catch (err) {
      dispatch(setSnackbar(true, "error", err.message));
    }
  };

  const AuditSend = async () => {
    try {
      await Axios.post(
        `/audit_view_service/api/config`,
        JSON.stringify({
          username: username,
          actions: actionsData,
          status: statusData,
          id: newid,
        }),
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json; charset=utf8",
            Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
            sessionId: sessionStorage.getItem("sessionId"),
          },
        }
      );
    } catch (error) {}
  };

  useEffect(() => {
    getAuditdata();
  }, []);

  const sendAudiapidata = () => {
    AuditSend();
    handalclose();
  };

  return (
    <>
      <DialogContent dividers>
        <div className="Pswitchbutton">
          {actionsData.map((item, i) => (
            <div className="Cswitchbutton" key={i}>
              <Typography variant="body1"> {item} </Typography>
              <Switch
                checked={statusData[i]}
                onChange={() => handleChange(i)}
                name={item}
                color={theme ? "secondary" : "primary"}
              />
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={sendAudiapidata}
          endIcon={<DoneIcon />}
          style={{ marginRight: "10px", padding: "7px 31px" }}
          variant="contained"
          color="secondary"
        >
          {t("save")}
        </Button>
      </DialogActions>
    </>
  );
}

const mapStateToProps = (state) => ({
  theme: state.theme,
});

export default connect(mapStateToProps,null)(Aduiddisable)