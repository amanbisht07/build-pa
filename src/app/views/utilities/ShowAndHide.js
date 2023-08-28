import React from "react";
import { Tooltip } from "@material-ui/core";

const ShowAndHide = ({ data }) => {
  return (
    <>
      <Tooltip  title={data}>
        <span>{data}</span>
      </Tooltip>
    </>
  );
};

export default ShowAndHide;
