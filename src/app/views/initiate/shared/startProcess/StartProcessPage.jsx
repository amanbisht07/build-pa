import React, {Component, useEffect} from 'react'
import {connect} from 'react-redux'
import {Redirect, withRouter} from "react-router-dom";
import GenericForm from '../dir/GenericForm';
import {loadFormKey, loadProcessDefinitions, startProcessInstance} from '../../../../camunda_redux/redux/action';
import {loadInstanceVariables} from '../../../../camunda_redux/redux/action'
import CreateFileData from "../dir/createFileData";
import SendFileData from "../dir/sendFileData";
import PersonalFileData from "../dir/personalFileData";
import PersonalApplicationData from "../dir/personalApplicationData";

class StartProcessPage extends Component {
    state = {
        formId: '',
        processId: '',
        formData: {},
        fileId: '',
        mount: false
    };

    componentWillMount() {
        this.props.loadFormKey(this.props.process);

    }

    render() {
        let key ;
        const { process, formKey, processInstanceStarted, fileId } = this.props;
        let fileIdData = fileId;

        const getData = (formData) =>
        {
            this.setState({formData:formData});
            this.setState({fileId:fileIdData});
        }
        if (process === 'sampleForm')
        {
            key = 'sample'
        }
        if (process === 'sendFile')
        {
            key = 'sendFile';
        }
        if (process === 'sendFormInbox')
        {
            key = 'sendFormInbox';
        }
        if(process === 'personalFile')
        {
            key = 'personalFile';
        }
        if(process === 'personalApplication')
        {
            key = 'personalApplication';
        }

        if (!formKey && !processInstanceStarted)
        {
            return (
                <div>Loading Process Start Form</div>
            )
        }
        else if (processInstanceStarted)  {

            if (process === 'sampleForm')
            {
                let data = this.state.formData;
                if(Object.keys(data).length === 0) {
                    return (
                        <div className={"modalForm"}>
                            <GenericForm formKey={key} processDefinitionKey={process} selectData={getData}/>
                        </div>
                    )

                }
                else {
                    this.props.handleCloseEvent(false);
                    return (
                        <CreateFileData dataForm={data}/>
                    )
                }
            }
            else if(process === 'sendFile')
            {
                let data = this.state.formData;
                if(Object.keys(data).length === 0) {
                    return (
                        <div className={"modalForm"}>
                            <GenericForm formKey={key} processDefinitionKey={process} selectData={getData}/>
                        </div>
                    )

                }
                else {
                    this.props.handleCloseEvent(false);
                    let id = this.state.fileId;
                    // this.props.handleCloseEvent(false);
                    return (
                        <SendFileData dataForm={data} fileIdData={id}/>

                    )
                }
            }
            else if(process === 'sendFileInbox')
            {
                let data = this.state.formData;
                if(Object.keys(data).length === 0) {
                    return (
                        <div className={"modalForm"}>
                            <GenericForm formKey={key} processDefinitionKey={process} selectData={getData}/>
                        </div>
                    )

                }
                else {
                    this.props.handleCloseEvent(false);
                    let id = this.state.fileId;

                    return (
                        <SendFileData dataForm={data} fileIdData={id}/>

                    )
                }
            }
            else if (process === 'personalFile')
            {
                let data = this.state.formData;
                if(Object.keys(data).length === 0) {
                    return (
                        <div className={"modalForm"}>
                            <GenericForm formKey={key} processDefinitionKey={process} selectData={getData}/>
                        </div>
                    )

                }
                else {
                    this.props.handleCloseEvent(false);
                    return (
                        <PersonalFileData dataForm={data}/>
                    )
                }
            }
            else if (process === 'personalApplication')
            {
                let data = this.state.formData;
                if(Object.keys(data).length === 0) {
                    return (
                        <div className={"modalForm"}>
                            <GenericForm formKey={key} processDefinitionKey={process} selectData={getData}/>
                        </div>
                    )

                }
                else{
                    this.props.handleCloseEvent(false);
                    return (
                        <PersonalApplicationData dataForm={data}/>
                    )
                }
            }
        }
        else {
            // let key = formKey['undefined'].key;
            return (
                <div className={"modalForm"}>
                    <GenericForm formKey={key} processDefinitionKey={process} selectData={getData}/>
                </div>
            )
        }

    }

}
const mapStateToProps = (state, ownProps) => {
    const params = ownProps.match.params
    return {
        ...params,
        ...state.entities
    }
}

export default withRouter(connect(mapStateToProps, {
    loadProcessDefinitions,
    loadInstanceVariables,
    loadFormKey
})(StartProcessPage));
