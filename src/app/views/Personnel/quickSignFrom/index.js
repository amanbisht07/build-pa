import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { Form } from "./form";
import * as Yup from "yup";
import { connect, useDispatch } from "react-redux";
import { quickSign } from "../../../camunda_redux/redux/action";
import { setPassData } from "../../../camunda_redux/redux/ducks/passData";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { Loading } from "../therme-source/material-ui/loading";
import { useTranslation } from "react-i18next";

const InputForm = (props) => {
  const { t } = useTranslation();
  const url = sessionStorage.getItem("FileURL");
  const dispatch = useDispatch();
  const [quickSignLoading, setQuickSignLoading] = useState(false);
  const [blnDisable, setBlnDisable] = useState(false);
  const department = sessionStorage.getItem("department");
  const userName = sessionStorage.getItem("username");

  const validationSchema = Yup.object({
    comments: Yup.string(t("enter_a_comment")),
    pencilColorCode: Yup.string(t("select_a_pencil_color")).required(
      t("color_is_required")
    ),
  });

  useEffect(() => {
    if (props.fileUrl1) {
      if (props.fileUrl1 !== null && props.fileUrl1 !== "") {
        setTimeout(() => {
          dispatch(setPassData(props.fileUrl1));
        }, 1000);
      }
    }
  }, [props.fileUrl1]);

  const submit = (data, action) => {

    setBlnDisable(true);
    setQuickSignLoading(true);

    let body;
    let formData = {
      comments: encodeURIComponent(data.comments),
      tag: "APPROVED",
      signTitle: localStorage.getItem("username"),
      pencilColorCode: data.pencilColorCode,
      username: localStorage.getItem("username"),
      color: data.pencilColorCode,
      personalAppliactionFileId: data.personalAppliactionFileId,
      dep_desc: "",
      user_desc: sessionStorage.getItem("displayUserName"),
      // url: url.split("?versionId")[0],
      url: url,
      partCaseFileId: data.personalAppliactionFileId,
    };

    const roleName = sessionStorage.getItem("role");

    if (props.correspondence) {
      console.log(data);
      body = {
        corrDocId: data.personalAppliactionFileId,
        annexure: false,
        reference: false,
        application: true,
        flagNumber: 0,
      };
    }
    props
      .quickSign(
        formData,
        roleName,
        department,
        userName,
        "",
        false,
        "",
        props.pfileName,
        "",
        "",
        body
      )
      .then((response) => {
        console.log(response);
        try {
          if (response.error) {
            callMessageOut(response.error);
            setBlnDisable(false);
            setQuickSignLoading(false);
            return;
          }
          if (response !== undefined && response !== null) {
            const { file } = response;
            let fileObj;
            if (props.correspondence) fileObj = file.application;
            else fileObj = file;
            if (response.url) {
              props.updatePa(fileObj);
              const url = response.url;
              props.toggleViewer(false, url);
              dispatch(
                setSnackbar(
                  true,
                  "success",
                  t("sign_successful,_please-wait_till_PDF_renders.")
                )
              );
              action.resetForm();
              setBlnDisable(false);
              setQuickSignLoading(false);
            }
          } else {
            const errorMessage =
              response.status + " : " + response.error + " AT " + response.path;
            callMessageOut(errorMessage);
            setQuickSignLoading(false);
          }
        } catch (e) {
          callMessageOut(e.message);
          setQuickSignLoading(false);
        }
      });
  };

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const send = () => {
    const { sendToogle } = props;
    sendToogle(true);
  };

  const handleReturnToEditor = () => {
    const { returnToEditor } = props;
    returnToEditor(true);
  };

  const values = {
    comments: "",
    pencilColorCode: t("blue"),
    personalAppliactionFileId: props.fileId,
  }; //tag: "", signTitle: "",username: "", dep_desc: "", color: "",
  return (
    <>
      {quickSignLoading && <Loading />}
      <Formik
        initialValues={values}
        validationSchema={validationSchema}
        onSubmit={submit}
      >
        {(props, quickSignLoading) => (
          <Form
            {...props}
            quickSignLoading={quickSignLoading}
            sendClick={send}
            returnToEditorCLick={handleReturnToEditor}
            blnDisable={blnDisable}
          />
        )}
      </Formik>
    </>
  );
};

function mapStateToProps(state) {
  return { props: state.props};
}

export default connect(mapStateToProps, { quickSign })(InputForm);
