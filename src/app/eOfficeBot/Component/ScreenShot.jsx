import { IconButton } from "@material-ui/core";
import React, { useEffect } from "react";
import CloseIcon from "@material-ui/icons/Close";

const ScreenShot = ({ screenShot, handleScreenShot, handleClose }) => {
  useEffect(() => {
  }, [screenShot, handleScreenShot]);

  const handleFullScreen = () => {
    let src = URL.createObjectURL(screenShot);
    window.open(src);
  };

  return (
    <div
      className={`${
        screenShot ? "show-screenShot" : "hide-screenShot"
      } ss-img-container`}
    >
      <IconButton onClick={handleClose}>
        <CloseIcon />
      </IconButton>
      <img
        className="ss-img"
        src={screenShot ? URL.createObjectURL(screenShot) : ""}
        alt="ScreenShot"
        onClick={handleFullScreen}
      />
    </div>
  );
};

export default ScreenShot;
