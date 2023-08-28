import React from "react";
import { useContext } from "react";
import { SplitViewContext } from "../Worker";
import ViewOne from "./ViewOne";
import { CoalitionContext } from "./Worker";
import YlowNotes from "../../YlowNotes";
import CloseFile from "../../CloseFile";
import Remarks from "../../Remarks";

const CoalitionContainer = () => {
  const { alignment } = useContext(SplitViewContext);
  const obj = useContext(CoalitionContext);

  return (
    <>
      <div className="web_view">
        {alignment === "one" ? <ViewOne /> :  <ViewOne />}
      </div>
      <div className="mobile_view">
        {/* <MobileView /> */}
      </div>

      {/* <Remarks /> */}

      {/* <YlowNotes /> */}

      {/* <CloseFile />/ */}
    </>
  );
};

export default CoalitionContainer;
