import React from "react";
import ReactDom from "react-dom";
import Navbar from "./components/navbar/navbar";
import HomeView from "./components/home/home";
import QueueDetails from "./components/queues/details";
import FailedList from "./components/jobs/failed";
import {HOME, JOB_FAILED, JOBS_LIST, JOB_DELAYED, JOB_ENQUEUE, JOB_TRIGGERS} from "./constants/paths";
import JobsList from "./components/jobs/list";
import JobDetails from "./components/jobs/details";
import JobManual from "./components/jobs/manual";
import Triggers from "./components/jobs/triggers";
import DelayedList from "./components/jobs/delayed";

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
    '/jobs/delayed/:page': 'delayedJobs',
    '/jobs/failed/:page': 'failedJobs',
    '/jobs/:page': 'jobsList',
    '/jobs/details/:name/:page': 'jobsDetails',
  },

  componentDidMount: function () {
    window.setError = function (error) {
      alert(error)
    }

    window.doNavigate = function (linkInfo) {
      navigate(linkInfo.path)
    }
  },

  getInitialState: function () {
    return {autoReload: true}
  },

  changeAutoReload: function (reload) {
    this.setState({autoReload: reload})
  },

  render: function () {
    const {autoReload} = this.state;
    return (
      <div className="jesque-container">
        <div className="jesque-sidebar">
          <Navbar autoReload={autoReload} changeAutoReload={this.changeAutoReload}/>
        </div>
        <div className="jesque-content">
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

  delayedJobs: function (page) {
    window.currentPath = JOB_DELAYED;
    try {
      page = parseInt(page)
    } catch (ignore) {
      page = 1
    }

    return <DelayedList page={page} autoReload={this.state.autoReload} changeAutoReload={this.changeAutoReload}/>;
  },

  jobsList: function (page) {
    window.currentPath = JOBS_LIST;
    try {
      page = parseInt(page)
    } catch (ignore) {
      page = 1
    }
    return <JobsList page={page} autoReload={this.state.autoReload} changeAutoReload={this.changeAutoReload}/>;
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
    return <JobManual />
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


});

ReactDom.render(<JesqueAdminApp history={false}/>, document.getElementById('jesque-admin-container'));
