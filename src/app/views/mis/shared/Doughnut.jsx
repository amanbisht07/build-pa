import React from "react";
import ReactEcharts from "echarts-for-react";
import { withStyles } from "@material-ui/styles";
import { useEffect } from "react";

const DoughnutChart = ({ height, color = [], data, onClickBar, blnShowLengend, barTitle, theme }) => {
  const option = {
    // backgroundColor: "aliceblue",
    legend: {
      show: blnShowLengend,
      itemGap: 20,
      icon: "circle",
      bottom: 0,
      textStyle: {
        color: "black",
        fontWeight: "800",
        fontSize: 14,
        fontFamily: "roboto"
      }
    },
    tooltip: {
      show: false,
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    title: {
      text: barTitle,
      left: "10",
      top: "0",
      textStyle: {
        color: "slategray",
        fontSize: 16
      }
    },
    calculable: true,
    xAxis: [
      {
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        }
      }
    ],
    yAxis: [
      {
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        }
      }
    ],

    series: [
      {
        name: "SAU",
        type: "pie",
        radius: ["50%", "80%"],
        center: ["50%", "42%"],
        animationDuration: 3000,
        animationEasing: "quarticInOut",
        avoidLabelOverlap: true,
        selectedMode: "single",
        hoverOffset: 8,
        stillShowZeroSum: false,
        label: {
          normal: {
            show: false,
            position: "center", // shows the description data to center, turn off to show in right side
            textStyle: {
              color: theme.palette.text.secondary,
              fontSize: 15,
              fontFamily: "roboto"
            },
            formatter: "{a}"
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: "14",
              fontWeight: "800"
              // color: "rgba(15, 21, 77, 1)"
            },
            formatter: function (params) {
              let tempData = params.data;
              return (`${tempData.name} \n ${tempData.label}`)
            }
          }
        },
        labelLine: {
          normal: {
            show: true,
            smooth: false,
            length: 20,
            length2: 10
          },
          emphasis: {
            show: true
          }
        },
        data: [
          ...data
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  };

  let echartsReactRef = "";

  useEffect(() => {
    const echartsInstance = echartsReactRef.getEchartsInstance();
    const zr = echartsInstance.getZr();

    echartsInstance.on('click', onChartClick);
  },[])
  
  const onChartClick = (...rest) => {
    if(rest[0].data){
      onClickBar({'boolVal': true, barClicked: rest[0].data.name, rowID: rest[0].data.rowID })
    }
};

  return (
    <ReactEcharts ref={(e) => {
      echartsReactRef = e;
  }}
      style={{ height: height }}
      option={{
        ...option,
        color: [...color]
      }}
    />
  );
};

export default withStyles({}, { withTheme: true })(DoughnutChart);
