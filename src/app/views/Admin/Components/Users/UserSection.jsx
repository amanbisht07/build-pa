import { Fab, Link, Paper, Tooltip, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import UserGrid from "./UserGrid"
import { getADUsers } from "app/camunda_redux/redux/action";
import { connect } from "react-redux";
import AddUserDialog from "./AddUserDialog";

const UserSection = (props) => {

  const [UsersList, setUsersList] = useState([])
  const [OpenDialog, setOpenDialog] = useState(false)

  const DialogOpen = (val)=>{
    setOpenDialog(val)
  }

  useEffect(()=>{
    
    props.getADUsers().then((res)=>{
      const tempArr = res.response.map((item,i)=>{
        return {
          Sno:`${i+1}`,
         ...item
        }
      })
      setUsersList(tempArr)
    })
    .catch((err)=>{
      console.log(err)
    })

  },[])

  const {t} = useTranslation()

  const CustomToolbarMarkup = () => (
    <div
      style={{
        height: "4rem",
        display: "flex",
        alignItems: "center",
        borderBottom: `1px solid ${props.theme ? "#505050" : "#d9d9d9"}`,
      }}
    >
      <Typography
        variant="button"
        align="center"
        color="primary"
        style={{
          fontSize: "medium",
          fontFamily: "inherit !important",
          marginLeft:'15px',
        }}
      >
        {t("users")}
      </Typography>
      <Link
        variant="button"
        align="center"
        color="primary"
        style={{
          fontSize: "medium",
          fontFamily: "inherit !important",
          position:"absolute",
          top:'3.5%',
          right:'10%',
          cursor:"pointer"
        }}
        onClick={(e)=>{props.changeNavigation(e,0)}}
      >
        {t("back_to_dasboard")}
      </Link>
      <Tooltip title={t("Add New User")}>
        <Fab
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            width: "2.2rem",
            height: ".1rem",
            backgroundColor: "rgb(230, 81, 71)",
          }}
          onClick={() => DialogOpen(true)}
        >
          <AddIcon style={{ fontSize: "19", color: "#fff" }} />
        </Fab>
      </Tooltip>
    </div>
  );

  return (
    <Paper
      className=" mui-table-customize"
      elevation={3}
      style={{
        position: "relative",
        borderRadius: "18px",
        border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
        width:"87%"
      }}
    >

      <CustomToolbarMarkup />

      <UserGrid Users={UsersList} />

      <AddUserDialog openDialog={OpenDialog} DialogHandle={DialogOpen} />

    </Paper>
  );
};

function mapStateToProps(state) {
    return {
      props: state.props,
      subscribeApi: state.subscribeApi,
      theme: state.theme,
    };
  }

export default connect(mapStateToProps,{getADUsers})(UserSection);
