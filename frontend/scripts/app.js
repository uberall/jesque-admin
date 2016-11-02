import React from "react";
import ReactDom from "react-dom";
import Navbar from "./components/navbar/navbar";
import HomeView from "./components/home/home";
import QueueDetails from "./components/queues/details";
import FailedList from "./components/jobs/failed";
import {HOME, JOB_FAILED, JOBS_LIST, JOB_ENQUEUE, JOB_TRIGGERS, WORKER_LIST, WORKER_MANUAL} from "./constants/paths";
import JobsList from "./components/jobs/list";
import JobDetails from "./components/jobs/details";
import JobManual from "./components/jobs/manual";
import Triggers from "./components/jobs/triggers";
import WorkerList from "./components/workers/list";
import WorkerManual from "./components/workers/manual";
import _ from "lodash";
import Config, {DEFAULT_INTERVAL} from "./tools/config";

const RouterMixin = require('react-mini-router').RouterMixin;
const navigate = require('react-mini-router').navigate;
const querystring = require('querystring');

var JesqueAdminApp = React.createClass({
  mixins: [RouterMixin],

  routes: {
    '/': 'home',
    '/404': 'notFound',
    '/queues/:name': 'queueDetails',
    '/jobs/enqueue/': 'enqueueJob',
    '/jobs/triggers/': 'triggers',
    '/jobs/failed/': 'failedJobs',
    '/jobs/': 'jobsList',
    '/jobs/:name': 'jobsDetails',
    '/workers': 'workerList',
    '/workers/start': 'workerManual',
  },

  componentDidMount: function () {

    if (!Config.get(DEFAULT_INTERVAL, null)) {
      Config.set(DEFAULT_INTERVAL, 2000)
    }
    window.setError = error=> {
      this.setState(_.assign(this.state, {
          alert: error,
          autoReload: false
        }
      ));
    };

    window.addEventListener("unhandledrejection", function (err, promise) {
      debugger
    });

  },

  getInitialState: function () {
    return {
      autoReload: true,
      alert: null
    }
  },

  changeAutoReload: function (reload) {
    this.setState({autoReload: reload})
  },

  setAlert: function (err) {
    this.setState(_.assign(this.state, {alert: err}))
  },

  getAlert: function () {
    const {alert} = this.state;
    if (!alert) {
      return ""
    }
    return (
      <div className="alert alert-danger">
        <button type="button"
                className="close"
                onClick={(e)=> {
                  e.preventDefault();
                  this.setState(_.assign(this.state, {alert: null}))
                }}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        {alert.toString()}
      </div>
    )
  },

  render: function () {
    const {autoReload} = this.state;
    return (
      <div className="jesque-container">
        <div className="jesque-sidebar">
          <Navbar autoReload={autoReload} changeAutoReload={this.changeAutoReload}/>
        </div>
        <div className="jesque-content">
          {this.getAlert()}
          {this.renderCurrentRoute()}
        </div>
      </div>
    )
  },

  queueDetails: function (name) {
    return <QueueDetails name={name} params={this.getUrlParameters()} autoReload={this.state.autoReload} changeAutoReload={this.changeAutoReload} setAlert={this.setAlert}/>
  },

  home: function () {
    window.currentPath = HOME;
    return <HomeView autoReload={this.state.autoReload} changeAutoReload={this.changeAutoReload} setAlert={this.setAlert}/>;
  },

  failedJobs: function () {
    window.currentPath = JOB_FAILED;
    return <FailedList params={this.getUrlParameters()} autoReload={this.state.autoReload} changeAutoReload={this.changeAutoReload} setAlert={this.setAlert}/>;
  },

  jobsList: function () {
    window.currentPath = JOBS_LIST;
    return <JobsList params={this.getUrlParameters()} jobs={window.AppConfig.knownJobs} autoReload={this.state.autoReload} changeAutoReload={this.changeAutoReload}
                     setAlert={this.setAlert}/>;
  },

  jobsDetails: function (name) {
    window.currentPath = JOBS_LIST;
    return <JobDetails job={name} params={this.getUrlParameters()} autoReload={this.state.autoReload} changeAutoReload={this.changeAutoReload} setAlert={this.setAlert}/>;
  },

  enqueueJob: function () {
    window.currentPath = JOB_ENQUEUE;
    return <JobManual jobs={window.AppConfig.knownJobs} setAlert={this.setAlert}/>
  },

  notFound: function (path) {
    return (
      <div className="not-found">
        Page Not Found: {path}
      </div>);
  },

  triggers: function () {
    window.currentPath = JOB_TRIGGERS;
    return <Triggers autoReload={this.state.autoReload} changeAutoReload={this.changeAutoReload} setAlert={this.setAlert}/>
  },

  workerList: function () {
    window.currentPath = WORKER_LIST;
    return <WorkerList autoReload={this.state.autoReload} changeAutoReload={this.changeAutoReload} selectable={true} setAlert={this.setAlert}/>;
  },

  workerManual: function () {
    window.currentPath = WORKER_MANUAL;
    return <WorkerManual jobs={window.AppConfig.knownJobs} setAlert={this.setAlert}/>
  },

  getUrlParameters: function () {
    let search = window.location.hash || '';
    let qidx = search.indexOf('?');
    if (qidx === -1) {
      return;
    }
    search = search.substring(qidx + 1);
    return querystring.parse(search)
  },


});

ReactDom.render(<JesqueAdminApp history={false}/>, document.getElementById('jesque-admin-container'));
