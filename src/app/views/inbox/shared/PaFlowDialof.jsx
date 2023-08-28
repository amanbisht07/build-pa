import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect, useDispatch } from "react-redux";
import { PCFileClosuer } from "../../../camunda_redux/redux/action";
import { BmContext } from "./SplitviewContainer/BmContainer/Worker";

const PaFlowDialog = (props) => {
  const [rowData, setRowData] = useState(null);
  const [status, setStatus] = useState("");
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const contextData = useContext(BmContext);

  const {
    setSection,
    handleSend,
    inboxId,
    pfileName,
    approveRejectMessage,
    enclosureArr,
  } = props;

  const handleClick = () => {
    props.PCFileClosuer(inboxId, status, pfileName).then((resp) => {
      try {
        if (resp.error) {
          callMessageOut(resp.error);
        } else {
          let message;
          if (status === "Approved") {
            message = "File has been approved successfully";
          } else if (status === "Rejected") {
            message = "File has been rejected";
          }
          handleSend(true, props.fileId, true, message);
        }
      } catch (error) {
        callMessageOut(error.message);
      }
    });
    // handleSendConfirmation(status)
  };

  const callMessageOut = (msg) => {
    dispatch(setSnackbar(true, "error", msg));
  };


  useEffect(() => {
    let arr = enclosureArr.find((item) => item.coverNote === true);
    setRowData(arr);
    setSection("?><?;");
    if (contextData?.status) {
      setStatus(contextData?.status);
    }
  }, []);

  return (
    <div>
      {!rowData ? (
        <DialogContent>
          <Typography style={{ padding: " 0 2rem 2rem 2rem" }}>
            Please Add Your CoverLetter
          </Typography>
        </DialogContent>
      ) : (
        <>
          <DialogContent>
            {contextData?.status ? (
              <p>
                Update status to applicant <br />
                status = <strong>{contextData?.status}</strong>
              </p>
            ) : (
              <>
                <Typography>
                  Take Your decision regarding this <b>{rowData?.subject}</b>
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup row>
                    <FormControlLabel
                      control={<Radio color="primary" />}
                      label={t("rejectConfirmation")}
                      value="Rejected"
                      onClick={() => setStatus("Rejected")}
                    />
                    <FormControlLabel
                      control={<Radio color="primary" />}
                      label={t("approveConfirmation")}
                      value="Approved"
                      onClick={() => setStatus("Approved")}
                    />
                  </RadioGroup>
                </FormControl>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              id="PaFlowDialog_Submit_button"
              color="primary"
              variant="contained"
              disabled={!status || !rowData}
              onClick={handleClick}
            >
              Submit
            </Button>
          </DialogActions>
        </>
      )}
    </div>
  );
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {
  PCFileClosuer,
})(PaFlowDialog);
