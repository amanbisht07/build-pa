import React, { Component, useEffect, useState } from "react";
import { Grid, Card, Icon, IconButton, Tooltip } from "@material-ui/core";
import TableCard from "./TableCard";
import { useTranslation } from "react-i18next";
import CardDashboard from "./CardDashboard";
import BarDashboard from "./BarDashboard";
import { useDispatch, useSelector } from "react-redux";
import { instanceLoadBln } from "../../../camunda_redux/redux/ducks/passData";
import TimelineDashboard from "./TimelineDashboard";
import "../Intersection_observer_animate.css";
import { Loading } from "../therme-source/material-ui/loading";
import Feedbackchart from "./Feedbackchart";
import UniqueVisitor from "./UniqueVisitor";
import SaveTree from "./SaveTree";

const StatCards = (props) => {
  const [PACount, setPACount] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const callBackTotalCount = (val) => {
    setPACount(val);
  };
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const CardData = useSelector((state) => state.dashboard.getDashboardData);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("show", entry.isIntersecting);
          if (entry.isIntersecting) observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.1,
      }
    );

    const animateContainer_1 = document.querySelectorAll(".Aos_animate_d1");
    const animateContainer_2 = document.querySelectorAll(".aos_animate_right");

    Array.from(animateContainer_1[0].children).map((child, i) => {
      observer.observe(child);
      if (i === 1) {
        Array.from(animateContainer_2).map((child, i) => observer.observe(child))
      }
    });

    // pdf webviewer Load only once
    dispatch(instanceLoadBln(true));
  }, []);

  const handleLoading = (val) => {
    setIsLoading(val);
  };

  return (
    <>
      {isLoading && <Loading />}
      <Grid container spacing={2} justifyContent="center" className="mt-2">
        <Grid item xs={12} md={4}>
          <Grid container spacing={2} className="Aos_animate_d1">
            {/* <Grid item xs={12} className="aos_animate_top">
              <SaveTree />
            </Grid> */}
            <Grid item xs={12} className="aos_animate_top">
              <Feedbackchart />
            </Grid>
            <Grid item xs={12} className="aos_animate_left">
              <BarDashboard num={CardData} />
            </Grid>
            {/* <Grid item xs={12} className="aos_animate_left">
              <CardDashboard num={CardData} />
            </Grid> */}
            {/* <Grid item xs={12} className="aos_animate_left">
              <UniqueVisitor />
            </Grid> */}
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          md={8}
          className="widget"
          style={{ marginBottom: "26px" }}
        >
          <div className="aos_animate_right">
            <TableCard
              totalCountPA={callBackTotalCount}
              handleLoading={handleLoading}
            />
          </div>
          {/* <Grid
            item
            xs={12}
            style={{ marginTop: "10px" }}
          >
            <div className="aos_animate_right">
              <Feedbackchart />
            </div>
          </Grid> */}
        </Grid>
      </Grid>
    </>
  );
};

export default StatCards;
