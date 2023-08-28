import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  TextField,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import React from "react";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";

const PaperComponent = (props) => {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'.cancel-drag'}
    >
      <Paper {...props} />
    </Draggable>
  );
};

const Custodian = (props) => {
  const rolesSelect = [
    { title: "HRC" },
    { title: "HRC.HRC" },
    { title: "HRC.hrc1" },
    { title: "hrc1.hrc1" },
    { title: "HRC1.hrc" },
  ];

  return (
    <Dialog
      className="selectRoles"
      open={props.open}
      PaperComponent={PaperComponent}
      onClose={() => props.handleClose()}
      aria-labelledby="form-dialog-title"
      id="custodian-dialog"
    >
      <DialogTitle
        style={{ cursor: "move" }}
        id="draggable-dialog-title"
        className="dialog_title"
      >
        <span>SELECT ROLES</span>
        <IconButton
          id="create_file_dialog_close_button"
          aria-label="close"
          onClick={() => props.handleClose()}
          color="primary"
          className="cancel-drag"
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Autocomplete
          multiple
          id="tags-outlined"
          options={rolesSelect}
          getOptionLabel={(option) => option.title}
          defaultValue={[rolesSelect[1]]}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="SELECT ROLES"
              placeholder="Select Roles"
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button className="CreateButton">UPDATE</Button>
        <Button
          className="CabinetCancelButton"
          onClick={() => props.handleClose()}
        >
          CANCEL
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Custodian;
