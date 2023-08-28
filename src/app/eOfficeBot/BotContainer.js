import {
  ClickAwayListener,
  Dialog,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { useContext, useEffect } from "react";
import "./Bot.css";
import { FaRobot } from "react-icons/fa";
import { BotContext } from "./BotContext";
import { MdWavingHand } from "react-icons/md";
import Bot from "./Component/Bot";
import Draggable from "react-draggable";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function BotContainer() {
  const { openBot, setopenBot } = useContext(BotContext);
  const [hideMsg, setHideMsg] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setTimeout(() => {
      hideMessage();
    }, 6000);
  }, []);

  const hideMessage = () => {
    setHideMsg(true);
  };

  return (
    <ClickAwayListener onClickAway={() => setopenBot(false)}>
      <div id="Bot">
        {openBot ? (
          <Dialog open={openBot} hideBackdrop>
            <Bot />
          </Dialog>
        ) : (
          <Draggable
            handle="#draggable-dialog-title-botBtn"
            cancel={".cancel-drag"}
          >
            <div
              className="botBtn-container"
              aria-labelledby="draggable-dialog-title-botBtn"
              id="draggable-dialog-title-botBtn"
            >
              <Tooltip title={t("eOffice_chatbot")}>
                <IconButton
                  className="botBtn"
                  size="medium"
                  onClick={() => setopenBot(true)}
                >
                  <FaRobot className="cancel-drag" />
                </IconButton>
              </Tooltip>

              <div
                className={`botBtn-msg cancel-drag ${hideMsg ? "hide" : ""}`}
                onClick={hideMessage}
              >
                <IconButton disabled>
                  <MdWavingHand
                    style={{
                      color: "#FFAF38",
                    }}
                  />
                </IconButton>
                <span>Hi there! Got any questions? I can help you</span>
              </div>
            </div>
          </Draggable>
        )}
      </div>
    </ClickAwayListener>
  );
}

export default BotContainer;
