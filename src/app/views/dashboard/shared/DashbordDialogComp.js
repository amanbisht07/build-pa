import React, { useState } from "react";
import SplitViewPdfViewer from "../../inbox/shared/pdfViewer/pdfViewer";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { IconButton } from "@material-ui/core";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useTranslation } from "react-i18next";
import Annexure from "./Annexure";
import PdfViewer from "../../../pdfViewer/pdfViewer";
import { useSelector } from "react-redux";
import { Loading } from "../therme-source/material-ui/loading";
import { CancelOutlined } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  closeDialogBtn: {
    position: "fixed",
    right: "0px",
    zIndex: "11",
  },
}));

const DashbordDialogComp = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useSelector((state) => state);

  const handleLoading = (val) => {
    setIsLoading(val);
  };

  return (
    <div
      style={{ backgroundColor: theme ? "rgb(46 46 46)" : "rgb(241 241 241)" }}
    >
      {isLoading && <Loading />}
      <Tabs
        forceRenderTabPanel
        selectedIndex={tabIndex}
        onSelect={(index) => setTabIndex(index)}
      >
        <TabList>
          <Tab style={{ borderRadius: "5px 5px 0 0" }}>
            {t("personal_application").toUpperCase()}
          </Tab>
          <Tab style={{ borderRadius: "5px 5px 0 0" }}>{t("annexure")}</Tab>
          <IconButton
            id="PAclose_button"
            aria-label="close"
            onClick={() => props.closeDialog()}
            style={{
              color: theme ? "#fff" : "rgba(0, 0, 0, 0.54)",
              float: "right",
              marginTop: "15px",
              marginRight: "20px",
            }}
            className="icons-button"
            size="small"
          >
            <CancelOutlined fontSize="small" />
          </IconButton>
        </TabList>
        <TabPanel>
          <div
            style={{ height: "calc(100vh - 50px)", overflow: "hidden" }}
            className="ss-privacy-hide"
          >
            <SplitViewPdfViewer
              fileUrl={props.pdfUrl}
              pdfLoads={(val) => {
                props.blnPdfLoads(val);
              }}
            />
          </div>
        </TabPanel>
        <TabPanel>
          <Annexure
            showUploader={false}
            fileId={props.fileId}
            sampleData={props.sampleData}
            handleLoading={handleLoading}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default DashbordDialogComp;
