import React from "react";
import BaseComponent from "../base-component";
import {assign, map, clone, each} from "lodash";
import JesqueAdminClient from "../../tools/jesque-admin-client";
import {Creatable} from "react-select";
const ReactSelect = require('react-select');
const cx = require('classnames');

const DEFAULT_STATE = {
  jobs: [],
  selectedJob: null,
  queues: null,
  selectedQueue: null,
  args: {},
  loading: true,
  success: null
};

export default class JobManual extends BaseComponent {
  constructor(props) {
    super(props);

    this.client = new JesqueAdminClient();

    this.state = clone(DEFAULT_STATE);
    this.bindThiz('getJobs', 'getQueues', 'jobSelected', 'queueSelected', 'getArgumentInputs', 'reset', 'onFormSubmit', 'getAlert')
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
    let args = map(this.state.args, (arg)=> {
      return this.guessValue(arg);
    });
    this.setState(assign(this.state, {loading: true}));
    this.client.post('jobs', null, {job: this.state.selectedJob, queue: this.state.selectedQueue, args: args})
      .then((resp) => {
        this.setState(assign(this.state, {loading: false, success: resp.success}));
      }).catch(()=> {
      this.setState(assign(this.state, {loading: false, success: false}));
    })
  }

  guessValue(val) {
    if (!isNaN(val)) {
      return parseFloat(val)
    }

    if (val === 'true') {
      return true
    } else if (val === 'false') {
      return false
    }
    return val
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
    let queues = JSON.parse(JSON.stringify(this.state.queues)) // quick and dirty copy to maintain immutability
    let selectedQueue = null;
    if (queue) {
      selectedQueue = queue.value;
    }
    if (selectedQueue && queues.indexOf(selectedQueue) == -1) {
      queues.push(selectedQueue)
    }
    this.setState(assign(this.state, {selectedQueue, queues}))
  }

  onArgumentChange(i, text) {
    let current = clone(this.state.args);
    if (text === undefined) {
      delete current[i]
    } else {
      current[i] = text;
    }
    this.setState(assign(this.state, {args: current}))
  }

  getArgumentInputs() {
    let inputs = [];
    let idx = 1;
    each(this.state.args, (arg, i)=> {
      inputs.push(this.getArgInput(i, arg));
      idx = i;
    });
    idx++;
    inputs.push(this.getArgInput(idx, ""));
    return inputs
  }

  getArgInput(i, val) {
    return (
      <input
        className="form-control"
        type="text"
        key={`argument-${i}`}
        value={val}
        onChange={(e)=> {
          this.onArgumentChange(i, e.target.value)
        }}
        onBlur={(e)=> {
          if (!e.target.value) {
            this.onArgumentChange(i, undefined)
          }
        }}
      />
    )
  }

  getAlert() {
    const success = this.state.success;
    if (success === null) {
      return ""
    }
    let text = "Job Could not be enqueued";
    if (success) {
      text = "Job Successfully enqueued";
    }
    return (
      <div className={cx('alert', {"alert-success": success, "alert-danger": !success})}>{text}</div>
    )
  }

  render() {
    const {jobs, queues, selectedJob, selectedQueue, args, loading} = this.state;
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
            <Creatable
              name="queues"
              clearable={true}
              value={selectedQueue}
              disabled={!selectedJob || loading}
              options={this.buildReactSelectOptions(queues)}
              onChange={this.queueSelected}
            />
          </div>
          <div className="form-group">
            <label htmlFor="args">Arguments</label>
            {this.getArgumentInputs()}
          </div>
          <div className="btn-group">
            <button type="reset" className="btn btn-danger" onClick={this.reset}>Reset</button>
            <button type="submit" className="btn btn-success">Enqueue</button>
          </div>
        </form>
      </div>
    )
  }

}
