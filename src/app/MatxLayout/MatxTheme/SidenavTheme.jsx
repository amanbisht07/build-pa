import React from "react";
import { Helmet } from "react-helmet";

const SidenavTheme = ({ theme, settings }) => {
  function darkHoverStyle() {
    return theme.palette.type === "dark"
      ? `.navigation .nav-item:hover,
        .navigation .nav-item.active {
          color: white;
        }`
      : "";
  }

  function lightHoverStyle() {
    return theme.palette.type === "light"
      ? `.navigation .nav-item:hover,
        .navigation .nav-item.active,
        .navigation .submenu {
          background: rgba(0, 0, 0, .08);
        }`
      : "";
  }

  return (
    <Helmet>
      <style>
        {`
        
        ${
          theme.palette.type === "dark"
            ? `.sidenav {
          color: white;
        }`
            : " "
        }

        .sidenav__hold {
          opacity: 1 !important;
        }

        // .sidenav__hold::after {
        //   background: #37403c;
        //   opacity: ${settings.layout1Settings.leftSidebar.bgOpacity};
        // }

        .navigation .nav-item{
          position:relative
        }

        .navigation .nav-item.active .nav-item-right-arrow{
          display:${settings.layout1Settings.leftSidebar.mode=="close"?"none":"initial"};
          position: absolute;
          width: 0;
          height: 0px;
          border-top: 17px solid transparent;
          border-bottom: 17px solid transparent;
          border-left: 17px solid #FFAF38;
          right: -36%;
          top: 0%;
        }

        .navigation .nav-item:not(.badge) {
          color: white;
        }

        .navigation .nav-item .icon-text::after {
          background: ${theme.palette.text.primary};
        }

        .navigation .nav-item.active, 
        .navigation .nav-item.active:hover {
          background: ${theme.palette.secondary.main};
          border-radius: 50%;   
        }padding: 0 7px

        
        ${darkHoverStyle()}
        
      `}
      </style>
    </Helmet>
  );
};

export default SidenavTheme;
