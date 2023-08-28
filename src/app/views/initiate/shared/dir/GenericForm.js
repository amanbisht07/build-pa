import React, {Component} from 'react'
import * as FormTypes from '../dir/forms'
import {completeTask, loadTaskVariables, startProcessInstance} from '../../../../camunda_redux/redux/action'
import {connect} from 'react-redux'

class GenericForm extends Component {
    componentDidUpdate(prevProps, prevState) {
        if (!this.state || !this.state.loading) {
            this.loadExistingVariables()
        }
    }
    state = {
        valueF:[],

    }

    render() {
        const { formKey, processDefinitionKey, taskId } = this.props
        const Form = FormTypes[processDefinitionKey][formKey]


        if (taskId == null) {
            return (
                <div className="generic-form">
                    <Form onSubmit={(values,dispatch) => this.handleStartInstance(values,dispatch)} />
                </div>
            )
        }
        else
            {
            return (
                <div className="generic-form">
                    <Form onSubmit={(values, dispatch) => this.handleComplete(values, dispatch)} />
                </div>
            )
        }
    }

    loadExistingVariables() {
        let { form, dispatch, taskId } = this.props

        if (form) {
            this.setState({ loading: true });
            dispatch(loadTaskVariables(taskId, form.registeredFields))
        }

    }

    handleComplete(values, dispatch) {
        values = this.getBody(values)

        return dispatch(completeTask(this.props.taskId, values));
    }

    handleStartInstance(values,dispatch) {
        let {process} = this.props;
        let name = localStorage.getItem("username");
        let roleName = sessionStorage.getItem("role");
         values.userName = name;
         values.roleName = roleName;
        //values.userName = name.displayName;
       /* if (process === 'sampleForm'){
            values.department = name.group;
        }*/
        let data = JSON.stringify(values);
        Object.keys(data).forEach(function(key){
            delete data['policyFile'];
        });
        console.log("Process Values: "+data);
        this.props.selectData(data);
        values = this.getBody(values);
        return dispatch(startProcessInstance(this.props.processDefinitionKey, values));
    }

    getBody(values) {
        let variables = {}
        Object.keys(values).forEach((item) => {
            variables[item] = {'value': values[item]}
        });
        return {
            'variables': variables
        }
    }
}

export default connect(
    state => ({})
)(GenericForm)
