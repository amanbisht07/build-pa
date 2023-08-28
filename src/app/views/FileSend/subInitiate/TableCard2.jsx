import React, { useEffect, useState } from "react";
import {
    FilteringState, IntegratedFiltering, PagingState, IntegratedPaging, SortingState,
    IntegratedSorting, SearchState, GroupingState, SelectionState, IntegratedGrouping,
} from "@devexpress/dx-react-grid";
import history from '../../../../history'
import {
    Grid as DevGrid,
    Table,
    TableHeaderRow,
    PagingPanel,
    Toolbar,
    TableFilterRow,
    GroupingPanel,
    SearchPanel,
    TableColumnResizing, TableSelection, TableRowDetail,
} from "@devexpress/dx-react-grid-material-ui";
import { Button, Dialog, DialogContent, DialogTitle, Fab, FormControl, Grid, IconButton, Paper, makeStyles, Typography } from "@material-ui/core";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from "@material-ui/icons/Add";
import _ from "lodash";
import {connect, useDispatch} from "react-redux";
import { setSnackbar } from "../../../camunda_redux/redux/ducks/snackbar";
import {Plugin, Template} from "@devexpress/dx-react-core";
import {loadNotingData, uploadNoting, loadSfdt} from "../../../camunda_redux/redux/action";
import DeleteIcon from '@material-ui/icons/Delete';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import HeadersAndFootersView from "../../FileApproval/documentEditor/editor";
import Slide from "@material-ui/core/Slide/Slide";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";

function PaperComponent(props) {
    return (
      <Draggable handle="#draggable-dialog-title"  cancel={'.cancel-drag'}>
        <Paper {...props} />
      </Draggable>
    );
  }

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: 'none',
    },
    divZIndex: {
        zIndex: '1500 !important',
    },
}));

const styles = {
    customRow: {
        '&:hover': {
            backgroundColor: 'lightgray',
        }
    },
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const TableCard2 =  (props) => {
    const { t } = useTranslation()
    const classes = useStyles();
    const dispatch = useDispatch();
    const columns = [
        { name: "fileName", title: "#" },
        { name: "subject", title: t("noting_subject") },
        { name: "by", title: t("by") },
        { name: "status", title: t("status") }
    ];
    const [rowData, setRowData] = useState([]);
    const [mount, setMount] = useState(false);
    let [disableAdd, setDisableAdd] = useState(false);
    let [document, setDocument] = useState("");
    const row = [
        {
            'fileName' : 'Noting_test',
            'subject' : 'Noting_Subject',
            'type' : 'Type_1',
            'createdOn' : '04-11-2020'
        }
    ];
    const {fileID, draftId} = props;

    let data= {};
    let fetchData = true;
    // useEffect(() =>{
    //     props.loadSfdt(SFDT)
    //         .then(response => {
    //             console.log(response);
    //             setDocument(response);
    //         })
    // });
    useEffect(() => {
        if(fetchData == true || mount === true) {
            props.loadNotingData(fileID).then(resp => {

                const tmpArr = []
                for (var i = 0; i < resp.Data.length; i++) {
                    tmpArr.push(resp.Data[i]);
                }

                setRowData(tmpArr);
                setMount(false);
                fetchData = false;
                console.log(tmpArr.length);
                tmpArr.length > 0 ? setDisableAdd(true) : setDisableAdd(false);
            });
        }
    },[mount,fetchData])

    const handleChange = (event) => {
        console.log(bodyRows);

    }
    const LoadingState = ({ loading, columnCount }) => (
        <td colSpan={columnCount} style={{ height: '30vh', textAlign: 'center', verticalAlign: 'middle', fontSize: '11px', padding: '1px 1px 1px 120px' }}>
            {loading ? <CircularProgress size={28} /> : <span>No Notings data</span>}
        </td>
    )
    const [selection, setSelection] = useState([1]);
    const [searchValue, setSearchState] = useState('');
    const [bodyRows, setBodyRows] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [txtfile, setFile] = React.useState([]);
    const [openQuickSign, setOpenQuickSign] = useState(false);
    const [SFDT, setSFDT] = useState("");
    const groupingPanelMessages = {
        groupByColumn: 'Notings',
    };

    const handleClose = () => {
        setOpenDialog(false);
        reset();
    };

    const handleClickOpen = () => {
        setOpenDialog(true);
    }

    const handleClick = (e, row) => {
        console.log(row.notingFileURL);
        props.getFileURL(row.notingFileURL);
        props.mapPdfNoting(true);

        props.loadSfdt(row.notingFileURL)
            .then(response => {
                // let res = JSON.stringify(response);
                console.log(response);
                setSFDT(response.sfdt);
            })
    }

    const handleClickQuickSignOpen = () => {
        setOpenQuickSign(true);
    };

    const handleClickQuickSignClose = () => {
        setOpenQuickSign(false);
    };

    const [defaultColumnWidths] = useState([
        { columnName: 'fileName', width: 120 },
        { columnName: 'subject', width: 120 },
        { columnName: 'by', width: 120 },
        { columnName: 'status', width: 120 },
    ]);
    const TableRow = ({ row, ...restProps }) => (
        <Table.Row
            className={styles.customRow}
            {...restProps}
            {... {hover: true}}
            // eslint-disable-next-line no-alert
            onClick={(e) => handleClick(e, row)}
            style={{
                cursor: 'pointer'
            }}
        />
    );

    function handleFileClick(e) {
        let files  = e.target.files[0];
        console.log(files);

        // const tempArr=[];
        // for (var i = 0; i < files.length; i++){
        //     // formData.append('file',files[i]);
        //     tempArr.push(files[i]);
        // }
        setFile(files);
        console.log(txtfile);
    }

    function fileRelatedData(){
        if (txtfile.length > 0) {
            return (
                <div>
                    <h4>{t("file_details")}:</h4>
                    {txtfile.map(item =>
                        <Typography variant="subtitle2" gutterBottom><b>{t("file_name")}: </b>{item.name} <b>{t("type")}: </b>{item.type}</Typography>
                    )}
                </div>

            );
        } else {
            return (
                <div>
                    <br />
                    <h4>{t("choose_before_pressing_the_upload_button")}</h4>
                </div>
            );
        }
    }

    function reset(){
        setFile([]);
        fileRelatedData();
    }

    const CustomToolbarMarkup = () => (
        <Plugin name="customToolbarMarkup">
            <Template name="toolbarContent">
                <div style={{marginLeft: '40%', alignSelf: 'center'}}><Typography variant='button' align='center' color='primary'>{t("noting")}</Typography></div>
            </Template>
        </Plugin>
    );
    const role = sessionStorage.getItem("role");
    const username = localStorage.getItem("username");

    const handleOnSubmit = (e) => {
        var newFile = txtfile;
        console.log(newFile);
        console.log(draftId);

        console.log(`New File `,newFile);
        const formData = new FormData()
        formData.append('file', newFile)
        return props.uploadNoting(draftId,formData,role,username).then(resp => {
            console.log("Data File Inserted :", resp.status);
            if (resp.status === "OK")
            {
                setMount(true);
                setOpenDialog(false);
                reset();
                dispatch(
                    setSnackbar(
                        true,
                        "success",
                        t("file_has_been_inserted_successfully!")
                    )
                )
            }
            else{
                setOpenDialog(false);
                reset();
                dispatch(
                    setSnackbar(
                        true,
                        "success",
                        t("file_has_been_inserted_successfully!")
                    )
                )
            }
        })
    };

    return (
        <div>
            <Paper elevation={3} style={{ position: 'relative' }}>
                <DevGrid rows={rowData} columns={columns}>
                    {/*<SearchState*/}
                    {/*    value={searchValue}*/}
                    {/*    onValueChange={setSearchState}*/}
                    {/*/>*/}
                    <IntegratedFiltering />
                    <PagingState
                        defaultCurrentPage={0}
                        pageSize={5}
                    />
                    <IntegratedPaging />
                    <SortingState />
                    <GroupingState grouping={[]} />
                    <IntegratedGrouping />
                    <IntegratedSorting />
                    <SelectionState
                        selection={selection}
                        onSelectionChange={handleChange}
                    />
                    <Table noDataCellComponent={() => <LoadingState columnCount={columns.length} loading={false} />} rowComponent={TableRow} />
                    <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
                    <TableHeaderRow showSortingControls />
                    <Toolbar />
                    <GroupingPanel />
                    <CustomToolbarMarkup />
                    {/*<SearchPanel />*/}
                    <PagingPanel />
                </DevGrid>
                <Grid container>
                    <Grid item xs={5}></Grid>
                    <Grid item xs={4}>
                        <IconButton id="add_file_button" color="primary" aria-label="Add File" component="span" onClick={handleClickOpen} disabled={disableAdd}>
                            <AddCircleIcon />
                        </IconButton>
                        <IconButton id="edit_file_button" color="primary" aria-label="Edit File" component="span" onClick={handleClickQuickSignOpen}>
                            <EditIcon />
                        </IconButton>
                        <IconButton id="delete_file_button" color="primary" aria-label="Edit File" component="span">
                            <DeleteIcon />
                        </IconButton>
                        <IconButton id="assignmentOn_button" color="primary" aria-label="Edit File" component="span">
                            <AssignmentTurnedInIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={3}></Grid>
                </Grid>
            </Paper>
            <Dialog
                open={openQuickSign}
                onClose={handleClickQuickSignClose}
                fullScreen
                aria-labelledby="quickSignDialog"
                TransitionComponent={Transition}
                className={classes.divZIndex}
            >
                <DialogContent dividers>
                    <IconButton id="quickSignClose_button" aria-label="close" onClick={handleClickQuickSignClose} style={{float: 'right', marginTop: '-4px', color: 'white'}}>
                        <CloseIcon />
                    </IconButton>
                    <HeadersAndFootersView txtSfdt = {SFDT}/>
                </DialogContent>
            </Dialog>
            <Dialog
                open={openDialog}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle id="draggable-dialog-title" onClose={handleClose} style={{ cursor: 'move' }}>
                {t("add_a_file")}
                    <IconButton
                    id="fileClose_button"
                    aria-label="close" onClick={handleClose} className="cancel-drag" color="primary" style={{ float: 'right' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={12}>
                            <FormControl style={{minWidth: 500, marginBottom: "5vh", marginTop: "2vh"}}>
                                <label htmlFor="file" style={{border: "1px solid #ccc",display: "inline-block", padding: "6px 12px", cursor: "pointer", marginBottom: "5px"}}>
                                    <input
                                        id="file"
                                        name="file"
                                        variant='outlined'
                                        type="file"
                                        onChange={handleFileClick}
                                        accept="application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    />
                                </label>
                                <Fab
                                    color="secondary"
                                    size="small"
                                    component="span"
                                    aria-label="add"
                                    variant="extended"
                                    onClick={handleOnSubmit}
                                >
                                    <AddIcon /> {t("upload_file")}
                                </Fab>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} style={{marginBottom: "10px"}}>
                            {fileRelatedData()}
                        </Grid>
                    </Grid>
                </DialogContent>
                {/* <DialogActions>
                 <Button autoFocus onClick={this.handleClose} color="primary">
                     Cancel
                 </Button>
             </DialogActions> */}
            </Dialog>
        </div>
    );
};
function mapStateToProps(state) {

    return { props: state.props };
}
export default connect(mapStateToProps,{loadNotingData,uploadNoting,loadSfdt})(TableCard2);
