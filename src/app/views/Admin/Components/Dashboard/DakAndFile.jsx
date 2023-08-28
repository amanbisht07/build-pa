import React, { useState } from "react";
import "../../Styles/DatePicker.css";
import { Search } from "@material-ui/icons";
import { CalendarComponent } from "@syncfusion/ej2-react-calendars";
import FileCounter from "./FileCounter";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";

const useStyles = makeStyles({
  button: {
    top: "49%",
    right: "9%",
    padding: "5px",
    position: "absolute",
    borderRadius: "50%",
  },
  dateCon: {
    width: "100%",
    borderRadius: "6px",
    padding: "10px",
    alignSelf: "start",
    marginTop: "4px",
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
    position: "relative",
  },
});



const DakAndFile = ({ countArr,FilterCount,Load }) => {
  const [currDate, setcurrDate] = useState(new Date().toISOString());
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const cls = useStyles();
  let calender;

  const ddItem = [
    { type: "Today", date: "Today" },
    { type: "Yesterday", date: "Yesterday" },
    { type: "This Week", date: "This Week" },
    { type: "This Month", date: "This Month" },
    { type: "This Year", date: "This Year" },
    { type: "Select Custom Date", date: "Select Custom Date" },
  ];

  const DDtemplate = (data) => {
    if (data.type !== "Select Custom Date") {
      return <h4 onClick={()=>setcurrDate(data.type)}>{data.type}</h4>;
    } else {
      return <h4 onClick={handleClickOpen}>{data.type}</h4>;
    }
  };

  return (
    <>
      <Box className={cls.dateCon}>
        <Typography
          variant="h6"
          style={{
            color: "rgb(5 100 200) !important",
            textAlign: "center",
            fontSize: "1.4rem",
          }}
        >
          Filter By Date
        </Typography>

        <DropDownListComponent
          id="FilterDD"
          placeholder="Filter"
          index={0}
          dataSource={ddItem}
          fields={{ text: "type", value: "date" }}
          itemTemplate={DDtemplate}
        />
        <IconButton
          id="date_Button"
          variant="contained"
          color="primary"
          size="medium"
          className={cls.button}
          onClick={()=>{
            if(currDate.length<=10){
              Load()
              FilterCount(currDate,`Filtered By ${currDate}`)
            }
            else{
              Load()
              FilterCount(currDate,"Filtered By Selected Date")
            }
          }}
        >
          <Search style={{
            fontSize:'2rem'
          }}/>
        </IconButton>
      </Box>
      <div
        style={{
          width: "60%",
          display: "flex",
          flexWrap: "wrap",
          gap: "25px",
          margin: "0px auto",
        }}
      >
        {countArr.map((item, i) => {
          return <FileCounter key={i} info={item} />;
        })}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <CalendarComponent
          id="datepicker"
          ref={(scope) => {
            calender = scope;
          }}
          change={(args)=>{
            setOpen(false)
            setcurrDate(args.value.toISOString())
          }}
          value={currDate}
          max={new Date()}
        />
      </Dialog>
    </>
  );
};

export default DakAndFile;


// const getCurrDate = (date) => {
//   let formatedDate = date;
//   let dd = String(formatedDate.getDate()).padStart(2, "0");
//   var mm = String(formatedDate.getMonth() + 1).padStart(2, "0"); //January is 0!
//   let yyyy = formatedDate.getFullYear();
//   formatedDate = mm + "/" + dd + "/" + yyyy;
//   return formatedDate;
// };   