import React, { useState } from "react";
import { Formik } from "formik";
import Form from "./form";
import * as Yup from "yup";
import { connect, useDispatch } from "react-redux";
import { quickSign } from "../../../../camunda_redux/redux/action";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { useTranslation } from "react-i18next";
import { Loading } from "../../therme-source/material-ui/loading";
import Cookies from "js-cookie";
import { addYlowNote } from "../../../../camunda_redux/redux/action";
import { useContext } from "react";
import { SplitViewContext } from "../SplitviewContainer/Worker";

const InputForm = (props) => {
  const { t } = useTranslation();
  const { tabIndex } = useContext(SplitViewContext);
  let isBm = tabIndex;

  const [fileURL, setFileURL] = useState("");
  const [blnDisable, setBlnDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { SignURL, flagNum, isYloNote, docId } = props;
  let isRti = Cookies.get("isRti");

  const validationSchema1 = Yup.object({
    comments: Yup.string(t("enter_a_comment")),
    pencilColorCode: Yup.string(t("select_a_pencil_color")).required(
      t("color_is_required")
    ),
  });

  const validationSchema2 = Yup.object({
    comments: Yup.string(t("enter_a_yellow_note"))
      .trim()
      .required(t("yellow_note_is_required")),
    pencilColorCode: Yup.string(t("select_a_pencil_color")).required(
      t("color_is_required")
    ),
    sendTo: Yup.array()
      .of(Yup.string())
      .when("eyesOnly", {
        is: true,
        then: Yup.array().required("Send field is required"),
        otherwise: Yup.array(),
      }),
  });

  const submit1 = (data, action) => {
    setBlnDisable(true);
    setIsLoading(true);
    let formData = {
      comments: encodeURIComponent(data.comments),
      tag: "APPROVED",
      signTitle: localStorage.getItem("username"),
      pencilColorCode: data.pencilColorCode,
      username: localStorage.getItem("username"),
      color: data.pencilColorCode,
      personalAppliactionFileId: data.personalAppliactionFileId,
      dep_desc: sessionStorage.getItem("displayDept"),
      user_desc: sessionStorage.getItem("displayRole"),
      url: SignURL,
      partCaseFileId: data.personalAppliactionFileId,
    };

    const roleName = sessionStorage.getItem("role");
    const depart = sessionStorage.getItem("department");
    const username = localStorage.getItem("username");

    props
      .quickSign(
        formData,
        roleName,
        depart,
        username,
        flagNum,
        "",
        "",
        "",
        isRti,
        docId,
        null,
        isBm === 0 ? true : false
      )

      .then((response) => {
        try {
          if (response.error) {
            callMessageOut(response.error);
            setIsLoading(false);
            return;
          }
          if (response !== undefined && response !== null) {
            setBlnDisable(false);
            if (response.url) {
              setFileURL(response.url);
              {
                props.flag == "Enclouser"
                  ? props.handleEnclosure(response.enclosure)
                  : isRti
                    ? props.loadRtiData()
                    : props.callBackURL(response.file);
              }
              action.resetForm();
              props.isSignedCompleted(true);
            }
            setIsLoading(false);
          } else {
            props.isSignedCompleted(false);
            const errorMessage =
              resp.status + " : " + resp.error + " AT " + resp.path;
            callMessageOut(errorMessage);
            setIsLoading(false);
          }
        } catch (e) {
          setIsLoading(false);
          props.isSignedCompleted(false);
          callMessageOut(e.message);
        }
      });
  };

  const submit2 = async (data, action) => {
    setIsLoading(true);
    const roles = data.sendTo.map((item, i) => item.deptRole?.roleName);
    props
      .addYlowNote(
        data.comments,
        data.pencilColorCode,
        data.partcaseId,
        data.user,
        roles
      )
      .then((res) => {
        try {
          if (res.error) {
            setIsLoading(false);
            callMessageOut2("error", res.error);
            return;
          }
          callMessageOut2("success", "Yellow Note Added Successfully");
          action.resetForm();
          setIsLoading(false);
          props.addedSuccess(res);
        } catch (error) {
          setIsLoading(false);
          callMessageOut2("error", error.message);
        }
      })
      .catch((err) => {
        console.log(err);
        callMessageOut("error", err.message);
      });
  };

  const callMessageOut2 = (type, message) => {
    dispatch(setSnackbar(true, type, message));
  };

  const callMessageOut = (message) => {
    setIsLoading(false);
    props.isSignedCompleted(true);
    dispatch(setSnackbar(true, "error", message));
  };

  const values1 = {
    comments: "",
    pencilColorCode: t("blue"),
    personalAppliactionFileId: props.fileId,
  }; //tag: "", signTitle: "",username: "", dep_desc: "", color: "",

  const values2 = {
    comments: "",
    pencilColorCode: t("blue"),
    eyesOnly: false,
    sendTo: [],
    partcaseId: sessionStorage.getItem("partcaseID"),
    user: sessionStorage.getItem("role"),
  };

  return (
    <React.Fragment>
      {isLoading && <Loading />}
      <Formik
        initialValues={isYloNote ? values2 : values1}
        validationSchema={isYloNote ? validationSchema2 : validationSchema1}
        onSubmit={isYloNote ? submit2 : submit1}
      >
        {(props) => (
          <Form {...props} blnDisable={blnDisable} isYloNote={isYloNote} />
        )}
      </Formik>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return { props: state.props };
}

export default connect(mapStateToProps, { quickSign, addYlowNote })(InputForm);
