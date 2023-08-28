import React, { useEffect, useState } from "react";
import {
  withStyles,
  MuiThemeProvider,
  Dialog,
  DialogContent,
} from "@material-ui/core";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import "./footer.css";

const languages = [
  {
    code: "hi",
    name: "हिन्दी",
  },
  {
    code: "en",
    name: "English",
  },
];

const Footer = ({ theme, settings, show }) => {
  const lang = Cookies.get("i18next");
  const { t } = useTranslation();
  const footerTheme = settings.themes[settings.footer.theme] || theme;

  const [zoomValue, setZoomValue] = useState(100);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.zoom = `${zoomValue}%`;
  }, [zoomValue]);

  return (
    <>
      <MuiThemeProvider theme={footerTheme}>
        <div className="AppBottom">
          <div className="Footercontainer">
            <div className="eOffice">
              <p
                style={{
                  fontSize: "12px",
                  position: "relative",
                  color: "#fff",
                  margin: "auto",
                  marginTop: "5px",
                  right: "10em",
                }}
              >
                &reg; {t("indian_airforce_automated_cell")}
              </p>
            </div>
            <div className="versions">
              <p
                style={{
                  cursor: "pointer",
                  color: "#fff",
                  position: "relative",
                  margin: "auto",
                  marginTop: "5px",
                }}
                onClick={() => setOpen(true)}
              >
                v1.1.1
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div style={{ display: "flex", marginLeft: "-30px" }}>
                {languages.map(({ code, name }, i) => (
                  <p
                    key={i}
                    onClick={() => i18next.changeLanguage(code)}
                    style={{
                      padding: "0 .5rem",
                      color: lang === code ? "#fff" : "rgb(180 177 177)",
                      cursor: "pointer",
                      margin: "auto",
                      marginTop: "5px",
                    }}
                  >
                    {name}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <div>
            <p style={{ fontWeight: "bold" }}>Frontend Version - 1.0.0</p>
          </div>
          <div>
            <p style={{ fontWeight: "bold" }}>Backend Versions</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

Footer.propTypes = {
  settings: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  settings: state.layout.settings,
});

export default withStyles(
  {},
  { withTheme: true }
)(connect(mapStateToProps, {})(Footer));
