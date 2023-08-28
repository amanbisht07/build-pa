import { Tooltip } from "@material-ui/core";
import React, { useRef } from "react";
import { useEffect } from "react";

const RenderOption = ({ option }) => {
  const renderRef = useRef();
  let tipTitle = option.replaceAll("<b>", "").replaceAll("</b>", "");
  useEffect(() => {
    if (option) {
      const words = option.split(" ");
      let truncatedOption = words.slice(0, 15).join(" ");

      if (words.length > 15) {
        truncatedOption += " ...";
      }
      renderRef.current.innerHTML = truncatedOption;
      console.log(option);
    }
  }, [option]);

  return (
    <Tooltip title={tipTitle}>
      <div ref={renderRef}></div>
    </Tooltip>
  );
};

export default RenderOption;
