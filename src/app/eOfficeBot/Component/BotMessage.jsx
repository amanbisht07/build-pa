import { Avatar } from "@material-ui/core";
import React, { useState } from "react";
import { FaRobot } from "react-icons/fa";
import Loading from "./Loading";
import { FaFilePdf } from "react-icons/fa";
import { useEffect } from "react";
import { MdOutlineDownloadForOffline } from "react-icons/md";

const BotMessage = ({ uuid, message, blob, fileName }) => {
  const [loading, setloading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setloading(false);
    }, 400);
  }, []);

  const handleFullScreen = (string) => {
    const url = convertToBlob(string);
    window.open(url);
  };

  const handleDownload = (base64) => {
    // Convert Base64 to Blob
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    // Simulate click to trigger download
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
  };

  const convertToBlob = (string) => {
    const decodedBytes = Buffer.from(string, "base64");
    const blob = new Blob([decodedBytes], { type: "image/png" });
    const url = URL.createObjectURL(blob);
    return url;
  };

  if (fileName && blob) {
    return (
      <div className="bot-message-container">
        <Avatar
          variant="circular"
          className="botAvatar"
          src={`${process.env.PUBLIC_URL}/assets/images/bot-logo.png`}
        >
          <FaRobot />
        </Avatar>
        <div className="botMessage-pdf-con">
          {loading ? (
            <Loading />
          ) : (
            <div className="botMessage-pdf">
              <div className="botMessage-pdf-file">
                <FaFilePdf className="pdf-dwld-btn" />
                <span>{fileName}</span>
                <MdOutlineDownloadForOffline
                  className="pdf-dwld-btn"
                  style={{
                    cursor:"pointer"
                  }}
                  onClick={() => handleDownload(blob)}
                />
              </div>
              {message && <span>{message}</span>}
            </div>
          )}
        </div>
      </div>
    );
  } else if (blob) {
    return (
      <div className="bot-message-container">
        <Avatar
          variant="circular"
          className="botAvatar"
          src={`${process.env.PUBLIC_URL}/assets/images/bot-logo.png`}
        >
          <FaRobot />
        </Avatar>
        <div className="botMessage-img-con">
          {loading ? (
            <Loading />
          ) : (
            <div className="botMessage-img">
              <img
                className="ss-img-bot"
                src={blob ? convertToBlob(blob) : ""}
                alt="ScreenShot"
                onClick={() => handleFullScreen(blob)}
              />
              {message && <span>{message}</span>}
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="bot-message-container">
        <Avatar
          variant="circular"
          className="botAvatar"
          src={`${process.env.PUBLIC_URL}/assets/images/bot-logo.png`}
        >
          <FaRobot />
        </Avatar>
        <div className="botMessage">
          {loading ? <Loading /> : <span>{message}</span>}
        </div>
      </div>
    );
  }
};

export default BotMessage;
