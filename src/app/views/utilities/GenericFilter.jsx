import { Chip, IconButton, MenuItem, TextField } from "@material-ui/core";
import React from "react";
import { useState } from "react";
import { RiFilterLine } from "react-icons/ri";
import "./GenericFilter.css";

const GenericFilter = ({
  Filter,
  addFilter,
  deleteChip,
  FilterType,
  FilterValueTypes,
  cssCls,
}) => {
  const [FilterBy, setFilterBy] = useState(FilterType.optionValue[1]);

  const [FilterByValue, setFilterByValue] = useState("");

  const onChangeFilterBy = (val) => {
    setFilterBy(val);
    setFilterByValue("");
  };

  const onChangeValue = (val) => {
    setFilterByValue(val);
  };

  return (
    <div className={(cssCls && cssCls.Container) || "GenFilterContainer"}>
      <div className={(cssCls && cssCls.ChipContainer) || "GenChipCon"}>
        {Object.entries(Filter).map(([property, value], index) => {
          return (
            <Chip
              key={index}
              label={`${property}:${value}`}
              onDelete={() => {
                deleteChip(property);
              }}
              variant="outlined"
            />
          );
        })}
      </div>
      <div className={(cssCls && cssCls.FilterInpContainer) || "GenFilterInputs"}>
        <form
          onSubmit={(e) => {
            addFilter(e, FilterByValue);
          }}
        >
          <TextField
            select={FilterType.type === "select" ? true : false}
            size={FilterType.size}
            value={FilterBy}
            label={FilterType.label}
            color={FilterType.color}
            onChange={(e) => {
              onChangeFilterBy(e.target.value);
            }}
            variant={FilterType.variant}
          >
            {FilterType.optionValue.map((item, i) => {
              return (
                <MenuItem key={i} value={item} disabled={i === 0}>
                  {item}
                </MenuItem>
              );
            })}
          </TextField>
          {FilterValueTypes.map((type, i) => {
            if (FilterBy === type.name) {
              if (type.type === "select") {
                return (
                  <TextField
                    key={i}
                    size={type.size}
                    select
                    value={FilterByValue}
                    disabled={FilterBy ? false : true}
                    onChange={(e) => {
                      onChangeValue(e.target.value);
                    }}
                    variant={type.variant}
                    label={type.label}
                    color={type.color}
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
              } else {
                return (
                  <TextField
                    key={i}
                    size={type.size}
                    type={type.type}
                    value={FilterByValue}
                    disabled={FilterBy ? false : true}
                    onChange={(e) => {
                      onChangeValue(e.target.value);
                    }}
                    variant={type.variant}
                    label={type.label}
                    color={type.color}
                  />
                );
              }
            }
          })}
          <IconButton
            type="submit"
            disabled={FilterByValue ? false : true}
            onClick={(e) => {
              addFilter(e, FilterBy, FilterByValue);
            }}
            variant="outlined"
            color="primary"
          >
            <RiFilterLine />
          </IconButton>
        </form>
      </div>
    </div>
  );
};

export default GenericFilter;
