import React, { useEffect, useState, createElement, useRef } from "react";
import WebViewer from "@pdftron/webviewer";
import "./App.css";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  URLHide,
  saveAnnotation,
  getAnnotation,
  currentSign,
} from "../../../../camunda_redux/redux/action";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { Dialog, DialogTitle, Typography } from "@material-ui/core";
import CustomLinkDialog from "../CustomLinkDialog";
import { useTranslation } from "react-i18next";
import Loading from "app/pdfViewer/Loading";
import Cookies from "js-cookie";
const SplitViewPdfViewer = (props) => {

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const viewer = useRef(null);
  const documentLoadRef = useRef({
    docLoad: "",
    finishRender: "",
    pageUpdate: "",
  });

  const { flag, extension, anottId, fileUrl, signed } = props;
  const [instance, setInstance] = useState(null);
  const darkMode = props.theme;
  const [openHyerLinkDialog, setopenHyerLinkDialog] = useState(false);
  const { currentSign } = useSelector((state) => state);
  const [loading, setLoading] = useState(false);

  const callMessageOut = (msg) => {
    dispatch(setSnackbar(true, "error", msg));
  };

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

  useEffect(() => {
    try {
      if (instance !== null) {
        const { docViewer, annotManager, Actions, Annotations } = instance;
        let flag1 = true;
        let newSign = currentSign;

        if (!fileUrl) {
          return;
        } else {
          instance.setHeaderItems((header) => {
            header.pop();
          });
          handleWaterMark(docViewer);
          setLoading(true);
          const URL =
            fileUrl === ""
              ? `${process.env.PUBLIC_URL + "/assets/sample.pdf"}`
              : fileUrl;
          props.URLHide(URL).then(async (response) => {
            let data = await response.blob();
            setLoading(false);
            let fileName = extension ? `test.${extension}` : "test.docx";
            let file = new File([data], fileName);

            instance.loadDocument(file, {
              extension: extension ? extension : "docx",
            });
            props?.pdfLoads(true);
          });

          // console.log(instance.docViewer.getPageCount());

          if (props.isCustomLink) {
            const onTriggered = Actions.URI.prototype.onTriggered;

            Actions.URI.prototype.onTriggered = function (target, event) {
              if (target instanceof Annotations.Link) {
                const link = JSON.parse(target.kk.U[0].Kq);


                let newObj = props.enclosureData.find(
                  (item) => Number(item.flagNumber) === Number(link.flagNumber)
                );

                props.handleChange1(newObj, link.pageNumber, link.id, true);
                return;
              }
              onTriggered.apply(this, arguments);
            };

            instance.textPopup.update([
              {
                type: "actionButton",
                img: "icon-tool-link",
                onClick: (arg) => {
                  setopenHyerLinkDialog(true);
                },
              },
            ]);
          }

          docViewer.on("pageNumberUpdated", (pageNumber) => {
            props.isPage && props.handleChangePage(pageNumber);
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

          docViewer.on("finishedRendering", function () {
            if (newSign) {
              docViewer.setCurrentPage(parseInt(docViewer.getPageCount()));
            }

            newSign = false;
            props.currentSign(false);

            const searchPattern = Cookies.get("searchNoting");
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
            Cookies.remove("searchNoting");
          });

          docViewer.on("documentLoaded", function () {
            document.getElementById("pdfviewer_tron").offsetWidth > 900
              ? docViewer.zoomTo(1.5)
              : instance.setFitMode(instance.FitMode.FitWidth);
            props.isPage &&
              docViewer.setCurrentPage(parseInt(pageNumber), true);
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
              anottId = "";
            }
          });
        }
      } else {
        WebViewer(
          {
            path: `${process.env.PUBLIC_URL + "/webviewer/lib"}`,
            initialDoc: `${process.env.PUBLIC_URL + "/assets/sample.pdf"}`,
            fullAPI: true,
            enableRedaction: true,
            backendType: "ems",
            disableLogs: true,
            isAdminUser: true
          },
          viewer.current
        )
          .then((instance) => {
            setInstance(instance);
            const { docViewer, annotManager } = instance;
            const author = sessionStorage.getItem("role");
            handleWaterMark(docViewer);
            annotManager.setCurrentUser(author); // now each annotation owner is based on role of logged in user
          })
          .catch((e) => { });
      }
    } catch (e) {
      callMessageOut(e.message);
    }
  }, [instance, fileUrl, signed]);

  useEffect(() => {
    if (instance !== null) {
      if (darkMode) {
        instance.setTheme("dark");
      } else instance.setTheme("default");
    }
  }, [instance, darkMode]);

  const renderPdf = () => {
    // const prevPdf = <div className="webviewer" style={{ height: "100vh" }} ref={ViewerDiv}></div>
    const newPdf = createElement("div", {
      id: "pdfv" + Math.random(),
      className: "webviewer",
      style: { height: "100%" },
      ref: viewer,
    });
    return newPdf;
  };

  const addHyperLink = (url) => {
    const { Actions, annotManager, docViewer } = instance;

    const selectedTextQuads = docViewer.getSelectedTextQuads();
    const currentPageLinks = [];
    const action = new Actions.URI({ uri: url });

    for (const pageNumber in selectedTextQuads) {
      selectedTextQuads[pageNumber].forEach((quad) => {
        const link = newLink(
          Math.min(quad.x1, quad.x3),
          Math.min(quad.y1, quad.y3),
          Math.abs(quad.x1 - quad.x3),
          Math.abs(quad.y1 - quad.y3),
          parseInt(pageNumber) + 1
        );
        link.addAction("U", action);
        currentPageLinks.push(link);
      });
    }
    annotManager.addAnnotations(currentPageLinks);
    let pageNumbersToDraw = currentPageLinks.map((link) => link.PageNumber);
    pageNumbersToDraw = [...new Set(pageNumbersToDraw)];
    pageNumbersToDraw.forEach((pageNumberToDraw) => {
      annotManager.drawAnnotations(pageNumberToDraw, null, true);
    });
    handleSave();
  };

  const newLink = (x, y, width, height, linkPageNumber) => {
    const { Annotations } = instance;
    const link = new Annotations.Link();
    link.PageNumber = linkPageNumber;
    link.StrokeColor = new Annotations.Color(0, 165, 228);
    link.StrokeStyle = "underline";
    link.StrokeThickness = 2;
    link.Author = "Test user";
    link.Subject = "Link";
    link.X = x;
    link.Y = y;
    link.Width = width;
    link.Height = height;
    return link;
  };

  const handleSave = async () => {
    const { annotManager } = instance;

    annotManager
      .exportAnnotations({ link: true })
      .then((resp) => {
        const body = { annotationData: resp };
        const val = JSON.stringify(body);
        props
          .saveAnnotation(val, props.fileId, props.flag, props.flagNumber)
          .then((resp) => {
            handleClose();
          })
          .catch((e) => {
            console.log(e.message);
          });
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  useEffect(() => {
    if (props.getSfdt) {
      const { annotManager } = instance;

      annotManager
        .exportAnnotations({ link: true })
        .then((resp) => {
          // const body = { annotationData: resp };
          // const val = JSON.stringify(body);
          props.handleSfdt(resp);
        })
        .catch((e) => { });
    }
  }, [props.getSfdt]);

  const handleClose = () => {
    setopenHyerLinkDialog(false);
  };

  var loadxfdfStrings = function (documentId) {
    return props.getAnnotation(documentId);
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log(instance?.docViewer.getPageCount());
  //   }, 1000);
  // }, [fileUrl]);

  return (
    <>
      {props.isCustomLink && (
        <Dialog
          open={openHyerLinkDialog}
          aria-labelledby="draggable-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div style={{ minWidth: "600px" }}>
            <DialogTitle
              style={{ cursor: "move" }}
              id="draggable-dialog-title"
              onClose={handleClose}
            >
              <Typography>{t("insert_hyperlink")}</Typography>
            </DialogTitle>
            <CustomLinkDialog
              enclosureData={props.enclosureData}
              addHyperLink={addHyperLink}
              handleClose={handleClose}
            />
          </div>
        </Dialog>
      )}
      <div className="App" id="pdfviewer_tron">
        <>
          {renderPdf()}
          {loading && <Loading />}
        </>
      </div>
      ;
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    theme: state.theme,
  };
}

export default connect(mapStateToProps, {
  URLHide,
  saveAnnotation,
  getAnnotation,
  currentSign,
})(React.memo(SplitViewPdfViewer));
