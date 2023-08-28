import { Box, List, ListItem, ListItemText, makeStyles, Paper, Typography } from '@material-ui/core'
import React, { useState } from 'react'

const useStyle = makeStyles({
  root:{
    transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    backgroundColor:'rgb(5 100 200)',
  },
  rounded:{
    borderRadius: "50%",
    width: "128px",
    height: "118px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }
})

const useStyle2 = makeStyles({
  heading:{
    fontSize: "1.3rem",
    fontWeight: 500,
    lineHeight: 1.235,
    letterSpacing: "0",
    marginBottom:"5px",
    textAlign:'center'
  }
})

const LicensePlan = () => {
  
  const cls1 = useStyle();  
  const cls2 = useStyle2()

  const [FileInfo, setFileInfo] = useState({
    Total_Licenses:15000,
    Expiry:'22 October 2025',
    License_Type:'Army Cad',
    AMC_RENEWAL:'False'
  })

  return (

    <>
    
      <Paper classes={cls1}>
        <span style={{fontSize:'1.3rem',color:'white'}}>License</span>
      </Paper>
      <Paper classes={cls1}>
        <span style={{fontSize:'1.3rem',color:'white'}}>Plan Expiry</span>
      </Paper>
      <Paper style={{
            padding: '16px',
            borderRadius: '18%',
      }}>
        <Typography className={cls2.heading} variant='h4' color='textPrimary'>Plan Details</Typography>
        <Box>
            <div className='infoCon'>
                <span>Total Licenses : </span>
                <span>{FileInfo.Total_Licenses}</span>
            </div>
            <div>
                <span>Expiry : </span>
                <span>{FileInfo.Expiry}</span>
            </div>
            <div>
                <span>License Type : </span>
                <span>{FileInfo.License_Type}</span>
            </div>
            <div>
                <span>AMC Renewal</span>
                <span>{FileInfo.AMC_RENEWAL}</span>
            </div>
        </Box>
      </Paper>
    
    </>

  )

}

export default LicensePlan