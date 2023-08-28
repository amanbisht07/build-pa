import React from "react";
import { useContext } from "react";
import CloseFile from "../../CloseFile";
import Remarks from "../../Remarks";
import YlowNotes from "../../YlowNotes";
import { SplitViewContext } from "../Worker";
import ViewOne from "./ViewOne";
import ViewTwo from "./ViewTwo";
import { BmContext } from "./Worker";
import MobileView from "./MobileView";
import { isTablet } from "utils";
import { useEffect } from "react";
import { useState } from "react";

const BmContainer = () => {
  const { alignment } = useContext(SplitViewContext);
  const obj = useContext(BmContext);

  const [mobile, setmobile] = useState(isTablet());

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = (e) => {
    if (isTablet()) {
      setmobile(true);
    } else {
      setmobile(false);
    }
  };

  return (
    <>
      {/* {mobile ? (
        <div className="mobile_view">
          <MobileView />
        </div>
      ) : (
        <div className="web_view">
          {alignment === "one" ? <ViewOne /> : <ViewOne />}
        </div>
      )} */}

      <div className="web_view">
        {alignment === "one" ? <ViewOne /> : <ViewOne />}
      </div>

      <Remarks />

      <YlowNotes />

      <CloseFile />
    </>
  );
};

export default BmContainer;
