import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import { IntegratedFiltering,  PagingState, IntegratedPaging,SortingState,
    IntegratedSorting,SearchState, GroupingState, } from "@devexpress/dx-react-grid";

import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  Toolbar,
  GroupingPanel,
  SearchPanel,
  TableColumnResizing,
} from "@devexpress/dx-react-grid-material-ui";
import { useTranslation } from "react-i18next";

export default () => {
  const { t } = useTranslation()
  const columns = [
    { name: "fileName", title: `${t('file')} #` },
    { name: "subject", title: t("subject") },
    { name: "type", title: t("type") },
    { name: "createdOn", title: t("created_on") }
  ];

  const rows = [
    // {id: 1, fileNo: "Test01", subject: "Male", type: "Delhi", createdOn: "Benz"}
  ];
  const [filters, setFilters] = useState();
  const [searchValue, setSearchState] = useState('');
  const groupingPanelMessages = {
    groupByColumn: 'Draft Correspondence',
  };
  const [defaultColumnWidths] = useState([
    { columnName: 'fileNo', width: 120 },
    { columnName: 'subject', width: 100 },
    { columnName: 'type', width: 120 },
    { columnName: 'createdOn', width: 120 },
  ]);

  return (
    <Paper elevation={3} style={{ position: 'relative' }}>
      <Grid rows={rows} columns={columns}>
      <SearchState
          value={searchValue}
          onValueChange={setSearchState}
        />
        <IntegratedFiltering />
        <PagingState
          defaultCurrentPage={0}
          pageSize={5}
        />
        <IntegratedPaging />
        <SortingState />
        <GroupingState defaultGrouping={[]} />
        <IntegratedSorting/>
        <Table />
        <TableColumnResizing defaultColumnWidths={defaultColumnWidths}/>
        <TableHeaderRow showSortingControls/>
        <Toolbar />
        <GroupingPanel
          showGroupingControls
          messages={groupingPanelMessages}
        />
        <SearchPanel />
        <PagingPanel />
      </Grid>
    </Paper>
  );
};
