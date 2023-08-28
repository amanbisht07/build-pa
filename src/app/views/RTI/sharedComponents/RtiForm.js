import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  TextField,
  Typography,
  Grid,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  MenuItem,
  Radio,
  Container,
  DialogContent,
  Divider,
  DialogActions,
  Input,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Autocomplete } from "@material-ui/lab";
import { addRTI } from "app/camunda_redux/redux/action/index";
import { connect, useDispatch, useSelector } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { changingTableStateRti } from "app/camunda_redux/redux/action/apiTriggers";
import moment from "moment";
import { CHANGE_PA_FILE } from "app/camunda_redux/redux/constants/ActionTypes";
import { useTranslation } from "react-i18next";
import { Loading } from "./therme-source/material-ui/loading";
import {
  uploadRti,
  FindByAppeal,
  loadRtiList,
  getAutoDetails,
  fetchAddress,
} from "app/camunda_redux/redux/action/index";
import history from "../../../../history";
import Cookies from "js-cookie";
// import { useDropzone } from 'react-dropzone';
import sateData from "./data";
import AttachmentIcon from "@material-ui/icons/Attachment";
import FileUpload from "app/views/inbox/shared/FileUpload";
import {
  FilePreviewContainerRti,
  FileUploadContainerRti,
  FormFieldRti,
  UploadFileBtnRti,
} from "./fileUpload/file-upload.rtiform.styles";

const useStyles = makeStyles((theme) => ({
  textField: {
    // marginTop: theme.spacing(2),
    marginTop: "0.7rem",
  },
  label: {
    marginTop: "0.7rem",
  },
  btnGrid: {
    textAlign: "right",
    marginTop: "0.7rem",
  },
  radio: {
    marginTop: "0.7rem",
  },
}));

// const FILE_SIZE = 160 * 1024;
const SUPPORTED_FORMATS = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

const VALIDATION_SCHEMA = Yup.object().shape({
  rtiBy: Yup.string().required("please enter RTI Requester"),
  subject: Yup.string()
    .required("please enter subject")
    .trim()
    .max(250, "subject_should_not_be_greater_than_250_characters"),
  priority: Yup.string().required("please select the priority"),

  upload: Yup.mixed().required("A file is required")
    .test('fileFormat', 'DOC,DOCX,PDF only', (value) => {
      return value && ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",].includes(value.type);
    }),

  typeOfService: Yup.array()
    .min(1, "Atleast one service should be selected")
    .required("Required !"),

});

const VALIDATION_POST_SCHEMA = Yup.object().shape({
  address: Yup.string().required("please enter address"),
  State1: Yup.string().required("please enter state"),
  district: Yup.string().required("please enter district"),
  pincode: Yup.string().required("please enter pincode"),
  rtiBy: Yup.string().required("please enter RTI Requester"),
  subject: Yup.string()
    .required("please enter subject")
    .trim()
    .max(250, "subject_should_not_be_greater_than_250_characters"),

  priority: Yup.string().required("please select the priority"),

  upload: Yup.mixed().required("A file is required")
    .test('fileFormat', 'DOC,DOCX,PDF only', (value) => {
      return value && ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",].includes(value.type);
    }),
  typeOfService: Yup.array()
    .min(1, "Atleast one service should be selected")
    .required("Required !"),
});

const VALIDATION_EMAIL_SCHEMA = Yup.object().shape({
  email: Yup.string().email().required(" please enter Email "),
  rtiBy: Yup.string().required("please enter RTI Requester"),
  subject: Yup.string()
    .required("please enter subject")
    .trim()
    .max(250, "subject_should_not_be_greater_than_250_characters"),
  priority: Yup.string().required("please select the priority"),
  upload: Yup.mixed().required("A file is required")
    .test('fileFormat', 'DOC,DOCX,PDF only', (value) => {
      return value && ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",].includes(value.type);
    }),
  typeOfService: Yup.array()
    .min(1, "Atleast one service should be selected")
    .required("Required !"),
});

const appealOptions = [
  {
    value: "RTI",
    label: "RTI",
  },
  {
    value: "Appeal",
    label: "Appeal",
  },
];
const RtiForm = (props) => {
  // const borderColor = props.theme ? "#fff" : "#000000";
  // const divStyle = { '--border-color': borderColor };

  const deptName = sessionStorage.getItem("department");
  const { handleClose, updateSubject, draftSubject } = props;
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const configData = {
    fullWidth: true,
    variant: "outlined",
    size: "small",
    className: classes.textField,
  };
  const { changeFile } = useSelector((state) => state);
  const [blnDisable, setBlnDisable] = useState(false);
  const [totalFileSelected, setTotalFileSelected] = useState(0);
  const [singleProgress, setSingleProgress] = useState(0);
  const [blnProgressBar, setblnProgressBar] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const { rtiID, loadRtiData, loadRegister, handleClick1, handledata } = props;
  const role = sessionStorage.getItem("role");
  const [toggle, setToggle] = useState("Medium");
  const [appealno, setAppealno] = useState([]);
  const [alignment, setAlignment] = React.useState("Medium");
  const [files, setFiles] = useState([]);
  const [selectmode, setSelectMode] = useState("");
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [load, setLoad] = useState(false);

  // const Ref = useRef();

  // const realFileBtn = document.getElementById("real-file");
  // const customBtn = document.getElementById("custom-button");
  // const customTxt = document.getElementById("custom-text");

  // customBtn.addEventListener("click", function () {
  //   realFileBtn.click();
  // });

  // realFileBtn.addEventListener("change", function () {
  //   if (realFileBtn.value) {
  //     customTxt.innerHTML = realFileBtn.value.match(
  //       /[\/\\]([\w\d\s\.\-\(\)]+)$/
  //     )[1];
  //   } else {
  //     customTxt.innerHTML = "No file chosen, yet.";
  //   }
  // });

  // const handleStateChange = (event) => {
  //   const stateName = event.target.value;
  //   console.log(stateName)
  //   setSelectedState(stateName);
  //   handlefetchAddress(stateName);
  // };

  // const handleDistrictChange = (event) => {
  //   const districtName = event.target.value;
  //   console.log(districtName)
  //   setSelectedDistrict(districtName);
  //   // fetch pincodes for the selected district from API and set in state
  // };

  // const handlePincodeChange = (event) => {
  //   const pincode = event.target.value;
  //   setSelectedPincode(pincode);
  // };

  const { dateRti } = props;

  var today = new Date();
  var Time = today.getHours() + ":" + today.getMinutes();
  const ampm = today.getHours() <= 12 ? "AM" : "PM";

  const INITIAL_STATE = {
    rtiBy: "",
    subject: "",
    priority: "Medium",
    email: "",
    Portal: "",
    address: "",
    language: "English",
    State1: "",
    receivingMode: "Portal",
    typeOfService: [],
    typeOfMode: "RTI",
    appeal: "",
    appealOptions: "",
    upload: null,
    pincode: "",
    district: "",
  };

  const handleChange1 = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleToggle = (e) => {
    let fd = new FormData();
    fd.append("priority", e.target.value);
    formik.setFieldValue("priority", fd);
    setToggle(fd);
  };
  const data = new Date();

  const handlefetchAddress = (stateName, districtName) => {
    props.fetchAddress(stateName, districtName).then((resp) => {
      // console.log(tmpArray);
      let tmpArr = {
        state: states,
        district: districts,
        pincodes: pincodes
      };
      try {
        // condition to check if response then perform further
        if (resp !== undefined) {
          if (resp.states) {
            tmpArr.state = resp.states.filter((item) => item !== null)
          }
          else if (resp.pincodes) {
            tmpArr.pincodes = resp.pincodes.filter((item) => item !== null)
          }
          else if (resp.districts) {
            tmpArr.district = resp.districts.filter((item) => item !== null)
          }

          tmpArr.state ? setStates(tmpArr.state) : states ? "" : ""
          tmpArr.district ? setDistricts(tmpArr.district) : districts ? "" : ""
          tmpArr.pincodes ? setPincodes(tmpArr.pincodes) : pincodes ? "" : ""

        } else {
          const errorMessage =
            resp.status + " : " + resp.error + " AT " + resp.path;
          callMessageOut(errorMessage);
        }
      } catch (e) {
        callMessageOut(e.message);
      }
    });
  };

  // console.log(states, districts, pincodes)

  const handleClick = (value) => {
    setLoad(true);
    const formData = value;
    props.addRTI(formData, role, deptName).then((resp) => {
      
      // props
      //   .uploadRti(resp.file.partcaseId, uploadFile, "", deptName)
      //   .then(() => {
      //     if (resp.file.type === "RTI") {
      //       Cookies.set("isRti", true);
      //       Cookies.set("inboxFile", resp.file.subject);
      //       Cookies.set("priority", resp.file.priority);
      //       Cookies.set("referenceNumber", resp.file.referenceNumber);
      //       Cookies.set("partcaseId", resp.file.partcaseId);
      //       Cookies.set("creater", resp.file.createdBy);
      //       Cookies.remove("isRegister");
      //       Cookies.remove("status");
      //       history.push("/eoffice/splitView/file");
      //     }
      //   });
      // props.loadRegister()
      try {
        
        // if (resp !== undefined) {
        //   props.handleClose();

        //   // props.changingTableStateRti(true, "CHANGE_RTI"); // setting trigger to false as table got updated
        //   // dispatch(setSnackbar(true, "success", "RTI Inserted Successfully!"));
        //   setTimeout(() => {
        //     dispatch(setSnackbar(true, "success", "RTI Created Successfully!"));
        //   }, 500);
        //   dispatch({ type: CHANGE_PA_FILE, payload: !changeFile });
        // } else {
        //   const errorMessage =
        //     resp.status + " : " + resp.error + " AT " + resp.path;
        //   callMessageOut(errorMessage);
        // }

        // props.loadRegister()

        if (resp.Error) {
          setLoad(false);
          console.log(resp.Error);
          dispatch(setSnackbar(true, "error", resp.Error));
          return;
        } else {
          setLoad(true);
          props
            .uploadRti(resp.file.partcaseId, uploadFile, "", deptName)
            .then(() => {
              setLoad(false);
              if (resp.file.type === "RTI") {
                Cookies.set("isRti", true);
                Cookies.set("inboxFile", resp.file.subject);
                Cookies.set("priority", resp.file.priority);
                Cookies.set("referenceNumber", resp.file.referenceNumber);
                Cookies.set("partcaseId", resp.file.partcaseId);
                Cookies.set("creater", resp.file.createdBy);
                Cookies.remove("isRegister");
                Cookies.remove("status");
                history.push("/eoffice/splitView/file");
              }
            });
          props.handleClose();
          console.log("res", resp);
          dispatch(setSnackbar(true, "success", `${t("Rti_Created_Successfully")}`));

        }

      } catch (e) {
        callMessageOut(e.message);
      }
    });
  };

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const formik = useFormik({
    initialValues: INITIAL_STATE,
    // validationSchema: VALIDATION_SCHEMA,
    validationSchema:
      selectmode === "Post"
        ? VALIDATION_POST_SCHEMA
        : selectmode === "Email"
          ? VALIDATION_EMAIL_SCHEMA
          : VALIDATION_SCHEMA,

    onSubmit: (values) => {
      let formData = {
        ...values,
        createdOnDate: createdOnDate + " " + Time,
        responseDate,
        // createdOnDate: values.createdOnDate,
        // .format("DD-MM-YYYY")
        // .toLocaleString(undefined, { timeZone: "Asia/India" }),
      };
      
      handleClick(formData);

      // }
    },
  });
  const rtiselect = props.dateRti;
  const [createdOnDate, setDates] = useState(
    moment(rtiselect).format("YYYY-MM-DD")
  );

  const [responseDate, setresponseDate] = useState("");

  useEffect(() => {
    handleAppeal();
    handlefetchAddress();
  }, []);

  useEffect(() => {
    getDatesAlgo();
  }, [createdOnDate]);

  const getDatesAlgo = () => {
    setresponseDate(() => {
      let currDate = new Date(createdOnDate);
      return get30DayGap(currDate);
    });
  };

  const get30DayGap = (date) => {
    let d = date.setDate(date.getDate() + 30);
    const gappedDate = moment(new Date(d)).format("YYYY-MM-DD");
    return convert(gappedDate);
  };

  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  const dateChange = (e) => {
    setDates(e.target.value);
  };

  const dateChangeResp = (e) => {
    setresponseDate(e.target.value);
  };

  const handleReset = () => {
    const { setFieldValue } = formik;
    setFieldValue("rtiBy", "");
    setFieldValue("subject", "");
    setFieldValue("createdOnDate", moment(new Date()).add(30, "days"));
    setFieldValue("priority", "Medium");
    setFieldValue("upload", null);
    setFieldValue("typeOfService", []);
    setFieldValue("appeal", []);
    setFieldValue("typeOfMode", "RTI");
  };

  const today1 = moment();
  const disableFutureDt = (current) => {
    return current.isBefore(today1);
  };

  const addNewFiles = (newFiles) => {
    for (let file of newFiles) {
      if (
        // file.size <= maxFileSizeInBytes
        // && (
        file.type === "application/pdf" ||
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/msword" ||
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ) {
        // )
        if (!otherProps.multiple) {
          return { file };
        }
        files[file.name] = file;
      } else {
        alert(
          "Please Select Valid File Type:{DOCX,PPTX,PPT,XLSX,XLS,PDF,JPEG,PNG,JPG}"
        );
      }
    }
    return { ...files };
  };

  const [filename, setfilename] = useState("");
  const handleUploadFile = (e) => {
    let fd = new FormData();
    fd.append("files", e.target.files[0]);
    formik.setFieldValue("upload", e.target.files[0]);
    setUploadFile(fd);
    setfilename(e.target.files[0].name);
  };

  // const handleUploadFile =(e)=>{
  //   let fd = new FormData();
  //   fd.append("files",e.file[0]);
  //   formik.setFieldValue("upload",fd);
  //   setUploadFile(fd);
  //   console.log(e)
  // }

  const handleUploadFile1 = (e) => {
    if (e.file.status === "uploading") {
      console.log(e.file);
      return;
    }
  };

  const handleAppeal = () => {
    props
      .FindByAppeal()
      .then((resp) => {
        let tmpArr = [];
        try {
          // condition to check if response then perform further
          if (resp !== undefined) {
            tmpArr = resp.appealNumbers.filter((item) => item !== null);

            setAppealno(tmpArr);
          } else {
            const errorMessage =
              resp.status + " : " + resp.error + " AT " + resp.path;
            callMessageOut(errorMessage);
          }
        } catch (e) {
          callMessageOut(e.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // const handleDetails = (appealno) => {
  //   props
  //     .getAutoDetails(appealno)
  //     .then((resp) => {
  //       console.log(resp)
  //     })
  // };

  const handle = (values) => {
    formik.setFieldValue("appeal", values);
  };

  const fileInputField = useRef(null);
  // const [files, setFiles] = useState({});

  const handleUploadBtnClick = () => {
    fileInputField.current.click();
  };

  const removeFile = (filename) => {
    setFiles(files.filter((file) => file.name !== filename));
  };

  return (
    <div>
    {load && <Loading />}
    <form onSubmit={formik.handleSubmit} id="rtiform" >
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* <Grid item xs={1.5}><h6 style={{ marginTop: "0.7rem" }}>PRIORITY:</h6></Grid> */}
          <Grid item xs={4}>
            {/* <FormControl
              style={{
                display: "flex",
              }}
            >
              <RadioGroup
                row
                name="priority"
                defaultValue="high"
                onChange={(_, value) =>
                  formik.setFieldValue("priority", value)
                }
              // style={{
              //   justifyContent: "space-between",
              // }}
              >
                <FormControlLabel
                  value="low"
                  control={<Radio color="primary" />}
                  label="LOW"
                />
                <FormControlLabel
                  value="medium"
                  control={<Radio color="primary" />}
                  label="MEDIUM"
                />
                <FormControlLabel
                  value="high"
                  control={<Radio color="primary" />}
                  label="HIGH"
                />
              </RadioGroup>
            </FormControl> */}
            <TextField
              {...configData}
              select
              name="priority"
              label="PRIORITY"
              value={formik.values.priority}
              onChange={(e) => formik.setFieldValue("priority", e.target.value)}
              SelectProps={{
                native: true,
              }}
              variant="outlined"
              size="small"
            >
              {priority.map((option) => (
                <option key={option.title} value={option.title}>
                  {option.title}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={4}>
            <TextField
              {...configData}
              select
              label="LANGUAGE OF RESPONSE"
              value={formik.values.language}
              onChange={(e) => formik.setFieldValue("language", e.target.value)}
              SelectProps={{
                native: true,
              }}
              variant="outlined"
              size="small"
            >
              {language.map((option) => (
                <option key={option.title} value={option.title}>
                  {option.title}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={4}>
            <TextField
              {...configData}
              select
              label="TYPE"
              value={formik.values.appealOptions}
              onChange={(e) =>
                formik.setFieldValue("appealOptions", e.target.value)
              }
              variant="outlined"
              size="small"
              SelectProps={{
                native: true,
              }}
            >
              {appealOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            {formik.values.appealOptions == "Appeal" && (
              <Autocomplete
                size="small"
                name="typeOfMode"
                options={appealno}
                // value={formik.values.appealNumbers}
                onChange={(e, newvalue) => {
                  handle(newvalue);
                }}
                // onInputChange={(event) => setPinCode(event.target.value)}

                // onInputChange={() => handleDetails(first)}

                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="APPEAL NUMBER"
                    margin="normal"
                    variant="outlined"
                    error={
                      formik.touched.appeal && Boolean(formik.errors.appeal)
                    }
                    helperText={formik.touched.appeal && formik.errors.appeal}
                  />
                )}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...configData}
              name="subject"
              label="SUBJECT"
              value={formik.values.subject}
              onChange={formik.handleChange}
              error={formik.touched.subject && Boolean(formik.errors.subject)}
              helperText={formik.touched.subject && formik.errors.subject}
              // style={{ marginBottom: ".6rem" }}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              {...configData}
              name="rtiBy"
              label="RTI REQUESTER"
              value={formik.values.rtiBy}
              onChange={formik.handleChange}
              error={formik.touched.rtiBy && Boolean(formik.errors.rtiBy)}
              helperText={formik.touched.rtiBy && formik.errors.rtiBy}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              {...configData}
              size="small"
              value={createdOnDate}
              name="date"
              type="date"
              variant="outlined"
              label="CREATED DATE"
              inputProps={{
                min: moment(new Date()).format("YYYY-MM-DD"),
              }}
              onChange={dateChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              {...configData}
              variant="outlined"
              type="date"
              size="small"
              label="RESPONSE DATE"
              name="responseDate"
              value={responseDate}
              inputProps={{
                min: createdOnDate,
                max: get30DayGap(new Date(createdOnDate)),
              }}
              onChange={dateChangeResp}
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              size="small"
              name="typeOfService"
              options={top100Films.map((option) => option.title)}
              value={formik.values.typeOfService}
              onChange={(_, value) =>
                formik.setFieldValue("typeOfService", value)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="TYPE OF SERVICE"
                  margin="normal"
                  // multiline
                  minRows={1}
                  variant="outlined"
                  error={
                    formik.touched.typeOfService &&
                    Boolean(formik.errors.typeOfService)
                  }
                  helperText={
                    formik.touched.typeOfService && formik.errors.typeOfService
                  }
                />
              )}
            />
          </Grid>
          {/* <Grid item xs={2}><h6 style={{ marginTop: "0.7rem" }}>PRIORITY:</h6></Grid> */}
          <Grid item xs={4}>
            <TextField
              {...configData}
              select
              name="receivingMode"
              label="MODE OF RESPONSE"
              value={formik.values.receivingMode}
              onClick={() => setSelectMode(formik.values.receivingMode)}
              onChange={(e) =>
                formik.setFieldValue("receivingMode", e.target.value)
              }
              SelectProps={{
                native: true,
              }}
              variant="outlined"
              size="small"
            >
              {receivingMode.map((option) => (
                <option key={option.title} value={option.title}>
                  {option.title}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={8}>
            {formik.values.receivingMode == "Post" ? (
              <TextField
                {...configData}
                name="address"
                label="ADDRESS"
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            ) : formik.values.receivingMode == "Email" ? (
              <>
                <TextField
                  {...configData}
                  // style={{ marginBottom: "2px" }}
                  name="email"
                  label="EMAIL ID"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </>
            ) : (
              <>
                <TextField
                  {...configData}
                  disabled
                  // style={{ marginBottom: "2px" }}
                  // name="email"
                  label="You can go to RTI gov portal for the Response "
                  value={formik.values.Portal}
                //  inputProps={}

                // onChange={formik.handleChange}
                />
              </>
            )}
          </Grid>

          {formik.values.receivingMode == "Post" && (
            <Grid item xs={4}>
              <TextField
                {...configData}
                select
                label="STATE"
                // value={formik.values.State1}
                // onChange={(e) => {
                //   let newData = JSON.parse(e.target.value);
                //   setDistricts(newData.districts);
                //   formik.setFieldValue("State1", newData.state);
                // }}
                onChange={(e) =>{
                  handlefetchAddress(e.target.value);
                  formik.setFieldValue("State1",e.target.value);
                }}
                // value={selectedState} onChange={handleStateChange}
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                size="small"
                error={formik.touched.State1 && Boolean(formik.errors.State1)}
                helperText={formik.touched.State1 && formik.errors.State1}
              >

                {/* {states && states.map((option, i) => {
                  if (i == 0) {
                    return <option disabled selected>
                      Please Select State
                    </option>
                  }
                  return <option key={option} value={JSON.stringify(option)}>
                    {option}
                  </option>

                })} */}
                <option disabled selected>
                  Please Select State
                </option>
                {states && states.map((option) => (
                  <option key={option} value={JSON.stringify(option)}>
                    {option}
                  </option>
                ))}
              </TextField>
            </Grid>
          )}

          {formik.values.receivingMode == "Post" && (
            <Grid item xs={4}>
              <TextField
                {...configData}
                select
                label="DISTRICT"
                name="district"
                // value={formik.values.State1}
                // onChange={(e) =>
                //   formik.setFieldValue("district", e.target.value)
                // }
                // value={selectedDistrict} onChange={handleDistrictChange}
                onChange={(e) => {
                  formik.setFieldValue("district",e.target.value)
                  handlefetchAddress("", e.target.value)}}
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                size="small"
                error={formik.touched.district && Boolean(formik.errors.district)}
                helperText={formik.touched.district && formik.errors.district}
              >
                <option disabled selected>
                  Please Select State First
                </option>
                {districts && districts.map((option) => (
                  <option key={option} value={JSON.stringify(option)}>
                    {option}
                  </option>
                ))}
                {/* {districts && districts.map((option, i) => {
                  if (i == 0) {
                    return <option disabled selected>
                      Please Select State First
                    </option>
                  }
                  return <option key={option} value={JSON.stringify(option)}>
                    {option}
                  </option>

                })} */}
              </TextField>
            </Grid>
          )}

          {formik.values.receivingMode == "Post" && (
            <Grid item xs={4}>
              {/* <TextField
                {...configData}
                // style={{ marginBottom: "2px" }}
                name="pincode"
                label="PIN CODE"
                // value={formik.values.pincode}
                // onChange={formik.handleChange}
                // value={selectedPincode} onChange={handlePincodeChange}
                error={formik.touched.email && Boolean(formik.errors.pincode)}
                helperText={formik.touched.email && formik.errors.pincode}
              /> */}
              <TextField
                {...configData}
                select
                Value={""}
                label="PIN CODE"
                name="pincode"
                // value={formik.values.State1}
                // onChange={(e) =>
                //   formik.setFieldValue("district", e.target.value)
                // }
                onChange={(e) => {
                  formik.setFieldValue("pincode",e.target.value)
                  }}

                // value={selectedDistrict} onChange={handleDistrictChange}
                // onChange={(e) =>  formik.setFieldValue("State1",e.target.value);}
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                size="small"
                error={formik.touched.pincode && Boolean(formik.errors.pincode)}
                helperText={formik.touched.pincode && formik.errors.pincode}
              >
                <option disabled selected>
                  Please Select District First
                </option>
                {pincodes && pincodes.map((option) => (
                  <option key={option} value={JSON.stringify(option)}>
                    {option}
                  </option>
                ))}
                {/* {pincodes && pincodes.map((option, i) => {
                  if (i == 0) {
                    return <option disabled selected>
                      Please Select District First
                    </option>
                  }
                  return <option key={option} value={JSON.stringify(option)}>
                    {option}
                  </option>

                })} */}

              </TextField>
            </Grid>
          )}

          <Grid item xs={12}>
            {/* <div>
      <FileUpload files={files} setFiles={setFiles}
        removeFile={removeFile} />
      <FileList files={files} removeFile={removeFile} />
    </div> */}
            <TextField
              {...configData}
              name="upload"
              type="file"
              inputProps={{ accept: "application/pdf , application/vnd.openxmlformats-officedocument.wordprocessingml.document ,application/msword" }}
              onChange={handleUploadFile}
              error={formik.touched.upload && Boolean(formik.errors.upload)}
              helperText={formik.touched.upload && formik.errors.upload}
              style={{ marginBottom: "0.7rem" }}
            />

            {/* <label htmlFor="upload-photo">
  <input
    style={{ display: 'none' }}
    id="upload-photo"
    name="upload-photo"
    type="file"
  />

  <Button color="secondary" variant="contained" component="span">
    Upload button
  </Button>
</label>; */}
            {/* <div {...configData} >
              <Upload.Dragger multiple={true} listType="text" accept=  "application/vnd.openxmlformats-officedocument.wordprocessingml.document , application/msword"  beforeUpload={beforeUpload} >
                Drag file here or 
                <Button onChange={handleUploadFile}>Upload Your File</Button>
              </Upload.Dragger>
            </div> */}

            {/* <input type="file" id="real-file" hidden="hidden" />
            <button type="button" id="custom-button">ADD ATTACHMENT</button>
            <span id="custom-text">No file chosen</span> */}

            {/* <FileUploadContainerRti>
              <UploadFileBtnRti
                id="file_uploadBtn"
                type="button"
                onClick={handleUploadBtnClick}
              >
               <span style={{marginRight:"2rem"}}><CloudUploadIcon/></span>
                <span> ADD ATTACHMENT </span>
                
              </UploadFileBtnRti>
              <FormFieldRti
                type="file"
                ref={fileInputField}
                onChange={handleUploadFile}
                title=""
                value=""
                name="upload"
                
              />
            </FileUploadContainerRti> */}

            {/* <FilePreviewContainerRti> {filename} </FilePreviewContainerRti> */}

            {/* <label className="FILELABLE" for="avatar">

              <input type="file"
                name="upload"
                accept="image/png, image/jpeg"
                onChange={handleUploadFile}
                // error={formik.touched.upload && Boolean(formik.errors.upload)}
                // helperText={formik.touched.upload && formik.errors.upload} 
                />
            </label> */}

            {/* <section>
              <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <div>Drag and drop your files here.</div>
              </div>
              <aside>
                {thumbs}
              </aside>
            </section> */}

            {/* <div class="form__group" >
              <input type="file" id="email" class="form__field" placeholder="Your Email" onChange={handleUploadFile} />
              <label for="email" class="form__label"> ADD ATTACHMENT </label>
            </div> */}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          id="RTIform_reset_btn"
          className="reset"
          color="primary"
          variant="outlined"
          onClick={handleReset}
        >
          RESET
        </Button>
        <Button
          id="RTIfrom_submit_btn"
          className="update"
          color="primary"
          variant="outlined"
          type="submit"
        >
          {props.updateSubject ? t("update").toUpperCase() : t("CREATE")}
        </Button>
        {/* </div> */}
      </DialogActions>
      {/* </Grid> */}
    </form>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
  };
}

export default connect(mapStateToProps, {
  addRTI,
  changingTableStateRti,
  uploadRti,
  FindByAppeal,
  loadRtiList,
  getAutoDetails,
  fetchAddress,
})(RtiForm);

const top100Films = [
  { title: "Medical Service", year: 1994 },
  { title: "Essential Service", year: 1972 },
  { title: "Test Service", year: 1974 },
  { title: "Ammunition Service", year: 2008 },
  { title: "Cyber Service", year: 1957 },
  { title: "Transport Service", year: 1993 },
  { title: "Bank Service", year: 1994 },
];

const receivingMode = [
  { title: "Portal" },
  { title: "Email" },
  { title: "Post" },
];

const priority = [{ title: "Low" }, { title: "Medium" }, { title: "High" }];

const language = [{ title: "English" }, { title: "Hindi" }];

const State1 = [
  { title: "Andhra Pradesh" },
  { title: "Arunachal Pradesh" },
  { title: "Assam" },
  { title: "Bihar" },
  { title: "Chhattisgarh" },
  { title: "Goa" },
  { title: "Gujarat" },
  { title: "Haryana" },
  { title: "Himachal Pradesh" },
  { title: "Jharkhand" },
  { title: "Karnataka" },
  { title: "Kerala" },
  { title: "Madhya Pradesh" },
  { title: "Maharashtra" },
  { title: "Manipur" },
  { title: "Meghalaya" },
  { title: "Mizoram" },
  { title: "Nagaland" },
  { title: "Odisha" },
  { title: "Punjab" },
  { title: "Rajasthan" },
  { title: "Sikkim" },
  { title: "Tamil Nadu" },
  { title: "Telangana" },
  { title: "Tripura" },
  { title: "Uttar Pradesh" },
  { title: "Uttarakhand" },
  { title: "West Bengal" },
];
