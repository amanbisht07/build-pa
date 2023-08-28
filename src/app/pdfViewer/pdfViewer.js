import React, { createElement, memo, useEffect, useRef, useState } from "react";
import WebViewer from "@pdftron/webviewer";
import "./App.css";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  downloadFile,
  saveAnnotation,
  getAnnotation,
} from "../camunda_redux/redux/action";
import { PropTypes } from "prop-types";
import { setPassData } from "../camunda_redux/redux/ducks/passData";
import { setPdfInstance } from "../camunda_redux/redux/ducks/instanceStore";
import { setLoadData } from "../redux/actions/LoadingActions";
import { setSnackbar } from "../camunda_redux/redux/ducks/snackbar";
import {
  changingTableStateInbox,
  changingTableStateAnnexure,
  changingTableStateHrmConcern,
} from "../camunda_redux/redux/action/apiTriggers";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import { URLHide } from "../camunda_redux/redux/action";
import { useTranslation } from "react-i18next";
import Loading from "./Loading";
import Cookies from "js-cookie";

const PdfViewer = (props) => {

  const viewer = useRef(null);
  const documentLoadRef = useRef({
    docLoad: "",
    finishRender: "",
    pageUpdate: "",
  });

  const messageReceived = useSelector(
    (state) => state.passData.messageToPassUrl
  );

  const { extension } = useSelector((state) => state.passData);

  const {
    personalID,
    flag,
    flagNumber,
    pageNumber,
    anottId,
    isSample,
    currentSign,
    reLoadPdf,
  } = props;

  const [instance, setInstance] = useState(null);
  let [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const darkMode = props.theme;

  const handleWaterMark = (docViewer) => {
    docViewer.setWatermark({
      // Draw diagonal watermark in middle of the document
      // diagonal: {
      //   fontSize: 35, // or even smaller size
      //   fontFamily: "sans-serif",
      //   color: "#5a5ad6",
      //   opacity: 40, // from 0 to 100
      //   text: `${sessionStorage.getItem("pklDirectrate")}`,
      // },

      // Draw header watermark
      // header: {
      //   fontSize: 10,
      //   fontFamily: "sans-serif",
      //   color: "red",
      //   opacity: 70,
      // },

      // Custom WaterMark
      custom: (ctx, pageNumber, pageWidth, pageHeight) => {
        const watermarkText = `${localStorage.getItem("username")}`;
        const watermarkFontSize = 10;
        const watermarkSpacing = 5; // Spacing between watermarks
        const watermarkOpacity = 0.1; // Opacity of the watermarks

        // Set watermark properties
        ctx.fillStyle = `rgba(90, 90, 214, ${watermarkOpacity})`;
        ctx.font = `${watermarkFontSize}pt sans-serif`;

        // Calculate the width and height of the watermark text
        const watermarkWidth = ctx.measureText(watermarkText).width;
        const watermarkHeight = watermarkFontSize;

        // Calculate the number of watermarks that can fit horizontally and vertically
        const numWatermarksHorizontally = Math.floor(
          pageWidth / (watermarkWidth + watermarkSpacing)
        );
        const numWatermarksVertically = Math.floor(
          pageHeight / (watermarkHeight + watermarkSpacing)
        );

        // Calculate the actual spacing between watermarks based on the available space
        const spacingHorizontal =
          (pageWidth - numWatermarksHorizontally * watermarkWidth) /
          (numWatermarksHorizontally + 1);
        const spacingVertical =
          (pageHeight - numWatermarksVertically * watermarkHeight) /
          (numWatermarksVertically + 1);

        // Set the initial x and y coordinates for the first watermark
        let x = spacingHorizontal;
        let y = spacingVertical;

        // Draw the watermarks horizontally and vertically
        for (let i = 0; i < numWatermarksVertically; i++) {
          for (let j = 0; j < numWatermarksHorizontally; j++) {
            ctx.fillText(watermarkText, x + 20, y);
            x += watermarkWidth + spacingHorizontal + watermarkSpacing;
          }
          x = spacingHorizontal; // Reset x-coordinate for the next row
          y += watermarkHeight + spacingVertical + watermarkSpacing;
        }
      },
    });
  };

  const handleExitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }

    instance.setHeaderItems((header) => {
      header.pop();
    });
    instance.setHeaderItems((header) => {
      header.push({
        type: "actionButton",
        img: `${process.env.PUBLIC_URL}/webviewer/lib/ui/assets/fullscreen-svgrepo-com.svg`,
        title: "Full Screen",
        onClick: () => {
          handleFullScreen();
        },
      });
    });
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("resize", handleResize);
  };

  const handleFullScreen = () => {
    if (viewer.current.requestFullscreen) {
      viewer.current.requestFullscreen();
    } else if (viewer.current.mozRequestFullScreen) {
      /* Firefox */
      viewer.current.mozRequestFullScreen();
    } else if (viewer.current.webkitRequestFullscreen) {
      /* Chrome, Safari & Opera */
      viewer.current.webkitRequestFullscreen();
    } else if (viewer.current.msRequestFullscreen) {
      /* IE/Edge */
      viewer.current.msRequestFullscreen();
    }

    instance.setHeaderItems((header) => {
      header.pop();
    });
    instance.setHeaderItems((header) => {
      header.push({
        type: "actionButton",
        img: `${process.env.PUBLIC_URL}/webviewer/lib/ui/assets/fullscreen-exit-svgrepo-com.svg`,
        title: "Exit Full Screen",
        onClick: () => {
          handleExitFullScreen();
        },
      });
    });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
  };

  // full screen handler
  const handleResize = () => {
    if (
      document.webkitIsFullScreen ||
      document.mozFullscreen ||
      document.mozFullScreenElement
    ) {
      instance.setHeaderItems((header) => {
        header.pop();
      });
      instance.setHeaderItems((header) => {
        header.push({
          type: "actionButton",
          img: `${process.env.PUBLIC_URL}/webviewer/lib/ui/assets/fullscreen-exit-svgrepo-com.svg`,
          title: "Exit Full Screen",
          onClick: () => {
            handleExitFullScreen();
          },
        });
      });
    } else {
      instance.setHeaderItems((header) => {
        header.pop();
      });
      instance.setHeaderItems((header) => {
        header.push({
          type: "actionButton",
          img: `${process.env.PUBLIC_URL}/webviewer/lib/ui/assets/fullscreen-svgrepo-com.svg`,
          title: "Full Screen",
          onClick: () => {
            handleFullScreen();
          },
        });
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key == "F11") {
      if (fullScreen == false) {
        window.removeEventListener("resize", handleResize);
        instance.setHeaderItems((header) => {
          header.pop();
        });
        instance.setHeaderItems((header) => {
          header.push({
            type: "actionButton",
            img: `${process.env.PUBLIC_URL}/webviewer/lib/ui/assets/fullscreen-svgrepo-com.svg`,
            title: "Full Screen",
            onClick: () => {
              handleFullScreen();
            },
          });
        });
      }
      setTimeout(() => {
        window.addEventListener("resize", handleResize);
      }, 1000);
    }
  };

  // console.log(messageReceived, sfdt);

  useEffect(() => {
    if (instance !== null) {
      if (darkMode) {
        instance.setTheme("dark");
      } else instance.setTheme("default");
    }
  }, [instance, darkMode]);

  useEffect(() => {
    try {
      if (
        instance !== null &&
        messageReceived !== "" &&
        messageReceived !== null &&
        !isNullOrUndefined(messageReceived)
      ) {
        let flag1 = true;
        let fullScreen = false;
        instance.setHeaderItems((header) => {
          header.pop();
          header.pop();
        });
        if (isSample) {
          instance.loadDocument(messageReceived);
        } else {

          setLoading(true);

          props.URLHide(messageReceived).then(async (response) => {
            let data = await response.blob();
            setLoading(false);
            let fileName = extension ? `test.${extension}` : "test.docx";
            let file = new File([data], fileName);
            instance.loadDocument(file, {
              extension: extension ? extension : "docx",
            });
          });

          const { docViewer, annotManager } = instance;

          handleWaterMark(docViewer);

          instance.setHeaderItems((header) => {
            header.push({
              type: "actionButton",
              img: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
              title: "Save",
              onClick: async () => {
                annotManager.exportAnnotations().then((res) => {
                  const body = { annotationData: res };
                  const val = JSON.stringify(body);
                  props
                    .saveAnnotation(val, personalID, flag, flagNumber)
                    .then(function (response) {
                      if (response.status === "OK") {
                        // props.setReloadInboxData();
                        flag1 = true;
                        dispatch(
                          setSnackbar(
                            true,
                            "success",
                            "Annotation saved successfully"
                          )
                        );

                        let trigger = false;
                        setTimeout(() => {
                          trigger = true;
                          props.changingTableStateInbox(trigger, "CHANGE_INBOX");
                          if (flag === "Initiate") {
                            props.changingTableStateAnnexure(
                              trigger,
                              "CHANGE_PA_ANNEXURE"
                            );
                          }
                          if (flag === "PA" || "Annexture") {
                            props.changingTableStateHrmConcern(
                              trigger,
                              "CHANGE_HRM"
                            );
                          }
                        }, 2000);
                      } else {
                        dispatch(
                          setSnackbar(true, "error", "Annotation saved Failure !")
                        );
                      }
                    });
                });
              },
            });
            header.push({
              type: "actionButton",
              img: `${process.env.PUBLIC_URL}/webviewer/lib/ui/assets/fullscreen-svgrepo-com.svg`,
              title: "Full Screen",
              onClick: () => {
                handleFullScreen();
              },
            });
          });

          if (documentLoadRef.current.pageUpdate) {
            docViewer.off('pageNumberUpdated', documentLoadRef.current.pageUpdate);
          }

          documentLoadRef.current.pageUpdate = (pageNumber) => {
            props.isPage && props.handleChangePage(pageNumber);
          }

          docViewer.on("pageNumberUpdated", documentLoadRef.current.pageUpdate);


          if (documentLoadRef.current.finishRender) {
            docViewer.off('finishedRendering', documentLoadRef.current.finishRender);
          }

          documentLoadRef.current.finishRender = () => {
            const searchPattern = Cookies.get("searchEnc");
            const searchOptions = {
              caseSensitive: false,
              wholeWord: false,
              wildcard: true,
              regex: false,
              searchUp: false,
              ambientString: true,
            };

            // start search after document rendering is complete
            searchPattern &&
              instance.searchText(searchPattern, searchOptions);
            Cookies.remove("searchEnc");
          }

          docViewer.on("finishedRendering", documentLoadRef.current.finishRender);


          if (documentLoadRef.current.docLoad) {
            docViewer.off('documentLoaded', documentLoadRef.current.docLoad);
          }

          documentLoadRef.current.docLoad = () => {
            instance.setFitMode(instance.FitMode.FitWidth);
            let id = setInterval(() => {
              props.isPage && docViewer.setCurrentPage(parseInt(pageNumber), true);
              if (flag1) {
                flag1 = false;
                if (anottId !== null && anottId !== undefined && anottId !== "") {
                  loadxfdfStrings(anottId).then(function (rows) {
                    let xString = rows.xsdfString;
                    annotManager.importAnnotations(xString).then((response) => {
                      response.forEach((col) => {
                        annotManager
                          .importAnnotCommand(col)
                          .then(function (annotations) {
                            annotManager.drawAnnotationsFromList(annotations);
                          });
                      });
                    });
                  });
                }

              }
              if (!props.isPage || docViewer.getPageCount() >= parseInt(pageNumber)) clearInterval(id)
            }, 200)

          }

          docViewer.on("documentLoaded", documentLoadRef.current.docLoad);

        }

        dispatch(setPassData(""));

      }
    } catch (e) { }
    // props.setLoadData(true);
  }, [messageReceived, instance, reLoadPdf]);

  useEffect(() => {
    WebViewer(
      {
        path: `${process.env.PUBLIC_URL + "/webviewer/lib"}`,
        initialDoc: `${process.env.PUBLIC_URL + "/assets/sample.pdf"}`,
        fullAPI: true,
        enableRedaction: true,
        backendType: "ems",
        disableLogs: true,
        isAdminUser: true,
      },
      viewer.current
    )
      .then((instance) => {
        setInstance(instance);
        props.pdfLoads(true);
        instance.setLanguage("en");
        const author = sessionStorage.getItem("role");

        const { docViewer, annotManager } = instance;

        handleWaterMark(docViewer);
        annotManager.setCurrentUser(author); // now each annotation owner is based on role of logged in user

      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);

  // Make a GET request to get XFDF string
  var loadxfdfStrings = function (documentId) {
    return props.getAnnotation(documentId);
  };

  const renderPdf = () => {
    // const prevPdf = <div className="webviewer" style={{ height: "100vh" }} ref={ViewerDiv}></div>
    const newPdf = createElement("div", {
      id: "pdfv",
      className: "webviewer",
      style: { height: "100%" },
      ref: viewer,
    });
    return newPdf;
  };

  return (
    <div className="App">
      <>
        {renderPdf()}
        {loading && <Loading />}
      </>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    saveAnnotation: PropTypes.func.isRequired,
    getAnnotation: PropTypes.func.isRequired,
    props: state.props,
    theme: state.theme,
  };
}

export default connect(mapStateToProps, {
  setLoadData,
  downloadFile,
  saveAnnotation,
  getAnnotation,
  changingTableStateInbox,
  changingTableStateAnnexure,
  changingTableStateHrmConcern,
  URLHide,
})(memo(PdfViewer));
