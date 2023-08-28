import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
} from "@material-ui/core";
import React from "react";
import Draggables from "react-draggable";
import CloseIcon from "@material-ui/icons/Close";
import { useTranslation } from "react-i18next";
import UserCard from "./UserCard";

const PaperComponent = (props) => {
  return (
    <Draggables
      handle="#draggable-dialog-title-user"
      cancel={'.cancel-drag'}
    >
      <Paper {...props} style={{width:"auto",overflow:'visible'}} />
    </Draggables>
  );
};

const ShowUserDialog = ({ show, handleDialog, User }) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={show}
      onClose={() => {
        handleDialog(false);
      }}
      aria-labelledby="draggable-dialog-title-user"
      PaperComponent={PaperComponent}
      maxWidth="sm"
      fullWidth
    >
      {User.user ? (

        <UserCard id="draggable-dialog-title-user" User={User} handleDialog={handleDialog} />

      ) : User.error ? (
        <DialogContent dividers pt={0}>
          <h1>No User In These Role</h1>
        </DialogContent>
      ) : (
        ""
      )}
    </Dialog>
  );
};

export default ShowUserDialog;
