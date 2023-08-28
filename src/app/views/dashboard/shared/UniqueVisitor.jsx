
import React, { useEffect, useState, useRef } from "react";
import "chart.js/auto";
import { connect, useDispatch } from "react-redux";
import { Box, Divider, FormControl, Grid, makeStyles, Paper, Select, Typography } from "@material-ui/core";
import { Chart as ChartJs, Tooltip, Title, Legend, Chart } from "chart.js";
import { getUniquedata } from "app/camunda_redux/redux/action";
import "./loading.css";
import { Loading } from "app/views/Personnel/therme-source/material-ui/loading";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";

ChartJs.register(Tooltip, Title, Legend);

const optionsValue = [
    { label: "Today", value: "Today" },
    { label: "Week", value: "Week" },
    { label: "Total", value: "Total" },
];

const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const UniqueVisitor = (props) => {

    const dispatch = useDispatch();
    const username = localStorage.getItem("username");
    const [loading, setLoading] = useState(false);
    const [time, setTime] = useState("Today");
    const [chardata, setChartdata] = useState([]);

    const useStyles = makeStyles({
        ori_feedback: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.3rem",
            cursor: "pointer",
        },
    });

    const classes = useStyles();

    const handleChange = (event) => {
        const selectedOption = event.target.value;
        setTime(selectedOption);
    };

    useEffect(() => {
        const selectedOption = optionsValue.find((option) => option.value === time);
        if (selectedOption) {
            setTime(selectedOption.value);
        }
    }, [time, optionsValue]);

    useEffect(() => {
        setLoading(true);
        let abortSignal = new AbortController();
        props
            .getUniquedata(time, username, abortSignal.signal)
            .then((response) => {
                try {
                    if (response.error) {
                        if (response.error.includes("aborted")) {
                            return;
                        }
                        setLoading(false);
                        callMessageOut("error", response.response.error);
                    } else {
                        setLoading(false);
                        setChartdata(response.response);
                    }
                } catch (error) {
                    setLoading(false);
                    console.log(error.message);
                    callMessageOut("error", error.message);
                }
            })
            .catch((error) => {
                console.error(error);
                callMessageOut("error", error.message);
                setLoading(false);
            });

        return () => {
            abortSignal.abort()
        }

    }, [time]);

    const callMessageOut = (type, message) => {
        dispatch(setSnackbar(true, type, message));
    };

    const chartRef = useRef(null);

    useEffect(() => {
        let chartInstance = null;

        if (chartRef.current) {
            if (chartInstance) {
                chartInstance.destroy();
            }

            const colors = chardata?.[0]?.data.map(() => getRandomColor());

            chartInstance = new Chart(chartRef.current, {
                type: "pie",
                data: {
                    labels: chardata?.[0]?.labels,
                    datasets: [
                        {
                            data: chardata?.[0]?.data,
                            backgroundColor: colors,
                        },
                    ],
                },
                options: {
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                },
            });
        }

        return () => {
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, [chardata]);

    return (
        <>
            {loading && <Loading />}
            <div>
                <Paper>
                    <div>
                        <Box>
                            <div className={classes.ori_feedback}>
                                <div style={{ display: "flex", alignItems: "center", gap: '0.5rem' }} >
                                    <Typography variant="body1"> Total Unique Visitors: </Typography>
                                    <span style={{ fontWeight: "600" }} >  {chardata[0]?.sum}</span>
                                </div>
                                <div>
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
                                </div>
                            </div>
                        </Box>
                    </div>
                    <Divider />
                    <Grid container style={{ display: "flex", justifyContent: "center", padding: "0.5rem" }} >
                        <Grid item xs={9}  >
                            <canvas ref={chartRef} />
                        </Grid>
                    </Grid>
                </Paper >
            </div >
        </>
    );
};


function mapStateToProps(state) {
    return {
        props: state.props,
        subscribeApi: state.subscribeApi,
    };
}

export default connect(mapStateToProps, {
    getUniquedata,
})(UniqueVisitor);