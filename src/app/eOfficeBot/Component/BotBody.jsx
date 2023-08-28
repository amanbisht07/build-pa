import React, { useContext } from "react";
import { BotContext } from "../BotContext";
import BotMessage from "./BotMessage";
import UserMessage from "./UserMessage";

const BotBody = (props) => {
  const { screenShot } = props;
  const { messages } = useContext(BotContext);

  return (
    <div className={screenShot ? "hide-messages" : "show-messages"}>
      {messages.map((item, index) => {
        return item.component;
      })}
    </div>
  );
};

export default BotBody;
