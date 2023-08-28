import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import CountUp from 'react-countup';
import "../../Styles/CounterCard.css"

const Counter = ({ info,changeNavigation}) => {
  const { name, count, icon } = info;

  const useStyles = makeStyles({
    card: {
      padding:"10px",
      boxShadow:'2px 4px 10px 1px rgba(201,201,201,0.47)',
      width: "27%",
    },
    CardContent: {
        display: "flex",
        justifyContent:'space-between',
        padding:"0px !important"
    },
  });

  const cls = useStyles();

  const changeTab = (e)=>{
    if(name=='USERS') changeNavigation(e,1)
    if(name=='ROLES') changeNavigation(e,2)
    if(name=='DEPARTMENTS') changeNavigation(e,3)
  }

  return (
    <Card className={cls.card}>   
        <CardContent className={cls.CardContent}>
          <Box style={{display:'flex',justifyContent:'space-between',flexDirection:'column'}}>
            <span className="title">{name}</span>
            <CountUp
            start={0}
            end={count}
            className='first-counter'
            duration={1}
            />
            <Button variant="text" color="primary" onClick={(e)=>{changeTab(e)}}>
              {
                name=='USERS'?'See All Users':name==="ROLES"?'See All Roles':name==='DEPARTMENTS'?'See All Departments':''
              }
            </Button>
          </Box>
          <Box sx={{
            display:'flex',
            justifyContent:'center',
            flexDirection:'column'
          }}>
            {icon}
          </Box>
        </CardContent>
    </Card>
  );
};

export default Counter;