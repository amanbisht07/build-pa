import React from "react";
import { useState } from "react";
import "../therme-source/material-ui/loading.css";
import { Loading } from "../therme-source/material-ui/loading";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Grid } from "@material-ui/core";
import { Breadcrumb } from "matx";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import ViewOne from "./splitViewScreen/ViewOne";
import ViewTwo from "./splitViewScreen/ViewTwo";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { CgViewDay, CgViewSplit } from "react-icons/cg";
import { connect } from "react-redux";

const SplitView = (props) => {
  const { t } = useTranslation();

  let title = Cookies.get("inboxFile");
  let priority = Cookies.get("priority");
  let partCase = Cookies.get("partCase");
  let referenceNumber = Cookies.get("referenceNumber");
  let isRti = Cookies.get("isRti");
  let isCabinet = Cookies.get("isCabinet");
  let isFile  = Cookies.get("isFile")

  const [tabIndex, settabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [alignment, setAlignment] = useState("one");

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <div className="m-sm-30">
      {/*{loading && <Loading />}*/}

      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={8}>
          <Breadcrumb
            routeSegments={[
              // { name: t("inbox"), path: "/eoffice/inbox/file" },
              {
                name:
                  isRti === "true"
                    ? t("RTI FILE")
                    : partCase === "true"
                    ? t("cabinet")
                    : t("inbox"),
                path: `/eoffice/${
                  isRti === "true"
                    ? "rti"
                    : partCase === "true"
                    ? "cabinet"
                    : "inbox"
                }/file`,
              },
              { name: t("file"), path: "/costa/splitView/file" },
            ]}
            otherData={[
              { key: t("subject"), value: title?.toUpperCase() },
              { key: t("ref_no"), value: referenceNumber?.toUpperCase() },
              { key: t("priority"), value: priority?.toUpperCase() },
            ]}
          />
        </Grid>
        <Grid item xs={4} className="inbox_view_btn">
          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleAlignment}
            aria-label="text alignment"
          >
            <ToggleButton value="one" id="inbox_view_one" aria-label="one">
              <CgViewSplit />
            </ToggleButton>
            <ToggleButton value="two" id="inbox_view_two" aria-label="two">
              <CgViewDay />
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>

      {isCabinet || isRti || isFile ? (
        <ViewOne />
      ) : (
        <Tabs
          forceRenderTabPanel
          selectedIndex={tabIndex}
          onSelect={(index) => settabIndex(index)}
        >
          <TabList className="inbox-tabsList">
            <Tab style={{ borderRadius: "5px 5px 0 0" }}>BM</Tab>
            <Tab style={{ borderRadius: "5px 5px 0 0" }}>Coalition Cover</Tab>
          </TabList>
          <TabPanel>{alignment === "two" ? <ViewTwo /> : <ViewOne />}</TabPanel>
          <TabPanel>
            <h1>Coalition Cover</h1>
          </TabPanel>
        </Tabs>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    props: state.props,
  };
};
export default connect(mapStateToProps, {})(SplitView);
