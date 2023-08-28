import React, {useEffect, useState} from "react";
import Paper from "@material-ui/core/Paper";
import {
    FilteringState, IntegratedFiltering, PagingState, IntegratedPaging, SortingState,
    IntegratedSorting, SearchState, GroupingState, SelectionState,
} from "@devexpress/dx-react-grid";
import history from '../../../../history'
import {
    Grid,
    Table,
    TableHeaderRow,
    PagingPanel,
    Toolbar,
    TableFilterRow,
    GroupingPanel,
    SearchPanel,
    TableColumnResizing, TableSelection, TableRowDetail,
} from "@devexpress/dx-react-grid-material-ui";
import {withStyles} from "@material-ui/core";
import {connect} from "react-redux";
import {loadDraftData} from "../../../camunda_redux/redux/action";
import { useTranslation } from "react-i18next";

const styles = {
    customRow: {
        '&:hover': {
            backgroundColor: 'lightgray',
        }
    },
};

const TableCard2 = (props) => {
    const { t } = useTranslation()
    const columns = [
        { name: "fileName", title: `${t("file")} #` },
        { name: "subject", title: t("subject") },
        { name: "type", title: t("type") },
        { name: "createdOn", title: t("created_on") }
    ];
    const [rowData,setRowData] = useState([]);
    const role = sessionStorage.getItem('role');
    const handleChange = (event) =>
    {
        console.log(bodyRows);

    }
    const TableComponentBase = ({ classes, ...restProps }) => (
        <Table.Table
            {...restProps}
            className={classes.tableStriped}
        />
    );

    const TableComponent = withStyles(styles, { name: 'TableComponent' })(TableComponentBase);
    let dataFetch = true;
    useEffect(async() => {
        if (props.mountData === true || dataFetch === true) {

            props.loadDraftData(role).then(resp => {
                let tmpArr =[];
                if (resp.Data !== undefined) {
                    tmpArr = resp.Data;
                    console.log(tmpArr);
                    // for (var i = 0; i < resp.Data.length; i++) {
                    //     tmpArr.push(resp.Data[i]);
                    // }

                    setRowData(tmpArr);
                    dataFetch = false;
                }
            }).catch(error => {
                console.log(error);
            });
        }
    },[rowData])

    const [selection, setSelection] = useState([1]);
    const [searchValue, setSearchState] = useState('');
    const [bodyRows, setBodyRows] = useState([]);

    const groupingPanelMessages = {
        groupByColumn: 'Draft Files',
    };

    const handleClick = (e,row) =>
    {
        setBodyRows(row)
        history.push({pathname:"/costa/file/send",state:row});
    }

    const [defaultColumnWidths] = useState([
        { columnName: 'fileName', width: 120 },
        { columnName: 'subject', width: 120 },
        { columnName: 'type', width: 120 },
        { columnName: 'createdOn', width: 120 },
    ]);
    const TableRow = ({ row, ...restProps }) => (
        <Table.Row
            {...restProps}
            {... {hover: true}}
            // eslint-disable-next-line no-alert
            onClick={(e) => handleClick(e,row)}
            style={{
                cursor: 'pointer'
            }}
        />
    );

    return (
        <Paper elevation={3} style={{ position: 'relative' }}>
            <Grid rows={rowData} columns={columns}>
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
                <SortingState
                    defaultSorting={[{ columnName: 'createdOn', direction: 'desc' }]}
                />
                <GroupingState defaultGrouping={[]} />
                <IntegratedSorting/>
                <SelectionState
                    selection={selection}
                    onSelectionChange={handleChange}
                />
                <Table rowComponent={TableRow} tableComponent={TableComponent} />
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

function mapStateToProps(state) {

    return { props: state.props };
}

export default connect(mapStateToProps,{loadDraftData})(TableCard2);