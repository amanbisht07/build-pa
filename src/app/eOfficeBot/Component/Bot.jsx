import { Avatar, IconButton, } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { BotContext } from "../BotContext";
import BotBody from "./BotBody";
import BotInput from "./BotInput";
import Draggable from "react-draggable";
import ScreenShot from "./ScreenShot";
import ScrollToBottom from "react-scroll-to-bottom";

const Bot = () => {
  const { setopenBot, helpDesk, connected } = useContext(BotContext);

  const [screenShot, setScreenShot] = useState("");
  const [open, setOpen] = useState(false);

  const handleScreenShot = (blob) => {
    setScreenShot(blob);
    setOpen(true);
  };

  const handleClose = () => {
    setScreenShot("");
    setOpen(false);
  };

  return (
    <Draggable handle="#draggable-dialog-title-bot" cancel={".cancel-drag"}>
      <div className="botContainer">
        <div
          className="botHeader"
          aria-labelledby="draggable-dialog-title-bot"
          id="draggable-dialog-title-bot"
        >
          <Avatar
            src={`${process.env.PUBLIC_URL}/assets/images/bot-logo.png`}
          />
          <div>
            <span
              style={{
                fontSize: "1.5rem",
                color: "white",
              }}
            >
              {helpDesk ? helpDesk : "NA"}
            </span>
            {connected ? (
              <span
                style={{
                  color: "#39ed07",
                  fontWeight: "bolder",
                }}
              >
                Online
              </span>
            ) : (
              <span
                style={{
                  color: "#ed071a",
                  fontWeight: "bolder",
                }}
              >
                Offline
              </span>
            )}
          </div>
          <IconButton onClick={() => setopenBot(false)} className="cancel-drag">
            <RxCross1
              style={{
                color: "white",
              }}
            />
          </IconButton>
        </div>
        <div className="bot-body-inp-con">
          <div className="botBody" id="botId">
            <ScrollToBottom
              className={`scroll-to-bottom ${
                screenShot ? "scroll-hide" : "scroll-show"
              }`}
              mode="bottom"
            >
              <BotBody screenShot={screenShot} />
            </ScrollToBottom>

            <ScreenShot
              screenShot={screenShot}
              handleScreenShot={handleScreenShot}
              handleClose={handleClose}
            />
          </div>

          <div className="BotInput">
            <BotInput
              screenShot={screenShot}
              handleScreenShot={handleScreenShot}
              handleClose={handleClose}
            />
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default Bot;
