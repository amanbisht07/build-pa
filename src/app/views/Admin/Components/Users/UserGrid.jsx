import React, { useEffect, useState } from "react";
import {
    ColumnDirective,
    ColumnsDirective,
    CommandColumn,
    Filter,
    GridComponent,
    Inject,
    Page,
    Resize,
    Sort,
} from "@syncfusion/ej2-react-grids";
import PaginationComp from "app/views/utilities/PaginationComp";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";  

const UserGrid = ({ Users }) => {

  const [rowData, setRowData] = useState(Users);
  const [pageSize, setPageSize] = useState(10);
  const pageSizes = [5, 10, 15];
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);  

  
  useEffect(() => {
    setRowData(!rowData);
    setTotalCount(Users.length)
  }, [Users,pageSize, currentPage]);

  const getData = () => {
    let start = currentPage * pageSize;
    let end = (currentPage + 1) * pageSize;
    let tempArr = Users.slice(start, end);
    return tempArr;
  };

  const StatusTextColor = (args) => {
    return (
      <div
        style={{
          color: args.status ? "blue" : "red",
        }}
      >
        {args.status ? "Active" : "Not Active"}
      </div>
    );
  };

  const EmailTooltip = (args) => {
    return (
      <>
        <TooltipComponent
          content={args.email}
          offsetY={5}
          style={{
            textAlign: "left",
            justifyContent: "space-between",
            float: "left",
          }}
        >
          {args.email}
        </TooltipComponent>
      </>
    );
  };

  const PhoneNoTooltip = (args) => {
    return (
      <>
        <TooltipComponent
          content={args.phone}
          offsetY={5}
          style={{
            textAlign: "left",
            justifyContent: "space-between",
            float: "left",
          }}
        >
          {args.phone}
        </TooltipComponent>
      </>
    );
  };

  const rowDataBound = (args) => {
    let val = args.data.status;
    if (val) {
      args.row.classList.add(`super-app-theme-In-Progress`);
    } else {
      args.row.classList.add(`super-app-theme-Rejected`);
    }
  };
  
  return (
    <div className=" mui-table-customize">
      <GridComponent
        dataSource={getData()}
        rowDataBound={rowDataBound}
        height={Number(window.innerHeight - 250)}
        allowResizing={true}
        allowSorting={true}
        allowFiltering={true}
        filterSettings={{ type: "Menu" }}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="Sno"
            headerText="Sno"
            width="60"
            textAlign="left"
            allowFiltering={false}
            allowSorting={false}
          />
          <ColumnDirective field="userId" width="80" headerText="User Id" />
          <ColumnDirective field="rank" width="80" headerText="Rank" />
          <ColumnDirective field="name" headerText="Name" width="100" />
          <ColumnDirective
            field="status"
            headerText="Status"
            width="70"
            template={StatusTextColor}
          />
          <ColumnDirective
            field="email"
            headerText="Email"
            width="100"
            template={EmailTooltip}
          />
          <ColumnDirective
            field="phone"
            headerText="Phone No"
            width="100"
            template={PhoneNoTooltip}
          />
        </ColumnsDirective>
        <Inject services={[Resize, Sort, Filter, Page, CommandColumn]} />
      </GridComponent>
      <PaginationComp
        pageSize={pageSize}
        pageSizes={pageSizes}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalCount={totalCount}
        setPageSize={setPageSize}
      />
    </div>
  );
};

export default UserGrid;
