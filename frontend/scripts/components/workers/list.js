import React from "react";
import Select from 'react-select';
import BaseComponent from "../base-component";
import JesqueAdminClient from "../../tools/jesque-admin-client";
import {map, sortBy, find} from "lodash";
import Config from "../../tools/config";
import WorkerListRow from "./list-row";
import FilterButtonGroup from "../common/filter-button-group";
import WorkerDetails from "./details";
import {WorkerStats} from "./stats";

const cx = require("classnames");
const SweetAlert = require('react-swal');
const STATES = ["IDLE", "PAUSED", "WORKING"];

export default class WorkerList extends BaseComponent {

  constructor(props) {
    super(props);
    this.client = new JesqueAdminClient();

    this.state = {
      list: null,
      channels: null,
      selectedChannel: null,
      loading: false,
      total: 0,
      selected: null,
      max: 25,
      currentPage: props.page,
      confirmClearAll: false,
      status: Config.get('homeWorkerStatus'),
      query: "",
      workerToDelete: null
    };
    this.bindThiz('doUpdate', 'getTableHeaders', 'getTableRows', 'onQueryChange', 'onStatusFilterChange', 'resumeAll', 'pauseAll', 'channelSelected', 'pauseChannel', 'resumeChannel');
  }

  componentDidMount() {
    this.doUpdate();
    if (this.props.autoReload) {
      this.startAutoUpdate();
    }
  }

  componentWillUnmount() {
    this.stopAutoUpdate()
  }

  componentWillReceiveProps(props) {
    if (props.autoReload != this.props.autoReload) {
      if (props.autoReload) {
        this.doUpdate();
        this.startAutoUpdate()
      } else {
        this.stopAutoUpdate()
      }
    }
  }

  startAutoUpdate() {
    this.startInterval(this.doUpdate);
  }

  stopAutoUpdate() {
    this.stopInterval()
  }

  doUpdate() {
    const {loading, selected} = this.state;
    if (!loading) {
      this.client.get('workers')
        .then((resp)=> {
          let newSelected = null;
          if (selected) {
            const selectedKey = `${selected.host}-${selected.pid}`;
            newSelected = find(resp.list, (worker)=> {
              return `${worker.host}-${worker.pid}` === selectedKey;
            });
          }
          this.assignState({list: resp.list, channels: resp.channels, selected: newSelected})
        })
        .catch(err=> {
          this.props.setAlert(err);
          this.props.changeAutoReload(false);
        })
    }
  }

  doesWorkerMatchStatus(worker) {
    return !this.state.status || worker.state === this.state.status
  }

  doesWorkerMatchQuery(worker) {
    if (this.state.query === "") {
      return true
    }
    let q = this.state.query.toLowerCase();
    let hostname = worker.host.toLowerCase();
    let pid = worker.pid.toLowerCase();
    return hostname.indexOf(q) > -1 || pid.indexOf(q) > -1
  }

  getTableHeaders() {
    let {selected} = this.state;
    let headers = [
      (<th key="table-header-host">Host</th>),
      (<th key="table-header-pid">Pid</th>)
    ];

    if (!selected) {
      headers.push(<th key="table-header-state">State</th>);
      headers.push(<th key="table-header-job">Job</th>);
      headers.push(<th key="table-header-since">Since</th>);
      headers.push(<th key="table-header-queues">Queues</th>);
      headers.push(<th key="table-header-actions"/>);
    }

    return headers
  }

  onQueryChange(query) {
    this.assignState({query: query})
  }

  onStatusFilterChange(status) {
    let current = this.state.status;
    let newStatus;
    if (current === status) {
      newStatus = null
    } else {
      newStatus = status
    }
    Config.set('homeWorkerStatus', newStatus);
    this.assignState({status: newStatus})
  }

  getTableRows() {
    const {list, selected} = this.state;
    if (!list) {
      return <tr/>
    }
    let workers = sortBy(list, (w)=> {
      return w.state
    }).reverse();

    workers = sortBy(workers, (w)=> {
      const date = w.status ? new Date(w.status.runAt) : new Date();
      return date.getTime()
    });

    return map(workers, (worker)=> {
      if (this.doesWorkerMatchStatus(worker) && this.doesWorkerMatchQuery(worker)) {
        return <WorkerListRow
          key={`worker-row-${worker.host}-${worker.pid}`}
          worker={worker}
          selected={selected}
          selectable={this.props.selectable}
          onClick={() => {
            this.selectWorker(worker)
          }}
          onDelete={()=> {
            this.assignState({workerToDelete: worker})
          }}
        />
      }
    })
  }

  selectWorker(worker) {
    let selected = this.state.selected;
    if (selected && worker &&
      `${worker.host}-${worker.pid}` === `${selected.host}-${selected.pid}`) {
      this.assignState({selected: null});
    } else {
      this.assignState({selected: worker});
    }
  }

  getWorkerDeleteAlert() {
    const {workerToDelete} = this.state;
    if (!workerToDelete) {
      return ""
    }

    return <SweetAlert
      isOpen={true}
      type="error"
      title="Are you sure?"
      text={`This will delete ${workerToDelete.host}-${workerToDelete.pid} from the List! It will not stop the worker from working!`}
      confirmButtonText="Yes"
      cancelButtonText="No"
      callback={(confirmed)=> {
        if (confirmed) {
          this.deleteWorker(workerToDelete)
        } else {
          this.assignState({workerToDelete: null})
        }
      }}
    />
  }

  deleteWorker(worker) {
    this.client.delete("workers", worker.name, {}).then(()=> {
      this.assignState({workerToDelete: null, selected: null}, this.doUpdate)
    })
  }

  pauseAll() {
    this.client.get('workers', 'pause', {}).then(()=> {
      this.doUpdate()
    })
  }

  pauseChannel() {
    let selectedChannel = this.state.selectedChannel;
    if (!selectedChannel) {
      return
    }
    this.client.get('workers', 'pause/' + selectedChannel, {}).then(()=> {
      this.doUpdate()
    })
  }

  resumeAll() {
    this.client.get('workers', 'resume', {}).then(()=> {
      this.doUpdate()
    })
  }

  resumeChannel() {
    let selectedChannel = this.state.selectedChannel;
    if (!selectedChannel) {
      return
    }
    this.client.get('workers', 'resume/' + selectedChannel, {}).then(()=> {
      this.doUpdate()
    })
  }

  buildReactSelectOptions(list) {
    return map(list, (l) => {
      return {value: l, label: l}
    })
  }

  channelSelected(channel) {
    let selectedChannel = null;
    if (channel) {
      selectedChannel = channel.value;
    }
    this.assignState({selectedChannel: selectedChannel});
  }

  render() {
    let {selected, query, status, list, channels, selectedChannel} = this.state;
    let channelOptions = this.buildReactSelectOptions(channels);
    return (
      <div className="worker-list-container">
        <div className="page-header">
          <h3>Workers</h3>
          <WorkerStats workers={list}/>
          {this.getWorkerDeleteAlert()}
        </div>
        <div className="filter-form">
          <div className="filter">
            <input className="form-control" placeholder="Search for host or pid" type="text" value={query} onChange={(e)=> {
              this.onQueryChange(e.target.value)
            }}/>
          </div>
          <div className="filter">
            <FilterButtonGroup onChange={this.onStatusFilterChange} current={status} filters={STATES}/>
          </div>
          <div className="filter">
              <Select
                name="channels"
                placeholder="Choose channel..."
                options={channelOptions}
                value={selectedChannel}
                onChange={this.channelSelected}
              />
          </div>
          <div className="filter">
            <div className="btn-group">
              <button className="btn btn-default" onClick={this.pauseChannel}><i className="fa fa-pause"/>&nbsp;Pause Channel</button>
              <button className="btn btn-default" onClick={this.resumeChannel}><i className="fa fa-play"/>&nbsp;Resume Channel</button>
            </div>
          </div>
          <div className="filter">
            <div className="btn-group">
              <button className="btn btn-default" onClick={this.pauseAll}><i className="fa fa-pause"/>&nbsp;Pause All</button>
              <button className="btn btn-default" onClick={this.resumeAll}><i className="fa fa-play"/>&nbsp;Resume All</button>
            </div>
          </div>
        </div>
        <div className="worker-list-content">
          <div className='list'>
            <table className="table table-striped table-hover">
              <thead>
              <tr>
                {this.getTableHeaders()}
              </tr>
              </thead>
              <tbody>
                {this.getTableRows()}
              </tbody>
            </table>
          </div>
          <div className={cx('details', {'visible': !!selected})}>
            <WorkerDetails
              worker={selected}
              onClose={()=> {
                this.assignState({selected: null})
              }}
              onDelete={()=> {
                this.assignState({workerToDelete: selected})
              }}
            />
          </div>
        </div>
      </div>
    )
  }

}
