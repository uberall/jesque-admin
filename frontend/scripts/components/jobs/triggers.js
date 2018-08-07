import React from "react";
import BaseComponent from "../base-component";
import JesqueAdminClient from "../../tools/jesque-admin-client";
import {assign, map} from "lodash";
import TriggerListRow from "./trigger-list-row";

export default class Triggers extends BaseComponent {
  constructor(props) {
    super(props);

    this.client = new JesqueAdminClient();

    this.state = {
      list: []
    };
    this.bindThiz('doUpdate', 'getTableBody', 'deleteTrigger')

  }

  componentWillReceiveProps(props) {
    if (props.autoReload !== this.props.autoReload) {
      if (props.autoReload) {
        this.doUpdate();
        this.startAutoUpdate()
      } else {
        this.stopAutoUpdate()
      }
    }
  }

  componentDidMount() {
    this.doUpdate();
    if(this.props.autoReload) {
      this.startAutoUpdate();
    }
  }

  componentWillUnmount() {
    this.stopAutoUpdate()
  }

  startAutoUpdate() {
    this.startInterval(this.doUpdate);
  }

  stopAutoUpdate() {
    this.stopInterval();
  }

  doUpdate() {
    if (!this.state.loading) {
      this.assignState({loading: true});
      this.client.get('triggers', null, {})
        .then((resp) => {
          this.assignState({list: resp.list, total: resp.total, loading: false});
        }).catch((err)=> {
        this.assignState({loading: false});
        this.props.setAlert(err);
        this.props.changeAutoReload(false);
      })
    }
  }

  getTableBody() {
    return map(this.state.list, (trigger)=> {
      return <TriggerListRow key={trigger.name} trigger={trigger} onDelete={this.deleteTrigger}/>
    })
  }

  deleteTrigger(name) {
    this.client.delete('triggers', name, {}).then(()=> {
      this.doUpdate()
    }).catch((err)=> {
      this.props.setAlert(err)
    })
  }

  render() {
    return (
      <div>
        <div className="page-header">
          <h3>Job Triggers</h3>
          {this.state.list.length} active triggers
        </div>
        <table className="table table-condensed table-striped">
          <thead>
          <tr>
            <th>Name/JobClass</th>
            <th>Queue/Arguments</th>
            <th>Cron Expression/Next Fire Time</th>
            <th>State/Aquired By</th>
            <th/>
          </tr>
          </thead>
          <tbody>
          {this.getTableBody()}
          </tbody>
        </table>
      </div>
    )
  }
}
