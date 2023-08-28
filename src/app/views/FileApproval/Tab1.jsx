import React, {useState} from "react";
import PDFViewer from '../../pdfViewer/pdfViewer';
import Table4 from './Table4';
import Table5 from './Table5';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { yellow } from '@material-ui/core/colors';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
    TableCell,
    Grid,
    Typography,
    withStyles,
    Divider,
    Paper,
    Button,
    ButtonGroup,
    Card, DialogTitle, DialogContent, Dialog,
} from "@material-ui/core";

import AutorenewIcon from '@material-ui/icons/Autorenew';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import history from "../../../history";
import HeadersAndFootersView from "./documentEditor/editor";
import StartProcessPage from "../initiate/shared/startProcess/StartProcessPage";
import Slide from '@material-ui/core/Slide';
import CloseIcon from '@material-ui/icons/Close';
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";

function PaperComponent(props) {
    return (
      <Draggable handle="#draggable-dialog-title"  cancel={'.cancel-drag'}>
        <Paper {...props} />
      </Draggable>
    );
  }

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: '#3a4abb',
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 12,
    },
}))(TableCell);

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    wrapIcon:{
        display:'inline-flex'
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    margin: {
        margin: theme.spacing(1),

    },
    tableAlignment: {
        width: '50%'
    },
    mainDiv: {
        display: 'flex'
    },
    divZIndex: {
        zIndex: '1500 !important',
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Tab1 = (props) => {
    const { t } = useTranslation()
    let { currentData } = props;
    let newData = JSON.parse(currentData);
    const [selectedRow,setSelectedRow]=React.useState(null);
    const [selectedRow1,setSelectedRow1]=React.useState(null);
    const [open, setOpen] = useState(false);
    const [openQuickSign, setOpenQuickSign] = useState(false);
    const [draftId, setDraftId] = useState(newData['id']);

    const classes = useStyles();

    const NavigateToFileSend = () => {
        console.log(currentData);
        let data = JSON.parse(currentData);
        history.push({ pathname: "/costa/file/send", state: data });
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCloseEvent = (e) => {
        setOpen(e);
    };

    const handleClickQuickSignOpen = () => {
        setOpenQuickSign(true);
    };

    const handleClickQuickSignClose = () => {
        setOpenQuickSign(false);
    };

    return (
        <Card elevation={3} className="pt-20 mb-24">
            <Grid container>
            <Grid item xs={3}>
                    <Typography Typography variant="caption" display="block" gutterBottom>
                        {t("file")}#:
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="caption" display="block" gutterBottom>
                        {t("subject")}:
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="caption" display="block" gutterBottom>
                        {t("classification")}:
                    </Typography>
                </Grid>
                <Grid item xs={3} alignContent='flex-end'>
                    <IconButton 
                    id="file_NavigateToFileSend"
                    aria-label="delete" className={classes.margin} onClick={NavigateToFileSend}>
                        <VisibilityIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={4}>
                    {
                        <PDFViewer file={selectedRow?.file}/>

                    }
                </Grid>
                <Grid item xs={4}>
                    {
                        <PDFViewer file={selectedRow1?.file}/>

                    }
                </Grid>
                <Grid item xs={4} direction='column'>
                    <div className={classes.mainDiv}>
                        <div className={classes.tableAlignment}>
                            <Tooltip title="Refresh">
                                <IconButton id="file_autoRenew" aria-label="Refresh">
                                    <AutorenewIcon style={{color:"blue"}}/>
                                </IconButton>
                            </Tooltip>
                            <Divider/>
                            <Typography variant='button' align='center' color='primary'>Noting</Typography>
                            <Paper>
                                <Table4
                                    selectedRow={selectedRow}
                                    setSelectedRow={setSelectedRow}

                                />
                            </Paper>
                        </div>
                        <div className={classes.tableAlignment}>
                        <Button id="file_yellow_note" variant="contained" color="secondary" style={{margin:"6px"}}>
                                {t("yellow_note")}
                            </Button>
                            <Divider/>
                            <Typography variant='button' align='center' color='primary'>{t("enclosure")}</Typography>
                            <Paper>
                                <Table5
                                    selectedRow1={selectedRow1}
                                    setSelectedRow1={setSelectedRow1}

                                />
                            </Paper>
                        </div>
                    </div>
                    <Paper className={classes.paper}>
                        <Button id="fileApproval_sign" variant="contained" color="primary" onClick={handleClickQuickSignOpen}>
                        {t("quick_sign")}
                        </Button>
                    </Paper>
                </Grid>

            </Grid>
            <Dialog
                open={openQuickSign}
                onClose={handleClickQuickSignClose}
                fullScreen
                aria-labelledby="quickSignDialog"
                TransitionComponent={Transition}
                className={classes.divZIndex}
            >
                <DialogContent dividers>
                    <IconButton id="fileApprval_close_button" aria-label="close" onClick={handleClickQuickSignClose} style={{float: 'right', marginTop: '-4px', color: 'white'}}>
                        <CloseIcon />
                    </IconButton>
                    <HeadersAndFootersView />
                </DialogContent>
            </Dialog>
            <Dialog
                open={open}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
                maxWidth='md'
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title" onClose={handleClose}>
                {t("forward_file_for_review_approval")}
                    <IconButton id="file_for_review_approval_closeBtn" className="cancel-drag" aria-label="close" onClick={handleClose} color="primary" style={{float: 'right'}}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <StartProcessPage process={'sendFormInbox'} fileId={draftId} handleCloseEvent={handleCloseEvent}/>
                </DialogContent>
            </Dialog>
            <Grid container justifyContent='center' className="mb-10">
                <ButtonGroup variant="contained" color="primary" aria-label="outlined footer primary button group">
                <Button  id="fileApproval_send" onClick={handleClickOpen}>{t("send")}</Button>
                    <Button id="fileApproval_close_file">{t("close_file")}</Button>
                    <Button id="fileApproval_link_files">{t("link_files")}</Button>
                    <Button id="fileApproval_eric">{t("eric")}</Button>
                    <Button id="fileApproval_action_points">{t("action_point")}</Button>
                    <Button id="fileApproval_download">{t("download")}</Button>
                </ButtonGroup>
            </Grid>
        </Card>
    );
};

export default Tab1;
