import React from "react";
import "../../therme-source/material-ui/loading.css";
import "react-tabs/style/react-tabs.css";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import SplitViewProvider from "./Worker";
import SplitViewer from "./SplitViewer";

const SplitView = (props) => {
  const { t } = useTranslation();

  return (
    <SplitViewProvider>
        <SplitViewer/>
    </SplitViewProvider>
  );
};

const mapStateToProps = (state) => {
  return {
    props: state.props,
  };
};
export default connect(mapStateToProps, {})(SplitView);
