import {
  Dialog,
  DialogContent,
  Paper,
  Typography,
} from "@material-ui/core";
import React from "react";
import Draggables from "react-draggable";
import { useTranslation } from "react-i18next";
import RoleGrid from "../Roles/RoleGrid";

const PaperComponent = (props) => {
  return (
    <Draggables
      handle="#draggable-dialog-title"
      cancel={'.cancel-drag'}
    >
      <Paper {...props} style={{ width: "auto", overflow: "visible",borderRadius:"18px" }} />
    </Draggables>
  );
};


const ShowRolesDialog = ({ show, handleDialog, Roles,theme }) => {
  const { t } = useTranslation();

  const CustomToolbarMarkup = () => (
    <div
      style={{
        height: "4rem",
        display: "flex",
        alignItems: "center",
        borderBottom: `1px solid ${theme ? "#505050" : "#d9d9d9"}`,
      }}
    >
      <Typography
        variant="button"
        align="center"
        color="primary"
        style={{
          fontSize: "medium",
          fontFamily: "inherit !important",
          marginLeft: "15px",
        }}
      >
        {t("roles")}
      </Typography>
    </div>
  );

  return (
    <Dialog
      open={show}
      onClose={() => {
        handleDialog(false);
      }}
      aria-labelledby="draggable-dialog-title"
      PaperComponent={PaperComponent}
      maxWidth="sm"
      fullWidth
    >
      {Roles.roles ? (
        <Paper
        className=" mui-table-customize"
        elevation={3}
        id="draggable-dialog-title"
        style={{
          position: "relative",
          borderRadius: "18px",
          border: `1px solid ${theme ? "#727070" : "#c7c7c7"}`,
          width:"100%"
        }}
        > 
          <CustomToolbarMarkup/>
          <RoleGrid Roles={Roles.roles} />
        </Paper>
      ) : Roles.error ? (
        <DialogContent dividers pt={0}>
          <h1>No Roles In This Department</h1>
        </DialogContent>
      ) : (
        ""
      )}
    </Dialog>
  );
};

export default ShowRolesDialog;
