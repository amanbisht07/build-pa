import React, { useEffect, useState } from "react";
import {
    Grid as DevTable,
    Table,
    TableHeaderRow,
    TableTreeColumn,
    Toolbar,
    TableFilterRow,
    TableColumnResizing
} from '@devexpress/dx-react-grid-material-ui';
import { Card, Grid, IconButton, Paper, Tooltip, Typography } from "@material-ui/core";
import { CustomTreeData, TreeDataState, FilteringState, SortingState, IntegratedFiltering, IntegratedSorting } from "@devexpress/dx-react-grid";
import { alpha } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import { connect, useDispatch } from "react-redux";
import { getMISTableList } from "../../../camunda_redux/redux/action";
import { Loading } from '../therme-source/material-ui/loading';
import { Plugin, Template } from "@devexpress/dx-react-core";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import DoughnutChart from './Doughnut';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import { makeStyles } from '@material-ui/core/styles';

const styles = theme => ({
    tableStriped: {
        '& tbody tr:nth-of-type(odd)': {
            backgroundColor: alpha(theme.palette.primary.main, 0.10),
        },
        customRow: {
            '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.50),
            }
        },
    },
});


const chartStyle = makeStyles({
    // chartBox: {
    //     display: 'flex'
    // },
    // chartBoxwidth: {
    //     '& div': {
    //         width: '100%'
    //     }
    // }
});

const TableComponentBase = ({ classes, ...restProps }) => (
    <Table.Table
        {...restProps}
        className={classes.tableStriped}
    />
);

export const TableComponent = withStyles(styles, { name: 'TableComponent' })(TableComponentBase);
const HeaderCellComponent = props => (
    <TableHeaderRow.Cell
        {...props}
        style={{
            fontSize: '14px',
            fontWeight: 900,
        }}
    />
);

const MisTable = (props) => {
    const { setSelectionMode, setHeaderText } = props;
    const showRef = React.useRef(null);
    const classes = chartStyle()
    const dispatch = useDispatch();
    const columns = [
        { name: 'sau', title: 'SAU' },
        { name: 'totalFileInbox', title: 'Total Files' },
        { name: 'totalFilesPendingThreeSeven', title: 'Pending Files \n(> 3 days & <= 7) Days' },
        { name: 'totalFilesPendingSeven', title: 'Pending Files \n> 7 days' },
        { name: 'totalCorrespondenceInbox', title: 'Total Correspondence Files' },
        { name: 'totalCorrespondencePendingThreeSeven', title: 'Correspondence Files \n (> 3 & <= 7) Days' },
        { name: 'totalCorrespondencePendingSeven', title: 'Correspondence Files \n>7 days' },
    ];

    const getChildRows = (row, rootRows) => {
        const childRows = rootRows.filter(r => r.parentId === (row ? row.fileId : null));
        // console.log(childRows)
        return childRows.length ? childRows : null;
    };

    let [rowData, setRowData] = useState([])
    const [sauData, setSauData] = useState([]);
    let [ID, setID] = useState([0]);
    const [loading, setLoading] = useState(false);
    const [barGrid, setBargrid] = useState({ barChartSize: 12, showMisTable: false, barSize: '500px' });
    const [dataArr, setDataArr] = useState([]);
    const [corresArr, setCorresArr] = useState([]);
    const [blnShowClose, setBlnShowClose] = useState(false);
    const [chartDetailShow, setchartDetailShow] = useState(true)
    const [blnHideCorresDiv, setBlnHideCorresDiv] = useState(false)

    let groupName = sessionStorage.getItem("department");
    useEffect(() => {
        let newArr = []
        let total = 0
        let newCorresArr = []
        let corresTotal = 0
        setLoading(true);
        props.getMISTableList(groupName).then((resp) => {
            let tmpArr = [];
            try {
                if (resp.data !== undefined) {
                    tmpArr = resp.data;
                    setRowData(tmpArr)
                    const FileId = tmpArr.filter(x => x.parentId === null).map(item => item.fileId)
                    console.log(FileId)
                    for (let x = 0; x < tmpArr.length; x++) {
                        if (FileId[0] === tmpArr[x].parentId && tmpArr[x].totalFileInbox > 0) {
                            newArr.push(tmpArr[x])
                        }
                    }
                    newArr.map(i => total = i.totalFileInbox + total)
                    setDataArr((newArr.map(x => ({ 'value': (x.totalFileInbox / total) * 100, 'name': x.sau, 'label': `Total Inbox Files : ${x.totalFileInbox}`, 'rowID': x.indexId }))))

                    const CorresFileID = tmpArr.filter(x => x.parentId === null).map(item => item.fileId)
                    for (let x = 0; x < tmpArr.length; x++) {
                        if (CorresFileID[0] === tmpArr[x].parentId && tmpArr[x].totalCorrespondenceInbox > 0) {
                            newCorresArr.push(tmpArr[x])
                        } else {
                            setBlnHideCorresDiv(true)
                        }
                    }

                    newCorresArr.map(i => corresTotal = i.totalCorrespondenceInbox + corresTotal)
                    setCorresArr((newCorresArr.map(x => ({ 'value': (x.totalCorrespondenceInbox / corresTotal) * 100, 'name': x.sau, 'label': `Correspondence Files : ${x.totalCorrespondenceInbox}`, 'rowID': x.indexId }))))
                    setLoading(false);

                } else {
                    setLoading(false);
                    const errorMessage = resp.status + " : " + resp.error + " AT " + resp.path
                    callMessageOut(errorMessage);
                }
            }
            catch (e) {
                setLoading(false);
                callMessageOut(e.message);
            }
        }).catch(error => {
            console.log(error);
            setLoading(false);
        });
    }, [groupName]);

    const callMessageOut = (message) => {
        dispatch(setSnackbar(true, "error", message));
    }

    const [tableColumnExtensions] = useState([
        { columnName: 'sau', align: 'left', width: 250 },
        { columnName: 'totalFileInbox', align: 'center' },
        { columnName: 'totalCorrespondenceInbox', align: 'center', wordWrapEnabled: true },
        { columnName: 'totalFilesPendingThreeSeven', align: 'center', wordWrapEnabled: true },
        { columnName: 'totalCorrespondencePendingThreeSeven', align: 'center', wordWrapEnabled: true },
        { columnName: 'totalFilesPendingSeven', align: 'center', wordWrapEnabled: true },
        { columnName: 'totalCorrespondencePendingSeven', align: 'center', wordWrapEnabled: true },
    ]);

    const HighlightedCell = ({ column, value, row, style, ...restProps }) => (
        <Table.Cell{...restProps} style={{ cursor: 'pointer', ...style, }} onClick={(e) => handleClick(e, value, column, row)}>
            <span style={{ color: 'blue', textDecoration: 'underline' }}>{value}</span>
        </Table.Cell>
    );

    const Cell = (props) => {
        const { column, row } = props;
        if (row.totalFileInbox > 0 && column.name === "totalFileInbox") {
            return <HighlightedCell {...props} />;
        }
        if (row.totalFilesPendingThreeSeven > 0 && column.name === "totalFilesPendingThreeSeven") {
            return <HighlightedCell {...props} />;
        }
        if (row.totalFilesPendingSeven > 0 && column.name === "totalFilesPendingSeven") {
            return <HighlightedCell {...props} />;
        }
        return <Table.Cell {...props} />;
    };

    const handleClick = (e, value, column, row) => {
        let data;
        setSelectionMode(false);
        switch (column.name) {
            case "totalFileInbox":
                data = `${value} Total Files of ${row.sau}`;
                break;
            case "totalFilesPendingThreeSeven":
                data = `${value} Pending Files > 3 days & <= 7 days of ${row.sau}`;
                break;
            case "totalFilesPendingSeven":
                data = `${value} Pending Files > 7 days of ${row.sau}`;
                break;
            default:
                data = "";

        }

        setHeaderText({ "Data": data, "ColumnName": column.name, "Value": value, "SAU": row.sau });
        setTimeout(
            () => setSelectionMode(true),
            3000
        );
    };

    const getRowId = row => row.indexId;

    const TableRow = ({ row, ...restProps }) => (
        <Table.Row
            className={styles.customRow}
            {...restProps}
            {... { hover: true }}
        />
    );

    let arr1 = []
    let tempArr = []

    const handleClickBar = (val) => {
        setchartDetailShow(false)
        displaySizeIcon()
        if (val.boolVal) {
            // let ID = rowData.filter(x => val.rowID === x.indexId).map(row => row.fileId)
            // setSauData([])
            // arr1 = []
            // let temp1 = []
            // tempArr = JSON.parse(JSON.stringify(rowData));
            // temp1 = tempArr.filter(item => item.fileId === ID[0]);
            // temp1[0].parentId = null
            // arr1.push(...temp1)
            // loadData(...ID)
            setTimeout(
                () => {
                    setBargrid({ barChartSize: 2, showMisTable: true, barSize: '270px' })
                    setBlnShowClose(true)
                },
                200)

        }
    }
    const loadData = (fileID) => {
        for (let a = 0; a < rowData.length; a++) {

            if (fileID === rowData[a].parentId) {
                arr1.push(rowData[a])
                setSauData(arr1)
                loadData(rowData[a].fileId)
            }

        }
    }

    const [defaultColumnWidths] = useState([
        { columnName: 'sau', width: 140 },
        { columnName: 'totalFileInbox', width: 140 },
        { columnName: 'totalCorrespondenceInbox', width: 180 },
        { columnName: 'totalFilesPendingThreeSeven', width: 180 },
        { columnName: 'totalCorrespondencePendingThreeSeven', width: 170 },
        { columnName: 'totalFilesPendingSeven', width: 160 },
        { columnName: 'totalCorrespondencePendingSeven', width: 170 },
    ])

    
    const displaySizeIcon = (e) => {
        setBargrid({ barChartSize: 12, showMisTable: false, barSize: '500px' });
        setBlnShowClose(false);
        setchartDetailShow(true);
        showRef.current.classList.toggle("d-flex");
    }
    return (
        <Paper elevation={12} >
            <Grid container>
                <Grid item xs={barGrid.barChartSize}>
                    <Card className="mb-10 mt-16 ml-2 mr-1" elevation={5}>

                        {blnShowClose ?
                            <Tooltip title="Expand" aria-label="Expand">
                                <IconButton id="Mis_tabe_close_btn" aria-label="close" onClick={displaySizeIcon} style={{ borderRadius: '10px', color: 'rgb(0, 27, 131)', height: '35px', width: '35px' }}>
                                    <AspectRatioIcon />
                                </IconButton></Tooltip> : null}
                        <div  ref={showRef} className={`chartBox d-flex ${classes.chartBoxwidth}`}>
                            <DoughnutChart
                                height={barGrid.barSize}
                                color={[
                                    '#1395ba',
                                    '#0d3c55',
                                    '#c02e1d',
                                    '#f16c20',
                                    '#ebc844',
                                    '#a2b86c'
                                ]}
                                data={dataArr}
                                onClickBar={handleClickBar}
                                blnShowLengend={chartDetailShow}
                                barTitle='File Report'
                            />
                            <div hidden={blnHideCorresDiv}>
                                <DoughnutChart
                                    height={barGrid.barSize}
                                    color={[
                                        '#1395ba',
                                        '#0d3c55',
                                        '#c02e1d',
                                        '#f16c20',
                                        '#ebc844',
                                        '#a2b86c'
                                    ]}
                                    data={corresArr}
                                    onClickBar={handleClickBar}
                                    blnShowLengend={chartDetailShow}
                                    barTitle='Correspondence Report'
                                />
                            </div>
                        </div>
                    </Card>
                </Grid>
                <Grid item xs={10} hidden={!barGrid.showMisTable}>
                    <Card className="px-24 py-16 mb-16">
                        <DevTable rows={rowData} columns={columns} getRowId={getRowId} >
                            <TreeDataState />
                            <FilteringState />
                            <SortingState />
                            <CustomTreeData getChildRows={getChildRows} />
                            <IntegratedFiltering />
                            <IntegratedSorting />
                            <Table tableComponent={TableComponent} cellComponent={Cell} rowComponent={TableRow} columnExtensions={tableColumnExtensions} />
                            <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
                            <TableHeaderRow cellComponent={HeaderCellComponent} showSortingControls />
                            <TableFilterRow />
                            <TableTreeColumn for="sau" />
                        </DevTable>

                    </Card>
                </Grid>
                {loading && <Loading />}
            </Grid>

        </Paper>
    );
};


function mapStateToProps(state) {

    return { props: state.props };
}

export default connect(mapStateToProps, { getMISTableList })(MisTable);
