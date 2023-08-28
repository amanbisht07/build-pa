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
import { getADUsers } from "app/camunda_redux/redux/action";
import { Person, Visibility } from "@material-ui/icons";
import ShowUserDialog from "./ShowUserDialog";
import { connect } from "react-redux";

const RoleGrid = (props) => {
   
  const { Roles } = props
  const [rowData, setRowData] = useState(Roles);
  const [pageSize, setPageSize] = useState(10);
  const pageSizes = [5, 10, 15];
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [showUser, setshowUser] = useState(false)
  const [SingleUser, setSingleUser] = useState({
    user:null,
    error:""
  })

  const handleUserDialog = (val)=>{
    setshowUser(val)
  }

  useEffect(() => {
    setRowData(!rowData);
    setTotalCount(Roles.length)
  }, [Roles, pageSize, currentPage]);
  
  // fetch user data based on btn click
  const getUserData = (userId)=>{
    
    props.getADUsers(userId).then((res)=>{
      if(res.error){
        setSingleUser({
          ...SingleUser,
          error:res.error
        })
      }
      else{
        setSingleUser({
          ...SingleUser,
          user:res.response
        })
      }
      handleUserDialog(true)
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  const getData = () => {
    let start = currentPage * pageSize;
    let end = (currentPage + 1) * pageSize;
    let tempArr = Roles.slice(start, end);
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
          id="deptUsername_button"
          style={{
            position: "relative",
            color:"rgb(5 100 200)"
          }}
          onClick={()=>{
            getUserData(args.deptUsername)
          }}
        >
          <Person />
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
            <ColumnDirective field="deptRole" width="80" headerText="Role Id" />
            <ColumnDirective
              field="deptRoleDisplayName"
              headerText="Role Name"
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
              field="deptUsername"
              headerText="Show User"
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

       <ShowUserDialog show={showUser} handleDialog={handleUserDialog} User={SingleUser}/>

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

export default connect(mapStateToProps,{getADUsers})(RoleGrid);
