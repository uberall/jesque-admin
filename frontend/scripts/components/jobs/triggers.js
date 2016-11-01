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
    if (props.autoReload != this.props.autoReload) {
      if (props.autoReload) {
        this.doUpdate()
        this.startAutoUpdate(false)
      } else {
        this.stopAutoUpdate(false)
      }
    }
  }

  componentDidMount() {
    this.startAutoUpdate();
    this.doUpdate()
  }

  componentWillUnmount() {
    this.stopAutoUpdate()
  }

  startAutoUpdate(propagate) {
    this.startInterval(this.doUpdate, 5000);
    if (propagate) {
      this.props.changeAutoReload(true);
    }
  }

  stopAutoUpdate(propagate) {
    this.stopInterval();
    if (propagate) {
      this.props.changeAutoReload(false);
    }
  }

  doUpdate() {
    if (!this.state.loading) {
      this.assignState({loading: true});
      this.client.get('triggers', null, {})
        .then((resp) => {
          this.assignState({list: resp.list, total: resp.total, loading: false});
        }).catch((err)=> {
        this.stopAutoUpdate();
        window.setError(err);
        this.assignState({loading: false});
      })
    }
  }

  getTableBody() {
    return map(this.state.list, (trigger)=> {
      return <TriggerListRow key={trigger.name} trigger={trigger} onDelete={this.deleteTrigger}/>
    })
  }

  deleteTrigger(name) {
    this.client.delete('triggers', name, {}).then((resp)=> {
      this.doUpdate()
    }).catch((err)=> {
      //HANDLE
    })
  }

  render() {
    return (
      <div>
        <div className="page-header">
          <h3>Job Triggers</h3>
        </div>
        <table className="table table-condensed table-striped">
          <thead>
          <tr>
            <th>Job</th>
            <th>Queue</th>
            <th>Cron Expression</th>
            <th>Next Fire Time</th>
            <th></th>
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
