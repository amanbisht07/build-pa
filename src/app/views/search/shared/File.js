import React, { useCallback, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {
  Grid,
  MenuItem,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  Chip,
  Paper,
  InputBase,
  Collapse,
  Tooltip,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { DateRangePickerComponent } from "@syncfusion/ej2-react-calendars";
import "../therme-source/material-ui/loading.css";
import {
  getAdvanceSearch,
  getContentData,
  getSendData,
  getFilenumberData,
  getSubjectData,
  getCreatedData,
} from "../../../camunda_redux/redux/action";

import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
  Inject,
  Page,
  Filter,
  Sort,
  Resize,
} from "@syncfusion/ej2-react-grids";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
//import { Autocomplete, Stack } from "@mui/material";
import { Breadcrumb } from "matx";
import { connect } from "react-redux";
import { Autocomplete } from "@material-ui/lab";
// import { Card } from '@mui/material';
import { func } from "prop-types";
import { debounce } from "utils";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    width: "fit-content",
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
  formControls: {
    minWidth: 1000,
  },
}));

function searchPage(props) {
  const [open, setOpen] = React.useState(false);

  {
    /*const [filtertopen, setFilteropen] = useState(false);*/
  }
  {
    /*const StartDate: Date = new Date(newdate().getFullYear(),new Date().getMonth(),10);
const EndDate: Date = new Date(newdate().getFullYear(),new Date().getMonth(),25) */
  }
  const [product, setProduct] = useState([]);
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState({
    search: "",
    to: "",
    from: "",
    names: "",
    files: "",
    types: "",
    filesubjects: "",
    oldfilerefs: "",

    // uploadedbye
  });
  const [apiObj, setapiObj] = useState({
    barType: "",
    barCreated: "",
    barSend: "",
    barDate: "",
    barDocumenttype: "",
  });
  const [chipState, setchipState] = useState([]);

  console.log(sideBar);

  const [sideBar, setSideBar] = useState(null);

  const [contentnameAutoSuggest, setcontentnameAutoSuggest] = useState({
    contentnamess: "",
    contentNameArr: [],
  });
  const [sendbyAutoSuggest, setSendbyAutoSuggest] = useState({
    sendbynamess: "",
    sendNameArr: [],
  });
  const [filenameAutoSuggest, setfilenameAutoSuggest] = useState({
    filenamess: "",
    fileNameArr: [],
  });
  const [subjectAutoSuggest, setSubjectAutoSuggest] = useState({
    subjectnamess: "",
    subjectNameArr: [],
  });
  const [createdbyAutoSuggest, setCreatedbyAutoSuggest] = useState({
    createdbynamess: "",
    createdNameArr: [],
  });
  const [showFullText, setShowFullText] = useState(false);

  const shortenedText =
    contentnameAutoSuggest.contentnamess.length > 15
      ? contentnameAutoSuggest.contentnamess.substring(0, 15) + "..."
      : contentnameAutoSuggest.contentnamess;

  const getProductData = () => {
    const { to, from, names, files, types, filesubjects, oldfilerefs } =
      searchTerm;
    const { contentnamess } = contentnameAutoSuggest;
    const { sendbynamess } = sendbyAutoSuggest;
    const { filenamess } = filenameAutoSuggest;
    const { subjectnamess } = subjectAutoSuggest;
    const { createdbynamess } = createdbyAutoSuggest;
    const rolename = sessionStorage.getItem("role");
    const size = sessionStorage.getItem("size");

    props
      .getAdvanceSearch(
        names,
        files,
        types,
        from,
        to,
        filesubjects,
        oldfilerefs,
        apiObj,
        contentnamess,
        sendbynamess,
        filenamess,
        subjectnamess,
        createdbynamess,
        rolename,
        size
      )
      .then(({ response }) => {
        setProduct(response.data);
        setSideBar(response.navData);
      })
      .catch((error) => console.log(error));
  };

  console.log("This is sidebar data", sideBar);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setSearchTerm({
      ...searchTerm,
      [name]: value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    getProductData();
    setOpen(false);
    // setShow(true);
  };

  // const onChange = (e) => {
  //   setSearchTerm({...searchTerm, from: e.start, to: e.end});
  //   getProductData();
  // };
  const onApply = (e) => {
    setSearchTerm({ ...searchTerm, from: e.start, to: e.end });
    getProductData();
  };
  useEffect(() => {
    getProductData();
  }, [apiObj]);

  const handledata = (type1, type2) => {
    console.log(type1, type2);
    if (type1 === "SendBy") {
      setapiObj({
        ...apiObj,
        barSend: type2,
      });
    } else if (type1 === "CreatedBy") {
      setapiObj({
        ...apiObj,
        barCreated: type2,
      });
    } else if (type1 === "CreatedOn") {
      setapiObj({
        ...apiObj,
        barDate: type2,
      });
    } else if (type1 === "Type") {
      setapiObj({
        ...apiObj,
        barType: type2,
      });
    } else if (type1 === "DocumentType") {
      setapiObj({
        ...apiObj,
        barDocumenttype: type2,
      });
    }
  };

  const handleChipAndPopulate = (Heading, subHeading) => {
    handleChipState(Heading, subHeading);
    handledata(Heading, subHeading);
  };

  const handleChipState = (Heading, subHeading) => {
    let isValid = true;
    chipState.forEach((chipData) => {
      if (chipData.key === Heading && chipData.value === subHeading) {
        isValid = false;
      }
    });
    if (!isValid) {
      setchipState([...chipState]);
    } else {
      setchipState([
        ...chipState,
        {
          key: Heading,
          value: subHeading,
        },
      ]);
    }
  };

  const handleChipDelete = (index, activeChip) => {
    console.log(activeChip);
    const newChipState = chipState.filter((chipData, i) => {
      if (i === index) return false;
      else return true;
    });
    if (apiObj.barSend === activeChip) {
      setapiObj({
        ...apiObj,
        barSend: "",
      });
    } else if (apiObj.barType === activeChip) {
      setapiObj({
        ...apiObj,
        barType: "",
      });
    } else if (apiObj.barCreated === activeChip) {
      setapiObj({
        ...apiObj,
        barCreated: "",
      });
    } else if (apiObj.barDate === activeChip) {
      setapiObj({
        ...apiObj,
        barDate: "",
      });
    } else if (apiObj.barDocumenttype === activeChip) {
      setapiObj({
        ...apiObj,
        barDocumenttype: "",
      });
    }
    setchipState(newChipState);
    getProductData();
  };

  console.log("The Chip State", chipState);

  const getContentdatas = (value) => {
    if (value && value.length > 0) {
      const rolename = sessionStorage.getItem("role");
      props
        .getContentData(value, rolename)
        .then(({ response }) => {
          if (value) {
            const contentNameArr = Object.keys(response.Text);
            console.log("content1", contentNameArr);
            setcontentnameAutoSuggest({
              contentnamess: value,
              contentNameArr: contentNameArr,
            });
          }
        })
        .catch((error) => console.log(error));
    }
  };

  // useEffect(() => {}, [third]);

  const handleContentAutosuggest = (e) => {
    getContentdatas(e.target.value);
  };

  // const optimisedVersion = useCallback(debounce(handleContentAutosuggest),[])

  const getSenddatas = (value) => {
    if (value.length > 0) {
      const rolename = sessionStorage.getItem("role");
      props
        .getSendData(value, rolename)
        .then(({ response }) => {
          if (value) {
            const sendNameArr = Object.keys(response.SendBy);
            console.log("content2", sendNameArr);
            setSendbyAutoSuggest({
              sendbynamess: value,
              sendNameArr: sendNameArr,
            });
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const handleSendAutosuggest = (e) => {
    const { name, value } = e.target;
    getSenddatas(value);
  };

  const getFilenumberdatas = (value) => {
    if (value.length > 0) {
      const rolename = sessionStorage.getItem("role");
      props
        .getFilenumberData(value, rolename)
        .then(({ response }) => {
          if (value) {
            const fileNameArr = Object.keys(response.PcFileNumber);
            console.log("content3", fileNameArr);
            setfilenameAutoSuggest({
              filenamess: value,
              fileNameArr: fileNameArr,
            });
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const handleFilenameAutosuggest = (e) => {
    const { name, value } = e.target;
    getFilenumberdatas(value);
  };

  const getSubjectdatas = (value) => {
    if (value?.length > 0) {
      const rolename = sessionStorage.getItem("role");
      props
        .getSubjectData(value, rolename)
        .then(({ response }) => {
          if (value) {
            const subjectNameArr = Object.keys(response.Subject);
            console.log("content4", subjectNameArr);
            setSubjectAutoSuggest({
              subjectnamess: value,
              subjectNameArr: subjectNameArr,
            });
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const handleSubjectAutosuggest = (e) => {
    const { name, value } = e.target;
    getSubjectdatas(value);
  };

  const getCreateddatas = (value) => {
    if (value.length > 0) {
      const rolename = sessionStorage.getItem("role");
      props
        .getCreatedData(value, rolename)
        .then(({ response }) => {
          if (value) {
            const createdNameArr = Object.keys(response.CreatedBy);
            console.log("content5", createdNameArr);
            setCreatedbyAutoSuggest({
              createdbynamess: value,
              createdNameArr: createdNameArr,
            });
          }
        })

        .catch((error) => console.log(error));
    }
  };

  const handleCreatedAutosuggest = (e) => {
    const { name, value } = e.target;
    getCreateddatas(value);
  };

  // for (const [key, value] of Object.entries(data)) {
  //   console.log(`${key}: ${value}`);
  // }

  const { search, to, from, names, files, types } = searchTerm;

  const optimizedFn = useCallback(debounce(getContentdatas), []);
  const sendFn = useCallback(debounce(getSenddatas), []);
  const createdFn = useCallback(debounce(getCreateddatas), []);
  const filenumberFn = useCallback(debounce(getFilenumberdatas), []);
  const filesubjectFn = useCallback(debounce(getSubjectdatas), []);

  return (
    <Grid container style={{ padding: "1rem" }}>
      <Grid item xs={12}>
        <Breadcrumb
          routeSegments={[{ name: "Search", path: "/eoffice/search" }]}
        />
      </Grid>
      <Grid item xs={12}>
        <div className="eoffice">
          <h1>E-office</h1>
          {/* <img
                      src={
                        process.env.PUBLIC_URL +
                        "/assets/images/logo-paperless.png"
                      }
                      alt={"EOffice"}
                      style={{
                        imageRendering: "-webkit-optimize-contrast",
                        maxWidth: "75%",
                      }}
                    /> */}
        </div>
      </Grid>

      <div>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Grid
            container
            spacing={2}
            style={{ maxWidth: "800px", margin: "0 2rem" }}
          >
            <Grid item xs={12}>
              <div className="searchbar">
                <Autocomplete
                  freeSolo
                  name="contentnamess"
                  id="disable-clearable"
                  disableClearable
                  options={contentnameAutoSuggest.contentNameArr || []}
                  renderOption={(option) => (
                    <Tooltip title={option}>
                      <div>{option.split(" ").slice(0, 15).join(" ")}...</div>
                    </Tooltip>
                  )}
                  value={
                    contentnameAutoSuggest.contentnamess
                      ? contentnameAutoSuggest.contentnamess
                      : ""
                  }
                  onInputChange={(e) => e && optimizedFn(e.target.value)}
                  onChange={(e, value) => {
                    setcontentnameAutoSuggest({
                      ...contentnameAutoSuggest,
                      contentnamess: value,
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      color="primary"
                      placeholder="Search Text..."
                      size="small"
                      fullWidth
                      className="contentfield"
                      style={{ minWidth: "30rem", marginRight: "10rem" }}
                      InputProps={{
                        ...params.InputProps,
                        disableUnderline: true,
                      }}
                    />
                  )}
                />

                {/* <SearchIcon onClick={handleSubmit}   /> */}

                <div
                  variant="contained"
                  className="advanceSearch"
                  onClick={() => setShow(!show)}
                  style={{ marginLeft: "0rem" }}
                >
                  <span style={{ color: "blue", display: "inline" }}>
                    {" "}
                    {show ? "Close" : "Advance"}{" "}
                  </span>
                </div>

                <Button
                  startIcon={<SearchIcon />}
                  style={{ right: "93%", background: "none" }}
                  onClick={handleSubmit}
                ></Button>
              </div>
              {/* <div
                variant="contained"
                className="advanceSearch"
                onClick={() => setShow(!show)}
                style={{ marginLeft: "1rem" }}
              >
                <span style={{ color: "black" }}>
                  {" "}
                  {show ? "Close" : "Advance Search"}{" "}
                </span>
              </div> */}
            </Grid>

            <Collapse in={show}>
              {/* {show && ( */}
              <>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <div className="input-box-color">
                      <Autocomplete
                        freeSolo
                        name="sendbynamess"
                        options={
                          sendbyAutoSuggest.sendNameArr
                            ? sendbyAutoSuggest.sendNameArr
                            : []
                        }
                        value={sendbyAutoSuggest.sendbynamess}
                        onInputChange={(e) => e && sendFn(e.target.value)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            fullWidth
                            size="small"
                            label="SEND BY:"
                          />
                        )}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div className="input-box-color">
                      <Autocomplete
                        freeSolo
                        name="createdbynamess"
                        options={
                          createdbyAutoSuggest.createdNameArr
                            ? createdbyAutoSuggest.createdNameArr
                            : []
                        }
                        value={createdbyAutoSuggest.createdbynamess}
                        onInputChange={(e) => e && createdFn(e.target.value)}
                        onChange={(e, value) => {
                          setCreatedbyAutoSuggest({
                            ...createdbyAutoSuggest,
                            createdbynamess: value,
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            native="true"
                            variant="outlined"
                            fullWidth
                            size="small"
                            label="CREATED BY:"
                          />
                        )}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div className="input-box-color">
                      <Autocomplete
                        freeSolo
                        name="filenamess"
                        options={
                          filenameAutoSuggest.fileNameArr
                            ? filenameAutoSuggest.fileNameArr
                            : []
                        }
                        value={filenameAutoSuggest.filenamess}
                        onInputChange={(e) => e && filenumberFn(e.target.value)}
                        onChange={(e, value) => {
                          setfilenameAutoSuggest({
                            ...filenameAutoSuggest,
                            filenamess: value,
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            fullWidth
                            size="small"
                            label="FILE NO:"
                          />
                        )}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div className="input-box-color">
                      <Autocomplete
                        freeSolo
                        name="subjectnamess"
                        options={
                          subjectAutoSuggest.subjectNameArr
                            ? subjectAutoSuggest.subjectNameArr
                            : []
                        }
                        value={subjectAutoSuggest.subjectnamess}
                        onInputChange={(e) =>
                          e && filesubjectFn(e.target.value)
                        }
                        onChange={(e, value) => {
                          setSubjectAutoSuggest({
                            ...subjectAutoSuggest,
                            subjectnamess: value,
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            fullWidth
                            size="small"
                            label="FILE SUBJECT:"
                          />
                        )}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div className="input-box-color">
                      <TextField
                        variant="outlined"
                        fullWidth
                        size="small"
                        label="STATUS:"
                        value={searchTerm.oldfilerefs}
                        onChange={handleInputChange}
                        name="oldfilerefs"
                        className="statusfield"
                      />
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div className="input-box-color">
                      {/* <TextField
                      variant="outlined"
                      type="date"
                      fullWidth
                      size="small"
                      value={searchTerm.from}
                      onChange={handleInputChange}
                      name="from"
                      className="statusfield"
                    /> */}
                      {/*
                      <DateRangePickerComponent
                        cssClass="e-outline"
                        floatLabelType="Auto"
                        placeholder="DATE"
                        format="dd-MM-yyyy"
                        startDate={searchTerm.from}
                        endDate={searchTerm.to}
                        // onchange={onChange}
                        onApply={onApply}
                      ></DateRangePickerComponent>
                    */}
                    </div>
                  </Grid>
                </Grid>
              </>
              {/* )} */}
            </Collapse>

            <Grid item xs={12}>
              <Button
                id="RTIfile_search_btn"
                type="submit"
                color="primary"
                variant="contained"
                startIcon={<SearchIcon />}
                style={{ display: "none" }}
              >
                Search
              </Button>
              {/* <Button
                onClick={() => setShow(!show)}
                color="primary"
                variant="contained"
                style={{ float: "right" }}
              >
                {show ? "Close" : "Advance Search"}
              </Button> */}
            </Grid>
          </Grid>
        </form>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div style={{ float: "left" }}>
            {chipState &&
              chipState.map((chipData, i) => {
                return (
                  <Chip
                    icon
                    label={`${chipData.key} : ${chipData.value}`}
                    key={i}
                    onDelete={() => {
                      handleChipDelete(i, chipData.value);
                    }}
                  />
                );
              })}
          </div>
        </Grid>
        {sideBar && (
          <Grid item xs={3}>
            {Object.keys(sideBar).map((childObj) => {
              return (
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>{childObj}</Typography>
                  </AccordionSummary>
                  {Object.keys(sideBar[childObj]).map((innerChild) => {
                    return (
                      <MenuItem
                        onClick={(e) => {
                          handleChipAndPopulate(childObj, innerChild);
                        }}
                      >{`${innerChild} ( ${sideBar[childObj][innerChild]} )`}</MenuItem>
                    );
                  })}
                </Accordion>
              );
            })}
          </Grid>
        )}

        <Grid item xs={!sideBar ? 12 : 9}>
          {product && (
            <Paper
              style={{
                borderRadius: "18px",
                border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
              }}
            >
              <GridComponent
                dataSource={product}
                height={Number(window.innerHeight - 300)}
                allowResizing={true}
                allowSorting={true}
                allowPaging={true}
                pageSettings={{ pageCount: 5, pageSizes: true }}
                allowFiltering={true}
                filterSettings={{ type: "Menu" }}
              >
                <ColumnsDirective>
                  <ColumnDirective
                    field="pcFileNumber"
                    headerText={"FILE NO"}
                    width="90"
                    textAlign="left"
                  />
                  <ColumnDirective
                    field="text"
                    width="200"
                    headerText={"CONTENT"}
                  />
                  <ColumnDirective
                    field="subject"
                    headerText={"SUBJECT"}
                    width="150"
                    textAlign="center"
                  />
                  <ColumnDirective
                    field="fromRole"
                    headerText={"FROM"}
                    width="130"
                    //format="yMd"
                    textAlign="center"
                  />
                  <ColumnDirective
                    field="createdOnTime"
                    headerText={"CREATED DATE"}
                    width="130"
                    format="yMd"
                    textAlign="Right"
                  />
                </ColumnsDirective>
                <Inject services={[Resize, Page, Sort, Filter]} />
              </GridComponent>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

function mapStateToProps(state) {
  return {
    props: state.props,
  };
}

export default connect(mapStateToProps, {
  getAdvanceSearch,
  getContentData,
  getSendData,
  getFilenumberData,
  getSubjectData,
  getCreatedData,
})(searchPage);
