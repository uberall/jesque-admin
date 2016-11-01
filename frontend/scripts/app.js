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
import {assign} from "lodash";

const RouterMixin = require('react-mini-router').RouterMixin;
const navigate = require('react-mini-router').navigate;

var JesqueAdminApp = React.createClass({
  mixins: [RouterMixin],

  routes: {
    '/': 'home',
    '/404': 'notFound',
    '/queues/:name': 'queueDetails',
    '/queues/:name/:page': 'queueDetails',
    '/jobs/enqueue/': 'enqueueJob',
    '/jobs/triggers/': 'triggers',
    '/jobs/failed/:page': 'failedJobs',
    '/jobs/:page': 'jobsList',
    '/jobs/details/:name/:page': 'jobsDetails',
    '/workers': 'workerList',
    '/workers/start': 'workerManual',
  },

  componentDidMount: function () {
    window.setError = error=> {
      this.setState(assign(this.state, {
          alert: error,
          autoReload: false
        }
      ));
    };

    window.doNavigate = function (linkInfo) {
      navigate(linkInfo.path)
    }
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

  getAlert: function () {
    const {alert} = this.state;
    if (!alert) {
      return ""
    }
    return (
      <div className="alert alert-danger">
        <button type="button"
                className="close"
                data-dismiss="alert"
                aria-label="Close"
                onClick={(e)=> {
                  e.preventDefault();
                  this.setState(assign(this.state, {alert: null}))
                }}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        {JSON.stringify(alert)}
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

  queueDetails: function (name, page) {
    return <QueueDetails name={name} page={parseInt(page) || 1} autoReload={this.state.autoReload} changeAutoReload={this.changeAutoReload}/>
  },

  home: function () {
    window.currentPath = HOME;
    return <HomeView autoReload={this.state.autoReload} changeAutoReload={this.changeAutoReload}/>;
  },

  failedJobs: function (page) {
    window.currentPath = JOB_FAILED;
    try {
      page = parseInt(page)
    } catch (ignore) {
      page = 1
    }
    return <FailedList page={page} autoReload={this.state.autoReload} changeAutoReload={this.changeAutoReload}/>;
  },

  jobsList: function (page) {
    window.currentPath = JOBS_LIST;
    try {
      page = parseInt(page)
    } catch (ignore) {
      page = 1
    }
    return <JobsList page={page} jobs={window.AppConfig.knownJobs} autoReload={this.state.autoReload} changeAutoReload={this.changeAutoReload}/>;
  },

  jobsDetails: function (name, page) {
    window.currentPath = JOBS_LIST;
    try {
      page = parseInt(page)
    } catch (ignore) {
      page = 1
    }
    return <JobDetails job={name} page={page} autoReload={this.state.autoReload} changeAutoReload={this.changeAutoReload}/>;
  },

  enqueueJob: function () {
    window.currentPath = JOB_ENQUEUE;
    return <JobManual jobs={window.AppConfig.knownJobs}/>
  },

  notFound: function (path) {
    return (
      <div className="not-found">
        Page Not Found: {path}
      </div>);
  },

  triggers: function () {
    window.currentPath = JOB_TRIGGERS;
    return <Triggers autoReload={this.state.autoReload} changeAutoReload={this.changeAutoReload}/>
  },

  workerList: function () {
    window.currentPath = WORKER_LIST;
    return <WorkerList autoReload={this.state.autoReload} changeAutoReload={this.changeAutoReload} selectable={true}/>;
  },

  workerManual: function () {
    window.currentPath = WORKER_MANUAL;
    return <WorkerManual jobs={window.AppConfig.knownJobs}/>
  },


});

ReactDom.render(<JesqueAdminApp history={false}/>, document.getElementById('jesque-admin-container'));
