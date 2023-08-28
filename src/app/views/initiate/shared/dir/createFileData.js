import React, {Component, useEffect, useState} from 'react'
import {setSnackbar} from "../../../../camunda_redux/redux/ducks/snackbar";
import {connect, useDispatch} from "react-redux";
import {createFormData} from "../../../../camunda_redux/redux/action";
import {setRefresh} from "../../../../redux/actions/RefreshActions";

function CreateFileData(props)
{
    const dispatch = useDispatch();
    let { dataForm } = props;

    const [response,setResponse] = useState('');

    useEffect(async()=>
    {
        props.createFormData(dataForm).then(resp => {
            console.log(resp);
            if (resp.status === 'OK') {
                dispatch(
                    setSnackbar(
                        true,
                        "success",
                        "File Created successfully!"
                    )
                )

                // props.setRefresh(true);
            }
        });

    },[]);

    return (
        <div>OK</div>
    )
}
function mapStateToProps(state) {

    return { props: state.props };
}

export default connect(mapStateToProps,{setRefresh,createFormData})(CreateFileData);
