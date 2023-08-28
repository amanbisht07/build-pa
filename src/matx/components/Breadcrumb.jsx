import React, { Fragment, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import HomeIcon from "@material-ui/icons/Home";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

const Breadcrumb = ({ routeSegments, otherData }) => {
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state);
  const [width, setWidth] = useState(window.innerWidth);
  const { showPa } = useSelector((state) => state.appRoutes);


  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, [])

  return (
    <div className="flex flex-middle position-relative app-breadCrumb">
      <NavLink
        to={`${showPa ? "/eoffice/dashboard/analytics" : "/eoffice/inbox/file"
          }`}
      >
        <HomeIcon
          fontSize="small"
          style={{
            color: theme ? "rgb(119, 135, 153)" : "rgb(53, 76, 100)",
          }}
        />
      </NavLink>

      <div
        style={{ marginBottom: "6px", display: "flex", alignItems: "center" }}
      >
        {routeSegments
          ? routeSegments.map((route, index) => (
            <Fragment key={index}>
              <ArrowForwardIosIcon
                style={{
                  fontSize: ".8rem",
                  color: theme ? "#fff" : "gray",
                }}
              />
              {index !== routeSegments.length - 1 ? (
                <NavLink to={route.path}>
                  <span
                    style={{
                      fontSize: "12px",
                      color: theme
                        ? "rgb(119, 135, 153)"
                        : "rgb(53, 76, 100)",
                      fontWeight: "bold",
                    }}
                    className="capitalize"
                  >
                    {route.name}
                  </span>
                </NavLink>
              ) : (
                <span style={{ fontSize: "12px" }} className="capitalize">
                  {route.name}
                </span>
              )}
            </Fragment>
          ))
          : null}
        {otherData &&
          otherData.map((data, index) => {
            if (data.value != "UNDEFINED") {
              return <Fragment key={index}>
                {index !== otherData.length - 1 ? (
                  <span
                    style={{
                      fontSize: "12px",
                      display: width < 750 ? "none" : "block",
                    }}
                    className="capitalize"
                  >
                    &nbsp;|{" "}
                    <span style={{ fontWeight: "800" }}>{data.key} - </span>
                    {data.value}
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: "12px",
                      display: width < 750 ? "none" : "block",
                    }}
                    className="capitalize"
                  >
                    &nbsp;|{" "}
                    <span style={{ fontWeight: "800" }}>{data.key} - </span>
                    {data.value}
                  </span>
                )}
              </Fragment>
            }
          })}
      </div>
    </div>
  );
};

export default Breadcrumb;
