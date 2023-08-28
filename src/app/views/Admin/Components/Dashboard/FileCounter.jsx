import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import CountUp from 'react-countup';
import "../../Styles/CounterCard.css";

const FileCounter = ({ info }) => {
  const { name, count, icon } = info;

  const useStyles = makeStyles({
    card: {
      backgroundColor: "#5c6dcc",
      borderRadius: "0.8rem",
      boxShadow: "4px 4px 2px rgb(0 0 0 / 38%)",
      width: "47%",
    },
    CardContent: {
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      padding: "16px 11px",
    },
  });

  const cls = useStyles();

  return (
    <>
      <Card className={cls.card}>
        <CardContent className={cls.CardContent}>
          {icon}
          <Box
            style={{
              display: "flex",
              flexDirection: "column-reverse",
            }}
          >
            <Typography variant="h6">{name}</Typography>
            <CountUp
            start={0}
            end={count}
            className='second-counter'
            duration={1}
            />
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default FileCounter;
