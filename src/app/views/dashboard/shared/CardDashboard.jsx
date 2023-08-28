import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJs, Tooltip, Title, ArcElement, Legend } from "chart.js";
import { Paper } from "@material-ui/core";
ChartJs.register(Tooltip, Title, ArcElement, Legend);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    width: "80%",
    overflow: "visible",
    border: "1px solid #b6b6b66b",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  content: {
    flex: "1 0 auto",
    padding: "15px !important",
  },
  cover: {
    width: 151,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  cardNumber: {
    padding: "16px",
    transform: "translate(50%, 0px)",
    borderRadius: "16px",
  },
  numberHeading: {
    margin: "0px",
    lineHeight: "1",
    fontWeight: "500",
    color: "#4267B2 !important",
  },
}));
const CardDashboard = (props) => {
  const classes = useStyles();
  const { theme } = useSelector((state) => state);
  const role = sessionStorage.getItem("role");
  let arr = [
    props.num.Approve,
    props.num.Reject,
    props.num.Sent,
    props.num.InProgress,
  ];

  const data = {
    labels: ["Approve", "Rejected", "In-Progress", "Draft"],
    datasets: [
      {
        label: "My First Dataset",
        data: arr,
        backgroundColor: ["#4caf50", "#c62828", "#fbc02d", "#1565c0"],
        borderColor: ["#4caf50", "#c62828", "#fbc02d", "#1565c0"],
        hoverOffset: 4,
        borderWidth: 1,
      },
    ],
  };
  return (
    <>
      <Paper className="dougnut">
        <Doughnut
          data={data}
          style={{
            backgroundColor: theme ? "#424242" : "#ffffff",
            height: "60px",
          }}
        />
      </Paper>
    </>
  );
};

export default CardDashboard;
