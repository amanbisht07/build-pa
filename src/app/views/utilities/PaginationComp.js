import { Grid, MenuItem, TextField, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import React, { memo, useEffect, useState } from "react";

const PaginationComp = (props) => {
  const {
    pageSize,
    currentPage,
    setCurrentPage,
    pageSizes,
    totalCount,
    setPageSize,
    isIndexWay
  } = props;

  const [pageNumber, setPageNumber] = useState(0);
  const [PageSize2, setPageSize2] = useState(pageSize)

  const handleChange = (event, value) => {
    setCurrentPage(value - 1);
  };

  const handleChange2 = (event, value) => {
    console.log(value)
    setCurrentPage(PageSize2*(value-1));
    setPageSize(PageSize2*((value-1)+1));
    
  };

  const handleChangePage = (e) => {
    setPageSize2(e.target.value)
    setPageSize(e.target.value);
    setCurrentPage(0);
  };

  useEffect(() => {
    let val = Math.ceil(totalCount / PageSize2);
    setPageNumber(val);
  }, [totalCount, PageSize2,pageSize]);

  return (
    <Grid
      style={{
        padding: ".5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        flexGrow:1
      }}
    >
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <Pagination
          count={pageNumber}
          page={currentPage + 1}
          onChange={(e,v)=>{
            if(isIndexWay) handleChange2(e,v)
            else handleChange(e,v)
          }}
        />
        <TextField
          select
          value={isIndexWay ? PageSize2 : pageSize}
          onChange={handleChangePage}
          variant="outlined"
          size="small"
          className="app-select-dark"
        >
          {pageSizes.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <Typography style={{ marginLeft: ".8rem" }}>Items per page</Typography>
      </div>
      <div>
        <Typography>
          {currentPage + 1} of {pageNumber} pages ({totalCount} Files)
        </Typography>
      </div>
    </Grid>
  );
};

export default memo(PaginationComp);
