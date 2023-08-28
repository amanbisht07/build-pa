import { render } from "react-dom";
import "./index.css";
import * as React from "react";
import { SampleBase } from "./sample-base";

import {
  DocumentEditorContainerComponent,
  Toolbar,
  Print,
} from "@syncfusion/ej2-react-documenteditor";
import { TitleBar } from "./title-bar";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import {
  saveDocument,
  uploadNoting,
} from "../../../camunda_redux/redux/action";
import { setSnackbar } from "../../../camunda_redux/redux/ducks/snackbar";
import { Loading } from "../../Personnel/therme-source/material-ui/loading";
import { withTranslation } from "react-i18next";
import { URLHide } from "../../../camunda_redux/redux/action";
import {
  Button,
  Dialog,
  DialogActions,
  Grid,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  MenuItem,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Autocomplete } from "@material-ui/lab";
import DoneIcon from "@material-ui/icons/Done";
DocumentEditorContainerComponent.Inject(Toolbar, Print);
// tslint:disable:max-line-length

class HeadersAndFootersView extends SampleBase {
  constructor(props) {
    super(...arguments);
    this.state = {
      newToolBar: [],
      documenteditor: null,
      blnOpenQuickSin: false,
      hostUrl: "",
      willAutoSave: true,
      editorLoading: true,
      // contentChanged : false
      openHyerLinkDialog: false,
      linkText: "",
      linkValue: "",
    };
    this.container = React.createRef();
    // this.newObj="";
  }

  onLoadDefault = async () => {
    let response = await fetch(this.props.fileUrl1);
    console.log(this.props.fileUrl1);
    this.props.URLHide(this.props.fileUrl1).then(async (response) => {
      let data = await response.blob();

      let file = new File([data], "test.docx");
      this.loadFile(file);
    });

    let saveButton = {
      prefixIcon: "e-save-icon",
      tooltipText: "Save",
      text: "Save",
      id: "save",
      type: "Button",
    };
    let sendButton = {
      prefixIcon: "e-send-icon",
      tooltipText: "Send",
      text: "Send",
      id: "send",
      type: "Button",
    };
    let downloadButton = {
      prefixIcon: "e-download-icon",
      tooltipText: "Download",
      text: "Download",
      id: "download",
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
      tooltipText: "Link",
      text: "Link",
      id: "link",
      type: "Button",
    };

    this.props.blnShowQuickSign
      ? this.setState({
          newToolBar: [
            saveButton,
            "Open",
            "Undo",
            "Redo",
            "Separator",
            fullScreen,
            this.props.enclosureData ? link : "Hyperlink",
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
            "RestrictEditing",
            printButton,
          ],
        })
      : this.setState({
          newToolBar: [
            saveButton,
            "Open",
            "Undo",
            "Redo",
            "Separator",
            fullScreen,
            this.props.enclosureData ? link : "Hyperlink",
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
            "RestrictEditing",
            printButton,
          ],
        });
  };
  loadFile(file) {
    let ajax = new XMLHttpRequest();
    ajax.open("POST", process.env.REACT_APP_SYNCFUSION_URL, true);
    ajax.onreadystatechange = () => {
      if (ajax.readyState === 4) {
        if (ajax.status === 200 || ajax.status === 304) {
          this.container.current.documentEditor.open(ajax.responseText);
          this.save(this.props, false);
          this.setState({ editorLoading: false });
        }
      }
    };
    let formData = new FormData();
    formData.append("files", file);
    ajax.send(formData);
    this.setState({ editorLoading: false });
  }

  rendereComplete() {
    window.onbeforeunload = function () {
      return "Want to save your changes?";
    };
    let data = sessionStorage.getItem("username");
    this.container.current.serviceUrl =
      process.env.REACT_APP_SYNCFUSION_SERVICE_URL;
    this.container.current.documentEditor.pageOutline = "#E0E0E0";
    this.container.current.documentEditor.acceptTab = true;
    this.container.current.documentEditor.resize();
    this.container.current.documentEditor.currentUser = data;
    this.titleBar = new TitleBar(
      document.getElementById("documenteditor_titlebar"),
      container,
      true
    );
    this.onLoadDefault();
    if (this.contentChanged) {
      //You can save the document as below
      this.container.current.documentEditor.saveAsBlob("Docx").then((blob) => {
        let exportedDocument = blob;
        var file = new File([blob], "SampleFile.docx");
        let formData = new FormData();
        formData.append("file", file);
        var reader = new FileReader();
        reader.readAsText(blob);
        const { fileUrl1, fileId, isAnnexure } = this.props;
        this.props
          .saveDocument(
            fileId,
            formData,
            this.role,
            this.username,
            this.props.blnIsPartCase,
            fileUrl1,
            isAnnexure
          )
          .then((resp) => {
            // console.log(resp);
            clearInterval(this.timeout);
          });
      });
      this.contentChanged = false;
    }
    //}
    this.container.current.contentChange = () => {
      //this.setState({contentChange:true})
      this.contentChanged = true;
    };
  }
  update(value) {
    // console.log(value);
  }

  send(props) {
    const { sendToogle } = props;
    sendToogle(true);
  }
  role = sessionStorage.getItem("role");
  username = sessionStorage.getItem("username");

  save(props, showSnackbar) {
    this.container.current.documentEditor.saveAsBlob("Docx").then((blob) => {
      var file = new File([blob], "SampleFile.docx");
      let formData = new FormData();
      formData.append("file", file);
      formData.append("isPartCase", props.blnIsPartCase);
      var reader = new FileReader();
      reader.onload = function () {
        // console.log(reader.result);
      };
      reader.readAsText(blob);
      const { fileUrl1, fileId, isAnnexure } = this.props;
      //console.log("username : ", this.username);
      this.props
        .saveDocument(
          fileId,
          formData,
          this.role,
          this.username,
          props.blnIsPartCase,
          fileUrl1,
          isAnnexure
        )
        .then((resp) => {
          showSnackbar &&
            this.props.setSnackbar(
              true,
              "success",
              this.props.t("Document_saved_successfully!")
            );
        });
    });
  }

  print = (value) => {
    this.titleBar.onPrint();
  };
  handeLink = () => {
    this.setState({ openHyerLinkDialog: true });
  };

  btnClick() {
    // console.log(this.state.linkText);
    // console.log(this.state.linkValue);
    // DocumentEditor.insertHyperlink(this.state.linkValue, this.state.linkText, '<<Screen tip text>>');
    this.container.current.documentEditor.editor.insertHyperlink(
      this.state.linkValue.replace(" ", "%20"),
      this.state.linkText,
      true
    );
    this.setState({ openHyerLinkDialog: false });
  }

  fullScreen = () => {
    let elem = document.getElementById("container");
    if (this.state.fullScreen) {
      this.setState({ fullScreen: false });
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else {
      this.setState({ fullScreen: true });
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
    }
  };

  async createFile() {
    const { fileUrl1 } = this.props;

    let response = await fetch(fileUrl1);

    let data = await response.blob();
    let file = new File([data], "test.docx");
    console.log(file[0]);
    this.loadFile(file[0]);
  }
  componentWillMount() {
    setTimeout(() => {
      this.container.current.documentEditor.requestNavigate = (args) => {
        console.log(args.navigationLink);
        console.log(args.navigationLink.split("%20")[1]);
        let newObj = this.props.enclosureData.find(
          (item) =>
            item.flagNumber === parseInt(args.navigationLink.split("%20")[1])
        );
        this.props.handleChange1(newObj);
      };
    }, 2000);
  }
  componentWillUnmount() {
    this.container.current.destroy();
  }

  render() {
    console.log(this.container.current);
    const { editorLoading, blnOpenQuickSin, link, textToDisplay } = this.state;
    const { enclosureData } = this.props;

    console.log(enclosureData);
    return (
      <div key={this.props.fileUrl1}>
        {enclosureData && (
          <Dialog
            // PaperComponent={PaperComponent}

            open={this.state.openHyerLinkDialog}
            aria-labelledby="draggable-dialog-title"
            aria-describedby="alert-dialog-description"
            //   maxWidth="md"
            //   fullWidth
          >
            <div style={{ width: "300px" }}>
              <DialogTitle
                style={{ cursor: "move" }}
                id="draggable-dialog-title"
                onClose={() => this.setState({ openHyerLinkDialog: false })}
                // style={{
                //   display: "flex",
                //   justifyContent: "space-between",
                //   alignItems: "center",
                // }}
              >
                <Typography>INSERT HYPERLINK</Typography>
                {/* <IconButton
                  aria-label="close"
                  onClick={() => this.setState({ openHyerLinkDialog: false })}
                  color="primary"
                  style={{ float: "right", position: "relative", top: "-6px" }}
                >
                  <CloseIcon />
                </IconButton> */}
              </DialogTitle>
              <DialogContent dividers>
                <TextField
                  label="Text to display"
                  size="small"
                  fullWidth
                  variant="outlined"
                  style={{ paddingBottom: "10px" }}
                  // value={this.state.linkText}
                  onChange={(e) => this.setState({ linkText: e.target.value })}
                />
                <TextField
                  select
                  label="Address"
                  size="small"
                  fullWidth
                  variant="outlined"
                  // value={this.state.linkValue}
                  onChange={(e) =>
                    this.setState({
                      linkValue: e.target.value,
                    })
                  }
                >
                  {this.props.enclosureData.map((item, index) => (
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
                  color="primary"
                  variant="contained"
                  style={{ marginBottom: "1rem" }}
                  endIcon={<DoneIcon />}
                  onClick={this.btnClick.bind(this)}
                >
                  OK
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ marginRight: "1rem", marginBottom: "1rem" }}
                  endIcon={<CloseIcon />}
                  onClick={() => this.setState({ openHyerLinkDialog: false })}
                >
                  CANCEL
                </Button>
              </DialogActions>
            </div>
          </Dialog>
        )}
        <div className="control-pane">
          <div className="control-section">
            <div id="documenteditor_container_body">
              {editorLoading && <Loading />}
              <DocumentEditorContainerComponent
                id="container"
                ref={this.container}
                style={{ display: "block" }}
                height="100%"
                enableToolbar={true}
                showPropertiesPane={false}
                toolbarItems={this.state.newToolBar}
                toolbarClick={(args) => {
                  switch (args.item.id) {
                    case "save":
                      this.save(this.props, true);
                      break;
                    case "send":
                      this.send(this.props);
                      break;
                    case "print":
                      this.print;
                      break;
                    case "link":
                      this.handeLink();
                      break;
                    case "fullScreen":
                      this.fullScreen(this.props);
                      break;
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  props: state.props,
  saveDocument: PropTypes.func.isRequired,
  theme: state.theme,
});
export default connect(mapStateToProps, { saveDocument, setSnackbar, URLHide })(
  withTranslation()(HeadersAndFootersView)
);
