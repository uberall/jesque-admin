import React from "react";
import BaseComponent from "../base-component";
import {assign, map, clone, each} from "lodash";
import JesqueAdminClient from "../../tools/jesque-admin-client";
const ReactSelect = require('react-select');
const cx = require('classnames');

const DEFAULT_STATE = {
  jobs: [],
  selectedJob: null,
  queues: null,
  selectedQueue: null,
  loading: true,
  success: null,
  errorMessage: null
};

export default class WorkerManual extends BaseComponent {
  constructor(props) {
    super(props);

    this.client = new JesqueAdminClient();

    this.state = clone(DEFAULT_STATE);
    this.bindThiz('getJobs', 'getQueues', 'jobSelected', 'queueSelected', 'reset', 'onFormSubmit', 'getAlert')
  }

  componentDidMount() {
    this.reset()
  }

  reset() {
    this.setState(clone(DEFAULT_STATE));
    setTimeout(this.getJobs, 200);

  }

  getJobs() {
    this.setState(assign(this.state, {loading: true}));
    this.client.get('jobs', null, {max: 500, offset: 0})
      .then((resp) => {
        this.setState(assign(this.state, {jobs: resp.list}));
        this.getQueues();
      }).catch((err)=> {
      window.setError(err);
    })
  }

  getQueues() {
    this.setState(assign(this.state, {loading: true}));
    this.client.get('queues', null, {max: 500, offset: 0})
      .then((resp) => {
        let queues = [];
        resp.queues.forEach((queue)=> {
          if (queue.name !== 'JesqueDefaultQueue') {
            queues.push(queue.name)
          }
        });
        this.setState(assign(this.state, {queues: queues, loading: false}));
      }).catch((err)=> {
      window.setError(err);
    })
  }

  onFormSubmit(e) {
    e.preventDefault();
    this.setState(assign(this.state, {loading: true}));
    this.client.post('workers', null, {job: this.state.selectedJob, queue: this.state.selectedQueue})
      .then((resp) => {
        if (resp.status === 'OK') {
          this.setState(assign(this.state, {loading: false, success: true}));
        } else {
          this.setState(assign(this.state, {loading: false, success: false, errorMessage: resp.message}));
        }
      }).catch(()=> {
      this.setState(assign(this.state, {loading: false, success: false}));
    })
  }

  buildReactSelectOptions(list) {
    return map(list, (l) => {
      return {value: l, label: l}
    })
  }

  jobSelected(job) {
    let selected = null;
    if (job) {
      selected = job.value;
    }
    this.setState(assign(this.state, {selectedJob: selected}))
  }

  queueSelected(queue) {
    let selected = null;
    if (queue) {
      selected = queue.value;
    }
    this.setState(assign(this.state, {selectedQueue: selected}))
  }

  getAlert() {
    const success = this.state.success;
    if (success === null) {
      return ""
    }
    let text = this.state.errorMessage || "Worker could not be started!";
    if (success) {
      text = "Worker Started";
    }
    return (
      <div className={cx('alert', {"alert-success": success, "alert-danger": !success})}>{text}</div>
    )
  }

  render() {
    const {jobs, queues, selectedJob, selectedQueue, loading} = this.state;
    return (
      <div className="job-manual">
        <div className="page-header">
          <h3>Enqueue Job Manually</h3>
        </div>
        {this.getAlert()}
        <form onSubmit={this.onFormSubmit} className={cx({disabled: loading})}>
          <div className="form-group">
            <label htmlFor="jobs">Job</label>
            <ReactSelect
              name="jobs"
              clearable={true}
              value={selectedJob}
              options={this.buildReactSelectOptions(jobs)}
              onChange={this.jobSelected}
              disabled={loading}/>
          </div>
          <div className="form-group">
            <label htmlFor="queues">Queue</label>
            <ReactSelect
              name="queues"
              clearable={true}
              value={selectedQueue}
              disabled={!selectedJob || loading}
              options={this.buildReactSelectOptions(queues)}
              onChange={this.queueSelected}/>
          </div>
          <div className="btn-group">
            <button type="reset" className="btn btn-danger" onClick={this.reset}>Reset</button>
            <button type="submit" className="btn btn-success">Start</button>
          </div>
        </form>
      </div>
    )
  }

}
