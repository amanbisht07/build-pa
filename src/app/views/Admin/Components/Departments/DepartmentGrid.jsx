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
import { IconButton } from "@material-ui/core";
import { getADRoles } from "app/camunda_redux/redux/action";
import { Category, Visibility } from "@material-ui/icons";
import { connect } from "react-redux";
import ShowRolesDialog from "./ShowRoleDialog";

const DepartmentGrid = (props) => {
   
  const { Departments } = props
  const [rowData, setRowData] = useState(Departments);
  const [pageSize, setPageSize] = useState(10);
  const pageSizes = [5, 10, 15];
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [showRoles, setshowRoles] = useState(false)
  const [DeptRolesList, setDeptRolesList] = useState({
    roles:[],
    error:""
  })

  const handleRoleDialog = (val)=>{
    setshowRoles(val)
  }

  useEffect(() => {
    setRowData(!rowData);
    setTotalCount(Departments.length)
  }, [Departments, pageSize, currentPage]);
  
  // fetch Roles data based on btn click
  const getRolesData = (deptName)=>{
    
    props.getADRoles(deptName).then((res)=>{
      let tmpArr = res.response.map((item,i)=>{
        return {
          Sno:`${i+1}`,
          ...item
        }
      })
      if(res.error){
        setDeptRolesList({
          ...DeptRolesList,
          error:res.error
        })
      }
      else{
        setDeptRolesList({
          ...DeptRolesList,
          roles:tmpArr
        })
      }
      handleRoleDialog(true)
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  const getData = () => {
    let start = currentPage * pageSize;
    let end = (currentPage + 1) * pageSize;
    let tempArr = Departments.slice(start, end);
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

  const UserTemplate = (args) => {
    return (
      <>
        <IconButton
          id="deptName_button"
          style={{
            position: "relative",
            color:"rgb(5 100 200)"
          }}
          onClick={()=>{
            getRolesData(args.deptName)
          }}
        >
          <Category />
          <Visibility
            style={{
              fontSize: "1.3rem",
              position: "absolute",
              bottom: "4%",
              right: "0%",
            }}
          />
        </IconButton>
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

    <>

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
              allowSorting={true}
            />
            <ColumnDirective field="deptName" width="80" headerText="Department Id" />
            <ColumnDirective
              field="deptDisplayName"
              headerText="Department Name"
              width="100"
              allowFiltering={true}
              allowSorting={false}
            />
            <ColumnDirective
              field="status"
              headerText="Status"
              width="70"
              template={StatusTextColor}
              allowFiltering={true}
              allowSorting={true}
            />
            <ColumnDirective
              field="deptName"
              headerText="Show Roles"
              width="50"
              template={UserTemplate}
              allowFiltering={false}
              allowSorting={false}
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

       <ShowRolesDialog show={showRoles} handleDialog={handleRoleDialog} Roles={DeptRolesList}/>

    </>

  );
};

function mapStateToProps(state) {
    return {
      props: state.props,
      subscribeApi: state.subscribeApi,
      theme: state.theme,
    };
  }

export default connect(mapStateToProps,{getADRoles})(DepartmentGrid);
