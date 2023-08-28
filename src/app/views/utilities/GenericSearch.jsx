import {
  IconButton,
  InputBase,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";

import "./GenericSearch.css";
// import { FaFilter } from "react-icons/fa";
import { Autocomplete } from "@material-ui/lab";
import { connect } from "react-redux";
import { getContentData } from "../../camunda_redux/redux/action";
import { debounce } from "utils";
import Axios from "axios";
import { useContext } from "react";
import { AdvanceSearchContext } from "../Cabinet/folder/Cabinet";
import TuneIcon from "@material-ui/icons/Tune";
import RenderOption from "./RenderOption";

const GenericSearch = (props) => {
  const {
    addFilter,
    FilterTypes,
    FilterValueTypes,
    cssCls,
    width,
    handleOpenAdvance,
    loadAdvanceSearchTable,
  } = props;
  // state variables which get track of all filter functionality
  const [FilterBy, setFilterBy] = useState(
    `${FilterTypes.optionValue[1].value}|${FilterTypes.optionValue[1].label}` // combination to handle both ui chips or backend value
  );
  const [FilterVal, setFilterVal] = useState("");
  const [conetntArr, setContentArr] = useState([]);
  const advanceProps = useContext(AdvanceSearchContext);

  const btnRef = useRef();

  const toggleFilter = (val) => {
    setFilterVal("");
    setstartFilter(val);
  };

  const onChangeFilterBy = (val) => {
    setFilterVal("");
    setFilterBy(val);
  };

  const onChangeValue = (val, type) => {
    if (type !== "text" && !val.trim()) {
      setFilterVal("");
    } else {
      setFilterVal(val);
    }
  };

  let today = new Date().toISOString().slice(0, 10);

  const [val, setVla] = useState("");
  const getContentdatas = async (value) => {
    setVla(value);
    localStorage.setItem("searchText", value);
    if (value && value.length > 2) {
      const rolename = sessionStorage.getItem("role");
      const { data } = await Axios.get(
        `/esearch/text-CabinetAutoSuggest?${value?.trim() && `Text=${value.trim()}`
        }`,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
            roleName: rolename,
            department: sessionStorage.getItem("department"),
            userName: localStorage.getItem("username"),
            scope: advanceProps.scope ? advanceProps.scope : "internal",
            sessionId: sessionStorage.getItem("sessionId"),
          },
        }
      );
      const tempArr = Object.keys(data?.Text);
      console.log(tempArr);
      setContentArr(tempArr);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (FilterBy === "advance") {
      loadAdvanceSearchTable(val);
    } else {
      addFilter(e, FilterBy, FilterVal);
    }
  };
  const handleSuggestionHandle = (value) => {
    let suggestValue = value.replaceAll("<b>", "").replaceAll("</b>", "");
    advanceProps.AdvanceOnChange("text", suggestValue);
    loadAdvanceSearchTable(suggestValue);
  };

  const optimizedFn = useCallback(debounce(getContentdatas), []);
  return (
    <>
      <div
        className="GenOutlookCon"
        style={{
          // background: startFilter ? "white" : "#1a020208",
          width: width ? width : "85%",
        }}
      >
        <form onSubmit={handleSubmit}>
          <TextField
            className="GenFilterOption"
            select
            size={FilterTypes.size}
            value={FilterBy}
            color={FilterTypes.color}
            onChange={(e) => {
              onChangeFilterBy(e.target.value);
            }}
            variant={FilterTypes.variant}
          >
            {FilterTypes.optionValue.map((item, i) => {
              return (
                <MenuItem
                  key={i}
                  value={`${item.value}|${item.label}`}
                  disabled={i === 0}
                >
                  {item.label}
                </MenuItem>
              );
            })}
          </TextField>

          <div className="GenSearchCon">
            <div className="GenSearchInput">
              {FilterValueTypes.map((type, i) => {
                if (FilterBy.split("|")[0] === type.name) {
                  if (type.type === "select") {
                    return (
                      <Select
                        key={i}
                        size={type.size}
                        className="GenFilterSelectInp"
                        color={type.color}
                        MenuProps={{
                          TransitionProps: {
                            onExited: () => btnRef.current.focus(),
                          },
                        }}
                        value={FilterVal}
                        onChange={(e) => {
                          btnRef.current.focus();
                          onChangeValue(e.target.value, "text");
                        }}
                        variant={type.variant}
                      >
                        {type.optionValue.map((item, i) => {
                          return (
                            <MenuItem key={i} value={item}>
                              {item}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    );
                  } else if (type.type === "date") {
                    return (
                      <TextField
                        key={i}
                        fullWidth
                        size={type.size}
                        type="date"
                        className="GenFilterDateInp"
                        value={FilterVal}
                        onChange={(e) => {
                          onChangeValue(e.target.value, "text");
                        }}
                        variant={type.variant}
                        color={type.color}
                        InputProps={{
                          inputProps: { max: today }, // now future date is disabled
                        }}
                      />
                    );
                  } else if (type.type === "auto") {
                    return (
                      <Autocomplete
                        freeSolo
                        name="contentnamess"
                        id="disable-clearable"
                        disableClearable
                        options={conetntArr}
                        key={i}
                        renderOption={(option) => (
                          <RenderOption option={option} />
                        )}
                        value={advanceProps?.text}
                        onInputChange={(e) => e && optimizedFn(e.target.value)}
                        onChange={(e, value) => {
                          handleSuggestionHandle(value);
                        }}
                        // onChange={(e, value) =>
                        //   advanceProps?.AdvanceOnChange(
                        //     "text",
                        //     value.replaceAll("<b>", "").replaceAll("</b>", "")
                        //   )
                        // }
                        renderInput={(params) => (
                          <>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-around",
                                alignItems: "center",
                                margin: "0 auto",
                              }}
                            >
                              <Search
                                className="search_icon"
                                onClick={handleSubmit}
                              />
                              <TextField
                                {...params}
                                variant="outlined"
                                placeholder="Search Text..."
                                size="small"
                                value={val}
                                className="GenFilterSelectInp"
                                onChange={(e) => setVla(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleSubmit(e);
                                  }
                                }}
                              />
                            </div>
                          </>
                        )}
                      />
                    );
                  } else {
                    return (
                      <InputBase
                        key={i}
                        fullWidth
                        type={type.text}
                        value={FilterVal}
                        onChange={(e) => {
                          onChangeValue(e.target.value, "text");
                        }}
                      />
                    );
                  }
                }
              })}
            </div>
          </div>
          {FilterBy.split("|")[0] === "advance" && (
            <IconButton
              id="RTI_GenSearchBtn"
              className="GenSearchBtn"
              style={{}}
              onClick={handleOpenAdvance}
            >
              <TuneIcon />
            </IconButton>
          )}
          <IconButton
            id="RTI_GenSearchBtn"
            ref={btnRef} // To automatically focus to search btn when selected any option from select
            className="GenSearchBtn"
            onClick={handleSubmit}
            type="submit"
            style={
              FilterBy.split("|")[0] === "advance"
                ? { display: "none" }
                : { display: "block" }
            }
          >
            <Search />
          </IconButton>
        </form>
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
  };
}

export default connect(mapStateToProps, {
  getContentData,
})(memo(GenericSearch));
