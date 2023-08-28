import React, {useState} from "react";
import {withStyles} from "@material-ui/styles";
import {Grid} from "@material-ui/core";
import {Breadcrumb} from "../../../matx";
import MisTable from "./shared/MisTable";
import DetailedTable from "./shared/DetailedTable";


function Mis () {
    const [selectionMode, setSelectionMode] = useState(true);
    const [headerText,setHeaderText] = useState([]);


    return (
        <div className="m-sm-30">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <MisTable setSelectionMode={setSelectionMode} setHeaderText={setHeaderText} />
                </Grid>
            </Grid>
            <Grid container spacing={2} style={{marginTop: '30px'}}>
                <Grid item xs={12}>
                    <DetailedTable selectionMode={selectionMode} headerText={headerText} />
                </Grid>
            </Grid>
        </div>
    )
}
export default withStyles({}, { withTheme: true })(Mis);
