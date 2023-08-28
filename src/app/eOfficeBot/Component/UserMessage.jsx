import { Avatar } from "@material-ui/core";
import React from "react";
import { useEffect } from "react";
import { FaUser } from "react-icons/fa";

const UserMessage = ({ uuid, message, blob }) => {
  
  // useEffect(() => {
  //   scrollToBottm();
  // }, []);

  useEffect(() => {
    if (blob) {
      const file = new File([blob], "New ss", { type: "image/png" });
      console.log(file);
    }
  }, [blob]);

  // const scrollToBottm = () => {
  //   let element = document.getElementById("botId");
  //   element.scrollTo({
  //     top: element.scrollHeight - element.clientHeight,
  //     behavior: "smooth",
  //   });
  // };

  const handleFullScreen = (blob) => {
    let src = URL.createObjectURL(blob);
    window.open(src);
  };

  if (blob) {
    return (
      <div className="user-message-img-container">
        <div className="userMessage-img">
          <img
            className="ss-img-user"
            src={blob ? URL.createObjectURL(blob) : ""}
            alt="ScreenShot"
            onClick={() => handleFullScreen(blob)}
          />
          {message && <span>{message}</span>}
        </div>
      </div>
    );
  } else {
    return (
      <div className="user-message-container">
        <div className="userMessage-img">
          <span>{message}</span>
        </div>
      </div>
    );
  }
};

export default UserMessage;
