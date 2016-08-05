import React from "react";
import ReactDom from "react-dom";
import Navbar from "./components/navbar/navbar";
import HomeView from "./components/home/home";
import QueueDetails from "./components/queues/details";
import FailedList from "./components/jobs/failed";
import {HOME, JOB_FAILED} from "./constants/paths";
const RouterMixin = require('react-mini-router').RouterMixin;

var JesqueAdminApp = React.createClass({
  mixins: [RouterMixin],

  routes: {
    '/': 'home',
    '/404': 'notFound',
    '/jobs/failed/:page': 'failedJobs',
    '/queues/:name': 'queueDetails',
    '/queues/:name/:page': 'queueDetails'
  },

  componentDidMount: function () {
    window.setError = function (error) {
      alert(error)
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

  queueDetails: (name, page) => {
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

  notFound: function (path) {
    return (
      <div className="not-found">
        Page Not Found: {path}
      </div>);
  },


});

ReactDom.render(<JesqueAdminApp history={false}/>, document.getElementById('jesque-admin-container'));
