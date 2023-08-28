import React, { useEffect, useState, useRef } from "react";
import "chart.js/auto";
import {
  Chart as ChartJs,
  Tooltip,
  Title,
  ArcElement,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";

import {
  Box,
  Divider,
  FormControl,
  makeStyles,
  Paper,
  Select,
  Typography,
} from "@material-ui/core";
import { getchardata } from "app/camunda_redux/redux/action";
import { connect, useDispatch, useSelector } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { Chart, registerables } from "chart.js";
import "./loading.css";
import { Loading } from "app/views/Personnel/therme-source/material-ui/loading";

ChartJs.register(
  Tooltip,
  Title,
  ArcElement,
  Legend,
  CategoryScale,
  LinearScale
);

const optionsValue = [
  { label: "Today", value: "Today" },
  { label: " Week", value: " Week" },
  { label: " Month", value: " Month" },
  { label: " Year", value: " Year" },
];

// -------------------------------------new chart---------------------------------------

Chart.register(...registerables);

const options = {
  scales: {
    x: {
      type: "category",
      beginAtZero: true,
      stacked: true,
      ticks: {
        display: "auto", // Show only bottom labels on the x-axis
      },
    },
    y: {
      beginAtZero: true,
      stacked: true,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

const Feedbackchart = (props) => {
  const dispatch = useDispatch();
  const username = localStorage.getItem("username");
  const [time, setTime] = useState("Today");
  const [loading, setLoading] = useState(false);
  const [chardata, setChartdata] = React.useState([]);

  const { theme } = useSelector((state) => state);

  const useStyles = makeStyles({
    ori_feedback: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0.3rem",
    },
  });

  const classes = useStyles();

  const handleChange = (event) => {
    const selectedOption = event.target.value;
    setTime(selectedOption);
    handlegetchardata(selectedOption);
  };

  useEffect(() => {
    // Find the selected option object based on the value
    const selectedOption = optionsValue.find((option) => option.value === time);
    if (selectedOption) {
      setTime(selectedOption.value);
    }
  }, [time, optionsValue]);

  const handlegetchardata = (value, abortSignal) => {
    setLoading(true);
    props
      .getchardata(value, abortSignal)
      .then((response) => {
        try {
          if (response.error) {
            setLoading(false);
            if (response?.error?.includes("aborted")) {
              return;
            }
            callMessageOut("error", response.error);
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
        setLoading(false);
        console.error(error);
        callMessageOut("error", error.message);
      });
  };

  const callMessageOut = (type, message) => {
    dispatch(setSnackbar(true, type, message));
  };

  useEffect(() => {
    let feedbackAbort = new AbortController();
    handlegetchardata(time, feedbackAbort.signal);

    return () => {
      feedbackAbort.abort();
    };
  }, []);

  const chartRef = useRef(null);

  useEffect(() => {
    let chartInstance = null;

    if (chartRef.current) {
      if (chartInstance) {
        chartInstance.destroy();
      }

      chartInstance = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: [`1⭐`, "2 ⭐", "3 ⭐", "4 ⭐", " 5 ⭐"],
          datasets: chardata?.map((item, index) => ({
            label: item.label,
            data: item.data,
            backgroundColor: item.data?.map((value) => {
              // Generate a random color for each data point
              const randomColor =
                "#" + Math.floor(Math.random() * 16777215).toString(16);
              return randomColor;
            }),
            // borderColor: item.data.map(() => "rgba(0, 0, 0, 1)"),
            // borderWidth: 1,
          })),
        },
        options: options,
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
                <div>
                  <Typography variant="body1">
                    Organization Feedback⭐
                  </Typography>
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
          <div>
            <canvas ref={chartRef} />
          </div>
        </Paper>
      </div>
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
  getchardata,
})(Feedbackchart);
