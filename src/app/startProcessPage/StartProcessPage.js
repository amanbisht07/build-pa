import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from "react-router-dom";
import GenericForm from '../views/initiate/shared/dir/GenericForm'
import {loadFormKey, loadProcessDefinitions} from '../camunda_redux/redux/action'


class StartProcessPage extends Component {
  // componentWillMount() {
  //   this.props.loadFormKey(this.props.process);

  // }

  render() {
    const { process, formKey, processInstanceStarted } = this.props

    if (!formKey && !processInstanceStarted) {
      // console.log("Key"+key+"Process"+process);
      return (
        <div>Loading Process Start Form</div>
      )
    } else if (processInstanceStarted) {
      // console.log("Key"+key+"Process"+process);
      return (this.props.modal1=false);

    } else {
      const key = formKey['undefined'].key;
      console.log("Key"+key+"Process"+process);
      return (
        <div className={"modalForm"}>

               <GenericForm formKey={key} processDefinitionKey={process} />

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
  loadFormKey
})(StartProcessPage))
