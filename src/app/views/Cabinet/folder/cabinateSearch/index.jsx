import { IconButton, InputBase, MenuItem, TextField } from "@material-ui/core";
import { KeyboardBackspace, Search } from "@material-ui/icons";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import "./index.css";

const AdvanceSearch = ({
  addFilter,
  FilterTypes,
  FilterValueTypes,
  cssCls,
}) => {
  // state variables which get track of all filter functionality
  const [startFilter, setstartFilter] = useState(false);
  const [FilterBy, setFilterBy] = useState(FilterTypes.optionValue[1].value);
  const [FilterVal, setFilterVal] = useState("");

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

  let inpRef = useRef();

  useEffect(() => {
    if (!startFilter && inpRef.current) {
      inpRef.current.firstElementChild.blur();
    }
  }, [startFilter]);

  let today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <div
        className="GenOutlookCon"
        style={{
          // background: startFilter ? "white" : "#1a020208",
          width: startFilter ? "100%" : "70%",
        }}
      >
        {startFilter && (
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
                <MenuItem key={i} value={item.value} disabled={i === 0}>
                  {item.label}
                </MenuItem>
              );
            })}
          </TextField>
        )}
        <div className="GenSearchCon">
          {startFilter ? (
            <IconButton
              id="RTI_generic_back_btn"
              className="GenSearchClose"
              onClick={() => {
                toggleFilter(false);
              }}
            >
              <KeyboardBackspace />
            </IconButton>
          ) : (
            <IconButton
              id="RTI_GenFakeSearch"
              className="GenFakeSearch"
              style={{
                pointerEvents: startFilter ? "initial" : "none",
              }}
              disableRipple
            >
              <Search />
            </IconButton>
          )}
          <div className="GenSearchInput">
            {startFilter ? (
              FilterValueTypes.map((type, i) => {
                if (FilterBy === type.name) {
                  if (type.type === "select") {
                    return (
                      <TextField
                        key={i}
                        fullWidth
                        size={type.size}
                        select
                        className="GenFilterSelectInp"
                        color={type.color}
                        value={FilterVal}
                        onChange={(e) => {
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
                      </TextField>
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
              })
            ) : (
              <InputBase
                fullWidth
                placeholder="Search"
                value={FilterVal}
                onFocus={() => {
                  toggleFilter(true);
                }}
                ref={inpRef}
              />
            )}
          </div>
        </div>
        <IconButton
          id="RTI_GenSearchBtn"
          className="GenSearchBtn"
          style={{
            display: startFilter ? "initial" : "none",
          }}
          onClick={(e) => {
            addFilter(e, FilterBy, FilterVal);
          }}
        >
          <Search />
        </IconButton>
      </div>
    </>
  );
};

export default AdvanceSearch;
