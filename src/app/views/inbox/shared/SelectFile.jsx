import {
  Button,
  DialogActions,
  DialogContent,
  Typography,
} from "@material-ui/core";
import { Done } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { Loading } from "../therme-source/material-ui/loading";

const SelectFile = (props) => {
  const [rowData, setRowData] = useState(null);

  useEffect(() => {
    let arr = props.enclosureArr.find((item) => item.coverNote === true);
    setRowData(arr);
  }, []);

  const handleClick = () => {
    props.handleSend(true, props.fileId);
  };

  return (
    <div>
      {props.loading && <Loading />}
      {!rowData ? (
        <Typography style={{ padding: " 0 2rem 2rem 2rem" }}>
          Please Add Your CoverLetter
        </Typography>
      ) : (
        <>
          <DialogContent dividers>
            <Typography>
              Send <b>{rowData.subject}</b> to Next Level
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              id="selectFile_send_button"
              color="primary"
              variant="contained"
              onClick={handleClick}
              endIcon={<Done />}
            >
              Submit
            </Button>
          </DialogActions>
        </>
      )}
    </div>
  );
};

export default SelectFile;
