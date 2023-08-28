import React, {Component, useEffect, useState} from 'react'
import {setSnackbar} from "../../../../camunda_redux/redux/ducks/snackbar";
import {connect, useDispatch} from "react-redux";
import {personalFileFormData} from "../../../../camunda_redux/redux/action";
import {changingTableState} from "../../../../camunda_redux/redux/action/apiTriggers";
import {setRefresh} from "../../../../redux/actions/RefreshActions";
import { useTranslation } from "react-i18next";

function personalFileData(props)
{
    const dispatch = useDispatch();
    let { dataForm } = props;

    const [response,setResponse] = useState('');

    useEffect(async()=>
    {
        props.personalFileFormData(dataForm).then( async (resp) => {
            console.log(resp);
                if(resp.status !== 400) {
                   await props.setRefresh(true);
                    dispatch(
                        setSnackbar(
                            true,
                            "success",
                            "Personal File Created successfully!"
                        )
                    );

                }
            let trigger = false;
                setTimeout(() => {
                    trigger = true;
                    props.changingTableState(trigger,'CHANGE_PA_FILE');
                },0);
            // }
        });

    },[]);

    return (
        <div>OK</div>
    )
}
function mapStateToProps(state) {

    return { props: state.props };
}

export default connect(mapStateToProps,{setRefresh,personalFileFormData,changingTableState})(personalFileData);
