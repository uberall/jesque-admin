import React from "react";
import FromNow from "../common/from-now";
import BaseComponent from "../base-component";
const SweetAlert = require('react-swal');

export default class TriggerListRow extends BaseComponent {

  constructor(props) {
    super(props)

    this.state = {
      shouldConfirm: false
    }

    this.bindThiz('doDelete', 'getAlert')
  }

  doDelete() {
    this.assignState({shouldConfirm: true});
  }

  getAlert() {
    if (this.state.shouldConfirm === false) {
      return ""
    }

    const {trigger, onDelete} = this.props;

    return <SweetAlert isOpen={true}
                       type="warning"
                       title="Are you sure?"
                       text={`This will delete ${trigger.name} from triggers!`}
                       confirmButtonText="Yes"
                       cancelButtonText="No"
                       callback={(confirmed)=> {
                         if (confirmed) {
                           onDelete(trigger.name)
                         } else {
                           this.assignState({shouldConfirm: false});
                         }
                       }}
    />;
  }

  render() {
    const {trigger}= this.props;

    return (
      <tr>
        <td>{trigger.jesqueJobName}</td>
        <td>{trigger.jesqueJobQueue}</td>
        <td>{trigger.cronExpression}</td>
        <td><FromNow date={new Date(trigger.trigger.nextFireTime)}/></td>
        <td>
          <button className="btn btn-danger" disabled={this.state.shouldConfirm} onClick={this.doDelete}>Delete
          </button>
          {this.getAlert()}
        </td>
      </tr>
    )
  }

}
