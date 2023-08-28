import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Icon, Tooltip } from "@material-ui/core";
import TouchRipple from "@material-ui/core/ButtonBase";
import MatxVerticalNavExpansionPanel from "./MatxVerticalNavExpansionPanel";
import { withStyles } from "@material-ui/styles";
import { withTranslation } from "react-i18next";
import { isMobile } from "utils";
import { yellow } from "@material-ui/core/colors";
import { connect } from "react-redux";
import { t } from "i18next";

const styles = (theme) => ({
  expandIcon: {
    transition: "transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
    transform: "rotate(90deg)",
  },
  collapseIcon: {
    transition: "transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
    transform: "rotate(0deg)",
  },
});

class MatxVerticalNav extends Component {
  state = {
    collapsed: true,
  };

  renderLevels = (data) => {
    return data.map((item, index) => {
      if (item.children) {
        return (
          <MatxVerticalNavExpansionPanel item={item} key={index}>
            {this.renderLevels(item.children)}
          </MatxVerticalNavExpansionPanel>
        );
      } else {
        return (
          <Tooltip
            key={index}
            title={this.props.t(`${item.name}`)} // on every re-render new t function will be used to avoid hindi english conversion problem
            aria-label={item.name}
            placement="right-start"
            arrow
          >
            <NavLink
              to={item.path}
              className="nav-item"
              onClick={() => {
                if (isMobile()) {
                  this.props.toggleHam(!this.props.showHam);
                }
              }}
            >
              <TouchRipple
                key={item.name}
                name="child"
                className="w-100"
                style={{ color: this.props.theme ? "#fff" : "#1e1616" }}
              >
                {(() => {
                  if (item.icon) {
                    return <Icon className="item-icon ">{item.icon}</Icon>;
                  } else {
                    return <span className="item-icon ">{item.iconText}</span>;
                  }
                })()}
                {/* <span className="item-text">{item.name}</span> */}
                {item.badge && (
                  <div className={`badge bg-${item.badge.color}`}>
                    {item.badge.value}
                  </div>
                )}
              </TouchRipple>
            </NavLink>
          </Tooltip>
        );
      }
    });
  };

  handleClick = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  render() {
    return (
      <div className="navigation">
        {this.renderLevels(this.props.navigation)}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  theme: state.theme,
});

export default withRouter(
  connect(
    mapStateToProps,
    {}
  )(withTranslation()(withStyles(styles)(MatxVerticalNav)))
);
