import React from "react";
import {assign, map, sortBy} from "lodash";
import FromNow from "../common/from-now";
import Config from "../../tools/config"
const bindThis = require('../../tools/bindThis')
const cx = require('classnames')

const STATES = ["IDLE", "PAUSED", "WORKING"]

export default class WorkerList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      status: Config.get('homeWorkerStatus'),
      query: ""
    }
    bindThis(this, "onStatusFilterChange", "getWorkerRows", "doesWorkerMatchStatus", "doesWorkerMatchQuery", "onQueryChange")
  }

  onStatusFilterChange(status) {
    let current = this.state.status
    let newStatus
    if (current === status) {
      newStatus = null
    } else {
      newStatus = status
    }
    Config.set('homeWorkerStatus', newStatus)
    this.setState(assign(this.state, {status: newStatus}))
  }

  onQueryChange(query) {
    this.setState(assign(this.state, {query: query}))
  }

  getWorkerRows() {
    if (!this.props.workers) {
      return <tr></tr>
    }
    let workers = sortBy(this.props.workers, (w)=> {
      return w.state.name
    }).reverse()
    workers = sortBy(workers, (w)=> {
      let d
      if(w.status) {
        d = new Date(w.status.runAt)
      } else {
        d = new Date()
      }
      return d.getTime()
    })
    return map(workers, (worker)=> {
      if (this.doesWorkerMatchStatus(worker) && this.doesWorkerMatchQuery(worker)) {
        return <WorkerListRow worker={worker} key={`worker-row-${worker.host}-${worker.pid}`}/>
      }
    })
  }

  doesWorkerMatchStatus(worker) {
    return this.state.status === null || worker.state.name === this.state.status
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
        <div className="row">
          <div className="col-sm-6">
            <input className="form-control" placeholder="Search for host or pid" type="text" value={this.state.query} onChange={(e)=>{this.onQueryChange(e.target.value)}}/>
          </div>
          <div className="col-sm-6">
            <FilterButtonGroup onChange={this.onStatusFilterChange} current={this.state.status}/>
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

class FilterButtonGroup extends React.Component {

  getFilterButtons() {
    return map(STATES, (state) => {
      let buttonClasses = cx('btn', {"btn-success": this.props.current === state, "btn-default": this.props.current !== state})
      return (<button key={state} type="button" className={buttonClasses} onClick={()=>{this.props.onChange(state)}}>{state}</button>)
    })
  }

  render() {
    return (
      <div className="btn-group" role="group" aria-label="Worker State Filter">
        {this.getFilterButtons()}
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
        <td>{state.name}</td>
        <td>{job}</td>
        <td>{since}</td>
      </tr>
    )
  }
}
