import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.css";
import {
  DocumentEditorContainerComponent,
  Toolbar,
} from "@syncfusion/ej2-react-documenteditor";
import { connect, useDispatch } from "react-redux";
import {
  saveDocument,
  saveDoc,
  URLHide,
} from "../../../camunda_redux/redux/action";
import { setSnackbar } from "../../../camunda_redux/redux/ducks/snackbar";
import { PropTypes } from "prop-types";
import { withTranslation } from "react-i18next";
import Loading from "../../../pdfViewer/Loading";
import { debounce, handleError } from "utils";

DocumentEditorContainerComponent.Inject(Toolbar);

let saveButton = {
  prefixIcon: "e-save-icon",
  tooltipText: "Save",
  text: "Save",
  id: "save",
  type: "Button",
};
let printButton = {
  prefixIcon: "e-print-icon",
  tooltipText: "Print",
  text: "Print",
  id: "print",
  type: "Button",
};
let fullScreen = {
  prefixIcon: "e-full-screen-2-icon",
  tooltipText: "FullScreen",
  text: "Full Screen",
  id: "fullScreen",
  type: "Button",
};
let link = {
  prefixIcon: "e-link-icon",
  tooltipText: "Hyperlink",
  text: "Link",
  id: "link",
  type: "Button",
};
let hyperlink = {
  prefixIcon: "e-link-icon",
  tooltipText: "Link",
  text: "Link",
  id: "link",
  type: "Button",
};

const HeadersAndFootersView = (props) => {
  let container = useRef();
  const dispatch = useDispatch();

  const [editorLoading, setEditorLoading] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [newToolBar, setNewToolBar] = useState([
    saveButton,
    "Open",
    "Undo",
    "Redo",
    "Separator",
    fullScreen,
    "Image",
    "Table",
    "Comments",
    "TableOfContents",
    "Separator",
    "Header",
    "Footer",
    "PageSetup",
    "PageNumber",
    "Break",
    "Separator",
    "Find",
    "Separator",
    "LocalClipboard",
    printButton,
  ]);
  const [openHyerLinkDialog, setopenHyerLinkDialog] = useState(false);
  const [linkObj, setlinkObj] = useState({
    linkText: "",
    linkValue: "",
  });

  const [navigateLinkObj, setnavigateLinkObj] = useState();
  const [edit, setEdit] = useState(false);
  const [openLocal, setOpenLocal] = useState(false);

  const role = sessionStorage.getItem("role");
  const username = localStorage.getItem("username");

  let intervalId;

  // this useEffect to load initial document
  useEffect(() => {
    if (props.fileUrl1) {
      // id = setTimeout(() => {
      //   window.onbeforeunload = function () {
      //     return "Want to save your changes?";
      //   };
      //   onLoadDefault(props.fileUrl1);
      // });
      // window.onbeforeunload = function () {
      //   return "Want to save your changes?";
      // };
      console.log("load")
      onLoadDefault(props.fileUrl1);
    }
  }, [props.fileUrl1]);

  // useEffect to handle case when i resize editor by spliiter component it will automatically resize it-self
  useEffect(() => {
    if (container.current?.documentEditor && props.resize) {
      container.current?.documentEditor.resize();
      container.current?.documentEditor.fitPage("FitPageWidth");
      props.handleResize(false);
    }
  }, [props.resize, container]);

  // it means undo has been formed but document is not suppossed to open in docx so just again false the resave to unable the sign button
  useEffect(() => {
    if (!props.fileUrl1) {
      props.setreSave(false);
    }
  }, [props.reSave]);

  // this useEffect is to handle auto save
  // useEffect(() => {
  //   if (props.reSave) {
  //     optimizedAutoSave(props, false);
  //   }
  // }, [props.reSave]);

  const onCreate = () => {
    if (props.pane) container.current.showPropertiesPane = true;
    else container.current.showPropertiesPane = false;
    container.current.documentEditor.currentUser = sessionStorage.getItem("displayRole")
    container.current.documentEditor.pageOutline = "#E0E0E0";
    container.current.documentEditor.acceptTab = true;
    container.current.documentEditor.resize();
    container.current.documentEditor.fitPage("FitPageWidth");
    container.current.documentEditor.beforeFileOpen = (args) => {
      setEditorLoading(true);
      setOpenLocal(true);
    };
  };

  const loadFile = (file) => {
    let ajax = new XMLHttpRequest();
    ajax.open("POST", window.__ENV__.REACT_APP_SYNCFUSION_URL, true);
    ajax.onreadystatechange = () => {
      if (ajax.readyState === 4) {
        if (ajax.status === 200 || ajax.status === 304) {
          container.current &&
            container.current.documentEditor.open(ajax.responseText);
          if (props.reSave) {
            save(props, false);
            props.setreSave(false);
          }
          // else if (props.reSaveNof) {
          //   save(props, false);
          //   props.setreSaveNof(false);
          // } else if (props.reSaveEnco) {
          //   save(props, false);
          //   props.setreSaveEnco(false);
          // }
        }
      }
      setEditorLoading(false);
    };
    let formData = new FormData();
    formData.append("files", file);
    ajax.send(formData);
  };

  const onLoadDefault = async (url) => {
    // tslint:disable
    setEditorLoading(true);
    try {
      props
        .URLHide(url)
        .then(async (response) => {
          if (response.status != 200) {
            let errMsg = handleError(response.statusText);
            callMessageOut(errMsg);
          } else if (response.status == 200) {
            let data = await response.blob();
            let file = new File([data], "test.docx");
            loadFile(file);
          }
        })
        .catch((e) => {
          let errMsg = handleError(e.error);
          callMessageOut(errMsg);
        });
    } catch (error) {
      let errMsg = handleError(err.error);
      callMessageOut(errMsg);
    }

  };

  const callMessageOut = (message) => {
    setEditorLoading(false);
    dispatch(setSnackbar(true, "error", message));
  };

  function onDocumentChange() {
    let proxy = container.current;
    //To detect the device
    let isMobileDevice = /Android|Windows Phone|webOS/i.test(
      navigator.userAgent
    );
    if (!proxy) return;
    if (isMobileDevice) {
      // proxy.restrictEditing = true;
      // setTimeout(() => {
      //   proxy.documentEditor.fitPage("FitPageWidth");
      // }, 50);
    } else {
      // proxy.restrictEditing = false;
    }
    proxy.documentEditor.resize();
    proxy.documentEditor.fitPage("FitPageWidth");
    // container.current.documentEditor.contextMenu.onContextMenuInternal = (e)=>console.log(e)
    // container.current.documentEditor.selection.selectionChange = (e)=>console.log(e)
    // container.current.documentEditor.contextMenu.addCustomMenu(
    //   menuItems,
    //   true
    // );
    // container.current.documentEditor.customContextMenuSelect = (args) => {
    //   // custom Options Functionality
    //   console.log(args);
    //   let id = container.current.documentEditor.element.id;
    //   switch (args.id) {
    //     case id + "search_in_google":
    //       // To get the selected content as plain text
    //       let searchContent = container.current.documentEditor.selection.text;
    //       if (
    //         !container.current.documentEditor.selection.isEmpty &&
    //         /\S/.test(searchContent)
    //       ) {
    //         window.open("http://google.com/search?q=" + searchContent);
    //       }
    //       break;
    //   }
    // };
    if (openLocal) {
      props.setreSave(true);
      save(props, false);
    }
    console.log("Change doc");
  }

  let menuItems = [
    {
      text: "Search In Google",
      id: "search_in_google",
      iconCss: "e-icons e-de-ctnr-find",
    },
  ];

  function save(props, showSnackbar) {
    container.current.documentEditor.saveAsBlob("Docx").then((blob) => {
      var file = new File([blob], "SampleFile.docx");
      let formData = new FormData();
      formData.append("file", file);
      formData.append("isPartCase", props.blnIsPartCase);
      var reader = new FileReader();
      reader.onload = function () { };
      reader.readAsText(blob);
      const { fileUrl1, fileId, isAnnexure } = props;
      try {
        props
          .saveDocument(
            fileId,
            formData,
            role,
            username,
            props.blnIsPartCase,
            fileUrl1,
            isAnnexure
          )
          .then((resp) => {
            if (resp.error) {
              props.setSnackbar(true, "error", props.t("Document_saved_error"));
              props.setreSave(false);
              setOpenLocal(false);
              setEditorLoading(false);
            } else {
              props.setreSave(false);
              setOpenLocal(false);
              showSnackbar &&
                props.setSnackbar(
                  true,
                  "success",
                  props.t("Document_saved_successfully!")
                );
              setEditorLoading(false);
            }
          })
          .catch((e) => {
            props.setSnackbar(true, "error", e.message);
            props.setreSave(false);
            setOpenLocal(false);
            setEditorLoading(false);
          });
      } catch (e) {
        props.setSnackbar(true, "error", e.message);
        props.setreSave(false);
        setOpenLocal(false);
        setEditorLoading(false);
      }
    });
  }

  const handeLink = () => {
    setopenHyerLinkDialog(true);
  };

  const addHyperLink = () => {
    container.current.documentEditor.editor.insertHyperlink(
      linkObj.linkValue.replace(" ", "%20"),
      linkObj.linkText,
      true
    );
    setopenHyerLinkDialog(false);
  };

  // const saveBlob = () => {
  //   container.current.documentEditor.saveAsBlob("Docx").then((blob) => {
  //     console.log(blob);
  //     const sfdt = container.current.documentEditor.serialize();
  //     console.log(sfdt);
  //     localStorage.setItem("sfdt", sfdt);
  //   });
  // };

  // const OpenSfdt = () => {
  //   const sfdt = JSON.parse(localStorage.getItem("sfdt"));
  //   container.current.documentEditor.open(sfdt);
  // };

  const fullScreenFun = () => {
    let elem = document.getElementById(props.containerId);
    if (fullScreen) {
      setFullScreen(false);
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    } else {
      setFullScreen(true);
      if (elem?.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem?.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem?.webkitRequestFullscreen) {
        /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
      } else if (elem?.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("resize", handleResize);
    }
  };

  // full screen handler
  const handleResize = () => {
    if (
      document.webkitIsFullScreen ||
      document.mozFullscreen ||
      document.mozFullScreenElement
    ) {
      setFullScreen(true);
    } else {
      setFullScreen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key == "F11") {
      if (fullScreen == false) {
        window.removeEventListener("resize", handleResize);
        setFullScreen(true);
      }
      setTimeout(() => {
        window.addEventListener("resize", handleResize);
      }, 1000);
    }
  };

  const handleEdit = () => {
    setEdit(true);
  };

  // Optimized debounce function for auto save
  const optimizedAutoSave = useCallback(debounce(save, 1000), []);

  return (
    <>
      {/* {props.enclosureData && (
        <Dialog
          open={openHyerLinkDialog}
          aria-labelledby="draggable-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div style={{ width: "300px" }}>
            <DialogTitle
              style={{ cursor: "move" }}
              id="draggable-dialog-title"
              onClose={() => setopenHyerLinkDialog(false)}
            >
              <Typography>Insert Hyperlink</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <TextField
                label="Text to display"
                size="small"
                fullWidth
                variant="outlined"
                style={{ paddingBottom: "10px" }}
                value={linkObj.linkText}
                onChange={(e) =>
                  setlinkObj({
                    ...linkObj,
                    linkText: e.target.value,
                  })
                }
              />
              <TextField
                select
                label="Address"
                size="small"
                fullWidth
                variant="outlined"
                value={linkObj.linkValue}
                onChange={(e) =>
                  setlinkObj({
                    ...linkObj,
                    linkValue: e.target.value,
                  })
                }
              >
                {props.enclosureData.map((item, index) => (
                  <MenuItem
                    key={index}
                    value={`${item.fileName} ${item.flagNumber}`}
                  >
                    {item.fileName}
                  </MenuItem>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button
                id="inboxEditor_OK_button"
                color="secondary"
                variant="contained"
                style={{ marginBottom: "1rem" }}
                endIcon={<Done />}
                onClick={addHyperLink}
              >
                OK
              </Button>
              <Button
                id="inboxFileEditor_cancel_button"
                color="primary"
                variant="contained"
                style={{ marginRight: "1rem", marginBottom: "1rem" }}
                endIcon={<Close />}
                onClick={() => setopenHyerLinkDialog(false)}
              >
                CANCEL
              </Button>
            </DialogActions>
          </div>
        </Dialog>
      )} */}
      {/* <Dialog open={edit} onClose={() => setEdit(false)}>
        <QuillEditor />
      </Dialog> */}
      {/* <Button onClick={saveBlob}>Save As Blob</Button> */}
      {/* <Button onClick={OpenSfdt}>Open Saved Sfdt</Button> */}
      {/* <Button onClick={handleEdit}>Edit On Mobile</Button> */}
      <div
        className="control-pane"
        style={{ height: "100%", position: "relative" }}
      >
        {editorLoading && <Loading />}
        <DocumentEditorContainerComponent
          id={props.containerId}
          created={onCreate}
          enableComment={props.comment ? true : false}
          serviceUrl={window.__ENV__.REACT_APP_SYNCFUSION_SERVICE_URL}
          ref={container}
          documentChange={onDocumentChange}
          style={{ display: "block" }}
          height="100%"
          enableToolbar={true}
          showPropertiesPane={false}
          locale="en-US"
          toolbarItems={newToolBar}
          contentChange={(e) => {
            optimizedAutoSave(props, false);
            setTimeout(() => {
              if (!props.reSave) {
                props.setreSave(true);
              }
            }, 0);
          }}
          toolbarClick={(args) => {
            switch (args.item.id) {
              case "save":
                save(props, true);
                break;
              case "send":
                send(props);
                break;
              case "print":
                container.current?.documentEditor?.print()
                break;
              case "link":
                handeLink();
                break;
              case "fullScreen":
                fullScreenFun(props);
                break;
            }
          }}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  props: state.props,
  saveDocument: PropTypes.func.isRequired,
});

export default connect(mapStateToProps, {
  saveDocument,
  saveDoc,
  setSnackbar,
  URLHide,
})(withTranslation()(React.memo(HeadersAndFootersView)));
