import React from "react";
import {assign, map, sortBy} from "lodash";
import FromNow from "../common/from-now";
import Config from "../../tools/config";
import FilterButtonGroup from "../common/filter-button-group";
import BaseComponent from "../base-component";
const bindThis = require('../../tools/bindThis')

const STATES = ["IDLE", "PAUSED", "WORKING"]
const STATUS_CONFIG_KEY = "home.queues.empty";

export default class WorkerList extends BaseComponent {

  constructor(props) {
    super(props)
    this.state = {
      status: Config.get(STATUS_CONFIG_KEY, null),
      query: ""
    };

    this.bindThiz("onStatusFilterChange", "getWorkerRows", "doesWorkerMatchStatus", "doesWorkerMatchQuery", "onQueryChange")
  }

  onStatusFilterChange(status) {
    let current = this.state.status;

    let newStatus = current === status ? null : status;

    this.assignState({status: newStatus}, ()=> {
      Config.set(STATUS_CONFIG_KEY, newStatus);
    });
  }

  onQueryChange(query) {
    this.assignState({query: query});
  }

  getWorkerRows() {
    if (!this.props.workers) {
      return <tr></tr>
    }

    let workers = sortBy(this.props.workers, (w)=> {
      return w.state
    }).reverse();

    workers = sortBy(workers, (w)=> {
      let runAt = w.status ? new Date(w.status.runAt) : new Date()
      return runAt.getTime()
    })
    return map(workers, (worker)=> {
      if (this.doesWorkerMatchStatus(worker) && this.doesWorkerMatchQuery(worker)) {
        return <WorkerListRow worker={worker} key={`worker-row-${worker.host}-${worker.pid}`}/>
      }
    })
  }

  doesWorkerMatchStatus(worker) {
    return this.state.status === null || worker.state === this.state.status
  }

  doesWorkerMatchQuery(worker) {
    if (this.state.query === "") {
      return true
    }
    let q = this.state.query.toLowerCase()
    let hostname = worker.host.toLowerCase()
    let pid = worker.pid.toLowerCase()
    return hostname.indexOf(q) > -1 || pid.indexOf(q) > -1
  }

  render() {
    return (
      <div>
        <div className="page-header">
          <h3>Worker</h3>
        </div>
        <div className="filter-form">
          <div className="filter">
            <input className="form-control" placeholder="Search for host or pid" type="text" value={this.state.query} onChange={(e)=> {
              this.onQueryChange(e.target.value)
            }}/>
          </div>
          <div className="filter">
            <FilterButtonGroup onChange={this.onStatusFilterChange} current={this.state.status} filters={STATES}/>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <table className="table table-condensed table-striped table-hover">
              <thead>
              <tr>
                <th>Host</th>
                <th>Pid</th>
                <th>State</th>
                <th>Job</th>
                <th>Since</th>
              </tr>
              </thead>
              <tbody>
              {this.getWorkerRows()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

class WorkerListRow extends React.Component {
  render() {
    const {host, pid, state, status} = this.props.worker
    let job = ""
    let since = ""
    if (status) {
      job = status.payload.className
      since = <FromNow date={new Date(status.runAt)}/>
    }
    return (
      <tr>
        <td>{host}</td>
        <td>{pid}</td>
        <td>{state}</td>
        <td>{job}</td>
        <td>{since}</td>
      </tr>
    )
  }
}
