import React, { Component, Fragment } from "react";
import {Grid, AppBar, Tabs, Tab, Icon} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import Tab1 from "./subInitiate/Tab1";
import {NavLink} from "react-router-dom";
import {Breadcrumb} from "../../../matx";
import { withTranslation } from "react-i18next";

class SubInitiate extends Component {
    state = {
        value: 0,
        dataRow: [],
        open: false
    };

    handleClickOpen = () => {
        this.setState({open : true});
        console.log(this.state.open)
    };

    handleClose = () => {
        this.setState({open : false});
    };

    handleOnChangeTabValue = (e, val) => {
        this.setState({value:val});
    };
    render() {
        let {theme,row,currentData, t} = this.props;

        //Row Data from Initiate Page
        const rowsCurrenData = JSON.stringify(this.props.location.state);
        // this.setState({dataRow:rowsCurrenData});
        let {
            value
        } = this.state;

        return (
            <Fragment>
                <div className="m-sm-20">
                    <AppBar position="static">
                        <Tabs value={value} onChange={this.handleOnChangeTabValue} style={{color: "white",
                            marginTop: '-69px',
                            marginLeft: '118px',
                            width: '40vw',
                            zIndex: '1500',
                            position: 'fixed'}}>
                            <Tab label="BM" />
                            <Tab label={t("collation_cover")} />
                            <Tab label={t("linked_files")} />
                        </Tabs>
                    </AppBar>
                    <Grid item>
                        <Breadcrumb
                            routeSegments={[
                                { name: t("initiate"), path: "/costa/initiate/file" },
                                { name: t("file_approval"), path: "/costa/file/send" }
                            ]}
                        />
                        <TabPanel value={value} index={0}><Tab1 currentData={rowsCurrenData} /></TabPanel>
                        <TabPanel value={value} index={1}>Tab 2</TabPanel>
                        <TabPanel value={value} index={2}>Tab 3</TabPanel>
                    </Grid>
                </div>
            </Fragment>
        );

    }

}

export default withStyles({}, { withTheme: true })(withTranslation()(SubInitiate));
function TabPanel(props) {
    const { children, value, index } = props
    return (<div>
        {
            value === index && (
                <h1>{children}</h1>
            )
        }
    </div>)
}
