import { Chip } from "@material-ui/core";
import React from "react";
import "./GenericChip.css";

const GenericChip = ({ Filter, deleteChip }) => {
  return (
    <>
      <div
        className="GenHeadChip"
        style={{
          display: _.isEmpty(Filter) ? "none" : "initial",
        }}
      >
        <div className="GenChipCon">
          {Object.entries(Filter).map(([property, value], index) => {
            return (
              <Chip
                key={index}
                label={`${property.split("|")[1]} : ${value}`}
                onDelete={() => {
                  deleteChip(property);
                }}
                variant="outlined"
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default GenericChip;
