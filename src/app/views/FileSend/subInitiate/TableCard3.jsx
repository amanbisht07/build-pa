import React, {useEffect, useState} from "react";
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
import { Paper, Dialog, DialogContent, DialogTitle, Fab, FormControl, Grid, IconButton, Typography } from "@material-ui/core";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from "@material-ui/icons/Add";
import {PropTypes} from "prop-types";
import {connect, useDispatch} from "react-redux";
import { setSnackbar } from "../../../camunda_redux/redux/ducks/snackbar";
import {Plugin, Template} from "@devexpress/dx-react-core";
import {loadEnclosureData,uploadEnclosure,loadSfdt} from "../../../camunda_redux/redux/action";
import DeleteIcon from '@material-ui/icons/Delete';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import HeadersAndFootersView from "../../FileApproval/documentEditor/editor";
import Slide from "@material-ui/core/Slide/Slide";
import {makeStyles} from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";

const PaperComponent = (props) => {
    return (
      <Draggable handle="#draggable-dialog-title"  cancel={'.cancel-drag'}>
        <Paper {...props} />
      </Draggable>
    );
  }

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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

const TableCard3 = (props) => {
    const { t } = useTranslation()
    const classes = useStyles();
    const dispatch = useDispatch();
    // useEffect(() => {
    //     this.props.showSnackbar();
    // })
    const columns = [
        { name: "fileName", title: "#" },
        { name: "subject", title: t("enclosure_subject") },
        { name: "by", title: t("by") },
        { name: "status", title: t("status") }
    ];
    const {fileID,draftId} = props;

    const [rowData,setRowData] = useState([]);
    const [mount, setMount] = useState(false);

    let data= {};
    let fetchData = true;

    useEffect(() => {
        if(fetchData==true || mount === true) {

            props.loadEnclosureData(fileID).then(resp => {

                const tmpArr = []
                for (var i = 0; i < resp.Data.length; i++) {
                    tmpArr.push(resp.Data[i]);
                }
                setRowData(tmpArr);
                setMount(false);
                fetchData=false;

            });
        }
    },[fetchData,mount])
    const handleChange = (event) =>
    {
        console.log(bodyRows);

    }
    const LoadingState = ({ loading, columnCount }) => (
        <td colSpan={columnCount} style={{ height: '30vh', textAlign: 'center', verticalAlign: 'middle' ,fontSize:'11px',padding: '1px 1px 1px 120px'}}>
                {loading ? <CircularProgress size={28} /> : <span>No Enclosure data</span>}
                   </td>
    )
    const [selection, setSelection] = useState([1]);
    const [searchValue, setSearchState] = useState('');
    const [bodyRows, setBodyRows] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [txtfile, setFile] = React.useState(new FormData());
    const [openAlert1, setOpenAlert1] = React.useState(false);
    const [SFDT, setSFDT] = useState("");
    const [openQuickSign, setOpenQuickSign] = useState(false);
    const styles = {
        customRow: {
            '&:hover': {
                backgroundColor: 'lightgray',
            }
        },
    };
    const groupingPanelMessages = {
        groupByColumn: 'Enclosure',
    };
    const handleClickQuickSignOpen = () => {
        setOpenQuickSign(true);
    };

    const handleClickQuickSignClose = () => {
        setOpenQuickSign(false);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClick = (e,row) =>
    {
        console.log(row.enclosureFileURL);

        props.getFileURL(row.enclosureFileURL);
        props.mapPdfEnclosure(true);

        props.loadSfdt(row.enclosureFileURL)
            .then(response => {
                // let res = JSON.stringify(response);
                console.log(response);
                setSFDT(response.sfdt);
            });
    }
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
            onClick={(e) => handleClick(e,row)}
            style={{
                cursor: 'pointer'
            }}
        />
    );
    const role = sessionStorage.getItem("role");
    const username = localStorage.getItem("username");
    const CustomToolbarMarkup = () => (
        <Plugin name="customToolbarMarkup">
            <Template name="toolbarContent">
                <div style={{marginLeft: '40%', alignSelf: 'center'}}><Typography variant='button' align='center' color='primary'>{t("enclosure")}</Typography></div>
            </Template>
        </Plugin>
    );

    const handleFileClick = async e => {
        let { files } = e.target;
        console.log(files);
        let formData = new FormData();
        const tempArr=[];
        for (var i = 0; i < files.length; i++){
            formData.append('file',files[i]);
            // tempArr.push(files[i]);
        }
        setFile(formData);
        // console.log(tempArr);
        // let files  = e.target;
        // console.log(files);
        // setFile(files);
        // console.log(txtfile);
    }

    function fileRelatedData(){
        if (txtfile.length > 0) {
          return (
            <div>
                <h4>{t("file_details")}:</h4>
                {txtfile.map(item =>
                    <Typography variant="subtitle2" gutterBottom><b>{t("file_name")}: </b>{item.name} <b>Type: </b>{item.type}</Typography>
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
    const handleCloseAlert =(e) => {
        console.log(openAlert);
        setOpenAlert1(false);
    }
    const handleOnSubmit = (e) => {
        var newFile = txtfile;

        console.log(newFile);
        console.log(draftId);
        return props.uploadEnclosure(draftId,newFile,role,username).then(resp => {
            console.log("Data File Inserted :", resp.status);
            if (resp.status === "OK")
            {
                setMount(true);
                // setStatus(false);
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
                // setStatus1(false);
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
    }

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
                <IntegratedSorting/>
                <SelectionState
                    selection={selection}
                    onSelectionChange={handleChange}
                />
                <Table noDataCellComponent={() => <LoadingState columnCount={columns.length} loading={false} />} rowComponent={TableRow} />
                <TableColumnResizing defaultColumnWidths={defaultColumnWidths}/>
                <TableHeaderRow showSortingControls/>
                <Toolbar />
                <GroupingPanel />
                <CustomToolbarMarkup />
                {/*<SearchPanel />*/}
                <PagingPanel />
            </DevGrid>
            <Grid container>
                <Grid item xs={5}></Grid>
                <Grid item xs={4}>
                    <IconButton id="fileAdd_button" color="primary" aria-label="Add File" component="span" onClick={handleClickOpen}>
                        <AddCircleIcon />
                    </IconButton>
                    <IconButton id="fileEdit_button" color="primary" aria-label="Edit File" component="span" onClick={handleClickQuickSignOpen}>
                        <EditIcon />
                    </IconButton>
                    <IconButton id="fileDelete_button" color="primary" aria-label="Edit File" component="span">
                        <DeleteIcon />
                    </IconButton>
                    <IconButton id="Assignmentdone_button" color="primary" aria-label="Edit File" component="span">
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
                    <IconButton 
                    id="QuickSignClose_Button"
                    aria-label="close" onClick={handleClickQuickSignClose} style={{float: 'right', marginTop: '-4px', color: 'white'}}>
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
         <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title" onClose={handleClose}>
         {t("add_a_file")}
             <IconButton 
             id="fileClose_Button"
             aria-label="close" className="cancel-drag" onClick={handleClose} color="primary" style={{float: 'right'}}>
                 <CloseIcon />
             </IconButton>
         </DialogTitle>
         <DialogContent>
                <Grid container>
                    <Grid item xs={12}>
                        <FormControl style={{ minWidth: 500, marginBottom: "5vh", marginTop: "2vh" }}>
                            <label htmlFor="upload-file" style={{ border: "1px solid #ccc", display: "inline-block", padding: "6px 12px", cursor: "pointer", marginBottom: "5px" }}>
                                <input
                                    id="upload-file"
                                    name="upload-file"
                                    variant='outlined'
                                    multiple
                                    type="file"
                                    onChange={handleFileClick}
                                    // accept="application/vnd.ms-excel,.pdf"
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
                    <Grid item xs={12} style={{ marginBottom: "10px" }}>
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
export default connect(mapStateToProps,{loadEnclosureData,uploadEnclosure,loadSfdt})(TableCard3);
