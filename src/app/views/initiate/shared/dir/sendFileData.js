import React, {Component, useEffect, useState} from 'react'
import {connect, useDispatch} from "react-redux";
import {sendFile,sendFiles} from "../../../../camunda_redux/redux/action";
import {setSnackbar} from "../../../../camunda_redux/redux/ducks/snackbar";
import {setRefresh} from "../../../../redux/actions/RefreshActions";
import {changingTableStatePA,changeTableStateDraft} from '../../../../camunda_redux/redux/action/apiTriggers';

function SendFileData(props)
{
    let { dataForm, fileIdData } = props;
    const dispatch = useDispatch();
    const role = sessionStorage.getItem("role");
    const username = localStorage.getItem("username");
    useEffect(()=>
    {
        let mounted = true;
        if(mounted) {
            props.sendFiles(fileIdData, dataForm, role, username).then(resp => {
                console.log(resp);
                if (resp.status === 'OK') {
                    dispatch(
                        setSnackbar(
                            true,
                            "success",
                            "File Sent successfully!"
                        )
                    )
                    let trigger = false;
                    setTimeout(() => {
                        trigger = true;
                        props.changingTableStatePA(trigger,'CHANGE_PA_APPLICATION');
                        props.changeTableStateDraft(trigger,'CHANGE_PA_DRAFT');
                    },0);
                }
                

            }).catch((error) => {
                console.log(error)
            });
            return () => mounted = false;
        }
    },[]);

    return (
        <div>OK</div>
    )
}
function mapStateToProps(state) {

    return { props: state.props };
}

export default connect(mapStateToProps,{setRefresh,sendFiles, changingTableStatePA, changeTableStateDraft})(SendFileData);
