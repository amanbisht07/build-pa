import { IconButton, TextField } from "@material-ui/core";
import { Send } from "@material-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useContext, useEffect, useState } from "react";
import { BotContext } from "../BotContext";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import html2canvas from "html2canvas";
import imageCompression from "browser-image-compression";
import Loading from "./Loading";

const BotInput = (props) => {
  const { addUserMsg, connected } = useContext(BotContext);

  const [loading, setloading] = useState(false);

  const validationSchema = Yup.object({
    userQuery: Yup.string()
      .trim()
      .test((userQuery) => {
        if (props.screenShot) return true;
        else if (userQuery) return true;
        else return false;
      }),
  });

  const initialValues = {
    userQuery: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: askChatGpt,
  });

  function askChatGpt(data, action) {
    if (props.screenShot) {
      addUserMsg(data.userQuery, props.screenShot);
      props.handleClose();
    } else {
      addUserMsg(data.userQuery);
    }
    action.resetForm();
  }

  const takeScreenshot = () => {
    setloading(true);
    const ignoreNode = document.getElementById("draggable-dialog-title-bot");
    let scrollX = window.scrollX;
    let scrollY = window.scrollY;
    html2canvas(document.body, {
      ForeignObject: true,
      ignoreElements: (node) => node == ignoreNode,
      width: window.innerWidth,
      height: window.innerHeight,
      logging: false,
      x: scrollX,
      y: scrollY,
      scale: 6,
      onclone: (clonedDoc) => {
        handlePrivacy(clonedDoc);
      },
    }).then((canvas) => {
      canvas.toBlob(async (blob) => {
        const compressedBlob = await imageCompression(blob, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });
        setloading(false);
        props.handleScreenShot(compressedBlob);
      });
    });
  };

  const handlePrivacy = (cloneNode) => {
    const hideDocs = cloneNode.querySelectorAll(".ss-privacy-hide");

    hideDocs.forEach((item) => {
      const privacyDiv = document.createElement("div");
      privacyDiv.setAttribute("class", ".ss-privacy-content");
      privacyDiv.textContent = "Privacy Content";

      if (item) {
        item.innerHTML = `<div class="ss-privacy-content">Privacy Content</div>`;
      }
    });
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <TextField
            name="userQuery"
            size="small"
            className="bot-user-input"
            id="userQuery"
            placeholder="Message"
            variant="outlined"
            value={formik.values.userQuery}
            onChange={formik.handleChange}
            disabled={!connected}
          />

          <IconButton
            disableFocusRipple
            disableRipple
            disableTouchRipple
            onClick={takeScreenshot}
            className="bot-input-SS-btn"
          >
            <AddAPhotoIcon />
          </IconButton>
          {props.screenShot ? (
            <IconButton
              disableFocusRipple
              disableRipple
              disableTouchRipple
              className="bot-input-SS-btn"
            >
              <AddPhotoAlternateIcon />
            </IconButton>
          ) : (
            ""
          )}
        </div>

        {loading && (
          <div className="ss-loading">
            <Loading />
          </div>
        )}

        <IconButton
          className="bot-input-send-btn"
          type="submit"
          color="primary"
          size="small"
          disabled={
            (!props.screenShot && !formik.values.userQuery) || !connected
          }
        >
          <Send />
        </IconButton>
      </form>
    </>
  );
};

export default BotInput;
