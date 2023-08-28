import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
} from "@material-ui/core";
import Draggables from "react-draggable";
import CloseIcon from "@material-ui/icons/Close";
import { useTranslation } from "react-i18next";
import AddUserForm from "./AddUserForm";
import { useFormik } from "formik";
import * as Yup from "yup";

const PaperComponent = (props) => {
  return (
    <Draggables
      handle="#draggable-dialog-title"
      cancel={'.cancel-drag'}
    >
      <Paper {...props} />
    </Draggables>
  );
};

const AddUserDialog = ({ openDialog, DialogHandle }) => {
  const { t } = useTranslation();

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={() => {
          DialogHandle(false);
        }}
        aria-labelledby="draggable-dialog-title"
        PaperComponent={PaperComponent}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          id="draggable-dialog-title"
          style={{ padding: "0px 24px !important", cursor: "move" }}
        >
          <div className="flex1">
            {t("Add New User")}
            <IconButton
              id="newUser_button"
              aria-label="close"
              onClick={() => {
                DialogHandle(false);
              }}
              color="primary"
              style={{
                float: "right",
                cursor: "pointer",
                position: "relative",
                top: "-9px",
              }}
              className="cancel-drag"
            >
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers pt={0}>
          <AddUserForm />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddUserDialog;
