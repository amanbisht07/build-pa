import {
  Button,
  Collapse,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  TextField,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import Axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useTranslation } from "react-i18next";
import { CgCopy } from "react-icons/cg";
import * as Yup from "yup";
import { Loading } from "../therme-source/material-ui/loading";

// import HeadersAndFootersView from "../../FileApproval/documentEditor/editor";

const ChatGptDialog = () => {
  const [url, setURL] = useState("");
  const [content, setcontent] = useState("");
  const [index, setindex] = useState(0);
  //   const { t } = useTranslation();

  //   const INITIAL_STATE = {
  //     search: "",
  //   };

  //   const VALIDATION_SCHEMA = Yup.object().shape({
  //     search: Yup.string("test").required(`${t("this_field_is_required")} !`),
  //   });

  //   const formik = useFormik({
  //     initialValues: INITIAL_STATE,
  //     validate: VALIDATION_SCHEMA,
  //     onSubmit: (values) => {
  //       console.log(values);
  //     },
  //   });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (index < url.length) {
      setTimeout(() => {
        setcontent(content + url[index]);
        setindex(index + 1);
      }, 6);
    }
  }, [index, url]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await Axios.post(
        "https://api.openai.com/v1/completions",
        {
          prompt: `${search}`,
          max_tokens: 1000,
          n: 1,
          temperature: 0.7,
          model: "text-davinci-003",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + "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",
          },
        }
      );

      // const response = await Axios.post(
      //   "/chat/file",
      //   { data: data.choices[0].text },
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
      //     },
      //   }
      // );

      let newData = data.choices[0].text;
      // console.log(response);
      unstable_batchedUpdates(() => {
        setindex(0);
        setURL("");
        setcontent("");
        setURL(newData.substring(2));
        setLoading(false);
      });
    } catch (error) {}
  };

  return (
    <>
      {loading && <Loading />}
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                name="search"
                label="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                //   value={formik.values.search}
                //   onChange={formik.handleChange}
                //   error={formik.touched.search && Boolean(formik.errors.search)}
                //   helperText={formik.touched.search && formik.errors.search}
                autoFocus
              />
            </Grid>
            <Collapse
              in={Boolean(url)}
              style={{
                width: "100%",
              }}
            >
              <Grid
                item
                xs={12}
                style={{
                  border: "1px solid #8080805c",
                  marginTop: "1rem",
                  borderRadius: ".5rem",
                  maxHeight: "250px",
                  overflow: "auto",
                }}
              >
                <div style={{ margin: "1rem" }}>
                  <TextField
                    style={{ whiteSpace: "pre-line" }}
                    value={content}
                    onChange={(e) => {
                      setcontent(e.target.value);
                    }}
                    multiline
                    fullWidth
                  />
                </div>
              </Grid>
            </Collapse>
          </Grid>
        </DialogContent>
        <DialogActions>
          {Boolean(index) && (
            <Button
              variant="contained"
              color="primary"
              endIcon={<CgCopy />}
              onClick={handleCopy}
            >
              Copy
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            endIcon={<Search />}
            type="submit"
          >
            SEARCH
          </Button>
        </DialogActions>
      </form>
    </>
  );
};

export default ChatGptDialog;
