import React, { useEffect, useState } from 'react'
import { Box, Divider, FormControl, Grid, Paper, Select, Typography, makeStyles } from '@material-ui/core'
import { SavePageCounter } from './SavePageCounter';
import "./loading.css";
import { SaveTreeCounter } from './SaveTreeCounter';
import { connect, useDispatch } from "react-redux";
import { treeSaved } from "app/camunda_redux/redux/action"
import { setSnackbar } from 'app/camunda_redux/redux/ducks/snackbar';


const optionsValue = [
    { label: "Today", value: "Today" },
    { label: "Month", value: "Month" },
    { label: "Year", value: "Year" },
];

const SaveTree = (props) => {

    const backgroundImageUrl = process.env.PUBLIC_URL + "/assets/images/gopaperless.jpg";
    // const backgroundImageUrl2 = process.env.PUBLIC_URL + "/assets/images/printpaper.jpg";
    const [time, setTime] = useState("Today");
    const [loading, setLoading] = useState(false);
    const [treedata, setTreedata] = useState({});
    // const [data, setDatasets] = useState({});
    const dispatch = useDispatch();

    useEffect(() => {
        const selectedOption = optionsValue.find((option) => option.value === time);
        if (selectedOption) {
            setTime(selectedOption.value);
        }
    }, [time, optionsValue]);

    const handleChange = (event) => {
        const selectedOption = event.target.value;
        setTime(selectedOption);
    };

    const useStyles = makeStyles({
        ori_feedback: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.3rem",
            cursor: "pointer",
        },
    });

    useEffect(() => {
        let abortSignal = new AbortController();
        loadData(abortSignal.signal);
        const intervalidId = setInterval(loadData, 30000);
        return () => {
            clearInterval(intervalidId)
            abortSignal.abort()
        }
    }, [time])

    const loadData = (abortSignal) => {
        setLoading(true);
        props
            .treeSaved(time, abortSignal)
            .then((response) => {
                try {
                    if (response.error) {
                        if (response?.error?.includes("aborted")) {
                            return;
                        }
                        setLoading(false);

                        // callMessageOut("error", response.response.error);
                    } else {
                        setLoading(false);
                        setTreedata(response.response);
                    }
                } catch (error) {
                    setLoading(false);
                    console.log(error.message);
                    // callMessageOut("error", error.message);
                }
            })
            .catch((error) => {
                console.error(error);
                // callMessageOut("error", error.message);
                setLoading(false);
            });
    };


    const callMessageOut = (type, message) => {
        dispatch(setSnackbar(true, type, message));
    };

    const classes = useStyles();


    // function formatNumber(treedata) {
    //     let pages = treedata?.pages || "";
    //     if (pages !== "") {
    //         if (pages >= 1000000) {
    //             return (pages / 1000000).toFixed(1) + "M";
    //         } else {
    //             return pages.toString();
    //         }
    //     } else {
    //         return "";
    //     }
    // }

    // useEffect(() => {
    //     let data = formatNumber(treedata)
    //     setDatasets(data)
    // }, [treedata]);

    return (
        <>
            <Paper>
                <Grid container >
                    <Grid item xs={12} >
                        <div>
                            <Box>
                                <div className={classes.ori_feedback}>
                                    <div  >
                                        <Typography variant="body1"  > Saved Pages & Tree </Typography>
                                    </div>
                                    {/* <div>
                                        <FormControl variant="outlined" size="small">
                                            <Select
                                                className="ori_formcontrol"
                                                native
                                                value={time}
                                                onChange={handleChange}
                                            >
                                                {optionsValue.map((item) => (
                                                    <option key={item.value} value={item.value}>
                                                        {item.label}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div> */}
                                </div>
                            </Box>
                        </div>
                        <Divider />
                    </Grid>
                    <Grid item xs={12} >
                        <div className="card_div">
                            <div className="content_div">
                                <div className="front">
                                    <div className='tree_img'
                                        style={{
                                            display: "flex",
                                            alignItems: "end",
                                            paddingRight: "1rem",
                                            paddingLeft: "1rem",
                                            backgroundImage:
                                                `url(${backgroundImageUrl})`,
                                            height: "100%",
                                            width: "100%",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center center",
                                            position: "relative",
                                        }}
                                    >
                                        <div className='box_card' >
                                            <SavePageCounter value={treedata?.pages || ""} />
                                        </div>

                                    </div>

                                </div>
                                <div className="back">
                                    <div className='tree_img'
                                        style={{
                                            display: "flex",
                                            alignItems: "end",
                                            paddingRight: "1rem",
                                            backgroundImage:
                                                `url(${backgroundImageUrl})`,
                                            height: "100%",
                                            width: "100%",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center center",
                                            position: "relative",
                                        }}
                                    >
                                        <div className='box_card' >
                                            <SaveTreeCounter value={treedata?.trees || ""} />
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </Paper>
        </>
    )
}


function mapStateToProps(state) {
    return {
        props: state.props,
        subscribeApi: state.subscribeApi,
    };
}

export default connect(mapStateToProps, {
    treeSaved,
})(SaveTree);