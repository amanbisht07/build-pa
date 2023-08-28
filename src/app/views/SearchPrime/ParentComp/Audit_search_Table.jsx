import React, { useState } from "react";
import {
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableHead,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import PaginationComp from "app/views/utilities/PaginationComp";
import "../css/PrimeSearch.css";
import SyncProblemIcon from "@material-ui/icons/SyncProblem";

const SearchTableP = (props) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizes] = useState([5, 10, 15]);
  let getauditser = props.getauditsearchdata;

  return (
    <>
      <div>
        <Paper
          className="audit-seaech-table-mb"
          elevation={3}
          style={{
            position: "relative",
            borderRadius: "8px",
            paddingTop: "1rem",
          }}
        >
          <div style={{ padding: "0 1rem" }}>
            <TableContainer
              component={Paper}
              style={{
                border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
              }}
            >
              <Table component="div" aria-label="simple table">
                <TableHead component="div">
                  <TableRow component="div">
                    <div
                      className="audit-search-body"
                      style={{
                        borderBottom: `1px solid ${
                          props.theme ? "#727070" : "#c7c7c7"
                        }`,
                        backgroundColor: props.theme ? "#585858" : "#e5e5e5",
                        padding: "1rem",
                      }}
                    >
                      <div className="info2">
                        <span>{t("USER")}</span>
                      </div>
                      <div className="info3">
                        <span>{t("ROLE")}</span>
                      </div>
                      <div className="info4">
                        <span>{t("DEPARTMENT")}</span>
                      </div>
                      <div className="info5">
                        <span>{t("IP")}</span>
                      </div>
                      <div className="info6">
                        <span>{t("EVENT")}</span>
                      </div>
                      <div className="info7">
                        <span>{t("DATE")}</span>
                      </div>
                    </div>
                  </TableRow>
                </TableHead>
                <TableBody
                  className="search-table-body-p"
                  component="div"
                  style={{
                    height: "calc(100vh - 210px)",
                    overflowY: "auto",
                  }}
                >
                  {getauditser && getauditser.length > 0 ? (
                    getauditser
                      .slice(
                        currentPage * pageSizes + 1,
                        (currentPage + 1) * pageSize
                      )
                      .map((item) => {
                        return (
                          <TableRow hover component="div" key={item.id}>
                            <div
                              className="audit-search-body"
                              style={{
                                borderBottom: `1px solid ${
                                  props.theme ? "#727070" : "#c7c7c7"
                                }`,
                                padding: "10px",
                              }}
                            >
                              <div className="info2">
                                <span>{item.userName}</span>
                              </div>
                              <div className="info3">
                                <span>{item.roleName}</span>
                              </div>
                              <div className="info4">
                                <span>{item.department}</span>
                              </div>
                              <div className="info5">
                                <span>{item.clientAddress}</span>
                              </div>
                              <div className="info6">
                                <span>{item.action}</span>
                              </div>
                              <div className="info7">
                                <span>{item.time}</span>
                              </div>
                            </div>
                          </TableRow>
                        );
                      })
                  ) : (
                    <div className="audit_no_recode">
                      <div>
                        <SyncProblemIcon className="no_recore_icon" />
                      </div>
                      <span>No Record </span>
                    </div>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <PaginationComp
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={pageSize}
            pageSizes={pageSizes}
            setCurrentPage={setCurrentPage}
            setPageSize={setPageSize}
          />
        </Paper>
      </div>
    </>
  );
};

export default SearchTableP;
