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
import { connect } from "react-redux";
import { Add, Close } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";
import { getCreateVolume, getVolume } from "app/camunda_redux/redux/action/backend-rest/form-data";
import Cookies from "js-cookie";

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

const CreateVolumeFile = (props) => {
  const [Volue, setVolue] = useState([])
  const [subject, setSubject] = useState([])
  const { t } = useTranslation();
  let cabinetId = Cookies.get("cabinetId")
  const fileType = ["Unclassified", "Restricted", "Confidential"];
  const fyType = ["19-20", "20-21", "21-22", "22-23", "23-24"];
  const subSection = [100, 201, 900, 700];
  const blockNo = [32, 14, 20, 25, 51];
  const custodian = ["cad(cad1)", "hrc(hrc1)", "hrc(hrc2)"];

  let depart = sessionStorage.getItem("department");

  const handleCreateVolume = () => {
    props.getCreateVolume(cabinetId).then((res) => {
      console.log("volume has created successfully")
    })
  }

  const handleSubject = (e) => {
    setSubject(e.target.value)
  }

  return (
    <>
      <Dialog
        open={props.open}
        PaperComponent={PaperComponent}
        onClose={() => props.handleClose()}
        aria-labelledby="draggable-dialog-title"
        id="cabinet-create-file"
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          <span>{t("Create A File")}</span>
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
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <TextField
                id="outlined-select-classification-native"
                select
                label="Classification"
                fullWidth
                size="small"
                required
                // value={currency}
                // onChange={handleChange}
                SelectProps={{
                  native: true,
                  className: "bgcolor",
                }}
                variant="outlined"
              >
                {fileType.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Volume"
                id="outlined-volume-normal"
                value="1"
                required
                size="small"
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="outlined-select-fy-native"
                select
                label="Financial Year"
                fullWidth
                size="small"
                // value={currency}
                // onChange={handleChange}
                SelectProps={{
                  native: true,
                  className: "bgcolor",
                }}
                // helperText="Please select your currency"
                variant="outlined"
              >
                {fyType.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Subject"
                id="outlined-subject-normal"
                onChange={(e) => handleSubject(e)}
                fullWidth
                required
                minRows={4}
                multiline
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Section"
                id="outlined-section-normal"
                value={depart}
                required
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="outlined-select-sub-section-native"
                select
                label="Sub Section"
                fullWidth
                size="small"
                required
                // value={currency}
                // onChange={handleChange}
                SelectProps={{
                  native: true,
                  className: "bgcolor",
                }}
                // helperText="Please select your currency"
                variant="outlined"
              >
                {subSection.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="outlined-select-block-no-native"
                select
                label="Block No"
                fullWidth
                size="small"
                required
                // value={currency}
                // onChange={handleChange}
                SelectProps={{
                  native: true,
                  className: "bgcolor",
                }}
                // helperText="Please select your currency"
                variant="outlined"
              >
                {blockNo.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Main Head"
                id="outlined-main-head-normal"
                // value={}
                // onChange={}
                fullWidth
                required
                size="small"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Sub Head"
                id="outlined-sub-head-normal"
                // value={}
                // onChange={}
                fullWidth
                required
                size="small"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="outlined-select-custodian-native"
                select
                label="Custodian"
                fullWidth
                size="small"
                required
                // value={currency}
                // onChange={handleChange}
                SelectProps={{
                  native: true,
                  className: "bgcolor",
                }}
                // helperText="Please select your currency"
                variant="outlined"
              >
                {custodian.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Case No"
                id="outlined-old-case-no-normal"
                // value={}
                // onChange={}
                fullWidth
                required
                size="small"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Old File Reference"
                id="outlined-old-file-reference-normal"
                // value={}
                // onChange={}
                fullWidth
                required
                size="small"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Connected Files"
                id="outlined-connected-files-normal"
                fullWidth
                required
                size="small"
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            id="ylow_note_add_btn"
            variant="contained"
            color="secondary"
            endIcon={<Add />}
            onClick={handleCreateVolume}
          >
            {t("Create")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
  };
}
export default connect(mapStateToProps, {
  getCreateVolume,
  getVolume,
})(CreateVolumeFile);
