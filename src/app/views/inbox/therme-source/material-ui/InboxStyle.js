const { makeStyles } = require("@material-ui/core");

export const fileListTableStyle = makeStyles({
    table: {
      minWidth: 250,
    },
    button: {
      marginBottom: 10,
    },
    mainDiv: {
      zIndex: "999",
      textAlign: "center",
    },
    formControl: {
      marginTop: 20,
      minWidth: 350,
      maxWidth: 350,
    },
    txtFieldFormControl: {
      minWidth: 500,
      maxWidth: 500,
    },
    chips: {
      display: "flex",
      flexWrap: "wrap",
    },
    chip: {
      margin: 2,
    },
    list: {
      border: "outset",
    },
    root: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
  
      background: "whitesmoke",
      //marginLeft: 250,
      marginBottom: 10,
    },
    input: {
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
  
    list: {
      border: "outset",
      display: "block",
      textAlign: "left",
      padding: "6px 15px",
      "& p": {
        margin: "0px",
      },
    },
    dNone: {
      display: "none",
    },
    sign_btn: {
      zIndex: 1,
      maxHeight: "50px",
      minHeight: "50px",
      minWidth: "50px",
      maxWidth: "50px",
    },
    position_btn: {
      position: "fixed",
      right: "20px !important",
      bottom: "40px !important",
      zIndex: "999",
    },
  });